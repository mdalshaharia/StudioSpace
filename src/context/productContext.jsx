'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URI}/studios`)
        if (!res.ok) {
          throw new Error(`Failed to fetch data (Status: ${res.status})`)
        }
        const data = await res.json()
        const productList = Array.isArray(data) ? data : data.products || []

        if (ignore) return
        setProducts(productList)
        setError(null)
        setLoading(false)
      } catch (err) {
        console.error('Product fetch error:', err)
        if (ignore) return
        setError(err.message || 'Something went wrong')
        setLoading(false)
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}



export default ProductContext