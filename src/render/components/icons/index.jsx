import { icons, iconFonts } from './icon';
import React, { forwardRef } from 'react';
import { Select, Icon } from 'antd';
import './icon.less';

/**
 * 权限管理里面粘贴过来的
 * 此项目 antd@4，所以用不到只做参考
 */

const { Option } = Select;
const scriptUrl = '//at.alicdn.com/t/font_1492696_4ai9rbngxhe.js';

const IconFont = Icon.createFromIconfontCN({ scriptUrl });
export default forwardRef((props, ref) => {
  const options = icons.map((item, index) => (
    <Option key={item} value={item}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {item}
        <Icon type={item} />
      </div>
    </Option>
  ));
  const iconFontOptions = iconFonts.map((item, index) => (
    <Option key={item.value} value={item.value}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {item.label}
        <IconFont className='permission-iconfont' type={item.value} />
      </div>
    </Option>
  ));
  return (
    <Select ref={ref} placeholder='选择icon' {...props}>
      {options}
      {iconFontOptions}
    </Select>
  );
});
