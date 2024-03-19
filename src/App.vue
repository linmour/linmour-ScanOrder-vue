<template>
  <RouterView/>
</template>


<script>
// import {getLocalstorage, setLocalstorage} from "@/utils/localStorage";
//
// export default {
//
//   data() {
//     return {
//       // socket参数
//       socket: null,
//       timeout: 10 * 1000, // 45秒一次心跳
//       timeoutObj: null, // 心跳心跳倒计时
//       serverTimeoutObj: null, // 心跳倒计时
//       timeoutnum: null, // 断开 重连倒计时
//       lockReconnect: false, // 防止
//       websocket: null
//     }
//   },
//
//   mounted () {
//     this.initWebSocket();
//   },
//   methods: {
//     initWebSocket() {
//       // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
//       let wsUrl = 'ws://127.0.0.1:12800/websocket/order/'+'1';
//       let a = JSON.parse(getLocalstorage("ShopId")).shopId
//       this.websocket = new WebSocket(wsUrl,[a]);
//       this.websocket.onopen = this.websocketonopen;
//       this.websocket.onerror = this.websocketonerror;
//       this.websocket.onmessage = this.setOnmessageMessage;
//       this.websocket.onclose = this.websocketclose;
//       // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
//       // window.onbeforeunload = that.onbeforeunload
//     },
//     start() {
//       console.log('start');
//       //清除延时器
//       this.timeoutObj && clearTimeout(this.timeoutObj);
//       this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
//       this.timeoutObj = setTimeout(() => {
//         if (this.websocket && this.websocket.readyState === 1) {
//           let actions = {"test":"12345"};
//           this.websocket.send(JSON.stringify(actions));//发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
//         } else {
//           this.reconnect();
//         }
//         //定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
//         this.serverTimeoutObj = setTimeout(() => {
//           this.websocket.close();
//         }, this.timeout)
//       }, this.timeout)
//     },
//     reset() { // 重置心跳
//       // 清除时间
//       clearTimeout(this.timeoutObj);
//       clearTimeout(this.serverTimeoutObj);
//       // 重启心跳
//       this.start();
//     },
//     // 重新连接
//     reconnect() {
//       if (this.lockReconnect) return
//       this.lockReconnect = true;
//       //没连接上会一直重连，设置延迟避免请求过多
//       this.timeoutnum && clearTimeout(this.timeoutnum);
//       this.timeoutnum = setTimeout(() => {
//         this.initWebSocket();
//         this.lockReconnect = false;
//       }, 5000)
//     },
//     async setOnmessageMessage(event) {
//       // console.log(event.data, '获得消息');
//       this.reset();
//       // 自定义全局监听事件
//       window.dispatchEvent(new CustomEvent('onmessageWS', {
//         detail: {
//           data: event.data
//         }
//       }))
//       // //发现消息进入    开始处理前端触发逻辑
//       // if (event.data === 'success' || event.data === 'heartBath') return
//     },
//     websocketonopen() {
//       //开启心跳
//       this.start();
//       console.log("WebSocket连接成功!!!"+new Date()+"----"+this.websocket.readyState);
//       clearInterval(this.otimer);//停止
//     },
//     websocketonerror(e) {
//       console.log("WebSocket连接发生错误" );
//       console.log(e)
//     },
//     websocketclose(e) {
//       this.websocket.close();
//       clearTimeout(this.timeoutObj);
//       clearTimeout(this.serverTimeoutObj);
//       console.log("WebSocket连接关闭");
//       console.log(e)
//
//     },
//     websocketsend(messsage) {
//       that.websocket.send(messsage)
//     },
//     closeWebSocket() { // 关闭websocket
//       that.websocket.close()
//     },
//     //  // 收到消息处理
//     // getSocketData (res) {
//     // 	if (res.detail.data === 'success' || res.detail.data === 'heartBath') return
//     // 	// ...业务处理
//     // }
//   },
// }

</script>

