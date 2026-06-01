# Guía de Desarrollo - Mi Homeschooling

## Próximos Pasos Recomendados

### 1. Galería de Fotos (Alta Prioridad)
- Implementar carga de imágenes
- Almacenamiento en IndexedDB (base64)
- Vinculación con registros diarios
- Vista de galería por fecha

```typescript
// Se debe expandir el componente Gallery.tsx
// Usar FileReader API para convertir a base64
// Guardar en la tabla photos de la BD
```

### 2. Rastreador de Horas por Materia (Media Prioridad)
- Agregar timmer para clases
- Registro manual de horas
- Visualización por materia
- Gráficos de distribución de tiempo

### 3. Metas Personales (Media Prioridad)
- CRUD de metas por hijo
- Barra de progreso visual
- Histórico de cambios
- Notificaciones de hitos

### 4. Mejoras del Portfolio (Media Prioridad)
- Incluir fotos en el PDF
- Mejor formato de salida
- Estadísticas más detalladas
- Selección de contenido a incluir

### 5. Integración de Canva (Baja Prioridad)
- Instalar SDK de Canva
- Exportar diseños a la plataforma
- Templates personalizadas

## Estructura de Componentes

Cada sección sigue este patrón:

```typescript
interface SectionProps {
  childId: string
}

export default function Section({ childId }: SectionProps) {
  const [data, setData] = useState<DataType[]>([])
  
  useEffect(() => {
    loadData()
  }, [childId])
  
  const loadData = async () => {
    const result = await db.tableName
      .where('childId')
      .equals(childId)
      .toArray()
    setData(result)
  }
  
  // Render...
}
```

## Convenciones de Código

1. **Tipos:** Todos los tipos van en `src/types/index.ts`
2. **Base de Datos:** Usar Dexie.js con relaciones por childId
3. **IDs:** Usar `uuid` para todos los IDs
4. **Fechas:** Formato ISO (YYYY-MM-DD para fechas, ISOString para timestamps)
5. **Colores:** Usar clases de Tailwind del branding

## Testing

Crear tests para:
- Carga y guardado de datos
- Validaciones de formularios
- Cálculos de estadísticas
- Exportación a PDF

```bash
npm install -D vitest @testing-library/react
```

## Build y Deploy

```bash
# Build
npm run build

# Output en dist/
# Servir con cualquier servidor HTTP estático
```

## Notas Importantes

- **IndexedDB tiene límite de espacio:** ~50MB en la mayoría de navegadores
- **Las imágenes en base64 son grandes:** Considerar compresión
- **Backup manual:** Recomendar al usuario exportar sus datos regularmente
- **Compatibilidad:** Testar en Chrome, Firefox, Safari, Edge

## Ejemplo: Agregar Nueva Sección

1. Crear archivo en `src/components/sections/NuevaSeccion.tsx`
2. Agregar tipo en `src/types/index.ts`
3. Agregar tabla en `src/db/database.ts`
4. Importar en `Dashboard.tsx`
5. Agregar tab en el array `tabs`
6. Crear componente de sección

## Troubleshooting

**Error: "No schema for table"**
- Agregar la tabla en `database.ts` y en `.stores()`
- Aumentar versión de la BD

**Las fotos son muy grandes**
- Comprimir antes de convertir a base64
- Usar formato JPEG en lugar de PNG

**La app es lenta**
- Usar `toArray()` solo cuando sea necesario
- Agregar índices en `database.ts`

## Contacto y Soporte

Para dudas sobre el desarrollo, revisar la estructura existente como referencia.
