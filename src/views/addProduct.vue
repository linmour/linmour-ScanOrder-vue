<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div>
          <el-card style="width: 60%;height: 800px; margin: 80px auto">
            <el-form style="width: 70%; margin: 60px auto" label-width="80px">
              <div style="text-align: center">

                <UpoloadImgs :param="isUpload" :imgUrl="state.form.urlList" @uploadComplete="handleUploadComplete" :type="UPLOAD_TYPE.PRODUCT"/>
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

                <el-form-item label="基础价格">
                  <el-input class="width70" v-model="state.form.price"></el-input>
                </el-form-item>


                <el-form-item label="价值选项">
                  <el-tag
                      style="margin: 10px"
                      v-for="(tag,index) in valueSort"
                      :key="tag"
                      class="mx-1"
                      closable
                      :disable-transitions="false"
                      @close="valueHandleClose(tag,false,index)"
                      @click="valueEcho(index,'value')"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                      v-if="valueSortInputVisible"
                      ref="valueSortInputRef"
                      v-model="valueSortInput"
                      class="ml-1 w-20"
                      size="small"
                      @keyup.enter="valueHandleInput('value')"
                      @blur="valueHandleInput('value')"
                  />
                  <el-button v-else class="button-new-tag ml-1" size="small" @click="valueShowInput(false)">
                    + New Tag
                  </el-button>
                </el-form-item>
                <el-form-item label="普通选项">
                  <el-tag
                      style="margin: 10px"
                      v-for="(tag,index) in nonValueSort"
                      :key="tag"
                      class="mx-1"
                      closable
                      :disable-transitions="false"
                      @close="nonValueHandleClose(tag,false,index)"
                      @click="nonValueEcho(index,'non')"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                      v-if="nonValueSortInputVisible"
                      ref="nonValueSortInputRef"
                      v-model="nonValueSortInput"
                      class="ml-1 w-20"
                      size="small"
                      @keyup.enter="nonValueHandleInput('non')"
                      @blur="nonValueHandleInput('non')"
                  />
                  <el-button v-else class="button-new-tag ml-1" size="small" @click="nonValueShowInput(false)">
                    + New Tag
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
                              @keyup.enter="inventoryNumHandleInput(index)"
                              @blur="inventoryNumHandleInput(index)"
                    />
                  </el-tag>
                  <el-input
                      v-if="inventoryInputVisible"
                      ref="inventoryInputRef"
                      v-model="inventoryInput"
                      class="ml-1 w-20"
                      size="small"
                      @keyup.enter="InventoryNameHandleInput"
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

  <!--添加规格属性窗口-->
  <div v-if="dialogTableVisible === 'non' || dialogTableVisible === 'value'">
    <el-dialog v-model="a" title="添加选项" @close="dialogClose">

      <el-form-item label="价值属性" v-if=" dialogTableVisible === 'value'">
        <el-tag
            style="margin: 10px"
            v-for="(tag,index) in valueSpec"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="valueHandleClose(tag,true,index)"
        >
          {{ tag }}
          <el-input v-model="valuePrice[index]" style="width: 80px" placeholder="价钱/元"
                    @keyup.enter="PriceHandleInput(index)"
                    @blur="PriceHandleInput(index)"
          />

        </el-tag>
        <el-input
            v-if="valueSpecInputVisible"
            ref="valueSpecInputRef"
            v-model="valueSpecInput"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="valueHandleInput(null)"
            @blur="valueHandleInput(null)"
        />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="valueShowInput(true)">
          + New Tag
        </el-button>
      </el-form-item>

      <el-form-item label="普通选项" v-else>
        <el-tag
            style="margin: 10px"
            v-for="(tag,index) in nonValueSpec"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="nonValueHandleClose(tag,true,index)"

        >
          {{ tag }}
        </el-tag>
        <el-input
            v-if="nonValueSpecInputVisible"
            ref="nonValueSpecInputRef"
            v-model="nonValueSpecInput"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="nonValueHandleInput(null)"
            @blur="nonValueHandleInput(null)"
        />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="nonValueShowInput(true)">
          + New Tag
        </el-button>
      </el-form-item>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import {nextTick, onMounted, reactive, ref} from 'vue'
import {getLocalstorage} from "@/utils/localStorage";

import {ElInput} from "element-plus";
import {addProduct, getProductDetails, getProductSort, updateProduct} from "@/api/linmour-product/product";
import {useRoute} from "vue-router";
import {error} from "@/utils/tips";
import UpoloadImgs from "@/component/upoloadImgs.vue";
import { UPLOAD_TYPE } from '@/utils/enums'


const a = ref(true)


