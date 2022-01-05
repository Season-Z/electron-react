const window: WindowConfig = {
  key: 'Home',
  path: '/',
  redirect: { to: '/demo?form=home' },
  windowOptions: {
    title: 'Home',
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600
  },
  createConfig: {
    showSidebar: true,
    saveWindowBounds: true
    // openDevTools: true,
  }
}

export default window
