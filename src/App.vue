<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-app id="inspire">
    <v-content>
      <v-card height="90" width="100%" class="text-center white--text" color="blue darken-4">
        <h3 class="pt-5" style="font-size: 35px;">Ventas360</h3>
      </v-card>
    </v-content>

    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer"  permanent app >
      <template>
        <v-list-item :to="{ name: 'home'}">
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-title>
            Inicio
          </v-list-item-title>
          </v-list-item>
          <v-list-group>
            <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>
              Almacén
              </v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'categorias'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Gestión de Categorías
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'articulos'}">
            <v-list-item-action>
              <v-icon>table_chart</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Gestión de Artículos
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </v-list-group>
          <v-list-group>
            <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>
                Ventas
              </v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'ventas'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Gestion de Proveedores
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'clientes'}">
            <v-list-item-action>
              <v-icon>table_chart</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Gestión de Clientes
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </v-list-group>
          <v-list-group>
            <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>
                Usuarios
              </v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'roles'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Gestión de Roles
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'usuarios'}">
            <v-list-item-action>
              <v-icon>table_chart</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Gestión de Usuarios
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </v-list-group>
          <v-list-group>
            <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>
                Consultas
              </v-list-item-title>
            </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'compras'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consultar Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          <v-list-item :to="{ name: 'consultaVentas'}">
            <v-list-item-action>
              <v-icon>table_chart</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Consultar Ventas
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </v-list-group>
      </template>
    </v-navigation-drawer>
    <v-content>
      <router-view/>
    </v-content>
<v-footer>
    <v-card height="30" width="100%" class="text-center white--text" color="blue
    darken-4">
      <h3> ISyTE - FIAD-UABC - {{ new Date().getFullYear() }} </h3>
    </v-card>
</v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
