import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useStateContext } from '../context/StateContext'
import { useAuth } from '../context/AuthContext'
import useSchemes from '../hooks/useSchemes'
import SchemeCard from '../components/SchemeCard'
import { CATEGORIES } from '../utils/stateList'

function StateDashboard() {
  const { selectedState, selectedCategory, setSelectedCategory } = useStateContext()
  const { currentUser } = useAuth()
  const { schemes, loading, error } = useSchemes(selectedState, selectedCategory)
  const [savedSchemes, setSavedSchemes] = useState([])

  useEffect(() => {
    const fetchSavedSchemes = async () => {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          if (userDoc.exists()) {
            setSavedSchemes(userDoc.data().savedSchemes || [])
          }
        } catch (err) {
          console.error('Error fetching saved schemes:', err)
        }
      }
    }

    fetchSavedSchemes()
  }, [currentUser])

  const handleSaveScheme = async (schemeId) => {
    if (!currentUser?.uid) return

    try {
      const userRef = doc(db, 'users', currentUser.uid)
      const isSaved = savedSchemes.includes(schemeId)

      if (isSaved) {
        await updateDoc(userRef, {
          savedSchemes: arrayRemove(schemeId)
        })
        setSavedSchemes(prev => prev.filter(id => id !== schemeId))
      } else {
        await updateDoc(userRef, {
          savedSchemes: arrayUnion(schemeId)
        })
        setSavedSchemes(prev => [...prev, schemeId])
      }
    } catch (err) {
      console.error('Error updating saved schemes:', err)
    }
  }

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="h-12 w-full bg-gray-200 animate-pulse rounded mb-4"></div>
      <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-6"></div>
      <div className="flex items-center justify-between">
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Schemes for {selectedState}
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Change State
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No schemes found
          </h3>
          <p className="text-gray-600">
            No schemes are available for the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onSave={handleSaveScheme}
              isSaved={savedSchemes.includes(scheme.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StateDashboard