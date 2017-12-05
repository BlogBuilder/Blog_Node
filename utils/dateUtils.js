/**
 * 获取当前月的第一天 yyyy-mm-01 00:00:00
 *
 */
const getCurrentMonthFirst = (dateStr) => {
    let date = new Date(dateStr);
    date.setDate(1);
    return date;
};
/**
 * 获取当前月的最后一天  yyyy-mm-30(31)(29) 23:59:59
 */
const getCurrentMonthLast = (dateStr) => {
    let lastDate = new Date(dateStr.split("-")[0], dateStr.split("-")[1]);
    lastDate.setHours(7);
    lastDate.setMinutes(59);
    lastDate.setSeconds(59);
    return lastDate;
};

module.exports = {getCurrentMonthFirst, getCurrentMonthLast};