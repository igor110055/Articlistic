/**
 * This function accepts string in hh:mm format IST and returns a cron time in UTC
 * @param {'HH:MM'} time
 * returns cronString
 */
module.exports = function convert_IST_TimeToCRON_UTC(time) {
    //If no time is sent -> Run Cron every min
    if (!time) {
        return '* * * * *';
    }

    var timeArr = time.split(':');
    var hrs = parseInt(timeArr[0]),
        mins = parseInt(timeArr[1]);

    // Checking if time falls in valid range
    if (hrs > 24 || hrs < 0 || mins > 60 || mins < 0) {
        var err = 'Invalid Time'
        throw err;
    }

    /**
     * Algo
     * 1. Convert IST hours and mins into seconds
     * 2. Subtract the UTC difference from local seconds
     * 3. Convert the UTC seconds into hours and minutes
     * 4. return cron as per the UTC time
     */
    var cronHrs, cronMins, utcSecs, remainderMins;
    var localSecs = hrs * 60 * 60 + mins * 60;
    const utcSecsDifference = 5 * 60 * 60 + 30 * 60,
        secondsInADay = 24 * 60 * 60;

    if (localSecs >= utcSecsDifference) {
        utcSecs = localSecs - utcSecsDifference;
    } else {
        utcSecs = secondsInADay - (utcSecsDifference - localSecs);
    }

    cronHrs = Math.floor(utcSecs / (60 * 60));

    remainderMins = utcSecs % (60 * 60);
    cronMins = Math.floor(remainderMins / (60 * 60));

    return (cronMins + ' ' + cronHrs + ' * * *');
}