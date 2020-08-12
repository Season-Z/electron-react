/**
 * 打印盘点单
 */
export default function(data: any) {
  const { dataSource, info } = data

  const tableData = dataSource && dataSource.map((e: any, index: number) => {
    return `
      <tr>
        <td style='border: 2px solid #cad9ea;color: #666;width: 7%; text-align: center'>
          ${index + 1}
        </td>
        <td style='border: 2px solid #cad9ea;color: #666;width: 10%; text-align: center'>
          ${e.skuCode}
        </td>
        <td style='border: 2px solid #cad9ea;color: #666;width: 15%; text-align: center'>
          ${e.goodsBarcode}
        </td>
        <td style='border: 2px solid #cad9ea;color: #666;width: 32%; text-align: center'>
          ${e.skuName}
        </td>
        <td style='border: 2px solid #cad9ea;color: #666;width: 12%; text-align: center'>
          ${e.locationCode}
        </td>
        <td style='border: 2px solid #cad9ea;color: #666;width: 12%; text-align: center'>
          ${e.skuUnit}
        </td>
        <td style='border: 2px solid #cad9ea;color: #666;width: 12%; text-align: center'>
          ${e.firstCheckNum}
        </td>
      </tr>
    `
  })

  return `
  <div>
  <h1 style="text-align: center;">盘点单</h1>
    <div style="
      display: flex;
      justify-content: space-evenly;
      padding-left: 1%;
  ">
          <div style=" text-align: left;width: 30%;">货主名称：${info.companyName}</div>
          <div style=" text-align: left;width: 35%; ">盘点单号：${info.stocktakeOrderCode}</div>
          <div style=" text-align: left;width: 35%; ">盘点计划号：${info.stocktakePlanCode}</div>
        </div>
        <div style="
            display: flex;
            justify-content: space-evenly;
            padding-left: 1%;
            margin-bottom: 8px;
        ">
          <div style="text-align: left;width: 30%;"></div>
          <div style=" text-align: left;width: 35%;">打印人：${info.printName}</div>
          <div style=" text-align: left;width: 35%;">打印日期：${info.printDay ?? ''}</div>
        </div>
       <table border="0" cellspacing="0" cellpadding="0" width="100%" bordercolor="#000000" style="border-collapse:collapse">
      <thead>
        <tr>
          <td style=" background-color: #CCE8EB;text-align: center"><b>序号</b></td>
          <td style=" background-color: #CCE8EB;text-align: center"><b>商品编码</b></td>
          <td style=" background-color: #CCE8EB;text-align: center"><b>商品条码</b></td>
          <td style=" background-color: #CCE8EB;text-align: center"><b>商品名称</b></td>
          <td style=" background-color: #CCE8EB;text-align: center"><b>储位</b></td>
          <td style=" background-color: #CCE8EB;text-align: center"><b>单位</b></td>
          <td style=" background-color: #CCE8EB;text-align: center"><b>盘点数量</b></td>
        </tr>
      </thead>
      <tbody id="tableBody">
      ${tableData}
      </tbody>
    </table>

    <div style="
      margin-top: 8px;
      padding-left: 1%;
      text-align: right;
      padding-right: 20%
    ">

        <div style=" display: inline-block">
          <p>
          盘点人：
          </p>
          <p>
          盘点日期：
          </p>
        </div>
  </div>
</div>`.replace(',', '')
}
