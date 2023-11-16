<template>

  <div class="container">
      <el-card class="left-column">
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
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="ruleForm.name"/>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="ruleForm.phone"/>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="ruleForm.idCard"/>
          </el-form-item>

        </el-form>
      </el-card>
      <el-card class="right-column">
        <template #header>
          <div class="card-header">
            <span>店铺信息</span>
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
          <el-form-item label="店铺名" prop="name">
            <el-input v-model="ruleForm.name"/>
          </el-form-item>
          <el-form-item label="佐证材料" prop="certificate">
            <upload-img></upload-img>
          </el-form-item>
          <el-form-item label="地点" prop="position">
            <el-input v-model="ruleForm.position"/>
          </el-form-item>

        </el-form>

      </el-card>
  </div>
  <div>
    <el-button type="primary" @click="submitForm(ruleFormRef)">
      Create
    </el-button>
    <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
  </div>

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import UploadImg from "../component/uploadImg.vue";

interface RuleForm {
  name: string
  region: string
  count: string
  date1: string
  date2: string
  delivery: boolean
  type: string[]
  resource: string
  desc: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: 'Hello',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    {required: true, message: 'Please input Activity name', trigger: 'blur'},
    {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [
    {required: true, message: 'Please input activity form', trigger: 'blur'},
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
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
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  height: 500px;
}

.left-column {
  flex: 1;
  margin-top: 50px;
  text-align: center;
  margin-right: 20px;
  height: 100%;
}

.right-column {
  flex: 1;
  margin-top: 50px;
  text-align: center;
  margin-left: 150px;
  height: 100%;


}
</style>
