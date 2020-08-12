const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * log地址：C:\Users\用户\AppData\Local\Temp\ypshop
 * @param {string} data 
 * @param {string} filename 
 */
exports.log = function ({ data = '', filename = 'log.log', append = true }) {
  return new Promise(resolve => {
    const ypshop = path.join(os.tmpdir(), 'ypshop');
    fs.existsSync(ypshop) || fs.mkdirSync(ypshop);
    const _data = new Date().toLocaleString() + '\n' + data + '\n'
    fs[append ? 'appendFile' : 'writeFile'](path.join(ypshop, filename), _data, resolve);
  });
};
