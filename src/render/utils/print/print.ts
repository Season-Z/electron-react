/* eslint-disable radix */

import { message } from 'antd'
import getLodop from '@utils/getLodop'
import { FineDishesTpl } from './FineDishes'
import { QuickConsumeTpl } from './QuickConsume'
import { QuickConsumeNoYellowTpl } from './QuickConsumeNoYellow'
import { A41Tpl } from './A41'

enum enumTagPrintType {
  '普通价签' = 1,
  '黄边价签' = 2,
  '精品菜' = 3,
  '促销价签' = 4,
  'A4' = 5
}

interface IStyle {
  top: number // 打印html适配位置
  left: number
  width: string
  height: string
  pageWidth: number // 打印纸尺寸
  pageHeight: number
}

const FineDishesStyle: IStyle = {
  // 精品菜 69*25(一行两格，每格一样内容)
  top: 5,
  left: 0,
  width: '69cm',
  height: '25cm',
  pageWidth: 690,
  pageHeight: 250
}
const QuickConsumeStyle: IStyle = {
  // 第一种快消(黄条): 69* 35
  top: 0,
  left: 0,
  width: '69cm',
  height: '35cm',
  pageWidth: 690,
  pageHeight: 350
}
const QuickConsumeNoYellowStyle: IStyle = {
  // 第二种快消(不带黄条): 60*35
  top: 0,
  left: 0,
  width: '60cm',
  height: '35cm',
  pageWidth: 600,
  pageHeight: 350
}

const A4Style: IStyle = {
  // 普通A4
  top: 50,
  left: 0,
  width: '100%',
  height: '90%',
  pageWidth: 0,
  pageHeight: 0
}

/**
 * 打印通用方法
 * 目前支持： 价签打印，A4打印
 * @param printType  打印类型，如价签1：FineDishes A4纸： A4
 * @param item 打印内容
 * @param printer 打印机
 */
export const commonSinglePrint = (printType: number, item: any, printer: string,pNum:number) => {
  console.log('printer', printer)
  let LODOP: any = {}
  if (process.platform === 'win32') {
    console.log('commonMultiplePrint')
    LODOP = getLodop()
  }
  if (!valPrint(LODOP, printer)) {
    console.error('error')
    return
  }
  return new Promise((resolve, reject) => {
    LODOP.PRINT_INIT('') // 打印初始化
    LODOP.SET_PRINTER_INDEX(printer) // 设置打印机
    let printObj = PrintPageSelect({
      type: printType,
      item
    })
    let html = printObj.pageHtml
    console.log('html', html)
    const obj: IStyle = handleHtmlFormat(printType)
    LODOP.ADD_PRINT_HTM(obj.top, obj.left, obj.width, obj.height, html)
    console.log('printType', printType)
    if (printType === enumTagPrintType['普通价签'] || printType === enumTagPrintType['促销价签']) {
      LODOP.ADD_PRINT_BARCODE(105, 40, 100, 26, '128B', item.barcode)
      LODOP.SET_PRINT_STYLE('FontSize', 6)
      LODOP.SET_PRINT_STYLEA(0, 'AlignJustify', 2)
    }
    if (printType && printType === enumTagPrintType['黄边价签']) {
      LODOP.ADD_PRINT_BARCODE(58, 35, 137, 40, '128B', item.barcode)
      LODOP.SET_PRINT_STYLE('FontSize', 4)
      LODOP.SET_PRINT_STYLEA(0, 'AlignJustify', 2)
    }
    if (printType && printType === enumTagPrintType['精品菜']) {
      LODOP.ADD_PRINT_BARCODE(47, 20, 118, 40, '128B', item.barcode)
      LODOP.ADD_PRINT_BARCODE(47, 150, 120, 40, '128B', item.barcode)
      LODOP.SET_PRINT_STYLE('FontSize', 6)
      LODOP.SET_PRINT_STYLEA(0, 'AlignJustify', 2)
    }
    LODOP.SET_PRINT_PAGESIZE(1, obj.pageWidth, obj.pageHeight, '') // 必须: 设置打印纸尺寸
    LODOP.SET_PRINT_COPIES(pNum)
    // LODOP.PREVIEW() // 预览
    LODOP.PRINT() // 直接打印
    return resolve(true)
  })
}

