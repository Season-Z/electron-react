/**
 * 菜单栏
 */
import React, { useState } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import _menuList from '@common/menu'
import { updateMenuTab, setCurMenuTab } from '@redux/menuTab.redux'
import { connect } from 'react-redux'
import style from './menu.less'

const { SubMenu } = Menu

interface Iprop {
  updateMenuTab?: any
  tabList?: any
  pathname?: string
}

const MyMenu = (props: Iprop & any) => {
  const [collapsed, setCollapsed] = useState(false)
  const [menuList, setMenuList] = useState(_menuList)
  const { tabList, updateMenuTab, setCurMenuTab, pathname } = props
  console.log('props', props);
  // 添加tab
  const addMenuTab = (p: any) => {
    setCurMenuTab(p.route)
    const isExsit = tabList.filter(e => { return e.path === p.route })
    if (isExsit && isExsit.length) return;
    const _list = tabList.concat([{
      name: p.name,
      path: p.route
    }])
    updateMenuTab(_list)
  }

  const renderMenu = (list: any) => {
    return list.map((item: any) => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu title={item.name} key={item.id}>
            {renderMenu(item.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item title={item.title} key={item.route} onClick={()=>{addMenuTab(item)}}>
          <Link to={item.route}>{item.name}</Link>
        </Menu.Item>
      )
    })
  }

  return (
    <div className={style.menuWrap}>
      {menuList.length > 0 ? (
        <Menu
          mode='inline'
          theme='dark'
          selectedKeys={[`${pathname}`]}
        >
          {renderMenu(menuList)}
        </Menu>
      ) : (
          <Menu
            mode='inline'
            theme='dark'
            selectedKeys={[`${pathname}`]}
          >
            <Menu.Item key='1'>
              <span>首页</span>
            </Menu.Item>
          </Menu>
        )}
    </div>
  )
}

// export default MyMenu

const mapStateToProps = (state: any) => {
  return {
    tabList: state.menuTab.menuTabList.list,
  }
}
const mapDispatchToProps = {
  updateMenuTab,
  setCurMenuTab
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMenu)