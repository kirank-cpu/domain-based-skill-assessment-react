// Formats a number of seconds into "M:SS" or "H:MM:SS".
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(s / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  if (hours > 0) return `${hours}:${pad(mins)}:${pad(secs)}`
  return `${mins}:${pad(secs)}`
}

// A longer, human phrasing e.g. "2 min 5 sec".
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const mins = Math.floor(s / 60)
  const secs = s % 60
  if (mins === 0) return `${secs} sec`
  return `${mins} min ${secs} sec`
}

// Returns A, B, C, D... label for an option index.
export function optionLabel(index) {
  return String.fromCharCode(65 + index)
}

export function formatTimestamp(date = new Date()) {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
