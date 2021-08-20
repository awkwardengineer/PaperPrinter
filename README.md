# PaperPrinter
Experiments using my receipt printer to print stuff.  

#Stuff that needs to be installed.  

I had the following things that I either installed already or downloaded on a Ubunutu Linux 16.04  
  
-Python 2.7  
-BeautifulSoup (python library to process HTML)
-ImageMagick (command line utility already part of Ubunutu distro)
-CUPS (common unix printing system... may have already been part of Ubunutu distro)

Installing CUPS and the DYMO label printer drivers
sudo apt-get update
sudo apt-get install cups cups-client printer-driver-dymo


#Basic Theory of Operation  
  
In short, a shell script '''paper.sh''' calls some python scripts to scrape the weather report and a comic strip. The text file can be sent directly to the CUPS printer via the command line printing commands, but the images need some formatting. In short it thinks the receipt printer paper I'm using is 104 inches long, so it pads the images with abou 98 inches of blank white space. The printer is smart enough not to print the blank space, so only the appropriate portion of paper advances.
