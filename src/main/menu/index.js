/**
 * 菜单
 */
const electron = require('electron')
// const url = require('url')
// const path = require('path')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app
const shell = electron.shell
const Store = require('electron-store')
const { ACLAS_ADDONS, ADDONS_TYPE } = require('../addons/aclas-sdk')

const store = new Store()

// const pkg = require(path.resolve(global.__dirname, 'package.json'))
// const build = pkg['build-config']

let template = [
  {
    label: '工具',
    submenu: [
      {
        label: '刷新',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function(win) {
                if (win.id > 1) {
                  win.close()
                }
              })
            }
            focusedWindow.reload()
          }
        }
      },
      {
        label: '切换全屏',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F'
          } else {
            return 'F11'
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        }
      },
      {
        label: '开发者工具',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          } else {
            return 'Ctrl+Shift+I'
          }
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        }
      },
      {
        label: `电子秤-普通模式`,
        click: () => {
          store.set(ACLAS_ADDONS, ADDONS_TYPE.cpp)
        },
      },
      {
        label: `电子秤-兼容模式`,
        click: () => {
          store.set(ACLAS_ADDONS, ADDONS_TYPE.csharp)
        },
      },
      {
        label: '下载最新安装包',
        click: () => {
          shell.openExternal('https://h5.ypshengxian.com/treaty/h5/ypshop/index.html')
        }
      },
      {
        label: '退出',
        accelerator: (function() {
          if (process.platform === 'darwin') {
            return 'Alt+Command+Q'
          } else {
            return 'Ctrl+Q'
          }
        })(),
        click: function() {
          app.quit()
        }
      }
    ]
  },
  {
    label: '操作',
    submenu: [
      { label: '剪切', role: 'cut' }, // 剪切
      { label: '复制', role: 'copy' }, // 复制
      { label: '粘贴', role: 'paste' } // 黏贴
    ]
  }
]

// function addUpdateMenuItems(items, position) {
//   if (process.mas) return

//   const version = electron.app.getVersion()
//   let updateItems = [
//     {
//       label: `Version ${version}`,
//       enabled: false
//     },
//     {
//       label: '检查更新',
//       click: function() {
//         UpdateHelper.checkUpdate(null, false)
//       }
//     }
//   ]

//   items.splice.apply(items, [position, 0].concat(updateItems))
// }

// function findReopenMenuItem() {
//   const menu = Menu.getApplicationMenu()
//   if (!menu) return

//   let reopenMenuItem
//   menu.items.forEach(function(item) {
//     if (item.submenu) {
//       item.submenu.items.forEach(function(item) {
//         if (item.key === 'reopenMenuItem') {
//           reopenMenuItem = item
//         }
//       })
//     }
//   })
//   return reopenMenuItem
// }

// if (process.platform === 'darwin') {
//   const name = electron.app.getName()
//   template.unshift({
//     label: name,
//     submenu: [
//       {
//         label: `关于 ${name}`,
//         role: 'about'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: '服务',
//         role: 'services',
//         submenu: []
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: `隐藏 ${name}`,
//         accelerator: 'Command+H',
//         role: 'hide'
//       },
//       {
//         label: '隐藏其它',
//         accelerator: 'Command+Alt+H',
//         role: 'hideothers'
//       },
//       {
//         label: '显示全部',
//         role: 'unhide'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: '退出',
//         accelerator: 'Command+Q',
//         click: function() {
//           app.quit()
//         }
//       }
//     ]
//   })

//   // 窗口菜单.
//   template[3].submenu.push(
//     {
//       type: 'separator'
//     },
//     {
//       label: '前置所有',
//       role: 'front'
//     }
//   )

//   addUpdateMenuItems(template[0].submenu, 1)
// }

// if (process.platform === 'win32') {
//   const helpMenu = template[template.length - 1].submenu
//   addUpdateMenuItems(helpMenu, 0)
// }

app.on('ready', function() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

// app.on('browser-window-created', function () {
//   let reopenMenuItem = findReopenMenuItem()
//   if (reopenMenuItem) reopenMenuItem.enabled = false
// })

// app.on('window-all-closed', function () {
//   let reopenMenuItem = findReopenMenuItem()
//   if (reopenMenuItem) reopenMenuItem.enabled = true
// })
