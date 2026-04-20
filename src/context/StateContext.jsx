import { createContext, useContext, useState } from 'react'

const noop = () => {}

const StateContext = createContext({
  selectedState: 'Karnataka',
  setSelectedState: noop,
  selectedCategory: 'All',
  setSelectedCategory: noop,
})

// eslint-disable-next-line react-refresh/only-export-components
export function useStateContext() {
  return useContext(StateContext)
}

function StateProvider({ children }) {
  const [selectedState, setSelectedState] = useState('Karnataka')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const value = {
    selectedState,
    setSelectedState,
    selectedCategory,
    setSelectedCategory,
  }

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  )
}

export default StateProvider
