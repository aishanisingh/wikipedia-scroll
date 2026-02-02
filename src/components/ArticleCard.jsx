import { getWikipediaUrl, formatExtract } from '../utils/wikipedia'
import { usePreferences } from '../hooks/usePreferences'

function ArticleCard({ article }) {
  const { title, extract, thumbnail, topic, isDiscovery, content_urls } = article
  const { toggleLike, isArticleLiked } = usePreferences()
  const liked = isArticleLiked(title)

  const wikipediaUrl = content_urls?.desktop?.page || getWikipediaUrl(title)
  const formattedExtract = formatExtract(extract, 280)

  return (
    <article className="border-b border-gray-800 p-4 hover:bg-gray-900/50 transition-colors">
      <div className="flex gap-3">
        {/* Wikipedia "Avatar" */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
            {thumbnail?.source ? (
              <img
                src={thumbnail.source}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-8 h-8 text-gray-800"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021c-.052 0-.098-.015-.145-.051-.045-.031-.067-.076-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-.782.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.172-.346-.273-.857-.295l-.42-.016c-.061 0-.105-.014-.152-.045-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.03-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z" />
              </svg>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-white truncate">{title}</span>
            <span className="text-gray-500">@Wikipedia</span>
            {topic && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                isDiscovery
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {isDiscovery && topic !== 'Discover' ? 'You might like: ' : ''}{topic}
              </span>
            )}
          </div>

          {/* Article Extract */}
          <p className="text-gray-200 whitespace-pre-wrap break-words">
            {formattedExtract}
          </p>

          {/* Thumbnail if exists and no avatar thumbnail */}
          {thumbnail?.source && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-800 max-w-md">
              <img
                src={thumbnail.source}
                alt={title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <a
              href={wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span className="text-sm group-hover:underline">Read more</span>
            </a>

            <button className="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="text-sm">Share</span>
            </button>

            <button
              onClick={() => toggleLike(article)}
              className={`flex items-center gap-2 transition-colors ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm">{liked ? 'Liked' : 'Like'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard
