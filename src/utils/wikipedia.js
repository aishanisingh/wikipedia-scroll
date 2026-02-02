// Wikipedia API utility functions

export const DEFAULT_TOPICS = {
  'Science & Technology': ['quantum entanglement', 'crispr gene editing', 'bioluminescence', 'superconductor', 'fractal geometry', 'nanotechnology', 'fermentation process', 'aurora borealis phenomenon', 'deep sea vent', 'particle accelerator'],
  'History': ['silk road trade', 'viking exploration', 'samurai code', 'egyptian mummification', 'roman aqueduct', 'aztec sacrifice', 'industrial revolution invention', 'cold war espionage', 'ancient library', 'medieval plague'],
  'Arts & Entertainment': ['studio ghibli', 'art forgery', 'method acting', 'vinyl record', 'street art banksy', 'silent film era', 'broadway flop', 'concept album', 'animation rotoscope', 'cult classic film'],
  'Sports': ['chess grandmaster', 'extreme ironing', 'ancient olympic', 'sports superstition', 'underdog victory', 'sports riot', 'discontinued olympic sport', 'athlete defection', 'marathon history', 'sports curse'],
  'Geography': ['volcanic island formation', 'ghost town abandoned', 'border dispute', 'microstate', 'extreme weather event', 'underwater cave', 'salt flat', 'bioluminescent bay', 'disputed territory', 'geographic anomaly'],
  'Politics': ['political assassination', 'diplomatic incident', 'coup attempt', 'propaganda poster', 'political scandal', 'exile government', 'secret police', 'peace treaty negotiation', 'political dynasty', 'referendum controversial'],
  'Philosophy': ['thought experiment trolley', 'philosophical zombie', 'existential dread', 'stoic philosophy', 'paradox zeno', 'absurdism camus', 'social contract theory', 'nihilism', 'epistemology skepticism', 'free will debate'],
  'Nature & Biology': ['extremophile organism', 'mimic octopus', 'carnivorous plant', 'symbiotic relationship', 'animal migration', 'bioluminescent creature', 'parasitic behavior', 'convergent evolution', 'island gigantism', 'zombie fungus ant'],
  'Mathematics': ['unsolved math problem', 'infinity paradox', 'golden ratio nature', 'game theory prisoner', 'cryptography enigma', 'fibonacci sequence', 'mathematical proof elegant', 'topology mobius', 'chaos theory butterfly', 'prime number mystery'],
  'Literature': ['unreliable narrator', 'banned book controversy', 'literary hoax', 'pen name famous', 'unfinished novel', 'lost manuscript', 'dystopian fiction', 'magical realism', 'stream of consciousness', 'epistolary novel'],
  'Medicine & Health': ['placebo effect', 'medical mystery diagnosis', 'phantom limb', 'disease eradication', 'surgical innovation', 'epidemic outbreak', 'medical ethics controversy', 'rare genetic disorder', 'sleep paralysis', 'synesthesia condition'],
  'Business & Economics': ['market crash', 'ponzi scheme', 'hyperinflation', 'corporate espionage', 'monopoly antitrust', 'startup failure famous', 'economic bubble', 'hostile takeover', 'bankruptcy famous', 'trade embargo'],
  'Psychology': ['cognitive bias', 'stanford prison experiment', 'false memory', 'mass hysteria', 'stockholm syndrome', 'impostor syndrome', 'lucid dreaming', 'optical illusion', 'pavlov conditioning', 'groupthink phenomenon'],
  'Astronomy & Space': ['exoplanet habitable', 'black hole collision', 'space debris problem', 'pulsar magnetar', 'asteroid mining', 'voyager golden record', 'cosmic microwave background', 'dark matter mystery', 'space station incident', 'meteor impact event'],
  'Food & Cuisine': ['fermented food traditional', 'food taboo culture', 'spice trade history', 'molecular gastronomy', 'street food origin', 'food poisoning outbreak', 'high-altitude cooking', 'food authenticity', 'forbidden fruit', 'insect cuisine'],
  'Architecture': ['brutalist architecture', 'building collapse disaster', 'unfinished cathedral', 'underground city', 'floating architecture', 'prison architecture', 'haunted building', 'architectural folly', 'bunker architecture', 'tree house elaborate'],
  'Religion & Mythology': ['cargo cult', 'creation myth', 'religious relic', 'doomsday cult', 'trickster god', 'pilgrimage route', 'religious schism', 'mythical creature sighting', 'sacred geometry', 'apocalyptic prophecy'],
  'Transportation': ['shipwreck famous', 'aviation disaster', 'train heist', 'submarine exploration', 'airship disaster', 'smuggling route', 'ghost ship', 'land speed record', 'canal construction', 'bridge collapse'],
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
    'Science & Technology': ['Mathematics', 'Astronomy & Space', 'Medicine & Health', 'Nature & Biology'],
    'History': ['Politics', 'Geography', 'Religion & Mythology', 'Architecture'],
    'Arts & Entertainment': ['Literature', 'Psychology', 'Philosophy', 'Architecture'],
    'Sports': ['History', 'Psychology', 'Business & Economics', 'Medicine & Health'],
    'Geography': ['History', 'Nature & Biology', 'Transportation', 'Architecture'],
    'Politics': ['History', 'Business & Economics', 'Philosophy', 'Religion & Mythology'],
    'Philosophy': ['Psychology', 'Religion & Mythology', 'Literature', 'Science & Technology'],
    'Nature & Biology': ['Geography', 'Science & Technology', 'Food & Cuisine', 'Medicine & Health'],
    'Mathematics': ['Science & Technology', 'Philosophy', 'Astronomy & Space', 'Psychology'],
    'Literature': ['Arts & Entertainment', 'History', 'Philosophy', 'Psychology'],
    'Medicine & Health': ['Science & Technology', 'Psychology', 'Nature & Biology', 'History'],
    'Business & Economics': ['Politics', 'History', 'Mathematics', 'Psychology'],
    'Psychology': ['Philosophy', 'Medicine & Health', 'Science & Technology', 'Arts & Entertainment'],
    'Astronomy & Space': ['Science & Technology', 'Mathematics', 'Philosophy', 'History'],
    'Food & Cuisine': ['Geography', 'Nature & Biology', 'History', 'Science & Technology'],
    'Architecture': ['Arts & Entertainment', 'History', 'Geography', 'Religion & Mythology'],
    'Religion & Mythology': ['History', 'Philosophy', 'Literature', 'Psychology'],
    'Transportation': ['Science & Technology', 'History', 'Geography', 'Business & Economics'],
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
