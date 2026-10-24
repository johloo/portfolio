export type Theme = 'day' | 'night'

/**
 * Shared, smoothly-animated day/night factor read inside animation loops.
 * 0 = full day, 1 = full night. Kept outside React so it never re-renders.
 */
export const themeState = { value: 1 }

export const mix = (day: number, night: number, n: number) => day + (night - day) * n
