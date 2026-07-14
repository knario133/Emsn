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

function Invoke-RawHttpRequest {
    param (
        [string]$Url,
        [string]$Method,
        [string]$ContentType = $null,
        [string]$Body = $null
    )

    $request = [System.Net.WebRequest]::Create($Url)
    $request.Method = $Method
    $request.UseDefaultCredentials = $true

    if ($null -ne $ContentType) {
        $request.ContentType = $ContentType
    }

    if ($null -ne $Body -and $Method -ne "GET") {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
        $request.ContentLength = $bytes.Length
        $stream = $request.GetRequestStream()
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
    } elseif ($Method -eq "POST") {
        $request.ContentLength = 0
    }

    $response = $null
    $statusCode = 0
    $headers = $null
    $content = ""

    try {
        $response = $request.GetResponse()
    } catch [System.Net.WebException] {
        $response = $_.Exception.Response
    }

    if ($null -ne $response) {
        $statusCode = [int]$response.StatusCode
        $headers = $response.Headers

        $reader = $null
        try {
            $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
            $content = $reader.ReadToEnd()
        } finally {
            if ($null -ne $reader) {
                $reader.Close()
            }
            $response.Close()
        }
    }

    return [PSCustomObject]@{
        StatusCode = $statusCode
        Headers = $headers
        Content = $content
    }
}

function Test-JsonResponse {
    param (
        [PSCustomObject]$Response,
        [int]$ExpectedStatus,
        [string]$ExpectedErrorCode = $null
    )

    $statusCode = $Response.StatusCode
    $headers = $Response.Headers
    $content = $Response.Content

    Test-Condition "Status Code es $ExpectedStatus" ($statusCode -eq $ExpectedStatus)

    if ($null -ne $headers -and $null -ne $headers["Content-Type"]) {
        Test-Condition "Content-Type contiene application/json" ($headers["Content-Type"] -match "application/json")
    } else {
        Test-Condition "Content-Type contiene application/json" $false
    }

    if ($null -ne $headers) {
        $cacheControl = $headers["Cache-Control"]
        Test-Condition "Cache-Control contiene no-store" ($null -ne $cacheControl -and $cacheControl -match "no-store")
    } else {
        Test-Condition "Cache-Control contiene no-store" $false
    }

    $json = $null
    try {
        $json = $content | ConvertFrom-Json
        Test-Condition "Es un JSON valido" ($null -ne $json)
    } catch {
        Test-Condition "Es un JSON valido" $false
        Write-Host "Diagnostic: failed to parse JSON. Content length: $($content.Length)" -ForegroundColor Yellow
        Write-Host "--- Content Start ---" -ForegroundColor DarkGray
        Write-Host $content -ForegroundColor DarkGray
        Write-Host "--- Content End ---" -ForegroundColor DarkGray
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

    if ($null -ne $headers) {
        $correlationHeader = $headers["X-Correlation-ID"]
        Test-Condition "Existe X-Correlation-ID en cabeceras" (-not [string]::IsNullOrEmpty($correlationHeader))
        if (-not [string]::IsNullOrEmpty($correlationHeader)) {
            Test-Condition "Ambos correlation ID coinciden" ($json.correlationId -eq $correlationHeader)
        }
    } else {
        Test-Condition "Existe X-Correlation-ID en cabeceras" $false
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
    $response1 = Invoke-RawHttpRequest -Url $url -Method "POST" -ContentType "application/json" -Body "{}"
    Test-JsonResponse -Response $response1 -ExpectedStatus 200

    # 2. POST application/json; charset=utf-8 retorna 200
    Write-Host "`n--- Prueba 2: POST application/json; charset=utf-8 ---"
    $response2 = Invoke-RawHttpRequest -Url $url -Method "POST" -ContentType "application/json; charset=utf-8" -Body "{}"
    Test-JsonResponse -Response $response2 -ExpectedStatus 200

    # 3. GET retorna 405 y cabecera Allow
    Write-Host "`n--- Prueba 3: GET retorna 405 ---"
    $response3 = Invoke-RawHttpRequest -Url $url -Method "GET"
    Test-JsonResponse -Response $response3 -ExpectedStatus 405 -ExpectedErrorCode "method_not_allowed"
    if ($null -ne $response3.Headers) {
        Test-Condition "Contiene cabecera Allow: POST" ($response3.Headers["Allow"] -match "POST")
    } else {
        Test-Condition "Contiene cabecera Allow: POST" $false
    }

    # 4. POST text/plain retorna 415
    Write-Host "`n--- Prueba 4: POST text/plain retorna 415 ---"
    $response4 = Invoke-RawHttpRequest -Url $url -Method "POST" -ContentType "text/plain" -Body "test"
    Test-JsonResponse -Response $response4 -ExpectedStatus 415 -ExpectedErrorCode "unsupported_media_type"

    # 5. POST sin Content-Type retorna 415
    Write-Host "`n--- Prueba 5: POST sin Content-Type retorna 415 ---"
    $response5 = Invoke-RawHttpRequest -Url $url -Method "POST" -Body "{}"
    Test-JsonResponse -Response $response5 -ExpectedStatus 415 -ExpectedErrorCode "unsupported_media_type"

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
