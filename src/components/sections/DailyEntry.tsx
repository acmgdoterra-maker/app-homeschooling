import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import { Subject, DailyRecord, ChecklistItem } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface DailyEntryProps {
  childId: string
}

export default function DailyEntry({ childId }: DailyEntryProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [reinforcements, setReinforcements] = useState<string[]>([])
  const [newReinforcement, setNewReinforcement] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')
  const [showNewSubject, setShowNewSubject] = useState(false)
  const [records, setRecords] = useState<DailyRecord[]>([])

  const colors = ['#B5CA8A', '#E5DCC5', '#6B5444', '#FF6B6B', '#4ECDC4']

  useEffect(() => {
    loadSubjects()
    loadRecords()
  }, [childId, date])

  const loadSubjects = async () => {
    const subs = await db.subjects.where('childId').equals(childId).toArray()
    setSubjects(subs)
    if (subs.length > 0 && !selectedSubject) {
      setSelectedSubject(subs[0].id)
    }
  }

  const loadRecords = async () => {
    const recs = await db.dailyRecords
      .where('childId')
      .equals(childId)
      .filter(r => r.date === date)
      .toArray()
    setRecords(recs)
  }

  const addSubject = async () => {
    if (!newSubjectName.trim()) return

    const newSubject: Subject = {
      id: uuidv4(),
      childId,
      name: newSubjectName,
      color: colors[subjects.length % colors.length],
      createdAt: new Date().toISOString(),
    }

    await db.subjects.add(newSubject)
    setSubjects([...subjects, newSubject])
    setSelectedSubject(newSubject.id)
    setNewSubjectName('')
    setShowNewSubject(false)
  }

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return
    setChecklistItems([
      ...checklistItems,
      { id: uuidv4(), title: newChecklistItem, completed: false },
    ])
    setNewChecklistItem('')
  }

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(
      checklistItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const addReinforcement = () => {
    if (!newReinforcement.trim()) return
    setReinforcements([...reinforcements, newReinforcement])
    setNewReinforcement('')
  }

  const saveRecord = async () => {
    if (!selectedSubject || !description.trim()) return

    const record: DailyRecord = {
      id: uuidv4(),
      childId,
      date,
      subjectId: selectedSubject,
      description,
      checklistItems,
      reinforcements,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await db.dailyRecords.add(record)
    loadRecords()
    setDescription('')
    setChecklistItems([])
    setReinforcements([])
  }

  const currentSubject = subjects.find(s => s.id === selectedSubject)

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-cacao mb-2">
            Materia
          </label>
          <select
            value={selectedSubject || ''}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
          >
            <option value="">Selecciona una materia</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowNewSubject(!showNewSubject)}
          className="btn-secondary h-10"
        >
          + Nueva Materia
        </button>
      </div>

      {showNewSubject && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Nombre de la materia"
            className="flex-1 px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
          />
          <button onClick={addSubject} className="btn-primary">
            Agregar
          </button>
          <button
            onClick={() => setShowNewSubject(false)}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-cacao mb-2">
          Descripción de la clase
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Qué se hizo hoy en esta materia?"
          className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia min-h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-cacao mb-2">
          Checklist de Avances
        </label>
        <div className="space-y-2">
          {checklistItems.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(item.id)}
                className="w-5 h-5"
              />
              <span className={item.completed ? 'line-through text-gray-400' : ''}>
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
            placeholder="Nuevo avance..."
            className="flex-1 px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
          />
          <button onClick={addChecklistItem} className="btn-primary">
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-cacao mb-2">
          Reforzamientos Necesarios
        </label>
        <div className="space-y-2">
          {reinforcements.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-nude bg-opacity-30 p-2 rounded">
              <span>{item}</span>
              <button
                onClick={() => setReinforcements(reinforcements.filter((_, i) => i !== idx))}
                className="text-cacao hover:text-tinta"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newReinforcement}
            onChange={(e) => setNewReinforcement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addReinforcement()}
            placeholder="Nuevo reforzamiento..."
            className="flex-1 px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
          />
          <button onClick={addReinforcement} className="btn-primary">
            +
          </button>
        </div>
      </div>

      <button onClick={saveRecord} className="w-full btn-primary py-3">
        Guardar Registro
      </button>

      <div className="mt-8 border-t-2 border-nude pt-6">
        <h3 className="text-xl font-serif text-tinta mb-4">Registros del {date}</h3>
        <div className="space-y-4">
          {records.length === 0 ? (
            <p className="text-cacao">Sin registros para esta fecha</p>
          ) : (
            records.map(record => (
              <div key={record.id} className="card">
                <h4 className="font-semibold text-cacao mb-2">
                  {subjects.find(s => s.id === record.subjectId)?.name}
                </h4>
                <p className="text-tinta mb-3">{record.description}</p>
                {record.checklistItems.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm text-cacao">Avances:</p>
                    <ul className="list-disc list-inside text-sm text-tinta">
                      {record.checklistItems.map(item => (
                        <li key={item.id} className={item.completed ? 'line-through' : ''}>
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {record.reinforcements.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm text-cacao">Reforzamientos:</p>
                    <ul className="list-disc list-inside text-sm text-tinta">
                      {record.reinforcements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
