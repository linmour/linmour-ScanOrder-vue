<template>
  <div class="common-layout" v-loading="loading">
    <el-container>

      <el-main>
        <div  >
          <el-card style="width: 60%;height: 700px; margin: 80px auto">
            <el-form style="width: 70%; margin: 60px auto" label-width="80px">
              <div style="text-align: center">
                <el-upload
                    class="avatar-uploader"
                    action="http://127.0.0.1:5173/api/account/merchant/upload_picture"
                      :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload"
                    :on-progress="onProgress"
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
              <div style="margin: 110px; width: 800px; " >
                <el-form-item label="名字">
                  <el-input disabled class="width70" v-model="state.form.realName"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                  <el-input  class="width70" v-model="state.form.phone" placeholder="电话号码"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select  style="width: 150px" v-model="state.form.sex">
                    <el-option :key="1" label="男" :value="1" />
                    <el-option :key="0" label="女" :value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item label="身份证">
                  <el-input disabled class="width70" style="margin-top: 0" v-model="state.form.idCard" ></el-input>
                  <el-button style="margin-left: 5px" :icon="View" @click="viewPic" circle />
                </el-form-item>
                  <div style="display: flex; align-items: stretch; margin: 50px;">
                    <div>
                      <el-upload
                          ref="upload"
                          action="http://127.0.0.1:5173/api/account/merchant/ocr"
                          :limit="1"
                          :exceed="handleExceed"
                          :show-file-list="false"
                          :on-success="handleIdCardSuccess"
                          :before-upload="beforeUpload"
                          :headers="headers"
                          name="multipartFile"
                          style="width: 100px"
                      >
                        <template #trigger>
                          <el-tooltip
                              :auto-close="2000"
                              effect="light"
                              content="上传身份证正面"
                              placement="top"
                          >
                            <el-button type="warning">改绑身份证</el-button>
                          </el-tooltip>
                        </template>
                      </el-upload>
                    </div>
                    <el-button style="margin-left: 25px" type="primary" @click="save">保存</el-button>
                  </div>

              </div>
            </el-form>
          </el-card>
        </div>
      </el-main>
<!--      身份证展示-->
      <el-dialog v-model="isView" style="height: 0px; width: 420px">
        <div v-if="isView" class="demo-image__preview">
          <el-image
              style="width: 300px; height: 300px; margin: 70px;"
              :src="state.form.idCardUrl"
              :zoom-rate="1.2"
              :preview-src-list="srcList"
              :initial-index="4"
              fit="contain"
          />
        </div>
      </el-dialog>
      <!-- 加载进度条的样式 -->
<!--      <div v-if="loading" class="bacc">-->
<!--        <div class="jindutiao">-->
<!--          <el-progress type="circle" :percentage="curPercentage" :width="80" class="progressCircle"></el-progress>-->
<!--        </div>-->
<!--      </div>-->

    </el-container>
  </div>


</template>

<script lang="ts" setup>
import {computed, nextTick, onBeforeMount, reactive, ref, UnwrapNestedRefs} from 'vue'
import { Plus,View } from '@element-plus/icons-vue'
import {getLocalstorage, getUserInfo, setLocalstorage} from "@/utils/localStorage";
import {error, success} from "@/utils/tips";
import { update } from "@/api/linmour-account/merchant";
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const srcList = [];
const imageUrl = ref('')
const uploadData=reactive({
  prefix: ""
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
const upload = ref<UploadInstance>()
const handleIdCardSuccess = (res,file) => {
  if (res.code === 200){
    loading.value = false
    userInfo.idCardUrl = res.data.idCardUrl
    srcList.length=0
    srcList.push(userInfo.idCardUrl)
    userInfo.idCard = res.data.idCard
    state.form = { ...userInfo };
    setLocalstorage('UserInfo',userInfo)
    success("身份证上传成功")
  }else {
    error(res.msg)
  }
  //清除上传文件列表，要不然上传一次后就不能上传了
  upload.value!.clearFiles()
}


let state: UnwrapNestedRefs<{ form?: { id?: any; phone?: any; idCard?: any; sex?: any; realName?: any; avatar?: any; idCardUrl?: any } }> = reactive({ form: {} });

onBeforeMount(() => {
  userInfo = getUserInfo();
  imageUrl.value = userInfo.avatar;
  state.form = { ...userInfo };
  console.log(state.form.idCardUrl)
  srcList.push(state.form.idCardUrl);
});


const save =()=>{
  upload.value!.submit()
  update(state.form).then(res=>{
    if (res.code === 200){
      setLocalstorage("UserInfo",JSON.stringify(state.form))
    }
  })
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  loading.value = true
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    error('Avatar picture must be JPG or PNG format!');
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}


const curPercentage = ref(0)
const loading = ref(false)
// 文件上传时的钩子函数,获取上传进度
const onProgress = (event, file, fileList) => {
  let num = ((event.loaded / event.total) * 100) | 0; //百分比
  curPercentage.value = num;
  if (curPercentage.value == 100) {
    loading.value = false;
    curPercentage.value = 0;
  }
}




const isView = ref(false)
const viewPic = () => {
  isView.value = true
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


.width70 {
  width: 40%;
  margin-right: 5px
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

/* 进度条样式 */
.bacc {
  /*bacc是灰色的大背景*/
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
}
/*这个类的作用是把进度条放到水平垂直居中的位置*/
.jindutiao {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  margin-left: -75px;
  margin-top: -75px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/*更改默认的文字样式*/
.progressCircle ::v-deep .el-progress__text {
  color: #fff;
}
</style>