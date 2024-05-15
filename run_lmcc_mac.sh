#!/bin/bash

# Get the directory of the current script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to check and install Python
install_python() {
  if ! command -v python3 &> /dev/null; then
    echo "Python3 could not be found. Installing Python3..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
      sudo apt update
      sudo apt install -y python3 python3-pip
    elif [[ "$OSTYPE" == "darwin"* ]]; then
      # Check if Homebrew is installed, install if not
      if ! command -v brew &> /dev/null; then
        echo "Homebrew could not be found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      fi
      brew install python3
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]]; then
      echo "Please install Python3 manually on this OS."
      exit 1
    else
      echo "Unknown OS type. Please install Python3 manually."
      exit 1
    fi
  else
    echo "Python3 is already installed."
  fi
}

# Function to install Python dependencies
install_python_dependencies() {
  echo "Installing Python dependencies..."
  pip3 install -r requirements.txt
}

# Check and install Python
install_python

# Install Python dependencies
install_python_dependencies

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Start the server
# echo "Starting the server with npm start..."
# npm start &

# Start the FastAPI server
echo "Starting the FastAPI server with uvicorn..."
uvicorn server.server:app --host 0.0.0.0 --port 8000 --reload
