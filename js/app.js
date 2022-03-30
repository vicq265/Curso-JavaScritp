// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos

evenListeners();
function evenListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}


// Clases 
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
    }

}

class UI {
    isertarPresupuesto(cantidad){
        // Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // crear el div alerta o exito
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje
        divMensaje.textContent = mensaje;

        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }
    
    agregarGastoListado(gastos) {
        
        this.limpiarLista()
        
        // iterar sobre los gastos
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            // Crear un LI con
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id; // hace lo mismo q (setAttribute)

            // Agregar el HMTL del gasto
            nuevoGasto.innerHTML = `
                ${nombre}<span class="badge badge-primary badge-pill"> $${cantidad} </span>
            `;

            // Boton para borrar el gasto gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';

            // Agregando boton cerrar al li del gasto
            nuevoGasto.appendChild(btnBorrar)

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);

        })
    }

     limpiarLista() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
}




// Instanciar 
const ui = new UI();
let presupuesto;

// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    // console.log( Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
        return;
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario)

    ui.isertarPresupuesto(presupuesto);
}

// A#ade gastos
function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = document.querySelector('#cantidad').value;

    // Validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        
        return;
    } else if ( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
    
        return;
    }

    // Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() } 

    // A#ade un nuevo gasto
    presupuesto.nuevoGasto( gasto );

    // Imprimir alerta
    ui.imprimirAlerta('Gasto Agregado corretamente');

    // Imprimir los gastos
    const { gastos } = presupuesto;
    ui.agregarGastoListado(gastos);

    formulario.reset();
}  