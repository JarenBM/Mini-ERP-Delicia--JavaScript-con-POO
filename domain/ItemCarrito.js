// Clase que representa un item en el carrito (producto + cantidad)
export class ItemCarrito {
    constructor(producto, cantidad = 1) {
        // Validar que la cantidad sea mayor a 0
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        this.producto = producto;   // Objeto Producto
        this.cantidad = cantidad;   // Cantidad del producto
    }

    // Calcula el subtotal del item (precio × cantidad)
    subtotal() {
        return this.producto.precio * this.cantidad;
    }

    // Convierte el item a objeto JSON
    toJSON() {
        return {
            producto: this.producto.toJSON(),
            cantidad: this.cantidad,
            subtotal: this.subtotal()
        };
    }
}