import { useSyncExternalStore } from 'react'

/** Subscribes to a CSS media query without tearing during concurrent renders. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', notify)
      return () => mql.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Phones and small tablets in portrait — drives layout and quality tiers. */
export function useIsCompact(): boolean {
  return useMediaQuery('(max-width: 820px)')
}
