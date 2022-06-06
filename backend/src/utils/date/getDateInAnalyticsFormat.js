const dayJs = require('dayjs');
const numToMonth = {
    1: 'JAN',
    2: 'FEB',
    3: 'MAR',
    4: 'APR',
    5: 'MAY',
    6: 'JUN',
    7: 'JUL',
    8: 'AUG',
    9: 'SEP',
    10: 'OCT',
    11: 'NOV',
    12: 'DEC'
}

const getMonthYearDate = () => {
    const month = numToMonth[dayJs().month() + 1]
    const date = dayJs().date();
    const year = dayJs().year();

    return {
        month,
        date,
        year
    }
}

const getDateInAnalyticsFormat = () => {
    const mdy = getMonthYearDate();

    const property = `${mdy.month}-${mdy.year}.${mdy.date}`;

    return property;
}
const getMonthAndYearInAnalyticsFormat = () => {
    const mdy = getMonthYearDate();

    const property = `${mdy.month}-${mdy.year}`;

    return property;
}


module.exports = {
    getDateInAnalyticsFormat,
    getMonthAndYearInAnalyticsFormat
};