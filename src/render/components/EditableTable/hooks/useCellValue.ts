/**
 * 单元格的数据格式化
 */
import { useMemo } from 'react';
import { DataListType } from '../interface';

type DataList = ((arg: any) => DataListType[]) | DataListType[] | any;

export interface UseCellValueProps {
  children: any[] | any;
  dataList: DataList;
}

function useCellValue(props: UseCellValueProps): [any[] | any, DataList] {
  const { children, dataList } = props;

  // 针对存在「list」的单元格进行设置；使单元格展示的是文案而不是值
  const childContent = useMemo(() => {
    if (!Array.isArray(children)) {
      return children;
    }
    /**
     * 如果当前单元格的 可编辑 状态是 Select、Radio等具有「list」属性的表单控件
     * 1. 对该值进行判断校验
     * 2. 最后获取到该值对应的 中文 文案，并交给Table渲染该单元格
     */
    const val: any = children.slice(1)[0];
    const childType = typeof val;

    if (!val) {
      return children;
    }

    if (childType === 'object' || childType === 'function') {
      return children;
    }

    // 过滤可能出现的不必要的标签
    const newChildren =
      childType === 'string'
        ? val.replace('<tt>', '').replace('</tt>', '')
        : val;
    if (!dataList) {
      return [undefined, newChildren];
    }

    const { label } =
      (dataList as Array<any>).find((v: any) => v.value === val) || {};
    return [undefined, label ?? val];
  }, [children, dataList]);

  return [childContent, dataList];
}

export default useCellValue;
