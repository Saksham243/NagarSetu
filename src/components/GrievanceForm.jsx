import { useState, useRef } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import stateList from '../utils/stateList'

function GrievanceForm({ onSubmitSuccess }) {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    state: '',
    category: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const formRef = useRef(null)

  const categories = [
    'Roads & Infrastructure',
    'Water & Sanitation',
    'Education',
    'Healthcare',
    'Electricity',
    'Other',
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    } else if (formData.title.length > 120) {
      newErrors.title = 'Title must be less than 120 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    if (!formData.state) {
      newErrors.state = 'State is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Scroll to form on validation error
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    try {
      setLoading(true)
      setSubmitError('')

      await addDoc(collection(db, 'grievances'), {
        userId: currentUser?.uid || 'anonymous',
        userName: currentUser?.displayName || currentUser?.email || 'Anonymous User',
        title: formData.title.trim(),
        description: formData.description.trim(),
        state: formData.state,
        category: formData.category,
        status: 'open',
        upvotedBy: [],
        anonymousUpvotes: 0,
        upvoteCount: 0,
        createdAt: serverTimestamp(),
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        state: '',
        category: '',
      })

      onSubmitSuccess()
    } catch (err) {
      console.error('Error submitting grievance:', err)
      setSubmitError('Failed to submit grievance. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={formRef} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Raise a Grievance
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={120}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Brief title for your grievance"
          />
          <div className="flex justify-between mt-1">
            {errors.title && (
              <span className="text-sm text-red-600">{errors.title}</span>
            )}
            <span className="text-sm text-gray-500">
              {formData.title.length}/120
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength={1000}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Detailed description of the issue"
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <span className="text-sm text-red-600">{errors.description}</span>
            )}
            <span className="text-sm text-gray-500">
              {formData.description.length}/1000
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select a state</option>
              {stateList.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <span className="text-sm text-red-600 mt-1 block">{errors.state}</span>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-sm text-red-600 mt-1 block">{errors.category}</span>
            )}
          </div>
        </div>

        {submitError && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Submitting...
            </>
          ) : (
            'Submit Grievance'
          )}
        </button>
      </form>
    </div>
  )
}

export default GrievanceForm