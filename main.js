const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();
const notifiedItems = [];

let win;

function createWindow() {
  nextApp
    .prepare()
    .then(() => {
      const server = createServer((req, res) => {
        if (req.headers['user-agent'].indexOf('Electron') === -1) {
          res.writeHead(404);
          res.end();
          return;
        }

        return handler(req, res);
      });

      server.listen(3000, (error) => {
        if (error) throw error;

        win = new BrowserWindow({
          height: 768,
          width: 1024,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
          }
        });

        win.maximize();

        win.loadURL('http://localhost:3000');

        if (dev) {
          win.webContents.openDevTools();
        }

        win.on('close', () => {
          win = null;
          server.close();
        });
      });
    }).catch(err => {
      console.log(err);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on("openDirDialog", function (event, args){
  const dir = dialog.showOpenDialogSync(win, {
    properties: ['openDirectory']
  });
  event.sender.send(args.event, dir[0]);
});

ipcMain.on("notify-critical-item", function(event, args) {
  args.items.map(item => {
    if (item.quantity <= args.userLevel && !notifiedItems.some((itemId) => itemId === item._id)) {
      notifiedItems.push(item._id);
      event.sender.send("notify-critical-item",item.name);
    }
  });
});