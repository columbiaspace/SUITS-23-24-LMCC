# Get the directory of the current script
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Function to check and install Python
function Install-Python {
    if (-not (Get-Command python3 -ErrorAction SilentlyContinue)) {
        Write-Output "Python3 could not be found. Installing Python3..."
        if ($IsLinux) {
            sudo apt update
            sudo apt install -y python3 python3-pip
        } elseif ($IsMacOS) {
            # Check if Homebrew is installed, install if not
            if (-not (Get-Command brew -ErrorAction SilentlyContinue)) {
                Write-Output "Homebrew could not be found. Installing Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            }
            brew install python3
        } elseif ($IsWindows) {
            Write-Output "Please install Python3 manually on Windows from https://www.python.org/downloads/"
            exit 1
        } else {
            Write-Output "Unknown OS type. Please install Python3 manually."
            exit 1
        }
    } else {
        Write-Output "Python3 is already installed."
    }
}

# Function to install Python dependencies
function Install-PythonDependencies {
    Write-Output "Installing Python dependencies..."
    pip3 install -r "$SCRIPT_DIR\requirements.txt"
}

# Check and install Python
Install-Python

# Install Python dependencies
Install-PythonDependencies

# Install npm dependencies
Write-Output "Installing npm dependencies..."
npm install

# Start the server
Write-Output "Starting the server with npm start..."
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"

# Start the FastAPI server
Write-Output "Starting the FastAPI server with uvicorn..."
Start-Process -NoNewWindow -FilePath "uvicorn" -ArgumentList "server.server:app --host 0.0.0.0 --port 8000 --reload"
