const {
    getMonthAndYearInAnalyticsFormat
} = require("../date/getDateInAnalyticsFormat");


/**
 * Gives year-wise data. 
 */
const getYearlyData = (analyticsData) => {



    const yearlyData = {}

    Object.keys(analyticsData).forEach((key) => {

        /**
         * This will be the cumulative sum for each key
         * Say for JAN-2022 - this would be giving 
         * the sum of all the entries in month JAN-2022. 
         */

        var sum = 0;

        /**
         * This is the object inside JAN2022. 
         * This will have all the days of the month on 
         * which article analytics has been registered. 
         */
        const daysOfMonth = analyticsData[key];

        /**
         * We now iterate over each day of the month 
         * and get the sum of the analytics. 
         * 
         */

        Object.keys(daysOfMonth).forEach((dayOfMonth) => {

            const viewsOnParticularDay = daysOfMonth[dayOfMonth];

            sum += viewsOnParticularDay;

        });

        /**
         * This checks for keeping entry in the yearlyData object. 
         * JAN-2022 - would split and give 2022. 
         */

        const year = key.split('-')[1];

        if (!yearlyData[year]) {
            yearlyData[year] = sum;
        } else {
            yearlyData[year] += sum;
        }


    });

    return yearlyData;
}


/*** 
 * It gives data for current month's weeks. 
 * 
 * @param data - The data object that contains the analytics data.
 * @returns An object with the keys being the week number and the values being the total views for that
 * week.
 */

const getWeeklyData = (data) => {


    const monthString = getMonthAndYearInAnalyticsFormat();

    const analyticsData = data[monthString];
    const weeklyData = {};


    if (analyticsData) {

        Object.keys(analyticsData).forEach((dayOfMonth) => {

            let week;
            if (dayOfMonth % 7 !== 0) {

                week = Math.floor(dayOfMonth / 7) + 1;

            } else {

                week = dayOfMonth / 7;

            }


            const viewsOnParticularDay = analyticsData[dayOfMonth];
            if (!weeklyData[week]) {
                weeklyData[week] = viewsOnParticularDay;
            } else {
                weeklyData[week] += viewsOnParticularDay;
            }



        });
    }

    return weeklyData;
}

/**
 * It gives monthly analytics for a specific year.
 * @param analyticsData - {
 * @param year - The year for which you want to get the monthly data.
 * @returns An object with the months as keys and the total number of views for that month as the
 * value.
 */
const getMonthlyData = (analyticsData, year) => {


    /**
     * Filter data so that it has only the months
     * from the required year. 
     */



    const monthlyData = {}

    Object.keys(analyticsData).forEach((key) => {

        if (key.includes(year.toString())) {

            const currMonthDays = analyticsData[key];

            const month = key.split('-')[0];

            monthlyData[month] = 0;
            Object.keys(currMonthDays).forEach((dayOfMonth) => {

                monthlyData[month] += currMonthDays[dayOfMonth];

            })


        }

    });

    return monthlyData;
}


module.exports = {
    getYearlyData,
    getWeeklyData,
    getMonthlyData
};