const nonValueEcho = (index, type) => {
  dialogTableVisible.value = type
  const a = state.form.nonValueList[index].spec
  nonValueSpec.value = (a)
  NONVALUEINDEX.value = index;
}

const valueEcho = (index, type) => {
  dialogTableVisible.value = type
  const a = state.form.valueList[index].spec
  const b = state.form.valueList[index].price

  valueSpec.value = (a)
  valuePrice.value = (b)
  VALUEINDEX.value = index;

}

//输入的值
const valueSortInput = ref('')
const valueSpecInput = ref('')
const inventoryInput = ref('')
const priceInput = ref('')
const nonValueSortInput = ref('')
const nonValueSpecInput = ref('')
const valueSortInputVisible = ref(false)
const valueSpecInputVisible = ref(false)
const inventoryInputVisible = ref(false)
const nonValueSpecInputVisible = ref(false)
const nonValueSortInputVisible = ref(false)
const valueSortInputRef = ref<InstanceType<typeof ElInput>>()
const valueSpecInputRef = ref<InstanceType<typeof ElInput>>()
const inventoryInputRef = ref<InstanceType<typeof ElInput>>()
const nonValueSpecInputRef = ref<InstanceType<typeof ElInput>>()
const nonValueSortInputRef = ref<InstanceType<typeof ElInput>>()

const dialogClose = () => {
  dialogTableVisible.value = ''
  nonValueSpec.value = []
  valueSpec.value = []
  valuePrice.value = []

}
//删除标签
const valueHandleClose = (tag: string, bool, index) => {
  //spec内层
  if (bool) {
    state.form.valueList[VALUEINDEX.value].spec.splice(state.form.valueList[VALUEINDEX.value].spec.indexOf(tag), 1)
    state.form.valueList[VALUEINDEX.value].price.splice(state.form.valueList[VALUEINDEX.value].price.indexOf(tag), 1)
  } else {
    valueSort.value.splice(valueSort.value.indexOf(tag), 1)
    state.form.valueList.splice(index, 1)
  }
}
const inventoryHandleClose = (tag: string, index) => {
  state.form.inventoryList[index].numAndUnit.splice(state.form.inventoryList[index].numAndUnit.indexOf(tag), 1)
  state.form.inventoryList[index].name.splice(state.form.inventoryList[index].name.indexOf(tag), 1)
}

//bool表示内外层`
const nonValueHandleClose = (tag: string, bool, index) => {
  //spec内层
  if (bool) {
    state.form.nonValueList[NONVALUEINDEX.value].spec.splice(state.form.nonValueList[NONVALUEINDEX.value].spec.indexOf(tag), 1)
  } else {
    nonValueSort.value.splice(nonValueSort.value.indexOf(tag), 1)
    state.form.nonValueList.splice(index, 1)
  }
}


