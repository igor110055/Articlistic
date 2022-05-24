#!/bin/bash

#get instance id
VALUE=$(ec2-metadata -i)

#running to get environment tags
DATA=$(aws ec2 describe-tags --filters Name=resource-id,Values=${VALUE:13} Name=key,Values=Environment)

#getting from tags object and storing in NODE_ENV
export NODE_ENV=$(echo $DATA | jq '.Tags[0].Value')

#setting the NODE_ENV after reading
#echo -e "NODE_ENV=$NODE_ENV" > /etc/environment

cd /home/ec2-user/deployment/backend/src/api
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
node index.js > /home/ec2-user/deploymentlogs/deployment-$current_time.out 2>/home/ec2-user/deploymentlogs/deployment-$current_time.err &
