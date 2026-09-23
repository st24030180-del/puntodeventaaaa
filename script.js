let productos = obtenerProductos();
let pedidos = obtenerPedidos();
let carrito = [];
let categoriaActual = "Todos";

function dinero(valor) {
    return "$" + Number(valor).toFixed(2);
}

function mostrarSeccion(id, boton) {
    document.querySelectorAll(".seccion").forEach(seccion => {
        seccion.classList.remove("activa");
    });

    const seccion = document.getElementById(id);

    if (seccion) {
        seccion.classList.add("activa");
    }

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (boton) {
        boton.classList.add("active");
    }

    if (id === "pedidos") {
        mostrarPedidos();
    }

    if (id === "productos") {
        mostrarProductosAdmin();
    }
}

function mostrarCategorias() {
    const contenedor = document.getElementById("categorias");

    if (!contenedor) return;

    const categorias = [
        "Todos",
        ...new Set(productos.map(producto => producto.categoria))
    ];

    contenedor.innerHTML = "";

    categorias.forEach(categoria => {
        const boton = document.createElement("button");

        boton.className = "categoria";

        if (categoria === categoriaActual) {
            boton.classList.add("active");
        }

        boton.textContent = categoria;

        boton.onclick = function() {
            seleccionarCategoria(categoria);
        };

        contenedor.appendChild(boton);
    });
}

function seleccionarCategoria(categoria) {
    categoriaActual = categoria;
    mostrarCategorias();
    mostrarProductosVenta();
}

function mostrarProductosVenta() {
    const contenedor = document.getElementById("productosVenta");

    if (!contenedor) return;

    const lista = categoriaActual === "Todos"
        ? productos
        : productos.filter(
            producto => producto.categoria === categoriaActual
        );

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="vacio">
                No hay productos disponibles.
            </div>
        `;
        return;
    }

    contenedor.innerHTML = "";

    lista.forEach(producto => {
        const tarjeta = document.createElement("div");

        tarjeta.className = "producto";

        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>
            <div class="precio">${dinero(producto.precio)}</div>
            <button class="btn-principal">AGREGAR</button>
        `;

        tarjeta.querySelector("button").onclick = function() {
            agregarAlCarrito(producto.id);
        };

        contenedor.appendChild(tarjeta);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(item => item.id === id);

    if (!producto) return;

    const existente = carrito.find(item => item.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: 1
        });
    }

    mostrarCarrito();
}

function cambiarCantidad(id, cantidad) {
    const producto = carrito.find(item => item.id === id);

    if (!producto) return;

    producto.cantidad += cantidad;

    if (producto.cantidad <= 0) {
        carrito = carrito.filter(item => item.id !== id);
    }

    mostrarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    mostrarCarrito();
}

function mostrarCarrito() {
    const contenedor = document.getElementById("carrito");

    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                No hay productos en el pedido.
            </div>
        `;
    } else {
        contenedor.innerHTML = "";

        carrito.forEach(item => {
            const elemento = document.createElement("div");

            elemento.className = "carrito-item";

            elemento.innerHTML = `
                <div class="carrito-superior">
                    <strong>${item.nombre}</strong>
                    <strong>${dinero(item.precio * item.cantidad)}</strong>
                </div>

                <div class="controles">
                    <button class="menos">−</button>
                    <span>${item.cantidad}</span>
                    <button class="mas">+</button>
                    <button class="eliminar">X</button>
                </div>
            `;

            elemento.querySelector(".menos").onclick = function() {
                cambiarCantidad(item.id, -1);
            };

            elemento.querySelector(".mas").onclick = function() {
                cambiarCantidad(item.id, 1);
            };

            elemento.querySelector(".eliminar").onclick = function() {
                eliminarDelCarrito(item.id);
            };

            contenedor.appendChild(elemento);
        });
    }

    calcularTotal();
}

function calcularTotal() {
    const total = carrito.reduce(
        (suma, item) => suma + item.precio * item.cantidad,
        0
    );

    const elemento = document.getElementById("total");

    if (elemento) {
        elemento.textContent = dinero(total);
    }
}

function limpiarPedido() {
    carrito = [];

    const mesa = document.getElementById("mesa");

    if (mesa) {
        mesa.value = "";
    }

    mostrarCarrito();
}

function guardarPedido() {
    const mesa = document.getElementById("mesa");

    if (!mesa || !mesa.value) {
        alert("Selecciona una mesa.");
        return;
    }

    if (carrito.length === 0) {
        alert("Agrega productos al pedido.");
        return;
    }

    const total = carrito.reduce(
        (suma, item) => suma + item.precio * item.cantidad,
        0
    );

    const numero = pedidos.length > 0
        ? Math.max(...pedidos.map(pedido => pedido.numero)) + 1
        : 1;

    const nuevoPedido = {
        id: Date.now(),
        numero: numero,
        mesa: mesa.value,
        productos: JSON.parse(JSON.stringify(carrito)),
        total: total,
        estado: "Pendiente",
        fecha: new Date().toLocaleString("es-MX")
    };

    pedidos.unshift(nuevoPedido);

    guardarPedidos(pedidos);

    carrito = [];
    mesa.value = "";

    mostrarCarrito();
    mostrarPedidos();

    alert("Pedido #" + numero + " guardado correctamente.");
}

function siguienteEstado(id) {
    const pedido = pedidos.find(item => item.id === id);

    if (!pedido) return;

    if (pedido.estado === "Pendiente") {
        pedido.estado = "Preparando";
    } else if (pedido.estado === "Preparando") {
        pedido.estado = "Listo";
    } else if (pedido.estado === "Listo") {
        pedido.estado = "Entregado";
    }

    guardarPedidos(pedidos);
    mostrarPedidos();
}

function eliminarPedido(id) {
    if (!confirm("¿Quieres eliminar este pedido?")) {
        return;
    }

    pedidos = pedidos.filter(
        pedido => pedido.id !== id
    );

    guardarPedidos(pedidos);
    mostrarPedidos();
}

function claseEstado(estado) {
    if (estado === "Pendiente") {
        return "pendiente";
    }

    if (estado === "Preparando") {
        return "preparando";
    }

    if (estado === "Listo") {
        return "listo";
    }

    return "entregado";
}

function mostrarPedidos() {
    const contenedor = document.getElementById("listaPedidos");

    if (!contenedor) return;

    if (pedidos.length === 0) {
        contenedor.innerHTML = `
            <div class="vacio">
                No hay pedidos registrados.
            </div>
        `;

        actualizarVentas();
        return;
    }

    contenedor.innerHTML = "";

    pedidos.forEach(pedido => {
        const tarjeta = document.createElement("div");

        tarjeta.className = "order-card";

        let productosHTML = "";

        pedido.productos.forEach(producto => {
            productosHTML += `
                ${producto.cantidad} × ${producto.nombre}
                — ${dinero(producto.precio * producto.cantidad)}
                <br>
            `;
        });

        tarjeta.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-number">
                        PEDIDO #${pedido.numero}
                    </div>
                    <div>${pedido.mesa}</div>
                </div>

                <span class="estado ${claseEstado(pedido.estado)}">
                    ${pedido.estado}
                </span>
            </div>

            <div class="order-items">
                ${productosHTML}
            </div>

            <div class="order-total">
                ${dinero(pedido.total)}
            </div>

            <small>${pedido.fecha}</small>

            <div class="order-actions">
                ${
                    pedido.estado !== "Entregado"
                    ? `<button class="btn-estado">SIGUIENTE ESTADO</button>`
                    : ""
                }

                <button class="btn-eliminar">
                    ELIMINAR
                </button>
            </div>
        `;

        const siguiente = tarjeta.querySelector(".btn-estado");
        const eliminar = tarjeta.querySelector(".btn-eliminar");

        if (siguiente) {
            siguiente.onclick = function() {
                siguienteEstado(pedido.id);
            };
        }

        eliminar.onclick = function() {
            eliminarPedido(pedido.id);
        };

        contenedor.appendChild(tarjeta);
    });

    actualizarVentas();
}

