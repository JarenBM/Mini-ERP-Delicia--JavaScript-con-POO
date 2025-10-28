// Servicio para generar reportes y estadísticas
export class ReporteService {
    // Retorna los n productos más caros
    static topMasCaros(catalogo, n = 3) {
        return catalogo.topMasCaros(n);
    }

    // Retorna los n productos más vendidos
    static masVendidos(ventas, n = 3) {
        const ventasPorProducto = new Map();
        
        // Contar cantidad vendida por producto
        ventas.forEach(item => {
            const nombre = item.producto.nombre;
            const cantidadActual = ventasPorProducto.get(nombre) || 0;
            ventasPorProducto.set(nombre, cantidadActual + item.cantidad);
        });

        // Ordenar y retornar los más vendidos
        return Array.from(ventasPorProducto.entries())
            .sort((a, b) => b[1] - a[1])  // Ordenar por cantidad descendente
            .slice(0, n);
    }

    // Retorna resumen del carrito actual
    static resumenCarrito(carrito) {
        return {
            totalItems: carrito.cantidadTotalItems(),
            montoAcumulado: carrito.subtotal()
        };
    }
}