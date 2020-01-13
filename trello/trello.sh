#!/bin/bash


# WD="~/PaperPrinter/trello"
echo "Checking trello..."



source ~/trashlist/env/bin/activate



gtd -b "Sam and Abby" show cards -l "Sam's Focus List" --fields name > trello.txt
awk '/\+/{next} !/name/ {print "[ ]"$0} /name/{print "---FOCUS LIST--- "}' trello.txt > output.txt 
echo " " >> output.txt


gtd -b "Sam and Abby" show cards -l "Sam's in progress" --fields name > trello.txt
awk '/\+/{next} !/name/ {print "[ ]"$0} /name/{print "---IN PROGRESS---"}' trello.txt >> output.txt 
echo " " >> output.txt


gtd -b "Notes" show cards -l "Schedule" --fields name > trello.txt
awk '/\+/{next} !/name/ {print } /name/{print "---SCHEDULE---"}' trello.txt >> output.txt 
echo " " >> output.txt


gtd -b "Notes" show cards -l "Weather" --fields name > trello.txt
awk '/\+/{next} !/name/ {print} /name/{print "---WEATHER---"}' trello.txt >> output.txt 
echo " " >> output.txt


gtd -b "Notes" show cards -l "To Print" --fields name > trello.txt
awk '/\+/{next} !/name/ {print "[ ]"$0} /name/{print "---NOTES---"}' trello.txt >> output.txt 
echo " " >> output.txt



awk '!/Fetching cards/' output.txt | tr -d '|' | awk '{$1=$1;print}' | fold -s --width=32 > trello.txt

lp trello.txt -o media=Custom.70x300mm -o cpi=12 -o lpi=7
