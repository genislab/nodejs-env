#!/bin/bash -ex

set -e

DEPLOY_SERVERS=$DEPLOY_SERVERS

ALL_SERVERS=(${DEPLOY_SERVERS//,/ })
echo "ALL_SERVERS ${ALL_SERVERS}"

for server in "${ALL_SERVERS[@]}"
do
  echo "deploying to ${server}"
  ssh ubuntu@${server} 'sudo bash' < ./scripts/update_restart.sh
done
