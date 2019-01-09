// electron-packager.cmd ./ fuzzer-gui --out ..\fuzzer-gui\ --overwrite
// Modules to control application life and create native browser window
const { BrowserWindow } = require('electron')
const { ipcMain, dialog } = require('electron')
const electron = require('electron')
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const app = electron.app
const shell = electron.shell


const menu = new Menu()
menu.append(new MenuItem({ label: '开发者工具', click:function(){open_devtools()}}))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: '清除任务', click: function(){
    clean();
}}))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: '退出', click: function(){
    app.quit();
}}))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: '关于', click: function(){
    about();
}}))

app.on('browser-window-created', function (event, win) {
    win.webContents.on('context-menu', function (e, params) {
        menu.popup(win, params.x, params.y)
    })
})


// 保持全局对 mainWindows 的引用
let mainWindow

// 在主进程中
global.sharedObject = {
    task_ids: [],
};

ipcMain.on('select-file-requests', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, (files) => {
        if (files) {
            event.sender.send('selected-file', files)
        }
    })
});

ipcMain.on('select-directory-requests', (event) => {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, (files) => {
        if (files) {
            event.sender.send('selected', files)
        }
    })
});

ipcMain.on('load-app', (event) => {
    mainWindow.loadFile('app/index.html')
});




function clean(){
    
    mainWindow.webContents.send('clear-local-storage');
}


function open_devtools(){
    mainWindow.webContents.openDevTools();
}


function about(){
    shell.openExternal('http://www.cnblogs.com/hac425/')
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1066, height: 620, frame: false })

    // and load the index.html of the app.
    mainWindow.loadFile('app/welcome.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // 解引用
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