export const commonSinglePrintTest = (content: string, current: number, total: number) => {
  let LODOP: any = {}
  if (process.platform === 'win32') {
    LODOP = getLodop()
  }
  // 获取打印机个数
  const count = LODOP.GET_PRINTER_COUNT()
  for (let i = 0; i < count; i++) {
    console.log(LODOP.GET_PRINTER_NAME(i))
  }
  let printValue = LODOP.GET_PRINTER_NAME(-1) // 获取默认打印机
  console.log('printValue', printValue)

  if (!valPrint(LODOP, printValue)) {
    console.error('error')
    return
  }
  return new Promise((resolve, reject) => {
    LODOP.PRINT_INIT('') // 打印初始化
    LODOP.SET_PRINTER_INDEX(printValue) // 设置打印机
    LODOP.SET_PRINT_PAGESIZE(1, 0, 0, 'A4') // 必须: 设置打印纸尺寸
    LODOP.ADD_PRINT_HTM(50, 0, '100%', '90%', content)
    LODOP.ADD_PRINT_HTM(
      '90%',
      '45%',
      '20%',
      20,
      `<span>第${current}页</span>/<span>共${total}页</span>`
    )
    LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1) // 每页都输出
    // LODOP.PREVIEW() // 预览
    LODOP.PRINT() // 直接打印
  })
}

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
 * 批量打印
 * @param printType 打印类型，如价签1：FineDishes
 * @param itemList 打印内容数组
 * @param printer 打印机
 */
export const commonMultiplePrint = async (printType: number, itemList: [], printer: string) => {
  let printTasks = []
  let LODOP: any = {}
  if (process.platform === 'win32') {
    console.log('commonMultiplePrint')
    LODOP = getLodop()
  }
  if (!valPrint(LODOP, printer)) {
    console.error('error')
    return
  }
  for (const item of itemList) {
    printTasks.push(commonSinglePrint(printType, item, printer,parseInt(item['printNum'])))
  }
  console.log('printTasks', printTasks)
  Promise.allSettled(printTasks)
    .then(values => {
      console.log(values)
    })
    .catch(e => {
      console.error(`$printTasks:`, e)
    })
}

/**
 * 批量打印
 * @param itemList 打印内容数组
 * @param printer 打印机
 * @param printNum 打印份数
 */
export const commonMultiplePrintA4 = async (
  itemList: Array<string>,
  printer: string = 'ZHOU',
  printNum?: number
) => {
  const total = itemList.length
  let printTasks = []
  let LODOP: any = {}
  if (process.platform === 'win32') {
    // console.log('commonMultiplePrintA4')
    LODOP = getLodop()
  }
  if (!valPrint(LODOP, printer)) {
    console.error('error')
    return
  }
  for (let i = 0; i < total; i++) {
    printTasks.push(commonSinglePrintTest(itemList[i], i + 1, total))
  }
  // console.log('printTasks', printTasks)
  Promise.all(printTasks)
    .then(values => {
      console.log(values)
    })
    .catch(e => {
      console.error(`$printTasks:`, e)
    })
}

// 不同打印类型模板HTML格式处理
const handleHtmlFormat: any = (type: number) => {
  console.log('type', type)
  if (type === 1) {
    return QuickConsumeNoYellowStyle
  }
  if (type === 2) {
    return QuickConsumeStyle
  }
  if (type === 3) {
    return FineDishesStyle
  }
  if (type === 4) {
    return QuickConsumeNoYellowStyle
  }
}

// shopItemId: "0"
// activityStartTime: "0"
// activityEndTime: "0"
// productId: "100000000005"
// productName: "燕麦片"
// barcode: ""
// brandName: "谊品生鲜"
// categoryName: "生鲜部1010/干货类/杂粮类/杂粮类"
// unit: "公斤"
// specDesc: "1公斤"
// salePrice: 500
// printNum: 1
// editableTableKey: "edittable_125"

/**
 * 模板选择
 * @param props type: 价签或者A4 item: 打印内容
 */
const PrintPageSelect = (props: any) => {
  const { type, item } = props
  for (let i in item) {
    if (!item[i]) item[i] = ''
  }
  switch (type) {
    case enumTagPrintType['精品菜']: // 精品菜 69*25(一行两格，每格一样内容)
      return FineDishesTpl(item)
    case enumTagPrintType['黄边价签']: // 快消(有黄条): 69* 35 特价+无特价
      return QuickConsumeTpl(item)
    case enumTagPrintType['普通价签']: // 快消(无黄条): 60* 35
      return QuickConsumeNoYellowTpl(item)
    case enumTagPrintType['促销价签']: // 快消(无黄条): 60* 35
      return QuickConsumeNoYellowTpl(item)
    case enumTagPrintType['A4']: // A4 1
      return A41Tpl(item)
    // （暂时没纸）干货预包装: 58*40 暂不开发
    default:
      return {
        pageHtml: ''
      }
  }
}
