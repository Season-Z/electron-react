const fs = require('fs');
const axios = require('axios');
const { dialog } = require('electron');

// 只适用于公司所用的oss文件下载，主要问题是获取content-disposition，content-length与泛网络资源不一致,那索性就只支持下载表格好了
async function downloadFile(file_url) {
  if(!file_url) return  {isCompleted:true}
  let filename = '新建工作簿'
  const result = await axios.get(file_url, { responseType: 'stream' });
  console.log(result)
  if(result.status === 200){ // 资源有效 请求成功
    /** 文件类型 */
    const execResult =  /''((['"]).*?\2|[^;\n]*)/.exec(result.headers['content-disposition'])
    if(execResult){
        filename = decodeURIComponent(execResult[1])
    }
    const dialogResult = await dialog.showSaveDialog({ 
      defaultPath:filename,
      filters:[
      { name: '工作簿', extensions: ['xlsx','xls'] },
    ] });
      if (!dialogResult.canceled) {
        const directoryPath = dialogResult.filePath;
        // create a writeable stream
        let out = fs.createWriteStream(directoryPath);
        // write into writeable stream
        result.data.pipe(out);
        return new Promise(res=>{
          result.data.on('end', function () {
            res({isCompleted:true,requestSuccess:true})
          })
        })
      }else{
      return {isCompleted:true,cancel:true}
      }

  }else{
    return {isCompleted:true,requestSuccess:false}
  }
}

function getFilenameFromUrl(url){
  return url.substring(url.lastIndexOf('/') + 1);
}
module.exports = {
  downloadFile
};
