import React, { useState, useEffect } from 'react'
import { history } from 'umi'
import CommonWrap from '@components/CommonWrap'
import { withRouter } from 'react-router-dom'
import bgImg2 from '@/assets/bg2.jpg'
import bgImg3 from '@/assets/bg3.png'
import bgImg4 from '@/assets/bg4.png'
import initGeetest from './geetest.js'
import './style.normal.less'

const Login = () => {
  let [captchaObj, SetCaptchaObj] = useState(null)
  let [count, setCount] = useState(60)
  let [isSend, setIsSend] = useState(false)
  let [mobile, setMobile] = useState<string>() // TODO: 临时设置，上线移除
  let [result, setResult] = useState(null)
  let [isSuccess, setSuccess] = useState(false)

  let [verifyCode, setVerifyCode] = useState()

  const verifyCodeFunc = (e: any) => {
    setVerifyCode(e.target.value)
  }
  const setMobileFunc = (e: any) => {
    setMobile(e.target.value)
  }

  const sendCode = async () => {}

  const getGeeTest = async () => {
    // const apiUrl = 'usercenter.behavior.preProcess'
    try {
      // const res = await ypRequest(apiUrl, {})
      initGeetest(
        {
          // 以下配置参数来自服务端 SDK
          gt: '78faa80b2dc18808c4f09fc60a647f1f',
          challenge: 'ed822347dd15325629daffbe322525a4',
          offline: false,
          new_captcha: true,
          https: true,
          product: 'popup',
          width: '100%'
        },
        function(captchaObj: any) {
          captchaObj.appendTo('#appendTo') // 将验证按钮插入到宿主页面中captchaBox元素内
          captchaObj
            .onReady(function() {
              // your code
              SetCaptchaObj(captchaObj)
            })
            .onSuccess(function() {
              let result = captchaObj.getValidate()
              // 验证通过了才有
              setResult(result)
              setSuccess(true)
            })
            .onError(function() {
              // your code
            })
          // 这里可以调用验证实例 captchaObj 的实例方法
        }
      )
    } catch (error) {}
  }

  const loginFunc = async () => {
    history.replace('/')
  }

  useEffect(() => {
    getGeeTest()
  }, [])

  useEffect(() => {
    let timer: any
    if (isSend && count !== 0) {
      timer = setInterval(() => {
        // 这时候的num由于闭包的原因，一直是0，所以这里不能用setNum(num-1)
        setCount(n => {
          if (n === 0) {
            setIsSend(false)
            setCount(60)
            clearInterval(timer)
          }
          return n - 1
        })
      }, 1000)
    } else {
      setIsSend(false)
      setCount(60)
    }
    return () => {
      // 组件销毁时，清除定时器
      clearInterval(timer)
    }
  }, [count, isSend])
  return (
    <CommonWrap id='logincomwrap'>
      <div className='loginPage' style={{ background: '#151c49' }}>
        <div id='applogin'>
          <div className='bottomBtn' onClick={loginFunc}>
            确认登录
          </div>
          <div className='poImgTop' style={{ backgroundImage: `url(${bgImg3})` }}></div>
          <div className='topDesc part1' style={{ backgroundImage: `url(${bgImg4})` }}></div>
          <div className='formPart'>
            <div className='inputPart'>
              <div className='lepart'>手机号</div>
              <div className='ripart'>
                <input
                  type='text'
                  onChange={setMobileFunc}
                  placeholder='请输入手机号'
                  className='cominput'
                  value={mobile || ''}
                  maxLength={11}
                />
              </div>
            </div>

            <div id='appendTo'></div>

            <div className='inputPart pr'>
              <div className='lepart'>验证码</div>
              <div className='ripart flex1'>
                <input
                  type='text'
                  onChange={verifyCodeFunc}
                  placeholder='请输入验证码'
                  className='cominput'
                  value={verifyCode || ''}
                  maxLength={6}
                />
              </div>

              {isSend ? (
                <div className='hpo hpo2'>{count}s后重新获取</div>
              ) : (
                <div className='hpo' onClick={sendCode}>
                  获取验证码
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='bottomBg' style={{ backgroundImage: `url(${bgImg2})` }}></div>
      </div>
    </CommonWrap>
  )
}

export default withRouter(Login)
