import AdminCatalogEditor from '@/components/AdminCatalogEditor'

export const metadata = {
  title: 'Admin - Catalogs',
}

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin / Catalogs</h1>
      <div className="bg-gray-50 p-4 rounded">
        <AdminCatalogEditor />
      </div>
    </div>
  )
}
