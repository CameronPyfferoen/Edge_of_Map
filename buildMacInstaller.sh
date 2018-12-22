#!/bin/bash

appName="Edge of the Map"     # Desired name of app
appPkgName="edge-of-the-map"  # Name of packaged mac app (w/o .app)

# Since create-dmg does not override, be sure to delete previous DMG
test -f "packaged/${appName}-macOS.dmg" && rm "packaged/${appName}-macOS.dmg"

# Create the DMG
create-dmg \
  --volname "${appName}" \
  --volicon "assets/images/Misc/icon.icns" \
  --background "assets/images/Misc/background.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "${appPkgName}.app" 170 190 \
  --hide-extension "${appPkgName}.app" \
  --app-drop-link 633 185 \
  "packaged/${appName}-macOS.dmg" \
  "packaged/${appPkgName}/osx64/${appPkgName}.app"
