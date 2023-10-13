<template>
  <el-upload
      :multiple="multiple"
      action="#"
      :file-list="urlList"
      list-type="picture-card"
      :auto-upload="false"
      :http-request="uploadFile"
      limit="3"
      ref="upload"
  >
    <el-tooltip
        :auto-close="2000"
        effect="light"
        content="最多上传3张"
        placement="top"
    >
      <el-icon>
        <Plus/>
      </el-icon>
    </el-tooltip>


  </el-upload>

</template>

<script setup>
import {defineEmits, defineProps, reactive, ref, watch} from "vue";
import {uploadImgs} from "@/api/linmour-system/upload";
import {error} from "@/utils/tips";



//接收传过来的参数
const props = defineProps({
  param: {
    type: Boolean,
    required: true
  },
  imgUrl: {
    type: [],
    required: true
  },
  type:{
    type: String,
    required:true
  }
})

//携带参数
const uploadData = reactive({
  prefix: props.type
})


const multiple = ref(true)
const formDate = ref()
const urlList = ref([])
const upload = ref()
const emit = defineEmits(['uploadComplete'])

watch(
    () => props.param,
    (data) => {
      if (data) {
        // 在这里处理 isUpload 变化的逻辑
        formDate.value = new FormData()
        formDate.value.append('prefix',props.type);
        //这个是触发 uploadFile（）用的，把要上传的图片都存入formDate中
        upload.value.submit();
        uploadImgs(formDate.value).then(res => {
          urlList.value.push(...(res.data.toString().split(',')).map(function (url) {
            return {url: url};
          }).filter(function (obj) {
            return obj.url !== "";
          }));
        }).catch(res => {
          error(res.msg)
        }).finally(() => {
          emit("uploadComplete", urlList.value.map(({url}) => url))
        })
      }
    },
    {
      deep: true,
      immediate: true
    }
)

//监听到url改变，返回给调用者
watch(() => urlList.value,
    (data) => {
      urlList.value = (data.toString().split(',')).map(function (url) {
        return {url: url};
      });
    }
)

const uploadFile = (file) => {
  formDate.value.append('file', file.file);
}


</script>

