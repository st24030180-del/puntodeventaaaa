const CLAVE_PRODUCTOS = "distrito11_productos";
const CLAVE_PEDIDOS = "distrito11_pedidos";

const productosIniciales = [
    { id: 1, nombre: "Hamburguesa", precio: 90, categoria: "Comida" },
    { id: 2, nombre: "Hamburguesa Doble", precio: 120, categoria: "Comida" },
    { id: 3, nombre: "Alitas", precio: 120, categoria: "Comida" },
    { id: 4, nombre: "Papas", precio: 50, categoria: "Complementos" },
    { id: 5, nombre: "Papas con Queso", precio: 65, categoria: "Complementos" },
    { id: 6, nombre: "Refresco", precio: 30, categoria: "Bebidas" },
    { id: 7, nombre: "Agua", precio: 25, categoria: "Bebidas" }
];

function obtenerProductos() {
    const datos = localStorage.getItem(CLAVE_PRODUCTOS);

    if (!datos) {
        localStorage.setItem(
            CLAVE_PRODUCTOS,
            JSON.stringify(productosIniciales)
        );

        return productosIniciales;
    }

    try {
        return JSON.parse(datos);
    } catch {
        localStorage.setItem(
            CLAVE_PRODUCTOS,
            JSON.stringify(productosIniciales)
        );

        return productosIniciales;
    }
}

function guardarProductos(productos) {
    localStorage.setItem(
        CLAVE_PRODUCTOS,
        JSON.stringify(productos)
    );
}

function obtenerPedidos() {
    const datos = localStorage.getItem(CLAVE_PEDIDOS);

    if (!datos) {
        localStorage.setItem(
            CLAVE_PEDIDOS,
            JSON.stringify([])
        );

        return [];
    }

    try {
        return JSON.parse(datos);
    } catch {
        localStorage.setItem(
            CLAVE_PEDIDOS,
            JSON.stringify([])
        );

        return [];
    }
}

function guardarPedidos(pedidos) {
    localStorage.setItem(
        CLAVE_PEDIDOS,
        JSON.stringify(pedidos)
    );
}