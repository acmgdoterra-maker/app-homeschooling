import { useState } from 'react'
import type { Child } from '../types'
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
  { id: 'daily', label: 'Registro Diario' },
  { id: 'calendar', label: 'Calendario' },
  { id: 'gallery', label: 'Galería' },
  { id: 'habits', label: 'Hábitos' },
  { id: 'diary', label: 'Diario' },
  { id: 'library', label: 'Biblioteca' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'portfolio', label: 'Portafolio' },
]

export default function Dashboard({ childId, child }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('daily')

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-tinta mb-6">
          {child.name}
        </h2>

        <div className="flex gap-2 flex-wrap overflow-x-auto pb-3 border-b-2 border-nude">
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
              {tab.label}
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
