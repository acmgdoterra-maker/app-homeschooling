#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🔍 VERIFICADOR DE SERVIDOR - Mi Homeschooling          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar si el proceso está corriendo
echo "1️⃣ Verificando si npm run dev está corriendo..."
if pgrep -f "npm run dev" > /dev/null; then
    echo "✅ SERVIDOR ESTÁ CORRIENDO"
    PID=$(pgrep -f "npm run dev" | head -1)
    echo "   PID: $PID"
else
    echo "❌ SERVIDOR NO ESTÁ CORRIENDO"
    echo "   Debes ejecutar: npm run dev"
    exit 1
fi

echo ""
echo "2️⃣ Verificando si el puerto 5173 está activo..."
if lsof -i :5173 > /dev/null 2>&1; then
    echo "✅ PUERTO 5173 ESTÁ ACTIVO"
else
    echo "❌ PUERTO 5173 NO ESTÁ ESCUCHANDO"
fi

echo ""
echo "3️⃣ Obteniendo IP local..."
IP=$(hostname -I | awk '{print $1}')
echo "✅ IP LOCAL: $IP"

echo ""
echo "4️⃣ Probando conexión a localhost..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ LOCALHOST FUNCIONA"
else
    echo "❌ LOCALHOST NO RESPONDE"
    exit 1
fi

echo ""
echo "5️⃣ Probando conexión a IP local..."
if curl -s http://$IP:5173 > /dev/null 2>&1; then
    echo "✅ IP LOCAL FUNCIONA"
else
    echo "⚠️ IP LOCAL NO RESPONDE (puede ser normal si no está en la misma red)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        ✨ ACCESOS DISPONIBLES                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 DESDE ESTA COMPUTADORA:"
echo "   http://localhost:5173"
echo ""
echo "📱 DESDE TU TELÉFONO (misma red WiFi):"
echo "   http://$IP:5173"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo ""
