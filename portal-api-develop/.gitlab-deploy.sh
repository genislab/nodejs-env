#!/bin/bash

#Get servers list
set -f
string=$DEPLOY_SERVERS
array=(${string//,/ })

#Iterate servers for deploy and pull last commit
for i in "${!array[@]}"; do
  echo "Deploying information to EC2 and Gitlab"
  echo "Deploy project on server ${array[i]}"
  ssh -i key.pem ubuntu@${array[i]} "cd  /var/www/merci_deploy_api && git pull origin master"
done