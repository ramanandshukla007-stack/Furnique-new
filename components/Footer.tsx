export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-sm text-slate-600">
        © {new Date().getFullYear()} Furnique — Crafted with care.
      </div>
    </footer>
  )
}
