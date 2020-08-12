import { message } from 'antd'
import getLodop from '@utils/getLodop'

/** 打印验证 */
const valPrint = (LODOP: any, printer: string) => {
  if (process.platform !== 'win32') {
    message.warn('系统不支持，请在windows操作系统下操作')
    return false
  }
  if (!LODOP) {
    message.warn('未找到LODOP控件，请重试')
    return false
  }
  if (!printer) {
    message.warn('未找到打印机，请重试')
    return false
  }
  return true
}

/**
 * 打印的内容
 * @param LODOP 打印机对象实例
 * @param printer 打印机的名称
 * @param printContent 打印的内容
 * @param current 当前页
 * @param total 所有页数
 */
const printSetting = (
  LODOP: any,
  printer: string,
  printContent: string,
  current: number,
  total: number
) => {
  LODOP.PRINT_INIT('') // 打印初始化
  LODOP.SET_PRINTER_INDEX(printer) // 设置打印机
  LODOP.SET_PRINT_PAGESIZE(1, 0, 0, 'A4') // 必须: 设置打印纸尺寸
  LODOP.ADD_PRINT_HTM(50, 0, '100%', '90%', printContent.replace(/,/g, ''))
  LODOP.ADD_PRINT_HTM(
    '95%',
    '45%',
    '40%',
    20,
    `<span>第${current}页</span>/<span>共${total}页</span>`
  )
  LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1) // 每页都输出
  // LODOP.PREVIEW() // 预览
  LODOP.PRINT() // 直接打印
}

const handlePrint = (printer: string, printContent: string[]) => {
  const LODOP: any = getLodop()
  if (!valPrint(LODOP, printer)) {
    console.error('error')
    return
  }
  if (!printContent) {
    message.error('未获取到打印数据')
    return
  }

  message.success('正在打印中，请稍等....')

  const total = printContent.length
  let printTasks = []
  for (let i = 0; i < total; i++) {
    printTasks.push(printSetting(LODOP, printer, printContent[i], i + 1, total))
  }
}

/**
 * 批量打印A4
 * @param itemList 打印内容数组
 */
export default function useA4Printer(): [string[], any] | undefined {
  if (process.platform !== 'win32') {
    message.error('只有windows才能打印')
    return [[], null]
  }

  const LODOP: any = getLodop()
  // 获取打印机个数
  const count = LODOP.GET_PRINTER_COUNT()
  const localPrinters = []
  // 获取本地的打印机名称
  for (let i = 0; i < count; i++) {
    localPrinters.push(LODOP.GET_PRINTER_NAME(i))
  }

  return [localPrinters, handlePrint]
}
