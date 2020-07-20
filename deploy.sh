#!/bin/bash

/usr/bin/go run server.go -generate

/usr/bin/rsync -trzR \
  --delete \
  --progress \
  ./css/ ./favicon/ ./js/ ./pages/ \
  root@gudmundur.net:/usr/share/nginx/gudmundur.net/

/usr/bin/rsync -trz \
  ./nginx.conf root@gudmundur.net:/etc/nginx/sites-available/gudmundur.net

ssh root@gudmundur.net 'systemctl reload nginx'
