import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import type { BookRecord } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface LibraryProps {
  childId: string
}

export default function Library({ childId }: LibraryProps) {
  const [books, setBooks] = useState<BookRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filterActive, setFilterActive] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    dateCheckedOut: new Date().toISOString().split('T')[0],
    dateReturned: '',
    notes: '',
  })

  useEffect(() => {
    loadBooks()
  }, [childId])

  const loadBooks = async () => {
    const bks = await db.bookRecords
      .where('childId')
      .equals(childId)
      .toArray()
    setBooks(bks.sort((a, b) => b.dateCheckedOut.localeCompare(a.dateCheckedOut)))
  }

  const addBook = async () => {
    if (!formData.title.trim() || !formData.author.trim()) return

    const book: BookRecord = {
      id: uuidv4(),
      childId,
      ...formData,
      dateReturned: formData.dateReturned || undefined,
      createdAt: new Date().toISOString(),
    }

    await db.bookRecords.add(book)
    loadBooks()
    setFormData({
      title: '',
      author: '',
      dateCheckedOut: new Date().toISOString().split('T')[0],
      dateReturned: '',
      notes: '',
    })
    setShowForm(false)
  }

  const markAsReturned = async (id: string) => {
    const book = books.find(b => b.id === id)
    if (book) {
      await db.bookRecords.update(id, {
        dateReturned: new Date().toISOString().split('T')[0],
      })
      loadBooks()
    }
  }

  const deleteBook = async (id: string) => {
    await db.bookRecords.delete(id)
    loadBooks()
  }

  const filteredBooks = filterActive
    ? books.filter(b => !b.dateReturned)
    : books.filter(b => b.dateReturned)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive(true)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filterActive
                ? 'bg-salvia text-tinta'
                : 'bg-white border-2 border-nude text-cacao'
            }`}
          >
            En Préstamo
          </button>
          <button
            onClick={() => setFilterActive(false)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              !filterActive
                ? 'bg-salvia text-tinta'
                : 'bg-white border-2 border-nude text-cacao'
            }`}
          >
            Devueltos
          </button>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          + Nuevo Libro
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-serif text-tinta mb-4">Registrar Libro</h3>
          <input
            type="text"
            placeholder="Título del libro"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 focus:outline-none focus:border-salvia"
          />
          <input
            type="text"
            placeholder="Autor"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 focus:outline-none focus:border-salvia"
          />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-semibold text-cacao mb-1">
                Fecha de Préstamo
              </label>
              <input
                type="date"
                value={formData.dateCheckedOut}
                onChange={(e) => setFormData({ ...formData, dateCheckedOut: e.target.value })}
                className="w-full px-3 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cacao mb-1">
                Fecha de Retorno Esperado
              </label>
              <input
                type="date"
                value={formData.dateReturned}
                onChange={(e) => setFormData({ ...formData, dateReturned: e.target.value })}
                className="w-full px-3 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia text-sm"
              />
            </div>
          </div>
          <textarea
            placeholder="Notas (género, resumen, etc.)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg mb-3 min-h-20 focus:outline-none focus:border-salvia"
          />
          <div className="flex gap-2">
            <button onClick={addBook} className="flex-1 btn-primary">
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

      <div className="space-y-3">
        {filteredBooks.length === 0 ? (
          <p className="text-cacao">
            {filterActive ? 'Sin libros en préstamo' : 'Sin libros devueltos'}
          </p>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-tinta">{book.title}</h4>
                  <p className="text-sm text-cacao">{book.author}</p>
                </div>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="text-cacao hover:text-tinta"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-cacao mb-3">
                <div>
                  <p className="font-semibold">Desde:</p>
                  <p>{book.dateCheckedOut}</p>
                </div>
                {book.dateReturned ? (
                  <div>
                    <p className="font-semibold">Devuelto:</p>
                    <p>{book.dateReturned}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold">Retorno esperado:</p>
                    <p>{book.dateReturned || 'No especificado'}</p>
                  </div>
                )}
              </div>

              {book.notes && (
                <p className="text-sm text-tinta mb-3 p-2 bg-hueso rounded">
                  {book.notes}
                </p>
              )}

              {!book.dateReturned && (
                <button
                  onClick={() => markAsReturned(book.id)}
                  className="w-full btn-secondary text-sm py-2"
                >
                  Marcar como Devuelto
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
