import { Child } from '../types'
import ChildSetup from './ChildSetup'
import { useState } from 'react'

interface NavigationProps {
  children: Child[]
  selectedChildId: string | null
  onSelectChild: (id: string) => void
  onChildAdded: (child: Child) => void
}

export default function Navigation({
  children,
  selectedChildId,
  onSelectChild,
  onChildAdded,
}: NavigationProps) {
  const [showAddChild, setShowAddChild] = useState(false)

  if (showAddChild) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="max-w-md w-full">
          <button
            onClick={() => setShowAddChild(false)}
            className="mb-4 text-tinta hover:text-cacao"
          >
            ✕ Cerrar
          </button>
          <ChildSetup onChildAdded={(child) => {
            onChildAdded(child)
            setShowAddChild(false)
          }} />
        </div>
      </div>
    )
  }

  return (
    <nav className="bg-white border-b-2 border-nude">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-serif text-tinta">Mi Homeschooling</h1>

          <div className="flex items-center gap-2 flex-wrap">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => onSelectChild(child.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedChildId === child.id
                    ? 'bg-salvia text-tinta'
                    : 'bg-nude text-cacao hover:bg-opacity-80'
                }`}
              >
                {child.name}
              </button>
            ))}

            <button
              onClick={() => setShowAddChild(true)}
              className="px-4 py-2 bg-cacao text-hueso rounded-lg font-semibold hover:bg-opacity-90"
            >
              + Agregar
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
