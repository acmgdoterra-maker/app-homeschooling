# 📚 Mi Homeschooling - Aplicación de Control y Registro

Una aplicación web moderna para gestionar el homeschooling de múltiples hijos. Almacenamiento completamente local con IndexedDB, sin necesidad de servidor.

## ✨ Características Principales

### 👨‍👩‍👧‍👦 Gestión de Múltiples Hijos
- Agregar hasta 3 (o más) hijos
- Color único para cada hijo
- Perfiles independientes y datos separados

### 📝 Registro Diario
- Descripción de las lecciones diarias por materia
- Creación dinámica de materias
- Checklist de avances
- Reforzamientos necesarios
- Visualización de registros por fecha

### 📅 Calendario Interactivo
- Vista mensual editable
- Eventos por día (actividades, viajes, museos)
- Tipos de eventos personalizables
- Navegación entre meses

### 🏆 Rastreador de Hábitos y Rutinas
- Autonomía (1-5)
- Tareas del hogar (1-5)
- Estilo de vida (1-5)
- Notas diarias
- Histórico de cambios

### 📖 Diario de Aprendizaje
- Entradas reflexivas sobre el aprendizaje
- Estados de ánimo (emojis)
- Visualización de entradas anteriores
- Edición y eliminación

### 📚 Gestión de Biblioteca
- Registro de libros prestados
- Fecha de préstamo y devolución esperada
- Marcado de devoluciones
- Notas sobre cada libro (género, resumen, etc.)
- Filtrado por estado (en préstamo / devueltos)

### 💡 Guía de Ideas y Actividades
- Documentales recomendados
- Museos y salidas
- Actividades educativas
- Organización por tema

### 🎓 Portafolio y Exportación
- Resumen mensual del progreso
- Estadísticas de actividades
- **Exportación a PDF** para inspecciones
- Visualización de promedios de hábitos

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Custom Design System
- **Base de Datos:** IndexedDB (Dexie.js)
- **Exportación:** jsPDF + html2canvas
- **Build:** Vite
- **Colores de Branding:**
  - Hueso: #FAF7F2
  - Nude: #E5DCC5
  - Salvia: #B5CA8A
  - Cacao: #6B5444
  - Tinta: #1F1B17

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

La aplicación abrirá en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ChildSetup.tsx           # Configuración inicial de hijos
│   ├── Navigation.tsx            # Navegación y selector de hijo
│   ├── Dashboard.tsx             # Panel principal con tabs
│   └── sections/                 # Componentes de cada sección
│       ├── DailyEntry.tsx
│       ├── Calendar.tsx
│       ├── HabitTracker.tsx
│       ├── LearningDiary.tsx
│       ├── Library.tsx
│       ├── IdeasGuide.tsx
│       ├── Portfolio.tsx
│       └── Gallery.tsx (en desarrollo)
├── db/
│   └── database.ts               # Configuración de IndexedDB
├── types/
│   └── index.ts                  # Tipos TypeScript
└── main.tsx
```

## 💾 Almacenamiento de Datos

Todos los datos se guardan localmente en IndexedDB del navegador:

- **Children:** Información de los hijos
- **Subjects:** Materias por hijo
- **DailyRecords:** Registros diarios de lecciones
- **CalendarEvents:** Eventos del calendario
- **HabitTracking:** Seguimiento de hábitos
- **LearningEntries:** Entradas del diario
- **BookRecords:** Registro de libros
- **DocumentaryRecords:** Documentales y museos
- **PersonalGoals:** Metas personales
- **HourTracking:** Seguimiento de horas

## 🎨 Personalización

### Colores
Los colores de branding están configurados en `tailwind.config.js`:

```js
colors: {
  hueso: '#FAF7F2',
  nude: '#E5DCC5',
  salvia: '#B5CA8A',
  cacao: '#6B5444',
  tinta: '#1F1B17',
}
```

### Tipografía
- **Serif (Títulos):** Playfair Display
- **Sans (Cuerpo):** Inter
- **Script (Detalles):** Dancing Script

## 📊 Próximas Funcionalidades

- [ ] Galería de fotos con almacenamiento local
- [ ] Rastreador de horas por materia
- [ ] Metas personales por hijo
- [ ] Exportación a Canva
- [ ] Sincronización con nube (opcional)
- [ ] App móvil nativa
- [ ] Gráficos de progreso
- [ ] Plantillas de lecciones

## 📝 Licencia

Privada - Uso personal

## 👨‍💻 Desarrollo

El proyecto está en desarrollo activo. Las características se agregan regularmente basándose en las necesidades del homeschooling.
