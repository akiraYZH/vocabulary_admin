import { RouteConfig } from "vue-router";
//Components
import Layout from "../views/Layout.vue";

export const constantRoutes: Array<RouteConfig> = [
    {
        path: "/login",
        name: "Login",
        component: () =>
            import("../views/Login.vue")
    }

];

export const asyncRoutes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Layout",
        component: Layout,
        meta:{title:"Layout"},
        children: [
            {
                path: "/test",
                name: "Test",
                meta:{title:"Test"},
                component: Layout
            },
            {
                path: "/about",
                name: "About",
                meta:{title:"About"},
                component: () =>
                    import(/* webpackChunkName: "about" */ "../views/About.vue"),
                children: [
                    {
                        path: "/about/home",
                        name: "Test",
                        meta:{title:"Home"},
                        component: Layout
                    },
                    {
                        path: "/about/home2",
                        name: "About2",
                        meta:{title:"About2"},
                        component: () =>
                            import(/* webpackChunkName: "about" */ "../views/About.vue"),
                        children: [
                            {
                                path: "/test/test1",
                                name: "Test",
                                meta:{title:"Test2"},
                                component: Layout
                            },
                            {
                                path: "/about/test2",
                                name: "About",
                                meta:{title:"Test3"},
                                component: () =>
                                    import(/* webpackChunkName: "about" */ "../views/About.vue")
                            }
                        ]
                    }
                ]
            }
        ]
    },

];




export const doFilter = (target: RouteConfig[], filter: string[]) => {
    return target.filter(route => {
        const matched = filter.some(name => route.name == name);
        if(route.children){
            route.children = doFilter(route.children, filter)
        }
        return matched
    })
}
