#!/bin/bash

tmux new-session -d -s vonnetwork '~/OneDrive/Escritorio/TFM/von-network/manage up'
tmux new-session -d -s tailsserver '~/OneDrive/Escritorio/TFM/indy-tails-server/docker/manage up'

sleep 60

tmux new-session -d -s registerpolice 'curl -X POST -H "Content-Type: application/json" -d "{\"role\":\"ENDORSER\",\"alias\":null,\"did\":null,\"seed\":\"uFQbs70HJ4v85EODhcJl3xN9YqtrpVnT\"}" "http://localhost:9000/register"'
tmux new-session -d -s registeracademy 'curl -X POST -H "Content-Type: application/json" -d "{\"role\":\"ENDORSER\",\"alias\":null,\"did\":null,\"seed\":\"Kz4eN6cHxGpR3wMjQnT2vWuYz5A8sBfE\"}" "http://localhost:9000/register"'
tmux new-session -d -s registeruniversity 'curl -X POST -H "Content-Type: application/json" -d "{\"role\":\"ENDORSER\",\"alias\":null,\"did\":null,\"seed\":\"Pd7rV0tZy3HkU6mDjSgXqAbEf1CwI9oN\"}" "http://localhost:9000/register"'

log_line=$(docker logs docker-ngrok-tails-server-1 | grep "started tunnel")
url=$(echo $log_line | grep -o -P '(?<=url=)[^ ]+')

tmux new-session -d -s police 'PORTS="5000:5000 10000:10000" ~/OneDrive/Escritorio/TFM/aries-cloudagent-python/scripts/run_docker start --inbound-transport http 0.0.0.0 10000 --outbound-transport http -e http://host.docker.internal:10000 --genesis-url http://host.docker.internal:9000/genesis --admin 0.0.0.0 5000 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name test --wallet-key 1234 --auto-provision -l police --auto-accept-requests --seed uFQbs70HJ4v85EODhcJl3xN9YqtrpVnT --tails-server-base-url '"$url"''
tmux new-session -d -s academy 'PORTS="5001:5001 10001:10001" ~/OneDrive/Escritorio/TFM/aries-cloudagent-python/scripts/run_docker start --inbound-transport http 0.0.0.0 10001 --outbound-transport http -e http://host.docker.internal:10001 --genesis-url http://host.docker.internal:9000/genesis --admin 0.0.0.0 5001 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name test --wallet-key 1234 --auto-provision -l academy --auto-accept-requests --seed Kz4eN6cHxGpR3wMjQnT2vWuYz5A8sBfE --tails-server-base-url '"$url"''
tmux new-session -d -s university 'PORTS="5002:5002 10002:10002" ~/OneDrive/Escritorio/TFM/aries-cloudagent-python/scripts/run_docker start --inbound-transport http 0.0.0.0 10002 --outbound-transport http -e http://host.docker.internal:10002 --genesis-url http://host.docker.internal:9000/genesis --admin 0.0.0.0 5002 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name test --wallet-key 1234 --auto-provision -l university --auto-accept-requests --seed Pd7rV0tZy3HkU6mDjSgXqAbEf1CwI9oN --tails-server-base-url '"$url"''
tmux new-session -d -s holder 'PORTS="7000:7000 11000:11000" ~/OneDrive/Escritorio/TFM/aries-cloudagent-python/scripts/run_docker start --inbound-transport http 0.0.0.0 11000 --outbound-transport http -e http://host.docker.internal:11000 --genesis-url http://host.docker.internal:9000/genesis --admin 0.0.0.0 7000 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name test --wallet-key 1234 --auto-provision -l holder --auto-accept-invites --tails-server-base-url '"$url"''
tmux new-session -d -s verifier 'PORTS="7070:7070 11010:11010" ~/OneDrive/Escritorio/TFM/aries-cloudagent-python/scripts/run_docker start --inbound-transport http 0.0.0.0 11010 --outbound-transport http -e http://host.docker.internal:11010 --genesis-url http://host.docker.internal:9000/genesis --admin 0.0.0.0 7070 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name test --wallet-key 1234 --auto-provision -l verifier --auto-accept-requests --tails-server-base-url '"$url"''

sleep 30

tmux new-session -d -s createpoliceschema 'curl -X POST -H "Content-Type: application/json" -d "{\"attributes\":[\"firstname\",\"lastname\",\"age\"],\"schema_name\":\"passport\",\"schema_version\":\"0.1\"}" "http://localhost:5000/schemas"'
tmux new-session -d -s createacademyschema 'curl -X POST -H "Content-Type: application/json" -d "{\"attributes\":[\"language\",\"score\"],\"schema_name\":\"certificate\",\"schema_version\":\"0.1\"}" "http://localhost:5001/schemas"'

sleep 10

tmux new-session -d -s createpolicecredential 'curl -X POST -H "Content-Type: application/json" -d "{\"revocation_registry_size\":1000,\"schema_id\":\"PxvKxvhH1ypT5fjnstLwPH:2:passport:0.1\",\"support_revocation\":true,\"tag\":\"passport\"}" "http://localhost:5000/credential-definitions"'
tmux new-session -d -s createacademycredential 'curl -X POST -H "Content-Type: application/json" -d "{\"revocation_registry_size\":1000,\"schema_id\":\"DA5Tgk2xpQbZG1D6uuVYsb:2:certificate:0.1\",\"support_revocation\":true,\"tag\":\"certificate\"}" "http://localhost:5001/credential-definitions"'
