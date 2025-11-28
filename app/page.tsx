import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <section className="rounded-lg overflow-hidden mb-8">
        <div className="relative h-64 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">Furnique</h1>
            <p className="mt-2">Beautiful furniture & soft furnishings</p>
            <div className="mt-4">
              <Link href="/catalog" className="bg-indigo-600 text-white px-4 py-2 rounded">Shop collection</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">Living Room</div>
          <div className="border rounded-lg p-4">Dining</div>
          <div className="border rounded-lg p-4">Bedroom</div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">Product card placeholder</div>
          <div className="border rounded-lg p-4">Product card placeholder</div>
          <div className="border rounded-lg p-4">Product card placeholder</div>
        </div>
      </section>
    </div>
  )
}
