import ArticleFeed from '../components/ArticleFeed'
import { useWikipedia } from '../hooks/useWikipedia'
import { usePreferences } from '../hooks/usePreferences'

function ExplorePage() {
  const { selectedTopics, customTopics } = usePreferences()
  const { articles, loading, error, refresh, loadMore } = useWikipedia(selectedTopics, customTopics)

  return (
    <ArticleFeed
      articles={articles}
      loading={loading}
      error={error}
      onLoadMore={loadMore}
      onRefresh={refresh}
    />
  )
}

export default ExplorePage
