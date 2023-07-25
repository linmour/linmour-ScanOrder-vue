<template>
  <div>
    <HeaderBar/>
    <div style="display: flex" >
      <Menu/>
      <div style="flex: 1; padding: 10px">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {RouterView} from 'vue-router'

import HeaderBar from '../layout/header.vue';
import Menu from "../layout/menu.vue";


</script>
