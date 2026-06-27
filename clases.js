class Sistema {
    constructor() {
        this.listaInfluencers = [];
        this.listaArticulos = [];
        this.listaVentas = [];
    }
}
class Influencer {
    constructor(nombre, mail, comision) {
        this.nombre = nombre;
        this.mail = mail;
        this.comision = Number(comision);
    }
    calcularTotal(listaVentas) {
    let total = 0;
    for (let venta of listaVentas) {
        if (venta.articulo === this) {
            total += venta.articulo.precio * venta.cantidad * (this.comision / 100);
        }
    }
    return total;
}   
}

class Articulo {
    constructor(codigo, descripcion, precio) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.precio = Number(precio);
    }
}
class Venta {
  static contador = 1; 

  constructor(articulo, influencer, cantidad, medio) {
    this.nro = Venta.contador; 
    Venta.contador++;          
    this.articulo = articulo;
    this.influencer = influencer;
    this.cantidad = Number(cantidad);
    this.medio = medio;
  }
  calcularMonto() {
    return this.articulo.precio * this.cantidad;
  }     
  calcularComision() {
    return this.calcularMonto() * (this.influencer.comision / 100);
  } 
}
