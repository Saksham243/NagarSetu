import { useState, useMemo } from 'react'
import useSchemes from '../hooks/useSchemes'
import useNews from '../hooks/useNews'

const TOPICS = [
  'Startup & Business',
  'Agriculture',
  'Education',
  'Health',
  'Housing',
  'Women & Family',
  'Environment',
  'Employment',
]

function TopicExplorer() {
  const [selectedTopic, setSelectedTopic] = useState('Startup & Business')
  const { schemes } = useSchemes('Central', 'All') // Fetch all central schemes
  const { articles, loading: newsLoading, error: newsError } = useNews(selectedTopic)

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => scheme.topic === selectedTopic)
  }, [schemes, selectedTopic])

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return 'Unknown date'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Topic Explorer
        </h1>
        <p className="text-gray-600">
          Discover government support and latest news for specific topics
        </p>
      </div>

      <div className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTopic === topic
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Government Support Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Government Support
          </h2>

          {filteredSchemes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-600">
                No schemes found for this topic.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchemes.map((scheme) => (
                <div key={scheme.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {scheme.title}
                  </h3>
                  <p className="text-green-600 font-medium mb-2">
                    {scheme.benefit}
                  </p>
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest News Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Latest News
          </h2>

          {newsError && (
            <div className="rounded-lg bg-red-50 p-4 text-red-800 mb-4">
              {newsError}
            </div>
          )}

          {newsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-full bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📰</div>
              <p className="text-gray-600">
                No news articles found for this topic.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.source_id}</span>
                    <span>{formatDate(article.pubDate)}</span>
                  </div>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read More →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopicExplorer