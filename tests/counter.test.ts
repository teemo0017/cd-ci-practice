import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCounterStore } from '../app/stores/counter'

describe('counter store', () => {
  // Un Pinia nuevo antes de cada test: así ningún test depende del estado del anterior.
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('empieza en cero', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('increment suma 1', () => {
    const store = useCounterStore()
    store.increment()
    // Roto A PROPÓSITO para la demo de branch protection: increment() suma
    // 1, así que esto debería ser toBe(1). Lo dejamos en 2 para ver el CI
    // fallar en rojo.
    expect(store.count).toBe(2)
  })

  it('doubled refleja el doble del contador', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    expect(store.doubled).toBe(4)
  })

  it('reset vuelve a cero', () => {
    const store = useCounterStore()
    store.increment()
    store.reset()
    expect(store.count).toBe(0)
  })
})
