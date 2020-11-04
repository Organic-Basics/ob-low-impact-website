#!make
include .env
export $(shell sed 's/=.*//' .env)

.PHONY: help deploy

help:
	@echo "- help: show help"
	@echo "- deploy: build and deploy the project to Google App Engine."

deploy:
	yarn build && gcloud app deploy --project=ob-low-impact-website