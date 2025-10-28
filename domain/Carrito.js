import { ItemCarrito } from './ItemCarrito.js';
// Clase que representa el carrito de compras
export class Carrito {
    // Campo privado (solo accesible dentro de esta clase)
    #items = [];  // Array para almacenar los items del carrito

    // Agrega un producto al carrito
    agregar(producto, cantidad = 1) {
        // Validar cantidad
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        // Buscar si el producto ya está en el carrito
        const itemExistente = this.#items.find(item => 
            item.producto.id === producto.id
        );

        if (itemExistente) {
            // Si ya existe, aumentar la cantidad
            itemExistente.cantidad += cantidad;
        } else {
            // Si no existe, agregar nuevo item
            this.#items.push(new ItemCarrito(producto, cantidad));
        }
    }

    // Elimina un producto del carrito por su ID
    eliminarPorId(id) {
        const index = this.#items.findIndex(item => item.producto.id === id);
        if (index !== -1) {
            this.#items.splice(index, 1);  // Eliminar el item
            return true;
        }
        return false;  // No se encontró el producto
    }

    // Vacía todo el carrito
    vaciar() {
        this.#items = [];
    }

    // Retorna una copia de los items (para proteger el encapsulamiento)
    items() {
        return [...this.#items];  // Retorna copia, no el array original
    }

    // Calcula el subtotal sumando todos los items
    subtotal() {
        return this.#items.reduce((total, item) => total + item.subtotal(), 0);
    }

    // Calcula el descuento según el subtotal
    descuentoEscalonado() {
        const subtotal = this.subtotal();
        if (subtotal >= 100) return subtotal * 0.15;  // 15% descuento
        if (subtotal >= 50) return subtotal * 0.10;   // 10% descuento
        if (subtotal >= 20) return subtotal * 0.05;   // 5% descuento
        return 0;  // Sin descuento
    }

    // Calcula el IGV (18%)
    igv() {
        return (this.subtotal() - this.descuentoEscalonado()) * 0.18;
    }

    // Calcula el total final
    total() {
        return this.subtotal() - this.descuentoEscalonado() + this.igv();
    }

    // Cuenta el total de items en el carrito
    cantidadTotalItems() {
        return this.#items.reduce((total, item) => total + item.cantidad, 0);
    }
}