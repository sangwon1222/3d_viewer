import { IpcRenderer } from 'electron'
const { ipcRenderer } = require('electron')

class CustomIpcRenderer {
  private mIpcRenderer: IpcRenderer = ipcRenderer
  constructor() {
    this.mIpcRenderer = ipcRenderer
  }

  connectPrint = async () => {
    this.mIpcRenderer.invoke('connect-print')
    this.mIpcRenderer.send('is-connected', '-')
    this.mIpcRenderer.once('is-connected', (_event, res) => {
      console.log(res)
    })
  }

  async antenna(e: SubmitEvent) {
    e.preventDefault()
    const atn1 = +e.target['atn1'].value
    const atn2 = +e.target['atn2'].value
    const atn3 = +e.target['atn3'].value
    const atn4 = +e.target['atn4'].value

    if (!atn1 && !atn2 && !atn3 && !atn4) {
      e.target['atn1'].select()
      return
    }

    try {
      await this.mIpcRenderer.invoke('antenna', { atn1, atn2, atn3, atn4 })
      this.mIpcRenderer.send('antenna')
      this.mIpcRenderer.once('antenna', (_event, res) => {
        console.log(res)
      })
    } catch (e) {
      console.log(e)
    }
  }

  onBuzzer() {
    this.mIpcRenderer.send('on-buzzer', '_')
    this.mIpcRenderer.on('on-buzzer', (_event, res) => {
      console.log(res)
    })
  }

  offBuzzer() {
    this.mIpcRenderer.send('off-buzzer', '_')
    this.mIpcRenderer.on('off-buzzer', (_event, res) => {
      console.log(res)
    })
  }

  stop() {
    this.mIpcRenderer.send('stop', '_')
    this.mIpcRenderer.on('stop', (_event, res) => {
      console.log(res)
    })
  }
}

export default new CustomIpcRenderer()
