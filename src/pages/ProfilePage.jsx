import { useState, useEffect } from 'react'
import { getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import { useStateContext } from '../context/StateContext'
import SchemeCard from '../components/SchemeCard'
import stateList from '../utils/stateList'

function ProfilePage() {
  const { currentUser } = useAuth()
  const { selectedState, setSelectedState } = useStateContext()
  const [userData, setUserData] = useState(null)
  const [savedSchemes, setSavedSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingState, setEditingState] = useState(false)
  const [tempState, setTempState] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return

      try {
        setLoading(true)

        // Fetch user document
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData(data)
          setTempState(data.selectedState || 'Karnataka')

          // Fetch saved schemes
          if (data.savedSchemes && data.savedSchemes.length > 0) {
            const schemePromises = data.savedSchemes.map(schemeId =>
              getDoc(doc(db, 'schemes', schemeId))
            )
            const schemeDocs = await Promise.all(schemePromises)
            const schemes = schemeDocs
              .filter(doc => doc.exists())
              .map(doc => ({ id: doc.id, ...doc.data() }))
            setSavedSchemes(schemes)
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser])

  const handleStateChange = async () => {
    if (!currentUser?.uid) return

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        selectedState: tempState,
      })
      setSelectedState(tempState)
      setEditingState(false)
    } catch (err) {
      console.error('Error updating state:', err)
    }
  }

  const handleUnsaveScheme = async (schemeId) => {
    if (!currentUser?.uid) return

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        savedSchemes: arrayRemove(schemeId)
      })
      setSavedSchemes(prev => prev.filter(scheme => scheme.id !== schemeId))
    } catch (err) {
      console.error('Error removing saved scheme:', err)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    let date
    if (timestamp.toDate) {
      date = timestamp.toDate()
    } else {
      date = new Date(timestamp)
    }
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Profile
        </h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {currentUser?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentUser?.displayName || 'User'}
            </h2>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
        </div>

        {/* State Selection */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your State</h3>
            {!editingState && (
              <button
                onClick={() => setEditingState(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Change
              </button>
            )}
          </div>

          {editingState ? (
            <div className="flex gap-4">
              <select
                value={tempState}
                onChange={(e) => setTempState(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {stateList.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStateChange}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempState(selectedState)
                  setEditingState(false)
                }}
                className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-gray-700">{selectedState}</p>
          )}
        </div>

        {/* Account Info */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Info</h3>
          <p className="text-sm text-gray-600">
            Member since {formatDate(userData?.createdAt)}
          </p>
        </div>
      </div>

      {/* Saved Schemes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Saved Schemes
        </h2>

        {savedSchemes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved schemes
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't saved any schemes yet. Browse schemes to save ones that interest you.
            </p>
            <a
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors inline-block"
            >
              Browse Schemes
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onSave={handleUnsaveScheme}
                isSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage