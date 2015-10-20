#!/usr/bin/env bash

# put anything you need to run before the docker image copies in your files
# typically, in a node world, for example, you might do this:

##################
# NODE.js Example
#################
# cd app
# npm install
# cd ..

# then, our Dockerfile will do "npm rebuild"
# and docker-rsync won't purge our node_modules inside the VM
