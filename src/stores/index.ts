import { ref, computed } from 'vue'
import { createPinia,defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


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

//
export const useMenuStore = defineStore({
    id:"useMenuStore",
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
    persist: {
        key: 'MenuSort',
    },

});


export const useShopStore = defineStore('shopId', {

    state: () => ({
        shopId: '1',
    }),
    actions: {
        setShopId(id) {
            this.shopId = id;
        },
        getShopId() {
            return this.shopId;
        }
    },
    persist: {
        key: 'ShopId',
    },
})



pinia.use(piniaPluginPersistedstate);
export default pinia;
