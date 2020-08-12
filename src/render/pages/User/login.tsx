import React, { useState, useEffect } from 'react'
import { useDispatch, history } from 'umi'
import CommonWrap from '@components/CommonWrap'
import { message, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import ypStore from '@utils/ypStore/'
import ypRequest from '@utils/ypRequest/'
import EnvModal from './components/envmodal'
import './style.normal.less'
import bgImg2 from '@/assets/bg2.jpg'
import bgImg3 from '@/assets/bg3.png'
import bgImg4 from '@/assets/bg4.png'
import initGeetest from './geetest.js'
import { SHOP_CURRENT } from '@config/constant'
import { getShopList } from './use.utils'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
const Login = (props: any & RouteComponentProps) => {
  let [visible, setVisible] = useState(false)
  let [num, setNum] = useState(0)
  let [loginMsg, setLoginMsg] = useState('确认登录')
  let [captchaObj, SetCaptchaObj] = useState(null)
  let [count, setCount] = useState(60)
  let [isSend, setIsSend] = useState(false)
  let [env, setEnv] = useState(ypStore.get('env') || 'prod')
  let [mobile, setMobile] = useState<string>() // TODO: 临时设置，上线移除
  let [result, setResult] = useState(null)
  let [isSuccess, setSuccess] = useState(false)

  let [verifyCode, setVerifyCode] = useState()

  const dispatch = useDispatch()

  const verifyCodeFunc = e => {
    setVerifyCode(e.target.value)
  }
  const setMobileFunc = e => {
    setMobile(e.target.value)
  }
  const checkMobile = () => {
    let reg = /^1((3[\d])|(4[5,6,7,9])|(5[0-3,5-9])|(6[5-7])|(7[0-8])|(8[\d])|(9[1,8,9]))\d{8}$/
    // //console.log(reg.test(this.form.login))
    if (!mobile) {
      message.error('请先输入手机号')
      return false
    } else {
      if (!reg.test(mobile)) {
        message.error('请输入正确的手机号')
        return false
      } else {
        return true
      }
    }
  }
  const sendCode = async () => {
    // api: "usercenter.sms.sendVerifyCode"
    const apiUrl = 'usercenter.sms.sendVerifyCode'
    const flag = checkMobile()
    if (flag) {
      if (isSuccess) {
        const dataObj = {
          behaviorChallenge: (result as any).geetest_challenge,
          behaviorValidate: (result as any).geetest_validate,
          behaviorSeccode: (result as any).geetest_seccode
        }
        try {
          const dataVal = { mobile: mobile, bizId: 'login' }
          const res: any = await ypRequest(apiUrl, dataVal, dataObj)
          if (res.success) {
            message.success('短信发送成功')
            setIsSend(true)
          }
        } catch (error) {}
      } else {
        message.error('请先验证身份')
      }
    }
  }
  const getGeeTest = async () => {
    const apiUrl = 'usercenter.behavior.preProcess'
    try {
      const res = await ypRequest(apiUrl, {})
      initGeetest(
        {
          // 以下配置参数来自服务端 SDK
          gt: (res as any).result.gt,
          challenge: (res as any).result.challenge,
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
  const [loginInfo, setLoginInfo] = useState({
    env: '',
    token: ''
  })
  const changeLoginInfo = (type: string, value: any) => {
    setLoginInfo({ ...loginInfo, [type]: value })
  }
  const hideModalFunc = (type, val) => {
    if (type === 2) {
      setEnv(val)
    }
    setVisible(false)
  }
  const openModal = () => {
    num++
    setNum(num)
    if (num > 4) {
      setVisible(true)
    }
  }
  const queryId = async (phone: string | number) => {
    try {
      const apiUrl = 'auth.subject.getSubjectByPhone'
      const dataVal = { tenantId: 1, phone }
      const res: any = await ypRequest(apiUrl, dataVal)
      if (res.success) {
        const data = res.result.data
        ypStore.set('employee', data)
        return data.subjectId
      } else {
        return null
      }
    } catch (error) {}
  }

  const switchSubject = async (id: any) => {
    try {
      const apiUrl = 'auth.subject.switchSubject'
      const dataVal = { tenantId: 1, subjectId: id }
      const res: any = await ypRequest(apiUrl, dataVal)
      if (res.success) {
        if (res.result.success) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } catch (error) {}
  }
  const loginFunc = async () => {
    // if (mobile && verifyCode) {
    //   try {
    //     setLoginMsg('登录中')
    //     const apiUrl = 'userceneter.login.mobileLogin'
    //     const dataVal = { tenantId: 1, mobile: mobile, role: 1, verifyCode: verifyCode }
    //     const res: any = await ypRequest(apiUrl, dataVal)
    //     if (res.success) {
    //       ypStore.set('token', res.result.token)
    //       ypStore.set('userInfo', res.result.employee)
    //       const subjectId = await queryId(res.result.employee.mobile)
    //       if (subjectId) {
    //         const switchFlag = await switchSubject(subjectId)
    //         if (!switchFlag) {
    //           message.error('登录失败!!!')
    //           setLoginMsg('确定登录')
    //           return false
    //         }
    //         const [bool, shop, shopList, merchantList] = await getShopList(subjectId)

    //         if (bool) {
    //           ypStore.set('subjectId', subjectId)
    //           dispatch({ type: 'global/shop', shop })
    //           // 所有门店列表
    //           ypStore.set(SHOP_LIST, shopList)
    //           ypStore.set(SHOP_CURRENT, shop)
    //           setLoginMsg('确定登录')
    //           message.success('登录成功')
    history.replace('/')
    //         } else {
    //           setLoginMsg('确定登录')
    //           message.error('登录失败，该账号下没有门店')
    //         }
    //       } else {
    //         setLoginMsg('确定登录')
    //         message.error('登录失败，请核对账号权限信息')
    //       }
    //     } else {
    //       setLoginMsg('确定登录')
    //     }
    //   } catch (error) {}
    // } else {
    //   message.error('请输入完整信息')
    // }
  }

  useEffect(() => {
    getGeeTest()
  }, [])
  useEffect(() => {
    const env = ypStore.get('env') || process.env.YPSHOP_ENV || 'sit'
    setEnv(env)
  }, [visible])
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
      <EnvModal
        visible={visible}
        hideModal={(type, val) => {
          hideModalFunc(type, val)
        }}
      ></EnvModal>
      <div className='loginPage' style={{ background: '#151c49' }}>
        <div id='applogin'>
          <div className='bottomBtn' onClick={loginFunc}>
            {loginMsg === '登录中' ? <Spin indicator={antIcon} /> : null} {loginMsg}
          </div>
          <div
            onClick={env === 'prod' ? undefined : openModal}
            className='poImgTop'
            style={{ backgroundImage: `url(${bgImg3})` }}
          ></div>
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
