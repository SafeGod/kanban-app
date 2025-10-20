#!/bin/bash

echo "🍃 Iniciando MongoDB en WSL2"
echo "============================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detener procesos previos
echo -e "${BLUE}Limpiando procesos previos...${NC}"
sudo pkill -9 mongod 2>/dev/null
sleep 2

# Limpiar archivos de bloqueo
echo -e "${BLUE}Limpiando archivos de bloqueo...${NC}"
sudo rm -f /data/db/mongod.lock 2>/dev/null
sudo rm -f /tmp/mongodb-27017.sock 2>/dev/null

# Crear y configurar directorios
echo -e "${BLUE}Configurando directorios...${NC}"
sudo mkdir -p /data/db
sudo mkdir -p /var/log/mongodb
sudo chown -R $(whoami):$(whoami) /data/db
sudo chown -R $(whoami):$(whoami) /var/log/mongodb
sudo chmod -R 755 /data/db
sudo chmod -R 755 /var/log/mongodb

# Iniciar MongoDB
echo -e "${BLUE}Iniciando MongoDB...${NC}"
nohup mongod --dbpath /data/db --logpath /var/log/mongodb/mongod.log --bind_ip 127.0.0.1 --port 27017 > /dev/null 2>&1 &

# Esperar a que inicie
echo -e "${BLUE}Esperando a que MongoDB inicie...${NC}"
sleep 5

# Verificar
if ps aux | grep -v grep | grep mongod > /dev/null; then
    echo -e "${GREEN}✓ MongoDB iniciado correctamente${NC}"
    echo ""
    echo "Verificando conexión..."
    if mongosh --eval "db.version()" --quiet 2>/dev/null; then
        echo -e "${GREEN}✓ Conexión exitosa a MongoDB${NC}"
        echo ""
        echo "MongoDB está corriendo en: mongodb://127.0.0.1:27017"
        echo ""
        echo "Comandos útiles:"
        echo "  - Ver logs: tail -f /var/log/mongodb/mongod.log"
        echo "  - Conectar: mongosh"
        echo "  - Detener: sudo pkill mongod"
    else
        echo -e "${RED}⚠ MongoDB está corriendo pero no responde aún${NC}"
        echo "Espera unos segundos más e intenta: mongosh"
    fi
else
    echo -e "${RED}✗ MongoDB no pudo iniciar${NC}"
    echo ""
    echo "Revisa los logs con:"
    echo "  tail -30 /var/log/mongodb/mongod.log"
    echo ""
    echo "O intenta iniciar en modo debug:"
    echo "  mongod --dbpath /data/db"
fi
