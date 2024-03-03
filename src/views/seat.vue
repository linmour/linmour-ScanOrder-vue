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
            <el-tag :type="item.status === 1 ? 'danger' : (item.status === 0 ? 'success' : 'warning')">
              {{ item.status === 1 ? '有人' : (item.status === 0 ? '空闲' : '已预订') }}
            </el-tag>
          </div>
        </template>
        <div class="container">
          <!-- 左侧内容 -->
          <div class="left">
            菜品是否已上完:
            <el-tag style="float: right;" :type="item.serving === 1 ? 'success' : 'danger'">
              {{ item.serving === 1 ? '是' : "否" }}
            </el-tag>
            <div>
              <el-badge value="new" class="item" :hidden="item.hidden">
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
  <el-dialog v-model="dialogVisible" title="餐桌订单" width="2000" :before-close="handleClose" :show-close="false"
             draggable>
    <div style="display: flex; flex-wrap: wrap; gap: 10px ; width: 100%">
      <el-card v-for="(item,index) in state.orderList.order" class="box-card" ref="cardRefs">
        <!--        v-if="state.orderList.orderInfoDtos.orderStatus !== 1"-->
        <div>
          <el-row :gutter="20">
            <div style="margin-left: auto">
              <el-popconfirm
                  width="250"
                  cancel-button-text="取消"
                  confirm-button-text="确认"
                  icon-color="#626AEF"
                  title="你确定改变上菜状态？"
                  @confirm="confirmEvent(item)"
                  @cancel="cancel(item)"
              >
                <template #reference>
                  <el-checkbox v-model="item.f" label="菜品是否完成" size="large"/>
                </template>
              </el-popconfirm>

            </div>
          </el-row>

          <!--          <div v-for="it in item.list" style="margin-top: 5px">-->
          <el-row :gutter="20">
            <el-image style="width: 100px; height: 100px" :src="item.picture"/>
            <div style="margin-left: 10px">
              {{ item.name }}
              <div style="margin-top: 50px">
                ￥ {{ item.price }}
              </div>
            </div>
            <div style="margin-top: 70px;margin-left: auto">
              *{{ item.quantity }}
            </div>
          </el-row>
        </div>
      </el-card>
    </div>
    <div style="margin-left: 95%;font-size: 20px">总价:{{ PayAmount }}</div>

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
import {createTable, getTable} from "../api/linmour-restaurant/table";
import {changeOrder, checkout} from "../api/linmour-order";
import {getLocalstorage, setLocalstorage} from "../utils/localStorage";

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
  createTable(state.tableInfo).then(res => {
    if (res.data === 200) {
      state.form.qrCodeUrl = res.data
      state.tableInfo = []
    }
  })
}
const addTable = () => {
  addTableVisible.value = true
}


const cancel = () => {
  orderDetail(TableId.value)
}
const confirmOverOrder = (tableId) => {
  checkout(tableId, 4).then(res => {
    const a = JSON.parse(getLocalstorage('OrderList'))
    const index = a.findIndex(i => i.tableId == tableId.toString());
    if (index !== -1) {
      a.splice(index, 1);
      PayAmount.value = 0
      state.cacheOrderList = []
      setLocalstorage("OrderList", a)
    }

  })
}


const confirmEvent = (item) => {
  item.f = true
  const a = JSON.parse(getLocalstorage('OrderList'))
  const it = a.find(i => i.tableId == TableId.value)
  if (it) {
    const m = it.list.find(n => n.id == item.id)
    m.f = !m.f
  }
  setLocalstorage("OrderList", a)
  orderDetail(TableId.value)
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
      state.form[index].hidden = false;
    }
    console.log("==564564564564=======", state.cacheOrderList)
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
          // 查找原有数据中是否存在相同id的对象
          // const existingItem = originalArray.list.find(item => item.id === newArrayItem.id);
          // if (existingItem) {
          //   // 如果存在相同id的对象，则在原有数据上的quantity字段加
          //   existingItem.quantity = newArrayItem.quantity + existingItem.quantity;
          // } else {
          //   // 如果不存在相同id的对象，则将新数据追加到数组中
          //   console.log(newArrayItem, "22222222")
          //
          //   originalArray.list.push(newArrayItem);
          // }
          newArrayItem.f = false
          originalArray.list.push(newArrayItem);
        });
      } else {
        console.log("565665---",state.cacheOrderList)
        state.cacheOrderList.push(res.data);
      }

    }
    setLocalstorage("OrderList", state.cacheOrderList)
  }
}
const PayAmount = ref()
const TableId = ref()
const orderDetail = (tableId) => {
  TableId.value = tableId
  const index = state.form.findIndex(i => i.id == tableId);
  if (index !== -1) {
    // 根据索引修改原数组中的值
    state.form[index].hidden = true;
  }
  if (getLocalstorage("OrderList") !== '') {
    const cacheOrderList = JSON.parse(getLocalstorage("OrderList"))
    state.orderList.order = []

    const existingItem = cacheOrderList.find(i => i.tableId == tableId)

    if (existingItem) {
      state.orderList.order = existingItem.list
      PayAmount.value = existingItem.payAmount
    }
  }
  dialogVisible.value = true
}

const viewOrder = (index) => {
  const it = state.orderList.orderInfoDtos
  it.orderStatus = 2
  changeOrder(it).then(res => {
    if (res.code === 200) {
      if (getLocalstorage('OrderList') !== '') {
        const a = JSON.parse(getLocalstorage("OrderList"))
        a.forEach(m => {
          if (m.tableId === it.tableId) {
            //找到并修改订单信息
            m.orderInfoDtos.forEach(n => {
              if (n.id === it.id) {
                Object.assign(n, it);
              }
            })
          }
        })
        setLocalstorage("OrderList", a)
      }
    }
  })
}

const shopId = JSON.parse(getLocalstorage("ShopId")).shopId
onMounted(async () => {
  window.addEventListener('onmessageWS', getSocketData)
  getTable().then(res => {
    if (res.code === 200) {
      state.form = res.data
      state.form.forEach(m => {
        m.hidden = true
      })
      console.log(state.form, "*-*-*-----------------------")
    }
  })
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
