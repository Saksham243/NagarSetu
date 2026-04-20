const categoryColors = {
  Health: 'bg-green-100 text-green-800',
  Education: 'bg-blue-100 text-blue-800',
  Agriculture: 'bg-yellow-100 text-yellow-800',
  Employment: 'bg-purple-100 text-purple-800',
  Housing: 'bg-orange-100 text-orange-800',
  Financial: 'bg-red-100 text-red-800',
  Other: 'bg-gray-100 text-gray-800',
}

function SchemeCard({ scheme, onSave, isSaved }) {
  const handleKnowMore = () => {
    window.open(scheme.applyUrl, '_blank', 'noopener,noreferrer')
  }

  const handleSave = () => {
    onSave(scheme.id)
  }

  const categoryColor = categoryColors[scheme.category] || categoryColors.Other

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
          {scheme.category}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{scheme.title}</h3>

      <p className="text-gray-600 mb-4 line-clamp-3">{scheme.description}</p>

      <div className="mb-4">
        <div className="text-2xl font-bold text-green-600 mb-1">{scheme.benefit}</div>
        <div className="text-sm text-gray-500">Benefit amount</div>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        <span className="font-medium">Eligibility:</span> {scheme.eligibility}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleKnowMore}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Know More
        </button>
        <button
          onClick={handleSave}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2"
          aria-label={isSaved ? 'Remove from saved' : 'Save scheme'}
        >
          {isSaved ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default SchemeCard