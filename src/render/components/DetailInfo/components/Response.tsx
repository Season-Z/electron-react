/**
 * 响应式布局
 */
import React from 'react';
import classnames from 'classnames';
import { DetailInfoProps } from '../interface';
import '../index.less';

function Response(props: DetailInfoProps) {
  const { map }: any = props;
  const isArray = Array.isArray(map);
  const data = isArray
    ? map
    : Array.from(map.values()).map((v: any) => ({
        label: v[0],
        value: v[1],
        lighthigh: v[2],
      }));

  return (
    <div className="response">
      {data.map((v: any) => (
        <div className="response-item">
          <span className="text">{v.label}：</span>
          <span
            className={classnames('textVal', 'ellipsis', {
              strong: v.lighthigh,
            })}
          >
            {v.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Response;
