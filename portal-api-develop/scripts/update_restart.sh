#!/bin/bash
set -e

rm -rf /opt/iem-services/
mkdir -p /opt/iem-services/
aws s3 cp s3://$BUCKET_NAME/* /opt/iem-services/ --recursive

source /root/.nvm/nvm.sh

cd /opt/iem-services/
echo "Running npm install"
npm install
npm start &