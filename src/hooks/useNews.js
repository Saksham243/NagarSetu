import { useState, useEffect } from 'react'

function useNews(topic) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      if (!topic) return

      try {
        setLoading(true)
        setError(null)
        setArticles([]) // Clear previous articles

        const newsUrl = `https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWS_API_KEY}&country=in&language=en&q=${encodeURIComponent(topic + " government scheme")}`
        
        // Use CORS proxy for browser requests
        const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${newsUrl}`
        
        const response = await fetch(corsProxyUrl)

        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }

        const data = await response.json()

        if (data.status !== 'success') {
          throw new Error('News API returned an error')
        }

        const filteredArticles = (data.results || [])
          .filter(article => article.title && article.description)
          .slice(0, 8)
          .map(article => ({
            title: article.title,
            description: article.description,
            link: article.link,
            pubDate: article.pubDate,
            source_id: article.source_id,
          }))

        setArticles(filteredArticles)
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [topic])

  return { articles, loading, error }
}

export default useNews