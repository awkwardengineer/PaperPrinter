from bs4 import BeautifulSoup
import urllib
import re

##the NWS all text weather report
raw_html = urllib.urlopen("http://forecast.weather.gov/product.php?site=NWS&issuedby=BOX&product=AFD&format=txt")

soup = BeautifulSoup(raw_html, "html.parser")

#navigating the DOM tree. the NWS website uses a tag called <pre> </pre>
raw_text = soup.pre.get_text()

#within the <pre></pre> tags, the weather report itself is broken up by double ampersands
blocks = re.split('&&', raw_text)

#removing word wraps
#the regex looks for \n that has at least 40 non-\n characters prior to it.
final_string = re.sub(r'(?<=[^\n]{40})\n',' ', blocks[0])

weather = open("weather.txt", w)
weather.write(final_string)
weather.close()

print(final_string)

