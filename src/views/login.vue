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

    setLocalstorage("Token", loginRes.token);
    setLocalstorage("UserInfo", loginRes.userInfo);
    const dictRes = await getDictList();
    setLocalstorage("DictList", dictRes);
    if (loginRes.userInfo.type == 1)
      router.push("/admin/shop");
    else
      router.push("/user/home")

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
  margin-left: 40px;
}


</style>
