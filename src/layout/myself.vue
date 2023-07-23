<template>
  <div>
    <HeaderBar/>

    <div style="display: flex" >
      <div style="width: 200px; min-height: calc(100vh - 60px); border-right: 1px solid #ccc" >
        <el-menu
            router
            :default-active= path
            class="el-menu-vertical-demo"

        >
          <el-menu-item index="home"   @click="a">
            <el-icon><icon-menu/></el-icon>
            <span>我的店铺</span>
          </el-menu-item>
          <el-menu-item index="open"   @click="a">
            <el-icon><icon-menu/></el-icon>
            <span>开新店</span>
          </el-menu-item>
          <el-menu-item index="person"   @click="b">
            <el-icon><document/></el-icon>
            <span>个人信息</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div style="flex: 1; padding: 10px">
        <RouterView/>
      </div>
    </div>


  </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import {
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
import HeaderBar from '../layout/header.vue';




let path ='home'

const a = () =>{
  path = 'home'
}

const b = () =>{
  path = 'person'
}


</script>
