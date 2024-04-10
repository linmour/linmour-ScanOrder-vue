import {ref} from 'vue';
import {getLocalstorage} from "../utils/localStorage";

export const socket = ref(null);
export const timeout = ref(10 * 1000);
export const timeoutObj = ref(null);
export const serverTimeoutObj = ref(null);
export const lockReconnect = ref(false);
export const websocket = ref(null);
export const timeoutnum = ref(null)


export const initWebSocket = () => {
    let wsUrl = 'ws://127.0.0.1:12800/websocket/order/' + JSON.parse(getLocalstorage("ShopId")).shopId;
    websocket.value = new WebSocket(wsUrl);
    websocket.value.onopen = websocketonopen;
    websocket.value.onerror = websocketonerror;
    websocket.value.onmessage = setOnmessageMessage;
    websocket.value.onclose = websocketclose;


}

export const start = () => {
    console.log('start');
    clearTimeout(timeoutObj.value);
    clearTimeout(serverTimeoutObj.value);
    timeoutObj.value = setTimeout(() => {
        if (websocket.value && websocket.value.readyState === 1) {
            let actions = {"test": "12345"};
            websocket.value.send(JSON.stringify(actions));
        } else {
            reconnect();
        }
        serverTimeoutObj.value = setTimeout(() => {
            websocket.value.close();
        }, timeout.value);
    }, timeout.value);
}

export const reset = () => {
    clearTimeout(timeoutObj.value);
    clearTimeout(serverTimeoutObj.value);
    start();
}

export const reconnect = () => {
    if (lockReconnect.value) return;
    lockReconnect.value = true;
    timeoutnum.value && clearTimeout(timeoutnum.value);
    timeoutnum.value = setTimeout(() => {
        initWebSocket();
        lockReconnect.value = false;
    }, 5000);
}

export const setOnmessageMessage = async (event) => {
    reset();
    window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
            data: event.data
        }
    }));
}


export const websocketonopen = () => {
    start();
    console.log("WebSocket连接成功!!!" + new Date() + "----" + websocket.value.readyState);
    // clearInterval(otimer.value);
}

export const websocketonerror = (e) => {
    console.log("WebSocket连接发生错误");
    console.log(e);
}

export const websocketclose = (e) => {
    websocket.value.close();
    clearTimeout(timeoutObj.value);
    clearTimeout(serverTimeoutObj.value);
    console.log("WebSocket连接关闭");
    console.log(e);
}

export const websocketsend = (messsage) => {
    websocket.value.send(messsage);

}

export const closeWebSocket = () => {
    websocket.value.close();
}
