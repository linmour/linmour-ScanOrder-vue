<template>


</template>
<script>


export default {
  data() {
    return {
      formData: {},
    }
  },
  methods: {
    //检测文件变动获取文件
    fileChange(file, fileList) {
      this.fileList = fileList;
    },
    //检测文件删除
    fileRemove(file, fileList) {
      this.fileList = fileList;
    },
    //手动上传图片
    submitUpload() {
      console.log("this.fileList", this.fileList)
      let formData = new FormData();  //  将文件封装进FormData
      this.fileList.forEach(file => {
        formData.append('file', file.raw)
      })
      // formData.append("属性名","1`111") //附带数据
      console.log(formData.getAll("file"))
      console.log(formData)
      // 调用上传接口
      uploadImage(formData).then((res) => {
        //手动上传无法触发成功或失败的钩子函数，因此需要手动调用
      }, (err) => {
      })
    }

  }
}

</script>
