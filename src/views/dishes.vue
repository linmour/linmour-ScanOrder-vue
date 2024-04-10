<template>
  <div>
    <el-container>
      <el-aside width="auto">
        <el-tabs @edit="handleTabsEdit" addable v-model="activeName" @tab-click="handleClick" type="card">
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
      <el-table-column prop="picture" label="图片">
        <template #default="{ row }">
          <el-image
              style="width: 100px; height: 100px"
              :src="row.picture[0]"
              :zoom-rate="1.2"
              :preview-src-list="row.picture"
              :initial-index="4"
              fit="cover"
              preview-teleported="true"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="上架状态">
        <template #default="scope">
          <!--
                        :active-value="1"
                        :inactive-value="0"
                        如果要传数字前面要加：
                        如果要字符串就不加
                        但是一定要加“”
                  -->
          <el-switch
              v-model="scope.row.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
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
  <div class="padding-left-l padding-right-l">
    <input-box :caption="caption" :show="showInput" :value="inputValue" @close="showInput=false" @confirm="inputBoxYes"
               @cancel="showInput=false"/>
  </div>


  <el-drawer v-model="drawerFormVisible" title="I am the title" :with-header="false">
    <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
      <el-form-item prop="name" label="名字">
        <el-input :readonly="true" v-model="state.form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="intro" label="简介1">
        <el-input :readonly="true" v-model="state.form.intro" autocomplete="off"/>
      </el-form-item>
      <!--      <el-form-item label="普通选项">-->
      <!--        <el-tabs v-model="nonValueActiveName" @tab-click="nonValueHandleClick" type="card">-->
      <!--          <div v-for="item in productDetails.nonValueList" :key="item.sort">-->
      <!--            <el-tab-pane :label="item.sort" :name="item.sort">-->
      <!--              <el-tag-->
      <!--                  v-for="it in item.spec"-->
      <!--                  :key="item.sort"-->
      <!--                  class="mx-1"-->
      <!--                  effect="dark"-->
      <!--              >-->
      <!--                {{ it }}-->
      <!--              </el-tag>-->
      <!--            </el-tab-pane>-->
      <!--          </div>-->
      <!--        </el-tabs>-->
      <!--      </el-form-item>-->
      <el-form-item label="规格选项" v-if="productDetails.productSortAndOptions != undefined && productDetails.productSortAndOptions.length >0">
        <el-tabs v-model="ValueActiveName" @tab-click="ValueHandleClick" type="card">
          <div v-for="item in productDetails.productSortAndOptions" :key="item.productSpecSort.id">
            <el-tab-pane :label="item.productSpecSort.name" :name="item.productSpecSort.name">
              <el-tag
                  v-for="(it,index) in item.productSpecOptions"
                  :key="index"
                  class="mx-1"
                  effect="dark"
              >
                {{ it.name }}
                <div v-if="it.price != 0.00">
                  ￥{{ it.price }}

                </div>
              </el-tag>
            </el-tab-pane>
          </div>
        </el-tabs>
      </el-form-item>
      <el-form-item label="所需材料" v-if="productDetails.inventoryList != undefined">
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

  <page
      :total="total"
      v-model:page="state.queryParams.pageNo"
      v-model:limit="state.queryParams.pageSize"
      @pagination="getList"
  />


  <!--  <el-dialog v-model="dialogFormVisible" title="信息" width="40%">-->
  <!--    <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>-->
  <!--      <el-form-item prop="name" label="名字">-->
  <!--        <el-input v-model="state.form.name" autocomplete="off"/>-->
  <!--      </el-form-item>-->
  <!--      <el-form-item prop="intro" label="简介2">-->
  <!--        <el-input v-model="state.form.intro" autocomplete="off"/>-->
  <!--      </el-form-item>-->
  <!--      <el-form-item prop="status" label="状态">-->
  <!--        <el-select v-model="state.form.status" style="width: 100%">-->
  <!--          <el-option :key="1" label="正常" :value="1"/>-->
  <!--          <el-option :key="0" label="停用" :value="0"/>-->
  <!--        </el-select>-->
  <!--      </el-form-item>-->
  <!--    </el-form>-->
  <!--    <template #footer>-->
  <!--      <span class="dialog-footer">-->
  <!--        <el-button @click="dialogFormVisible = false">取消</el-button>-->
  <!--      </span>-->
  <!--    </template>-->
  <!--  </el-dialog>-->
</template>


<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue'
import type {TabPaneName, TabsPaneContext} from 'element-plus'
import Page from "../component/paging.vue";
import {
  changeProduct,
  getProductDetails,
  getProductPage,
  getProductSort,
  createProductSort
} from "@/api/linmour-product/product";
import {error} from "@/utils/tips";
import router from "@/router";
import {getLocalstorage} from "@/utils/localStorage";
import InputBox from "../component/inputBox.vue"


const inputValue = ref('');
const caption = ref('');
const msgText = ref('');
const showMsgShow = ref(false);
const showInput = ref(false);


const InputBoxClick = () => {
  caption.value = "请输入";
  inputValue.value = "";
  showInput.value = true;
};

const sortName = ref("")

const inputBoxYes = async (value) => {
  sortName.value = value
  let sort = sortName.value
  let shopId = getLocalstorage("ShopId").shopId
  await createProductSort(sort, shopId)
  await getSort()
  showInput.value = false;
  caption.value = "提示";
  msgText.value = "您输入的值是【" + value + "】";
  showMsgShow.value = true;
};


const dialogFormVisible = ref(false)
const addProduct = () => {
  router.push('/addProduct')
}

const activeName = ref(1)
const ValueActiveName = ref('')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  state.queryParams.sortId = tab.props.name
  getList()
  // console.log(tab, event)
}
const ValueHandleClick = (tab: TabsPaneContext, event: Event) => {
  ValueActiveName.value = tab.props.name
}

const shopId = ref()
const total = ref(0)
const getList = async () => {

  const res = await getProductPage(state.queryParams)
  shopId.value = JSON.parse(getLocalstorage("ShopId")).shopId
  state.queryParams.shopId = shopId.value
  if (res.code === 200) {
    state.tableData = res.data.list
    total.value = res.data.total
  }
  state.tableData.forEach(item => {
    const pictureArray = item.picture.split(",");
    item.picture = pictureArray;
  })
}


const handleTabsEdit = async (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
) => {
  await InputBoxClick()
  // if (action === 'add') {

  // }
  // else if (action === 'remove') {
  //   const tabs = editableTabs.value
  //   let activeName = editableTabsValue.value
  //   if (activeName === targetName) {
  //     tabs.forEach((tab, index) => {
  //       if (tab.name === targetName) {
  //         const nextTab = tabs[index + 1] || tabs[index - 1]
  //         if (nextTab) {
  //           activeName = nextTab.name
  //         }
  //       }
  //     })
  //   }
  //
  //   editableTabsValue.value = activeName
  //   editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
  // }
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

const changeStatus = async (row) => {
  console.log(row.status)
  const res = await changeProduct(row.id, row.status)
  if (res.code !== 200) {
    error("修改失败")
  }
}


const drawerFormVisible = ref(false)

const productDetails = ref({})

const detail = (row) => {
  state.form = row
  getProductDetails(row.id).then(res => {
    if (res.code === 200) {
      state.productId = row.id;
      productDetails.value = res.data[0]
      ValueActiveName.value = productDetails.value.productSortAndOptions[0].productSpecSort.name
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

const getSort = async () => {
  const res = await getProductSort()
  if (res.code === 200) {
    state.sortList = res.data
  }
}
onMounted(async () => {
  getList()
  getSort()

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
