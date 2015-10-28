# Yeoman Docker Generator

This Yeoman Generator will add a Docker scaffolding to your project, including Dockerfile, docker-compose and a dev script to simplify management of Docker.
The `dev` script automates solutions to problems with running docker on OSX.

## Assumptions

* Your application lives in `./app`
* You are on `OSX`
* You are cool with `homebrew`

## Usage

```
npm install -g yo generator-dockerize
# cd to your project directory
yo dockerize
```

# Getting Started

1. run `yo dockerize` on your project
2. edit `./app/exec` to have proper app execute instructions
3. edit `docker-compose.tmpl` if needed
4. edit the Dockerfile as needed to construct your app
5. edit `dev.init.sh` if needed to run any host setup before docker image is created
5. run `dev init`

The `dev` script will ensure that you have all the docker software and configuration needed to run and will run your app inside a docker container.

# Testing Your Docker Image / App
You can run `dev test` to test either the running instance or to run and test a new instance.
Before running `dev test`, you should update test.sh (at the bottom) to add a test runner execution command.

## Scaffolding Contents

* ./app/.rsyncignore
* ./app/exec
  * edit this after running `yo dockerize` to have instructions for running your app
  * whatever you run here should be a foreground non-exiting process
* .dockerignore
* .env
* dev
* dev.config
* dev.init.sh
* docker-compose.tmpl
  * this will be used to generate a per-developer docker-compose.yml, which should be added to .gitignore
  * the sync directory will be different depending on where developers clone the repo
* Dockerfile
  * you will need to update this file with your app installation instructions

## Dev Toolkit

run `dev help` to get a list of options on the `dev` script

## Updates

To get updates to the dockerized dev toolkit after you run the generator, simply run `dev update`. This will fetch the latest dev toolkit from github and replace it in your project. Then you can use any new automated fixes for docker that are in the latest release.

## File Watch Support with Docker-Rsync

This toolkit starts up docker-rsync along with the docker VM as a way of keeping your host OS code up-to-date inside the VM->Container. This is the gist of how that works:

![Running](https://github.com/atomantic/generator-dockerize/raw/master/docs/docker-rsync.png)

# HISTORY

## 1.7.0
  - `dev purge` is now interactive (allows you to choose which things you wish to purge/uninstall)

## 1.6.1
  - fix `dev shell` to work even if your instance fails to run (still does `docker run -i -t $APP_NAME_LOCAL bash` instead of using `exec` while assuming running instance)

## 1.6.0
  - now including rsync mounting in `dev init`. Will provide diagram later :)

## 1.5.0
  - new `dev.init.sh` script to customize a pre-setup script for the project. This is to address an issue we found with docker-rsync deleting our node_modules inside the VM. We needed to do `npm install` on the host before building the docker image and rsyncing. The Dockerfile then does `npm rebuild` to recompile packages for the Docker OS

## 1.4.0
  - `dev update` will fetch the latest `dev` toolkit and replace it in your project

## 1.3.0
  - create test runner script for `dev test`
  - cleanup `dev` docs and commands

## 1.2.4
  - shorter default loads
  - now including sample app by default

## 1.2.2
  - add sample index.html app using python SimpleHTTPServer
  - remove memcached image link

## 1.2.1
  - remove old test `dev` methods

## 1.2.0
  - add `dev vpn` to fix OSX routing table after disconnecting from Cisco AnyConnect VPN client
