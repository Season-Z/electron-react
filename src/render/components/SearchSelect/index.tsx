
/**
 * SELECT - 下拉搜索组件
 * createDate: 2020年04月27日
 * <SearchSelect
    type={type}
    disabled={searchShow}
    callBack={e => _callBack(e, type)}
    searchUrl={SUPPLIER_FARMER_LIST_API}
    paramsKey='SupplierName'
    fields={{text: 'SupplierName', value: 'SupplierCode'}}
    />
 */

import React, { useState } from 'react';
import { Select, Spin, message } from 'antd';
import debounce from 'lodash/debounce';
import ypRider from '@utils/ypRequest'

const { Option } = Select;

interface IProps {
  callBack: any // 回调
  searchUrl: string // 模糊搜索 请求接口
  type?: string, // 兼容不同接口数据返回类型,一般不用填
  fields: { // 接口返回数据字段名，如： 供应商管理返回的text和value对应的字段是：  supplierName supplierCode
    text: string
    value: string | number
  }
  paramsKey?: string // 请求参数key，如： supplierName
}

const SearchSelect = (props: IProps) => {
  const { callBack, searchUrl, type, fields, paramsKey } = props;
  const [state, setState] = useState({
    data: [],
    value: [],
    fetching: false,
  })
  let lastFetchId = 0;
  let _res;

  const msgNotFound = () => {
    setTimeout(() => {
      message.info('未查询到指定信息')
      setState({ ...state, fetching: false });
      return;
    }, 1500);
  }

  const fetchFoo = async value => {
    lastFetchId += 1;
    const fetchId = lastFetchId;
    setState({ ...state, data: [], fetching: true });
    const params = {
      // TODO: 分页优化
      page: 1,
      size: 30,
    }
    if (paramsKey) {
      params[paramsKey] = value
    }
    try {
      const res: any = await ypRider(searchUrl, params)
      if (fetchId !== lastFetchId) { // 不匹配则不处理
        return;
      }
      if (type === 'settlementCompany') {  // 兼容查询公司接口返回
        _res = res.result.companyList
        if (_res && !_res.length) {
          msgNotFound()
        }
        if (_res && _res.length) {
          const data = _res.map(e => ({
            text: e[fields.text],
            value: e[fields.value],
          }));
          setState({ ...state, data, fetching: false });
        }
        return;
      }
      _res = res.result.list // 其他通用返回格式
      if (_res && !_res.length) {
        msgNotFound()
      }
      if (_res && _res.length) {
        const data = _res.map(e => ({
          text: e[fields.text],
          value: e[fields.value],
        }));
        setState({ ...state, data, fetching: false });
      }
    } catch (error) {
      console.error('fetchFooERROR', error);
    }
  };

  const fetchMsg = debounce((fetchFoo), 500);

  const handleChange = value => {
    callBack(value)
    setState({
      value,
      data: [],
      fetching: false,
    });
  };
  const { fetching, data, value } = state;
  return (
    <Select
      disabled={props.disabled}
      mode="multiple"
      labelInValue
      value={value}
      placeholder="请输入"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetchMsg}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      {data.map((d: any) => (
        <Option key={d.value} value={d.value}>{d.text}</Option>
      ))}
    </Select>
  );
}

export default SearchSelect



