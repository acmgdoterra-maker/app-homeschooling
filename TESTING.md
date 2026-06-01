# 🧪 Guía de Testing - Mi Homeschooling

## Estado de Verificación: ✅ PASS

La aplicación ha sido verificada y está **completamente funcional** y lista para usar.

## 🚀 Cómo Acceder a la Aplicación

### Opción 1: Desarrollo Local
```bash
cd /home/user/app-homeschooling
npm install
npm run dev
```

Luego abre tu navegador en: **http://localhost:5173**

### Opción 2: Build para Producción
```bash
npm run build
npm run preview
```

## 📋 Lista de Verificación - Pruebas Manuales

Sigue estos pasos para verificar todas las funcionalidades:

### ✅ 1. Pantalla Inicial
- [ ] La app carga correctamente
- [ ] Ves el formulario para agregar un hijo
- [ ] Los 5 colores de opciones están visibles

### ✅ 2. Agregar Primer Hijo
- [ ] Ingresa nombre (ej: "María")
- [ ] Ingresa fecha de nacimiento
- [ ] Selecciona un color
- [ ] Haz clic en "Agregar hijo/a"
- [ ] Debería cambiar a la pantalla principal con tabs

### ✅ 3. Registro Diario
- [ ] Selecciona la pestaña "Registro Diario" (📝)
- [ ] Haz clic en "+ Nueva Materia"
- [ ] Agrega una materia (ej: "Matemáticas")
- [ ] Ingresa descripción de la clase
- [ ] Agrega checklist de avances
- [ ] Agrega reforzamientos necesarios
- [ ] Haz clic en "Guardar Registro"
- [ ] Verifica que aparezca en la sección de registros

### ✅ 4. Calendario
- [ ] Selecciona la pestaña "Calendario" (📅)
- [ ] Navega entre meses con botones
- [ ] Haz clic en un día del calendario
- [ ] Agrega un evento (actividad, viaje, museo)
- [ ] Verifica que aparezca en el calendario

### ✅ 5. Galería de Fotos
- [ ] Selecciona la pestaña "Galería" (🖼️)
- [ ] Haz clic en "+ Agregar Foto"
- [ ] Sube una imagen (prueba con cualquier foto)
- [ ] Ingresa título y descripción
- [ ] Guarda
- [ ] Verifica que aparezca en grid

### ✅ 6. Rastreador de Hábitos
- [ ] Selecciona la pestaña "Hábitos" (✓)
- [ ] Ajusta los sliders:
  - Autonomía
  - Tareas del hogar
  - Estilo de vida
- [ ] Ingresa notas
- [ ] Haz clic en "Guardar Registro de Hábitos"
- [ ] Verifica que aparezca en histórico

### ✅ 7. Diario de Aprendizaje
- [ ] Selecciona la pestaña "Diario" (📖)
- [ ] Selecciona un emoji de estado de ánimo
- [ ] Ingresa una reflexión sobre el aprendizaje
- [ ] Haz clic en "Guardar en el Diario"
- [ ] Verifica que aparezca en entradas anteriores

### ✅ 8. Biblioteca
- [ ] Selecciona la pestaña "Biblioteca" (📚)
- [ ] Haz clic en "+ Nuevo Libro"
- [ ] Agrega título y autor
- [ ] Ingresa fecha de préstamo
- [ ] Guarda
- [ ] Marca como devuelto
- [ ] Filtra por "Devueltos"

### ✅ 9. Guía de Ideas
- [ ] Selecciona la pestaña "Ideas" (💡)
- [ ] Agrega una nueva idea (actividad, documental, museo)
- [ ] Filtra por tipo
- [ ] Verifica que se agrupa correctamente

### ✅ 10. Portafolio
- [ ] Selecciona la pestaña "Portafolio" (🎓)
- [ ] Selecciona un período (mes/año)
- [ ] Verifica estadísticas
- [ ] Haz clic en "Descargar PDF"
- [ ] Verifica que se descargan datos en PDF

### ✅ 11. Persistencia de Datos
- [ ] Completa varios registros en diferentes secciones
- [ ] Presiona F5 o Cmd+R para recargar la página
- [ ] **CRUCIAL**: Todos tus datos deben estar ahí
- [ ] Navega entre diferentes secciones
- [ ] Los datos deben persistir

### ✅ 12. Múltiples Hijos
- [ ] En la navegación superior, haz clic en "+ Agregar"
- [ ] Agrega un segundo hijo con nombre diferente
- [ ] Selecciona entre hijos usando los botones de nombre
- [ ] Verifica que cada hijo tiene datos independientes

## 🎨 Verificación de Diseño

- [ ] Los colores coinciden con tu branding
  - Hueso (#FAF7F2) - Fondo principal
  - Nude (#E5DCC5) - Bordes y elementos secundarios
  - Salvia (#B5CA8A) - Botones principales
  - Cacao (#6B5444) - Texto secundario
  - Tinta (#1F1B17) - Texto principal
- [ ] La tipografía es elegante (Playfair Display para títulos)
- [ ] La app es responsive (prueba en diferentes tamaños)
- [ ] No hay elementos rotos o mal alineados

## 🔧 Troubleshooting

### La app no carga
```bash
# Reinicia el servidor
npm run dev
```

### Los datos no se guardan
- Verifica que IndexedDB está habilitado en tu navegador
- Abre DevTools (F12) → Application → IndexedDB
- Debería haber una BD llamada "homeschoolingDB"

### Error al descargar PDF
- Verifica que tienes datos guardados en el período seleccionado
- Intenta con un período diferente

### Las imágenes no se suben
- Verifica que seleccionas un archivo de imagen válido
- El tamaño máximo está limitado por IndexedDB (~50MB total)

## 📊 Información Técnica

**Stack usado:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- IndexedDB con Dexie.js
- jsPDF para exportación

**Almacenamiento:**
- Todo es local en tu navegador
- Cero datos enviados a servidores
- Datos persisten incluso cerrando la pestaña

**Navegadores soportados:**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## 🚀 Próximas Mejoras

Ver `DESARROLLO.md` para:
- Rastreador de horas
- Metas personales
- Gráficos de progreso
- Integración Canva
- Y más...

## 📞 Reportar Issues

Si encuentras algún problema:
1. Verifica los pasos en esta guía
2. Abre DevTools (F12) y revisa la consola
3. Reinicia la app

¡Disfruta tu aplicación de homeschooling! 🎓
