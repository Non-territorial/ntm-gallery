'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import styles from './SubmitArtworkForm.module.css'

export default function SubmitArtworkForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    tonWallet: '',
    acceptTerms: false
  })
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      if (fileList.length > 1000) {
        alert('You can only upload up to 1000 files.')
        return
      }
      setFiles(fileList)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      alert('Please select at least one file to upload.')
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('fullName', formData.fullName)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('tonWallet', formData.tonWallet)
    files.forEach((file) => formDataToSend.append('files', file))

    try {
      const response = await fetch('/api/submit-artwork', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        alert('Artwork submitted successfully!')
        setFormData({ fullName: '', email: '', tonWallet: '', acceptTerms: false })
        setFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        alert('Failed to submit artwork. Please try again.')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className={`${styles.formContainer} ${styles.fontIsocpeur} min-h-screen p-6 flex flex-col items-center`}>
      <h1 className="text-2xl mb-4">NONTERRITORIAL MUSEUM</h1>
      
      <p className="text-center mb-8 max-w-md">
        Upload your work here, we will turn it into our Exhibition Format and make it ready to be hosted.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <label className="block">Your Name:</label>
          <input
            type="text"
            placeholder="Full name"
            className="w-full bg-black border border-white/20 p-2 rounded-none text-white placeholder:text-gray-500"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block">Enter Your Email:</label>
          <input
            type="email"
            placeholder="Enter valid email"
            className="w-full bg-black border border-white/20 p-2 rounded-none text-white placeholder:text-gray-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block">TON Wallet:</label>
          <input
            type="text"
            className="w-full bg-black border border-white/20 p-2 rounded-none text-white"
            value={formData.tonWallet}
            onChange={(e) => setFormData({ ...formData, tonWallet: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block">Upload Your Work (1-1000 files):</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            required
            className="w-full bg-black border border-white/20 p-2 rounded-none text-white file:bg-white/10 file:text-white file:border-0 file:rounded-none file:px-2 file:py-1"
          />
          <p className="text-sm text-gray-400">Selected files: {files.length}</p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            className="border-white/20"
          />
          <label htmlFor="terms" className="text-sm">
            I accept the{' '}
            <Link href="/terms" className="underline">
              terms and conditions
            </Link>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-white/10 hover:bg-white/20 text-white p-2 transition-colors"
          disabled={!formData.acceptTerms}
        >
          Submit
        </button>
      </form>
    </div>
  )
}


