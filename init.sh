#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

$SCRIPT_DIR/vonNetwork/manage up -d
$SCRIPT_DIR/indyTailsServer/manage up
docker run -p 1080:1080 -d --name webhook ghcr.io/timoglastra/acapy-development-webhook-server

sleep 60

curl -X POST -H "Content-Type: application/json" -d "{\"role\":\"ENDORSER\",\"alias\":null,\"did\":null,\"seed\":\"uFQbs70HJ4v85EODhcJl3xN9YqtrpVnT\"}" "http://localhost:9000/register"
curl -X POST -H "Content-Type: application/json" -d "{\"role\":\"ENDORSER\",\"alias\":null,\"did\":null,\"seed\":\"Kz4eN6cHxGpR3wMjQnT2vWuYz5A8sBfE\"}" "http://localhost:9000/register"
curl -X POST -H "Content-Type: application/json" -d "{\"role\":\"ENDORSER\",\"alias\":null,\"did\":null,\"seed\":\"Pd7rV0tZy3HkU6mDjSgXqAbEf1CwI9oN\"}" "http://localhost:9000/register"

log_line=$(docker logs indytailsserver-ngrok-tails-server-1 | grep "started tunnel")
url=$(echo $log_line | grep -o -P '(?<=url=)[^ ]+')

BACKGROUND=yes CONTAINER_NAME="police" PORTS="5000:5000 10000:10000" $SCRIPT_DIR/acapyAgent/run_docker start --inbound-transport http 0.0.0.0 10000 --outbound-transport http -e http://host.docker.internal:10000 --genesis-url http://host.docker.internal:9000/genesis --webhook-url http://host.docker.internal:1080 --admin 0.0.0.0 5000 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name police --wallet-key policesecret --auto-provision -l police --auto-accept-requests --seed uFQbs70HJ4v85EODhcJl3xN9YqtrpVnT --tails-server-base-url "$url"
BACKGROUND=yes CONTAINER_NAME="academy" PORTS="5001:5001 10001:10001" $SCRIPT_DIR/acapyAgent/run_docker start --inbound-transport http 0.0.0.0 10001 --outbound-transport http -e http://host.docker.internal:10001 --genesis-url http://host.docker.internal:9000/genesis --webhook-url http://host.docker.internal:1080 --admin 0.0.0.0 5001 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name academy --wallet-key academysecret --auto-provision -l academy --auto-accept-requests --seed Kz4eN6cHxGpR3wMjQnT2vWuYz5A8sBfE --tails-server-base-url "$url"
BACKGROUND=yes CONTAINER_NAME="university" PORTS="5002:5002 10002:10002" $SCRIPT_DIR/acapyAgent/run_docker start --inbound-transport http 0.0.0.0 10002 --outbound-transport http -e http://host.docker.internal:10002 --genesis-url http://host.docker.internal:9000/genesis --webhook-url http://host.docker.internal:1080 --admin 0.0.0.0 5002 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name university --wallet-key unisecret --auto-provision -l university --auto-accept-requests --seed Pd7rV0tZy3HkU6mDjSgXqAbEf1CwI9oN --tails-server-base-url "$url"
BACKGROUND=yes CONTAINER_NAME="holder" PORTS="7000:7000 11000:11000" $SCRIPT_DIR/acapyAgent/run_docker start --inbound-transport http 0.0.0.0 11000 --outbound-transport http -e http://host.docker.internal:11000 --genesis-url http://host.docker.internal:9000/genesis --webhook-url http://host.docker.internal:1080 --admin 0.0.0.0 7000 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name holder --wallet-key holdersecret --auto-provision -l holder --auto-accept-invites --tails-server-base-url "$url"
BACKGROUND=yes CONTAINER_NAME="verifier" PORTS="7070:7070 11010:11010" $SCRIPT_DIR/acapyAgent/run_docker start --inbound-transport http 0.0.0.0 11010 --outbound-transport http -e http://host.docker.internal:11010 --genesis-url http://host.docker.internal:9000/genesis --webhook-url http://host.docker.internal:1080 --admin 0.0.0.0 7070 --admin-insecure-mode --auto-ping-connection --wallet-type indy --wallet-name verifier --wallet-key verifiersecret --auto-provision -l verifier --auto-accept-requests --tails-server-base-url "$url"

sleep 30

curl -X POST -H "Content-Type: application/json" -d "{\"attributes\":[\"firstname\",\"lastname\",\"dateofbirth\",\"idnumber\"],\"schema_name\":\"passport\",\"schema_version\":\"0.1\"}" "http://localhost:5000/schemas"
curl -X POST -H "Content-Type: application/json" -d "{\"attributes\":[\"language\",\"languageid\",\"score\"],\"schema_name\":\"certificate\",\"schema_version\":\"0.1\"}" "http://localhost:5001/schemas"
curl -X POST -H "Content-Type: application/json" -d "{\"attributes\":[\"degree\",\"degreeid\",\"school\",\"schoolid\",\"finalgrade\"],\"schema_name\":\"degree\",\"schema_version\":\"0.1\"}" "http://localhost:5002/schemas"

sleep 10

curl -X POST -H "Content-Type: application/json" -d "{\"revocation_registry_size\":1000,\"schema_id\":\"PxvKxvhH1ypT5fjnstLwPH:2:passport:0.1\",\"support_revocation\":true,\"tag\":\"passport\"}" "http://localhost:5000/credential-definitions"
curl -X POST -H "Content-Type: application/json" -d "{\"revocation_registry_size\":1000,\"schema_id\":\"DA5Tgk2xpQbZG1D6uuVYsb:2:certificate:0.1\",\"support_revocation\":true,\"tag\":\"certificate\"}" "http://localhost:5001/credential-definitions"
curl -X POST -H "Content-Type: application/json" -d "{\"revocation_registry_size\":1000,\"schema_id\":\"71Fsr9SzB1pawqUJnVjmMz:2:degree:0.1\",\"support_revocation\":true,\"tag\":\"degree\"}" "http://localhost:5002/credential-definitions"

