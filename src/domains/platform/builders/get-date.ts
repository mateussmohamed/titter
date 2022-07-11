import Chance from 'chance'

export function getDate() {
  const chanceDate = new Chance()
  const today = new Date()

  const month = chanceDate.integer({ min: 0, max: today.getMonth() })
  const day = chanceDate.integer({ min: 1, max: month === today.getMonth() ? today.getDate() - 2 : 31 })

  return { month, day, year: today.getFullYear() }
}
