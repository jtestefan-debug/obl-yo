/* Autores: Estefan - Ghirardi
   Materia: Programación I
   Obligatorio 2 - ORT Uruguay */

class Sistema {
    constructor() {
        this.listaInfluencers = [];
        this.listaArticulos = [];
        this.listaVentas = [];
    }

    existeInfluencer(mail) {
        for (let influencer of this.listaInfluencers) {
            if (influencer.mail === mail) {
                return true;
            }
        }
        return false;
    }

    existeArticulo(codigo) {
        for (let articulo of this.listaArticulos) {
            if (articulo.codigo === codigo) {
                return true;
            }
        }
        return false;
    }

    buscarInfluencer(mail) {
        for (let influencer of this.listaInfluencers) {
            if (influencer.mail === mail) {
                return influencer;
            }
        }
        return null;
    }

    buscarArticulo(codigo) {
        for (let articulo of this.listaArticulos) {
            if (articulo.codigo === codigo) {
                return articulo;
            }
        }
        return null;
    }

    maxComisionTotal() {
        let maximo = 0;
        for (let influencer of this.listaInfluencers) {
            let total = influencer.calcularTotal(this.listaVentas);
            if (total > maximo) {
                maximo = total;
            }
        }
        return maximo;
    }

    maxMontoVenta() {
        let maximo = 0;
        for (let venta of this.listaVentas) {
            let monto = venta.calcularMonto();
            if (monto > maximo) {
                maximo = monto;
            }
        }
        return maximo;
    }

    maxUnidadesVendidas() {
        let maximo = 0;
        for (let articulo of this.listaArticulos) {
            let unidades = articulo.calcularUnidades(this.listaVentas);
            if (unidades > maximo) {
                maximo = unidades;
            }
        }
        return maximo;
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
            if (venta.influencer === this) {
                total += venta.calcularComision();
            }
        }
        return total;
    }

    calcularEtiquetas(listaVentas, maxComision, maxMonto) {
        let tieneVentas = false;
        for (let venta of listaVentas) {
            if (venta.influencer === this) {
                tieneVentas = true;
            }
        }
        if (!tieneVentas) return '🧊';

        let etiquetas = '';

        if (maxComision > 0 && this.calcularTotal(listaVentas) === maxComision) {
            etiquetas += '🔥';
        }

        let montoMaxPropio = 0;
        for (let venta of listaVentas) {
            if (venta.influencer === this) {
                let monto = venta.calcularMonto();
                if (monto > montoMaxPropio) {
                    montoMaxPropio = monto;
                }
            }
        }
        if (montoMaxPropio === maxMonto) {
            etiquetas += '🟢';
        }

        if (etiquetas === '') return '-';
        return etiquetas;
    }
}

class Articulo {
    constructor(codigo, descripcion, precio) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.precio = Number(precio);
    }

    calcularUnidades(listaVentas) {
        let unidades = 0;
        for (let venta of listaVentas) {
            if (venta.articulo === this) {
                unidades += venta.cantidad;
            }
        }
        return unidades;
    }
}

class Venta {
    static contador = 1;

    constructor(articulo, influencer, cantidad, medio) {
        this.nro = Venta.contador++;
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
