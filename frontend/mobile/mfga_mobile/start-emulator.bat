@echo off
set EMULATOR_NAME=Pixel_5

echo Starting Android emulator: %EMULATOR_NAME%
emulator -avd %EMULATOR_NAME%
pause
