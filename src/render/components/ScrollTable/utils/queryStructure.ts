export const useNormal = (page: number, size: number) => {
  return {
    page,
    size
  }
}

export const useHefei = (page: number, size: number) => {
  return {
    pageReq: {
      pageNum: page,
      pageSize: size
    }
  }
}
