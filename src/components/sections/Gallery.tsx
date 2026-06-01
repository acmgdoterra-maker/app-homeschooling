import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import { Photo } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface GalleryProps {
  childId: string
}

export default function Gallery({ childId }: GalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [imageData, setImageData] = useState<string | null>(null)
  const fileInputRef = useState<HTMLInputElement | null>(null)[1]

  useEffect(() => {
    loadPhotos()
  }, [childId])

  const loadPhotos = async () => {
    const imgs = await db.photos
      .where('childId')
      .equals(childId)
      .toArray()
    setPhotos(imgs.sort((a, b) => b.date.localeCompare(a.date)))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setImageData(base64)
    }
    reader.readAsDataURL(file)
  }

  const addPhoto = async () => {
    if (!imageData || !formData.title.trim()) return

    const photo: Photo = {
      id: uuidv4(),
      childId,
      date: selectedDate,
      title: formData.title,
      description: formData.description,
      data: imageData,
      createdAt: new Date().toISOString(),
    }

    await db.photos.add(photo)
    loadPhotos()
    setImageData(null)
    setFormData({ title: '', description: '' })
    setShowForm(false)
  }

  const deletePhoto = async (id: string) => {
    await db.photos.delete(id)
    loadPhotos()
  }

  return (
    <div className="space-y-6">
      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        + Agregar Foto
      </button>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-serif text-tinta mb-4">Agregar Foto</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-cacao mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-cacao mb-2">
              Seleccionar Imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full px-4 py-2 border-2 border-nude rounded-lg"
            />
            {imageData && (
              <div className="mt-3">
                <img src={imageData} alt="Preview" className="max-h-40 rounded-lg" />
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Título de la foto"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 focus:outline-none focus:border-salvia"
          />

          <textarea
            placeholder="Descripción de la actividad"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 min-h-20 focus:outline-none focus:border-salvia"
          />

          <div className="flex gap-2">
            <button onClick={addPhoto} className="flex-1 btn-primary">
              Guardar Foto
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setImageData(null)
              }}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-cacao text-center py-12">
          Sin fotos aún. ¡Agrega tus primeras fotos de actividades!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="group relative overflow-hidden rounded-lg">
              <img
                src={photo.data}
                alt={photo.title}
                className="w-full h-40 object-cover group-hover:opacity-75 transition"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center">
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="hidden group-hover:block text-white hover:text-red-300"
                >
                  ✕
                </button>
              </div>
              <div className="p-2 bg-white">
                <h4 className="font-semibold text-sm text-tinta truncate">
                  {photo.title}
                </h4>
                <p className="text-xs text-cacao">{photo.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
