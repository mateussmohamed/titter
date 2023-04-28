import { EffectCallback, useEffect } from 'react'

import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// see: https://github.com/streamich/react-use/blob/master/src/useEffectOnce.ts
export const useEffectOnce = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
// see: https://github.com/streamich/react-use/blob/master/src/useMount.ts
export const useMount = (fn: () => void) => {
  useEffectOnce(() => {
    fn()
  })
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function abbreviation(str = '') {
  return str.replace(/(\w)\w*\W*/g, function (_, i) {
    return i.toUpperCase()
  })
}
