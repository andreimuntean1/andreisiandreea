import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { i18n } from "./locales/i18n";
import HomeView from "./views/HomeView.vue";
import "./assets/main.css";

/**
 * Defines the application's route configuration.
 *
 * Each route object specifies a `path` that maps to a specific URL,
 * a `component` that will be rendered when the route is matched,
 * and optional `props` to be passed to the component.
 *
 * Routes:
 * - `/`: Renders the `HomeView` component with props enabled, in romaninan.
 * - `/en`: Renders the `HomeView` component with props enabled, in english.
 * - `/uk`: Renders the `HomeView` component with props enabled, in ukrainian.
 * - `/:pathMatch(.*)*`: A catch-all route that redirects to `/`.
 *
 * Notes:
 * - The `:pathMatch(.*)*` syntax is a Vue Router feature used to match
 *   any path that doesn't match the defined routes.
 * - The `redirect` property ensures unmatched routes are redirected to `/`.
 */
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
