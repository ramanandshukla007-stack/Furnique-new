import React from 'react'
import Link from 'next/link'
import prisma from '../../lib/prisma'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../lib/auth'

export default async function CalculatorPage() {
  const session: any = await getServerSession(authOptions as any)
  let projects: any[] = []
  if (session?.user?.id) {
    projects = await prisma.calculatorProject.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-5xl font-bold text-luxury-deep-gray mb-2">Fabric Calculator</h1>
            <p className="text-luxury-sage">Design your perfect interior with our advanced fabric calculator</p>
          </div>
          <Link href="/calculator/new" className="btn-luxury-primary whitespace-nowrap">
            + New Project
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-luxury p-6">
          <div className="text-4xl mb-2">📐</div>
          <h3 className="font-serif text-lg font-bold text-luxury-deep-gray mb-2">Precise Calculations</h3>
          <p className="text-sm text-luxury-sage">Get accurate fabric requirements based on room dimensions and furniture type.</p>
        </div>
        <div className="card-luxury p-6">
          <div className="text-4xl mb-2">🎨</div>
          <h3 className="font-serif text-lg font-bold text-luxury-deep-gray mb-2">Multiple Fabrics</h3>
          <p className="text-sm text-luxury-sage">Choose from our premium fabric types and get instant cost estimates.</p>
        </div>
        <div className="card-luxury p-6">
          <div className="text-4xl mb-2">💾</div>
          <h3 className="font-serif text-lg font-bold text-luxury-deep-gray mb-2">Save Projects</h3>
          <p className="text-sm text-luxury-sage">Store all your design projects and revisit them anytime.</p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="card-luxury p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl font-bold text-luxury-deep-gray">Your Projects</h2>
          {projects.length > 0 && (
            <Link href="/calculator/new" className="btn-luxury-outline text-sm">
              + New Project
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-luxury-gold opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <h3 className="text-xl font-serif font-bold text-luxury-deep-gray mb-2">No Projects Yet</h3>
            <p className="text-luxury-sage mb-6">Create your first fabric calculation project to get started.</p>
            <Link href="/calculator/new" className="btn-luxury-primary inline-block">
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/calculator/${project.id}`}>
                <div className="border-2 border-luxury-gold border-opacity-20 rounded-lg p-5 hover:border-opacity-100 hover:shadow-luxury transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-luxury-deep-gray group-hover:text-luxury-gold transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-luxury-sage mt-1">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-luxury-gold border-opacity-20">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-luxury-sage">Rooms</span>
                      <span className="font-semibold text-luxury-gold">{project.rooms?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-luxury-sage">Items</span>
                      <span className="font-semibold text-luxury-gold">
                        {project.rooms?.reduce((acc: number, room: any) => acc + (room.items?.length || 0), 0) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="font-serif text-3xl font-bold text-luxury-deep-gray">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { num: '1', title: 'Create Project', desc: 'Start a new fabric calculation project' },
            { num: '2', title: 'Add Rooms', desc: 'Define room dimensions and furniture' },
            { num: '3', title: 'Choose Fabric', desc: 'Select fabric type and pattern repeat' },
            { num: '4', title: 'View Estimate', desc: 'Get instant cost and fabric requirements' },
          ].map((step, idx) => (
            <div key={idx} className="relative">
              <div className="bg-luxury-gold text-luxury-deep-gray w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-lg mb-3">
                {step.num}
              </div>
              <h3 className="font-semibold text-luxury-deep-gray mb-1">{step.title}</h3>
              <p className="text-sm text-luxury-sage">{step.desc}</p>
              {idx < 3 && (
                <div className="hidden md:block absolute top-6 -right-6 w-12 h-1 bg-luxury-gold opacity-30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
