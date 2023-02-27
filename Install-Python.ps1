# Download Python 3.10.9 64 bit when it is NOT installed already and install it

# Check if Python is installed
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    Write-Host "Python is already installed"
    exit 0
}

# Download Python 3.10.9 64 bit
$pythonUrl = "https://www.python.org/ftp/python/3.10.9/python-3.10.9-amd64.exe"
$pythonFile = "python-3.10.9-amd64.exe"
$pythonPath = Join-Path $env:TEMP $pythonFile
if (!(Test-Path $pythonPath)) {
    Write-Host "Downloading Python 3.10.9 64 bit"
    Invoke-WebRequest -Uri $pythonUrl -OutFile $pythonPath
}

# Install Python 3.10.9 64 bit
Write-Host "Installing Python 3.10.9 64 bit"
Start-Process -FilePath $pythonPath -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1" -Wait

# Check if Python is installed
$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
    Write-Host "Python is installed"
    exit 0
}