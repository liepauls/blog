export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const formatDate = (dateString) => {
  const dateObject = new Date(dateString)
  const year       = dateObject.getFullYear()
  const date       = dateObject.getDate()

  return `${months[dateObject.getMonth()]} ${date}, ${year}`
}
