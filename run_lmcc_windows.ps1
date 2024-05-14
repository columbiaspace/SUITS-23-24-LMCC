# Function to check and install Python
function Install-Python {
    if (-not (Get-Command python3 -ErrorAction SilentlyContinue)) {
        Write-Output "Python3 could not be found. Installing Python3..."
        Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.9.5/python-3.9.5-amd64.exe -OutFile python-installer.exe
        Start-Process -FilePath python-installer.exe -ArgumentList '/quiet InstallAllUsers=1 PrependPath=1' -Wait
        Remove-Item python-installer.exe
    } else {
        Write-Output "Python3 is already installed."
    }
}

# Function to install Python dependencies
function Install-PythonDependencies {
    Write-Output "Installing Python dependencies..."
    pip3 install -r requirements.txt
}

# Function to check and install Docker
function Install-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Output "Docker could not be found. Installing Docker..."
        Invoke-WebRequest -Uri https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe -OutFile docker-installer.exe
        Start-Process -FilePath docker-installer.exe -ArgumentList '/quiet' -Wait
        Remove-Item docker-installer.exe
    } else {
        Write-Output "Docker is already installed."
    }
}

# Function to run Docker container
function Run-DockerContainer {
    Write-Output "Running Docker container..."
    docker build -t tss_2024 .
    docker run -it -p 14141:14141 --name tss_2024 tss_2024
}

# Check and install Python
Install-Python

# Install Python dependencies
Install-PythonDependencies

# Check and install Docker
Install-Docker

# Run Docker container
Start-Job -ScriptBlock {
    Run-DockerContainer
}

# Installing npm dependencies
Write-Output "Installing npm dependencies..."
npm install

# Starting the server
Write-Output "Starting the server with npm start..."
Start-Process -NoNewWindow npm start

# Starting the FastAPI server
Write-Output "Starting the FastAPI server with uvicorn..."
Start-Process -NoNewWindow uvicorn server:app --host 0.0.0.0 --port 8000 --reload
