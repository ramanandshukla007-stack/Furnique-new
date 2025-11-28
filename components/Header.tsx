"use client"
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="bg-luxury-deep-gray border-b-2 border-luxury-gold sticky top-0 z-50 shadow-luxury">
      <div className="container mx-auto px-4 md:px-8 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-luxury-gold border-opacity-30">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center font-serif font-bold text-luxury-deep-gray text-lg group-hover:scale-110 transition-transform">
              F
            </div>
            <span className="font-serif font-bold text-2xl text-luxury-gold tracking-wider">FURNIQUE</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-12">
            <input
              type="text"
              placeholder="Search luxury furniture..."
              className="w-full px-4 py-2 bg-luxury-cream text-luxury-deep-gray placeholder-luxury-sage rounded border-2 border-luxury-gold border-opacity-30 focus:border-opacity-100 focus:outline-none transition-colors"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-luxury-gold font-semibold hover:text-luxury-cream transition-colors flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span className="hidden sm:inline text-sm">{session?.user?.email?.split('@')[0] || 'Account'}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-luxury-cream rounded-lg shadow-luxury-hover border-2 border-luxury-gold overflow-hidden">
                  {session ? (
                    <>
                      <div className="px-4 py-3 border-b border-luxury-gold border-opacity-20">
                        <p className="text-xs text-luxury-sage">Logged in as</p>
                        <p className="font-semibold text-luxury-deep-gray">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-luxury-deep-gray hover:bg-luxury-gold hover:bg-opacity-10 transition-colors font-semibold"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2 text-luxury-deep-gray hover:bg-luxury-gold hover:bg-opacity-10 transition-colors font-semibold"
                      >
                        My Bookings
                      </Link>
                      {session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-luxury-deep-gray hover:bg-luxury-gold hover:bg-opacity-10 transition-colors font-semibold border-t border-luxury-gold border-opacity-20"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut()
                          setDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-luxury-deep-gray hover:bg-luxury-gold hover:bg-opacity-10 transition-colors font-semibold border-t border-luxury-gold border-opacity-20"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-3 text-luxury-deep-gray hover:bg-luxury-gold hover:bg-opacity-10 transition-colors font-semibold border-b border-luxury-gold border-opacity-20"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-3 text-luxury-gold hover:bg-luxury-gold hover:bg-opacity-10 transition-colors font-semibold"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          <Link
            href="/catalog"
            className="text-luxury-cream hover:text-luxury-gold font-semibold transition-colors tracking-wide text-sm uppercase"
          >
            Collection
          </Link>
          <Link
            href="/calculator"
            className="text-luxury-cream hover:text-luxury-gold font-semibold transition-colors tracking-wide text-sm uppercase"
          >
            Calculator
          </Link>
          <Link
            href="/bookings"
            className="text-luxury-cream hover:text-luxury-gold font-semibold transition-colors tracking-wide text-sm uppercase"
          >
            Consultations
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-luxury-cream hover:text-luxury-gold font-semibold transition-colors tracking-wide text-sm uppercase group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9l2 9m-12 0h14" />
            </svg>
            Cart
          </Link>
        </nav>
      </div>
    </header>
  )
}
