import { Tienda } from './Tienda.js';

// Clase que hereda de Tienda y agrega funcionalidades online
export class TiendaOnline extends Tienda {
    // Calcula costo de envío
    calcularEnvio(subtotal) {
        if (subtotal > 50) return 0;  // Envío gratis para compras > S/50
        return 8.00;  // Costo fijo de envío
    }

    // Sobrescribe el método finalizarCompra para agregar envío
    finalizarCompra(cliente) {
        // Primero ejecuta el método de la clase padre
        const compraBase = super.finalizarCompra(cliente);
        
        // Calcula costo de envío
        const costoEnvio = this.calcularEnvio(compraBase.subtotal);
        
        // Agrega envío al resumen
        compraBase.envio = costoEnvio;
        compraBase.total += costoEnvio;
        
        return compraBase;
    }
}