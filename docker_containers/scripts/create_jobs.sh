#!/bin/bash
echo "Creating bootstrap Oracle job"
docker exec -it chainlink_node5 bash -c 'chmod +x chainlink_login.sh; chmod +x chainlink_delete_job.sh; ./chainlink_login.sh; ./chainlink_delete_job.sh; chainlink jobs create "/home/root/job.toml";exit'
echo "---------------------------------------"

count=4
for i in $(seq $count); do
	echo "Creating job on Oracle $i"
    node="chainlink_node$i"
    docker exec -it chainlink_node$i bash -c 'chmod +x chainlink_login.sh; chmod +x chainlink_delete_job.sh; ./chainlink_login.sh; ./chainlink_delete_job.sh; chainlink jobs create "/home/root/job.toml";exit'
    echo "---------------------------------------"
done