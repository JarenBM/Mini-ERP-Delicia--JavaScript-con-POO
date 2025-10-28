import chalk from 'chalk';

// Servicio para generar tickets de venta con colores
export class TicketService {
    static renderTicket(tienda, cliente) {
        const carrito = tienda.carrito;
        const items = carrito.items();
        
        // Verificar si el carrito está vacío
        if (items.length === 0) {
            return chalk.red('ERROR: El carrito está vacío - No se puede generar ticket');
        }

        // Construir el ticket
        let ticket = chalk.blue.bold('\nRESUMEN DE COMPRA\n');
        ticket += chalk.blue('--------------------------------------------------\n');
        ticket += chalk.white.bold('Producto              Cant.   Precio   Subtotal\n');
        
        // Agregar cada producto al ticket
        items.forEach(item => {
            const nombre = item.producto.nombre.padEnd(20).substring(0, 20);
            const cantidad = item.cantidad.toString().padStart(2);
            const precio = item.producto.precioFormateado().padStart(6);
            const subtotal = `S/${item.subtotal().toFixed(2)}`.padStart(8);
            
            ticket += chalk.white(`${nombre}  ${cantidad}      ${precio}  ${subtotal}\n`);
        });

        // Agregar totales
        ticket += chalk.blue('--------------------------------------------------\n');
        ticket += chalk.white(`Subtotal: ${chalk.yellow(`S/${carrito.subtotal().toFixed(2)}`)}\n`);
        ticket += chalk.white(`Descuento: ${chalk.yellow(`S/${carrito.descuentoEscalonado().toFixed(2)}`)}\n`);
        ticket += chalk.white(`IGV (18%): ${chalk.yellow(`S/${carrito.igv().toFixed(2)}`)}\n`);
        ticket += chalk.white(`TOTAL FINAL: ${chalk.green.bold(`S/${carrito.total().toFixed(2)}`)}\n\n`);
        ticket += chalk.green('¡Gracias por su compra!');

        return ticket;
    }
}