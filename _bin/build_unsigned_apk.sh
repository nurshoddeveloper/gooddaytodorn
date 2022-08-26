#!/bin/bash


react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/build/intermediates/assets/debug/index.android.bundle --assets-dest ./android/app/build/intermediates/res/merged/debug

cd android

#./gradlew clean

./gradlew assembleDebug

printf "\nget app-debug.apk file from android/app/build/outputs/apk\n\n"

