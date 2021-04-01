#!/bin/bash

echo "Downloading weather"

curl "https://forecast.weather.gov/product.php?site=NWS&issuedby=BOX&product=AFD&format=txt" -o weather.raw

awk -f weather.awk weather.raw > output.txt
awk -f weather_part2.awk weather.raw > clip2.txt

cat clip2.txt | tr '\n' ' ' | fold -s --width=50 >> output.txt

lp output.txt -o media=Custom.70x300mm -o cpi=18 -o lpi=10
