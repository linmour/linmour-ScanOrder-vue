<template>
  <el-header>
    <el-button @click="addTable">新增位置</el-button>
  </el-header>
  <el-row :gutter="12">
    <el-col v-for="(item, index) in state.form" :key="index" :span="6">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
            <dicttag type="table_status" :value="item.status"/>
          </div>
        </template>
        <div class="container">
          <!-- 左侧内容 -->
          <div class="left">
            菜品是否已上完:
            <el-tag style="float: right;" :type="item.serving == 1 ? 'success' : 'danger'">
              {{ item.serving == 1 ? '是' : "否" }}
            </el-tag>
            <div>
              <el-badge value="new" class="item" :hidden="item.dishes == 0">
                <el-button @click="orderDetail(item.id)">订单详情</el-button>
              </el-badge>
              <el-popconfirm
                  width="250"
                  cancel-button-text="取消"
                  confirm-button-text="确认"
                  icon-color="#626AEF"
                  title="删除本桌的订单信息，请待顾客确认后操作"
                  @confirm="confirmOverOrder(item.id)"
              >
                <template #reference>
                  <el-button>完成订单</el-button>
                </template>
              </el-popconfirm>

            </div>
          </div>
          <!-- 右侧内容 -->
          <div class="right">
            <el-image :src="item.qrCodeUrl"></el-image>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-dialog v-if="dialogVisible" v-model="dialogVisible"
             :title="title1 + '&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;' + title2 + '&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;' + title3"
             width="1800" :before-close="handleClose" :show-close="false"
             draggable>
    <el-table :data="state.orderList.order.orderItems" border style="width: 100%">
      <el-table-column prop="name" label="名字" width="180"/>
      <el-table-column prop="propsText" label="规格"/>
      <el-table-column prop="quantity" label="个数"/>
      <el-table-column prop="price" label="图片">
        <el-image style="width: 100px; height: 100px" :src="picture"/>
      </el-table-column>
      <el-table-column prop="price" label="单价"/>
      <el-table-column prop="status1" label="是否完成">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              class="mt-2"
              @change="change(scope.$index)"
              style="margin-left: 24px"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
          />
        </template>

      </el-table-column>
    </el-table>


  </el-dialog>
  <el-dialog v-model="addTableVisible" title="Warning" width="30%" center>
    <el-form :model="state.tableInfo" label-width="80px" style="padding: 0 20px" status-icon>
      <el-form-item prop="name" label="餐桌名字">
        <el-input v-model="state.tableInfo.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="size" label="二维码大小" label-width="90px">
        <el-input v-model="state.tableInfo.size" autocomplete="off"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="createQR">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {createTable, getTable, update} from "../../api/linmour-restaurant/table";
import {updateOrderItemStatus, checkout, GetCurrentOrderInfo} from "../../api/linmour-order";
import {getLocalstorage, setLocalstorage} from "../../utils/localStorage";
import {initWebSocket} from "../../utils/webstock";
import {Check, Close} from '@element-plus/icons-vue'
import Dicttag from "../../component/dicTag.vue";

const dialogVisible = ref(false);
const addTableVisible = ref(false)
const state = reactive({
  cacheOrderList: [],
  form: {},
  tableInfo: {},
  orderList: {
    order: [],
    orderInfoDtos: []
  }
})
const createQR = () => {
  addTableVisible.value = false
  createTables()

}
const createTables = () => {
  createTable(state.tableInfo).then(res => {
      getTables()
      state.form.qrCodeUrl = res
      state.tableInfo = {}
  })
}

const change = async (index) => {
  await updateOrderItemStatus(state.orderList.order.orderInfo.tableId, index)
  await orderDetail(state.orderList.order.orderInfo.tableId)

}
const addTable = () => {
  addTableVisible.value = true
}
const value = ref(true)


const confirmOverOrder = (tableId) => {
  var targetObject = state.form.find(n => n.id == state.orderList.order.orderInfo.tableId);
  targetObject.status = 0
  update(targetObject)
  checkout(tableId, 4)
}


//后台推送订单
const getSocketData = (res) => {
  res = JSON.parse(res.detail.data)
  if (res === 1) {
    console.log('检测连接')
  } else if (res.msg === 'order') {
    // 找到要修改的对象的索引
    const index = state.form.findIndex(i => i.id == res.data.tableId);
    if (index !== -1) {
      // 根据索引修改原数组中的值
      state.form[index].dishes = 1;
      state.form[index].serving = 0;
      state.form[index].status = 1;
      update(state.form[index])
    }
    if (getLocalstorage('OrderList') == '' || getLocalstorage('OrderList') == '[]') {
      console.log('第一次点餐----------')
      res.data.list.forEach(m => {
        //标记菜品是否完成
        m.f = false
      })
      state.cacheOrderList.push(res.data)
      setLocalstorage("OrderList", state.cacheOrderList)
    } else {
      state.cacheOrderList = JSON.parse(getLocalstorage('OrderList'))
      const originalArray = state.cacheOrderList.find(i => i.tableId === res.data.tableId)
      if (originalArray) {
        originalArray.payAmount = res.data.payAmount
        // 遍历要插入的新数组
        res.data.list.forEach(newArrayItem => {
          newArrayItem.f = false
          originalArray.list.push(newArrayItem);
        });
      } else {
        state.cacheOrderList.push(res.data);
      }

    }
    setLocalstorage("OrderList", state.cacheOrderList)
  }
}


const title1 = ref("订单号:")
const title2 = ref("总价:")
const title3 = ref("备注:")
const orderDetail = (tableId) => {
  GetCurrentOrderInfo(tableId).then(res => {
    title1.value = "订单号:"
    title2.value = "总价:"
    title3.value = "备注:"
    state.orderList.order = res.data
    if (state.orderList.order.orderItems != null) {
      title1.value = ' 订单号:' + state.orderList.order.orderInfo.id
      title2.value = '总价:' + state.orderList.order.orderInfo.payAmount
      title3.value = '备注:' + state.orderList.order.orderInfo.remark
      let f = true
      state.orderList.order.orderItems.forEach(m => {
        if (m.status == 1 || m.status)
          m.status = true
        else {
          f = false
          m.status = false
        }
      })
      var targetObject = state.form.find(n => n.id == state.orderList.order.orderInfo.tableId);
      targetObject.dishes = 0
      if (f) {
        if (targetObject)
          targetObject.serving = 1;
      } else {
        if (targetObject)
          targetObject.serving = 0;
      }
      update(targetObject)

    }

  })

  dialogVisible.value = true
}

const getTables = () => {
  getTable().then(res => {
      state.form = res
  })
}
onMounted(async () => {
  initWebSocket();
  window.addEventListener('onmessageWS', getSocketData)
  await getTables()
})

const handleClose = () => {
  dialogVisible.value = false;
};


</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 410px;
  margin: 20px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}


.footer {
  margin-top: 50px;
  text-align: right;
}

.container {
  display: flex;
  justify-content: space-between;
}

.left {
  width: 70%;
}

.right {
  flex-grow: 1;
  margin-left: 10px;
  width: 100px;
}
</style>
