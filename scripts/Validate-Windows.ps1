<#
.SYNOPSIS
    Script de validación para compilar el proyecto IntraMessenger en entornos Windows.
.DESCRIPTION
    Este script localiza MSBuild, restaura los paquetes NuGet basados en packages.config y
    compila la solución IntraMessenger.sln en configuración Release.
    Devuelve un código de salida distinto de cero si ocurre algún error.
#>

$ErrorActionPreference = "Stop"

Write-Host "Iniciando validación Windows para IntraMessenger..."

# 1. Localizar MSBuild
$msbuildPath = $null

# Intentar vswhere
$vswherePath = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vswherePath) {
    Write-Host "Ejecutando vswhere para localizar MSBuild..."
    $vswhereOutput = & $vswherePath -latest -requires Microsoft.Component.MSBuild -find MSBuild\Current\Bin\MSBuild.exe
    if (![string]::IsNullOrWhiteSpace($vswhereOutput) -and (Test-Path $vswhereOutput)) {
        $msbuildPath = $vswhereOutput
    }
}

# Fallback 1: Buscar en el PATH
if (-not $msbuildPath) {
    Write-Host "Buscando MSBuild en el PATH..."
    $msbuildCommand = Get-Command msbuild.exe -ErrorAction SilentlyContinue
    if ($msbuildCommand) {
        $msbuildPath = $msbuildCommand.Source
    }
}

if (-not $msbuildPath) {
    Write-Error "No se pudo localizar msbuild.exe. Asegúrate de tener instalado Visual Studio o Build Tools con MSBuild."
    [Environment]::Exit(1)
}

Write-Host "MSBuild localizado en: $msbuildPath"

# 2. Restaurar Paquetes y Compilar la Solución
$slnPath = Join-Path $PSScriptRoot "..\IntraMessenger.sln"

if (-not (Test-Path $slnPath)) {
    Write-Error "No se encontró el archivo de solución: $slnPath"
    [Environment]::Exit(1)
}

Write-Host "Restaurando paquetes y compilando la solución (Release)..."
& $msbuildPath $slnPath /p:Configuration=Release /t:Restore,Build /p:RestorePackagesConfig=true
$buildExitCode = $LASTEXITCODE

if ($buildExitCode -ne 0) {
    Write-Error "La compilación o restauración falló con el código de salida: $buildExitCode"
    [Environment]::Exit($buildExitCode)
}

Write-Host "Compilación exitosa."
[Environment]::Exit(0)
