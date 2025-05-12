import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { i18n } from "./locales/i18n";
import HomeView from "./views/HomeView.vue";
import "./assets/main.css";

const routes = [
  { path: "/", component: HomeView, props: true },
  { path: "/en", component: HomeView, props: true },
  { path: "/uk", component: HomeView, props: true },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
