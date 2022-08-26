@echo off

set EMULATOR="Pixel_2_API_28_Clean"

if "%1" == "4.4" (
    set EMULATOR="Nexus_4_API_19"
)
if "%1" == "5.1" (
    set EMULATOR="Nexus_4_API_22"
)
if "%1" == "6" (
    set EMULATOR="Nexus_5X_API_23"
)
if "%1" == "7.1" (
    set EMULATOR="Nexus_5X_API_25"
)
if "%1" == "8" (
    set EMULATOR="Pixel_2_API_26"
)
if "%1" == "8.1" (
    set EMULATOR="Pixel_2_API_27_Clean"
)
if "%1" == "9" (
    set EMULATOR="Pixel_2_API_28"
)
if "%1" == "9_32" (
    set EMULATOR="Pixel_2_API_28_x32"
)
if "%1" == "9_64" (
    set EMULATOR="Pixel_2_API_28_x64"
)

echo starting %EMULATOR%
rem echo %ANDROID_HOME%\tools\emulator.exe @"%EMULATOR%"

%ANDROID_HOME%\tools\emulator.exe @%EMULATOR%


rem %ANDROID_HOME%\tools\emulator.exe @"Pixel_2_API_28_Clean"
rem C:\Users\Andrew\AppData\Local\Android\Sdk\tools\emulator.exe -avd "Pixel_2_API_28_Clean"