const nonValueShowInput = (bool) => {
  //内层spec
  if (bool) {
    nonValueSpecInputVisible.value = true
    nextTick(() => {
      nonValueSpecInputRef.value!.input!.focus()
    })
  } else {
    nonValueSortInputVisible.value = true
    nextTick(() => {
      nonValueSortInputRef.value!.input!.focus()
    })
  }

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
const NONVALUEINDEX = ref(0)
const VALUEINDEX = ref(0)
const INVENTORYINDEX = ref(0)
//输入的值
const nonValueHandleInput = (type) => {
  //不等于空说明是第一层，也就是分类sort
  if (type != null) {
    if (nonValueSortInput.value && nonValueSortInput.value.length != 0) {
      state.form.nonValueList.push({'sort': nonValueSortInput.value, 'spec': []})
      nonValueSort.value.push(nonValueSortInput.value)
      dialogTableVisible.value = type
      NONVALUEINDEX.value = state.form.nonValueList.length - 1 < 0 ? 0 : state.form.nonValueList.length - 1;
    }
    nonValueSortInput.value = ''
    nonValueSortInputVisible.value = false

  } else {
    if (nonValueSpecInput.value && nonValueSpecInput.value.length != 0) {
      state.form.nonValueList[NONVALUEINDEX.value].spec.push(nonValueSpecInput.value)
      nonValueSpec.value = state.form.nonValueList[NONVALUEINDEX.value].spec
    }
    nonValueSpecInput.value = ''
    nonValueSpecInputVisible.value = false
  }
}
const valueHandleInput = (type) => {
//不等于空说明是第一层，也就是分类sort
  if (type != null) {
    if (valueSortInput.value && valueSortInput.value.length != 0) {
      state.form.valueList.push({'sort': valueSortInput.value, 'spec': [], 'price': []})
      valueSort.value.push(valueSortInput.value)
      dialogTableVisible.value = type
      VALUEINDEX.value = state.form.valueList.length - 1 < 0 ? 0 : state.form.valueList.length - 1;
    }
    valueSortInput.value = ''
    valueSortInputVisible.value = false
  } else {
    if (valueSpecInput.value && valueSpecInput.value.length != 0) {
      state.form.valueList[VALUEINDEX.value].spec.push(valueSpecInput.value)
      valueSpec.value = state.form.valueList[VALUEINDEX.value].spec
    }
    valueSpecInput.value = ''
    valueSpecInputVisible.value = false
    priceInput.value = ''
  }
  console.log(valuePrice.value)
  //去掉数组最后一个，要不然会有bug
  // valuePrice.value.pop()
}
const PriceHandleInput = (index) => {
  if (valuePrice.value[index] && valuePrice.value[index] != undefined) {
    state.form.valueList[VALUEINDEX.value].price[index] = (valuePrice.value[index])
    valuePrice.value = state.form.valueList[VALUEINDEX.value].price
  }
  nonValueSpecInputVisible.value = false
}
const inventoryNumHandleInput = (index) => {
  if (inventoryNumAndUnit.value[index] && inventoryNumAndUnit.value[index] != undefined) {
    state.form.inventoryList[INVENTORYINDEX.value].numAndUnit = (inventoryNumAndUnit.value[index])
    inventoryNumAndUnit.value = state.form.inventoryList.map(m => m.numAndUnit)
  }
  nonValueSpecInputVisible.value = false
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

const nonValueSpec = ref([])
const nonValueSort = ref([])
const valueSpec = ref([])
const valueSort = ref([])
const valuePrice = ref([])
const inventoryName = ref([])
const inventoryNumAndUnit = ref([])

const state = reactive({
  form: {
    //[
    //{"sort":"1","spec":[1,2,3],"price":[1,2,3]},
    //{"sort":"1","spec":[1,2,3],"price":[1,2,3]},
    //{"sort":"1","spec":[1,2,3],"price":[1,2,3]}
    //]
    nonValueList: [],
    valueList: [],
    //{"name":"","numAndUnit":1}
    inventoryList: [],
    sortId: Number,
    shopId: Number,
    urlList: []
  },
  sortList: []
})
const dialogTableVisible = ref('')
const isUpload = ref(false)
//这个逻辑是，触发子组件上传图片，上传成功后触发表单提交
const save = () => {
  isUpload.value = true;
}
//上图片子组件触发
const handleUploadComplete = (urlList) => {

  isUpload.value = false; // 在事件处理函数中将 param 设置为 false
  state.form.shopId = shopId
  state.form.urlList = urlList

  let flag = true
  state.form.nonValueList.forEach(m => {
    if (m.spec.length === 0) {
      error('普通选项 “' + m.sort + '” 没有可选值')
      flag = false
    }
  })
  state.form.valueList.forEach(m => {
    if (m.spec.length === 0 || m.price.length === 0) {
      error('价值选项 “' + m.sort + '” 没有可选值')
      flag = false
    }
  })
  if (flag) {
    //修改
    if (productId.value !== undefined && productId.value.length > 0) {
      updateProduct(state.form).then(res => {
        console.log(state.form)
        if (res.code === 200) {

        }
      })
      //新增
    } else {
      state.form.sortId = state.sortList.id
      addProduct(state.form).then(res => {
        if (res.code === 200) {

        }
      })
    }
    state.form.name = ''
    state.form.intro = ''
    state.form.price = ''
    state.sortList.id = ''
    valueSort.value = []
    nonValueSort.value = []
    inventoryName.value = []
    inventoryNumAndUnit.value = []
    state.form.urlList
  }
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
      if (res.code === 200) {
        res.data = res.data[0]
        state.form = res.data
        if (res.data.nonValueList === null) {
          state.form.nonValueList = []
        }
        if (res.data.valueList === null) {
          state.form.valueList = []
        }
        if (res.data.inventoryList === null) {
          state.form.inventoryList = []
        }

        if (res.data.nonValueList != null) {
          nonValueSort.value = res.data.nonValueList.map(m => m.sort)
        }
        if (res.data.valueList != null) {
          valueSort.value = res.data.valueList.map(m => m.sort)
        }
        if (res.data.inventoryList != null) {
          inventoryName.value = res.data.inventoryList.map(m => m.name)
          inventoryNumAndUnit.value = res.data.inventoryList.map(m => m.numAndUnit)
        }

        state.sortList.id = res.data.sort
        //触发图片用来显示
        state.form.urlList = res.data.picture
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
