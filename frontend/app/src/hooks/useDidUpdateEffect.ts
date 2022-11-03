import { useRef, useEffect, EffectCallback, DependencyList } from 'react'

export const useDidUpdateEffect = (
  fn: EffectCallback,
  deps: DependencyList,
): void => {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
    } else {
      fn()
    }
  }, deps)
}
