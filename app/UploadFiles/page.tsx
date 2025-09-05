import React from 'react'
import UploadFiles from '../components/dashboard/UploadFiles'

export default function UploadFilesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Files</h1>
          <UploadFiles />
        </div>
      </div>
    </div>
  )
}
