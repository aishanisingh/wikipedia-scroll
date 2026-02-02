import { useState, useCallback, useEffect, useRef } from 'react'
import { getArticlesByTopics, getRandomArticle } from '../utils/wikipedia'

export function useWikipedia(selectedTopics, customTopics = {}) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const seenTitles = useRef(new Set())

  const loadArticles = useCallback(async (reset = false) => {
    if (loading) return

    setLoading(true)
    setError(null)

    if (reset) {
      seenTitles.current.clear()
      setArticles([])
    }

    try {
      let newArticles = []

      if (selectedTopics.length === 0) {
        // Get random articles if no topics selected
        const promises = Array(5).fill().map(() => getRandomArticle())
        const results = await Promise.all(promises)
        newArticles = results.filter(a => a !== null)
      } else {
        newArticles = await getArticlesByTopics(selectedTopics, 5, customTopics)
      }

      // Filter out articles we've already seen
      const uniqueArticles = newArticles.filter(article => {
        if (seenTitles.current.has(article.title)) {
          return false
        }
        seenTitles.current.add(article.title)
        return true
      })

      // Add unique IDs
      const articlesWithIds = uniqueArticles.map((article, index) => ({
        ...article,
        id: `${article.title}-${Date.now()}-${index}`,
      }))

      setArticles(prev => reset ? articlesWithIds : [...prev, ...articlesWithIds])
    } catch (err) {
      setError(err.message || 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [selectedTopics, customTopics, loading])

  const refresh = useCallback(() => {
    loadArticles(true)
  }, [loadArticles])

  const loadMore = useCallback(() => {
    loadArticles(false)
  }, [loadArticles])

  // Load initial articles when topics change
  useEffect(() => {
    loadArticles(true)
  }, [selectedTopics.join(',')])

  return {
    articles,
    loading,
    error,
    refresh,
    loadMore,
  }
}
