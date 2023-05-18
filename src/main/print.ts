import { ipcMain } from 'electron'
import net from 'net'
import idroPacket from './idroPacket'

class MiddleWare {
  async excute(funcName: string, arg: any) {
    const valid = await this.check()
    if (!valid) return
    console.log(valid, this[funcName])
    await this[funcName](...arg)
  }
  async check(): Promise<boolean | any> {
    //
  }
}

class Printer extends MiddleWare {
  private mTcp!: net.Socket

  async connectTCP(host: string, port: number) {
    this.mTcp = net.createConnection({ host, port })
    this.mTcp.setMaxListeners(50)
    this.mTcp.on('connect', () => {
      ipcMain.once('is-connected', (event, _response) => {
        event.reply('is-connected', { ok: true, msg: 'success connect' })
      })
    })
    this.mTcp.on('end', () => {
      ipcMain.once('is-connected', (event, _response) => {
        event.reply('is-connected', { ok: false, msg: 'end connect' })
      })
    })
    this.mTcp.on('close', () => {
      ipcMain.once('is-connected', (event, _response) => {
        event.reply('is-connected', { ok: false, msg: 'close connect' })
      })
    })
    this.mTcp.on('error', () => {
      ipcMain.once('is-connected', (event, _response) => {
        event.reply('is-connected', { ok: false, msg: 'error connect' })
      })
    })
  }

  async check() {
    ipcMain.once('replay-status', (event, _response) => {
      event.reply('replay-status', { ok: false, msg: 'tcp disconnect...' })
    })
    return Boolean(this.mTcp)
  }

  async setAntenna(atn1: number, atn2: number, atn3: number, atn4: number) {
    console.log(this.mTcp)
    const atn1Name = atn1 ? 'Atn1' : ''
    const atn2Name = atn2 ? 'Atn2' : ''
    const atn3Name = atn3 ? 'Atn3' : ''
    const atn4Name = atn4 ? 'Atn4' : ''
    const antennaCmd = `on${atn1Name}${atn2Name}${atn3Name}${atn4Name}`.trim()

    this.mTcp.write(idroPacket['stopReadRFID'])
    this.mTcp.write(idroPacket[antennaCmd])
    this.mTcp.write(idroPacket['startReadRFID'])
    ipcMain.once('antenna', (event, _response) => {
      event.reply('antenna', antennaCmd)
    })
  }

  md() {
    if (!this.mTcp) return false
  }
}

export default new Printer()
