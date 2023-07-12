import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss UTC'
dayjs.extend(utc)

export function formatDate(date: Date, format = DEFAULT_DATE_FORMAT) {
  return dayjs.utc(date).format(format)
}
