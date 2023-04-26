import { EffectCallback, useEffect } from 'react'

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
