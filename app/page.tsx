import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.products || []
  } catch {
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-12 md:mb-20">
        <div className="relative h-96 md:h-screen max-h-[600px] rounded-xl overflow-hidden group">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop")',
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-deep-gray via-luxury-deep-gray to-transparent opacity-70" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-12 lg:px-16">
            <div className="max-w-2xl">
              <div className="mb-4">
                <span className="text-luxury-gold font-semibold text-sm tracking-widest uppercase">Luxury Collection 2025</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-luxury-cream mb-6 leading-tight">
                Elevate Your Space
              </h1>
              <p className="text-lg md:text-xl text-luxury-light-gray mb-8 max-w-xl leading-relaxed">
                Discover our curated collection of premium furniture and soft furnishings, crafted for discerning tastes and timeless elegance.
              </p>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Link href="/catalog" className="btn-luxury-primary inline-block text-center">
                  Explore Collection
                </Link>
                <Link href="/calculator" className="btn-luxury-outline inline-block text-center">
                  Try Calculator
                </Link>
              </div>
            </div>
          </div>

          {/* Accent Element */}
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-luxury-gold opacity-5 blur-3xl -mb-20 -mr-20" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="mb-12 md:mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl text-luxury-gold font-serif font-bold mb-2">10K+</div>
            <p className="text-luxury-sage text-sm">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl text-luxury-gold font-serif font-bold mb-2">500+</div>
            <p className="text-luxury-sage text-sm">Premium Fabrics</p>
          </div>
          <div className="text-center">
            <div className="text-4xl text-luxury-gold font-serif font-bold mb-2">20+</div>
            <p className="text-luxury-sage text-sm">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="text-4xl text-luxury-gold font-serif font-bold mb-2">100%</div>
            <p className="text-luxury-sage text-sm">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="mb-12 md:mb-20">
        <div className="mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-deep-gray mb-2">Browse Collections</h2>
          <div className="w-16 h-1 bg-luxury-gold rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collection Card 1 */}
          <Link href="/catalog" className="group relative overflow-hidden rounded-xl h-80 md:h-96">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop")',
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">Living Room</h3>
                <p className="text-luxury-light-gray">Sofas, chairs & accessories</p>
              </div>
            </div>
          </Link>

          {/* Collection Card 2 */}
          <Link href="/catalog" className="group relative overflow-hidden rounded-xl h-80 md:h-96">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=600&fit=crop")',
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">Bedroom</h3>
                <p className="text-luxury-light-gray">Luxury upholstery & comfort</p>
              </div>
            </div>
          </Link>

          {/* Collection Card 3 */}
          <Link href="/catalog" className="group relative overflow-hidden rounded-xl h-80 md:h-96">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop")',
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">Dining</h3>
                <p className="text-luxury-light-gray">Tables, chairs & more</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12 md:mb-20">
        <div className="mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-deep-gray mb-2">Featured Selection</h2>
          <div className="w-16 h-1 bg-luxury-gold rounded" />
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-luxury-sage text-lg">Loading products...</p>
          </div>
        )}

        {products.length > 4 && (
          <div className="text-center mt-12">
            <Link href="/catalog" className="btn-luxury-primary inline-block">
              View All Products
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mb-12 md:mb-20">
        <div className="bg-gradient-to-r from-luxury-deep-gray to-luxury-deep-gray rounded-xl p-8 md:p-16 border-2 border-luxury-gold text-center relative overflow-hidden group">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-5 rounded-full group-hover:opacity-10 transition-all" />

          <div className="relative z-10">
            <h2 className="font-serif text-4xl font-bold text-luxury-cream mb-4">Need Design Guidance?</h2>
            <p className="text-luxury-light-gray mb-8 max-w-2xl mx-auto text-lg">
              Book a consultation with our luxury interior experts to create your perfect space.
            </p>
            <Link href="/bookings/new" className="btn-luxury-primary inline-block">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <div className="mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-luxury-deep-gray mb-2">Why Choose Furnique</h2>
          <div className="w-16 h-1 bg-luxury-gold rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '✨', title: 'Premium Quality', desc: 'Handpicked fabrics and craftsmanship' },
            { icon: '🎨', title: 'Design Expertise', desc: 'Professional interior consultation' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Free shipping on all orders' },
            { icon: '🔒', title: '100% Authentic', desc: 'Guaranteed genuine products' },
          ].map((item, idx) => (
            <div key={idx} className="card-luxury p-6 text-center hover:border-luxury-gold transition-all">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-serif text-lg font-bold text-luxury-deep-gray mb-2">{item.title}</h3>
              <p className="text-luxury-sage text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
