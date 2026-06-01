import { useState, useEffect } from 'react'
import { db } from './db/database'
import { Child } from './types'
import Dashboard from './components/Dashboard'
import ChildSetup from './components/ChildSetup'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChildren()
  }, [])

  const loadChildren = async () => {
    try {
      const allChildren = await db.children.toArray()
      setChildren(allChildren)
      if (allChildren.length > 0) {
        setSelectedChildId(allChildren[0].id)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading children:', error)
      setLoading(false)
    }
  }

  const handleAddChild = async (newChild: Child) => {
    try {
      await db.children.add(newChild)
      setChildren([...children, newChild])
      setSelectedChildId(newChild.id)
    } catch (error) {
      console.error('Error adding child:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-tinta">Cargando...</div>
  }

  if (children.length === 0) {
    return <ChildSetup onChildAdded={handleAddChild} />
  }

  const selectedChild = children.find(c => c.id === selectedChildId)

  return (
    <div className="min-h-screen bg-hueso">
      <Navigation
        children={children}
        selectedChildId={selectedChildId}
        onSelectChild={setSelectedChildId}
        onChildAdded={handleAddChild}
      />
      {selectedChild && (
        <Dashboard childId={selectedChildId!} child={selectedChild} />
      )}
    </div>
  )
}

export default App
