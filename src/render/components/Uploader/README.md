## Antd的 Upload 封装

#### 基本功能

1. 集成了图片、文件上传
2. 对图片各项参数做了强校验

```tsx
// 上传、删除时都会触发此回调
const changeUploader = (files:any[]) => {
  console.log(files)
}
// 删除时需要做的额外请求操作
const removeFile = async(file:any) => {
  // await ....
  
  return true/false;
}

<Uploader
  type='img'
  onChange={changeUploader}
  onRemove={removeFile}
  tokenParams={{ bizDescription: '会员中心图片上传', fileType: 3 }}
/>

interface UploaderProps {
  tokenParams: any      // 上传前请求token的参数结构
  onChange?: (arg: any) => void   // 每次操作的回调，都会返回文件的信息
  defaultFileList?: any[]    // 默认展示的文件列表
  type?: FieldType     // 上传的类型，目前有 图片和文件上传 ，对应 'img'和'normal'，不传默认是文件上传
  size?: number      // 上传文件大小做限制，比较单位为kb
  width?: number     // 上传图片的宽度限制
  height?: number     // 上传图片的高度限制
  accept?: string    // 上传文件的类型
  btnText?: string      // 上传按钮的文案
  onRemove?: (arg: any) => boolean   // 如果需要在删除文件、图片时做异步请求校验，可调用此接口返回布尔值
}
```

