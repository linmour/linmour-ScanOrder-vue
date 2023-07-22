<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <div>
          <el-card style="width: 60%;height: 700px; margin: 80px auto">
            <el-form style="width: 70%; margin: 60px auto" label-width="80px">
              <div style="text-align: center">
                <el-upload
                    class="avatar-uploader"
                    action="http://127.0.0.1:5173/api/account/merchant/upload_picture"
                      :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :data='uploadData'
                    name="multipartFile"
                    >
<!--                  name就是文件上传的名字，要和后端接口的一样要不然会接受不到
                      data是携带的参数，后端接口要接受
                      action就是上传图片的接口-->
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </div>
              <div style="margin: 100px; width: 300px" >
                <el-form-item label="名字">
                  <el-input v-model="state.form.realName" placeholder="请输入名字"></el-input>
                </el-form-item>
                <el-form-item  label="电话号码">
                  <el-input  v-model="state.form.phone" placeholder="电话号码"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="state.form.sex" placeholder="性别">
                    <el-option :key="1" label="男" :value="1" />
                    <el-option :key="0" label="女" :value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item label="身份证">
                  <el-input  v-model="state.form.idCard" placeholder="身份证"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div style="text-align: center; width: 100%">
              <el-button type="primary" @click="save">保存</el-button>
            </div>
          </el-card>
        </div>
      </el-main>
      <el-aside width="200px"></el-aside>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, onMounted, reactive, ref, UnwrapNestedRefs} from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import {getLocalstorage, getUserInfo, setLocalstorage} from "@/utils/localStorage";
import {error, success} from "@/utils/tips";
import { update } from "@/api/linmour-account/merchant";

const imageUrl = ref('')
const uploadData=reactive({
  prefix: "avatar"
})

let headers = computed(() => {
  return { Token: getLocalstorage('Token') }
})

let userInfo


const handleAvatarSuccess = (res) => {
  if (res.code === 200){
    imageUrl.value = res.data
    userInfo.avatar = imageUrl.value
    setLocalstorage('UserInfo',userInfo)
    success("上传头像成功")
  }else {
    error(res.msg)
  }
}
let state: UnwrapNestedRefs<{ form: { id: any; phone: any; idCard: any; sex: any; realName: any; avatar:any } }>

onBeforeMount(()=>{
  userInfo = getUserInfo()
  console.log(userInfo)
  imageUrl.value = getUserInfo().avatar
  state = reactive({
    form:{
      realName: userInfo.realName,
      phone: userInfo.phone,
      sex: userInfo.sex,
      idCard: userInfo.idCard,
      id:userInfo.id,
      avatar:userInfo.avatar
    }
  })
  console.log(state.form.realName)
})


const save =()=>{
  update(state.form).then(res=>{
    if (res.code === 200){
      setLocalstorage("UserInfo",JSON.stringify(state.form))
    }
  })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(rawFile)
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    error('Avatar picture must be JPG or PNG format!');
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>


<style scoped>
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
}
</style>