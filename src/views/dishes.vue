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
          <el-button type="success" @click="detail(scope.row)">菜品详情</el-button>
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

      <el-form-item label="普通选项">
        <el-tabs v-model="nonValueActiveName" @tab-click="nonValuehandleClick" type="card">
          <div v-for="item in productDetails.nonValueList" :key="item.sort">
            <el-tab-pane :label="item.sort" :name="item.sort">
              <el-tag
                  v-for="it in item.spec"
                  :key="item.sort"
                  class="mx-1"
                  effect="dark"
              >
                {{ it }}
              </el-tag>
            </el-tab-pane>
          </div>
        </el-tabs>
      </el-form-item>
      <el-form-item label="价值选项">
        <el-tabs v-model="ValueActiveName" @tab-click="ValuehandleClick" type="card">
          <div v-for="item in productDetails.valueList" :key="item.sort">
            <el-tab-pane :label="item.sort" :name="item.sort">

              <el-tag
                  v-for="(it,index) in item.spec"
                  :key="item.sort"
                  class="mx-1"
                  effect="dark"
              >
                {{ it }} ￥ {{ item.price[index] }}
              </el-tag>


            </el-tab-pane>
          </div>
        </el-tabs>
      </el-form-item>
      <el-form-item label="所需材料">
        <el-tag
            v-for="item in productDetails.inventoryList"
            :key="item.name"
            class="mx-1"
            effect="dark"
        >
          {{ item.name }} {{ item.numAndUnit }}
        </el-tag>

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
import {changeProduct, getProductDetails, getProductSort} from "@/api/linmour-product/product";
import {error} from "@/utils/tips";
import router from "@/router";


const dialogFormVisible = ref(false)
const addProduct = () => {
  router.push('/addProduct')
}

const activeName = ref(1)
const ValueActiveName = ref('')
const nonValueActiveName = ref('')
const inventoryActiveName = ref('')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  state.queryParams.sortId = tab.props.name
  // console.log(tab, event)
}
const ValuehandleClick = (tab: TabsPaneContext, event: Event) => {
  ValueActiveName.value = tab.props.name
}
const nonValuehandleClick = (tab: TabsPaneContext, event: Event) => {
  nonValueActiveName.value = tab.props.name
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
  changeProduct(row.id,row.status).then(res => {
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

const productDetails = reactive({
  nonValueList: [],
  valueList: [],
  inventoryList: []

});

const detail = (row) => {
  state.form = row
  getProductDetails(row.id).then(res => {
    if (res.code === 200) {
      res.data = res.data[0]
      console.log(res.data)
      state.productId = res.data.id;
      productDetails.nonValueList = res.data.nonValueList;
      productDetails.valueList = res.data.valueList
      productDetails.inventoryList = res.data.inventoryList
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
  getProductSort().then(res => {
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
