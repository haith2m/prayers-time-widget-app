const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 260,
    hasShadow:true,
    icon:path.join(__dirname, '/images/icon.png'),
    transparent:true,
    frame:false,
    resizable:false,
    autoHideMenuBar:true
    });
  mainWindow.center();

  const { screen } = require('electron');
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const x = Math.floor((width - mainWindow.getSize()[0]) / 2);
  mainWindow.setPosition(x, 50);

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});