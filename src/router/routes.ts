import { RouteConfig } from "vue-router";
//Components
import Layout from "../views/Layout.vue";

export const constantRoutes: Array<RouteConfig> = [
    {
        path: "/login",
        name: "Login",
        meta: { title: "Login" },
        component: () =>
            import("../views/Login.vue")
    }

];

export const asyncRoutes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Layout",
        component: Layout,
        meta: { title: "Layout" },
        redirect: "/dashboard",
        children: [
            {
                path: "/dashboard",
                name: "Dashboard",
                meta: { title: "Dashboard", icon: "el-icon-house" },
                component: () =>
                    import(/* webpackChunkName: "dashboard" */ "../views/Dashboard/index.vue")

            },
            {
                path: "/users",
                name: "Users",
                meta: { title: "Users", icon: "el-icon-user" },
                component: () =>
                    import(/* webpackChunkName: "about" */ "../views/Users/index.vue")

            },
            {
                path: "/vocabulary",
                name: "Vocabulary",
                meta: { title: "Vocabulary", icon: "el-icon-folder" },
                component: () => import("../views/Vocabulary/index.vue"),
                children: [{
                    path: "/vocabulary/words",
                    name: "Words",
                    meta: { title: "Words", },
                    component: () => import(/* webpackChunkName: "words" */ "../views/Vocabulary/Words/index.vue")
                }, {
                    path: "/vocabulary/books",
                    name: "Books",
                    meta: { title: "Books", },
                    component: () => import(/* webpackChunkName: "books" */ "../views/Vocabulary/Books/index.vue")
                }]
            },
            {
                path: "/admins",
                name: "Admins",
                meta: { title: "Administrators", icon: "el-icon-user" },
                component: () =>
                    import(/* webpackChunkName: "about" */ "../views/Admins/index.vue")

            },
            {
                path: "/roles",
                name: "Roles",
                meta: {
                    title: "Roles", icon: "el-icon-connection"
                },
                component: () =>
                    import(/* webpackChunkName: "about" */ "../views/Roles/index.vue")

            },

        ]
    },

];




export const doFilter = (target: RouteConfig[], filter: string[]) => {
    return target.filter(route => {
        const matched = filter.some(name => route.name == name);
        if (route.children) {
            route.children = doFilter(route.children, filter)
        }
        return matched
    })
}
