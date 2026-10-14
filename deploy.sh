#!/bin/bash
set -e

echo "============================================"
echo " Yarvo Hotel PMS — VPS Deploy Script"
echo "============================================"

# ── 1. Clone repo ──────────────────────────────
echo ""
echo "==> [1/7] Cloning repository..."
if [ -d "/opt/yarvohotel" ]; then
  echo "  Repo already exists, pulling latest..."
  cd /opt/yarvohotel
  git pull origin main
else
  git clone https://github.com/HILTONJACKSO/Yarvo-hotel.git /opt/yarvohotel
  cd /opt/yarvohotel
fi

echo ""
echo "==> [2/7] Checking Docker..."
docker --version
docker compose version

# ── 3. Create .env.production if not present ────
echo ""
echo "==> [3/7] Setting up environment file..."
if [ ! -f "/opt/yarvohotel/.env.production" ]; then
  cp /opt/yarvohotel/.env.production.example /opt/yarvohotel/.env.production
  echo ""
  echo "  ⚠️  IMPORTANT: Edit /opt/yarvohotel/.env.production before starting!"
  echo "  Run: nano /opt/yarvohotel/.env.production"
  echo "  Then re-run this script."
  exit 0
else
  echo "  .env.production found ✅"
fi

# ── 4. Update nginx config with domain ──────────
echo ""
echo "==> [4/7] Reading domain from .env.production..."
DOMAIN=$(grep '^DOMAIN=' /opt/yarvohotel/.env.production | cut -d'=' -f2 | tr -d ' ')
if [ -z "$DOMAIN" ]; then
  echo "  ❌ DOMAIN not set in .env.production — please set it and re-run."
  exit 1
fi
echo "  Domain: $DOMAIN"
sed -i "s/YOUR_DOMAIN.com/$DOMAIN/g" /opt/yarvohotel/nginx/conf.d/yarvo.conf

# ── 5. Issue SSL certificates ────────────────────
echo ""
echo "==> [5/7] Checking SSL certificates..."
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "  Issuing SSL certificates for $DOMAIN..."
  # Stop nginx if running (frees port 80 for certbot standalone)
  systemctl stop nginx 2>/dev/null || true
  certbot certonly --standalone --non-interactive --agree-tos \
    --email "$(grep '^ADMIN_EMAIL=' /opt/yarvohotel/.env.production | cut -d'=' -f2)" \
    -d "$DOMAIN" -d "www.$DOMAIN" -d "api.$DOMAIN"
  echo "  SSL certificates issued ✅"
else
  echo "  SSL certificates already exist ✅"
fi

# ── 6. Build and start containers ───────────────
echo ""
echo "==> [6/7] Building and starting containers..."
cd /opt/yarvohotel
docker compose -f docker-compose.prod.yml --env-file .env.production build --parallel
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --remove-orphans

# ── 7. Run database migrations ──────────────────
echo ""
echo "==> [7/7] Waiting for database and running migrations..."
sleep 15

# Run prisma migrate deploy inside api container
docker compose -f docker-compose.prod.yml --env-file .env.production exec api \
  sh -c "cd /app && npx prisma migrate deploy --schema=../../packages/database/prisma/schema.prisma" || \
  echo "  (Migrations may have already run)"

# ── Done ─────────────────────────────────────────
echo ""
echo "============================================"
echo " ✅ Yarvo Hotel PMS is deployed!"
echo "============================================"
echo ""
docker compose -f docker-compose.prod.yml ps
echo ""
echo " 🌐 Site:   https://$DOMAIN"
echo " 🔌 API:    https://api.$DOMAIN"
echo ""
