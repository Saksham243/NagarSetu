import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStateContext } from '../context/StateContext'
import stateList from '../utils/stateList'

function Home() {
  const { setSelectedState } = useStateContext()
  const [selectedStateValue, setSelectedStateValue] = useState('Karnataka')
  const navigate = useNavigate()

  const handleStateSelect = () => {
    setSelectedState(selectedStateValue)
    navigate('/dashboard')
  }

  const features = [
    {
      title: 'State Schemes',
      description: 'Browse government schemes specific to your state',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      route: '/dashboard',
    },
    {
      title: 'Central Initiatives',
      description: 'Explore national-level government programs',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      route: '/central',
    },
    {
      title: 'Raise a Grievance',
      description: 'Report issues and help improve governance',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      route: '/grievances',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-6xl mb-6">
              Know Your Rights.<br />
              Claim What's Yours.
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              NagarSetu bridges the gap between citizens and government schemes.
              Discover, apply, and track benefits that can improve your life.
            </p>
          </div>
        </div>
      </div>

      {/* State Selector */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Schemes for Your State
            </h2>
            <p className="text-gray-600">
              Select your state to explore government schemes and initiatives available to you
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select your state
              </label>
              <select
                id="state-select"
                value={selectedStateValue}
                onChange={(e) => setSelectedStateValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {stateList.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStateSelect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              Explore Schemes
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What NagarSetu Offers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform to help you navigate government schemes and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.route}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200 text-center"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm text-gray-600">
            Data sourced from MyScheme.gov.in and official state portals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home