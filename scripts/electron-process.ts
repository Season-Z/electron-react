import chalk from 'chalk'
import electron from 'electron'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import { appLog } from './utils'

export default class ElectronProcess {
  public process: ChildProcessWithoutNullStreams | undefined

  private TM: number = Date.now()
  private restarting = false
  private isRestart = false

  /**
   * 启动 Electron 主进程
   */
  start(): void {
    if (this.isRestart) {
      appLog.info('Electron main process is restarting...')
      if (this.process && this.process.pid) {
        try {
          process.kill(this.process.pid)
          this.process = undefined
        } catch (error) {
          appLog.warn(error as unknown as string)
        }
      } else {
        appLog.warn('Failed to restart: Main process does not exist.')
      }
    }

    this.restarting = true

    if (this.isRestart) {
      this.debounce(() => {
        this.startElectron()
      }, 1500) // 1.5 秒防抖
    } else {
      this.isRestart = true
      this.startElectron()
    }
  }

  private startElectron() {
    // @ts-ignore
    this.process = spawn(electron, ['.'])
    this.restarting = false
    if (this.process) {
      appLog.success(`Electron main process has ${this.isRestart ? 'restarted' : 'started'}.`)

      this.process.stdout.on('data', (data) => {
        let message: string = data.toString()

        if (message.length < 10 && (!message || !message.replace(/\s/g, '')))
          message = chalk.gray('null')
        appLog.info(message)
      })
      this.process.stderr.on('data', (data) => {
        appLog.error(data)
      })
      this.process.on('close', () => {
        if (!this.restarting) {
          this.process = undefined
          process.exit()
        }
      })
    } else {
      return appLog.error('Electron start error!')
    }
  }

  /**
   * 战术防抖
   * @param callBack
   * @param t
   */
  debounce(callBack: () => void, t: number): void {
    this.TM = Date.now()
    setTimeout(() => {
      if (Date.now() - this.TM >= t) {
        callBack()
      }
    }, t)
  }
}
