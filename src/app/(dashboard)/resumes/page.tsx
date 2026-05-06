'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Upload, Trash2, ExternalLink } from 'lucide-react'

export default function ResumesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const utils = trpc.useUtils()

  const { data: resumes, isLoading } = trpc.resume.getAll.useQuery()
  const { mutate: createResume } = trpc.resume.create.useMutation({
    onSuccess: () => {
      utils.resume.getAll.invalidate()
    }
  })
  const { mutate: deleteResume } = trpc.resume.delete.useMutation({
    onSuccess: () => {
      utils.resume.getAll.invalidate()
    }
  })

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (data.success) {
        createResume({
          name: data.name,
          fileUrl: data.fileUrl,
        })
        setFile(null)
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resumes</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>Upload a PDF of your resume to link to applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <Input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Button type="submit" disabled={!file || isUploading} className="w-full bg-orange-500 hover:bg-orange-600">
                {isUploading ? "Uploading..." : <><Upload className="w-4 h-4 mr-2" /> Upload</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading resumes...</div>
          ) : resumes?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border rounded-lg bg-white">No resumes uploaded yet.</div>
          ) : (
            resumes?.map((resume) => (
              <Card key={resume.id} className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{resume.name}</p>
                    <p className="text-sm text-gray-500">Uploaded {new Date(resume.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-orange-500 transition">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Button variant="ghost" size="icon" onClick={() => {
                    if (confirm('Delete this resume?')) deleteResume({ id: resume.id })
                  }}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
