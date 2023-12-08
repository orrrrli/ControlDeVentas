<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable n/handle-callback-err -->
<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-layout align-start>
        <v-flex>
            <h3 class="text-center mb-5 primary--text">Gestion de Ingresos</h3>
            <v-container v-if="verListadoDeIngresos==1">
                <v-toolbar flat color="white">
                    <v-toolbar-title>Ingresos</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    Desde:&nbsp; <v-text-field type="datetime-local" class="text-xs-center" v-model="fechaInicial"></v-text-field>
                    Hasta:&nbsp; <v-text-field type="datetime-local" class="text-xs-center" v-model="fechaFinal"></v-text-field>
                    <v-btn @click="ListadoIngresos()" color="primary" dark class="mb-2">Buscar</v-btn>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-data-table :headers="cabeceraIngresos" :items="ListaDeIngresos" :search="search" class="elevation-1">
                    <template v-slot:item.actions="{item}">
                        <v-icon medium color="gray" class="mr-2" size="x-large" @click="verDetalles(item)">mdi-eye</v-icon>
                        <template v-if="item.estado">
                            <v-icon medium color="green darken-2" class="mr-2" size="x-large">lock_open</v-icon>
                        </template>
                        <template v-else>
                            <v-icon medium color="red darken-2" class="mr-2" size="x-large">lock</v-icon>
                        </template>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="dark">No se recibieron datos del servidor</v-btn>
                    </template>
                </v-data-table>
                <v-dialog v-model="adModal" max-width="350">
                    <v-card>
                        <v-card-title class="headline text-h6">Desactivar ingreso?</v-card-title>
                        <v-card-text class="mt-5 font-weight-bold">
                            vas a
                            <span>Desactivar </span>
                            el ingreso: {{  adSerie }}.
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn outlined rounded medium text @click="activarDesactivarCerrar()">Cancelar</v-btn>
                            <v-btn color="red darken-2" outlined rounded medium text @click="desactivar()">Desactivar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
            <v-container v-if="verFormularioNuevoIngreso == 1" grid-list-sm class="pa-4 white">
                <v-layout row wrap>
                    <v-flex xs12 sm6 md6 lg3 x3>
                        <v-select v-model="TipoComprobante" :items="ListaDeComprobantes" label="Seleccione un tipo de comprobante" disabled></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg2 x12>
                        <v-text-field v-model="SerieComprobante" label="Serie del comprobante" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg2 x12>
                        <v-text-field v-model="NumeroComprobante" label="Numero del comprbante" disabled></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg3 x13>
                        <v-select v-model="IdPersona" :items="ListaDeProveedores" label="Seleccione un Probedor" disabled></v-select>
                    </v-flex>
                    <v-flex xs12 sm5 md5 lg2 x12>
                        <v-text-field v-model="Impuesto" type="number" label="Impuesto" disabled></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12 x12>
                        <template>
                            <v-data-table :headers="CabeceraDetallesIngresos" :items="DetallesIngresos" hide-default-footer class="elevation-1">
                                <template v-slot:item.nombreArticulo="props">
                                <td>{{ props.item.nombreArticulo }}</td>
                                </template>
                                <template v-slot:item.cantidad="props">
                                <td>{{props.item.cantidad}}</td>
                                </template>
                                <template v-slot:item.precio="props">
                                    <td>{{ props.item.precio }}</td>
                                </template>
                                <template v-slot:item.subTotal="props">
                                <td>$ {{ props.item.precio*props.item.cantidad }}</td>
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
                    </v-flex>

                </v-layout>
            </v-container>

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
      cabeceraIngresos: [
        { text: 'Nombre', value: 'nombreUsuario', align: 'start', sorteable: true },
        { text: 'Proveedor', value: 'nombreProveedor', align: 'start', sorteable: true },
        { text: 'Comprobante', value: 'tipoComprobante', align: 'start', sorteable: true },
        { text: 'Serie', value: 'serieComprobante', align: 'start', sorteable: false },
        { text: 'Numero', value: 'numeroComprobante', align: 'start', sorteable: true },
        { text: 'Fecha', value: 'fechaHoraComprobante', align: 'start', sorteable: true },
        { text: 'Impuesto', value: 'impuestos', align: 'start', sorteable: false },
        { text: 'Total', value: 'total', align: 'start', sorteable: false },
        { text: 'Acciones', value: 'actions', sorteable: false }

      ],
      ListaDeIngresos: [],

      IdIngreso: '',
      IdUsuario: '1',
      IdPersona: '',
      NombreUsuario: '',
      NombreProveedor: '',
      TipoComprobante: '',
      SerieComprobante: '',
      NumeroComprobante: '',
      FechaHoraIngreso: '',
      fechaInicial: '',
      fechaFinal: '',
      Impuesto: 16.0,
      ListaDeComprobantes: ['FACTURA', 'BOLETA', 'TICKET', 'GUIA', 'COTIZACION'],
      ListaDeProveedores: [],
      ErrorArticulo: null,
      codigo: '',

      CabeceraDetallesIngresos: [
        { text: 'Articulo', value: 'nombreArticulo', align: 'start', sorteable: false },
        { text: 'Cantidad', value: 'cantidad', align: 'start', sorteable: false },
        { text: 'Precio', value: 'precio', align: 'start', sorteable: false },
        { text: 'SubTotal', value: 'subTotal', align: 'start', sorteable: false },
        { text: 'Acciones', value: 'borrar', sorteable: false }
      ],

      DetallesIngresos: [],

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
      AdIdIngreso: '',

      VerArticulos: 0,
      VerDetalle: 0,
      verIconoGrabar: 0,
      verListadoDeIngresos: 1,
      verFormularioNuevoIngreso: 0,

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
      for (let i = 0; i < this.DetallesIngresos.length; i++) {
        resultado = resultado + (this.DetallesIngresos[i].cantidad * this.DetallesIngresos[i].precio)
      }
      return resultado
    }
  },

  watch: {
    dialog (val) {
      val || this.Close()
    }
  },

  created () {
    this.SeleccionaProvedor()
    this.ListadoIngresos()
  },

  methods: {
    grabarIngresos () {
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
      console.log(this.DetallesIngresos)

      axios.post('api/Ingresos/InsertarIngreso', {
        idPersona: this.IdPersona,
        idUsuario: this.IdUsuario,
        tipoComprobante: this.TipoComprobante,
        serieComprobante: this.SerieComprobante,
        numeroComprobante: this.NumeroComprobante,
        impuestos: this.Impuesto,
        total: this.total,
        detalles: this.DetallesIngresos
      }).then(function (response) {
        me.ListadoIngresos()
        me.ocultarNuevo()
      }).catch(function (error) {
        console.log('Ocurrio el sigueinte error ==>', error, '<==')
      })
    },
    mostrarNuevo () {
      this.verListadoDeIngresos = 0
      this.verFormularioNuevoIngreso = 1
    },
    ocultarNuevo () {
      this.verListadoDeIngresos = 1
      this.verFormularioNuevoIngreso = 0
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
      if (this.buscaDuplicado(data.IdArtciulo) === 1) {
        this.ErrorArticulo = 'El Articulo ya ha sido agregado'
      } else {
        this.DetallesIngresos.push(
          {
            idArticulo: data.idArticulo,
            nombreArticulo: data.nombreArticulo,
            cantidad: 1,
            precio: data.precioVenta
          }
        )
        console.log(this.DetallesIngresos)
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
      for (let i = 0; i < this.DetallesIngresos.length; i++) {
        if (this.DetallesIngresos[i].idArtciulo === id) { encontro = 1 }
      }
      return encontro
    },

    ListadoIngresos () {
      const me = this
      if (this.fechaFinal === '') {
        axios.get('api/Ingresos/ListarIngresos').then(function (response) {
          me.ListaDeIngresos = response.data
        }).catch(function (error) {
          console.log(error)
        })
      } else {
        console.log(this.fechaFinal + this.fechaInicial)
        axios.get('api/Ingresos/ListadoRangoFechas/' + this.fechaInicial + '/' + this.fechaFinal).then(function (response) {
          me.ListaDeIngresos = response.data
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    ListadoDetallesIngreso (idIngreso) {
      const me = this
      axios.get('api/Ingresos/ListarDetalleIngreso/' + idIngreso).then(function (response) {
        console.log(response.data)
        me.DetallesIngresos = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },

    ListandoArticulos () {
      const me = this
      axios.get('api/Articulos/ListadoArticulos/' + me.Criterio).then(function (response) {
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
      this.Impuesto = item.impuestos
      this.ListadoDetallesIngreso(item.idIngreso)
      this.verFormularioNuevoIngreso = 1
      this.verIconoGrabar = 1
      this.mostrarNuevo()
    },

    mostrarArticulos () {
      this.VerArticulos = 1
    },

    ocultarArticulo () {
      this.VerArticulos = 0
    },

    SeleccionaProvedor () {
      const me = this
      let LstProvedores = []
      axios.get('api/Personas/SeleccionaProveedor').then(function (response) {
        LstProvedores = response.data
        console.log(response.data)
        // eslint-disable-next-line array-callback-return
        LstProvedores.map(function (p) {
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
      this.IdUsuario = '1'
      this.IdPersona = ''
      this.TipoComprobante = ''
      this.SerieComprobante = ''
      this.NumeroComprobante = ''
      this.DetallesIngresos = []
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
      this.AdIdIngreso = item.idIngreso
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
      axios.put('api/Ingresos/DesactivarIngreso/' + this.AdIdIngreso, {}).then(function (response) {
        me.adModal = 0
        me.AdAccion = 0
        me.adModal = ''
        me.AdIdIngreso = 0
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
        this.ValidaMensaje.push('- Selecione un provedor')
      }
      if (!this.Impuesto) {
        this.ValidaMensaje.push('- Capture el impuesto')
      }
      if (this.DetallesIngresos.length <= 0) {
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
