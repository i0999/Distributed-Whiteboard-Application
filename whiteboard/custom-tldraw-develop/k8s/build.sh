#!/bin/bash
echo "Build images"
docker build --no-cache ./client -t tldraw-client:1.0.0
docker build --no-cache ./server -t tldraw-server:1.0.0 

# Verify if images are built
echo "Listing built images"
docker images

# Save image to tar file
echo "Saving images to tar files"
docker save tldraw-client:1.0.0 > tldraw-client.tar
docker save tldraw-server:1.0.0 > tldraw-server.tar

# Add images to local registry
echo "Importing images to local registry"
microk8s ctr image import tldraw-client.tar
microk8s ctr image import tldraw-server.tar
