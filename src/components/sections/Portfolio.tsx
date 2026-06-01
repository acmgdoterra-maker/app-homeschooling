import { useState, useEffect } from 'react'
import { db } from '../../db/database'
import jsPDF from 'jspdf'
import { DailyRecord, HabitTracking } from '../../types'

interface PortfolioProps {
  childId: string
}

export default function Portfolio({ childId }: PortfolioProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [records, setRecords] = useState<DailyRecord[]>([])
  const [habits, setHabits] = useState<HabitTracking[]>([])
  const [childName, setChildName] = useState('')

  useEffect(() => {
    loadData()
  }, [childId, selectedMonth])

  const loadData = async () => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
    const monthEnd = `${year}-${String(month).padStart(2, '0')}-31`

    const recs = await db.dailyRecords
      .where('childId')
      .equals(childId)
      .filter(r => r.date >= monthStart && r.date <= monthEnd)
      .toArray()
    setRecords(recs)

    const habs = await db.habitTracking
      .where('childId')
      .equals(childId)
      .filter(h => h.date >= monthStart && h.date <= monthEnd)
      .toArray()
    setHabits(habs)

    const child = await db.children.get(childId)
    if (child) setChildName(child.name)
  }

  const generatePDF = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPos = 15

    // Header
    doc.setFont('Playfair Display', 'bold')
    doc.setFontSize(24)
    doc.text(`Portafolio de ${childName}`, pageWidth / 2, yPos, { align: 'center' })

    yPos += 10
    doc.setFont('Inter', 'normal')
    doc.setFontSize(12)
    doc.text(`Mes: ${selectedMonth}`, pageWidth / 2, yPos, { align: 'center' })

    yPos += 15

    // Summary Stats
    doc.setFont('Playfair Display', 'bold')
    doc.setFontSize(14)
    doc.text('Resumen', 15, yPos)
    yPos += 8

    doc.setFont('Inter', 'normal')
    doc.setFontSize(11)
    doc.text(`Total de días trabajados: ${records.length}`, 20, yPos)
    yPos += 5
    doc.text(`Registros de hábitos: ${habits.length}`, 20, yPos)
    yPos += 5

    const avgAutonomy = habits.length > 0
      ? (habits.reduce((sum, h) => sum + h.habits.autonomy, 0) / habits.length).toFixed(1)
      : 'N/A'
    doc.text(`Promedio de Autonomía: ${avgAutonomy}`, 20, yPos)

    yPos += 15

    // Daily Records
    if (records.length > 0) {
      doc.setFont('Playfair Display', 'bold')
      doc.setFontSize(14)
      doc.text('Actividades Registradas', 15, yPos)
      yPos += 8

      doc.setFont('Inter', 'normal')
      doc.setFontSize(10)

      records.forEach((record, idx) => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 15
        }

        doc.setFont('Inter', 'bold')
        doc.text(`${record.date}`, 20, yPos)
        yPos += 5

        doc.setFont('Inter', 'normal')
        const lines = doc.splitTextToSize(record.description, pageWidth - 40)
        doc.text(lines, 20, yPos)
        yPos += lines.length * 4 + 3

        if (record.checklistItems.length > 0) {
          doc.setFont('Inter', 'bold')
          doc.setFontSize(9)
          doc.text('Avances:', 20, yPos)
          yPos += 4
          doc.setFont('Inter', 'normal')
          doc.setFontSize(9)
          record.checklistItems.forEach(item => {
            doc.text(`• ${item.title} ${item.completed ? '✓' : ''}`, 25, yPos)
            yPos += 3
          })
        }

        yPos += 2
      })
    }

    // Save
    doc.save(`portafolio-${childName}-${selectedMonth}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-cacao mb-2">
            Período a Reportar
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border-2 border-nude rounded-lg focus:outline-none focus:border-salvia"
          />
        </div>
        <button onClick={generatePDF} className="btn-primary whitespace-nowrap">
          📄 Descargar PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-sm text-cacao">Días Trabajados</p>
          <p className="text-3xl font-bold text-tinta">{records.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-cacao">Registros de Hábitos</p>
          <p className="text-3xl font-bold text-tinta">{habits.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-cacao">Promedio Autonomía</p>
          <p className="text-3xl font-bold text-salvia">
            {habits.length > 0
              ? (habits.reduce((sum, h) => sum + h.habits.autonomy, 0) / habits.length).toFixed(1)
              : 'N/A'}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-serif text-tinta mb-4">Registros del Mes</h3>
        {records.length === 0 ? (
          <p className="text-cacao">Sin registros para este período</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {records.map(record => (
              <div
                key={record.id}
                className="p-3 bg-hueso rounded-lg border-l-4 border-salvia"
              >
                <p className="font-semibold text-cacao text-sm">{record.date}</p>
                <p className="text-sm text-tinta mt-1 line-clamp-2">{record.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
