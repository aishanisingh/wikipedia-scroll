import { useState, useEffect } from 'react'
import { AVAILABLE_TOPICS } from '../utils/wikipedia'

const STORAGE_KEY = 'wikiscroll-preferences'

const DEFAULT_PREFERENCES = {
  selectedTopics: AVAILABLE_TOPICS.slice(0, 3), // Default to first 3 topics
  customTopics: {}, // { 'Topic Name': ['keyword1', 'keyword2', ...] }
  likedArticles: [], // Array of liked article objects
}

export function usePreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure customTopics exists for backwards compatibility
        return {
          ...DEFAULT_PREFERENCES,
          ...parsed,
          customTopics: parsed.customTopics || {},
          likedArticles: parsed.likedArticles || [],
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
    return DEFAULT_PREFERENCES
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }, [preferences])

  const toggleTopic = (topic) => {
    setPreferences(prev => {
      const isSelected = prev.selectedTopics.includes(topic)
      const newTopics = isSelected
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic]
      return { ...prev, selectedTopics: newTopics }
    })
  }

  const setSelectedTopics = (topics) => {
    setPreferences(prev => ({ ...prev, selectedTopics: topics }))
  }

  const addCustomTopic = (name, keywords) => {
    setPreferences(prev => ({
      ...prev,
      customTopics: {
        ...prev.customTopics,
        [name]: keywords,
      },
    }))
  }

  const removeCustomTopic = (name) => {
    setPreferences(prev => {
      const { [name]: removed, ...remainingCustomTopics } = prev.customTopics
      return {
        ...prev,
        customTopics: remainingCustomTopics,
        selectedTopics: prev.selectedTopics.filter(t => t !== name),
      }
    })
  }

  const updateCustomTopic = (oldName, newName, keywords) => {
    setPreferences(prev => {
      const { [oldName]: removed, ...remainingCustomTopics } = prev.customTopics
      const newSelectedTopics = prev.selectedTopics.map(t =>
        t === oldName ? newName : t
      )
      return {
        ...prev,
        customTopics: {
          ...remainingCustomTopics,
          [newName]: keywords,
        },
        selectedTopics: newSelectedTopics,
      }
    })
  }

  const toggleLike = (article) => {
    setPreferences(prev => {
      const isLiked = prev.likedArticles.some(a => a.title === article.title)
      if (isLiked) {
        return {
          ...prev,
          likedArticles: prev.likedArticles.filter(a => a.title !== article.title),
        }
      } else {
        // Store essential article data
        const articleToSave = {
          title: article.title,
          extract: article.extract,
          thumbnail: article.thumbnail,
          topic: article.topic,
          content_urls: article.content_urls,
          likedAt: Date.now(),
        }
        return {
          ...prev,
          likedArticles: [articleToSave, ...prev.likedArticles],
        }
      }
    })
  }

  const isArticleLiked = (title) => {
    return preferences.likedArticles.some(a => a.title === title)
  }

  return {
    selectedTopics: preferences.selectedTopics,
    customTopics: preferences.customTopics,
    likedArticles: preferences.likedArticles,
    toggleTopic,
    setSelectedTopics,
    addCustomTopic,
    removeCustomTopic,
    updateCustomTopic,
    toggleLike,
    isArticleLiked,
  }
}
