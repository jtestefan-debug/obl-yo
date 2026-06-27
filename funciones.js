let sistema = new Sistema();
function tablaInfluencers() {
    let tablaInfluencers = document.getElementById("tablaInfluencers");
    tablaInfluencers.innerHTML = "";
    for (let influencer of sistema.listaInfluencers) {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${influencer.nombre}</td>
            <td>${influencer.mail}</td>
            <td>${influencer.comision}%</td>
            <td>${influencer.calcularTotal(sistema.listaVentas)}</td>
            <td>${calcularEtiquetas(influencer)}</td>
            <td><input type="button" value="ventas" onclick="mostrarDetalle('${influencer.mail}')"></td>
        `;
        tablaInfluencers.appendChild(fila);
    }
}