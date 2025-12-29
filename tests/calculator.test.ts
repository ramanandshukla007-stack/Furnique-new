import { describe, it, expect } from 'vitest'
import { calculateFabricForRoom, calculateProject } from '../lib/calculator'

describe('calculator', () => {
  it('calculates fabric for a simple room', () => {
    const room = { id: 'r1', width: 4, height: 3, items: [] }
    const m = calculateFabricForRoom(room)
    expect(m).toBeGreaterThan(0)
  })

  it('calculates project total', () => {
    const project = { rooms: [{ id: 'r1', width: 4, height: 3, items: [] }, { id: 'r2', width: 3, height: 2, items: [] }] }
    const total = calculateProject(project)
    expect(total).toBeGreaterThan(0)
  })
})
