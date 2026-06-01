import type { Child } from '../types'
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
            className="mb-4 text-tinta hover:text-cacao text-sm"
          >
            Cerrar
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-tinta text-hueso border-r border-nude flex flex-col">
      <div className="p-6 border-b border-nude">
        <h1 className="text-2xl font-serif text-hueso">Homeschooling</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold text-nude uppercase tracking-wide mb-4">
          Estudiantes
        </div>
        {children.map(child => (
          <button
            key={child.id}
            onClick={() => onSelectChild(child.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition text-sm ${
              selectedChildId === child.id
                ? 'bg-salvia text-tinta font-semibold'
                : 'text-hueso hover:bg-cacao'
            }`}
          >
            {child.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-nude">
        <button
          onClick={() => setShowAddChild(true)}
          className="w-full px-4 py-2 bg-salvia text-tinta rounded-lg font-semibold text-sm hover:bg-opacity-90 transition"
        >
          Agregar Estudiante
        </button>
      </div>
    </aside>
  )
}
