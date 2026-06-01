import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import { CalendarEvent } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface CalendarProps {
  childId: string
}

export default function Calendar({ childId }: CalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'activity' as const,
  })

  useEffect(() => {
    loadEvents()
  }, [childId, currentMonth])

  const loadEvents = async () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const evts = await db.calendarEvents
      .where('childId')
      .equals(childId)
      .filter(e => {
        const date = new Date(e.date)
        return date >= monthStart && date <= monthEnd
      })
      .toArray()
    setEvents(evts)
  }

  const addEvent = async () => {
    if (!selectedDate || !formData.title.trim()) return

    const event: CalendarEvent = {
      id: uuidv4(),
      childId,
      date: selectedDate,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await db.calendarEvents.add(event)
    loadEvents()
    setFormData({ title: '', description: '', type: 'activity' })
    setShowForm(false)
    setSelectedDate(null)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const days = []
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif text-tinta capitalize">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="btn-secondary"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="btn-secondary"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="btn-secondary"
          >
            Siguiente →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-semibold text-cacao py-2">
            {day}
          </div>
        ))}

        {days.map((day, idx) => {
          const dateStr = day
            ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null
          const dayEvents = dateStr ? events.filter(e => e.date === dateStr) : []
          const isSelected = selectedDate === dateStr

          return (
            <div
              key={idx}
              onClick={() => {
                if (day) {
                  setSelectedDate(isSelected ? null : dateStr)
                  if (!isSelected) setShowForm(false)
                }
              }}
              className={`min-h-20 p-2 rounded-lg border-2 cursor-pointer transition ${
                day
                  ? isSelected
                    ? 'border-salvia bg-salvia bg-opacity-20'
                    : dayEvents.length > 0
                    ? 'border-cacao bg-cacao bg-opacity-10'
                    : 'border-nude hover:border-salvia'
                  : 'bg-gray-100'
              }`}
            >
              {day && (
                <>
                  <p className="font-semibold text-cacao">{day}</p>
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <p key={event.id} className="text-xs text-tinta truncate">
                        {event.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-xs text-cacao">+{dayEvents.length - 2}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {selectedDate && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full btn-primary"
        >
          Agregar evento para {selectedDate}
        </button>
      )}

      {showForm && selectedDate && (
        <div className="card">
          <h4 className="font-serif text-lg text-tinta mb-4">Nuevo evento</h4>
          <input
            type="text"
            placeholder="Título del evento"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 focus:outline-none focus:border-salvia"
          />
          <textarea
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 min-h-20 focus:outline-none focus:border-salvia"
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-4 focus:outline-none focus:border-salvia"
          >
            <option value="activity">Actividad</option>
            <option value="trip">Viaje</option>
            <option value="museum">Museo</option>
            <option value="other">Otro</option>
          </select>
          <div className="flex gap-2">
            <button onClick={addEvent} className="flex-1 btn-primary">
              Guardar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
