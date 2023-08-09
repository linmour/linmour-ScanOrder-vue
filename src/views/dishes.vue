<template>
  <div>

    <el-container>
      <el-aside width="90%">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <div v-for="item in state.sortList" :key="item.id">
            <el-tab-pane :label="item.sort" :name="item.id"></el-tab-pane>
          </div>
        </el-tabs>
      </el-aside>
      <el-main>
        <el-button @click="addProduct">添加菜品</el-button>
      </el-main>
    </el-container>


    <el-table :data="state.tableData" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="180"/>
      <el-table-column prop="name" label="名字" width="180"/>
      <el-table-column prop="intro" label="简介"/>
      <el-table-column prop="intro" label="简介"/>
      <el-table-column prop="picture" label="图片">
        <template #default="scope">
          <el-image
              v-for="(item,index) in scope.row.picture" :key="index"
              :src="item" style="width: 150px; height: 100px; cursor: pointer;padding: 2px"
              :preview-src-list="scope.row.picture"

              preview-teleported="true"
          />
          <!--              这个不加的话，图片样式会被覆盖-->
        </template>
      </el-table-column>
      <el-table-column label="上架状态">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              inline-prompt
              active-text="是"
              inactive-text="否"
              @change="changeStatus(scope.row)"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230px">
        <template #default="scope">
          <el-button type="success" @click="details(scope.row)">菜品详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


  <el-drawer v-model="drawerFormVisible" title="I am the title" :with-header="false">
    <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
      <el-form-item prop="name" label="名字">
        <el-input :readonly="true" v-model="state.form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="intro" label="简介">
        <el-input :readonly="true" v-model="state.form.intro" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="intro" label="简介">
        <el-input :readonly="true" v-model="state.form.intro" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="intro" label="规格">
        <!--        v-model绑定的是value，就是要显示的-->
        <el-select @change="sizeChange" @blur="sizeBlur" v-model="sizeId" placeholder="Select" multiple
                   default-first-option>
          <el-option
              v-for="item in ProductDetails.productSizeAndPriceList"
              :key="item.id"
              :label="item.size"
              :value="item.id"
          >
            <span style="float: left">{{ item.size }}</span>
            <span
                style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        ">
              {{ item.price }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="intro" label="口味">
        <el-select v-model="tasteId" placeholder="无" multiple filterable allow-create>
          <el-option
              v-for="item in ProductDetails.tasteAndId"
              :key="item.id"
              :label="item.taste"
              :value="item.id"
          >
            <span style="float: left">{{ item.taste }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="edit">修改</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>

  <page @update:params="handleParams" :type="2" :param="state.queryParams"/>


  <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
    <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
      <el-form-item prop="name" label="名字">
        <el-input v-model="state.form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="intro" label="简介">
        <el-input v-model="state.form.intro" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-select v-model="state.form.status" style="width: 100%">
          <el-option :key="1" label="正常" :value="1"/>
          <el-option :key="0" label="停用" :value="0"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue'
import type {TabsPaneContext} from 'element-plus'
import Page from "../component/paging.vue";
import {getLocalstorage} from "@/utils/localStorage";
import {changeProduct, getProductDetails, getProductSort} from "@/api/linmour-product/product";
import {error} from "@/utils/tips";
import router from "@/router";


const sizeBlur = () => {
  console.log("***********************")
}
const sizeChange = () => {
  console.log("---------------------")
}
const dialogFormVisible = ref(false)
const addProduct = () => {
  router.push('/addProduct')
}

const shopId = JSON.parse(getLocalstorage("pinia-shopStore")).shopId
const activeName = ref(1)
const handleClick = (tab: TabsPaneContext, event: Event) => {
  state.queryParams.sortId = tab.props.name
  // console.log(tab, event)
}
const state = reactive({
  tableData: [],
  queryParams: {
    pageNo: 1,
    pageSize: 10,
    sortId: undefined
  },
  sortList: [],
  form: {},
  productId: Number
})

const changeStatus = (row) => {
  changeProduct(row).then(res => {
    if (res.code !== 200) {
      error("修改失败")
    }
  })
}

//分页组件触发
const handleParams = (newParams) => {
  state.tableData = newParams;
  state.tableData.forEach(item => {
    const pictureArray = item.picture.split(",");
    item.picture = pictureArray;
  })
  console.log(state.tableData)

}
watch(state.tableData, (newVal) => {
  handleParams(newVal);
}, {deep: true});


const drawerFormVisible = ref(false)

const ProductDetails = reactive({
  productSizeAndPriceList: [],
  tasteAndId: []

});
const sizeId = ref()
const tasteId = ref()
const details = (row) => {
  sizeId.value = null
  tasteId.value = null
  state.form = row
  getProductDetails(row.id).then(res => {
    if (res.code === 200) {
      state.productId = res.data.id;
      ProductDetails.productSizeAndPriceList = res.data.productSizeAndPriceList
      ProductDetails.tasteAndId = res.data.tasteAndId
      if (ProductDetails.productSizeAndPriceList !== null) {
        sizeId.value = ProductDetails.productSizeAndPriceList.filter(m => m.status === 1).map(m => m.id)

      }
      if (ProductDetails.tasteAndId !== null) {
        tasteId.value = ProductDetails.tasteAndId.filter(m => m.status === 1).map(m => m.id)
      }
    }
  })
  drawerFormVisible.value = true
}
const edit = () => {

  const productId = String(state.productId)
  router.push({
    path: '/addProduct',
    query: {
      productId
    }
  });
}


onMounted(() => {
  getProductSort(shopId).then(res => {
    if (res.code === 200) {
      state.sortList = res.data
      console.log(state.sortList)
    }
  })

})

</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
