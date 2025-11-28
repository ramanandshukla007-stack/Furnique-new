import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold">Furnique</Link>
        <nav className="space-x-4">
          <Link href="/catalog" className="hover:underline">Catalog</Link>
          <Link href="/calculator" className="hover:underline">Calculator</Link>
          <Link href="/bookings" className="hover:underline">Bookings</Link>
          <Link href="/cart" className="hover:underline">Cart</Link>
        </nav>
      </div>
    </header>
  )
}
