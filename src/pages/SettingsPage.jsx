import { useState } from 'react'
import { usePreferences } from '../hooks/usePreferences'
import { AVAILABLE_TOPICS } from '../utils/wikipedia'

function SettingsPage() {
  const { selectedTopics, customTopics, toggleTopic, addCustomTopic, removeCustomTopic } = usePreferences()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')
  const [newTopicKeywords, setNewTopicKeywords] = useState('')

  const topicIcons = {
    'Science & Technology': '🔬',
    'History': '📜',
    'Arts & Entertainment': '🎨',
    'Sports': '⚽',
    'Geography': '🌍',
    'Politics': '🏛️',
    'Philosophy': '💭',
    'Nature & Biology': '🌿',
    'Mathematics': '📐',
    'Literature': '📚',
    'Medicine & Health': '🏥',
    'Business & Economics': '💼',
    'Psychology': '🧠',
    'Astronomy & Space': '🚀',
    'Food & Cuisine': '🍳',
    'Architecture': '🏰',
    'Religion & Mythology': '🙏',
    'Transportation': '🚗',
    'Discover': '✨',
  }

  const allTopics = [...AVAILABLE_TOPICS, ...Object.keys(customTopics)]

  const handleAddTopic = () => {
    if (newTopicName.trim() && newTopicKeywords.trim()) {
      const keywords = newTopicKeywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0)

      if (keywords.length > 0) {
        addCustomTopic(newTopicName.trim(), keywords)
        setNewTopicName('')
        setNewTopicKeywords('')
        setShowAddModal(false)
      }
    }
  }

  const isCustomTopic = (topic) => Object.keys(customTopics).includes(topic)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="p-4">
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Topics Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Your Interests</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Custom
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Select topics you're interested in. Your feed will show articles related to these topics.
          </p>

          <div className="space-y-2">
            {allTopics.map((topic) => {
              const isSelected = selectedTopics.includes(topic)
              const isCustom = isCustomTopic(topic)
              return (
                <div key={topic} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTopic(topic)}
                    className={`flex-1 flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                        : 'bg-gray-900 border-gray-800 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topicIcons[topic] || '✨'}</span>
                      <div className="text-left">
                        <span className="font-medium">{topic}</span>
                        {isCustom && (
                          <span className="ml-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-600'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                  {isCustom && (
                    <button
                      onClick={() => removeCustomTopic(topic)}
                      className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Delete custom topic"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Selected Topics Summary */}
        <section className="mb-8 p-4 bg-gray-900 rounded-xl">
          <h3 className="font-medium mb-2">Selected Topics ({selectedTopics.length})</h3>
          {selectedTopics.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No topics selected. You'll see random articles from all categories.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {topicIcons[topic] || '✨'} {topic}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="p-4 bg-gray-900 rounded-xl">
          <h3 className="font-medium mb-2">About WikiScroll</h3>
          <p className="text-gray-400 text-sm">
            WikiScroll is a doomscrolling-style app for exploring Wikipedia articles.
            Discover random articles based on your interests and learn something new with every scroll.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            This app uses the Wikipedia REST API. Not affiliated with Wikipedia or the Wikimedia Foundation.
          </p>
        </section>
      </div>

      {/* Add Custom Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Add Custom Category</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="e.g., Video Games"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Keywords (comma-separated)
                </label>
                <textarea
                  value={newTopicKeywords}
                  onChange={(e) => setNewTopicKeywords(e.target.value)}
                  placeholder="e.g., gaming, video game, playstation, nintendo, xbox"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter search keywords that will be used to find Wikipedia articles
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewTopicName('')
                  setNewTopicKeywords('')
                }}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTopic}
                disabled={!newTopicName.trim() || !newTopicKeywords.trim()}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-xl transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
