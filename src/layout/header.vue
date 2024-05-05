<template>
  <div style="height: 60px; line-height: 60px; border-bottom: 1px solid #ccc; background-color: aliceblue">
    <div style="display: flex">
      <div style="width: 200px; color: rgb(41, 47, 53); font-weight: bold; text-align: center; font-size: 20px">
        店铺管理
      </div>

      <div style="flex: 1; display: flex">
        <div style="flex: 1">

<!--          <el-icon @click="changIcon" size="60px">-->
<!--            <component :is="fold.isCollapse?'Fold':'Expand'"></component>-->
<!--          </el-icon>-->
        </div>
        <div style="width: 100px">
          <div style="text-align: right">{{ realName }}</div>
        </div>
        <div style="width: 150px; text-align: right; padding-right: 20px; padding-top: 10px">
          <el-dropdown>
            <el-avatar :size="40" :src="avatar"></el-avatar>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><div @click="router.push('/person')">个人信息</div></el-dropdown-item>
                <el-dropdown-item><div @click="Logout">退出登录</div></el-dropdown-item>

              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {logout} from "../api/linmour-system/merchant";
import {getLocalstorage, removeLocalstorage} from "../utils/localStorage";
import {useRouter} from "vue-router/dist/vue-router";

const userInfo = (JSON.parse(getLocalstorage('UserInfo')));
const avatar = userInfo.avatar
const router = useRouter()
const realName = userInfo.realName
const Logout =() =>{
  logout(userInfo.id).then(res =>{
      removeLocalstorage("Token")
      removeLocalstorage("UserInfo")
      removeLocalstorage("Menus")
      router.push('/login')
  }).catch(err =>{

  })
}


</script>
