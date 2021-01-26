var formatter = null;

/**
 * Time formatter utility
 */
class TimeFormatter {
    
    /**
     * Convert to human readable
     * @param {Date} workTime 
     */
    toHumanReadable(workTime) {
        workTime = workTime / 1000;
        workTime = workTime / 60;
        
        let hours = (workTime / 60);
        let realHours = Math.floor(hours);
        let minutes = (hours - realHours) * 60;
        let realMinutes = Math.round(minutes);

        realHours = realHours < 10 ? "0" + realHours : realHours;
        realMinutes = realMinutes < 10 ? "0" + realMinutes : realMinutes;
    
        return realHours + " h " + realMinutes + " m";
    }
}

formatter = formatter === null ? new TimeFormatter() : formatter;
module.exports = formatter;