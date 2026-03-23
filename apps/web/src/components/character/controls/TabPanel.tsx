'use client'

import type { ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
}

interface Props {
  tabs: Tab[]
  activeTab: string
  onChange: (tab: string) => void
}

export function TabPanel({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              text-sm font-semibold
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              ${
                isActive
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
            aria-selected={isActive}
            role="tab"
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
