#!/bin/bash
# Requirements to run this
# wine
# npm
# mono-complete
# nuget

cd ..

# Install dependencies
npm install -g electron-installer-debian
npm install

# Create builds
echo Creating builds now
npm run build

# Create setup files
npm run setup:deb
npm run setup

# Creating zip files
npm run zip