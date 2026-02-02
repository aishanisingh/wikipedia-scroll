import { usePreferences } from '../hooks/usePreferences'
import ArticleCard from '../components/ArticleCard'

function LikedPage() {
  const { likedArticles } = usePreferences()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="p-4">
          <h1 className="text-xl font-bold">Liked Articles</h1>
          <p className="text-gray-500 text-sm">{likedArticles.length} articles</p>
        </div>
      </div>

      {/* Content */}
      {likedArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 mb-4 text-gray-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-400 mb-2">No liked articles yet</h2>
          <p className="text-gray-500 text-sm">
            Articles you like will appear here. Start exploring and tap the heart on articles you enjoy!
          </p>
        </div>
      ) : (
        <div>
          {likedArticles.map((article) => (
            <ArticleCard
              key={article.title}
              article={{ ...article, id: article.title }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default LikedPage
