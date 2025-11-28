import Link from 'next/link'

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <img src={product.images?.[0] ?? '/images/placeholder.png'} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-slate-600">₹{(product.price / 100).toFixed(2)}</p>
        <div className="mt-3">
          <Link href={`/products/${product.id}`} className="text-indigo-600 hover:underline">View</Link>
        </div>
      </div>
    </div>
  )
}
