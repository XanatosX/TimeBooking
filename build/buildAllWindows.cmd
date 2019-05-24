@echo off
set myDirectory=%~dp0..
set buildDirectory=builds/
echo I'm working in %myDirectory%
echo This script will install some npm packages as globals
echo It will load all the dependencies for the project as well
echo The following will be installed as global:
echo electron-packager
set /P DUMMY=press any key if this is okay, otherwise press ctrl + c to abort
call npm install -g electron-packager
cd %myDirectory%
call npm install
mkdir %buildDirectory%
echo using %buildDirectory% to save the builds
call electron-packager . TimeBooking --out=%buildDirectory% --platform=win32  --arch=x64  --ignore="/build" --ignore=%buildDirectory%
call electron-packager . TimeBooking --out=%buildDirectory% --platform=win32  --arch=ia32 --ignore="/build" --ignore=%buildDirectory%
call electron-packager . TimeBooking --out=%buildDirectory% --platform=linux  --arch=x64  --ignore="/build" --ignore=%buildDirectory%
call electron-packager . TimeBooking --out=%buildDirectory% --platform=darwin --arch=x64  --ignore="/build" --ignore=%buildDirectory%

