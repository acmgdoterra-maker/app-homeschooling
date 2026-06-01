#!/bin/bash

clear

echo ""
echo "███████████████████████████████████████████████████████████"
echo "███                                                       ███"
echo "███     🎓 MI HOMESCHOOLING - Iniciar Servidor            ███"
echo "███                                                       ███"
echo "███████████████████████████████████████████████████████████"
echo ""

echo "📦 Instalando dependencias si es necesario..."
npm install --silent

echo ""
echo "🚀 Iniciando servidor..."
echo ""

npm run dev

echo ""
echo "✅ Servidor cerrado"
