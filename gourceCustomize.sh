# Setup Project Name
projName="Edge of the Map - Source Code"

function fix {
  sed -i -- "s/$1/$2/g" gourceLog.txt
}

# Replace non human readable names with proper ones
fix "|Berrier|" "|Seth Berrier|"
fix "|waterse1080|" "|Eliot Waters|"
fix "|CameronPyfferoen|" "|Cameron Pyfferoen|"
fix "|Nguyenh0417|" "|Hunter Nguyen|"
