<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable array-callback-return -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/valid-v-else -->
<template>
  <v-data-table :headers="headers" :items="articulos" :search="search" sort-by="nombreArticulos" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <!---->
        <v-toolbar-title class="text-center ">Artículos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!--Búsqueda de categorias-->
          <v-text-field class="text-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
``
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Artículo
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
                    <v-select v-model="idCategoria" :items="categorias" label="Categoria"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="codigoArticulo" label="Código"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="nombreArticulo" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="precioArticulo" label="Precio de Articulo"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="stock" label="Stock"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="descripcionArticulo" label="Descripción"></v-text-field>
                  </v-col>
                  <div v-if="ValidaMensajes.length > 0">
                    <ul>
                      <li v-for="message in ValidaMensajes" :key="message" class="red--text">{{ message }}</li>
                    </ul>
                  </div>
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
            <v-card-title v-if="adAccion==1">¿Activar Artículo?</v-card-title>
            <v-card-title v-if="adAccion==2">¿Desactivar Artículo?</v-card-title>

            <v-card-text>
              Vas a
                <span v-if="adAccion==1"> Activar </span>
                <span v-if="adAccion==2"> Desactivar </span>
                el Artículo {{ adNombre }}
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
      <v-icon medium @click="deleteItem(item)">
        mdi-delete
      </v-icon>
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
    valida: 0,
    ValidaMensajes: [],

    articulos: [], /* se creo un arreglo vacío */
    IdCategorias: '',
    categorias: [],
    adModal: 0,
    adAccion: 0,
    adNombre: '',
    adIdArticulo: '',

    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Nombre Artículo', value: 'nombreArticulo', align: 'start', sortable: true },
      { text: 'Código', value: 'codigoArticulo', align: 'start', sortable: true },
      { text: 'Categoria', value: 'nombreCategoria', align: 'start', sortable: true },
      { text: 'Precio', value: 'precioArticulo', align: 'start' },
      { text: 'Id Categoria', value: 'idCategorias', align: 'start' },
      { text: 'Descripcion', value: 'descripcionArticulo', sortable: true },
      { text: 'Stock', value: 'stock' },
      { text: 'Accion', value: 'actions', sortable: false }
    ],

    editedIndex: -1,
    editedItem: {

      idArticulo: '',
      idCategorias: 0,
      codigoArticulo: '',
      nombreArticulo: '',
      precioArticulo: 0,
      stock: 0,
      descripcionArticulo: '',
      estado: true

    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Artículo' : 'Editar Artículo'
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
    this.ListadoArticulos()
    this.SeleccionarCategoria()
    this.initialize()
  },

  methods: {
    SeleccionarCategoria () {
      const me = this
      let LstCategorias = []

      axios.get('api/Categorias/SeleccionaCategoria').then(function (response) {
        LstCategorias = response.data
        // eslint-disable-next-line array-callback-return
        LstCategorias.map(function (c) {
          me.categorias.push({ text: c.nombreCategorias, value: c.idCategorias })
        })
      }).catch(function (error) {
        console.log(error)
      })
    },

    ListadoArticulos () {
      const Lista = this
      axios.get('api/Articulos/ListarArticulos').then(function (response) {
        console.log(response)
        Lista.articulos = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    activar () {
      const me = this
      axios.put('api/Articulos/ActivarArticulos/' + this.adIdArticulo, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = ''
        me.adIdArticulo = 0
        me.close()
        me.ListadoArticulos()
      }).catch(function (error) {
        console.log(error)
      })
    },

    desactivar () {
      const me = this
      axios.put('api/Articulos/DesactivarArticulos/' + this.adIdArticulo, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = ''
        me.adIdArticulo = 0
        me.close()
        me.ListadoArticulos()
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
      this.idArticulo = item.idArticulos
      this.idCategoria = item.idCategorias
      this.nombreArticulo = item.nombreArticulo
      this.codigoArticulo = item.codigoArticulo

      this.precioArticulo = item.precioArticulo
      this.descripcionArticulo = item.descripcionArticulo
      this.stock = item.stock
      this.estado = item.estado

      this.editedIndex = 1
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.articulos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      const me = this
      // Elimina el elemento de la lista roles en el índice especificado
      this.articulos.splice(this.editedIndex, 1)

      // Realiza la solicitud de eliminación utilizando Axios
      axios.delete(`api/Articulos/BorrarArticulo/${this.editedItem.idArticulos}`)
        .then(response => {
          // Procesa la respuesta si es necesario
          me.ListadoRoles()
        })
        .catch(error => {
          // Maneja errores si es necesario
          console.log(error)
        })

      // Cierra el diálogo de eliminación
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.LimpiarModal()
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
        axios.put('api/Articulos/ModificarArticulos',
          {
            idArticulos: me.idArticulo,
            idCategorias: me.idCategoria,
            codigoArticulo: me.codigoArticulo,
            nombreArticulo: me.nombreArticulo,
            precioArticulo: me.precioArticulo,
            stock: me.stock,
            descripcionArticulo: me.descripcionArticulo,
            estado: true

          }).then(function (response) {
          me.close()
          me.ListadoArticulos()
        }).catch(function (error) {
          console.log(error)
        })
        me.LimpiarModal()
        // Sección para editar los datos
      } else {
        // Sección para Guardar los datos de una nueva categoria
        const me = this
        axios.post('api/Articulos/InsertarArticulo',
          {
            idCategorias: parseInt(me.idCategoria),
            codigoArticulo: me.codigoArticulo,
            nombreArticulo: me.nombreArticulo,
            precioArticulo: parseFloat(me.precioArticulo),
            stock: parseInt(me.stock),
            descripcionArticulo: me.descripcionArticulo,
            estado: true

          }).then(function (response) {
          me.close()
          me.ListadoArticulos()
          me.LimpiarModal()
        }).catch(function (error) {
          console.log(error)
        })
      }
      this.LimpiarModal()
      this.close()
    },

    LimpiarModal () {
      this.idCategoria = ''
      this.idArticulo = ''
      this.nombreArticulo = ''
      this.codigoArticulo = ''
      this.precioArticulo = ''
      this.stock = ''
      this.descripcionArticulo = ''
      this.ValidaMensajes = []
    },
    validar () {
      this.valida = 0
      this.ValidaMensajes = []

      if (this.nombreArticulo.length < 3 || this.nombreArticulo.length > 150) {
        this.ValidaMensajes.push('El nombre del artículo debe tener más de 3 caracteres y menos de 150')
      }

      if (this.codigoArticulo.length <= 0) { this.ValidaMensajes.push('Debe capturar el código del artículo') }

      if (!this.idCategoria) { this.ValidaMensajes.push('Seleccione alguna categoria') }

      if (!this.stock || this.stock <= 0) { this.ValidaMensajes.push('EL stock debe ser mayor a cero') }

      if (!this.precioArticulo || this.precioArticulo <= 0) { this.ValidaMensajes.push('Aquí no fiamos, el precio de venta debe ser mayor a 0') }

      if (this.ValidaMensajes.length) { this.valida = 1 }

      return this.valida
    },

    modalActivarDesactivar (accion, item) {
      this.adModal = 1
      this.adIdArticulo = item.idArticulos
      this.adNombre = item.nombreArticulo

      if (accion === 1) {
        this.adAccion = 1
      } else if (accion === 2) {
        this.adAccion = 2
      } else {
        this.adAccion = 0
      }
    }

  }
}
</script>
