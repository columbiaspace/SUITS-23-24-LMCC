# Check and install Python if not installed
function Install-Python {
    if (-not (Get-Command python3 -ErrorAction SilentlyContinue)) {
        Write-Output "Python3 could not be found. Installing Python3..."
        Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.9.5/python-3.9.5-amd64.exe" -OutFile "python-installer.exe"
        Start-Process -FilePath "python-installer.exe" -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1" -Wait
        Remove-Item -Path "python-installer.exe" -Force

        # Verify installation
        if (-not (Get-Command python3 -ErrorAction SilentlyContinue)) {
            Write-Output "Python3 installation failed. Please install Python3 manually."
            exit 1
        }
    } else {
        Write-Output "Python3 is already installed."
    }
}

# Install Python dependencies
function Install-PythonDependencies {
    Write-Output "Installing Python dependencies..."
    python3 -m pip install --upgrade pip
    python3 -m pip install -r requirements.txt
}

# Install npm dependencies
function Install-NpmDependencies {
    Write-Output "Installing npm dependencies..."
    npm install
}

# Start the servers
function Start-Servers {
    Write-Output "Starting the server with npm start..."
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"

    Write-Output "Starting the FastAPI server with uvicorn..."
    Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn server:app --host 0.0.0.0 --port 8000 --reload"
}

# Execute functions
Install-Python
Install-PythonDependencies
Install-NpmDependencies
Start-Servers
