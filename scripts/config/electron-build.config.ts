import path from 'path'
import { Configuration, CliOptions } from 'electron-builder'
import { PROJECT_PATH } from './config'

const ICON_ICO = path.resolve(PROJECT_PATH, './assets/icon/icon.ico')
const ICON_ICNS = path.resolve(PROJECT_PATH, './assets/icon/icon.icns')

const { npm_package_name, npm_package_appId, npm_package_version } = process.env

const config: Configuration = {
  productName: npm_package_name,
  appId: npm_package_appId,
  asar: false,
  asarUnpack: '**\\*.{node,dll}',
  files: ['dist', 'node_modules', 'package.json', 'assets'],
  mac: {
    icon: ICON_ICNS,
    target: {
      target: 'default',
      arch: ['arm64', 'x64']
    },
    type: 'distribution',
    hardenedRuntime: true,
    // entitlements: 'assets/entitlements.mac.plist',
    // entitlementsInherit: 'assets/entitlements.mac.plist',
    gatekeeperAssess: false
  },
  dmg: {
    icon: ICON_ICNS,
    contents: [
      {
        x: 130,
        y: 220
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications'
      }
    ]
  },
  win: {
    icon: ICON_ICO,
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32']
      }
    ]
  },
  directories: {
    buildResources: 'assets',
    output: `release/${npm_package_version}_setup`
  },
  extraResources: ['./assets/**'],
  publish: {
    provider: 'github',
    owner: 'season',
    repo: 'electron-react'
  }
}

const electronBuildConfig: CliOptions = {
  config
}

export default electronBuildConfig
