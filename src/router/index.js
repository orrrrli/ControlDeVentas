import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import categoria from '../components/categorias.vue'
import articulos from '../components/articulos.vue'
import ventas from '../components/ventas.vue'
import clientes from '../components/clientes.vue'
import roles from '../components/roles.vue'
import usuarios from '../components/usuarios.vue'
import compras from '../components/compras.vue'
import consultaVentas from '../components/consultaVentas.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: articulos
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: categoria
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: ventas
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: clientes
  },
  {
    path: '/roles',
    name: 'roles',
    component: roles
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: usuarios
  },
  {
    path: '/compras',
    name: 'compras',
    component: compras
  },
  {
    path: '/consultaVentas',
    name: 'consultaVentas',
    component: consultaVentas
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
