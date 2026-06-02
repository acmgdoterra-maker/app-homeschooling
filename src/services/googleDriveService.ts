import type { Child, Subject, DailyRecord, CalendarEvent, Photo, HabitTracking, LearningEntry, BookRecord, DocumentaryRecord, PersonalGoal, HourTracking } from '../types'

export interface BackupData {
  version: string
  timestamp: string
  children: Child[]
  subjects: Subject[]
  dailyRecords: DailyRecord[]
  calendarEvents: CalendarEvent[]
  photos: Photo[]
  habitTracking: HabitTracking[]
  learningEntries: LearningEntry[]
  bookRecords: BookRecord[]
  documentaryRecords: DocumentaryRecord[]
  personalGoals: PersonalGoal[]
  hourTracking: HourTracking[]
}

export class GoogleDriveService {
  private accessToken: string | null = null
  private fileId: string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
  }

  async createOrUpdateBackup(data: BackupData): Promise<boolean> {
    if (!this.accessToken) {
      console.error('No access token available')
      return false
    }

    try {
      const backupData = {
        ...data,
        timestamp: new Date().toISOString(),
      }

      // Crear o actualizar archivo en Google Drive
      const fileContent = JSON.stringify(backupData, null, 2)

      if (this.fileId) {
        // Actualizar archivo existente
        await this.updateFile(this.fileId, fileContent)
      } else {
        // Crear nuevo archivo
        this.fileId = await this.createFile('homeschooling-backup.json', fileContent)
      }

      return true
    } catch (error) {
      console.error('Error backing up to Google Drive:', error)
      return false
    }
  }

  private async createFile(fileName: string, content: string): Promise<string> {
    if (!this.accessToken) throw new Error('No access token')

    const metadata = {
      name: fileName,
      mimeType: 'application/json',
    }

    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', new Blob([content], { type: 'application/json' }))

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: form,
    })

    if (!response.ok) throw new Error(`Failed to create file: ${response.statusText}`)

    const result = await response.json()
    return result.id
  }

  private async updateFile(fileId: string, content: string): Promise<void> {
    if (!this.accessToken) throw new Error('No access token')

    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: content,
    })

    if (!response.ok) throw new Error(`Failed to update file: ${response.statusText}`)
  }

  async downloadBackup(): Promise<BackupData | null> {
    if (!this.accessToken || !this.fileId) {
      console.error('No access token or file ID')
      return null
    }

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${this.fileId}?alt=media`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (!response.ok) return null

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error downloading backup:', error)
      return null
    }
  }

  clearToken() {
    this.accessToken = null
    this.fileId = null
  }
}

export const googleDriveService = new GoogleDriveService()
