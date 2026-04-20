import { useState, useEffect, useCallback } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'

function useGrievances(stateFilter) {
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refetchCounter, setRefetchCounter] = useState(0)

  const refetch = useCallback(() => {
    setRefetchCounter(prev => prev + 1)
  }, [])

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setLoading(true)
        setError(null)

        let q = query(
          collection(db, 'grievances'),
          orderBy('createdAt', 'desc'),
          limit(20)
        )

        if (stateFilter !== 'All') {
          q = query(q, where('state', '==', stateFilter))
        }

        const querySnapshot = await getDocs(q)
        const grievancesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))

        setGrievances(grievancesData)
      } catch (err) {
        console.error('Error fetching grievances:', err)
        setError('Failed to load grievances. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchGrievances()
  }, [stateFilter, refetchCounter])

  return { grievances, loading, error, refetch }
}

export default useGrievances