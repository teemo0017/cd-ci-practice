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
    expect(store.count).toBe(1)
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
