#!/bin/bash
cd /home/ec2-user/deployment/backend/src/api
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
node index.js > /home/ec2-user/deployment-$current_time.out 2>/home/ec2-user/deployment-$current_time.err &