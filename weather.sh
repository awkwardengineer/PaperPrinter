#!/bin/bash
echo Sam\'s Weather Printing Script

python ~/PaperPrinter/weather.py

lp -d Super_DYMO_4XL -o media=Banner -o cpi=18 -o lpi=12 ~/PaperPrinter/weather.txt
