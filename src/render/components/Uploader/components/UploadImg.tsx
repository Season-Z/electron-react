import React, { useState } from 'react'
import { Upload, message, Modal } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { imgSuffix } from '../utils/constance'
import { UploadComProps } from '../utils/interface'
import styles from '../index.less'

const suffixs = imgSuffix.join(',').replace(/\image/g, '')

// 获取图片信息
function readFiles(file: any, type: string) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onerror = error => reject(error)

    if (type === 'url') {
      reader.onload = () => resolve(reader.result)
    } else {
      reader.onload = (img: any) => {
        let image: any = new Image()
        image.src = img.target.result
        image.onload = function() {
          resolve(this)
        }
      }
    }
  })
}

function UploadImg(props: UploadComProps) {
  const [previewModal, setPreviewModal] = useState({
    visible: false,
    img: ''
  })

  // 展示预览图
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await readFiles(file.originFileObj, 'url')
    }

    setPreviewModal({ visible: true, img: file.url || file.preview })
  }

  // 上传前的回调
  async function beforeUpload(file: { type: string; size: number }): Promise<any> {
    try {
      const isJpgOrPng = imgSuffix.includes(file.type)
      if (!isJpgOrPng) {
        throw `只能上传后缀名为【${suffixs}】的文件`
      }

      const { size, width, height } = props

      // 如果有传入参数限制图片大小
      if (size) {
        if (file.size / 1024 / 1024 < size) {
          throw `不能上传超过${size}K的图片`
        }
      }

      // 如果有传入参数限制图片尺寸大小
      if (width || height) {
        const size: any = await readFiles(file, 'size')
        if (width && size.width > width) {
          throw `上传图片的最大宽度为${width}`
        }
        if (height && size.width > height) {
          throw `上传图片的最大高度为${height}`
        }
      }

      // 获取上传需要的 token
      await props.beforeUpload(file)
    } catch (error) {
      message.error(error)
      return Promise.reject(error)
    }
  }

  return (
    <>
      <Upload
        name='files'
        accept={props.accept ?? 'image/*'}
        listType='picture-card'
        className={styles.uploader}
        headers={{
          'res-token': props.token
        }}
        fileList={props.fileList}
        action={props.action}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onChange={props.handleChange}
        onRemove={props.handleRemove}
        {...props.uploadOptions}
      >
        {props.loading ? (
          <LoadingOutlined />
        ) : (
          [
            <PlusOutlined key='icon' />,
            <div key='text' className={styles.uploadText}>
              {props.btnText ?? '点击上传'}
            </div>
          ]
        )}
      </Upload>
      <Modal visible={previewModal.visible} footer={null} onCancel={() => setPreviewModal(v => ({ ...v, visible: false }))}>
        <img alt='example' style={{ width: '100%' }} src={previewModal.img} />
      </Modal>
    </>
  )
}

export default UploadImg
