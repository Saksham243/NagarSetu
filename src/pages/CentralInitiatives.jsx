import { useState, useMemo } from 'react'
import { useStateContext } from '../context/StateContext'
import useSchemes from '../hooks/useSchemes'
import SchemeCard from '../components/SchemeCard'
import { CATEGORIES } from '../utils/stateList'

function CentralInitiatives() {
  const { selectedCategory, setSelectedCategory } = useStateContext()
  const { schemes, loading, error } = useSchemes('Central', selectedCategory)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSchemes = useMemo(() => {
    if (!searchQuery.trim()) {
      return schemes
    }
    return schemes.filter(scheme =>
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [schemes, searchQuery])

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Central Government Initiatives
          </h1>
          <p className="text-gray-600">
            Major national schemes from the Government of India
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
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
      ) : filteredSchemes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No schemes found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'No schemes match your search criteria.'
              : 'No schemes are available for the selected category.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              onSave={() => {}} // Central initiatives don't have save functionality
              isSaved={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CentralInitiatives