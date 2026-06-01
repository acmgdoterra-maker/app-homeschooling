import { useState } from 'react'
import { Child } from '../types'
import DailyEntry from './sections/DailyEntry'
import Calendar from './sections/Calendar'
import Gallery from './sections/Gallery'
import HabitTracker from './sections/HabitTracker'
import LearningDiary from './sections/LearningDiary'
import Library from './sections/Library'
import Portfolio from './sections/Portfolio'
import IdeasGuide from './sections/IdeasGuide'

interface DashboardProps {
  childId: string
  child: Child
}

const tabs = [
  { id: 'daily', label: 'Registro Diario', icon: '📝' },
  { id: 'calendar', label: 'Calendario', icon: '📅' },
  { id: 'gallery', label: 'Galería', icon: '🖼️' },
  { id: 'habits', label: 'Hábitos', icon: '✓' },
  { id: 'diary', label: 'Diario', icon: '📖' },
  { id: 'library', label: 'Biblioteca', icon: '📚' },
  { id: 'ideas', label: 'Ideas', icon: '💡' },
  { id: 'portfolio', label: 'Portafolio', icon: '🎓' },
]

export default function Dashboard({ childId, child }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('daily')

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-3xl font-serif text-tinta mb-4">
          Portafolio de {child.name}
        </h2>

        <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-salvia text-tinta'
                  : 'bg-white border-2 border-nude text-cacao hover:border-salvia'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'daily' && <DailyEntry childId={childId} />}
        {activeTab === 'calendar' && <Calendar childId={childId} />}
        {activeTab === 'gallery' && <Gallery childId={childId} />}
        {activeTab === 'habits' && <HabitTracker childId={childId} />}
        {activeTab === 'diary' && <LearningDiary childId={childId} />}
        {activeTab === 'library' && <Library childId={childId} />}
        {activeTab === 'ideas' && <IdeasGuide childId={childId} />}
        {activeTab === 'portfolio' && <Portfolio childId={childId} />}
      </div>
    </div>
  )
}
