/**
 * 普通 快消(无黄条) 打印模板
 * 60* 35
 */

import { goodsPriceExchange } from '../utils'

const QuickConsumeNoYellowStyle = `
<style type='text/css' rel='stylesheet'>
body
{display:block;
  padding:0px 2px;
  width:100%;
  height:100%;
  font-size: 12px;
  font-family: 'SimHei';
}
.print-container{
  display: flex;
  flex-direction: column;
  width: 260px;
}
.good-name{
  height: 40px;
  width: 180px;
  padding-left: 20px;
  font-size: 16px;
  font-family: 'SimHei';
  font-weight: 1000;
}
.good-content{
  display: flex;
  position: relative;
}
.good-price{
  display: flex;
  width: 60%;
  position: absolute;
  flex-direction: column;
  align-items: center;
  top: 30px;
  left: 20px;
}
.good-price svg{
  width: 90px;
  height: 30px;
  font-size: 14px;
}
.good-code{
  margin-top:10px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.price{
  position: absolute;
  bottom: -10px;
  right: 32px;
  font-size: 24px;
  font-weight: 800;
}
.good-detail{
  display: flex;
  flex-direction: column;
  padding-left: 5px;
  margin-top: -7px;
  font-size: 10px;
  width: 40%;
}
.good-unit{
  height: 20px;
  line-height: 20px;
  margin-left: 36px;
  margin-top: -2px;
}
.good-standard{
  height: 20px;
  line-height: 20px;
  margin-left: 20px;
  margin-top: 1px;
}
.good-producer{
  height: 20px;
  line-height: 20px;
  margin-left: 20px
}
.price-invalid{
  text-decoration: line-through;
  position: absolute;
  top: -8px;
  left: 111px;
  font-size: 10px;
}
.special-end{
  position: absolute;
  top: -7px;
  left: 138px;
  font-size: 7px
}
.special-price{
  position: absolute;
  top: 30px;
  left: 124px;
  font-size: 10px
}
.special-tip{
  position: absolute;
  top: 30px;
  left: 80px;
  font-size: 14px;
  font-weight: 300;
}
.activity-price{
  position: absolute;
  top: 50px;
  right: 60px;
  font-size: 20px;
  font-weight: 600
}
.common-price{
  position: absolute;
  top: 12px;
  right: 70px;
}

</style>`

export const QuickConsumeNoYellowTpl = (item: any) => {
  const isActivity = item['isActivityType'] === 1
  return {
    pageHtml: `
    <head>${QuickConsumeNoYellowStyle}</head>
    <body>
    <div class="print-container">
    <table border=1 style="border:none;border-collapse: collapse;margin-top:10px" >
      <tr>
          <td style="border: none;
          word-break: break-all;
          word-wrap: break-word;">
          <div class="good-name">${item['productName'] ? item['productName'] : ''}</div>
          </td>
      </tr>
    </table>

      <div class="good-content">

      ${
        item.activityEndTime
          ? `<div class="special-end">特价结束: ${item.activityEndTime}</div>`
          : ''
      }


      ${
        isActivity
      ? `
      <div class="special-tip">特价</div>
      <div class="common-price">
      <span style="font-size: 40px; font-weight: 600;">${(goodsPriceExchange(item.activityPrice) + "").split(".")[0]}</span>
      <span style="font-size: 24px;font-weight: 600;">.${(goodsPriceExchange(item.activityPrice) + "").split(".")[1]}</span>
      </div>
          `
          : ''
      }
      ${
        !isActivity && goodsPriceExchange(item['salePrice'])
      ?
      `<div class="common-price">
      <span style="font-size: 40px; font-weight: 600;">${(goodsPriceExchange(item.salePrice) + "").split(".")[0]}</span>
      <span style="font-size: 24px;font-weight: 600;">.${(goodsPriceExchange(item.salePrice) + "").split(".")[1]}</span>
      </div> `
          : ''
      }
      ${
        item['activityPrice'] && isActivity
          ? `
          <div class="price-invalid">${goodsPriceExchange(item.salePrice)}</div>`
          : ''
      }


      <div class="good-detail">
          <div class="good-unit">${item.unit !== undefined ? item.unit : ''}</div>
          <div class="good-standard">${item.specDesc !== undefined ? item.specDesc : ''}</div>
          <div class="good-producer">${item.producingArea !== undefined ? item.producingArea : ''}</div>
          </div>


      </div>
    </div>

    </body>`
  }
}
