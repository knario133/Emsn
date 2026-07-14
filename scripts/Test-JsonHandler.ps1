[CmdletBinding()]
param (
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl,

    [switch]$IgnoreCertificateErrors
)

$ErrorActionPreference = "Stop"

$testsPassed = 0
$testsFailed = 0

function Test-Condition {
    param (
        [string]$Description,
        [bool]$Condition
    )
    if ($Condition) {
        Write-Host "PASS: $Description" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host "FAIL: $Description" -ForegroundColor Red
        $script:testsFailed++
    }
}

function Test-JsonResponse {
    param (
        [System.Object]$Response,
        [int]$ExpectedStatus,
        [string]$ExpectedErrorCode = $null,
        [bool]$IsWebResponse = $false
    )

    $statusCode = 0
    $headers = $null
    $content = ""

    if ($IsWebResponse) {
        $statusCode = [int]$Response.StatusCode
        $headers = $Response.Headers

        $reader = $null
        try {
            $reader = New-Object System.IO.StreamReader($Response.GetResponseStream())
            $content = $reader.ReadToEnd()
        } finally {
            if ($null -ne $reader) {
                $reader.Close()
            }
        }
    } else {
        $statusCode = $Response.StatusCode
        $headers = $Response.Headers
        $content = $Response.Content
    }

    Test-Condition "Status Code es $ExpectedStatus" ($statusCode -eq $ExpectedStatus)

    if ($null -ne $headers["Content-Type"]) {
        Test-Condition "Content-Type contiene application/json" ($headers["Content-Type"] -match "application/json")
    } else {
        Test-Condition "Content-Type contiene application/json" $false
    }

    $cacheControl = $headers["Cache-Control"]
    if ($null -ne $cacheControl) {
        Test-Condition "Cache-Control contiene no-store" ($cacheControl -match "no-store")
    } else {
        Test-Condition "Cache-Control contiene no-store" $false
    }

    $json = $null
    try {
        $json = $content | ConvertFrom-Json
        Test-Condition "Es un JSON valido" ($null -ne $json)
    } catch {
        Test-Condition "Es un JSON valido" $false
        return
    }

    if ($ExpectedStatus -eq 200) {
        Test-Condition "ok es true" ($json.ok -eq $true)
    } else {
        Test-Condition "ok es false" ($json.ok -eq $false)
        if ($null -ne $ExpectedErrorCode) {
            Test-Condition "error.code es $ExpectedErrorCode" ($json.error.code -eq $ExpectedErrorCode)
        }
    }

    Test-Condition "Existe correlationId en JSON" (-not [string]::IsNullOrEmpty($json.correlationId))

    $correlationHeader = $headers["X-Correlation-ID"]
    Test-Condition "Existe X-Correlation-ID en cabeceras" (-not [string]::IsNullOrEmpty($correlationHeader))
    if (-not [string]::IsNullOrEmpty($correlationHeader)) {
        Test-Condition "Ambos correlation ID coinciden" ($json.correlationId -eq $correlationHeader)
    }

    Test-Condition "No contiene StackTrace" (-not ($content -match "StackTrace"))
    Test-Condition "No contiene System.Exception" (-not ($content -match "System.Exception"))
    Test-Condition "No contiene InnerException" (-not ($content -match "InnerException"))
    Test-Condition "No contiene rutas fisicas (C:\)" (-not ($content -match "C:\\"))
    Test-Condition "No contiene nombres internos de clases (JsonHandlerBase)" (-not ($content -match "JsonHandlerBase"))
}

$url = $BaseUrl.TrimEnd("/") + "/Handlers/Diagnostics.ashx"

Write-Host "Iniciando pruebas para: $url" -ForegroundColor Cyan

$originalCallback = [System.Net.ServicePointManager]::ServerCertificateValidationCallback
if ($IgnoreCertificateErrors) {
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
}

try {
    # 1. POST con application/json retorna 200
    Write-Host "`n--- Prueba 1: POST application/json ---"
    try {
        $response1 = Invoke-WebRequest -Uri $url -Method Post -ContentType "application/json" -Body "{}" -UseBasicParsing -UseDefaultCredentials
        Test-JsonResponse -Response $response1 -ExpectedStatus 200
    } catch {
        Test-Condition "Peticion completada sin excepcion HTTP" $false
    }

    # 2. POST application/json; charset=utf-8 retorna 200
    Write-Host "`n--- Prueba 2: POST application/json; charset=utf-8 ---"
    try {
        $response2 = Invoke-WebRequest -Uri $url -Method Post -ContentType "application/json; charset=utf-8" -Body "{}" -UseBasicParsing -UseDefaultCredentials
        Test-JsonResponse -Response $response2 -ExpectedStatus 200
    } catch {
        Test-Condition "Peticion completada sin excepcion HTTP" $false
    }

    # 3. GET retorna 405 y cabecera Allow
    Write-Host "`n--- Prueba 3: GET retorna 405 ---"
    try {
        $response3 = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -UseDefaultCredentials
        Test-Condition "GET retorna excepcion HTTP" $false
    } catch [System.Net.WebException] {
        $exResponse = $_.Exception.Response
        if ($null -ne $exResponse) {
            Test-JsonResponse -Response $exResponse -ExpectedStatus 405 -ExpectedErrorCode "method_not_allowed" -IsWebResponse $true
            $headers = $exResponse.Headers
            Test-Condition "Contiene cabecera Allow: POST" ($headers["Allow"] -match "POST")
        } else {
            Test-Condition "Obtenida respuesta HTTP" $false
        }
    }

    # 4. POST text/plain retorna 415
    Write-Host "`n--- Prueba 4: POST text/plain retorna 415 ---"
    try {
        $response4 = Invoke-WebRequest -Uri $url -Method Post -ContentType "text/plain" -Body "test" -UseBasicParsing -UseDefaultCredentials
        Test-Condition "POST text/plain retorna excepcion HTTP" $false
    } catch [System.Net.WebException] {
        $exResponse = $_.Exception.Response
        if ($null -ne $exResponse) {
            Test-JsonResponse -Response $exResponse -ExpectedStatus 415 -ExpectedErrorCode "unsupported_media_type" -IsWebResponse $true
        } else {
            Test-Condition "Obtenida respuesta HTTP" $false
        }
    }

    # 5. POST sin Content-Type retorna 415
    Write-Host "`n--- Prueba 5: POST sin Content-Type retorna 415 ---"
    try {
        $request = [System.Net.WebRequest]::Create($url)
        $request.Method = "POST"
        $request.ContentLength = 0
        $request.UseDefaultCredentials = $true
        $response5 = $request.GetResponse()
        Test-Condition "POST sin Content-Type retorna excepcion HTTP" $false
    } catch [System.Net.WebException] {
        $exResponse = $_.Exception.Response
        if ($null -ne $exResponse) {
            Test-JsonResponse -Response $exResponse -ExpectedStatus 415 -ExpectedErrorCode "unsupported_media_type" -IsWebResponse $true
        } else {
            Test-Condition "Obtenida respuesta HTTP" $false
        }
    }

} finally {
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = $originalCallback
}

Write-Host "`n=== Resumen ===" -ForegroundColor Cyan
Write-Host "Aprobadas: $testsPassed" -ForegroundColor Green

if ($testsFailed -gt 0) {
    Write-Host "Fallidas:  $testsFailed" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Fallidas:  $testsFailed" -ForegroundColor Green
    exit 0
}
