import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Printer from './print'

const init = async () => {
  ipcMain.handle('connect-print', async (_event) => {
    await Printer.connectTCP('192.168.9.6', 5578)
  })

  ipcMain.handle('antenna', async (_event, res) => {
    const { atn1, atn2, atn3, atn4 } = res
    Printer.excute('setAntenna', [atn1, atn2, atn3, atn4])
  })
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    title: '검수 발행기',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  await init()

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  require('@electron/remote/main').initialize()
  require('@electron/remote/main').enable(mainWindow.webContents)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// const options = {
//   port: 5578,
//   host: '192.168.9.6'
// }
// // const tcp = net.createConnection(options)
// const tcp = net.connect(options, () => {
//   console.log('tcp __connected')
// })

// tcp.on('connect', function () {
//   console.log('__connect')
// })

// tcp.write('>f \r\n')

// tcp.on('data', function (data) {
//   console.log('__data', data.toString())
// })
// tcp.on('close', function () {
//   tcp.write('>3 \r\n')
//   console.log('client disconnted.')
// })

// ipcMain.on('1-antenna', (event, response) => {
//   console.log(response)
//   tcp.write('>3 \r\n')
//   const result = tcp.write('>x e 1\r\n')
//   tcp.write('>f \r\n')
//   event.sender.send('1-antenna', result)
// })

// ipcMain.on('all-antenna', (event, response) => {
//   console.log(response)
//   tcp.write('>3 \r\n')
//   const result = tcp.write('>x e 15\r\n')
//   tcp.write('>f \r\n')
//   event.sender.send('all-antenna', result)
// })

// ipcMain.on('on-buzzer', (event, response) => {
//   console.log(response)
//   tcp.write('>3 \r\n')
//   const result = tcp.write('>x b 1\r\n')
//   tcp.write('>f \r\n')
//   event.sender.send('on-buzzer', result)
// })

// ipcMain.on('off-buzzer', (event, response) => {
//   console.log(response)
//   tcp.write('>3 \r\n')
//   const result = tcp.write('>x b 0\r\n')
//   tcp.write('>f \r\n')
//   event.sender.send('off-buzzer', result)
// })

// ipcMain.on('stop', (event, response) => {
//   console.log(response)
//   const result = tcp.write('>3 \r\n')
//   event.sender.send('stop', result)
// })
