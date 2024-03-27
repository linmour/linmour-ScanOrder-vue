<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div>
          <el-card style="width: 60%;height: 800px; margin: 80px auto">
            <el-form style="width: 70%; margin: 60px auto" label-width="80px">
              <div style="text-align: center">

                <!--                <UploadImg :param="isUpload" :imgUrl="state.form.picture" @uploadComplete="handleUploadComplete" :type="UPLOAD_TYPE.PRODUCT"/>-->
              </div>

              <div style="margin: 100px; width: 800px; ">
                <el-form-item label="菜名">
                  <el-input class="width70" v-model="state.form.name"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                  <el-input class="width70" v-model="state.form.intro" placeholder="简介"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                  <el-select
                      v-model="state.form.sortId"
                      filterable
                      allow-create
                      default-first-option
                      :reserve-keyword="false"
                      placeholder="选择分类"
                  >
                    <el-option
                        v-for="item in state.sortList"
                        :key="item.id"
                        :label="item.sort"
                        :value="item.id"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="价格">
                  <el-input class="width70" v-model="state.form.price"></el-input>
                </el-form-item>
                <el-form-item label="价值选项">
                  <el-tag
                      style="margin: 10px"
                      v-for="(tag,index) in state.form.specSortAndOption"
                      :key="tag"
                      class="mx-1"
                      closable
                      :disable-transitions="false"
                      @close="valueHandleClose(tag,false,index)"
                      @click="valueEcho(index)"
                  >
                    {{ tag.productSpecSort.name }}
                  </el-tag>
                  <el-input
                      v-if="valueSortInputVisible"
                      ref="valueSortInputRef"
                      v-model="valueSortInput"
                      class="ml-1 w-20"
                      size="small"
                      @keyup.enter.stop="valueHandleInput('value')"
                      @blur="valueHandleInput('value')"
                  />
                  <el-button v-else class="button-new-tag ml-1" size="small" @click="valueShowInput(false)">
                    + 规格
                  </el-button>
                </el-form-item>
                <el-form-item label="所需材料">
                  <el-tag
                      v-for="(tag,index) in inventoryName"
                      :key="tag"
                      class="mx-1"
                      closable
                      :disable-transitions="false"
                      @close="inventoryHandleClose(tag,index)"
                  >
                    {{ tag }}
                    <el-input v-model="inventoryNumAndUnit[index]" style="width: 82px" placeholder="数量/单位"
                              @keyup.enter.stop="inventoryNumHandleInput(index)"
                              @blur="inventoryNumHandleInput(index)"
                    />
                  </el-tag>
                  <el-input
                      v-if="inventoryInputVisible"
                      ref="inventoryInputRef"
                      v-model="inventoryInput"
                      class="ml-1 w-20"
                      size="small"
                      @keyup.enter.stop="InventoryNameHandleInput"
                      @blur="InventoryNameHandleInput"
                  />
                  <el-button v-else class="button-new-tag ml-1" size="small" @click="inventoryShowInput">
                    + New Tag
                  </el-button>
                </el-form-item>
                <el-form-item style="margin-left: 150px">
                  <el-button @click="save">保存</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-card>
        </div>
      </el-main>


    </el-container>
  </div>

  <!--内层 添加规格属性窗口-->
  <el-dialog v-if="dialogTableVisible" v-model="a" title="添加规格" @close="dialogClose">
    <el-form-item label="">
      <div v-for="(tag,index) in state.form.specSortAndOption"
           :key="index">
        {{ tag.productSpecSort.name }}:
        <el-tag
            style="margin: 10px"
            v-if="tag.productSpecOptions.length > 0" v-for="(options,ind) in tag.productSpecOptions"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="valueHandleClose(tag,true,index,ind)"
        >
          <view>
            {{ options.name }}

          </view>
          <el-input v-model="options.price" style="width: 80px" placeholder="价钱/元"/>

        </el-tag>
      </div>

      <el-input
          v-if="valueSpecInputVisible"
          ref="valueSpecInputRef"
          v-model="valueSpecInput"
          class="ml-1 w-20"
          size="small"
          @keyup.enter.stop="valueHandleInput(null)"
          @blur="valueHandleInput(null)"
      />
      <el-button v-else class="button-new-tag ml-1" size="small" @click="valueShowInput(true)">
        + New Tag
      </el-button>
    </el-form-item>


  </el-dialog>

</template>

<script lang="ts" setup>
import {nextTick, onMounted, reactive, ref} from 'vue'
import {getLocalstorage} from "@/utils/localStorage";

import {ElInput} from "element-plus";
import {getProductDetails, getProductSort, saveOrUpdateProduct} from "@/api/linmour-product/product";
import {useRoute} from "vue-router";


const a = ref(true)


const valueEcho = (index) => {
  dialogTableVisible.value = true
  VALUEINDEX.value = index;

}

//输入的值
const valueSortInput = ref('')
const valueSpecInput = ref('')
const inventoryInput = ref('')
const priceInput = ref(0)
const valueSortInputVisible = ref(false)
const valueSpecInputVisible = ref(false)
const inventoryInputVisible = ref(false)
const valueSortInputRef = ref<InstanceType<typeof ElInput>>()
const valueSpecInputRef = ref<InstanceType<typeof ElInput>>()
const inventoryInputRef = ref<InstanceType<typeof ElInput>>()

