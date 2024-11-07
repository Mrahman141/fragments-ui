'use client'

import React, { useState, useEffect } from 'react'
import { Auth, getUser } from '../../auth'
import { getFragments } from '@/helpers/get_fragment'

export default function Home() {
  const [fragments, setFragments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userData = await getUser()
      if (!userData) {
        setError('User not logged in')
      } else {
        const userFragments = await getFragments(userData)
        setFragments(userFragments)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const renderFragmentData = (fragment) => {
    switch (fragment.type) {
      case 'text/plain':
      case 'text/markdown':
        return <pre className="whitespace-pre-wrap">{fragment.data}</pre>
      case 'text/html':
        return <pre className="whitespace-pre-wrap">{fragment.data}</pre>
      case 'application/json':
        return <pre>{JSON.stringify(fragment.data, null, 2)}</pre>
      case 'text/csv':
        return (
            <table className="border-collapse border border-gray-300">
            {fragment.data.split('\n')
              .filter(row => row.trim() !== '')
              .map((row, i) => (
                <tr key={i}>
                  {row.split(',').map((cell, j) => (
                    <td key={j} className="border border-gray-300 px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
          </table>
        )
      default:
        return <p>Unsupported fragment type</p>
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fragment Metadata</h1>
      {fragments.map((fragment) => (
        <div key={fragment.id} className="mb-6 p-4 border rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">ID: {fragment.id}</h2>
          <p><strong>Owner ID:</strong> {fragment.ownerId}</p>
          <p><strong>Created:</strong> {new Date(fragment.created).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(fragment.updated).toLocaleString()}</p>
          <p><strong>Type:</strong> {fragment.type}</p>
          <p><strong>Size:</strong> {fragment.size} bytes</p>
          <div className="mt-2">
            <strong>Data:</strong>
            <div className="mt-1 p-2 bg-[#1a1e2d] rounded">
              {renderFragmentData(fragment)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}