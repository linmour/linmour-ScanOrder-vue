<template>
  <div class="common-layout" v-loading="loading">
    <el-container>
      <el-main>
        <div>
          <el-card style="width: 60%;height: 800px; margin: 80px auto">
            <el-form style="width: 70%; margin: 60px auto" label-width="80px">
              <div style="text-align: center">
               <UpoloadProduct :param="isUpload" :imgUrl="state.form.urlList"  @uploadComplete="handleUploadComplete"/>
              </div>
              <div style="margin: 100px; width: 800px; ">
                <el-form-item label="菜名">
                  <el-input class="width70" v-model="state.form.name"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                  <el-input class="width70" v-model="state.form.intro" placeholder="简介"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-select
                      v-model="state.sortList.id"
                      filterable
                      allow-create
                      default-first-option
                      :reserve-keyword="false"
                      placeholder="Choose tags for your article"
                  >
                    <el-option
                        v-for="item in state.sortList"
                        :key="item.id"
                        :label="item.sort"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>


                <el-form-item label="规格属性">
                  <el-tag
                      style="margin: 10px"
                      v-for="(tag,index) in state.form.size"
                      :key="tag"
                      class="mx-1"
                      closable
                      :disable-transitions="false"
                      @close="handleSizeClose(tag)"
                  >
                    {{ tag }}
                    <el-input v-model="state.form.price[index]" style="width: 80px" placeholder="价钱/元"
                              @keyup.enter="handleInputPrice"
                              @blur="handleInputPrice"/>
                  </el-tag>
                  <el-input
                      v-if="sizeInputVisible"
                      ref="sizeInputRef"
                      v-model="sizeInput"
                      class="ml-1 w-20"
                      size="small"
                      @keyup.enter="handleInputSize"
                      @blur="handleInputSize"
                  />
                  <el-button v-else class="button-new-tag ml-1" size="small" @click="showSizeInput">
                    + New Tag
                  </el-button>
                </el-form-item>

                <el-form-item label="口味">
                  <el-tag
                      style="margin: 10px"
                      v-for="(tag,index) in state.form.taste"
                      :key="tag"
                      class="mx-1"
                      closable
                      :disable-transitions="false"
                      @close="handleTasteClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                      v-if="tasteInputVisible"
                      ref="tasteInputRef"
                      v-model="tasteInput"
                      class="ml-1 w-20"
                      size="small"
                      @keyup.enter="handleInputTaste"
                      @blur="handleInputTaste"
                  />
                  <el-button v-else class="button-new-tag ml-1" size="small" @click="showaTasteInput">
                    + New Tag
                  </el-button>
                </el-form-item>
                <el-form-item style="margin-left: 150px" >
                  <el-button @click="save">保存</el-button>

                </el-form-item>
              </div>
            </el-form>
          </el-card>
        </div>
      </el-main>


    </el-container>
  </div>


</template>

<script lang="ts" setup>
import {getCurrentInstance, nextTick, onMounted, reactive, ref, UnwrapNestedRefs} from 'vue'
import {getLocalstorage} from "@/utils/localStorage";

import {ElInput} from "element-plus";
import {addProduct, getProductDetails, getProductSort, updateProduct} from "@/api/linmour-product/product";
import  UpoloadProduct  from '@/component/upoloadProduct.vue'
import router from "@/router";
import {useRoute} from "vue-router";



//输入的值
const sizeInput = ref('')
const priceInput = ref('')
const tasteInput = ref('')
const sizeInputVisible = ref(false)
const tasteInputVisible = ref(false)
const sizeInputRef = ref<InstanceType<typeof ElInput>>()
const tasteInputRef = ref<InstanceType<typeof ElInput>>()

const handleSizeClose = (tag: string) => {
  state.form.size.splice(state.form.size.indexOf(tag), 1)
}
const handleTasteClose = (tag: string) => {
  state.form.taste.splice(state.form.taste.indexOf(tag), 1)
}
const showSizeInput = () => {
  sizeInputVisible.value = true
  nextTick(() => {
    sizeInputRef.value!.input!.focus()
  })
}

const showaTasteInput = () => {
  tasteInputVisible.value = true
  nextTick(() => {
    tasteInputRef.value!.input!.focus()
  })
}

const handleInputSize = () => {
  console.log(state.form.size)
  if (sizeInput.value) {
    state.form.size.push(sizeInput.value)
  }
  sizeInputVisible.value = false
  sizeInput.value = ''
}
const handleInputPrice = () => {

  if (priceInput.value) {
    state.form.price.push(priceInput.value)
    console.log(state.form.price)
  }

}
const handleInputTaste = () => {
  if (tasteInput.value) {
    state.form.taste.push(tasteInput.value)
    console.log(state.form.taste)
  }
  tasteInputVisible.value = false
  tasteInput.value = ''
}

const state = reactive({
  form: {
    size : [],
    price:[],
    taste:[],
    sortId:Number,
    shopId: Number,
    urlList:[]
  },
  sortList:[]
})

const isUpload = ref(false)
const save = () =>{
  isUpload.value = true;
}
//子组件触发
const   handleUploadComplete = (urlList) => {
  console.log("+++++++++++++++++++")
  console.log(urlList)
  isUpload.value = false; // 在事件处理函数中将 param 设置为 false
  state.form.sortId = state.sortList.id
  state.form.shopId = shopId
  state.form.urlList = urlList
  console.log(typeof state.form.urlList )
  //修改
  if (productId.value !== undefined && productId.value.length>0){
    console.log("update")
    updateProduct(state.form).then(res =>{
      if (res.code === 200){
        router.push("dishes")
      }
    })
    //新增
  }else {
    addProduct(state.form).then(res =>{
      if (res.code === 200){
        router.push("dishes")

      }
    })
  }



}


const shopId = JSON.parse(getLocalstorage("pinia-shopStore")).shopId
const productId = ref()

onMounted(() =>{
  getProductSort(shopId).then(res=>{
    if (res.code === 200){
      state.sortList = res.data
    }
  })

  const route = useRoute();
  productId.value= route.query.productId;
  //获取修改的菜单
  if (productId.value !== undefined && productId.value.length>0){
    getProductDetails(productId.value).then(res =>{
      if (res.code === 200){
        state.form = res.data
        //这个是为了上面修改时没有这两个变量
        state.form.size = []
        state.form.taste = []
        state.form.price =[]
        //分类id
        const a  = state.sortList.find(m =>m.sort === res.data.sort)
        //select上的
        state.sortList.id = a.id
        //后台接收上的
        state.form.sort = a.id
        state.form.urlList = res.data.picture
            //尺寸价钱
        if (res.data.productSizeAndPriceList !== null){
          console.log("尺寸不为空")
          state.form.size = res.data.productSizeAndPriceList.map(m=>m.size)
          state.form.price = res.data.productSizeAndPriceList.map(m=>m.price)
        }
        //口味
        if (res.data.tasteAndId !== null){
          console.log("口味不为空")
          state.form.taste = res.data.tasteAndId.map(m=>m.taste)
        }
      }
    })
  }



})





</script>


<style scoped>
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}


.width70 {
  width: 40%;
  margin-right: 5px
}

.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

/* 进度条样式 */
.bacc {
  /*bacc是灰色的大背景*/
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
}

/*这个类的作用是把进度条放到水平垂直居中的位置*/
.jindutiao {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  margin-left: -75px;
  margin-top: -75px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/*更改默认的文字样式*/
.progressCircle ::v-deep .el-progress__text {
  color: #fff;
}
</style>