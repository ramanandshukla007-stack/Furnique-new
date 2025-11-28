"use client"
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold">Furnique</Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/catalog" className="hover:underline">Catalog</Link>
          <Link href="/calculator" className="hover:underline">Calculator</Link>
          <Link href="/bookings" className="hover:underline">Bookings</Link>
          <Link href="/cart" className="hover:underline">Cart</Link>
          {session ? (
            <>
              <span className="ml-4">{session.user?.email}</span>
              <button onClick={() => signOut()} className="ml-2 text-sm underline">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="ml-4 hover:underline">Sign in</Link>
              <Link href="/auth/register" className="ml-2 hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
