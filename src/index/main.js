import {createApp} from 'vue'
import {createPinia} from 'pinia'
import VueSimpleAlert from "vue3-simple-alert";
import FlashMessage from '@smartweb/vue-flash-message'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import {createRouter, createWebHashHistory} from 'vue-router'
import App from '@/index/App.vue'
import WeatherPage from "@/components/WeatherPage.vue";

const routes = [
    {path: '/weather', component: WeatherPage, name: "weather"},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
const store = createPinia()

const app = createApp(App)

app.use(FlashMessage)
app.use(VueSimpleAlert)
app.use(router)
app.use(store)
app.mount('#app')