<template>


  <el-upload
      multiple
      action="#"
      :file-list="data.urlList"
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

<script>
import axios from "axios";
import {getLocalstorage} from "@/utils/localStorage";
import {Plus} from '@element-plus/icons-vue'

export default {
  components: {Plus},
  //接收传过来的参数
  props: {
    param: {
      type: Boolean,
      required: true,
    },
    imgUrl: {
      type: [],
      requery: true
    }
  },
  name: "upload",
  data() {
    return {
      data: {
        multiple: true,
        formDate: "",
        urlList: [],

      },
    }
  },

  watch: {
    param(newValue, oldValue) {
      if (newValue) {
        console.log('上传图片')
        // 在这里处理 isUpload 变化的逻辑
        this.formDate = new FormData()
        this.$refs.upload.submit();
        this.formDate.append('shopId', JSON.parse(getLocalstorage("ShopId")).shopId);
        // console.log(this.formDate.getAll("file"))
        axios.post("http://127.0.0.1:5173/api/product/product/upload_product", this.formDate).then(res => {
          this.data.urlList.push(...(res.data.toString().split(',')).map(function (url) {
            return { url: url };
          }).filter(function (obj) {
            return obj.url !== "";
          }));
          this.data.urlList
          console.log("====")
          console.log(this.data.urlList)

        }).catch(res => {
          console.log(res)
        }).finally(() => {

          this.$emit("uploadComplete", this.data.urlList.map(({url}) => url))
        })
      }
    },
    //监听到url改变，返回给调用者
    imgUrl(newValue, oldValue){
      this.data.urlList = (newValue.toString().split(',')).map(function (url) {
        return {url: url};
      });
      console.log("aaaa")
      console.log(this.data.urlList)
    }

  },

  methods: {
    uploadFile(file) {
      this.formDate.append('file', file.file);
    },

  },
  mounted() {

  }
}

</script>

<style>


</style>
