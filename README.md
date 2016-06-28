[![Known Vulnerabilities](https://snyk.io/test/npm/generator-dockerize/badge.svg)](https://snyk.io/test/npm/generator-dockerize)

# Yeoman Docker Generator

This Yeoman Generator will add a Docker scaffolding to your project, including Dockerfile, docker-compose and a dev script to simplify management of Docker and app runtime.
The `dev` script automates getting your application up and running, starting, stopping, and other misc. missing docker commands.

## Assumptions

* Your application lives in a subfolder of your git repo (e.g. `./app`)
* You are on `OSX`

## Usage

if you are totally new to nodejs, you can install via `./dev init`.
This will install nvm (node version manager via Homebrew, then install node `4.4.6` and run `npm install -g yo git://github.com/atomantic/generator-dockerize.git` for you).

You can run the `dev init` script from curl like so:
```
curl https://raw.githubusercontent.com/atomantic/generator-dockerize/master/dev | sh -s init
```

If you are already using node and have npm, just run this:

```
npm install -g yo git://github.com/atomantic/generator-dockerize.git
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

## Contributing
Please contribute! We welcome all pull-requests. The current setup makes certain assumptions that we probably don't always want. TODO:
* add question on whether you use a particular option for build, then drop the appropriate config file (or no file at all)
* ask if you need a custom `dev.init.sh` script and handle that, removing it if you don't
* ask what docker-compose configs should be added
* ask what exec start command should be dropped in

We could make this whole thing work from yo instead of requiring users to manually adjust their files after scaffolding :)

# HISTORY

## 3.0.0
  - Only using Native Docker for Mac/Win
  - removed all `VirtualBox` management
  - removed all `VPN` tomfoolery
  - remove all `RSYNC` ugliness (now native)
  - remove `./dev insecure` -- now set insecure registries in advanced settings in native docker app
  - removed `VM_NAME`, `VM_CREATE_TIME`, `RSYNC` options from dev.config

## 2.2.0
  - Native Docker for Mac/Win is now supported with `export $DOCKER_NATIVE=true` -- this is temporary until this becomes an open standard method for running docker.

## 2.0.0
  - Remove all cisco AnyConnect VPN code (now use `brew install openconnect` then  `sudo openconnect --user=$VPNUSER $VPNHOST` instead of Cisco Client). If this solution is still interesting to you, see here: https://github.com/atomantic/generator-dockerize/commit/a79c26ceea4bacd0906f0f32dbb9b1751feb528e

## 1.8.0
  - Added VPN support
  - Run `dev vpn_setup` before connecting to VPN to create docker-machine VM
  - Run `dev vpn_env` to get the environment variables you need to access VM over VPN

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
