import React from 'react'
import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadComProps } from '../utils/interface'

function CommonUploader(props: UploadComProps) {
  const { disabled } = props.uploadOptions
  return (
    <Upload
      name='files'
      accept={props.accept}
      action={props.action}
      // showUploadList={props.isFileNameShow}
      headers={{
        'res-token': props.token
      }}
      fileList={props.fileList}
      beforeUpload={props.beforeUpload}
      onChange={props.handleChange}
      onRemove={props.handleRemove}
      {...props.uploadOptions}
    >
      <Button loading={props.loading} disabled={props.loading || disabled} type='primary'>
        <UploadOutlined /> {props.btnText ?? '点击上传'}
      </Button>
    </Upload>
  )
}

export default CommonUploader
