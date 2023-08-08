#!/bin/bash

tmux new-session -d -s vonnetwork '~/OneDrive/Escritorio/TFM/von-network/manage up'
tmux new-session -d -s tailsserver '~/OneDrive/Escritorio/TFM/indy-tails-server/docker/manage up'

sleep 30

tmux new-session -d -s registerpolice 'curl -X POST -H "Content-Type: application/json" -d "{\"role\":\"ENDORSER\",\"alias\":null,\"did\":null,\"seed\":\"uFQbs70HJ4v85EODhcJl3xN9YqtrpVnT\"}" "http://localhost:9000/register"'

log_line=$(docker logs docker-ngrok-tails-server-1 | grep "started tunnel")
url=$(echo $log_line | grep -o -P '(?<=url=)[^ ]+')

tmux new-session -d -s police 'PORTS="5000:5000 10000:10000" ~/OneDrive/Escritorio/TFM/aries-cloudagent-python/scripts/run_docker start --inbound-transport http 0.0.0.0 10000 --outbound-transport http -e http://host.docker.internal:10000 --genesis-url http://host.docker.internal:9000/genesis --admin 0.0.0.0 5000 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name test --wallet-key 1234 --auto-provision -l police --auto-accept-requests --seed uFQbs70HJ4v85EODhcJl3xN9YqtrpVnT --tails-server-base-url '"$url"''
tmux new-session -d -s holder 'PORTS="7000:7000 11000:11000" ~/OneDrive/Escritorio/TFM/aries-cloudagent-python/scripts/run_docker start --inbound-transport http 0.0.0.0 11000 --outbound-transport http -e http://host.docker.internal:11000 --genesis-url http://host.docker.internal:9000/genesis --admin 0.0.0.0 7000 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name test --wallet-key 1234 --auto-provision -l holder --auto-accept-invites --tails-server-base-url '"$url"''

