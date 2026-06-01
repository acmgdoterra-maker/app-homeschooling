import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import type { LearningEntry } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface LearningDiaryProps {
  childId: string
}

export default function LearningDiary({ childId }: LearningDiaryProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [entry, setEntry] = useState('')
  const [mood, setMood] = useState('excellent')
  const [entries, setEntries] = useState<LearningEntry[]>([])

  useEffect(() => {
    loadEntries()
  }, [childId])

  const loadEntries = async () => {
    const ents = await db.learningEntries
      .where('childId')
      .equals(childId)
      .toArray()
    setEntries(ents.sort((a, b) => b.date.localeCompare(a.date)))
  }

  const saveEntry = async () => {
    if (!entry.trim()) return

    const newEntry: LearningEntry = {
      id: uuidv4(),
      childId,
      date,
      entry,
      mood,
      createdAt: new Date().toISOString(),
    }

    await db.learningEntries.add(newEntry)
    loadEntries()
    setEntry('')
    setMood('excellent')
  }

  const deleteEntry = async (id: string) => {
    await db.learningEntries.delete(id)
    loadEntries()
  }

  const moods = [
    { id: 'poor', label: 'Muy mal' },
    { id: 'bad', label: 'Mal' },
    { id: 'neutral', label: 'Regular' },
    { id: 'good', label: 'Bien' },
    { id: 'very-good', label: 'Muy bien' },
    { id: 'excellent', label: 'Excelente' },
  ]

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-serif text-tinta mb-6">Nuevo Registro</h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-cacao mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-cacao mb-2">
            Bienestar
          </label>
          <div className="grid grid-cols-3 gap-2">
            {moods.map(m => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  mood === m.id
                    ? 'bg-salvia text-tinta'
                    : 'bg-nude text-cacao hover:bg-opacity-80'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-cacao mb-2">
            Lo que aprendí hoy...
          </label>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Escribe reflexiones sobre el aprendizaje de hoy, descubrimientos, dificultades, éxitos..."
            className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia min-h-32"
          />
        </div>

        <button onClick={saveEntry} className="w-full btn-primary py-3">
          Guardar en el Diario
        </button>
      </div>

      <div>
        <h3 className="text-lg font-serif text-tinta mb-4">Entradas Anteriores</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {entries.length === 0 ? (
            <p className="text-cacao">Sin entradas de diario aún</p>
          ) : (
            entries.map(ent => {
              const moodLabel = moods.find(m => m.id === ent.mood)?.label || ent.mood
              return (
                <div key={ent.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-cacao">{ent.date}</p>
                      <p className="text-sm font-medium text-tinta mt-1">{moodLabel}</p>
                    </div>
                    <button
                      onClick={() => deleteEntry(ent.id)}
                      className="text-cacao hover:text-tinta text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                  <p className="text-tinta text-sm whitespace-pre-wrap">{ent.entry}</p>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
