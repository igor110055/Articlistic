#!/bin/bash
cd /home/ec2-user/deployment/Frontend
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
serve -n build -l 3001 > /home/ec2-user/deploymentlogs/frontenddeployment-$current_time.out 2>/home/ec2-user/deploymentlogs/frontenddeployment-$current_time.err &