all: parcours.png

%.png: %.mermaid
	../node_modules/.bin/mmdc --width 1280 --height 960 -i $< -o $@