function actualizarVentas() {
    const elemento = document.getElementById("ventasTotales");

    if (!elemento) return;

    const ventas = pedidos
        .filter(pedido => pedido.estado === "Entregado")
        .reduce(
            (suma, pedido) => suma + Number(pedido.total),
            0
        );

    elemento.textContent = "Ventas: " + dinero(ventas);
}

function guardarProducto() {
    const id = document.getElementById("productoId").value;
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = Number(
        document.getElementById("precioProducto").value
    );
    const categoria = document.getElementById("categoriaProducto").value.trim();

    if (!nombre || precio <= 0 || !categoria) {
        alert("Completa todos los campos.");
        return;
    }

    if (id) {
        const producto = productos.find(
            item => item.id === Number(id)
        );

        if (producto) {
            producto.nombre = nombre;
            producto.precio = precio;
            producto.categoria = categoria;
        }
    } else {
        productos.push({
            id: Date.now(),
            nombre: nombre,
            precio: precio,
            categoria: categoria
        });
    }

    guardarProductos(productos);

    cancelarEdicion();
    actualizarTodo();
}

function editarProducto(id) {
    const producto = productos.find(
        item => item.id === id
    );

    if (!producto) return;

    document.getElementById("productoId").value = producto.id;
    document.getElementById("nombreProducto").value = producto.nombre;
    document.getElementById("precioProducto").value = producto.precio;
    document.getElementById("categoriaProducto").value = producto.categoria;

    document.getElementById("nombreProducto").focus();
}

function eliminarProducto(id) {
    if (!confirm("¿Quieres eliminar este producto?")) {
        return;
    }

    productos = productos.filter(
        producto => producto.id !== id
    );

    guardarProductos(productos);
    actualizarTodo();
}

function cancelarEdicion() {
    document.getElementById("productoId").value = "";
    document.getElementById("nombreProducto").value = "";
    document.getElementById("precioProducto").value = "";
    document.getElementById("categoriaProducto").value = "";
}

function mostrarProductosAdmin() {
    const contenedor = document.getElementById("listaProductosAdmin");

    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="vacio">
                No hay productos.
            </div>
        `;
        return;
    }

    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const elemento = document.createElement("div");

        elemento.className = "admin-producto";

        elemento.innerHTML = `
            <div class="admin-info">
                <strong>${producto.nombre}</strong>
                <span>
                    ${dinero(producto.precio)}
                    · ${producto.categoria}
                </span>
            </div>

            <div class="admin-actions">
                <button class="editar">EDITAR</button>
                <button class="eliminar-producto">ELIMINAR</button>
            </div>
        `;

        elemento.querySelector(".editar").onclick = function() {
            editarProducto(producto.id);
        };

        elemento.querySelector(".eliminar-producto").onclick = function() {
            eliminarProducto(producto.id);
        };

        contenedor.appendChild(elemento);
    });
}

function actualizarTodo() {
    productos = obtenerProductos();

    mostrarCategorias();
    mostrarProductosVenta();
    mostrarProductosAdmin();
    mostrarPedidos();
}

function actualizarFecha() {
    const elemento = document.getElementById("fecha");

    if (!elemento) return;

    elemento.textContent = new Date().toLocaleDateString(
        "es-MX",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

document.addEventListener("DOMContentLoaded", function() {
    actualizarFecha();
    actualizarTodo();
    mostrarCarrito();
});