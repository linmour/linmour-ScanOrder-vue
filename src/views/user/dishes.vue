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
      <el-table-column prop="inventoryAllList" label="材料">
        <template #default="scope">
          <el-tag
              v-for="item in scope.row.inventoryAllList"
              :key="item.name"
              class="mx-1"
              effect="dark"
          >
            {{ item.num }}  {{ item.unit }} {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="productSortAndOptions" label="规格选项" width="320">
        <template #default="scope">
          <el-tabs v-model="ValueActiveName[scope.$index]" type="card"
                   v-if="scope.row.productSortAndOptions  != undefined && scope.row.productSortAndOptions.length >0 ">
            <div v-for="(item,index) in scope.row.productSortAndOptions" :key="index">
              <el-tab-pane :label="item.productSpecSort.name">
                <el-tag
                    v-for="(it,index) in item.productSpecOptions"
                    :key="index"
                    class="mx-1"
                    effect="dark"
                    style="width: 60px;height: 30px; margin-top: 10px"
                >
                  {{ it.name }}
                  <div v-if="it.price != 0.00">
                    ￥{{ it.price }}
                  </div>
                </el-tag>
              </el-tab-pane>
            </div>
          </el-tabs>


        </template>
      </el-table-column>
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
          <el-button @click="edit(scope.row.id)">修改</el-button>
          <el-button @click="deleted(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="padding-left-l padding-right-l">
    <input-box :caption="caption" :show="showInput" :value="inputValue" @close="showInput=false" @confirm="inputBoxYes" @cancel="showInput=false"/>
  </div>


  <page
      :total="total"
      v-model:page="state.queryParams.pageNo"
      v-model:limit="state.queryParams.pageSize"
      @pagination="getList"
  />

</template>


<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue'
import type {TabPaneName, TabsPaneContext} from 'element-plus'
import Page from "../../component/paging.vue";
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
import InputBox from "../../component/inputBox.vue"
import {deletedProduct} from "../../api/linmour-product/product";


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
  let shopId = getLocalstorage("ShopId")
  await createProductSort(sort, shopId)
  await getSort()
  showInput.value = false;
  caption.value = "提示";
  msgText.value = "您输入的值是【" + value + "】";
  showMsgShow.value = true;
};

const addProduct = () => {
  router.push('/addProduct')
}

const activeName = ref(1)
const ValueActiveName = ref([])

const handleClick = (tab: TabsPaneContext, event: Event) => {
  state.queryParams.sortId = tab.props.name
  getList()
}


const shopId = ref()
const total = ref(0)
const getList = async () => {
  if (state.queryParams.sortId == undefined)
    state.queryParams.sortId = state.sortList[0].id
  const res = await getProductPage(state.queryParams)
  shopId.value = getLocalstorage("ShopId")
    state.tableData = res.list
    total.value = res.total
    ValueActiveName.value.fill("0", 0, state.tableData.length);
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


const edit = (productId) => {
  router.push({
    path: '/addProduct',
    query: {
      productId
    }
  });
}

const deleted = (id) =>{
  deletedProduct(id).then(res =>{
    getList()
  })
}

const getSort = async () => {
  const res = await getProductSort()
    state.sortList = res
}
onMounted(async () => {
  await getSort()
  await getList()

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
