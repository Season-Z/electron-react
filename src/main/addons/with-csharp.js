/**
 * 放在子进程中
 * https://zhuanlan.zhihu.com/p/36678971
 * C# 版本
 */

const http = require('http');
const utils = require('util');
const os = require('os');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { log } = require('../utils/log');
const isDev = require('electron-is-dev');

function query(params, port = '9497') { // 9999 被 WXWork.exe 占用 😥
  return new Promise(resolve => {
    http.get(`http://127.0.0.1:${port}/?${new URLSearchParams(params).toString()}`,
      res => {
        res.on('data', chunk => {
          let str = chunk.toString();
          try {
            str = JSON.parse(str);
          } catch (error) {
            if (isDev) {
              console.log();
              console.log(str);
              console.log('----');
              console.log(error);
              console.log();
            }
          }
          resolve(str);
        });
      })
  });
}

module.exports = function (config, callback) {
  const { type, host, filename, dll_path } = config; // type: 0x0000 PLU、0x0011 条码
  const handle = cp.spawn(path.join(__dirname, 'addons/AclasFor_node.exe'));
  handle.on('error', function (error) {
    log({ data: error, filename: 'with-csharp-error.log' });
    callback({ code: 407, index: -1, total: -1 });
    isDev && console.log(error);
  })
  handle.on('close', function (code, signal) {
    // log({ data: `[code: ${code}, signal: ${signal}]` }) // 会和上面error冲突
  })
  handle.stdout.on('data', function (chunk) {
    const str = chunk.toString();
    // console.log(str);
    log({ data: str, filename: 'with-csharp.log', append: false });
    // stdout 有两次 Console.WriteLine() 合并的情况，所以 res 是数组
    let res = String(str).trim().match(/(##(\w+)=(\{[\s\S][^##]+\})##)/g);
    if (Array.isArray(res)) {
      res.forEach(r => {
        const tmp = r.match(/^##(\w+)=(\{[\s\S]+\})##$/)
        const cmd = tmp[1];
        let json = tmp[2];
        try {
          json = JSON.parse(json.replace(/\n/g, '----'));
        } catch (error) {
          log({ data: str, filename: 'with-csharp-error.log', append: false });
          if (isDev) {
            console.log();
            console.log(json);
            console.log('----');
            console.log(error);
            console.log();
          }
          callback({ code: 409, index: -1, total: -1, input: json, error });
        }
        if (cmd === 'server') {
          if (json.state === 'start') {
            query({
              cmd: 'start',
              host: host,
              file: filename,
            }, json.port).then(json => {
              isDev && console.log('[Query response]', json);
            });
          } else if (json.state === 'error') {
            callback({ code: 408, index: -1, total: -1, error: json.error });
          }
        } else if (cmd === 'start') {
          isDev && console.log('开始下发', json);
        } else if (cmd === 'dispatch') {
          let msg = '';
          if (json.code === 0) {
            msg = '完成';
            handle.kill();
            setTimeout(() => callback(json), 90);
          } else if (json.code === 1) {
            msg = '下发中';
            callback(json);
          } else {
            msg = '报错';
            handle.kill();
            setTimeout(() => callback(json), 90);
          }
          // isDev && console.log(msg, json);
        }
      });
    }
  });
};
