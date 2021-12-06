import chalk from 'chalk'

const config = {
  INFO: { color: 'bgCyan' },
  WARN: { color: 'bgYellow' },
  SUCCESS: { color: 'bgGreen' },
  ERROR: { color: 'bgRed' }
}

export type ConsoleLogTypes = keyof typeof config

class ConsoleUtils {
  protected log(type: ConsoleLogTypes, message: string | Error) {
    const conf = config[type]
    const str = `[${this.getDateStr()}] ${(chalk.white as any)[conf.color].bold(
      this.center(type)
    )} ${message}`

    console.log(str)
    return str
  }

  protected center(str: string, width = 9) {
    const lack = width - str.length

    if (lack <= 0) return str

    const offsetLeft = parseInt(String(lack / 2))
    const offsetRight = lack - offsetLeft

    return `${this.getSpaceStr(offsetLeft)}${str}${this.getSpaceStr(offsetRight)}`
  }

  protected getSpaceStr(count: number) {
    let str = ''
    for (let i = 0; i < count; i++) {
      str += ' '
    }
    return str
  }

  protected getDateStr() {
    const date = new Date()

    const obj = {
      H: date.getHours().toString().padStart(2, '0'),
      I: date.getMinutes().toString().padStart(2, '0'),
      S: date.getSeconds().toString().padStart(2, '0'),
      MS: date.getMilliseconds().toString().padStart(3, '0')
    }

    return `${chalk.hex('#f78c6c')(`${obj.H}:${obj.I}:${obj.S}`)}.${chalk.hex('#b2ccd6')(obj.MS)}`
  }
}

class Console extends ConsoleUtils {
  constructor() {
    super()
  }
  info(message: string) {
    this.log('INFO', message)
  }
  warn(message: string) {
    this.log('WARN', chalk.yellow(message))
  }
  error(message: string | Error, showDetail = false) {
    let messageH: string
    if (message instanceof Error) {
      messageH = `${chalk.bold(message.name)}: ${message.message}`
      if (showDetail) messageH = `Detail: ${messageH}\n${message.stack}`
    } else {
      messageH = message
    }
    this.log('ERROR', chalk.red(messageH))
  }
  success(message: string) {
    this.log('SUCCESS', chalk.green(message))
  }
}

export const appLog = new Console()
