import _ from 'lodash';

// 获取唯一的key
export function getEditableTableKey() {
  return _.uniqueId('edittable_');
}

/**
 * 对比和替换列表数据
 * @param list 列表数据
 * @param data 更新后的 列表行数据
 */
export function compareAndChangeData(list: any[], data: any) {
  return list.map((v: any) =>
    v.editableTableKey === data.editableTableKey ? { ...v, ...data } : v,
  );
}

/**
 * 是否为空
 * @param params
 */
export function isEmpty(params: any) {
  return _.isEmpty(params);
}
