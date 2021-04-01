#import urllib
#import urllib2
import urllib.request as urllib2
from bs4 import BeautifulSoup
import os

url = 'https://www.gocomics.com/calvinandhobbes/'
user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'
headers = {'User-Agent': user_agent}

req = urllib2.Request(url, None, headers)
response = urllib2.urlopen(req)
raw_page = response.read()

soup = BeautifulSoup(raw_page, 'html.parser')

#mypic = soup.find("picture", {"class":"item-comic-image"}).find("img")
mypic = soup.find("picture", class_="gc-card__image--cropped-strip").find("img")
imgurl = mypic["src"]

req = urllib2.Request(imgurl, None, headers)
pic = urllib2.urlopen(req).read()

filepath =  os.path.expanduser('~/PaperPrinter/calvin')
calvin = open(filepath, 'wb')
calvin.write(pic)
calvin.close()


