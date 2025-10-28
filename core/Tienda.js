import { Carrito } from '../domain/Carrito.js';

// Clase principal que representa la tienda física
export class Tienda {
    constructor(nombre, catalogo) {
        this.nombre = nombre;       // Nombre de la tienda
        this.catalogo = catalogo;   // Catálogo de productos
        this.carrito = new Carrito();  // Carrito de compras
        this.ventas = [];           // Historial de ventas
    }

    // Agrega un producto al catálogo
    agregarProducto(producto) {
        this.catalogo.agregar(producto);
    }

    // Agrega producto al carrito por ID
    agregarAlCarritoPorId(id, cantidad = 1) {
        const producto = this.catalogo.buscarPorId(id);
        if (!producto) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
        this.carrito.agregar(producto, cantidad);
        return producto;
    }

    // Agrega producto al carrito por nombre
    agregarAlCarritoPorNombre(nombre, cantidad = 1) {
        const producto = this.catalogo.buscarPorNombre(nombre);
        if (!producto) {
            throw new Error(`Producto "${nombre}" no encontrado`);
        }
        this.carrito.agregar(producto, cantidad);
        return producto;
    }

    // Elimina producto del carrito
    eliminarDelCarrito(id) {
        return this.carrito.eliminarPorId(id);
    }

    // Vacía el carrito
    vaciarCarrito() {
        this.carrito.vaciar();
    }

    // Finaliza la compra y registra la venta
    finalizarCompra(cliente) {
        if (this.carrito.items().length === 0) {
            throw new Error('No hay productos en el carrito');
        }

        // Obtener items del carrito
        const itemsCompra = this.carrito.items();
        
        // Agregar al historial del cliente
        cliente.agregarCompra(itemsCompra);
        
        // Registrar en ventas de la tienda
        this.ventas.push(...itemsCompra);
        
        // Crear resumen de la compra
        const resumenCompra = {
            cliente: cliente.nombre,
            items: itemsCompra.map(item => item.toJSON()),
            subtotal: this.carrito.subtotal(),
            descuento: this.carrito.descuentoEscalonado(),
            igv: this.carrito.igv(),
            total: this.carrito.total(),
            fecha: new Date()
        };

        // Vaciar carrito después de la compra
        this.vaciarCarrito();
        return resumenCompra;
    }
}