# Setup Project Name
projName="vincent is afraid. - Source Code"

# Replace non human readable names with proper ones
sed -i -- 's/berriers@uwstout.edu/Seth Berrier/g' gourceLog.txt
sed -i -- 's/marquardtp0038@my.uwstout.edu/Patrick Marquardt/g' gourceLog.txt
sed -i -- 's/cerasanij7705@my.uwstout.edu/James Cerasani/g' gourceLog.txt
sed -i -- 's/hazeb4568@my.uwstout.edu/Brad Haze/g' gourceLog.txt
sed -i -- 's/hillaryv4658@uwstout.edu/Vanessa Hillary/g' gourceLog.txt
sed -i -- 's/36007002+TheOttery@users.noreply.github.com/Eric Ottery/g' gourceLog.txt

# Clean up the temporary files from sed
rm gourceLog.txt--
