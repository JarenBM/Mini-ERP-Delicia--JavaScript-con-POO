// Clase que representa un cliente
export class Cliente {
    constructor(nombre) {
        this.nombre = nombre;
        this.historial = [];  // Array para guardar compras anteriores
    }

    // Agrega una compra al historial
    agregarCompra(items) {
        this.historial.push(...items);
    }

    // Calcula el total gastado por el cliente
    totalGastado() {
        return this.historial.reduce((total, item) => total + item.subtotal(), 0);
    }

    // Retorna los productos más comprados por el cliente
    productosMasComprados() {
        const ventasPorProducto = new Map();
        
        // Contar cantidad vendida por producto
        this.historial.forEach(item => {
            const nombre = item.producto.nombre;
            const cantidadActual = ventasPorProducto.get(nombre) || 0;
            ventasPorProducto.set(nombre, cantidadActual + item.cantidad);
        });

        // Ordenar de mayor a menor cantidad
        return Array.from(ventasPorProducto.entries())
            .sort((a, b) => b[1] - a[1]);
    }
}