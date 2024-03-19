<template>
  <div style="margin-left:200px;width: 80%;">
    <el-steps :active="step" finish-status="success">
      <el-step title="个人信息"/>
      <el-step title="店铺信息"/>
    </el-steps>
  </div>

  <!--  <div class="container">-->
  <el-card class="left-column" v-if="step === 0">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
      </div>
    </template>
    <el-form
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
    >
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="ruleForm.phone"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="ruleForm.idCard"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password"/>
      </el-form-item>
      <el-form-item label="身份证图片" prop="idCardUrl">
        <upload-img></upload-img>
      </el-form-item>

    </el-form>
  </el-card>
  <el-card class="left-column" v-if="step === 1">
    <template #header>
      <div class="card-header">
        <span>店铺信息</span>
      </div>
    </template>
    <el-form
        :model="ruleFormShop"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
    >
      <el-form-item label="店铺名" prop="name">
        <el-input v-model="ruleFormShop.name"/>
      </el-form-item>
      <el-form-item label="佐证材料" prop="certificate">
        <upload-img></upload-img>
      </el-form-item>
      <el-form-item label="地点" prop="position">
        <el-input v-model="ruleFormShop.position"/>
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <el-input v-model="ruleFormShop.intro"/>
      </el-form-item>
      <el-form-item label="经营时间" prop="businessHours">
        <el-time-picker
            is-range
            v-model="value1"
            :format="'HH:mm'"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>

    </el-form>

  </el-card>
  <!--  </div>-->
  <div style="margin: 10% 0% 0% 47%">
    <el-button type="primary" @click="next" v-if="step < 1">
      下一页
    </el-button>
    <el-button type="primary" @click="previous" v-if="step > 0 && step !== 2">
      上一页
    </el-button>
    <el-button type="primary" @click="submitForm" v-if="step === 1">
      完成
    </el-button>

  </div>

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import UploadImg from "../component/uploadImg.vue";


interface RuleForm {
  name: string
  phone: string
  idCard: string
  idCardUrl: string
  password: string
}
const  value1= ref([new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)])

const formSize = ref('default')
const ruleForm = reactive<RuleForm>({
  name: '',
  phone: '',
  idCard: '',
  idCardUrl: '',
  password: '',
})
const ruleFormShop = reactive({
  name: '',
  certificate: '',
  intro: '',
  position: '',
  businessHours: '',
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    {required: true, message: 'Please input Activity name', trigger: 'blur'},
    {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
  ],
  phone: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ]
})
const step = ref(0)

const next = () => {
  step.value++
}

const previous = () => {
  step.value--
}


const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(ruleForm)
  step.value++
  if (!formEl) return
  // await formEl.validate((valid, fields) => {
  //   if (valid) {
  //     console.log('submit!')
  //   } else {
  //     console.log('error submit!', fields)
  //   }
  // })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({length: 10000}).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))
</script>

<style scoped>
.container {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  height: 500px;
}

.left-column {
  margin-top: 50px;
  text-align: center;
  margin-left: 35%;
  height: 100%;
  width: 30%;
}

.right-column {
  flex: 1;
  margin-top: 50px;
  text-align: center;
  margin-left: 150px;
  height: 100%;


}
</style>
