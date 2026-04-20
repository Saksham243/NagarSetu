import { useState } from 'react'

function GrievanceCard({ grievance, onUpvote, onDelete, currentUserId, anonymousUpvotes = [] }) {
  const [upvoteLoading, setUpvoteLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isOwner = currentUserId === grievance.userId
  const hasUpvoted = currentUserId
    ? grievance.upvotedBy?.includes(currentUserId)
    : anonymousUpvotes.includes(grievance.id)

  const statusColors = {
    open: 'bg-gray-100 text-gray-800',
    under_review: 'bg-amber-100 text-amber-800',
    resolved: 'bg-green-100 text-green-800',
  }

  const handleUpvote = async () => {
    if (upvoteLoading) return

    try {
      setUpvoteLoading(true)
      await onUpvote(grievance.id, hasUpvoted)
    } catch (err) {
      console.error('Error updating upvote:', err)
    } finally {
      setUpvoteLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteLoading || !isOwner) return

    if (!confirm('Are you sure you want to delete this grievance?')) return

    try {
      setDeleteLoading(true)
      await onDelete(grievance.id)
    } catch (err) {
      console.error('Error deleting grievance:', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date'

    let date
    if (timestamp.toDate) {
      date = timestamp.toDate()
    } else {
      date = new Date(timestamp)
    }

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[grievance.status] || statusColors.open}`}>
            {grievance.status?.replace('_', ' ').toUpperCase() || 'OPEN'}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {grievance.category}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1"
            aria-label="Delete grievance"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {grievance.title}
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {grievance.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{grievance.state}</span>
        <span>{formatDate(grievance.createdAt)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpvote}
            disabled={upvoteLoading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              hasUpvoted
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {hasUpvoted ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            )}
            {grievance.upvoteCount || 0}
          </button>
        </div>

        <div className="text-sm text-gray-500">
          by {grievance.userName}
        </div>
      </div>
    </div>
  )
}

export default GrievanceCard