#!/bin/bash

/usr/bin/rsync -trz \
  --exclude=.gitignore \
  --exclude=deploy.sh \
  --exclude=LICENSE \
  --exclude=README.md \
  --exclude=server.go \
  ./ root@165.227.4.101:/usr/share/nginx/gudmundur.net/