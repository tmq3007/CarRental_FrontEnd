"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, MapPin, Send } from "lucide-react"
import useDebounce from "@/lib/hook/use-debounce"

export interface Action {
  id: string
  label: string
  icon?: React.ReactNode
  description?: string
  short?: string
  end?: string
}

interface ActionSearchBarProps {
  actions: Action[]
  placeholder?: string
  label?: string
  onActionSelect?: (action: Action | null) => void
  selectedAction?: Action | null
}

function ActionSearchBar({
  actions,
  placeholder = "Search...",
  label = "Select",
  onActionSelect,
  selectedAction: externalSelectedAction,
}: ActionSearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [internalSelectedAction, setInternalSelectedAction] = useState<Action | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 200)

  useEffect(() => {
    // Sync with external selected action
    if (externalSelectedAction) {
      setInternalSelectedAction(externalSelectedAction)
      setQuery(externalSelectedAction.label)
    } else if (!query && !internalSelectedAction) {
      setQuery("")
    }
  }, [externalSelectedAction, query, internalSelectedAction])

  useEffect(() => {
    // Filter actions based on debounced query
    const filteredActions = debouncedQuery
      ? actions.filter((action) =>
          action.label.toLowerCase().includes(debouncedQuery.toLowerCase())
        )
      : actions
    setHighlightedIndex(filteredActions.length > 0 ? 0 : null)
    setIsOpen(!!debouncedQuery || isOpen)
  }, [debouncedQuery, actions, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (!isOpen) setIsOpen(true)
    if (e.target.value === "") {
      setInternalSelectedAction(null)
      onActionSelect?.(null)
    }
  }

  const handleFocus = () => {
    setIsOpen(true)
    setHighlightedIndex(0)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
      if (internalSelectedAction) {
        setQuery(internalSelectedAction.label)
      } else if (!query) {
        setQuery("")
      }
    }, 200)
  }

  const handleActionSelect = (action: Action | null) => {
    if (action) {
      setInternalSelectedAction(action)
      setQuery(action.label)
      onActionSelect?.(action)
    } else {
      setInternalSelectedAction(null)
      setQuery("")
      onActionSelect?.(null)
    }
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev === null || prev === actions.length - 1 ? 0 : prev + 1
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev === 0 || prev === null ? actions.length - 1 : prev - 1))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex !== null && actions[highlightedIndex]) {
          handleActionSelect(actions[highlightedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        break
      case "Backspace":
        if (!query && internalSelectedAction) {
          e.preventDefault()
          handleActionSelect(null)
        }
        break
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    show: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.1 } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.1 } },
  }

  const filteredActions = debouncedQuery
    ? actions.filter((action) =>
        action.label.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : actions

  const selectedAction = internalSelectedAction || externalSelectedAction

  return (
    <div className="relative w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">{label}</label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full pl-8 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="action-list"
        />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5">
          <AnimatePresence mode="popLayout">
            {query && !isOpen ? (
              <motion.div
                key="clear"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleActionSelect(null)}
                className="cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
              </motion.div>
            ) : query.length > 0 ? (
              <motion.div
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Send className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="relative w-full min-h-[64px]">
        <AnimatePresence>
          {isOpen && filteredActions.length > 0 && (
            <motion.div
              id="action-list"
              className="absolute w-full mt-1 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 z-20 max-h-60 overflow-y-auto"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              role="listbox"
            >
              <motion.ul>
                {filteredActions.map((action, index) => (
                  <motion.li
                    key={action.id}
                    className={`px-3 py-2 flex items-center gap-2 cursor-pointer ${
                      highlightedIndex === index
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                    variants={itemVariants}
                    onClick={() => handleActionSelect(action)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={highlightedIndex === index}
                  >
                    {action.icon || <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
                    <span className="text-sm font-medium truncate">{action.label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ActionSearchBar