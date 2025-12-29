import React from 'react'
import ProductCard from '../../components/ProductCard'

async function fetchProducts() {
  const base = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`
  const res = await fetch(`${base}/api/products`, { cache: 'no-store' })
  return res.json()
}

export default async function CatalogPage() {
  const data = await fetchProducts()
  const products = data?.products ?? []

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
