/**
 * 精品菜打印模板
 */

const FineDishesStyle = `
<style type='text/css' rel='stylesheet'>
body
{display:block;padding:0px 2px;width:100%;height:100%;font-size: 12px}
.print-container{
  display: flex;
  flex-direction: row;
  width: 250px;
  justify-content: space-between;
  padding-left: 5px;
}
.print-content-1{
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.print-content-2{
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.good-name{
  font-size: 15px;
  font-weight: 600;
  word-break:break-all;
  word-wrap:break-word;
  margin: 3px 0;
}
.good-code {
  width: 100%;
  display: flex;
  justify-content: center;
}
.good-code svg {
  width: 60px;
  height: 30px;
}
</style>`
export const FineDishesTpl = (item: any) => {
  return {
    pageHtml: `
 <head>${FineDishesStyle}</head>
 <body>
 <div class="print-container">
   <div class="print-content-1">
   <table border=1 style="border:none;border-collapse: collapse;" >
      <tr>
          <td style="border: none;
          word-break: break-all;
          word-wrap: break-word;">
          <div class="good-name">${item['productName'] || ''}</div>
          </td>
      </tr>
    </table>
   </div>
   <div class="print-content-2">
   <table border=1 style="border:none;border-collapse: collapse;" >
   <tr>
       <td style="border: none;
       word-break: break-all;
       word-wrap: break-word;">
       <div class="good-name">${item['productName'] || ''}</div>
       </td>
   </tr>
 </table>
   </div>
 </div>
 </body>`
  }
}

// <div class="good-name">${item['productName'] || ''}</div>

