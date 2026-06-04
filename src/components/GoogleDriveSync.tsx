import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { googleDriveService } from '../services/googleDriveService'
import { db } from '../db/database'
import type { BackupData } from '../services/googleDriveService'

export default function GoogleDriveSync() {
  const [isConnected, setIsConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('✓ OAuth successful')
      if (tokenResponse.access_token) {
        console.log('✓ Access token received')
        googleDriveService.setAccessToken(tokenResponse.access_token)
        setIsConnected(true)
        await syncNow()
      }
    },
    onError: (error) => {
      console.error('✗ OAuth error:', error)
    },
    flow: 'implicit',
    scope: 'https://www.googleapis.com/auth/drive.file',
  })

  const syncNow = async () => {
    setIsSyncing(true)
    try {
      // Obtener todos los datos de la base de datos
      const [
        children,
        subjects,
        dailyRecords,
        calendarEvents,
        photos,
        habitTracking,
        learningEntries,
        bookRecords,
        documentaryRecords,
        personalGoals,
        hourTracking,
      ] = await Promise.all([
        db.children.toArray(),
        db.subjects.toArray(),
        db.dailyRecords.toArray(),
        db.calendarEvents.toArray(),
        db.photos.toArray(),
        db.habitTracking.toArray(),
        db.learningEntries.toArray(),
        db.bookRecords.toArray(),
        db.documentaryRecords.toArray(),
        db.personalGoals.toArray(),
        db.hourTracking.toArray(),
      ])

      const backupData: BackupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        children,
        subjects,
        dailyRecords,
        calendarEvents,
        photos,
        habitTracking,
        learningEntries,
        bookRecords,
        documentaryRecords,
        personalGoals,
        hourTracking,
      }

      const success = await googleDriveService.createOrUpdateBackup(backupData)
      if (success) {
        setLastSync(new Date().toLocaleString())
      }
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLogout = () => {
    googleDriveService.clearToken()
    setIsConnected(false)
    setLastSync(null)
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      {isConnected ? (
        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-salvia max-w-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-tinta">Google Drive Conectado</span>
          </div>
          {lastSync && (
            <p className="text-xs text-cacao mb-3">Último sync: {lastSync}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={syncNow}
              disabled={isSyncing}
              className="flex-1 px-3 py-2 bg-salvia text-tinta rounded text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50"
            >
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-nude text-tinta rounded text-sm font-semibold hover:bg-opacity-80"
            >
              Desconectar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => googleLogin()}
          className="px-4 py-3 bg-salvia text-tinta rounded-lg font-semibold shadow-lg hover:bg-opacity-90 transition text-sm"
        >
          Conectar Google Drive
        </button>
      )}
    </div>
  )
}
