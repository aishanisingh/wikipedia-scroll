// Wikipedia API utility functions

export const DEFAULT_TOPICS = {
  'Science & Technology': ['science', 'technology', 'computer', 'physics', 'chemistry', 'engineering'],
  'History': ['history', 'war', 'ancient', 'medieval', 'civilization', 'empire'],
  'Arts & Entertainment': ['art', 'music', 'film', 'television', 'theater', 'painting'],
  'Sports': ['sport', 'football', 'basketball', 'olympics', 'athlete', 'championship'],
  'Geography': ['geography', 'country', 'city', 'mountain', 'river', 'ocean'],
  'Politics': ['politics', 'government', 'democracy', 'election', 'president', 'law'],
  'Philosophy': ['philosophy', 'ethics', 'logic', 'metaphysics', 'epistemology'],
  'Nature & Biology': ['biology', 'animal', 'plant', 'ecology', 'evolution', 'species'],
  'Mathematics': ['mathematics', 'algebra', 'geometry', 'calculus', 'theorem'],
  'Literature': ['literature', 'novel', 'poetry', 'author', 'book', 'fiction'],
  'Medicine & Health': ['medicine', 'disease', 'health', 'medical', 'hospital', 'doctor'],
  'Business & Economics': ['business', 'economics', 'finance', 'trade', 'market', 'company'],
  'Psychology': ['psychology', 'behavior', 'mind', 'cognitive', 'mental', 'personality'],
  'Astronomy & Space': ['astronomy', 'space', 'planet', 'star', 'galaxy', 'universe'],
  'Food & Cuisine': ['food', 'cuisine', 'cooking', 'recipe', 'restaurant', 'dish'],
  'Architecture': ['architecture', 'building', 'design', 'structure', 'monument', 'cathedral'],
  'Religion & Mythology': ['religion', 'mythology', 'god', 'spiritual', 'sacred', 'worship'],
  'Transportation': ['transportation', 'vehicle', 'car', 'train', 'aviation', 'ship'],
}

export const AVAILABLE_TOPICS = Object.keys(DEFAULT_TOPICS)

// Get all topics including custom ones
export function getAllTopics(customTopics = {}) {
  return { ...DEFAULT_TOPICS, ...customTopics }
}

export function getAllTopicNames(customTopics = {}) {
  return Object.keys(getAllTopics(customTopics))
}

export async function getRandomArticle() {
  try {
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
    if (!response.ok) throw new Error('Failed to fetch random article')
    return await response.json()
  } catch (error) {
    console.error('Error fetching random article:', error)
    return null
  }
}

export async function searchArticles(query, limit = 10) {
  try {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: limit,
      format: 'json',
      origin: '*',
    })

    const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`)
    if (!response.ok) throw new Error('Failed to search articles')

    const data = await response.json()
    return data.query?.search || []
  } catch (error) {
    console.error('Error searching articles:', error)
    return []
  }
}

export async function getArticleSummary(title) {
  try {
    const encodedTitle = encodeURIComponent(title)
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`)
    if (!response.ok) throw new Error('Failed to fetch article summary')
    return await response.json()
  } catch (error) {
    console.error('Error fetching article summary:', error)
    return null
  }
}

// Get articles from topics the user might like based on their selections
function getRelatedTopics(selectedTopics, allTopics) {
  const topicRelations = {
    'Science & Technology': ['Mathematics', 'Astronomy & Space', 'Medicine & Health'],
    'History': ['Politics', 'Geography', 'Religion & Mythology'],
    'Arts & Entertainment': ['Literature', 'Music', 'Philosophy'],
    'Sports': ['History', 'Geography', 'Business & Economics'],
    'Geography': ['History', 'Nature & Biology', 'Transportation'],
    'Politics': ['History', 'Business & Economics', 'Philosophy'],
    'Philosophy': ['Psychology', 'Religion & Mythology', 'Literature'],
    'Nature & Biology': ['Geography', 'Science & Technology', 'Food & Cuisine'],
    'Mathematics': ['Science & Technology', 'Philosophy', 'Astronomy & Space'],
    'Literature': ['Arts & Entertainment', 'History', 'Philosophy'],
    'Medicine & Health': ['Science & Technology', 'Psychology', 'Nature & Biology'],
    'Business & Economics': ['Politics', 'History', 'Mathematics'],
    'Psychology': ['Philosophy', 'Medicine & Health', 'Science & Technology'],
    'Astronomy & Space': ['Science & Technology', 'Mathematics', 'Philosophy'],
    'Food & Cuisine': ['Geography', 'Nature & Biology', 'History'],
    'Architecture': ['Arts & Entertainment', 'History', 'Geography'],
    'Religion & Mythology': ['History', 'Philosophy', 'Literature'],
    'Transportation': ['Science & Technology', 'History', 'Geography'],
  }

  const related = new Set()
  const allTopicNames = Object.keys(allTopics)

  selectedTopics.forEach(topic => {
    const relations = topicRelations[topic] || []
    relations.forEach(r => {
      if (!selectedTopics.includes(r) && allTopicNames.includes(r)) {
        related.add(r)
      }
    })
  })

  // Also add some random unselected topics for variety
  const unselectedTopics = allTopicNames.filter(t => !selectedTopics.includes(t) && !related.has(t))
  const shuffledUnselected = unselectedTopics.sort(() => Math.random() - 0.5)
  shuffledUnselected.slice(0, 2).forEach(t => related.add(t))

  return Array.from(related)
}

