#!/bin/bash

# Customize for specific game
dirName="edge-of-the-map"
pkgName="Edge of the Map"

# Move to dir and rename it
cd "./packaged/${dirName}/"
mv win64 "${pkgName}"

# Delete previous archive
test "../${pkgName}-win64.zip" & rm "../${pkgName}-win64.zip"

# Create archive
zip -r9 "../${pkgName}-win64.zip" "./${pkgName}"

# Name back and move back
mv "${pkgName}" win64
cd ../..
