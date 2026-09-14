#!/bin/bash
# À lancer UNE FOIS sur le VPS, avec sudo :
#   scp deploy/setup-nginx.sh warren@93.93.117.124:~/
#   ssh warren@93.93.117.124
#   CERTBOT_EMAIL=vous@exemple.fr sudo -E bash ~/setup-nginx.sh
#
# Prérequis : little-cars.walautao.fr pointe déjà vers ce serveur (fait).
# Le site tourne sous PM2 sur 127.0.0.1:3020 (voir ecosystem.config.cjs).
# Une fois Certbot passé, ne plus réécrire le vhost : il contient ses blocs 443.
set -euo pipefail

DOMAIN="${DOMAIN:-little-cars.walautao.fr}"
PORT=3020
SITE="little-cars"

if [ "$EUID" -ne 0 ]; then
  echo "✗ Lancer avec sudo : CERTBOT_EMAIL=vous@exemple.fr sudo -E bash setup-nginx.sh"
  exit 1
fi
: "${CERTBOT_EMAIL:?Renseigner CERTBOT_EMAIL=vous@exemple.fr}"

echo "→ Vhost ${DOMAIN}"
cat > "/etc/nginx/sites-available/${SITE}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    client_max_body_size 1m;

    gzip on;
    gzip_min_length 1024;
    gzip_types text/css application/javascript application/json image/svg+xml text/plain application/xml;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
EOF

ln -sf "/etc/nginx/sites-available/${SITE}" "/etc/nginx/sites-enabled/${SITE}"
nginx -t
systemctl reload nginx

echo "→ Certificat TLS"
certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${CERTBOT_EMAIL}" --redirect

echo "✓ https://${DOMAIN} → 127.0.0.1:${PORT}"
