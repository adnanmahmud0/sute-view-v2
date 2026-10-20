#!/usr/bin/env bash
service postgresql start
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE suit_view;" || true

# Allow password auth from Windows host
PG_HBA=$(find /etc/postgresql/ -name pg_hba.conf | head -n 1)
if [ -n "$PG_HBA" ]; then
  echo "host all all 0.0.0.0/0 md5" >> "$PG_HBA"
  echo "host all all ::/0 md5" >> "$PG_HBA"
fi

PG_CONF=$(find /etc/postgresql/ -name postgresql.conf | head -n 1)
if [ -n "$PG_CONF" ]; then
  sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "$PG_CONF"
fi

service postgresql restart
echo "PostgreSQL setup complete!"
