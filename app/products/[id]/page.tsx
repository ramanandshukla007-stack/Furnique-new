import React from 'react'
import FabricVisualizer from '../../../components/FabricVisualizer'

async function fetchProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/products/${id}`, { cache: 'no-store' })
  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const data = await fetchProduct(params.id)
  const product = data?.product

  if (!product) return <div>Product not found</div>

  const mask = '/masks/sofa-mask.png'
  const fabric = product.fabrics?.[0]?.patternUrl ?? '/fabrics/linen.jpg'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <FabricVisualizer baseSrc={product.images?.[0] ?? '/images/sofa-1.jpg'} maskSrc={mask} fabricSrc={fabric} />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-xl text-slate-700">₹{(product.price / 100).toFixed(2)}</p>
        <p className="mt-4 text-slate-600">{product.description}</p>
        <div className="mt-6 flex space-x-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add to cart</button>
          <button className="border px-4 py-2 rounded">Wishlist</button>
        </div>
      </div>
    </div>
  )
}
