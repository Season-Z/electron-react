// import apiUrl from '../config/apiUrl'
let apiUrl = '/Ashx/common.ashx?function=download'
//单个文件下载
function getDownloadIframe() {
  let iframe = document.getElementById('lct_utils_download_iframe_')
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'lct_utils_download_iframe_'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  }
  return iframe
}
//多文件下载
function getMultiDownloadIframe(index) {
  let iframeList = document.getElementsByClassName('lct_utils_download_iframe_list_item_')
  let iframe = index < iframeList.length ? iframeList[index] : null
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.className = 'lct_utils_download_iframe_list_item_'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  }
  return iframe
}
//下载
function download(url, params, iframe, name) {
  params = params || {}
  for (let key in params) {
    if (url.indexOf('?') >= 0) {
      url += `&${key}=${params[key]}`
    } else {
      url += `?${key}=${params[key]}`
    }
  }
  iframe.src = ''
  if (/\.(jpg|gif|bmp|png|jpeg|pdf)/g.test(url)) {
    iframe.src =
      apiUrl.DOWNLOAD +
      '&url=' +
      encodeURIComponent(url) +
      (name
        ? '&newfilename=' + encodeURIComponent(name.replace(/\.(jpg|gif|bmp|png|jpeg|pdf)/g, ''))
        : '')
  } else {
    iframe.src = url
  }
}

export default function(urls, params, newNames) {
  let iframe
  if ((typeof urls).toLowerCase() === 'string') {
    iframe = getDownloadIframe()
    download(urls, params, iframe, newNames)
  } else {
    newNames = newNames || []
    let k = 0
    urls.forEach(url => {
      iframe = getMultiDownloadIframe(k)
      setTimeout(
        (function(url, params, iframe, newNames) {
          return function() {
            download(url, params, iframe, newNames)
          }
        })(url, params, iframe, newNames[k]),
        1000 * k
      )
      // download(url, params, iframe, newNames[k]);
      k++
    })
  }
}
