import { createPinia, defineStore } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'


export const pinia = createPinia()

export const useIsCollapseStore = defineStore({
  id: 'fold',
  state: () => ({
    isCollapse: false,
  }),
  actions: {
    change() {
      this.isCollapse = !this.isCollapse
    },
  },
})
createPersistedState(useIsCollapseStore)

export const useMenuStore = defineStore({
  id: 'menuStore',
  state: () => ({
    sort: '1',
  }),
  actions: {
    setSort(value) {
      this.sort = value
    },
    getSort() {
      return this.sort
    },
  },
})

pinia.use(createPersistedState())
export default pinia
