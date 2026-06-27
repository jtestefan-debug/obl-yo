/* Autores: Estefan - Ghirardi
   Materia: Programación I
   Obligatorio 2 - ORT Uruguay */

let sistema = new Sistema();
let ordenInfluencers = 'asc';
let ordenArticulos = 'asc';

const MEDIOS = ['Instagram', 'YouTube', 'X', 'TikTok', 'Facebook', 'Otras'];
const MEDIOS_LABEL = ['1-Instagram', '2-YouTube', '3-X', '4-TikTok', '5-Facebook', '6-Otras'];
const MEDIOS_COLOR = ['#E1306C', '#FF0000', '#555555', '#69C9D0', '#1877F2', '#9B59B6'];

// ── Abrir dialogs ────────────────────────────────────────────────────────────

function abrirDialogInfluencer() {
    document.getElementById('form-influencer').reset();
    document.getElementById('dialog-influencer').showModal();
}

function abrirDialogArticulo() {
    document.getElementById('form-articulo').reset();
    document.getElementById('dialog-articulo').showModal();
}

function abrirDialogVenta() {
    if (sistema.listaArticulos.length === 0 || sistema.listaInfluencers.length === 0) {
        alert('Debe haber al menos un artículo y un influencer registrados para registrar una venta.');
        return;
    }
    llenarSelectArticulos();
    llenarSelectInfluencers();
    document.getElementById('form-venta').reset();
    document.getElementById('dialog-venta').showModal();
}

function llenarSelectArticulos() {
    let select = document.getElementById('articulo');
    select.innerHTML = '';
    for (let articulo of sistema.listaArticulos) {
        let opcion = document.createElement('option');
        opcion.value = articulo.codigo;
        opcion.textContent = articulo.codigo + ' - ' + articulo.descripcion;
        select.appendChild(opcion);
    }
}

function llenarSelectInfluencers() {
    let select = document.getElementById('influencerSelect');
    select.innerHTML = '';
    for (let influencer of sistema.listaInfluencers) {
        let opcion = document.createElement('option');
        opcion.value = influencer.mail;
        opcion.textContent = influencer.nombre;
        select.appendChild(opcion);
    }
}

// ── Handlers de formularios ──────────────────────────────────────────────────

document.getElementById('form-influencer').addEventListener('submit', function(e) {
    e.preventDefault();
    let nombre = document.getElementById('influencerName').value.trim();
    let mail = document.getElementById('mail').value.trim();
    let comision = document.getElementById('comision').value;

    if (!nombre || !mail || comision === '') {
        alert('Todos los campos son requeridos.');
        return;
    }
    if (sistema.existeInfluencer(mail)) {
        alert('Ya existe un influencer con ese mail.');
        return;
    }

    sistema.listaInfluencers.push(new Influencer(nombre, mail, comision));
    document.getElementById('dialog-influencer').close();
    actualizarPagina();
});

document.getElementById('form-articulo').addEventListener('submit', function(e) {
    e.preventDefault();
    let codigo = document.getElementById('codigo').value.trim();
    let descripcion = document.getElementById('descripcion').value.trim();
    let precio = document.getElementById('precio').value;

    if (!codigo || !descripcion || precio === '') {
        alert('Todos los campos son requeridos.');
        return;
    }
    if (sistema.existeArticulo(codigo)) {
        alert('Ya existe un artículo con ese código.');
        return;
    }

    sistema.listaArticulos.push(new Articulo(codigo, descripcion, precio));
    document.getElementById('dialog-articulo').close();
    actualizarPagina();
});

document.getElementById('form-venta').addEventListener('submit', function(e) {
    e.preventDefault();
    let codigoArticulo = document.getElementById('articulo').value;
    let mailInfluencer = document.getElementById('influencerSelect').value;
    let cantidad = Number(document.getElementById('cantidad').value);
    let medio = document.getElementById('Medio').value;

    if (!cantidad || cantidad < 1) {
        alert('La cantidad debe ser mayor a 0.');
        return;
    }

    let articulo = sistema.buscarArticulo(codigoArticulo);
    let influencer = sistema.buscarInfluencer(mailInfluencer);

    sistema.listaVentas.push(new Venta(articulo, influencer, cantidad, medio));
    document.getElementById('dialog-venta').close();
    actualizarPagina();
});

