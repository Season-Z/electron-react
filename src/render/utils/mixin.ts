import moment from 'moment'
/**
 * 格式化金额
 * @param number
 * @returns {string}
 */
export const formatMoney = (number:number) => {
    if (typeof number === 'string') {
      return Number(number / 100).toFixed(2)
    }
    return (number / 100).toFixed(2)
  }
  
  /**
   * 格式化 时间区间
   * @param start 开始时间 必传
   * @param end 结束时间 非必传
   * @constructor
   */
  export const formatDate = (start, end, mode = 'YYYY-MM-DD HH:mm') => {
    if (!end) {
      return moment(start).format(mode)
    } else {
      return moment(start).format(mode) + ' ~ ' + moment(end).format(mode)
    }
  }