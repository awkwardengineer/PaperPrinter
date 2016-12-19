#!/bin/bash
echo Sam\'s Weather Printing Script

python ~/PaperPrinter/weather.py

lp -d Super_DYMO_4XL -o media=Banner -o cpi=18 -o lpi=12 ~/PaperPrinter/weather.txt

python ~/PaperPrinter/calvin.py

convert ~/PaperPrinter/calvin -gravity East -background white -resize x191 ~/PaperPrinter/output1
convert ~/PaperPrinter/output1 -gravity East -background white -extent 10000 ~/PaperPrinter/output2

lp -d Super_DYMO_4XL -o media=Banner ~/PaperPrinter/output2


