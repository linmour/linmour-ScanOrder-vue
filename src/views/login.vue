<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="left">
      <div>
        <div>欢迎使用</div>
        <div>此站点是linmour扫码点餐后台</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <user/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon>
                <lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="button3">
          <el-button :text="true" @click="register">立即注册</el-button>
          <span>|</span>
          <el-button :text="true">忘记密码</el-button>
          <span>|</span>
          <el-button :text="true">
            <el-switch
                v-model="userType"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                active-text="商户"
                inactive-text="管理者"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #6366f1"
            />
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button round color="#626aef" class="w-[250px]" type="primary" @click="onSubmit" :loading="loading">登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {login} from '@/api/linmour-system/merchant'
import {useRouter} from 'vue-router'
import {getLocalstorage, setLocalstorage} from "../utils/localStorage";
import {getDictList} from "../api/linmour-system/dict";


const router = useRouter()
const form = reactive({
  phone: "",
  password: ""
})

const rules = {
  phone: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    },
  ],
  password: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    },
  ]
}

const formRef = ref(null)
const loading = ref(false)
const userType = ref('2')

const register = () => {
  router.push('/register')
}
// const socket = ref(null);
// const timeout = ref(10 * 1000);
// const timeoutObj = ref(null);
// const serverTimeoutObj = ref(null);
// const lockReconnect = ref(false);
// const websocket = ref(null)
// const timeoutnum = ref(null)
//
// // 初始化 websocket
// const initWebSocket = () => {
//   let wsUrl = 'ws://127.0.0.1:12800/websocket/order/' + '1';
//   let a = JSON.parse(getLocalstorage("ShopId")).shopId
//   websocket.value = new WebSocket(wsUrl, [a]);
//   websocket.value.onopen = websocketonopen;
//   websocket.value.onerror = websocketonerror;
//   websocket.value.onmessage = setOnmessageMessage;
//   websocket.value.onclose = websocketclose;
// }
//
// // 页面加载时执行初始化 websocket
// // onMounted(() => {
// //   initWebSocket();
// // });
//
// const start = () => {
//   console.log('start');
//   clearTimeout(timeoutObj.value);
//   clearTimeout(serverTimeoutObj.value);
//   timeoutObj.value = setTimeout(() => {
//     if (websocket.value && websocket.value.readyState === 1) {
//       let actions = {"test": "12345"};
//       websocket.send(JSON.stringify(actions));
//     } else {
//       reconnect();
//     }
//     serverTimeoutObj.value = setTimeout(() => {
//       websocket.value.close();
//     }, timeout.value);
//   }, timeout.value);
// }
//
// const reset = () => {
//   clearTimeout(timeoutObj.value);
//   clearTimeout(serverTimeoutObj.value);
//   start();
// }
//
// const reconnect = () => {
//   if (lockReconnect.value) return;
//   lockReconnect.value = true;
//   timeoutnum.value && clearTimeout(timeoutnum.value);
//   timeoutnum.value = setTimeout(() => {
//     initWebSocket();
//     lockReconnect.value = false;
//   }, 5000);
// }
//
// const setOnmessageMessage = async (event) => {
//   reset();
//   window.dispatchEvent(new CustomEvent('onmessageWS', {
//     detail: {
//       data: event.data
//     }
//   }));
// }
//
// const websocketonopen = () => {
//   start();
//   console.log("WebSocket连接成功!!!" + new Date() + "----" + websocket.value.readyState);
//   clearInterval(this.otimer);
// }
//
// const websocketonerror = (e) => {
//   console.log("WebSocket连接发生错误");
//   console.log(e);
// }
//
// const websocketclose = (e) => {
//   websocket.value.close();
//   clearTimeout(timeoutObj.value);
//   clearTimeout(serverTimeoutObj.value);
//   console.log("WebSocket连接关闭");
//   console.log(e);
// }
//
// const websocketsend = (messsage) => {
//   websocket.value.send(messsage);
// }
//
// const closeWebSocket = () => {
//   websocket.value.close();
// }

const onSubmit = async () => {
  loading.value = true

  try {
    const valid = await new Promise((resolve, reject) => {
      formRef.value.validate((valid) => {
        resolve(valid);
      });
    });

    if (!valid) {
      return false;
    }

    const loginRes = await login(form.phone, form.password);

    if (loginRes.code === 200) {
      setLocalstorage("Token", loginRes.data.token);
      setLocalstorage("UserInfo", loginRes.data.userInfo);
      const dictRes = await getDictList();
      if (dictRes.code === 200) {
        setLocalstorage("DictList", dictRes.data);
      }
      // initWebSocket();
      router.push("/");
    }
  } catch (error) {
    // 处理错误
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  @apply min-h-screen bg-indigo-500;
}

.login-container .left, .login-container .right {
  @apply flex items-center justify-center;
}

.login-container .right {
  @apply bg-light-50 flex-col;
}

.left > div > div:first-child {
  @apply font-bold text-5xl text-light-50 mb-4;
}

.left > div > div:last-child {
  @apply text-gray-200 text-sm;
}

.right .title {
  @apply font-bold text-3xl text-gray-800;
}

.right > div {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}

.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}

.button3 {
  width: 500px;
  display: flex;
  align-items: center;
}


</style>
