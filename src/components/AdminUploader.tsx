'use client'

import React, { useState, FormEvent } from 'react'

export function AdminUploader() {
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUploading(true)
    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        alert('Upload successful!')
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form 
        onSubmit={handleSubmit}
        className="w-[90%] max-w-[500px] min-w-[300px] space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">Admin Upload</h2>
        
        <div>
          <label className="block text-sm font-medium text-white">
            Upload Files
            <input 
              type="file" 
              name="files" 
              multiple 
              accept="image/*,video/*,audio/*,.pdf"
              className="mt-1 block w-full text-white bg-transparent border border-gray-600 rounded-md shadow-sm"
            />
          </label>
        </div>

        <button 
          type="submit"
          disabled={isUploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b3b4f] hover:bg-[#2d2d3d] disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}


