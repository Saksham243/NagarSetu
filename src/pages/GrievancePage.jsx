import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateDoc, doc, arrayUnion, arrayRemove, increment, deleteDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from '../context/AuthContext'
import useGrievances from '../hooks/useGrievances'
import GrievanceForm from '../components/GrievanceForm'
import GrievanceCard from '../components/GrievanceCard'
import stateList from '../utils/stateList'

function GrievancePage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [stateFilter, setStateFilter] = useState('All')
  const { grievances, loading, error, refetch } = useGrievances(stateFilter)

  // Track anonymous upvotes using localStorage
  const [anonymousUpvotes, setAnonymousUpvotes] = useState(() => {
    const stored = localStorage.getItem('anonymousUpvotes')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('anonymousUpvotes', JSON.stringify(anonymousUpvotes))
  }, [anonymousUpvotes])

  const handleUpvote = async (grievanceId, isRemoving) => {
    const grievanceRef = doc(db, 'grievances', grievanceId)

    if (currentUser) {
      // Authenticated user upvoting
      if (isRemoving) {
        await updateDoc(grievanceRef, {
          upvotedBy: arrayRemove(currentUser.uid),
          upvoteCount: increment(-1),
        })
      } else {
        await updateDoc(grievanceRef, {
          upvotedBy: arrayUnion(currentUser.uid),
          upvoteCount: increment(1),
        })
      }
    } else {
      // Anonymous user upvoting
      const hasUpvoted = anonymousUpvotes.includes(grievanceId)

      if (isRemoving && hasUpvoted) {
        // Remove upvote
        setAnonymousUpvotes(prev => prev.filter(id => id !== grievanceId))
        await updateDoc(grievanceRef, {
          anonymousUpvotes: increment(-1),
          upvoteCount: increment(-1),
        })
      } else if (!isRemoving && !hasUpvoted) {
        // Add upvote
        setAnonymousUpvotes(prev => [...prev, grievanceId])
        await updateDoc(grievanceRef, {
          anonymousUpvotes: increment(1),
          upvoteCount: increment(1),
        })
      }
    }

    refetch()
  }

  const handleDelete = async (grievanceId) => {
    await deleteDoc(doc(db, 'grievances', grievanceId))
    refetch()
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    refetch()
  }

  const handleRaiseIssueClick = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/grievances' } })
      return
    }

    setShowForm((prev) => !prev)
  }

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
        <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Grievance Portal
        </h1>
        <p className="text-gray-600">
          Raise issues directly. Let others upvote what matters.
        </p>
      </div>

      <div className="mb-8">
        <button
          onClick={handleRaiseIssueClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : 'Raise an Issue'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <GrievanceForm onSubmitSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="mb-8">
        <label htmlFor="stateFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by State
        </label>
        <select
          id="stateFilter"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="All">All States</option>
          {stateList.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : grievances.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No grievances found
          </h3>
          <p className="text-gray-600">
            {stateFilter === 'All'
              ? 'No grievances have been submitted yet.'
              : `No grievances found for ${stateFilter}.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grievances.map((grievance) => (
            <GrievanceCard
              key={grievance.id}
              grievance={grievance}
              onUpvote={handleUpvote}
              onDelete={handleDelete}
              currentUserId={currentUser?.uid}
              anonymousUpvotes={anonymousUpvotes}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default GrievancePage