#!/usr/bin/env bash
#
# Description: Run tests against the docker image
#
if [ $# -lt 3 ]; then
  echo "Usage: $0 version image_name external_port (vm_name)"
  exit 1
fi

start_time="$(date +%s)"

version=$1
image_name=$2
external_port=$3
vm_name=$4
internal_port=<%= internalPort %>
wd=$(pwd);

function eko {
    echo "[ $0 $version $image_name $external_port ] $1"
}
function printTimeTaken {
    elapsed="$(($(date +%s)-start_time))"
    eko "time taken: $elapsed seconds"
}
function finish {
  eko "docker kill $container_id";
  docker kill $container_id
  printTimeTaken
  if [ "$1" == "1" ]; then
    eko "failed"
    exit 1
  fi
}

eko "making sure we have built the image"
docker images | grep $image_name | grep $version
if [ $? -ne 0 ]; then
    docker build -t $image_name:$version .
fi

eko "removing any old instances"

docker ps -a | grep $image_name
if [[ $? == 0 ]]; then
  docker rm -f $(docker ps -a | grep $image_name | awk '{print $1;}')
fi

eko "docker run"
docker run -p $external_port:$port_internal $image_name:$version &
if [ $? -ne 0 ]; then
    finish 1
fi

echo "waiting for app to boot up in image..."
sleep <%= appBootTime %>
docker ps
echo "testing..."

container_id=$(docker ps | grep $image_name | grep $version | awk '{print $1;}');

if [[ -n "$vm_name" ]];then
  ip_address=$(docker-machine ip $vm_name)
else
  # if we are running directly on Linux, we won't pass a vm_name into this script
  # so just use the same host IP
  ip_address=0.0.0.0
fi

## assuming our app exposes an http service:
eko "test curl: curl -v http://$ip_address:$port_external/"
curl -v http://$ip_address:$port_external/
if [ $? -ne 0 ]; then
  finish 1
fi

cd app;

# TODO: put your test script runner here:
# example:
#eko "gulp testimage --host=$ip_address --port=$port_external"
#gulp testimage --host=$ip_address --port=$port_external
finish $?
