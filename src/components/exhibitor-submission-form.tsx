'use client'

import { useState, FormEvent } from 'react'
import '../app/styles/custom-form.css'

export default function ExhibitorSubmissionForm() {
  const [fileCount, setFileCount] = useState(1)

  const addFileInput = () => {
    if (fileCount < 100) {
      setFileCount(prevCount => prevCount + 1)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/submit-works', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        alert('Submission successful!')
      } else {
        alert('Submission failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form 
        onSubmit={handleSubmit}
        className="custom-form w-[90%] max-w-[500px] min-w-[300px] font-['IBM_Plex_Mono'] text-[13px] text-white pb-8"
      >
        <h1 className="text-2xl mb-8 text-center">NONTERRITORIAL MUSEUM</h1>
        <p className="mb-6 text-center">Submit your works for the exhibition</p>

        <fieldset className="border-none border-b-2 border-[#3b3b4f] pb-6 mb-6">
          <label htmlFor="name" className="block mb-2">
            YOUR NAME:
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="Full name" 
              required 
              className="custom-form-input w-full min-h-[2em]"
            />
          </label>

          <label htmlFor="email" className="block mt-4 mb-2">
            ENTER YOUR EMAIL:
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Enter valid email" 
              required 
              className="custom-form-input w-full min-h-[2em]"
            />
          </label>

          <label htmlFor="ton-wallet" className="block mt-4 mb-2">
            TON WALLET:
            <input 
              id="ton-wallet" 
              name="ton-wallet" 
              type="text" 
              pattern="[a-zA-Z0-9_-]{48,64}"
              title="Please enter a valid TON wallet address (48-64 characters, letters, numbers, hyphens, and underscores)."
              required 
              className="custom-form-input w-full min-h-[2em]"
            />
          </label>
        </fieldset>

        <fieldset className="border-none pb-6 mb-6">
          <label className="block mb-2">UPLOAD YOUR WORKS (1-100 FILES):</label>
          {[...Array(fileCount)].map((_, index) => (
            <input 
              key={index}
              type="file" 
              name={`work-${index + 1}`} 
              accept="image/*,video/*,audio/*,.pdf"
              className="custom-form-input w-full min-h-[2em]"
            />
          ))}
          {fileCount < 100 && (
            <button 
              type="button" 
              onClick={addFileInput} 
              className="mt-4 bg-[#3b3b4f] text-white border border-white text-sm px-4 py-2"
            >
              Add Another File
            </button>
          )}
        </fieldset>

        <div className="flex items-center mb-6 space-x-2">
          <input 
            type="radio" 
            id="terms" 
            name="terms" 
            required 
            className="custom-form-input w-4 h-4 bg-transparent border-[#616770]"
          />
          <label htmlFor="terms" className="text-xs">
            I ACCEPT THE <a href="https://nonterritorial.foundation" target="_blank" rel="noopener noreferrer" className="underline">TERMS AND CONDITIONS</a>
          </label>
        </div>

        <button 
          type="submit"
          className="custom-form-input block w-[60%] mx-auto h-8 text-sm bg-[#3b3b4f] border-white min-w-[250px] cursor-pointer"
        >
          Submit Works
        </button>
      </form>
    </div>
  )
}


