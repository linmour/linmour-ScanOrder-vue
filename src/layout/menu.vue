<template>
  <div style="width: 200px; min-height: calc(100vh - 60px); border-right: 1px solid #ccc">
    <el-menu
        router
        default-active="home"
    >
      <div v-for="item in menus" :key="item.id">
        <div v-if="item.parentId === 0 && item.path !== ''">
          <el-menu-item :index="item.path">
            <el-icon v-if="item.icon">
              <component :is="'Fold'"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </div>

        <div v-else-if="item.parentId === 0">
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <el-icon v-if="item.icon">
                <component :is=""></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <div v-for="subItem in item.children" :key="subItem.id">
              <el-menu-item :index="subItem.path">

                <template #title>
                  <el-icon v-if="subItem.icon">
                    <component :is=""></component>
                  </el-icon>
                  <span>{{ subItem.name }}</span>
                </template>
              </el-menu-item>
            </div>
          </el-sub-menu>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script setup>


import {onMounted, ref, watch} from "vue";
import {getLocalstorage, setLocalstorage} from "../utils/localStorage";
import {getMenus} from "../api/linmour-system/menu";


const menus = ref()
const toMenu = () =>{
  console.log("-----")
}

onMounted(async () => {

  if (getLocalstorage("Menus") === '') {
    const res = await getMenus();
    setLocalstorage("Menus", res);
  }
  menus.value = JSON.parse(getLocalstorage("Menus"));
})


</script>
