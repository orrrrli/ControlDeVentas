<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable array-callback-return -->
<!-- eslint-disable n/handle-callback-err -->
<!-- eslint-disable no-unused-vars -->
<script>
import axios from 'axios'

export default {
  data: () => ({
    dialog: false,
    search: '',
    // INGRESOS
    cabeceraIngresos: [
      { text: 'Nombre', value: 'nombreUsuario', align: 'start', sortable: true },
      { text: 'Proveedor', value: 'nombreProveedor', align: 'start', sortable: true },
      { text: 'Comprobante', value: 'tipoComprobante', align: 'start', sortable: true },
      { text: 'Serie', value: 'serieComprobante', align: 'start', sortable: false },
      { text: 'Número', value: 'numeroComprobante', align: 'start', sortable: true },
      { text: 'Fecha', value: 'fechaHoraIngreso', align: 'start', sortable: true },
      { text: 'Impuesto', value: 'impuesto', align: 'start', sortable: false },
      { text: 'Total', value: 'total', align: 'start', sortable: false },
      { text: 'Acciones', value: 'actions', sortable: false }
    ],
    ListaDeIngresos: [],
    // Variables de Ingresos
    idIngreso: '',
    idUsuario: '9',
    idPersona: '',
    nombreUsuario: '',
    nombreProveedor: '',
    tipoComprobante: '',
    serieComprobante: '',
    numeroComprobante: '',
    fechaHoraIngreso: '',
    impuesto: 16,
    ListaDeComprobantes: ['FACTURA', 'BOLETA', 'TICKET', 'GUÍA', 'COTIZACIÓN'],
    ListaDeProveedores: [],
    errorArticulo: null,
    codigo: '',
    // DETALLES DE INGRESOS
    cabeceraDetallesIngresos: [
      { text: 'Artículo', value: 'nombreArticulo', align: 'start', sortable: false },
      { text: 'Cantidad', value: 'cantidad', align: 'start', sortable: false },
      { text: 'Precio', value: 'precioArticulo', align: 'start', sortable: false },
      { text: 'SubTotal', value: 'subTotal', align: 'start', sortable: false },
      { text: 'Acciones', value: 'borrar', sortable: false }
    ],
    // Variables detalles ingresos
    detallesIngresos: [],
    // ARTÍCULOS
    cabeceraArticulos: [
      { text: 'Artículo', value: 'nombreArticulo', sortable: true },
      { text: 'Categoría', value: 'nombreCategoria', sortable: true },
      { text: 'Stock', value: 'stock', sortable: false },
      { text: 'Precio', value: 'precioArticulo', sortable: false },
      { text: 'Seleccionar', value: 'seleccionar', sortable: false }
    ],
    ListaDeArticulos: [],
    criterio: '',
    // Variables para ayudar a visualizar componentes
    // Modal de desactivar
    adModal: 0,
    adAccion: 0,
    adSerie: '',
    adIdIngreso: '',
    // Dato del registro de ingreso que se va a desactivar
    // Variables para 1 = Mostrar, 2 = Ocultar formularios o elementos
    VerArticulos: 0,
    verDetalle: 0,
    verIconoGrabar: 0,
    verListadoDeIngresos: 1,
    verFormularioNuevoIngreso: 0,
    // Cálculos de las Ingresos
    totalParcial: 0,
    totalImpuesto: 0,
    total: 0,
    // Validación de datos
    valida: 0,
    validaMensaje: []
  }),
  computed: {
    calcularTotal: function () {
      let resultado = 0.0
      for (let i = 0; i < this.detallesIngresos.length; i++) {
        resultado = resultado + (this.detallesIngresos[i].cantidad * this.detallesIngresos[i].precioArticulo)
      }
      return resultado
    }
  },

  watch: {
    dialog (val) {
      this.Close()
    }
  },

  created () {
    this.SeleccionaProveedor()
    this.ListadoIngresos()
  },
  methods: {
    grabarIngresos () {
      if (this.validaDatos()) {
        return
      }

      const me = this

      axios.post('api/Ingresos/InsertarIngreso', {
        idUsuario: this.idUsuario,
        idPersona: this.idPersona,
        tipoComprobante: this.tipoComprobante,
        serieComprobante: this.serieComprobante,
        numeroComprobante: this.numeroComprobante,
        impuesto: this.impuesto,
        total: this.total,
        detallesIngresos: this.detallesIngresos
      }).then(function (response) {
        me.ListadoIngresos()
        me.ocultarNuevo()
      }).catch(function (error) {
        console.log('Ocurrió el siguiente error ==> ', error)
      })
    },
    mostrarNuevo () {
      this.verListadoDeIngresos = 0
      this.verFormularioNuevoIngreso = 1
      this.verIconoGrabar = 1
    },
    ocultarNuevo () {
      this.verListadoDeIngresos = 1
      this.verFormularioNuevoIngreso = 0
      this.LimpiarModal()
    },
    buscarArticuloPorCodigo () {
      const me = this
      me.errorArticulo = null

      axios.get('api/Articulos/BuscarArticuloPorCodigo/' + me.codigo).then(function (response) {
        me.agregarArticulo_A_Detalles(response.data)
      }).catch(function (error) {
        me.errorArticulo = 'No existe el artículo con el código: ' + me.codigo
      })
    },

    agregarArticulo_A_Detalles (data = []) {
      this.errorArticulo = null

      if (this.buscaDuplicado(data.idArticulo) === 1) {
        this.errorArticulo = 'El artículo ya ha sido agregado.'
      } else {
        this.detallesIngresos.push({
          idArticulo: data.idArticulo,
          nombreArticulo: data.nombreArticulo,
          cantidad: 1,
          precioArticulo: data.precioArticulo
        })
      }
    },

    eliminarDetalle (arreglo, item) {
      const i = arreglo.indexOf(item)
      if (i !== -1) {
        arreglo.splice(i, 1)
      }
    },
    buscaDuplicado (id) {
      let encontro = 0
      for (let i = 0; i < this.detallesIngresos.length; i++) {
        if (this.detallesIngresos[i].idArticulo === id) {
          encontro = 1
        }
      }
      return encontro
    },

    ListadoIngresos () {
      const me = this
      let url = ''

      if (!me.search) {
        url = 'api/Ingresos/ListarIngresos/'
      } else {
        url = 'api/Ingresos/ListadoFiltrado/' + me.search
      }

      axios.get(url).then(function (response) {
        me.ListaDeIngresos = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    ListadoDetallesIngreso (idIngreso) {
      const me = this
      axios.get('api/Ingresos/ListarDetallesIngreso/' + idIngreso).then(function (response) {
        me.detallesIngresos = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    ListadoArticulos () {
      const me = this
      axios.get('api/Articulos/ListarArticulos' + me.criterio).then(function (response) {
        me.ListaDeArticulos = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    verDetalles (item) {
      this.LimpiarModal()
      this.tipoComprobante = item.tipoComprobante
      this.serieComprobante = item.serieComprobante
      this.numeroComprobante = item.numeroComprobante
      this.idPersona = item.idPersona
      this.impuesto = item.impuesto
      this.ListadoDetallesIngreso(item.idIngreso)
      this.verFormularioNuevoIngreso = 1
      this.verIconoGrabar = 1
      this.mostrarNuevo()
    },

    mostrarArticulos () {
      this.VerArticulos = 1
    },

    ocultarArticulos () {
      this.VerArticulos = 0
    },

    SeleccionaProveedor () {
      const me = this
      let LstProveedores = []

      axios.get('api/Personas/SeleccionaProveedor').then(function (response) {
        LstProveedores = response.data

        LstProveedores.map(function (p) {
          me.ListaDeProveedores.push({ text: p.nombrePersona, value: p.idPersona })
        })
      }).catch(function (error) {
        console.log(error)
      })
    },

    Close () {
      this.dialog = false
      this.LimpiarModal()
    },

    LimpiarModal () {
      this.idUsuario = '9'
      this.idPersona = ''
      this.tipoComprobante = '' // Debes asignar un valor apropiado aquí
      this.serieComprobante = '' // Debes asignar un valor apropiado aquí
      this.numeroComprobante = '' // Debes asignar un valor apropiado aquí
      this.detallesIngresos = []
      this.codigo = ''
      this.impuesto = 16
      this.total = 0
      this.totalImpuesto = 0
      this.totalParcial = 0
      this.valida = 0
      this.validaMensaje = []
      this.editedIndex = 1
      this.errorArticulo = null
      this.verIconoGrabar = 0
    },
    // MÉTODOS PARA ACTIVAR O DESACTIVAR INGRESO
    modalActivarDesactivar (accion, item) {
      this.adModal = 1
      this.adIdIngreso = item.idIngreso
      this.adSerie = item.serieComprobante + item.numeroComprobante

      if (accion === 1) {
        this.adAccion = 1
      } else if (accion === 2) {
        this.adAccion = 2
      } else {
        this.adModal = 0
      }
    },

    desactivar () {
      const me = this
      axios.put('api/Ingresos/DesactivarIngreso/' + this.adIdIngreso, {}).then(function (response) {
        me.adModal = 0
        me.adAccion = 0
        me.adModal = ''
        me.adIdIngreso = 0
        me.Close()
        me.ListadoIngresos()
      }).catch(function (error) {
        console.log(error)
      })
    },

    activarDesactivarCerrar () {
      this.adModal = 0
    },
    validaDatos () {
      this.valida = 0
      this.validaMensaje = []

      if (!this.tipoComprobante) {
        this.validaMensaje.push('- Seleccione un tipo de comprobante.')
      }

      if (!this.serieComprobante) {
        this.validaMensaje.push('- Capture la serie del comprobante.')
      }

      if (!this.numeroComprobante) {
        this.validaMensaje.push('- Capture el número de comprobante.')
      }

      if (!this.idPersona) {
        this.validaMensaje.push('- Seleccione un proveedor.')
      }

      if (!this.impuesto || this.impuesto < 0) {
        this.validaMensaje.push('- Capture el impuesto.')
      }

      if (this.detallesIngresos.length === 0) {
        this.validaMensaje.push('- Agregue al menos un detalle de ingreso.')
      }

      this.valida = this.validaMensaje.length > 0 ? 1 : 0

      return this.valida
    }
  }
}
</script>
<template>
  <v-layout align-start>
    <v-flex>
      <h3 class="text-center mb-5 primary--text">Gestión de Ingresos</h3>
      <v-container v-if="verListadoDeIngresos == 1">
        <v-toolbar flat color="white">
          <v-toolbar-title>Ingresos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-btn @click="ListadoIngresos()" color="primary" dark class="mb-2">Buscar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="mostrarNuevo()">Nuevo Ingreso</v-btn>
        </v-toolbar>
        <v-data-table :headers="cabeceraIngresos" :items="ListaDeIngresos" :search="search" sort-by="nombreUsuario" class="elevation-1">
          <!--eslint-disable-next-line vue/valid-v-slot-->
          <template v-slot:item.actions="{ item }">
            <v-icon color="gray" class="mr-2" @click="verDetalles(item)" size="x-large">mdi-pencil</v-icon>
            <template v-if="item.estado">
              <v-icon color="red" @click="modalActivarDesactivar(2, item)" size="x-large">mdi-delete</v-icon>
            </template>
            <template v-else>
              <v-icon color="green" @click="modalActivarDesactivar(1, item)" size="x-large">mdi-check</v-icon>
            </template>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
        <v-dialog v-model="adModal" max-width="350">
          <v-card>
            <v-card-title class="headline text-h6">Desactivar ingreso?</v-card-title>
            <v-card-text class="mt-5 font-weight-bold">
              Vas a
              <span> Desactivar </span>
              el ingreso: {{adSerie }}.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined rounded medium text @click="activarDesactivarCerrar()">Cancelar</v-btn>
              <v-btn color="red darken-1" outlined rounded medium text @click="desactivar()">Desactivar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      <v-container v-if="verFormularioNuevoIngreso==1" grid-list-sm class="pa-4 white">
        <!-- Captura de los datos de Ingreso-->
          <v-layout row wrap>
            <v-flex xs12 sm6 md6 lg3 xl3>
              <v-select v-model="tipoComprobante" :items="ListaDeComprobantes" label="Seleccione un tipo de comprobante"></v-select>
            </v-flex>
            <v-flex xs12 sm6 md6 lg2 xl2>
              <v-text-field v-model="serieComprobante" label="Serie del comprobante"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 lg2 xl2>
              <v-text-field v-model="numeroComprobante" label="Número del comprobante"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 lg3 xl3>
              <v-select v-model="idPersona" :items="ListaDeProveedores" label="Seleccione un proveedor"></v-select>
            </v-flex>
            <v-flex xs12 sm5 md5 lg2 xl2>
              <v-text-field v-model="impuesto" type="number" label="Impuesto"></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 md5 lg4 xl4>
              <v-text-field @keyup.enter="buscarArticuloPorCodigo()" v-model="codigo" label="Código"></v-text-field>
            </v-flex>
            <v-flex xs12 sm2 md2 lg8 xl8>
              <v-btn @click="mostrarArticulos()" small fab color="primary"><v-icon>list</v-icon></v-btn>
            </v-flex>
            <v-flex xs12 sm8 lg8 x18 v-if="errorArticulo" class="mt-5 mb-5">
              <div class="red--text" v-text="errorArticulo"></div>
            </v-flex>
            <!-- Data-Table de los detalles de ingreso -->
            <v-flex xs12 sm12 md12 lg12 xl12>
              <template>
                <v-data-table :headers="cabeceraDetallesIngresos" :items="detallesIngresos" hide-default-footer class="elevation-1">
                  <!--eslint-disable-next-line vue/valid-v-slot-->
                  <template v-slot:item.nombreArticulo="props">
                    <td>{{ props.item.nombreArticulo }}</td>
                  </template>
                  <!--eslint-disable-next-line vue/valid-v-slot-->
                  <template v-slot:item.cantidad="props">
                    <td>
                      <v-text-field type="number" v-model.number="props.item.cantidad"></v-text-field>
                    </td>
                  </template>
                  <!--eslint-disable-next-line vue/valid-v-slot-->
                  <template v-slot:item.precioArticulo="props">
                    <td>
                      <v-text-field type="number" v-model.number="props.item.precioArticulo"></v-text-field>
                    </td>
                  </template>
                  <!--eslint-disable-next-line vue/valid-v-slot-->
                  <template v-slot:item.subTotal="props">
                    <td>${{ props.item.cantidad * props.item.precioArticulo }}</td>
                  </template>
                  <!--eslint-disable-next-line vue/valid-v-slot-->
                  <template v-slot:item.borrar="{ item }">
                    <v-icon medium color="red darken-1" class="mr-2" size="x-large" @click="eliminarDetalle(detallesIngresos, item)">mdi-delete</v-icon>
                  </template>
                </v-data-table>
                <!-- CALCULOS DE LOS TOTALES DEL INGRESO -->
                <v-flex class="text-xs-right mb-5">
                  <strong>Total Parcial: </strong>$ {{ totalParcial }}
                </v-flex>
                <v-flex class="text-xs-right">
                  <strong>Total Impuesto: </strong>$ {{ totalImpuesto = ((totalParcial * impuesto) / 100).toFixed(2) }}
                </v-flex>
                <v-flex class="text-xs-right mb-5">
                    <strong>Total Neto: </strong>$ {{ total=(calcularTotal).toFixed(2) }}
                </v-flex>
              </template>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 x12>
                        <div class="red--text" v-for="v in ValidaMensaje" :key="v" v-text="v"></div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 x12>
                        <v-btn @click="ocultarNuevo()" color="dark darken-1">Cancelar</v-btn>
                        <v-btn v-if="verIconoGrabar==0" @click="grabarIngresos()" color="success">Guardar</v-btn>
                    </v-flex>
          </v-layout>
      </v-container>
      <!-- MODAL PARA SELECCIONAR ARTICULOS POR EL BOTON LISTA -->
      <v-dialog v-model="VerArticulos" max-width="80%">
        <v-card>
          <v-card-title>
            <span class="headline">Seleccione un artículo</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <v-text-field
                    append-icon="search"
                    class="text-xs-center"
                    v-model="criterio"
                    label="Ingrese artículo a buscar"
                    @keyup.enter="ListadoArticulos()"
                  ></v-text-field>
                  <template>
                    <!-- Data-Table para seleccionar artículos -->
                    <v-data-table :headers="cabeceraArticulos" :items="ListaDeArticulos" class="elevation-1">
                      <!--eslint-disable-next-line vue/valid-v-slot-->
                      <template v-slot:item.seleccionar="{ item }">
                        <td class="justify-center layout px-0">
                          <v-icon medium color="green darken-2" class="mr-2" size="x-large" @click="agregarArticulo_A_Detalles(item)">check_circle</v-icon>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        <h3>No hay artículos para mostrar.</h3>
                      </template>
                    </v-data-table>
                  </template>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined rounded medium text @click="ocultarArticulos()">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-flex>
  </v-layout>
</template>
