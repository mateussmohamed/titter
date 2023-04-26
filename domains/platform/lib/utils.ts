import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function abbreviation(str = '') {
  return str.replace(/(\w)\w*\W*/g, function (_, i) {
    return i.toUpperCase()
  })
}
