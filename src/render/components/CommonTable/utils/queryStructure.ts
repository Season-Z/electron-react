export const useNormal = (page: any, size: any) => {
  return {
    page,
    size
  }
}

export const useHefei = (page: any, size: any) => {
  return {
    pageReq: {
      pageNum: page,
      pageSize: size
    }
  }
}
