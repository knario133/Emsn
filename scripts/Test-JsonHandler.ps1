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
        Write-Host "✅ PASS: $Description" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host "❌ FAIL: $Description" -ForegroundColor Red
        $script:testsFailed++
    }
}

$url = $BaseUrl.TrimEnd("/") + "/Handlers/Diagnostics.ashx"

Write-Host "Iniciando pruebas para: $url" -ForegroundColor Cyan

# Configure certificate bypass if requested
$originalCallback = [System.Net.ServicePointManager]::ServerCertificateValidationCallback
if ($IgnoreCertificateErrors) {
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
}

try {
    # 1. POST con application/json retorna 200
    Write-Host "`n--- Prueba 1: POST application/json ---"
    $response1 = $null
    $json1 = $null
    try {
        $response1 = Invoke-WebRequest -Uri $url -Method Post -ContentType "application/json" -Body "{}" -UseBasicParsing
        Test-Condition "Status Code es 200" ($response1.StatusCode -eq 200)

        $json1 = $response1.Content | ConvertFrom-Json
        Test-Condition "Es un JSON válido (obtenido objeto)" ($null -ne $json1)
        Test-Condition "ok es true" ($json1.ok -eq $true)
        Test-Condition "Existe correlationId en JSON" (-not [string]::IsNullOrEmpty($json1.correlationId))
        Test-Condition "Existe X-Correlation-ID en cabeceras" ($response1.Headers.ContainsKey("X-Correlation-ID"))
        if ($response1.Headers.ContainsKey("X-Correlation-ID")) {
            Test-Condition "Ambos correlation ID coinciden" ($json1.correlationId -eq $response1.Headers["X-Correlation-ID"])
        }

        $cacheControl = $response1.Headers["Cache-Control"]
        Test-Condition "Cache-Control contiene no-store" ($cacheControl -match "no-store")

        $content = $response1.Content
        Test-Condition "No contiene StackTrace" (-not ($content -match "StackTrace"))
        Test-Condition "No contiene System.Exception" (-not ($content -match "System.Exception"))
        Test-Condition "No contiene rutas físicas" (-not ($content -match "C:\\"))

    } catch {
        Test-Condition "Status Code es 200" $false
        Write-Host $_.Exception.Message -ForegroundColor Red
    }

    # 2. POST application/json; charset=utf-8 retorna 200
    Write-Host "`n--- Prueba 2: POST application/json; charset=utf-8 ---"
    try {
        $response2 = Invoke-WebRequest -Uri $url -Method Post -ContentType "application/json; charset=utf-8" -Body "{}" -UseBasicParsing
        Test-Condition "Status Code es 200 con charset=utf-8" ($response2.StatusCode -eq 200)
    } catch {
        Test-Condition "Status Code es 200 con charset=utf-8" $false
    }

    # 3. GET retorna 405 y cabecera Allow
    Write-Host "`n--- Prueba 3: GET retorna 405 ---"
    try {
        $response3 = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing
        Test-Condition "GET retorna 405" $false # Debería fallar e ir al catch
    } catch [System.Net.WebException] {
        $exResponse = $_.Exception.Response
        if ($null -ne $exResponse) {
            Test-Condition "Status Code es 405" (([int]$exResponse.StatusCode) -eq 405)
            $headers = $exResponse.Headers
            Test-Condition "Contiene cabecera Allow: POST" ($headers["Allow"] -match "POST")

            $reader = New-Object System.IO.StreamReader($exResponse.GetResponseStream())
            $content = $reader.ReadToEnd()
            $json = $content | ConvertFrom-Json
            Test-Condition "Respuesta de error 405 es JSON y tiene correlationId" ($null -ne $json.correlationId)
        } else {
            Test-Condition "GET retorna 405" $false
        }
    }

    # 4. POST text/plain retorna 415
    Write-Host "`n--- Prueba 4: POST text/plain retorna 415 ---"
    try {
        $response4 = Invoke-WebRequest -Uri $url -Method Post -ContentType "text/plain" -Body "test" -UseBasicParsing
        Test-Condition "POST text/plain retorna 415" $false
    } catch [System.Net.WebException] {
        $exResponse = $_.Exception.Response
        if ($null -ne $exResponse) {
            Test-Condition "Status Code es 415" (([int]$exResponse.StatusCode) -eq 415)
        } else {
            Test-Condition "POST text/plain retorna 415" $false
        }
    }

    # 5. POST sin Content-Type retorna 415
    Write-Host "`n--- Prueba 5: POST sin Content-Type retorna 415 ---"
    try {
        $request = [System.Net.WebRequest]::Create($url)
        $request.Method = "POST"
        $request.ContentLength = 0
        # No asignamos ContentType
        $response5 = $request.GetResponse()
        Test-Condition "POST sin Content-Type retorna 415" $false
    } catch [System.Net.WebException] {
        $exResponse = $_.Exception.Response
        if ($null -ne $exResponse) {
            Test-Condition "Status Code es 415 para falta de Content-Type" (([int]$exResponse.StatusCode) -eq 415)
        } else {
            Test-Condition "POST sin Content-Type retorna 415" $false
        }
    }

} finally {
    # Restore certificate validation callback
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = $originalCallback
}

Write-Host "`n=== Resumen ===" -ForegroundColor Cyan
Write-Host "Aprobadas: $testsPassed" -ForegroundColor Green
Write-Host "Fallidas:  $testsFailed" -ForegroundColor ($testsFailed -gt 0 ? "Red" : "Green")

if ($testsFailed -gt 0) {
    exit 1
} else {
    exit 0
}
