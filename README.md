# Yeoman Docker Generator

This Yeoman Generator will add a dockerize project scaffolding to your project.

## Assumptions

* Your application lives in `./app`
* You are on `OSX`
* You are cool with `homebrew`
* Your Docker exec command is this shell script: `./app/exec`
  * sample `./app/exec`
```
#!/usr/bin/env bash
if [[ "$APP_ENV" -eq "DEV" ]]; then
  echo "dev mode, rebuild npm modules because we don't want to use osx compilations"
  npm install -s >/dev/null
  npm rebuild -s > /dev/null
  pm2 start process.dev.json && pm2 logs
else
  pm2 start process.json && pm2 logs
fi
```
* your docker app is a single web app with a memcached docker container connected to it
  * this can easily be modified after initial scaffolding by editing `docker-compose.tmpl`

## Usage

```
npm install -g yo generator-dockerize
yo dockerize
```

## Scaffolding Contents

* ./app/.rsyncignore
* ./app/exec
  * you will likely need to edit this to run your actual app
* .dockerignore
* .env
* dev
* dev.config.sh
* docker-compose.tmpl
  * this will be used to generate a per-developer docker-compose.yml, which should be added to .gitignore
  * the sync directory will be different depending on where developers clone the repo
* lib/docker.sh
* lib/libecho.sh
* lib/libinstall.sh
* Dockerfile

# Getting Started

1. run `yo dockerize` on your project
2. edit `./app/exec` to have proper app execute instructions
3. run `dev init`

The `dev` script will ensure that you have all the docker software and configuration needed to run and will run your app inside a docker container.
