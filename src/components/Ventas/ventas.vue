<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-layout align-start>
        <v-flex>
            <h3 class="text-center mb-5 primary--text">Gestion de Ventas</h3>
            <v-container v-if="verListadoDeVentas==1">
                <v-toolbar flat color="white">
                    <v-toolbar-title>Ventas</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Busqueda" single-line hide-details></v-text-field>
                    <v-btn @click="ListadoVentas()" color="primary" dark class="mb-2">Buscar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="mostrarNuevo()" color="primary" dark class="mb-2">Nueva Ventas</v-btn>
                </v-toolbar>

                <v-data-table :headers="cabeceraVentas" :items="ListaDeVentas" :search="search" class="elevation-1">
                    <template v-slot:item.actions="{item}">
                      <div style="display: flex;">
                        <v-icon medium color="gray" class="mr-2" size="x-large" @click="verDetalles(item)">mdi-eye</v-icon>
                        <template v-if="item.estado">
                            <v-icon medium color="green darken-2" class="mr-2" size="x-large" @click="modalActivarDesactivar(2,item)">check_cricle</v-icon>
                        </template>
                        <template v-else>
                            <v-icon medium color="red darken-2" class="mr-2" size="x-large">cancel</v-icon>
                        </template>
                      </div>
                      </template>
                    <template v-slot:no-data>
                        <v-btn color="dark">No se recibieron datos del servidor</v-btn>
                    </template>
                </v-data-table>
                <v-dialog v-model="adModal" max-width="350">
                    <v-card>
                        <v-card-title class="headline text-h6">Desactivar Venta?</v-card-title>
                        <v-card-text class="mt-5 font-weight-bold">
                            vas a
                            <span>Desactivar </span>
                            la Venta: {{  adSerie }}.
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn outlined rounded medium text @click="activarDesactivarCerrar()">Cancelar</v-btn>
                            <v-btn color="red darken-2" outlined rounded medium text @click="desactivar()">Desactivar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
            <v-container v-if="verFormularioNuevoVenta == 1" grid-list-sm class="pa-4 white">
                <v-layout row wrap>
                    <v-flex xs12 sm6 md6 lg3 x3>
                        <v-select v-model="TipoComprobante" :items="ListaDeComprobantes" label="Seleccione un tipo de comprobante"></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg2 x12>
                        <v-text-field v-model="SerieComprobante" label="Serie del comprobante"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg2 x12>
                        <v-text-field v-model="NumeroComprobante" label="Numero del comprbante"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg3 x13>
                        <v-select v-model="IdPersona" :items="ListaDeCliente" label="Seleccione un Cliente"></v-select>
                    </v-flex>
                    <v-flex xs12 sm5 md5 lg2 x12>
                        <v-text-field v-model="Impuesto" type="number" label="Impuesto"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm5 md5 lg2 x14>
                        <v-text-field @keyup.enter="BuscarArticulosPorCodigo()" v-model="codigo" label="Codigo"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 md2 lg8 x8>
                        <v-btn @click="mostrarArticulos()" small fab color="primary"><v-icon>list</v-icon></v-btn>
                    </v-flex>
                    <v-flex xs12 sm8 lg8 x18 v-if="ErrorArticulo" class="mt-5 mb-5">
                        <div class="red--text" v-text="ErrorArticulo"></div>
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12 x12>
                        <template>
                            <v-data-table :headers="CabeceraDetallesVentas" :items="DetallesVentas" hide-default-footer class="elevation-1">
                                <template v-slot:item.nombreArticulo="props">
                                <td>{{ props.item.nombreArticulo }}</td>
                                </template>
                                <template v-slot:item.cantidad="props">
                                <td><v-text-field type="number" v-model.number="props.item.cantidad"></v-text-field></td>
                                </template>
                                <template v-slot:item.descuento="props">
                                <td><v-text-field type="number" v-model.number="props.item.descuento"></v-text-field></td>
                                </template>
                                <template v-slot:item.precio="props">
                                    <td>{{ props.item.precio }}</td>
                                </template>
                                <template v-slot:item.subTotal="props">
                                <td>$ {{ props.item.precio*props.item.cantidad-(props.item.precio*props.item.cantidad*(props.item.descuento/100))}}</td>
                                </template>
                                <template v-slot:item.borrar="{item}">
                                    <v-icon medium color="red darken-1" class="mr-2" size="x-large" @click="eliminarDetalle(DetallesVentas,item)">mdi-delete</v-icon>
                                </template>
                            </v-data-table>

                            <v-flex class="text-xs-right mtb-5">
                                <strong>Total Parcial: </strong>${{ TotalParcial=(total-TotalImpuesto).toFixed(2) }}
                            </v-flex>
                            <v-flex calss="text-xs-right">
                                <strong>Total Impuesto: </strong>${{ TotalImpuesto=((total*Impuesto)/(100+Impuesto)).toFixed(2) }}
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
                        <v-btn v-if="verIconoGrabar==0" @click="grabarVentas()" color="success">Guardar</v-btn>
                    </v-flex>

                </v-layout>
            </v-container>

            <v-dialog v-model="VerArticulos" max-width="80%">
                <v-card>
                    <v-card-title>
                        <span class="headline">Seleccione un articulo</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12 lg12 xl12>
                                    <v-text-field append-icon="search" class="text-xs-center" v-model="Criterio" label="Ingerese Articulos a buscar" @keyup.enter="ListandoArticulos()"></v-text-field>
                                    <template>
                                        <v-data-table :headers="CabeceraArticulos" :items="ListaDeArticulos" class="elevation-1">
                                            <template v-slot:item.seleccionar="{item}">
                                             <td class="justify-center layout px-0">
                                                <v-icon medium color="green darken-2" class="mr-2" size="x-large" @click="agregarArticulo_A_Detalles(item)">check_cricle</v-icon>
                                             </td>
                                            </template>
                                            <template v-slot:no-data>
                                                <h3>No hay articulos para mostrar.</h3>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      dialog: false,
      search: '',
      cabeceraVentas: [
        { text: 'Nombre', value: 'nombreUsuario', align: 'start', sorteable: true },
        { text: 'Cliente', value: 'nombreCliente', align: 'start', sorteable: true },
        { text: 'Comprobante', value: 'tipoComprobante', align: 'start', sorteable: true },
        { text: 'Serie', value: 'serieComprobante', align: 'start', sorteable: false },
        { text: 'Numero', value: 'numeroComprobante', align: 'start', sorteable: true },
        { text: 'Fecha', value: 'fechaHora', align: 'start', sorteable: true },
        { text: 'Impuesto', value: 'impuesto', align: 'start', sorteable: false },
        { text: 'Total', value: 'total', align: 'start', sorteable: false },
        { text: 'Acciones', value: 'actions', sorteable: false }

      ],
      ListaDeVentas: [],

      IdVenta: '',
      IdUsuario: '4',
      IdPersona: '',
      NombreUsuario: '',
      NombreCliente: '',
      TipoComprobante: '',
      SerieComprobante: '',
      NumeroComprobante: '',
      FechaHora: '',
      Impuesto: 16.0,
      ListaDeComprobantes: ['FACTURA', 'BOLETA', 'TICKET', 'GUIA', 'COTIZACION'],
      ListaDeCliente: [],
      ErrorArticulo: null,
      codigo: '',

      CabeceraDetallesVentas: [
        { text: 'Articulo', value: 'nombreArticulo', align: 'start', sorteable: false },
        { text: 'Cantidad', value: 'cantidad', align: 'start', sorteable: false },
        { text: 'Precio', value: 'precio', align: 'start', sorteable: false },
        { text: 'Descuento', value: 'descuento', align: 'start', sorteable: false },
        { text: 'SubTotal', value: 'subTotal', align: 'start', sorteable: false },
        { text: 'Acciones', value: 'borrar', sorteable: false }
      ],

      DetallesVentas: [],

      CabeceraArticulos: [
        { text: 'Articulo', value: 'nombreArticulo', sorteable: true },
        { text: 'Categoria', value: 'categoria', sorteable: true },
        { text: 'Stock', value: 'stock', sorteable: false },
        { text: 'Precio', value: 'precioVenta', sorteable: false },
        { text: 'Seleccionar', value: 'seleccionar', sorteable: false }
      ],

      ListaDeArticulos: [],
      Criterio: '',

      adModal: 0,
      AdAccion: 0,
      adSerie: '',
      AdIdVenta: '',

      VerArticulos: 0,
      VerDetalle: 0,
      verIconoGrabar: 0,
      verListadoDeVentas: 1,
      verFormularioNuevoVenta: 0,

      TotalParcial: 0,
      TotalImpuesto: 0,
      total: 0,

      Valida: 0,
      ValidaMensaje: []
    }
  },

  computed: {
    calcularTotal: function () {
      let resultado = 0.0

      for (let i = 0; i < this.DetallesVentas.length; i++) {
        if (this.DetallesVentas[i].descuento === 0) {
          resultado = resultado + (this.DetallesVentas[i].cantidad * this.DetallesVentas[i].precio)
        } else {
          resultado = resultado + (this.DetallesVentas[i].cantidad * this.DetallesVentas[i].precio - (this.DetallesVentas[i].cantidad * this.DetallesVentas[i].precio * (this.DetallesVentas[i].descuento / 100)))
        }
      }
      console.log(resultado)
      return resultado
    }
  },

  watch: {
    dialog (val) {
      val || this.Close()
    }
  },

  created () {
    this.SeleccionaCliente()
    this.ListadoVentas()
  },

  methods: {
    grabarVentas () {
      if (this.validaDatos() === 1) {
        return
      }

      const me = this
      console.log(this.IdPersona)
      console.log(this.IdUsuario)
      console.log(this.TipoComprobante)
      console.log(this.SerieComprobante)
      console.log(this.NumeroComprobante)
      console.log(this.Impuesto)
      console.log(this.total)
      console.log(this.DetallesVentas)

      axios.post('api/Ventas/InsertarVenta', {
        idPersona: this.IdPersona,
        idUsuario: this.IdUsuario,
        tipoComprobante: this.TipoComprobante,
        serieComprobante: this.SerieComprobante,
        numeroComprobante: this.NumeroComprobante,
        impuesto: this.Impuesto,
        total: this.total,
        detalles: this.DetallesVentas
      }).then(function (response) {
        me.ListadoVentas()
        me.ocultarNuevo()
      }).catch(function (error) {
        console.log('Ocurrio el sigueinte error ==>', error, '<==')
      })
    },
    mostrarNuevo () {
      this.verListadoDeVentas = 0
      this.verFormularioNuevoVenta = 1
    },
    ocultarNuevo () {
      this.verListadoDeVentas = 1
      this.verFormularioNuevoVenta = 0
      this.LimpiarModal()
    },

    BuscarArticulosPorCodigo () {
      const me = this
      me.ErrorArticulo = null
      axios.get('api/Articulos/BuscarArticuloPorCodigo/' + me.codigo).then(function (response) {
        me.agregarArticulo_A_Detalles(response.data)
      // eslint-disable-next-line n/handle-callback-err
      }).catch(function (error) {
        me.ErrorArticulo = 'No existe el articulo con el codigo: ' + me.codigo + ' '
      })
    },
    agregarArticulo_A_Detalles (data = []) {
      this.ErrorArticulo = null
      console.log(data)
      if (this.buscaDuplicado(data.idArticulo) === 1) {
        this.ErrorArticulo = 'El Articulo ya ha sido agregado'
      } else {
        this.DetallesVentas.push(
          {
            idArticulo: data.idArticulo,
            nombreArticulo: data.nombreArticulo,
            cantidad: 1,
            descuento: 0,
            precio: data.precioVenta
          }
        )
        console.log(this.DetallesVentas)
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
      for (let i = 0; i < this.DetallesVentas.length; i++) {
        if (this.DetallesVentas[i].idArticulo === id) { encontro = 1 }
      }
      return encontro
    },

    ListadoVentas () {
      const me = this
      let url = ''

      if (!me.search) {
        url = 'api/Ventas/ListarVentas/'
      } else {
        url = 'api/Ventas/ListadoFiltrado/' + me.search
      }
      axios.get(url).then(function (response) {
        me.ListaDeVentas = response.data
        console.log(me.ListaDeVentas)
      }).catch(function (error) {
        console.log(error)
      })
    },
    ListadoDetallesVenta (idVenta) {
      const me = this
      console.log(idVenta)
      axios.get('api/Ventas/ListarDetalleVenta/' + idVenta).then(function (response) {
        console.log(response.data)
        me.DetallesVentas = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    ListandoArticulos () {
      const me = this
      axios.get('api/Ingresos/SeleccionaArticuloIngreso/').then(function (response) {
        me.ListaDeArticulos = response.data
        console.log(me.ListaDeArticulos)
      }).catch(function (error) {
        console.log(error)
      })
    },

    verDetalles (item) {
      this.LimpiarModal()
      console.log(item)
      this.TipoComprobante = item.tipoComprobante
      this.SerieComprobante = item.serieComprobante
      this.NumeroComprobante = item.numeroComprobante
      this.IdPersona = item.idPersona
      this.Impuesto = item.impuesto
      this.ListadoDetallesVenta(item.idVenta)
      this.verFormularioNuevoVenta = 1
      this.verIconoGrabar = 1
      this.mostrarNuevo()
    },

    mostrarArticulos () {
      this.VerArticulos = 1
    },

    ocultarArticulo () {
      this.VerArticulos = 0
    },

    SeleccionaCliente () {
      const me = this
      let LstCliente = []
      axios.get('api/Personas/SeleccionaCliente').then(function (response) {
        LstCliente = response.data
        console.log(response.data)
        // eslint-disable-next-line array-callback-return
        LstCliente.map(function (p) {
          me.ListaDeCliente.push({ text: p.nombrePersona, value: p.idPersona })
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
      this.IdUsuario = '4'
      this.IdPersona = ''
      this.TipoComprobante = ''
      this.SerieComprobante = ''
      this.NumeroComprobante = ''
      this.DetallesVentas = []
      this.codigo = ''
      this.Impuesto = 16
      this.total = 0
      this.TotalImpuesto = 0
      this.TotalParcial = 0
      this.Valida = 0
      this.ValidaMensaje = []
      this.editedIndex = 1
      this.ErrorArticulo = null
      this.verIconoGrabar = 0
    },

    modalActivarDesactivar (accion, item) {
      this.adModal = 1
      this.AdIdVenta = item.idVenta
      this.adSerie = item.serieComprobante + ':' + item.numeroComprobante

      if (accion === 1) {
        this.AdAccion = 1
      } else if (accion === 2) {
        this.AdAccion = 2
      } else {
        this.adModal = 0
      }
    },

    desactivar () {
      const me = this
      axios.put('api/Ventas/DesactivarVenta/' + this.AdIdVenta, {}).then(function (response) {
        me.adModal = 0
        me.AdAccion = 0
        me.adModal = ''
        me.AdIdVenta = 0
        me.Close()
        me.ListadoVentas()
      }).catch(function (error) {
        console.log(error)
      })
    },

    activarDesactivarCerrar () {
      this.adModal = 0
    },

    validaDatos () {
      this.Valida = 0
      this.ValidaMensaje = []
      if (!this.TipoComprobante) {
        this.ValidaMensaje.push('- Seleccione un tipo de comprobante')
      }
      if (!this.SerieComprobante) {
        this.ValidaMensaje.push('- Capture la serie del comprobante')
      }
      if (!this.NumeroComprobante) {
        this.ValidaMensaje.push('- Capture el numero de comprbante')
      }
      if (!this.IdPersona) {
        this.ValidaMensaje.push('- Selecione un Cliente')
      }
      if (!this.Impuesto) {
        this.ValidaMensaje.push('- Capture el impuesto')
      }
      if (this.DetallesVentas.length <= 0) {
        this.ValidaMensaje.push('- Capture al menos un articulo')
      }
      if (this.ValidaMensaje.length > 0) {
        this.Valida = 1
      }
      return this.Valida
    }
  }
}
</script>
