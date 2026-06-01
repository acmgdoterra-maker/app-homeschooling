interface GalleryProps {
  childId: string
}

export default function Gallery({ childId }: GalleryProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400">La galería de fotos está en construcción</p>
      <p className="text-sm text-gray-300 mt-2">Pronto podrás agregar fotos de las actividades</p>
    </div>
  )
}