export async function getArticlesByTopics(topics, count = 5, customTopics = {}) {
  const fetchPromises = []
  const allTopics = getAllTopics(customTopics)

  if (topics.length === 0) {
    // If no topics selected, get random articles
    for (let i = 0; i < count; i++) {
      fetchPromises.push(getRandomArticle())
    }
  } else {
    // Mix: ~70% from selected topics, ~30% discovery (related topics or random)
    const selectedCount = Math.ceil(count * 0.7)
    const discoveryCount = count - selectedCount

    // Get search terms for selected topics
    const searchTerms = topics.flatMap(topic => allTopics[topic] || [])
    const shuffledTerms = searchTerms.sort(() => Math.random() - 0.5)

    // Fetch articles from selected topics
    for (let i = 0; i < selectedCount; i++) {
      const term = shuffledTerms[i % shuffledTerms.length]
      fetchPromises.push(
        searchArticles(term, 5).then(async results => {
          if (results.length > 0) {
            const randomResult = results[Math.floor(Math.random() * results.length)]
            const summary = await getArticleSummary(randomResult.title)
            if (summary) {
              const matchedTopic = topics.find(t =>
                allTopics[t]?.some(keyword =>
                  term.toLowerCase().includes(keyword.toLowerCase())
                )
              )
              return { ...summary, topic: matchedTopic || topics[0] }
            }
          }
          return null
        })
      )
    }

    // Fetch discovery articles (from related topics or random)
    const relatedTopics = getRelatedTopics(topics, allTopics)

    for (let i = 0; i < discoveryCount; i++) {
      // 50% chance to use related topic, 50% chance for random article
      if (relatedTopics.length > 0 && Math.random() > 0.5) {
        const relatedTopic = relatedTopics[i % relatedTopics.length]
        const relatedTerms = allTopics[relatedTopic] || []
        const term = relatedTerms[Math.floor(Math.random() * relatedTerms.length)]

        fetchPromises.push(
          searchArticles(term, 5).then(async results => {
            if (results.length > 0) {
              const randomResult = results[Math.floor(Math.random() * results.length)]
              const summary = await getArticleSummary(randomResult.title)
              if (summary) {
                return { ...summary, topic: relatedTopic, isDiscovery: true }
              }
            }
            return null
          })
        )
      } else {
        // Random article for discovery
        fetchPromises.push(
          getRandomArticle().then(article => {
            if (article) {
              return { ...article, topic: 'Discover', isDiscovery: true }
            }
            return null
          })
        )
      }
    }
  }

  const results = await Promise.all(fetchPromises)
  // Shuffle results so discovery articles are mixed in
  return results.filter(article => article !== null).sort(() => Math.random() - 0.5)
}

export async function getTrendingTopics() {
  // Fetch some popular articles to show as "trending"
  const trendingQueries = ['current events', 'featured article', 'today']
  const trending = []

  for (const query of trendingQueries) {
    const results = await searchArticles(query, 3)
    trending.push(...results.slice(0, 2))
  }

  return trending.slice(0, 5)
}

export function formatExtract(extract, maxLength = 280) {
  if (!extract) return ''
  if (extract.length <= maxLength) return extract
  return extract.substring(0, maxLength).trim() + '...'
}

export function getWikipediaUrl(title) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
}
