import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../services/firebase'

function useSchemes(state, category) {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true)
        setError(null)

        let q = collection(db, 'schemes')

        if (state === 'Central') {
          q = query(q, where('state', '==', 'Central'))
        } else {
          q = query(q, where('state', '==', state))
        }

        q = query(q, orderBy('createdAt', 'desc'))

        const querySnapshot = await getDocs(q)
        const schemesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))

        setSchemes(schemesData)
      } catch (err) {
        console.error('Error fetching schemes:', err)
        setError('Failed to load schemes. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (state) {
      fetchSchemes()
    }
  }, [state])

  const filteredSchemes = useMemo(() => {
    if (category === 'All') {
      return schemes
    }
    return schemes.filter(scheme => scheme.category === category)
  }, [schemes, category])

  return { schemes: filteredSchemes, loading, error }
}

export default useSchemes