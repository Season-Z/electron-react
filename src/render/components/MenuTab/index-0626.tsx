/**
 * 菜单标签组件
 * createDate: 2020年04月29日
 */
// menus数据结构:
// {
//   title: '资料管理',
//   path: '/DataManage',
//   subs: [
//     {
//       title: '商品资料',
//       path: '/Goods',
//       fullPath: '/DataManage/Goods',
//     },
//     {
//       title: '供应商查询',
//       path: '/Suppliers',
//       fullPath: '/DataManage/Suppliers',
//     },
//   ],
// },
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useHistory, useLocation, connect } from 'umi'
import classNames from 'classnames'
import { CloseOutlined, MoreOutlined } from '@ant-design/icons'
import menus from '@config/menus'
import { Popover } from 'antd'
import style from './Style.less'

interface Iprop {
  MenuTabStore: any
}

interface ITab {
  name: string
  path: string
}

/** 可优化点：redux匹配好存本地而不是每次打开页面都遍历,不过性能差距不大
 * 根据path匹配name,返回
 * @param menu 路由菜单
 * @param path 当前路由
 * @return ITab
 */
const matchRouterPath = (menu: any[], path: string, menuList: Array) => {
  for (let item of menu) {
    if (item.fullPath === path) {
      menuList.push({
        name: item.title,
        path: item.fullPath
      })
      break
    }
    // 为编辑页和详情页做补充
    if (path.indexOf(item.fullPath) !== -1) {
      if (path.indexOf('/Detail') !== -1) {
        menuList.push({
          name: item.title + '详情页',
          path: path
        })
      }
      if (path.indexOf('/Edit') !== -1) {
        menuList[0] = {
          name: item.title + '编辑/新增页', // 动态路由控制，为避免不和其他地方冲突，暂时写死
          path: path
        }
      }
      if (path.indexOf('/New') !== -1) {
        menuList.push({
          name: item.title + '新增页',
          path: path
        })
      }
    }

    if (item.fullPath !== path && item.subs && item.subs.length > 0) {
      matchRouterPath(item.subs, path, menuList)
    }
  }
  if (menuList.length) {
    return menuList[0]
  }
}

