# Remove actions after a certain date (currently December SGX)
cat gourceLog.txt | awk -F\| '$1<=1544637600' > gourceLog.temp
mv gourceLog.temp gourceLog.txt

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
