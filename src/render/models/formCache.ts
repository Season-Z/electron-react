export default {
  namespace: 'formCache',
  state: {},
  reducers: {
    save(state: any, { payload }: any) {
      console.log(payload)
      return { ...state, ...payload }
    },
    clearAllTab(state: any, { payload }: any) {
      return {}
    },
    clearOthersTab(state: any, { payload }: any) {
      return {
        [payload]: state[payload]
      }
    }
  },
  subscriptions: {}
}
