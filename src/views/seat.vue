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
              <el-badge :value="item.orderNum" class="item" :hidden="item.orderNum === 0">
                <el-button @click="orderDetail(item.id)">订单详情</el-button>
              </el-badge>
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
  <el-dialog v-model="dialogVisible" title="餐桌订单" :width="dialogWidth" :before-close="handleClose" :show-close="false"
             draggable>
    <div style="display: flex;  gap: 10px ; width: 5500px">
      <el-card v-for="(item,index) in state.orderList.orderDetailDtos" class="box-card" ref="cardRefs">
        <div v-if="state.orderList.orderInfoDtos[index].orderStatus !== 3">
          <el-row :gutter="20">
            订单号:{{ item.orderId }}
            <div style="margin-left: auto">
              <el-popconfirm
                  width="250"
                  cancel-button-text="取消"
                  confirm-button-text="确认已完成"
                  icon-color="#626AEF"
                  title="你确定订单已完成？点击确认将删除订单信息"
                  @confirm="confirmEvent(index,state.orderList.orderInfoDtos[index].tableId)"
              >
                <template #reference>
                  <el-checkbox @click.native="handleCheckboxClick" label="订单是否完成" size="large"/>
                </template>
              </el-popconfirm>

            </div>
          </el-row>

          <div v-for="it in item.products" style="margin-top: 5px">
            <el-row :gutter="20">
              <el-image style="width: 100px; height: 100px" :src="it.picture"/>
              <div style="margin-left: 10px">
                {{ it.name }}
                <div style="margin-top: 50px">
                  ￥ {{ it.price }}
                </div>
              </div>
              <div style="margin-top: 70px;margin-left: auto">
                *{{ it.quantity }}
              </div>
            </el-row>
          </div>

          <div class="footer">
            <div>消费总额 :{{ state.orderList.orderInfoDtos[index].payAmount }}</div>
            <div>支付方式 :{{ state.orderList.orderInfoDtos[index].payStatus == 1 ? '微信' : '支付宝' }}</div>

            <div>支付时间 :{{ state.orderList.orderInfoDtos[index].updateTime.replace("T", " ") }}</div>

          </div>
        </div>
        <el-badge v-else value="新的订单" class="item">
          <el-button @click="viewOrder(index)">查看新的订单</el-button>
        </el-badge>

      </el-card>
    </div>
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
import {nextTick, onMounted, reactive, ref} from "vue";
import {createTable, getTable} from "../api/linmour-restaurant/table";
import {changeOrder, getOrderInfo} from "../api/linmour-order";
import {getLocalstorage, setLocalstorage} from "../utils/localStorage";

const dialogVisible = ref(false);
const dialogWidth = ref('40%');
const addTableVisible = ref(false)


const state = reactive({
  cacheOrderList: [],
  form: {},
  tableInfo: {},
  orderList: {
    orderDetailDtos: [],
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

const handleCheckboxClick = (event) => {
  event.preventDefault()
}

function orderNum() {
  if (getLocalstorage('OrderList') !== '') {
    const a = JSON.parse(getLocalstorage('OrderList'))
    console.log(a)
    state.form.forEach(m => {
      m.orderNum = 0
      a.forEach(n => {
        if (m.id === n.tableId) {
          m.orderNum = n.orderInfoDtos.length
        }
      })
    })
  }
}

const confirmEvent = (index, tableId) => {
  const it = state.orderList.orderInfoDtos[index]
  it.orderStatus = 1
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
        a.forEach(a => {
          if (a.tableId === tableId) {
            a.orderInfoDtos = a.orderInfoDtos.filter(item => item.id !== it.id);
            a.orderDetailDtos = a.orderDetailDtos.filter(item => item.orderId !== it.id);
          }
        })
        setLocalstorage("OrderList", a)
        orderNum();
        orderDetail(state.orderList.orderInfoDtos[index].tableId)
      }
      it.orderStatus = 2
    }
  })

}


//后台推送订单
const getSocketData = (res) => {
  console.log(state.cacheOrderList,'5+565+556235656+5++5')
  let flag = true
  res = JSON.parse(res.detail.data)
  if (res === 1) {
    console.log('检测连接')
  } else if (res.msg === 'order') {
    //同一桌的放在一起
    res.data.tableId = res.data.orderInfoDtos.tableId
    if (getLocalstorage('OrderList') === '') {
      console.log('没有桌子----------')
      state.cacheOrderList.push(res.data)
      setLocalstorage("OrderList", state.cacheOrderList)
    } else {
      console.log('桌子有菜')
      state.cacheOrderList = JSON.parse(getLocalstorage('OrderList'))
      state.cacheOrderList.forEach(m => {
        //找到桌子
        if (m.tableId === res.data.orderInfoDtos.tableId) {
          m.orderInfoDtos.payAmount = m.orderInfoDtos.payAmount + res.data.orderInfoDtos.payAmount
          //添加
          res.data.orderDetailDtos.forEach(n =>{
            m.orderDetailDtos.push(n)
          })
          flag = false
        }
        if (flag) {
          console.log('桌子没菜')
          state.cacheOrderList.push(res.data)
        }
      })
      setLocalstorage("OrderList", state.cacheOrderList)
    }
    console.log('订单来了')
    orderNum()
  }
}
const orderDetail = (tableId) => {
  console.log(tableId)
  if (getLocalstorage("OrderList") !== '') {
    const cacheOrderList = JSON.parse(getLocalstorage("OrderList"))
    if (cacheOrderList[0] === undefined) {
      state.orderList.orderDetailDtos = []
      state.orderList.orderInfoDtos = []
    } else {
      for (let i = 0; i < cacheOrderList.length; i++) {
        if (cacheOrderList[i].tableId === tableId) {
          state.orderList.orderDetailDtos = [...cacheOrderList[i].orderDetailDtos]
          state.orderList.orderInfoDtos = [...cacheOrderList[i].orderInfoDtos]
        }
      }
    }
  }


  dialogWidth.value = (state.orderList.orderInfoDtos.length) * 510
  dialogVisible.value = true

}

const viewOrder = (index) => {
  const it = state.orderList.orderInfoDtos[index]
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
      orderNum()
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
