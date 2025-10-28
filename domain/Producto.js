// Clase que representa un producto de la panadería
export class Producto {
    // Constructor: se ejecuta cuando creamos un nuevo producto
    constructor(id, nombre, precio, categoria) {
        this.id = id;           // Número único identificador
        this.nombre = nombre;   // Nombre del producto
        this.precio = precio;   // Precio en soles
        this.categoria = categoria; // Categoría (panadería, pastelería, etc.)
    }

    // Método para formatear el precio como "S/2.00"
    precioFormateado() {
        return `S/${this.precio.toFixed(2)}`;
    }

    // Método para convertir el producto a objeto JSON
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            precio: this.precio,
            categoria: this.categoria
        };
    }
}