export default {
  namespace: 'MenuTabStore',
  state: {
    menuTabList: []
  },
  effects: {
    *updateTabList({ payload }: any, { put }: any) {
      yield put({
        type: 'save',
        payload: { menuTabList: payload }
      })
    }
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, ...payload }
    }
  },
  subscriptions: {}
}
