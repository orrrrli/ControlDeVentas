<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table :headers="headers" :items="usuarios" :search="search" sort-by="nombreUsuario" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <!---->
        <v-toolbar-title class="text-center ">Usuarios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-text-field class="text-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn small color="primary darken-2" @click="ListadoArticulosPDF()" ><v-icon>print</v-icon></v-btn>
          <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Usuario
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{formTitle}}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row >
                  <v-col cols="6" xs="12" sm="12" md="6">
                      <v-text-field v-model="nombreUsuario" label="Nombre del usuario"></v-text-field>
                  </v-col>
                  <v-col cols="6" xs="12" sm="12" md="6">
                      <v-select v-model="idRol" :items="roles" label="Rol"></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" xs="12" sm="12" md="6">
                      <v-select v-model="tipoDocumento" :items="lstDocumentos" label="Tipo de documento">
                      </v-select>
                  </v-col>
                  <v-col cols="6" xs="12" sm="12" md="6">
                      <v-text-field v-model="numeroDocumento" label="Numero de documento">
                      </v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col cols="6" xs="12" sm="12" md="6">
                      <v-text-field v-model="email" label="Email">
                      </v-text-field>
                  </v-col>
                  <v-col cols="6" xs="12" sm="12" md="6">
                      <v-text-field v-model="direccion" label="Direccion">
                      </v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col cols="12" xs="12" sm="12" md="12">
                      <v-text-field v-model="telefono" label="Telefono">
                      </v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col cols="12" xs="12" sm="12" md="12">
                      <v-text-field v-model="password" type="password" label="Contraseña"></v-text-field>
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
            <v-card-title v-if="adAccion==1">¿Activar Usuario?</v-card-title>
            <v-card-title v-if="adAccion==2">¿Desactivar Usuario?</v-card-title>

            <v-card-text>
              Vas a
                <span v-if="adAccion==1"> Activar </span>
                <span v-if="adAccion==2"> Desactivar </span>
                el Usuario {{ adNombre }},
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
     <v-icon medium color="primary darken-1" class="mr-2" size="x-large" @click="editItem(item)">mdi-pencil</v-icon>
    <template v-if="item.estado">
    <v-icon medium color="green darken-2" class="mr-2" size="x-large" @click="modalActivarDesactivar(2,item)">check_circle</v-icon>
    </template>
    <template v-else>
      <v-icon medium color="red darken-2" class="mr-2" size="x-large"  @click="modalActivarDesactivar(1,item)">cancel</v-icon>
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

    idUsuario: '',
    idRol: '',
    roles: [],
    nombreUsuario: '',
    tipoDocumento: '',
    lstDocumentos: ['INE', 'CURP', 'PASAPORTE', 'CEDULA PRODESIONAL'],
    numeroDocumento: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    estado: false,
    actualizaPassword: false,
    passwordAnterior: '',
    usuarios: [],
    adidUsuarios: '',

    adModal: 0,
    adAccion: 0,
    adNombre: '',

    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Nombre', value: 'nombreUsuario', align: 'start', sortable: true },
      { text: 'Rol', value: 'rol', align: 'start', sortable: true },
      { text: 'Email', value: 'email', align: 'start', sortable: true },
      { text: 'Tipo Documento', value: 'tipoDocumento', align: 'start', sortable: true },
      { text: 'No. Documento', value: 'numeroDocumento', align: 'start', sortable: true },
      { text: 'Telefono', value: 'telefono', align: 'start', sortable: true },
      { text: 'Acciones', value: 'actions', sortable: false }
    ],

    validar () {
      this.valida = 0
      this.ValidaMensajes = []

      if (this.nombreUsuario.length < 3 || this.nombreUsuario.length > 150) { this.ValidaMensajes.push('El nombre del Usuario debe tener más de 3 caracteres y menos de 150') }

      if (!this.idRol) { this.ValidaMensajes.push('Seleccione un rol') }

      if (!this.email) { this.ValidaMensajes.push('Debe capturar un email') }

      if (!this.password) { this.ValidaMensajes.push('Debe capturar una contraseña') }

      if (this.ValidaMensajes.length) { this.valida = 1 }
      console.log(this.ValidaMensajes)

      return this.valida
    },

    modalActivarDesactivar (accion, item) {
      this.adModal = 1
      this.adidUsuarios = item.idUsuario
      this.adNombre = item.nombreUsuario

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
      idUsuario: '',
      idRol: '',
      nombreUsuario: '',
      tipoDocumento: '',
      numeroDocumento: '',
      direccion: '',
      telefono: '',
      email: '',
      password: '',
      estado: true

    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
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
    this.ListadoUsuarios()
    this.SeleccionarRol()
    this.initialize()
  },

  methods: {
    SeleccionarRol () {
      const me = this
      let LstRoles = []

      axios.get('api/Roles/SeleccionaRol').then(function (response) {
        LstRoles = response.data
        // eslint-disable-next-line array-callback-return
        LstRoles.map(function (c) {
          me.roles.push({ text: c.nombreRol, value: c.idRol })
          console.log(LstRoles)
          console.log(me.roles)
        })
      }).catch(function (error) {
        console.log(error)
      })
    },

    ListadoUsuarios () {
      const Lista = this
      axios.get('api/Usuarios/ListarUsuarios').then(function (response) {
        console.log(response)
        Lista.usuarios = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    activar () {
      const me = this
      axios.put('api/Usuarios/ActivarUsuario/' + this.adidUsuarios, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = ''
        me.adidUsuarios = 0
        me.close()
        me.ListadoUsuarios()
      }).catch(function (error) {
        console.log(error)
      })
    },

    desactivar () {
      const me = this
      axios.put('api/Usuarios/DesactivarUsuario/' + this.adidUsuarios, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adNombre = ''
        me.adidUsuarios = 0
        me.close()
        me.ListadoUsuarios()
      }).catch(function (error) {
        console.log(error)
      })
    },

    ActivarDesactivarCerrar () {
      this.adModal = 0
    },

    initialize () {
      console.log(this.roles)
    },

    editItem (item) {
      this.idUsuario = item.idUsuario
      this.idRol = item.idRol
      this.nombreUsuario = item.nombreUsuario
      this.tipoDocumento = item.tipoDocumento
      this.numeroDocumento = item.numeroDocumento
      this.direccion = item.direccion
      this.telefono = item.telefono
      this.email = item.email
      this.password = item.passwordHash
      this.passwordAnterior = item.passwordHash
      this.editedIndex = 2
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
        console.log('no le sabe pete')
        return
      }
      if (this.editedIndex > -1) {
        const me = this
        axios.put('api/Usuarios/ModificarUsuario',
          {
            idUsuario: this.idUsuario,
            idRol: me.idRol,
            nombreUsuario: me.nombreUsuario,
            tipoDocumento: me.tipoDocumento,
            numeroDocumento: me.numeroDocumento,
            direccion: me.direccion,
            telefono: me.telefono,
            email: me.email,
            password: me.passwordHash,
            actualizaPassword: this.actualizaPassword

          }).then(function (response) {
          me.close()
          me.ListadoUsuarios()
          me.LimpiarModal()
        }).catch(function (error) {
          console.log(error)
        })

        // Sección para editar los datos
      } else {
        const me = this
        axios.post('api/Usuarios/InsertarUsuario',
          {

            idRol: me.idRol,
            nombreUsuario: me.nombreUsuario,
            tipoDocumento: me.tipoDocumento,
            numeroDocumento: me.numeroDocumento,
            direccion: me.direccion,
            telefono: me.telefono,
            email: me.email,
            password: me.password

          }).then(function (response) {
          me.close()
          me.ListadoUsuarios()
          me.LimpiarModal()
        }).catch(function (error) {
          console.log(error)
        })
      }
      this.close()
    },

    LimpiarModal () {
      this.idUsuario = ''
      this.idRol = ''
      this.nombreUsuario = ''
      this.tipoDocumento = ''
      this.numeroDocumento = ''
      this.direccion = ''
      this.telefono = ''
      this.email = ''
      this.password = ''
      this.passwordAnterior = ''
      this.actualizaPassword = false
      this.valida = 0
      this.ValidaMensaje = []
    },
    ListadoArticulosPDF () {
      const columnas = [
        { title: 'Nombre de Usuario', dataKey: 'nombreUsuario' },
        { title: 'Rol', dataKey: 'Rol' },
        { title: 'Email', dataKey: 'email' },
        { title: 'Tipo de Documento', dataKey: 'tipoDocumento' },
        { title: 'No. Documento', dataKey: 'numeroDocumento' },
        { title: 'Telefono', dataKey: 'telefono' }
      ]
      const renglones = []
      // eslint-disable-next-line array-callback-return
      this.usuarios.map(function (a) {
        renglones.push({ nombreUsuario: a.nombreUsuario, Rol: a.rol, email: a.email, tipoDocumento: a.tipoDocumento, numeroDocumento: a.numeroDocumento, telefono: a.telefono })
      })
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'pt')
      doc.autoTable(columnas, renglones, {
        margin: { top: 60 },
        addPageContent: function (data) {
          doc.text('Facultad de Ingenieria Arquitectura y Diseño', 150, 30)
          doc.text('Listado de Usuarios', 200, 50)
        }
      })
      console.log(renglones)
      doc.save('Usuarios.pdf')
    }

  }
}
</script>
