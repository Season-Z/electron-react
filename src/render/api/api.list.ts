
// api 网关地址
const apiList = {
  list: 'oms.order.listOrder',
  offline: {
    queryExportRecordList: 'oms.file.queryExportRecordList'
  },
  queryOperationGroupList: 'mms.merchant.queryOperationGroupList',
  settlement: {
    modifyNoteInfor: 'settlement.sheet.modifyNoteInfor', // 备注信息
    queryMerchantList: 'oms.common.queryMerchantList', // 商户联动查询接口
    exportSettlementList: 'oms.settlement.exportSettlementList', // 结算单导出接口
    exportLedgerList: 'oms.settlement.exportLedgerList', // 记账单导出接口
    querySettlementSheets: 'settlement.sheet.querySettlementSheets', // 查询结算单
    censorSettlements: 'settlement.sheet.censorSettlements', // 审核结算单
    queryDaojiaLedgers: 'settlement.ledger.queryDaojiaLedgers' // 查询记账单

  }

};
export default apiList;
