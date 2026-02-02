#! /bin/bash
#
# This script was created by taichums.
# The purpose of this is to ensure both services start accordingly, so that nothing breaks.
# This script depends on docker compose being installed, alongside trmnlp working accordingly.

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH."
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if docker compose is available (new syntax) or docker-compose (old syntax)
if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed or not in PATH."
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

if [ -d ".git" ]; then
    if [ -f "docker-compose.yml" ] && grep -q "trmnl-plugin" docker-compose.yml; then
        docker compose up -d; ./bin/trmnlp serve
        
        # Cleanup after trmnlp serve finishes
        echo "Cleaning up..."
        docker compose down
        
        # Remove trmnlp images if they exist
        if docker images | grep -q "trmnl/trmnlp"; then
            echo "Removing trmnlp images..."
            docker rmi $(docker images "trmnl/trmnlp" -q) 2>/dev/null || true
        fi
        
        # Remove project images if they exist
        if docker images | grep -q "trmnl-frank-energie-plugin-trmnl-plugin"; then
            echo "Removing project images..."
            docker rmi $(docker images "trmnl-frank-energie-plugin-trmnl-plugin" -q) 2>/dev/null || true
        fi
        
        echo "Cleanup complete."
    else
        echo "Not in frank-energie-plugin repository. Exiting."
        exit 1
    fi
fi