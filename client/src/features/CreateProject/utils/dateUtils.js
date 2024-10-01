import dayjs from 'dayjs'

export const formatDate = (date) => {
    return dayjs(date).format('D MMMM, YYYY')
}

export const addMonths = (date, months) => {
    return dayjs(date).add(months, 'month')
}
