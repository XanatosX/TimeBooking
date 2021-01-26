@echo off
set myDirectory=%~dp0..
echo I'm working in %myDirectory%
cd %myDirectory%\
call npm install


echo Creating builds now!
call npm run build

echo Creating installers!
call npm run setup

echo Creating zips!
call npm run zip