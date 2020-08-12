import React, { useEffect, useRef, useState } from 'react'
import useDownLoad from '@hooks/useDownLoadHooks'
import { Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import ypRequest, { ResponstResult } from '@utils/ypRequest'

function DownLoadBtnForExport({ param ,style = {}}: { param: any ,style?:any}) {
    const [downLoadHandle, loading, eventMessage] = useDownLoad()
    const [httpLoading, sethttpLoading] = useState<any>(false)
    const timer = useRef<any>()


    const queryHandle = async () => {
        sethttpLoading(true)
        const res: ResponstResult = await ypRequest(
            'matrix.queryReportService.exportExcel',
            { ...param }
        )
        if(res.success){
            getResult(res.result)
        }

    }

    const getResult = (taskId:any) => {
        ypRequest(
            'matrix.queryReportService.getExportResult',
            {taskId}
        ).then((res:any)=>{
            if(!res.success){
                return message.error(res.error || '下载失败')
            }
            // 正在生成
            if(res.result.state !==2 ){
                timer.current = setTimeout(() => {
                    getResult(taskId)
                }, 2000)
            }else{/** 后端返回成功 */
                if(res.result.limited){
                    message.warn('当前导出数据大于10万条')
                }
                downLoadHandle(res.result.result)
                sethttpLoading(false)
                clearTimeout(timer.current)
            }
        }).catch(()=>{
            clearTimeout(timer.current)
        })
    }


    useEffect(() => {
        if(eventMessage?.isCompleted && eventMessage?.requestSuccess){
            message.success('下载完成！')
        }
        sethttpLoading(false)
    }, [eventMessage])
// 
    return (
        <Button type="primary" style={{ marginBottom: 5 ,...style}} icon={<DownloadOutlined />} loading={loading || httpLoading} onClick={queryHandle}>导出</Button>
    )
}

export default DownLoadBtnForExport