// ── Anular venta ─────────────────────────────────────────────────────────────

function anularVenta(nro) {
    if (!confirm('¿Confirmar anulación de la venta Nro ' + nro + '?')) return;
    let listaFiltrada = [];
    for (let venta of sistema.listaVentas) {
        if (venta.nro !== nro) {
            listaFiltrada.push(venta);
        }
    }
    sistema.listaVentas = listaFiltrada;
    actualizarPagina();
}

// ── Ordenamiento ─────────────────────────────────────────────────────────────

function toggleOrdenInfluencers() {
    if (ordenInfluencers === 'asc') {
        ordenInfluencers = 'desc';
    } else {
        ordenInfluencers = 'asc';
    }
    renderTablaInfluencers();
}

function toggleOrdenArticulos() {
    if (ordenArticulos === 'asc') {
        ordenArticulos = 'desc';
    } else {
        ordenArticulos = 'asc';
    }
    renderTablaArticulos();
}

// ── Render tabla influencers ─────────────────────────────────────────────────

function renderTablaInfluencers() {
    let cuerpo = document.getElementById('tablaInfluencers');
    cuerpo.innerHTML = '';

    let lista = [];
    for (let influencer of sistema.listaInfluencers) {
        lista.push(influencer);
    }
    lista.sort(function(a, b) {
        if (ordenInfluencers === 'asc') {
            return a.nombre.localeCompare(b.nombre);
        } else {
            return b.nombre.localeCompare(a.nombre);
        }
    });

    let maxComision = sistema.maxComisionTotal();
    let maxMonto = sistema.maxMontoVenta();

    for (let influencer of lista) {
        let total = influencer.calcularTotal(sistema.listaVentas);
        let etiquetas = influencer.calcularEtiquetas(sistema.listaVentas, maxComision, maxMonto);
        let fila = document.createElement('tr');
        fila.innerHTML =
            '<td>' + influencer.nombre + '</td>' +
            '<td>' + influencer.mail + '</td>' +
            '<td>' + influencer.comision + '%</td>' +
            '<td>$' + total.toFixed(2) + '</td>' +
            '<td>' + etiquetas + '</td>' +
            '<td><input type="button" value="Ver detalle" onclick="mostrarDetalle(\'' + influencer.mail + '\')"></td>';
        cuerpo.appendChild(fila);
    }
}

// ── Render tabla artículos ───────────────────────────────────────────────────

function renderTablaArticulos() {
    let cuerpo = document.getElementById('tablaArticulos');
    cuerpo.innerHTML = '';

    let lista = [];
    for (let articulo of sistema.listaArticulos) {
        lista.push(articulo);
    }
    lista.sort(function(a, b) {
        if (ordenArticulos === 'asc') {
            return a.codigo.localeCompare(b.codigo);
        } else {
            return b.codigo.localeCompare(a.codigo);
        }
    });

    let maxUnidades = sistema.maxUnidadesVendidas();

    for (let articulo of lista) {
        let unidades = articulo.calcularUnidades(sistema.listaVentas);
        let medalla = '';
        if (maxUnidades > 0 && unidades === maxUnidades) {
            medalla = '⭐';
        }

        let fila = document.createElement('tr');
        fila.innerHTML =
            '<td>' + articulo.codigo + medalla + '</td>' +
            '<td>' + articulo.descripcion + '</td>' +
            '<td>$' + articulo.precio.toFixed(2) + '</td>';
        cuerpo.appendChild(fila);
    }
}

// ── Render tabla ventas ──────────────────────────────────────────────────────

function renderTablaVentas() {
    let cuerpo = document.getElementById('tablaVentas');
    cuerpo.innerHTML = '';

    let lista = [];
    for (let venta of sistema.listaVentas) {
        lista.push(venta);
    }
    lista.sort(function(a, b) { return a.nro - b.nro; });

    for (let venta of lista) {
        let etiquetaMedio = venta.medio;
        for (let i = 0; i < MEDIOS.length; i++) {
            if (MEDIOS[i] === venta.medio) {
                etiquetaMedio = MEDIOS_LABEL[i];
            }
        }

        let fila = document.createElement('tr');
        fila.innerHTML =
            '<td>' + venta.nro + '</td>' +
            '<td>' + venta.articulo.codigo + '</td>' +
            '<td>' + venta.influencer.nombre + '</td>' +
            '<td>' + venta.cantidad + '</td>' +
            '<td>' + etiquetaMedio + '</td>' +
            '<td><input type="button" value="❌" onclick="anularVenta(' + venta.nro + ')"></td>';
        cuerpo.appendChild(fila);
    }
}

