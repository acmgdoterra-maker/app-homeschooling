import { useState } from 'react'
import { Child } from '../types'
import { v4 as uuidv4 } from 'uuid'

const colors = ['#B5CA8A', '#E5DCC5', '#6B5444', '#FF6B6B', '#4ECDC4']

interface ChildSetupProps {
  onChildAdded: (child: Child) => void
}

export default function ChildSetup({ onChildAdded }: ChildSetupProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [selectedColor, setSelectedColor] = useState(colors[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newChild: Child = {
      id: uuidv4(),
      name,
      birthDate,
      color: selectedColor,
      createdAt: new Date().toISOString(),
    }

    onChildAdded(newChild)
    setName('')
    setBirthDate('')
    setSelectedColor(colors[0])
  }

  return (
    <div className="min-h-screen bg-hueso flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h1 className="text-4xl text-tinta mb-2 font-serif">Mi Homeschooling</h1>
        <p className="text-cacao mb-8">Comienza agregando a tus hijos</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-cacao mb-2">
              Nombre del hijo/a
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María"
              className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cacao mb-2">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cacao mb-3">
              Color asociado
            </label>
            <div className="flex gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-lg border-4 transition ${
                    selectedColor === color ? 'border-cacao' : 'border-nude'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Agregar hijo/a
          </button>
        </form>
      </div>
    </div>
  )
}
