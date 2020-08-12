/**
 * 主进程全局配置
 */
const path = require('path');
const Store = require('electron-store');
require('dotenv').config({ path: path.join(__dirname, '../../render/.env') });

const store = new Store();

/** 加载地址 */
export const CONST_ADDRESS_PROD = '@address/prod';

/** 本地路径 */
export const ADDRESS_LOCAL = `file://${path.join(__dirname, '../render/dist/index.html')}`;

/** dev 环境的地址 */
export const ADDRESS_DEV = `http://localhost:${process.env.PORT}`;

/** prod 环境地址 */
export const ADDRESS_PROD = () => store.store[CONST_ADDRESS_PROD] || ADDRESS_LOCAL;
