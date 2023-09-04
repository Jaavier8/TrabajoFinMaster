#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

docker stop $(docker ps -a -q --filter ancestor=aries-cloudagent-run)
docker rm $(docker stop $(docker ps -a -q --filter ancestor=ghcr.io/timoglastra/acapy-development-webhook-server))

$SCRIPT_DIR/vonNetwork/manage down
$SCRIPT_DIR/indyTailsServer/manage down
