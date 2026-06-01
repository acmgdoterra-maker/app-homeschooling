import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import type { DocumentaryRecord } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface IdeasGuideProps {
  childId: string
}

interface Idea {
  id: string
  type: 'documentary' | 'museum' | 'activity'
  title: string
  subject: string
  description: string
  watched?: boolean
  date?: string
}

export default function IdeasGuide({ childId }: IdeasGuideProps) {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [documentaries, setDocumentaries] = useState<DocumentaryRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'documentary' | 'museum' | 'activity'>('all')
  const [formData, setFormData] = useState({
    type: 'activity' as const,
    title: '',
    subject: '',
    description: '',
  })

  useEffect(() => {
    loadIdeas()
  }, [childId])

  const loadIdeas = async () => {
    const docs = await db.documentaryRecords
      .where('childId')
      .equals(childId)
      .toArray()

    const docIdeas: Idea[] = docs.map(d => ({
      id: d.id,
      type: 'documentary' as const,
      title: d.title,
      subject: d.subject,
      description: d.notes,
      watched: true,
      date: d.date,
    }))

    setIdeas(docIdeas)
    setDocumentaries(docs)
  }

  const addIdea = async () => {
    if (!formData.title.trim()) return

    if (formData.type === 'documentary') {
      const doc: DocumentaryRecord = {
        id: uuidv4(),
        childId,
        title: formData.title,
        subject: formData.subject,
        date: new Date().toISOString().split('T')[0],
        notes: formData.description,
        createdAt: new Date().toISOString(),
      }

      await db.documentaryRecords.add(doc)
    } else {
      const idea: Idea = {
        id: uuidv4(),
        type: formData.type,
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        watched: false,
      }
      setIdeas([...ideas, idea])
    }

    loadIdeas()
    setFormData({
      type: 'activity',
      title: '',
      subject: '',
      description: '',
    })
    setShowForm(false)
  }

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id))
  }

  const filteredIdeas = filterType === 'all'
    ? ideas
    : ideas.filter(i => i.type === filterType)

  const typeLabels = {
    documentary: '🎬 Documental',
    museum: '🏛️ Museo',
    activity: '🎨 Actividad',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
              filterType === 'all'
                ? 'bg-salvia text-tinta'
                : 'bg-white border-2 border-nude text-cacao'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('documentary')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
              filterType === 'documentary'
                ? 'bg-salvia text-tinta'
                : 'bg-white border-2 border-nude text-cacao'
            }`}
          >
            🎬 Documentales
          </button>
          <button
            onClick={() => setFilterType('museum')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
              filterType === 'museum'
                ? 'bg-salvia text-tinta'
                : 'bg-white border-2 border-nude text-cacao'
            }`}
          >
            🏛️ Museos
          </button>
          <button
            onClick={() => setFilterType('activity')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${
              filterType === 'activity'
                ? 'bg-salvia text-tinta'
                : 'bg-white border-2 border-nude text-cacao'
            }`}
          >
            🎨 Actividades
          </button>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary whitespace-nowrap">
          + Nueva Idea
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-serif text-tinta mb-4">Agregar Nueva Idea</h3>

          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 focus:outline-none focus:border-salvia"
          >
            <option value="activity">Actividad</option>
            <option value="documentary">Documental</option>
            <option value="museum">Museo</option>
          </select>

          <input
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 focus:outline-none focus:border-salvia"
          />

          <input
            type="text"
            placeholder="Tema o Materia"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 focus:outline-none focus:border-salvia"
          />

          <textarea
            placeholder="Descripción o detalles"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 min-h-20 focus:outline-none focus:border-salvia"
          />

          <div className="flex gap-2">
            <button onClick={addIdea} className="flex-1 btn-primary">
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

      <div className="grid gap-4 md:grid-cols-2">
        {filteredIdeas.length === 0 ? (
          <p className="text-cacao col-span-full">Sin ideas para esta categoría</p>
        ) : (
          filteredIdeas.map(idea => (
            <div key={idea.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="inline-block text-xl mb-1 mr-2">
                    {idea.type === 'documentary'
                      ? '🎬'
                      : idea.type === 'museum'
                      ? '🏛️'
                      : '🎨'}
                  </span>
                  <h4 className="font-semibold text-tinta inline">{idea.title}</h4>
                </div>
                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="text-cacao hover:text-tinta"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-cacao font-semibold mb-2">
                Tema: {idea.subject}
              </p>

              <p className="text-sm text-tinta">{idea.description}</p>

              {idea.date && (
                <p className="text-xs text-cacao mt-3 pt-3 border-t border-nude">
                  Visto: {idea.date}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
