#!/bin/bash

echo what version is it, sir?
read VERSION

docker build -t nunada/lireddit:$VERSION .
docker push nunada/lireddit:$VERSION
ssh root@167.99.46.60 "docker pull nunada/lireddit:$VERSION && docker tag nunada/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"

echo version $VERSION deployed