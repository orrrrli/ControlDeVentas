<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable no-dupe-keys -->
<template v-slot:top>
  <v-data-table :headers="headers" :items="categorias" :search="search" sort-by="nombreCategoria" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Categoria</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn color="primary darken-2" @click="ListadoArticulosPDF()"><v-icon>print</v-icon></v-btn>
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
                    <v-text-field v-model="nombreCategoria" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                  </v-col>
                </v-row>
                <div v-if="ValidaMensajes.length > 0">
                  <ul>
                    <li v-for="message in ValidaMensajes" :key="message" class="red--text">{{ message }}</li>
                  </ul>
                </div>
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
        <v-dialog v-model="adModal" max-width="350">
        <v-card>
          <v-card-title class="headline" v-if="adAccion==1">¿Activar la categoria?</v-card-title>
          <v-card-title class="headline" v-if="adAccion==2">¿Desactivar la categoria?</v-card-title>
          <v-card-text> Vas a
            <span v-if="adAccion==1">Activar</span>
            <span v-if="adAccion==2">Desactivar</span>
            la categoria {{ adNombre }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="dark darken-1" @click="activarDesactivarCerrar">Cancelar</v-btn>
            <v-btn v-if="adAccion==1" color="success darken-1" @click="activar">Activar</v-btn>
            <v-btn v-if="adAccion==2" color="red darken-1" @click="desactivar">desactivar</v-btn>
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
      <v-icon medium color="primary darken-1" class="mr-2" size="x-large" @click="editItem(item)">mdi-pencil</v-icon>
      <template v-if="item.estado">
      <v-icon medium color="green darken-2" class="mr-2" size="x-large" @click="modalActivaDesactivar(2,item)">check_circle</v-icon>
      </template>
      <template v-else>
        <v-icon medium color="red darken-2" class="mr-2" size="x-large"  @click="modalActivaDesactivar(1,item)">cancel</v-icon>
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
import jsPDF from 'jspdf'
// eslint-disable-next-line no-unused-vars
import autoTable from 'jspdf-autotable'
export default {
  data: () => ({
    search: '',
    categorias: [], /* se creo un arreglo vacío */
    dialog: false,
    adModal: 0,
    adAccion: 0,
    adNombre: '',
    adIdCategoria: '',
    ValidaMensajes: [],
    validar () {
      this.valida = 0
      this.ValidaMensajes = []

      if (this.nombreCategoria.length < 3 || this.nombreCategoria.length > 100) { this.ValidaMensajes.push('El nombre de la categoria debe tener más de 3 caracteres y menos de 100') }
      if (this.ValidaMensajes.length) { this.valida = 1 }

      return this.valida
    },

    dialogDelete: false,
    headers: [
      { text: 'Nombre Categoria', value: 'nombreCategoria', align: 'start', sortable: true },
      { text: 'Descripcion', value: 'descripcion', sortable: true },
      { text: 'Accion', value: 'actions', sortable: false }
    ],

    editedIndex: -1,
    editedItem: {
      idCategoria: '',
      nombreCategoria: '',
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
      axios.get('https://localhost:7189/api/Categorias/ListarCategorias').then(function (response) {
        console.log(response)
        Lista.categorias = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    initialize () {

    },

    editItem (item) {
      this.idCategoria = item.idCategoria
      this.nombreCategoria = item.nombreCategoria
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
        this.LimpiarModal()
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
            idCategoria: me.idCategoria,
            nombreCategoria: me.nombreCategoria,
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
        axios.post('api/Categorias/InsertarCategorias',
          {
            nombreCategoria: me.nombreCategoria,
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
      this.idCategoria = ''
      this.nombreCategoria = ''
      this.descripcion = ''
      this.ValidaMensajes = []
    },
    modalActivaDesactivar (accion, item) {
      this.adModal = 1
      this.adIdCategoria = item.idCategoria
      this.adNombre = item.nombreCategoria
      if (accion === 1) {
        this.adAccion = 1
      } else if (accion === 2) {
        this.adAccion = 2
      } else {
        this.adModal = 0
      }
    },
    activar () {
      const me = this
      axios.put('api/Categorias/ActivarCategoria/' + this.adIdCategoria, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = 0
        me.adIdCategoria = 0
        me.close()
        me.ListadoCategorias()
      }).catch(function (error) {
        console.log(error)
      })
    },
    desactivar () {
      const me = this
      axios.put('api/Categorias/DesactivarCategoria/' + this.adIdCategoria, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = 0
        me.adIdCategoria = 0
        me.close()
        me.ListadoCategorias()
      }).catch(function (error) {
        console.log(error)
      })
    },
    activarDesactivarCerrar () {
      this.adModal = 0
    },
    ListadoArticulosPDF () {
      const columnas = [
        { title: 'Nombre', dataKey: 'nombreCategoria' },
        { title: 'Descripcion', dataKey: 'descripcion' }
      ]
      const renglones = []
      // eslint-disable-next-line array-callback-return
      this.categorias.map(function (a) {
        renglones.push({
          nombreCategoria: a.nombreCategoria,
          descripcion: a.descripcion
        })
      })
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'pt')
      doc.autoTable(columnas, renglones, {
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text('Facultad de Ingenieria Arquitectura y Diseño', 150, 30)
          doc.text('Listado de Articulos', 200, 50)
        }
      })
      doc.save('ListadeCategorias.pdf')
    }

  }
}
</script>
