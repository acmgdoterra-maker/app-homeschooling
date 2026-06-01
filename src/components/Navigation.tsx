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
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-tinta md:text-hueso md:border-r md:border-nude md:flex md:flex-col">
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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-tinta text-hueso border-t border-nude flex justify-between items-center p-2 z-50">
        <div className="flex-1 overflow-x-auto flex gap-1">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className={`px-3 py-2 rounded text-xs font-medium transition whitespace-nowrap ${
                selectedChildId === child.id
                  ? 'bg-salvia text-tinta'
                  : 'text-hueso hover:bg-cacao'
              }`}
            >
              {child.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddChild(true)}
          className="px-3 py-2 bg-salvia text-tinta rounded text-xs font-medium hover:bg-opacity-90 transition whitespace-nowrap ml-1"
        >
          Agregar
        </button>
      </nav>
    </>
  )
}
