import { useEffect, useRef, useCallback } from 'react'
import ArticleCard from './ArticleCard'
import LoadingSpinner from './LoadingSpinner'

function ArticleFeed({ articles, loading, error, onLoadMore, onRefresh }) {
  const observerTarget = useRef(null)

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && !loading) {
        onLoadMore()
      }
    },
    [loading, onLoadMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Explore</h1>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
            title="Refresh feed"
          >
            <svg
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 m-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
          <p>{error}</p>
          <button
            onClick={onRefresh}
            className="mt-2 text-sm text-blue-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Articles */}
      {articles.length === 0 && !loading && !error ? (
        <div className="p-8 text-center text-gray-500">
          <p>No articles to show.</p>
          <p className="text-sm mt-2">
            Select some topics in Settings to see relevant articles.
          </p>
        </div>
      ) : (
        <div>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <LoadingSpinner />}

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="h-10" />
    </div>
  )
}

export default ArticleFeed
