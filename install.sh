#!/bin/bash

echo "🎯 Instalación de Kanban Board"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js instalado: $(node --version)${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi
echo -e "${GREEN}✓ npm instalado: $(npm --version)${NC}"

echo ""
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias del backend instaladas${NC}"
else
    echo "❌ Error instalando dependencias del backend"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo -e "${GREEN}✓ Archivo .env creado. Edítalo con tus configuraciones.${NC}"
fi

cd ..

echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias del frontend instaladas${NC}"
else
    echo "❌ Error instalando dependencias del frontend"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Instalación completada exitosamente${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Para iniciar la aplicación:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Asegúrate de que MongoDB esté corriendo"
echo ""
echo "La aplicación estará disponible en http://localhost:3000"
