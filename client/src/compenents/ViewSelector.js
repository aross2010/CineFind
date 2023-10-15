import React from 'react'
import { HiViewGrid, HiViewList } from 'react-icons/hi'

export default function ViewSelector() {
  const BUTTON_STYLES = {
    border: '0.5px solid var(--fourth-dark)',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
  }

  return (
    <div>
      <button style={BUTTON_STYLES}>
        <HiViewList />
      </button>
      <button style={BUTTON_STYLES}>
        <HiViewGrid />
      </button>
    </div>
  )
}
