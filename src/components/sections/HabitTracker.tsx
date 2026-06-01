import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import type { HabitTracking } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface HabitTrackerProps {
  childId: string
}

export default function HabitTracker({ childId }: HabitTrackerProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [habits, setHabits] = useState({ autonomy: 3, chores: 3, lifestyle: 3 })
  const [notes, setNotes] = useState('')
  const [records, setRecords] = useState<HabitTracking[]>([])
  const [currentRecord, setCurrentRecord] = useState<HabitTracking | null>(null)

  useEffect(() => {
    loadRecords()
  }, [childId])

  const loadRecords = async () => {
    const recs = await db.habitTracking
      .where('childId')
      .equals(childId)
      .toArray()
    setRecords(recs.sort((a, b) => b.date.localeCompare(a.date)))

    const today = new Date().toISOString().split('T')[0]
    const todayRecord = recs.find(r => r.date === today)
    if (todayRecord) {
      setCurrentRecord(todayRecord)
      setHabits(todayRecord.habits)
      setNotes(todayRecord.notes)
    }
  }

  const saveRecord = async () => {
    if (currentRecord) {
      currentRecord.habits = habits
      currentRecord.notes = notes
      currentRecord.updatedAt = new Date().toISOString()
      await db.habitTracking.update(currentRecord.id, currentRecord)
    } else {
      const record: HabitTracking = {
        id: uuidv4(),
        childId,
        date,
        habits,
        notes,
        createdAt: new Date().toISOString(),
      }
      await db.habitTracking.add(record)
      setCurrentRecord(record)
    }
    loadRecords()
  }

  const getColor = (value: number) => {
    if (value <= 2) return 'bg-red-200'
    if (value <= 3) return 'bg-yellow-200'
    return 'bg-green-200'
  }

  const getLabel = (value: number) => {
    const labels = ['', 'Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto']
    return labels[value] || 'Medio'
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-cacao mb-2">
          Fecha
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
        />
      </div>

      <div className="space-y-6 bg-hueso p-4 rounded-lg">
        <div>
          <h4 className="font-semibold text-cacao mb-3">Autonomía</h4>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              value={habits.autonomy}
              onChange={(e) => setHabits({ ...habits, autonomy: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className={`px-3 py-1 rounded text-sm font-semibold ${getColor(habits.autonomy)}`}>
              {habits.autonomy}/5 - {getLabel(habits.autonomy)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-cacao mb-3">Tareas del Hogar</h4>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              value={habits.chores}
              onChange={(e) => setHabits({ ...habits, chores: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className={`px-3 py-1 rounded text-sm font-semibold ${getColor(habits.chores)}`}>
              {habits.chores}/5 - {getLabel(habits.chores)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-cacao mb-3">Estilo de Vida</h4>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              value={habits.lifestyle}
              onChange={(e) => setHabits({ ...habits, lifestyle: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className={`px-3 py-1 rounded text-sm font-semibold ${getColor(habits.lifestyle)}`}>
              {habits.lifestyle}/5 - {getLabel(habits.lifestyle)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-cacao mb-2">
          Notas
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observaciones sobre los hábitos de hoy..."
          className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia min-h-20"
        />
      </div>

      <button onClick={saveRecord} className="w-full btn-primary py-3">
        Guardar Registro de Hábitos
      </button>

      <div className="border-t-2 border-nude pt-6">
        <h3 className="text-xl font-serif text-tinta mb-4">Últimos Registros</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {records.slice(0, 10).map(record => (
            <div key={record.id} className="card">
              <p className="font-semibold text-cacao mb-2">{record.date}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-cacao">Autonomía</p>
                  <p className="text-lg font-bold text-tinta">{record.habits.autonomy}/5</p>
                </div>
                <div>
                  <p className="text-xs text-cacao">Tareas</p>
                  <p className="text-lg font-bold text-tinta">{record.habits.chores}/5</p>
                </div>
                <div>
                  <p className="text-xs text-cacao">Estilo</p>
                  <p className="text-lg font-bold text-tinta">{record.habits.lifestyle}/5</p>
                </div>
              </div>
              {record.notes && (
                <p className="text-sm text-tinta mt-2 pt-2 border-t border-nude">
                  {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
