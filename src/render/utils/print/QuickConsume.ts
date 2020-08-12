/**
 * 快消(有黄条) 价签模板
 * 69* 35 特价+无特价
 */

import { goodsPriceExchange } from '../utils'

const QuickConsumeStyle = `
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
  padding-left: 15px;
  font-size: 16px;
  font-weight: 1000;
}
.good-content{
  padding-top: 10px;
  display: flex;
}
.good-price{
  display: flex;
  width: 60%;
  position: relative;
  flex-direction: column;
  align-items: center;
}
.good-price svg{
  width: 90px;
  height: 40px;
  font-size: 14px;
}
.good-code{
  width: 100%;
  display: flex;
  justify-content: center;
}
.price{
  position: absolute;
  bottom: -18px;
  right: 32px;
  font-size: 28px;
  font-weight: 800;
  font-family: 'STKaiti';
}
.good-detail{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  margin-left: -5px
}
.good-unit{
  height: 20px;
  line-height: 20px;
}
.good-standard{
  height: 20px;
  margin-left: -25px;
  line-height: 20px;
}
.good-producer{
  height: 20px;
  margin-left: -30px;
  line-height: 20px;
}
.price-invalid{
  text-decoration: line-through;
  position: absolute;
  top: 10px;
  left: 3px;
}
.special-end{
  position: absolute;
  top: 50px;
  left: 124px;
  font-size: 10px
}
.special-tip{
  position: absolute;
  top: 50px;
  left: 13px;
  font-size: 16px;
  font-weight: 300;
}
</style>`

export const QuickConsumeTpl = (item: any) => {
  const isActivity = item['isActivityType'] === 1
  return {
    pageHtml: `
    <head>${QuickConsumeStyle}</head>
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
        item['activityEndTime']
          ? `<div class="special-end">特价结束: ${item['activityEndTime']}</div>`
          : ''
      }
        <div class="good-price">
        ${
          isActivity
            ? `<div class="price-invalid">${goodsPriceExchange(item['salePrice'])}</div>`
            : ''
        }

        ${isActivity ? `<div class="special-tip">特价</div>` : ''}
        ${
          isActivity
      ? `
      <div class="price">
      <span style="margin-right: -3px;font-size: 40px; font-weight: 600;letter-spacing: -2px;">
      ${(goodsPriceExchange(item.activityPrice) + "").split(".")[0]}</span>
      <span style="font-size: 24px;font-weight: 600;">.${(goodsPriceExchange(item.activityPrice) + "").split(".")[1]}</span>
      </div>
      `
      : `

      <div class="price">
      <span style="margin-right: -3px;font-size: 40px; font-weight: 600;letter-spacing: -2px;">
      ${(goodsPriceExchange(item.salePrice) + "").split(".")[0]}</span>
      <span style="font-size: 24px;font-weight: 600;">.${(goodsPriceExchange(item.salePrice) + "").split(".")[1]}</span>
      </div>

      `
        }



      </div>
      ${
      isActivity ? '' :
      `<div class="good-detail">
        <div class="good-unit">${item['unit'] || ''}</div>
        <div class="good-standard">${item['specDesc'] || ''}</div>
        <div class="good-producer">${item['producingArea'] || ''}</div>
      </div>`
      }
      ${
        !isActivity ? '' :
        `<div class="good-detail">
          <div class="good-unit">${item['unit'] || ''}</div>
          <div class="good-standard">${item['specDesc'] || ''}</div>
          <div class="good-producer">${item['producingArea'] || ''}</div>
        </div>`
        }
    </div>

    </body>`
  }
}
