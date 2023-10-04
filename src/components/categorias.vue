<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-else -->
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table :headers="headers" :items="categorias" :search="search" sort-by="nombreCategorias" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <!---->
        <v-toolbar-title class="text-center ">Categorias</v-toolbar-title>
          <v-divider class="mx-4" inset-vertical></v-divider>
          <v-spacer></v-spacer>

          <!--Búsqueda de categorias-->
          <v-text-field class="text-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset-vertical></v-divider>
          <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nueva Categoria
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{formTitle}}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="nombreCategorias" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="Grabar">
                Grabar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="adModal" max-width="350px">
          <v-card>
            <v-card-title v-if="adAccion==1">¿Activar Categoria?</v-card-title>
            <v-card-title v-if="adAccion==2">¿Desactivar Categoria?</v-card-title>

            <v-card-text>
              Vas a
                <span v-if="adAccion==1"> Activar </span>
                <span v-if="adAccion==2"> Desactivar </span>
                la categoria {{ adNombre }},
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="dark darken-1" @click="ActivarDesactivarCerrar"> Cerrar </v-btn>
                <v-btn v-if="adAccion==1" color="success darken-1" @click="activar"> Activar </v-btn>
                <v-btn v-if="adAccion==2" class="white--text" color="red darken-1" @click="desactivar"> Desactivar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>

      <!--Íconos de ESTADO-->
      <template v-if="item.estado">
        <v-icon medium color="green darker-2" class="mr-2" @click="modalActivarDesactivar(2,item)"> check_circle</v-icon>
      </template>
      <template v-else="item.estado">
        <v-icon medium color="red darker-2" class="mr-2" @click="modalActivarDesactivar(1,item)"> cancel</v-icon>
      </template>

    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    search: '',
    categorias: [], /* se creo un arreglo vacío */
    adModal: 0,
    adAccion: 0,
    adNombre: '',
    adIdCategorias: '',

    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Nombre Categorias', value: 'nombreCategorias', align: 'start', sortable: true },
      { text: 'Descripcion', value: 'descripcion', sortable: true },
      { text: 'Accion', value: 'actions', sortable: false }
    ],

    validar () {
      this.valida = 0
      this.ValidaMensajes = []

      if (this.nombreCategorias.length < 3 || this.nombreCategorias.length > 100) {
        this.ValidaMensajes.push('El nombre de la categoria debe tener más de 3 caracteres y menos de 100')
      }
      if (this.ValidaMensajes.length) { this.valida = 1 }

      return this.valida
    },

    modalActivarDesactivar (accion, item) {
      this.adModal = 1
      this.adIdCategorias = item.idCategorias
      this.adNombre = item.nombreCategorias

      if (accion === 1) {
        this.adAccion = 1
      } else if (accion === 2) {
        this.adAccion = 2
      } else {
        this.adAccion = 0
      }
    },

    editedIndex: -1,
    editedItem: {
      idCategorias: '',
      nombreCategorias: '',
      descripcion: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Categoria' : 'Editar Categoria'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.ListadoCategorias()
    this.initialize()
  },

  methods: {
    ListadoCategorias () {
      const Lista = this
      axios.get('api/Categorias/ListarCategorias').then(function (response) {
        console.log(response)
        Lista.categorias = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    activar () {
      const me = this
      axios.put('api/Categorias/ActivarCategoria/' + this.adIdCategorias, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = ''
        me.adIdCategorias = 0
        me.close()
        me.ListadoCategorias()
      }).catch(function (error) {
        console.log(error)
      })
    },

    desactivar () {
      const me = this
      axios.put('api/Categorias/DesactivarCategoria/' + this.adIdCategorias, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = ''
        me.adIdCategorias = 0
        me.close()
        me.ListadoCategorias()
      }).catch(function (error) {
        console.log(error)
      })
    },

    ActivarDesactivarCerrar () {
      this.adModal = 0
    },

    initialize () {

    },

    editItem (item) {
      this.idCategorias = item.idCategorias
      this.nombreCategorias = item.nombreCategorias
      this.descripcion = item.descripcion
      this.editedIndex = 1
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    Grabar () {
      if (this.validar()) {
        return
      }
      if (this.editedIndex > -1) {
        const me = this
        axios.put('api/Categorias/ModificarCategorias',
          {
            idCategorias: me.idCategorias,
            nombreCategorias: me.nombreCategorias,
            descripcion: me.descripcion
          }).then(function (response) {
          me.close()
          me.ListadoCategorias()
          me.LimpiarModal()
        }).catch(function (error) {
          console.log(error)
        })

        // Sección para editar los datos
      } else {
        // Sección para Guardar los datos de una nueva categoria
        const me = this
        axios.post('api/Categorias/InsertarCategoria',
          {
            nombreCategorias: me.nombreCategorias,
            descripcion: me.descripcion
          }).then(function (response) {
          me.close()
          me.ListadoCategorias()
          me.LimpiarModal()
        }).catch(function (error) {
          console.log(error)
        })
      }
      this.close()
    },

    LimpiarModal () {
      this.idCategorias = ''
      this.nombreCategorias = ''
      this.descripcion = ''
    }

  }
}
</script>
