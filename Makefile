.PHONY: serve login push

PWD := $(shell pwd)

serve:
	@ docker run \
		-p 4567:4567 \
		-v "$(PWD)/TRMNL":/plugin:z \
		trmnl/trmnlp serve

login:
	@ docker run \
		-it \
		-v "$(PWD)/TRMNL":/plugin:z \
		trmnl/trmnlp login

push:
	@ docker run \
		-v "$(PWD)/TRMNL":/plugin:z \
		trmnl/trmnlp push

.DEFAULT_GOAL := serve
