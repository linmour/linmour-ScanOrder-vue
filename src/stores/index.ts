// stores/counter.js
import { defineStore } from 'pinia'
import {reactive, ref} from "vue";

export const useIsCollapseStore = defineStore('fold', () =>{
  const isCollapse = ref(false)
    function change(){
      isCollapse.value = !isCollapse.value
    }
    return {isCollapse,change}
})

export const useMenuStore = defineStore('menu',()=>{
  let sort = ref('1')
  function setsort(i:any){
    sort.value = i
  }
  function getsort(){
    return sort.value
  }


  return{sort,setsort,getsort}

})

