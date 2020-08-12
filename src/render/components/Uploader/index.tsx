import React, { useState } from 'react'
import { message } from 'antd'
import CommonUploader from './components/CommonUploader'
import UploadImg from './components/UploadImg'
import api from './utils/api'
import { uploadTokenUrl } from './utils/constance'
import { UploaderProps as IProps } from './utils/interface'
import ypRider from '@utils/ypRequest'

function Uploader(props: IProps) {
  const { type, tokenParams } = props
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList]: any = useState(props.defaultFileList ?? [])

  // 上传前  先获取 token
  const beforeUpload = (file: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const res: any = await ypRider(uploadTokenUrl, tokenParams)

        // 获取上传的 token 失败
        if (!res.success) {
          throw res.message ?? '获取token失败'
        }
        if (!res.result || !res.result.token) {
          // eslint-disable-next-line no-throw-literal
          throw '请求成功，但无有效 token 信息'
        }

        setToken(res.result.token)
        resolve(file)
      } catch (error) {
        message.error(error)
        reject(file)
      }
    })
  }

  const handleChange = async ({ file, fileList }: any) => {
    if (file.status === 'uploading') {
      setLoading(true)
      setFileList(fileList)
      return
    }

    if (file.status === 'error') {
      message.error(`图片【${file.name}】上传失败`)
      setLoading(false)
      return
    }

    if (file.status === 'done') {
      setLoading(false)
      const { name, uid } = file
      const { code, msg, data } = file.response

      // 上传失败
      if (code !== 200) {
        message.error(msg)
        return
      }

      // 设置 fileList
      const fileOriginPath = data.url + '/' + data.files[0]
      const obj = [{ uid, name, status: 'done', url: fileOriginPath, files: data.files[0] }]
      // const newFileList = fileList.filter((v: any) => !!v.url).concat(obj)
      setFileList(obj)

      if (props.onChange) {
        props.onChange(obj)
      }
    }
  }

  const removeFile = (file: any) => {
    const list = fileList.filter((v: any) => v.uid !== file.uid)
    setFileList(list)
    // 将结果返回
    if (props.onChange) {
      props.onChange(list)
    }
  }

  // 删除 fileList
  const handleRemove = async (file: any) => {
    try {
      if (props.onRemove) {
        const res = await props.onRemove(file)

        // 如果返回为 true 可以删除
        if (res) {
          removeFile(file)
        }
        return res
      }

      // 没有异步判断则直接删除
      removeFile(file)

      return true
    } catch (error) {
      message.error(error)
      return false
    }
  }

  const uploadCommonProps = {
    action: api.uploadUrlNew,
    token,
    loading,
    fileList,
    beforeUpload,
    handleChange,
    handleRemove
  }

  if (type === 'img') {
    return <UploadImg {...props} {...uploadCommonProps} />
  }

  return <CommonUploader {...props} {...uploadCommonProps} />
}

export default Uploader
export interface UploaderProps extends IProps {}