const dialogClose = () => {
  dialogTableVisible.value = false
  valueSpec.value = []
  valuePrice.value = ''

}
//删除标签
const valueHandleClose = (tag: string, bool, index, ind) => {
  console.log(index, ind)
  //spec内层
  if (bool) {
    state.form.specSortAndOption[index].productSpecOptions.splice(ind, 1)
    // state.form.specSortAndOption[VALUEINDEX.value].specSortAndOption.splice(state.form.specSortAndOption[VALUEINDEX.value].specSortAndOption.indexOf(tag), 1)
    // state.form.specSortAndOption[VALUEINDEX.value].price.splice(state.form.specSortAndOption[VALUEINDEX.value].price.indexOf(tag), 1)
  } else {
    console.log(state.form.specSortAndOption)
    // valueSort.value.splice(valueSort.value.indexOf(tag), 1)
    state.form.specSortAndOption.splice(index, 1)
  }
}
const inventoryHandleClose = (tag: string, index) => {
  state.form.inventoryList[index].numAndUnit.splice(state.form.inventoryList[index].numAndUnit.indexOf(tag), 1)
  state.form.inventoryList[index].name.splice(state.form.inventoryList[index].name.indexOf(tag), 1)
}


const valueShowInput = (bool) => {
  //内层spec
  if (bool) {
    valueSpecInputVisible.value = true
    nextTick(() => {
      valueSpecInputRef.value!.input!.focus()
    })
  } else {
    valueSortInputVisible.value = true
    nextTick(() => {
      valueSortInputRef.value!.input!.focus()
    })
  }

}
const inventoryShowInput = () => {
  inventoryInputVisible.value = true
  nextTick(() => {
    inventoryInputRef.value!.input!.focus()
  })
}


//外层的索引

const VALUEINDEX = ref(0)
const INVENTORYINDEX = ref(0)
//输入的值

const valueHandleInput = (type) => {
  if (valueSortInput.value != '' || valueSpecInput.value != '') {
    //不等于空说明是第一层，也就是分类sort
    if (type != null) {
      state.form.specSortAndOption.push({'productSpecSort': {name: valueSortInput.value}, 'productSpecOptions': []})
      valueSort.value.push(valueSortInput.value)
      dialogTableVisible.value = true
      VALUEINDEX.value = state.form.specSortAndOption.length - 1 < 0 ? 0 : state.form.specSortAndOption.length - 1;
      valueSortInput.value = ''
      valueSortInputVisible.value = false
    } else {
      let a = {name: valueSpecInput.value, price: 0};
      state.form.specSortAndOption[VALUEINDEX.value].productSpecOptions.push(a)
      valueSpec.value = state.form.specSortAndOption[VALUEINDEX.value].productSpecOptions
      valueSpecInput.value = ''
      valueSpecInputVisible.value = false
      priceInput.value = 0
    }
  }


}

const inventoryNumHandleInput = (index) => {
  if (inventoryNumAndUnit.value[index] && inventoryNumAndUnit.value[index] != undefined) {
    state.form.inventoryList[INVENTORYINDEX.value].numAndUnit = (inventoryNumAndUnit.value[index])
    inventoryNumAndUnit.value = state.form.inventoryList.map(m => m.numAndUnit)
  }
}
const InventoryNameHandleInput = () => {
  if (inventoryInput.value && inventoryInput.value.length != 0) {
    state.form.inventoryList.push({'name': inventoryInput.value, 'numAndUnit': ""})
    inventoryName.value.push(inventoryInput.value)
    INVENTORYINDEX.value = state.form.inventoryList.length - 1 < 0 ? 0 : state.form.inventoryList.length - 1;
  }
  inventoryInput.value = ''
  inventoryInputVisible.value = false
  console.log(state.form.inventoryList)
}


const valueSpec = ref([])
const valueSort = ref([])
const valuePrice = ref(0)
const inventoryName = ref([])
const inventoryNumAndUnit = ref([])

const state = reactive({
  form: {
    specSortAndOption: [],
    //{"name":"","numAndUnit":1}
    inventoryList: [],
    sortId: undefined,
    shopId: Number,
    picture: ""
  },
  sortList: []
})
const dialogTableVisible = ref(false)
const isUpload = ref(false)
//这个逻辑是，触发子组件上传图片，上传成功后触发表单提交
const save = () => {
  // isUpload.value = true;
  handleUploadComplete("")
}
//上图片子组件触发
const handleUploadComplete = (picture) => {
  isUpload.value = false; // 在事件处理函数中将 param 设置为 false
  state.form.shopId = shopId
  state.form.picture = picture
  saveOrUpdateProduct(state.form).then(res => {
    if (res.code === 200) {

    }
  })
}


const shopId = JSON.parse(getLocalstorage("ShopId")).shopId
const productId = ref()

onMounted(() => {
  getProductSort().then(res => {
    if (res.code === 200) {
      state.sortList = res.data
    }
  })

  const route = useRoute();
  //接收路由跳转的参数
  productId.value = route.query.productId;
  console.log(productId.value)
  //获取修改的菜单
  if (productId.value !== undefined && productId.value.length > 0) {
    getProductDetails(productId.value).then(res => {
      console.log(res,"==")
      if (res.code === 200) {

        res = res.data[0]
        state.form = res
        console.log(res.productSortAndOptions,'------')
        // state.form = res.data
        if (res.specSortAndOption === null) {
          state.form.specSortAndOption = []
        }
        if (res.inventoryList === null) {
          state.form.inventoryList = []
        }
        state.form.specSortAndOption = res.productSortAndOptions
        // state.sortList.id = res.data.productSpecSort.name
        //触发图片用来显示
        state.form.picture = res.picture
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
