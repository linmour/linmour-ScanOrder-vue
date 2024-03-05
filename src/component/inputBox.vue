<template>
  <div v-if="show" class="mask">
    <div class="dlg-input-box flex flex-col" style="background-color: #cdd0d6">
      <div class="flex flex-space-between full-width">
        <div class="font-bold">{{caption}}</div>
        <div class="pointer" @click="close"><img class="logo-22"/></div>
      </div>
      <div class="margin-top-xl flex flex-col">
        <input class="input-box" placeholder="请输入" v-model="inputValue" ref="getfocus"/>
      </div>
      <div class="flex flex-end margin-top-xl">
        <div  style="width:80px;background-color: #b88230" @click="cancelClick">取消</div>
        <div  style="width:80px;background-color: #79bbff" @click="confirmClick">确定</div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'InputBox',//组件递归必须有name属性 不然无法递归
  props: {
    caption:{},
    value:{},
    show: {},
  },

  watch: {
    show(val){
      if (val == true) {
        this.$nextTick(() => {
          this.$refs.getfocus.focus();
        })
      }
    },
    value(val){
      this.inputValue = val;
    }

  },
  data() {
    return {
      showMessage:false,
      inputValue:'',
      msgText:''
    }
  },

  methods: {

    close() {
      this.$emit('close');
    },
    confirmClick() {
      if (this.inputValue == "") {
        this.msgText = "内容未填写";
        this.showMessage = true;
      } else {
        this.$emit('confirm', this.inputValue);
      }

    },
    cancelClick() {
      this.$emit('cancel');
    }

  }
}
</script>

<style>
.dlg-input-box {
  border-radius: 5px;
  width: 350px;
  height: 160px;
  background-color: #fff;
  padding: 30px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
