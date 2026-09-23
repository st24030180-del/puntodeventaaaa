const CLAVE_PRODUCTOS = "distrito11_productos";
const CLAVE_PEDIDOS = "distrito11_pedidos";

const productosIniciales = [
    { id: 1, nombre: "Ron", precio: 60, categoria: "Bebidas" },
    { id: 2, nombre: "Limonada Natural", precio: 50, categoria: "Bebidas" },
    { id: 3, nombre: "Limonada Mineral", precio: 60, categoria: "Bebidas" },
    { id: 4, nombre: "Margaritas", precio: 80, categoria: "Bebidas" },
    { id: 5, nombre: "Vamoiros", precio: 90, categoria: "Bebidas" },
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
