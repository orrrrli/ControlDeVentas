import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import categoria from '../components/Almacen/categorias.vue'
import articulos from '../components/Almacen/articulos.vue'
import ventas from '../components/Ventas/ventas.vue'
import clientes from '../components/Ventas/clientes.vue'
import roles from '../components/Usuarios/roles.vue'
import usuarios from '../components/Usuarios/usuarios.vue'
import compras from '../components/Consultas/compras.vue'
import consultaVentas from '../components/Consultas/consultaVentas.vue'
import Ingresos from '../components/Compras/Ingresos.vue'

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
  },
  {
    path: '/Ingresos',
    name: 'Ingresos',
    component: Ingresos
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
