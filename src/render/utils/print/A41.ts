/**
 * A4 普通打印模板
 */

const A41Style = `
<style type='text/css' rel='stylesheet'>
body
{display:block;padding:0px 2px;width:100%;height:100%;font-size: 12px}
.print-container{
  display: flex;
  flex-direction: row;
  width: 240px;
  justify-content: space-between;
}
.print-content-1{
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.print-content-2{
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.good-name{
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
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
export const A41Tpl = (item: any) => {
  return {
    pageHtml: `
 <head>${A41Style}</head>
 <body>
 <div class="print-container">
   <div class="print-content-1">
     <div class="good-name">${item['productName'] || ''}</div>
     <div class="real-code">${item['barcode'] || ''}</div>
   </div>
   <div class="print-content-2">
     <div class="good-name">${item['productName'] || ''}</div>
     <div class="real-code">${item['barcode' || '']}</div>
   </div>
 </div>
 </body>`
  }
}
