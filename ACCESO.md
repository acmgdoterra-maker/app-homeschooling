# 🚀 Cómo Acceder a la App - Guía Simple

## ⚡ MANERA RÁPIDA

### Paso 1: Abre Terminal/CMD
```bash
cd /home/user/app-homeschooling
npm run dev
```

### Paso 2: Espera a ver esto en la terminal:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Paso 3: Abre tu navegador

**En tu COMPUTADORA:**
```
http://localhost:5173
```

**En tu TELÉFONO (misma WiFi):**
```
http://192.0.2.2:5173
```

---

## 🔍 ¿Cómo Verificar que el Servidor Está Corriendo?

### Opción 1: Ver la Terminal
Si ves "Local: http://localhost:5173/" → **ESTÁ CORRIENDO** ✅

### Opción 2: Ejecutar Script de Verificación
```bash
./verify-server.sh
```

Te mostrará:
- ✅ Si el servidor está corriendo
- ✅ IP correcta
- ✅ URLs de acceso

### Opción 3: Ver el Proceso
```bash
ps aux | grep "npm run dev"
```

Si ves una línea con "npm run dev" → **ESTÁ CORRIENDO** ✅

---

## 🆘 Si No Funciona

### ❌ "No puedo acceder desde el navegador"

**Solución:**
1. Abre **nueva terminal**
2. Ejecuta: `npm run dev`
3. Espera a ver "Local: http://localhost:5173/"
4. Recarga el navegador (F5)

### ❌ "Dice que no puede conectar"

**En computadora:**
```bash
npm run dev
```

**En teléfono:**
- Asegúrate de estar en la **misma WiFi**
- Prueba: `http://192.0.2.2:5173`

### ❌ "Error en la terminal"

**Ejecuta:**
```bash
npm install
npm run dev
```

---

## ✅ Verificación Rápida

Copia esto en la terminal:
```bash
curl http://localhost:5173
```

Si ves HTML con "homeschooling" → **FUNCIONA** ✅

---

## 📱 Direcciones a Usar

| Dispositivo | URL | Cuándo usar |
|------------|-----|------------|
| Tu Computadora | http://localhost:5173 | Aquí |
| Tu Teléfono | http://192.0.2.2:5173 | En otra habitación |

---

**¿Todavía no funciona?** Escribe qué error ves exactamente 👇
