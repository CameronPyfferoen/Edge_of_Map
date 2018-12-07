# Setup Project Name
projName="Edge of the Map - Source Code"

function fix {
  sed -i -- "s/$1/$2/g" gourceLog.txt
}

# Replace non human readable names with proper ones
fix "|CozyD|" "|Cozy Dumas|"
fix "|Dumas|" "|Cozy Dumas|"
fix "|Michael-lange|" "|Michael Lange|"
fix "|Michael-Lange|" "|Michael Lange|"
fix "|allenderind|" "|Chris Allender|"
fix "|AMyersZero|" "|Alex Meyers|"