const MenuTab = (props: Iprop | any) => {
  const location = useLocation()
  const { dispatch = () => { }, MenuTabStore } = props
  const { menuTabList } = MenuTabStore
  const { pathname } = location
  const dashboardPath = '/Home'
  const history = useHistory()
  const cTablimit = 0 // tab控制格式
  const menuTabRef: any = useRef(null)
  const [currentTabObj, setCurrentTabObj] = useState<any>({})
  const isTabShow = pathname.match(/[/]/g).length > 1 // 暂定 二级路由才显示tabList

  // 是否当前tab
  const isTabActive = (e: string) => {
    return classNames(style.tab, {
      [style.menuTabActive]: e === pathname
    })
  }

  const updateMenuTab = (tabList: any[]) => {
    dispatch({
      type: 'MenuTabStore/updateTabList',
      payload: tabList
    })
  }

  // useEffect(() => {
  //   setCurrentTabObj(matchRouterPath(menus, pathname, []) || {})
  //   setRect(menuTabRef.current?.getBoundingClientRect())
  //   window.addEventListener('resize', () => {
  //     setRect(menuTabRef.current?.getBoundingClientRect())
  //   })
  // }, [pathname])


  useEffect(() => {
    setCurrentTabObj(matchRouterPath(menus, pathname, []) || {})
    setRect(menuTabRef.current?.getBoundingClientRect())
    window.onresize = () => {
      setRect(menuTabRef.current?.getBoundingClientRect())
    }
    return () => {
      window.onresize = null // 清除监听
      // console.log('resize:clear')
    }
  }, [pathname])  // 路由变化才监听




  useEffect(() => {
    if (currentTabObj && Object.keys(currentTabObj).length) {
      // 不匹配的路由则无法更新到store
      if (!menuTabList.length) {
        // tabs为空则直接concat
        updateMenuTab(menuTabList.concat([currentTabObj]))
        return
      }
      const isTabExist = menuTabList.filter((e: any) => e.path === pathname)
      if (isTabExist.length) {
        // tab已存在，不处理
        return
      } else {
        updateMenuTab(menuTabList.concat([currentTabObj]))
      }
    }
  }, [currentTabObj]) // 当前tab存在才监听

  // 切换tab
  const toggleTab = (e: string) => {
    history.replace(e)
  }

  // tab控制是否显示
  const isTabControlShow = () => {
    if (menuTabList && menuTabList.length > cTablimit) {
      return style.menuTabWrap + ' ' + style.showTabcontrol
    }
    return style.menuTabWrap
  }

  // 关闭tab
  const closeTabs: any = (e: any, type: string) => {
    e.stopPropagation()
    const clearTab = () => {
      updateMenuTab([])
      history.push(dashboardPath)
    }
    switch (type) {
      case 'current':
        if (menuTabList && menuTabList.length) {
          const _i = menuTabList.findIndex((v: any) => v.path === pathname)
          if (menuTabList && menuTabList.length > 1) {
            const _arr = menuTabList.filter((e: any, i: any) => {
              return i !== _i
            })
            updateMenuTab(_arr)
            if (_arr.length === 1) {
              // 如果当前只剩一个tab
              history.push(_arr[0].path)
            } else {
              history.goBack()
            }
          } else {
            clearTab()
            history.push('/')
          }
        }
        break
      case 'others':
        updateMenuTab([
          {
            name: currentTabObj.name,
            path: pathname
          }
        ])
        break
      case 'all':
        clearTab()
        history.push('/')
        break

      default:
        break
    }
  }

  // 关闭指定tab
  const btnCloseTab = (e: any, path: string) => {
    e.stopPropagation()
    if (currentTabObj.path === path) {
      // 当前
      closeTabs(e, 'current')
      return
    }
    const _i = menuTabList.findIndex((v: any) => v.path === path)
    const _arr = menuTabList.filter((e: any, i: any) => {
      return i !== _i
    })
    updateMenuTab(_arr)
  }

  const tabControlContent = (
    <div className={style.tabControlPop}>
      <div
        onClick={e => {
          closeTabs(e, 'current')
        }}
      >
        关闭当前标签页
      </div>
      <div
        onClick={e => {
          closeTabs(e, 'others')
        }}
      >
        关闭其他标签页
      </div>
      <div
        onClick={e => {
          closeTabs(e, 'all')
        }}
      >
        关闭全部标签页
      </div>
    </div>
  )

  // 太多tab自适应
  const [rect, setRect] = useState(menuTabRef.current?.getBoundingClientRect())
  // console.log('rect', rect);
  useEffect(() => {
    // setRect(menuTabRef.current?.getBoundingClientRect())
    // window.addEventListener('resize', () => {
    //   setRect(menuTabRef.current?.getBoundingClientRect())
    // })
    // return () => {
    //   window.removeEventListener('resize', () => {
    //     setRect(menuTabRef.current?.getBoundingClientRect())
    //   })
    // }
  }, [])
  const rectWidth = useMemo(() => {
    return rect ? rect.width - 18 : '100%'
  }, [rect])
  const tabWidth = useMemo(() => {
    if (typeof rectWidth === 'string') {
      return '100%'
    }
    return rectWidth / menuTabList.length - 3
  }, [rectWidth, menuTabList.length])
  return isTabShow && menuTabList.length ? (
    <div ref={menuTabRef} className={style.menuContainer}>
      <div style={{ width: rectWidth }} className={isTabControlShow()}>
        {menuTabList.map((e: any) => {
          const { path, name } = e
          return (
            <div
              key={path}
              className={`list-tab ${isTabActive(path)}`}
              style={{ width: tabWidth }}
              onClick={() => {
                toggleTab(path)
              }}
            >
              <div key={e} className='ellipsis'>
                {name}
              </div>
              <div className={style.closeTabIcon}>
                <CloseOutlined
                  className={style.tabClose}
                  onClick={item => {
                    btnCloseTab(item, path)
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <Popover content={tabControlContent} placement='bottomRight'>
        <div className={style.moreOut}>
          <MoreOutlined
            className={
              menuTabList && menuTabList.length > cTablimit ? style.showMore : style.hideMore
            }
          />
        </div>
      </Popover>
    </div>
  ) : null
}

export default connect(({ MenuTabStore }: any) => ({
  MenuTabStore
}))(MenuTab)
