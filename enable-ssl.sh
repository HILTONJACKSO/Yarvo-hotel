#!/bin/bash
set -e

echo "==> Checking DNS for yarvohotel.com..."
CURRENT_IP=$(dig +short yarvohotel.com | tail -n1)
echo "Current resolved IP: $CURRENT_IP (Target VPS: 72.61.15.24)"

if [ "$CURRENT_IP" != "72.61.15.24" ]; then
  echo ""
  echo "⚠️  DNS has not updated yet ($CURRENT_IP != 72.61.15.24)."
  echo "Please change the A Record for @ in Hostinger to 72.61.15.24 and wait a few minutes."
  exit 1
fi

echo "==> Requesting SSL certificate from Let's Encrypt..."
certbot --nginx -d yarvohotel.com -d www.yarvohotel.com --non-interactive --agree-tos -m admin@yarvohotel.com --redirect
systemctl reload nginx

echo ""
echo "===================================================="
echo " ✅ SSL Enabled! https://yarvohotel.com is live!"
echo "===================================================="
