<template>
  <div>
    <div style="height: 60px; line-height: 60px; border-bottom: 1px solid #ccc; background-color: aliceblue">
      <div style="display: flex">
        <div style="width: 200px; color: rgb(41, 47, 53); font-weight: bold; text-align: center; font-size: 20px">
          店铺管理
        </div>

        <div style="flex: 1; display: flex">
          <div style="flex: 1">
            中间
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

    <div style="display: flex">
      <div style="width: 200px; min-height: calc(100vh - 60px); border-right: 1px solid #ccc">
        <el-menu
            router
            default-active="/"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <location/>
              </el-icon>
              <span>Navigator One</span>
            </template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon>
              <icon-menu/>
            </el-icon>
            <span>Navigator Two</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <el-icon>
              <document/>
            </el-icon>
            <span>Navigator Three</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon>
              <setting/>
            </el-icon>
            <span>Navigator Four</span>
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
  Location,
  Setting,
} from '@element-plus/icons-vue'
import { logout } from '../api/linmour-account/merchant'
import {getLocalstorage, removeLocalstorage} from "../utils/localStorage";
import { useRouter } from 'vue-router'



const userInfo = (JSON.parse(getLocalstorage('UserInfo')));
const avatar = userInfo.avatar
const router = useRouter()
const realName = userInfo.realName



const Logout =() =>{
  logout(userInfo.id).then(res =>{
    if (res.code === 200){
      removeLocalstorage("Token")
      removeLocalstorage("UserInfo")
      router.push('/login')
    }

  }).catch(err =>{
    console.log(err)
  })
}

</script>
