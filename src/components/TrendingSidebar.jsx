import { useState, useEffect } from 'react'
import { searchArticles, getWikipediaUrl } from '../utils/wikipedia'

function TrendingSidebar() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true)
      try {
        // Fetch some interesting topics
        const queries = ['2024', 'featured', 'science news']
        const allResults = []

        for (const query of queries) {
          const results = await searchArticles(query, 3)
          allResults.push(...results)
        }

        // Shuffle and take first 5
        const shuffled = allResults.sort(() => Math.random() - 0.5)
        setTrending(shuffled.slice(0, 5))
      } catch (error) {
        console.error('Error fetching trending:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  return (
    <aside className="w-80 h-screen sticky top-0 hidden lg:block p-4 overflow-y-auto">
      {/* Search Box */}
      <div className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search Wikipedia"
            className="w-full bg-gray-900 border border-gray-800 rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                window.open(
                  `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
                    e.target.value
                  )}`,
                  '_blank'
                )
              }
            }}
          />
        </div>
      </div>

      {/* Trending Section */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <h2 className="text-xl font-bold p-4">Trending Topics</h2>

        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : (
          <div>
            {trending.map((item, index) => (
              <a
                key={index}
                href={getWikipediaUrl(item.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 hover:bg-gray-800 transition-colors border-t border-gray-800"
              >
                <p className="text-xs text-gray-500">Trending</p>
                <p className="font-bold text-white">{item.title}</p>
                {item.snippet && (
                  <p
                    className="text-sm text-gray-400 mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: item.snippet.substring(0, 100) + '...',
                    }}
                  />
                )}
              </a>
            ))}
          </div>
        )}

        <a
          href="https://en.wikipedia.org/wiki/Portal:Current_events"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 text-blue-400 hover:bg-gray-800 transition-colors"
        >
          Show more
        </a>
      </div>

      {/* Footer Links */}
      <div className="mt-4 p-4 text-xs text-gray-500">
        <div className="flex flex-wrap gap-2">
          <a
            href="https://en.wikipedia.org/wiki/Wikipedia:About"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            About Wikipedia
          </a>
          <span>·</span>
          <a
            href="https://en.wikipedia.org/wiki/Wikipedia:Contact_us"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Contact
          </a>
          <span>·</span>
          <a
            href="https://donate.wikimedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Donate
          </a>
        </div>
        <p className="mt-2">WikiScroll is not affiliated with Wikipedia.</p>
      </div>
    </aside>
  )
}

export default TrendingSidebar
