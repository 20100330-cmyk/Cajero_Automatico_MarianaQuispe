// Base de datos inicial según la especificación del reto
let cuentas = [
    { nombre: "Mali", saldo: 200, password: "1234", dni: 44788834 },
    { nombre: "Gera", saldo: 150, password: "5678", dni: 10247439 },
    { nombre: "Sabi", saldo: 60, password: "9102", dni: 98005362 }
];

let cuentaSeleccionada = null;
let currentPinInput = "";

// Elementos de la interfaz
const pantallaCuentas = document.getElementById("pantalla-cuentas");
const pantallaLogin = document.getElementById("pantalla-login");
const pantallaMenu = document.getElementById("pantalla-menu");
const pantallaOperacion = document.getElementById("pantalla-operacion");

const listaCuentas = document.getElementById("lista-cuentas");
const loginNombreUsuario = document.getElementById("login-nombre-usuario");
const errorLogin = document.getElementById("error-login");
const bienvenidaMenu = document.getElementById("bienvenida-menu");

const tituloOperacion = document.getElementById("titulo-operacion");
const vistaSaldo = document.getElementById("vista-saldo");
const vistaIngresar = document.getElementById("vista-ingresar");
const vistaRetirar = document.getElementById("vista-retirar");
const montoSaldo = document.getElementById("monto-saldo");

const receiptContainer = document.getElementById("receipt-container");
const receiptType = document.getElementById("receipt-type");
const receiptAmount = document.getElementById("receipt-amount");
const receiptNewBalance = document.getElementById("receipt-new-balance");
const mensajeOperacion = document.getElementById("mensaje-operacion");

// Carga Inicial
document.addEventListener("DOMContentLoaded", () => {
    cargarCuentas();
});

// Renderizar Cuentas Disponibles (Paso 1)
function cargarCuentas() {
    listaCuentas.innerHTML = "";
    cuentas.forEach((cuenta) => {
        const card = document.createElement("div");
        card.className = "account-card";
        card.innerHTML = `
            <div class="acc-user">
                <div class="acc-avatar">
                    <i class="ph-bold ph-user"></i>
                </div>
                <div class="acc-details">
                    <h4>Cuenta de ${cuenta.nombre}</h4>
                    <p>DNI: ${cuenta.dni}</p>
                </div>
            </div>
            <i class="ph-bold ph-caret-right acc-arrow"></i>
        `;
        card.onclick = () => seleccionarCuenta(cuenta);
        listaCuentas.appendChild(card);
    });
}

// Seleccionar Cuenta
function seleccionarCuenta(cuenta) {
    cuentaSeleccionada = cuenta;
    loginNombreUsuario.textContent = cuenta.nombre;
    clearKeypad();
    errorLogin.textContent = "";
    mostrarPantalla(pantallaLogin);
}

// Lógica del Keypad de PIN
function pressKey(num) {
    if (currentPinInput.length < 4) {
        currentPinInput += num;
        updatePinDots();
    }
}

function clearKeypad() {
    currentPinInput = "";
    updatePinDots();
}

function updatePinDots() {
    const dots = document.querySelectorAll(".dot-pin");
    dots.forEach((dot, index) => {
        if (index < currentPinInput.length) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

// Validar PIN ingresado
function validarPIN() {
    if (currentPinInput === cuentaSeleccionada.password) {
        bienvenidaMenu.textContent = `Hola, ${cuentaSeleccionada.nombre}`;
        mostrarPantalla(pantallaMenu);
    } else {
        errorLogin.textContent = "Contraseña incorrecta. Intenta nuevamente.";
        clearKeypad();
    }
}

// Menú de opciones
function mostrarOpcion(opcion) {
    ocultarVistasOperacion();
    ocultarRecibo();
    mensajeOperacion.textContent = "";
    mostrarPantalla(pantallaOperacion);

    if (opcion === 'saldo') {
        tituloOperacion.textContent = "Consulta de Saldo";
        montoSaldo.textContent = `S/ ${cuentaSeleccionada.saldo.toFixed(2)}`;
        vistaSaldo.classList.remove("hidden");
    } else if (opcion === 'ingresar') {
        tituloOperacion.textContent = "Ingresar Monto";
        document.getElementById("input-ingreso").value = "";
        vistaIngresar.classList.remove("hidden");
    } else if (opcion === 'retirar') {
        tituloOperacion.textContent = "Retirar Monto";
        document.getElementById("input-retiro").value = "";
        vistaRetirar.classList.remove("hidden");
    }
}

// Accesos Rápidos de Monto
function setMontoIngreso(monto) {
    document.getElementById("input-ingreso").value = monto;
}

function setMontoRetiro(monto) {
    document.getElementById("input-retiro").value = monto;
}

// Procesar Depósito
function procesarIngreso() {
    const input = document.getElementById("input-ingreso");
    const monto = parseFloat(input.value);

    if (isNaN(monto) || monto <= 0) {
        mensajeOperacion.textContent = "Por favor, ingresa un monto válido mayor a S/ 0.";
        return;
    }

    cuentaSeleccionada.saldo += monto;
    mostrarRecibo("Depósito de Efectivo", monto);
    input.value = "";
    mensajeOperacion.textContent = "";
}

// Procesar Retiro con Regla de Negocio (Saldo >= 0)
function procesarRetiro() {
    const input = document.getElementById("input-retiro");
    const monto = parseFloat(input.value);

    if (isNaN(monto) || monto <= 0) {
        mensajeOperacion.textContent = "Por favor, ingresa un monto válido mayor a S/ 0.";
        return;
    }

    // Regla de Negocio: Saldo mínimo 0
    if (cuentaSeleccionada.saldo - monto < 0) {
        mensajeOperacion.textContent = `Fondos insuficientes. Tu saldo actual es S/ ${cuentaSeleccionada.saldo.toFixed(2)} y no puedes quedar con menos de S/ 0.00.`;
        return;
    }

    cuentaSeleccionada.saldo -= monto;
    mostrarRecibo("Retiro de Efectivo", monto);
    input.value = "";
    mensajeOperacion.textContent = "";
}

// Generar Voucher / Recibo
function mostrarRecibo(tipo, monto) {
    ocultarVistasOperacion();
    receiptType.textContent = tipo;
    receiptAmount.textContent = `S/ ${monto.toFixed(2)}`;
    receiptNewBalance.textContent = `S/ ${cuentaSeleccionada.saldo.toFixed(2)}`;
    receiptContainer.classList.remove("hidden");
}

function ocultarRecibo() {
    receiptContainer.classList.add("hidden");
}

// Navegación
function volverASeleccion() {
    cuentaSeleccionada = null;
    mostrarPantalla(pantallaCuentas);
}

function volverAlMenu() {
    mostrarPantalla(pantallaMenu);
}

function cerrarSesion() {
    volverASeleccion();
}

function mostrarPantalla(pantallaAMostrar) {
    [pantallaCuentas, pantallaLogin, pantallaMenu, pantallaOperacion].forEach(p => p.classList.remove("active"));
    pantallaAMostrar.classList.add("active");
}

function ocultarVistasOperacion() {
    [vistaSaldo, vistaIngresar, vistaRetirar].forEach(v => v.classList.add("hidden"));
}