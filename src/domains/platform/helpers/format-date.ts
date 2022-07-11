export function formatDate(value = new Date(), opts?: Intl.DateTimeFormatOptions) {
  const config: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts
  }

  return new Intl.DateTimeFormat('en-US', config).format(value)
}
