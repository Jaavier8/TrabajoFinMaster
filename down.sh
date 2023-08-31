#!/bin/bash

docker stop $(docker ps -a -q --filter ancestor=aries-cloudagent-run)
docker stop $(docker ps -a -q --filter ancestor=ghcr.io/timoglastra/acapy-development-webhook-server)

tmux new-session -d -s vonnetwork '~/OneDrive/Escritorio/TFM/von-network/manage down'
tmux new-session -d -s tailsserver '~/OneDrive/Escritorio/TFM/indy-tails-server/docker/manage down'
