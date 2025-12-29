import Link from 'next/link'

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="card-luxury group cursor-pointer">
        {/* Image Container */}
        <div className="card-luxury-image relative">
          <img
            src={product.images?.[0] ?? '/images/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-deep-gray via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
          {/* Quick View Button */}
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 btn-luxury-primary text-sm">
            Quick View
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block text-xs font-semibold text-luxury-gold tracking-widest uppercase">
              {product.category || 'Furniture'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg md:text-xl font-bold text-luxury-deep-gray mb-2 line-clamp-2 group-hover:text-luxury-gold transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-luxury-sage mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < 4 ? 'text-luxury-gold' : 'text-luxury-light-gray'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-luxury-sage ml-2">(24 reviews)</span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4 pt-3 border-t border-luxury-light-gray">
            <span className="text-2xl font-serif font-bold text-luxury-gold">
              ₹{Math.floor(product.price / 100).toLocaleString()}
            </span>
            <span className="text-sm text-luxury-sage line-through">
              ₹{Math.floor((product.price / 100) * 1.2).toLocaleString()}
            </span>
            <span className="ml-auto text-xs font-semibold bg-luxury-gold bg-opacity-20 text-luxury-gold px-2 py-1 rounded">
              20% OFF
            </span>
          </div>

          {/* CTA Button */}
          <button className="w-full btn-luxury-secondary text-sm">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