// ── Detalle de comisiones ────────────────────────────────────────────────────

function mostrarDetalle(mail) {
    let influencer = sistema.buscarInfluencer(mail);
    if (!influencer) return;

    document.getElementById('detalle-nombre').textContent =
        influencer.nombre + ' — comisión: ' + influencer.comision + '%';

    let cuerpo = document.getElementById('tablaDetalle');
    cuerpo.innerHTML = '';

    let ventasDelInfluencer = [];
    for (let venta of sistema.listaVentas) {
        if (venta.influencer === influencer) {
            ventasDelInfluencer.push(venta);
        }
    }
    ventasDelInfluencer.sort(function(a, b) { return a.nro - b.nro; });

    if (ventasDelInfluencer.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="6">Sin ventas registradas.</td></tr>';
    } else {
        for (let venta of ventasDelInfluencer) {
            let fila = document.createElement('tr');
            fila.innerHTML =
                '<td>' + venta.nro + '</td>' +
                '<td>' + venta.articulo.codigo + ' - ' + venta.articulo.descripcion + '</td>' +
                '<td>$' + venta.articulo.precio.toFixed(2) + '</td>' +
                '<td>' + venta.cantidad + '</td>' +
                '<td>$' + venta.calcularMonto().toFixed(2) + '</td>' +
                '<td>$' + venta.calcularComision().toFixed(2) + '</td>';
            cuerpo.appendChild(fila);
        }
    }

    document.getElementById('dialog-detalle').showModal();
}

// ── Gráfico de burbujas ──────────────────────────────────────────────────────

function dibujarGrafico() {
    let lienzo = document.getElementById('graficoBurbujas');
    let contexto = lienzo.getContext('2d');
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);

    let totales = [];
    for (let i = 0; i < MEDIOS.length; i++) {
        let suma = 0;
        for (let venta of sistema.listaVentas) {
            if (venta.medio === MEDIOS[i]) {
                suma += venta.calcularMonto();
            }
        }
        totales.push(suma);
    }

    let totalMaximo = 0;
    for (let i = 0; i < totales.length; i++) {
        if (totales[i] > totalMaximo) {
            totalMaximo = totales[i];
        }
    }

    let radioMaximo = 70;
    let radioMinimo = radioMaximo * 0.1;
    let anchoPorMedio = lienzo.width / MEDIOS.length;
    let centroY = lienzo.height / 2 - 10;

    contexto.textAlign = 'center';

    for (let i = 0; i < MEDIOS.length; i++) {
        let radio;
        if (totalMaximo > 0) {
            radio = radioMinimo + (totales[i] / totalMaximo) * (radioMaximo - radioMinimo);
        } else {
            radio = radioMinimo;
        }
        let centroX = anchoPorMedio * i + anchoPorMedio / 2;

        contexto.beginPath();
        contexto.arc(centroX, centroY, radio, 0, Math.PI * 2);
        contexto.fillStyle = MEDIOS_COLOR[i];
        contexto.globalAlpha = 0.75;
        contexto.fill();
        contexto.globalAlpha = 1;

        contexto.fillStyle = '#fff';
        contexto.font = 'bold 11px Arial';
        contexto.fillText('$' + totales[i].toFixed(0), centroX, centroY + 4);

        contexto.fillStyle = '#333';
        contexto.font = '11px Arial';
        contexto.fillText(MEDIOS_LABEL[i], centroX, centroY + radio + 16);
    }
}

// ── Actualizar toda la página ────────────────────────────────────────────────

function actualizarPagina() {
    renderTablaInfluencers();
    renderTablaArticulos();
    renderTablaVentas();
    dibujarGrafico();
}

actualizarPagina();
