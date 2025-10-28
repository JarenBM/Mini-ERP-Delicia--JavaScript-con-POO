import promptSync from 'prompt-sync';
import chalk from 'chalk';
import { Catalogo } from './domain/Catalogo.js';
import { Tienda } from './core/Tienda.js';
import { Cliente } from './domain/Cliente.js';
import { TicketService } from './services/TicketService.js';
import { ReporteService } from './services/ReporteService.js';
import { productos } from './data/productos.js';

// Configurar prompt para leer entrada del usuario
const prompt = promptSync();

// Crear instancias principales
const catalogo = new Catalogo();
const tienda = new Tienda('Panadería Delicia', catalogo);
const cliente = new Cliente('Cliente General');

// Cargar productos en el catálogo
productos.forEach(producto => tienda.agregarProducto(producto));

// Clase controladora del menú principal
class MenuController {
    
    // Muestra el menú de opciones con formato profesional
    static mostrarMenu() {
        console.log(chalk.blue.bold('\n=================================================='));
        console.log(chalk.blue.bold('          SISTEMA DE VENTAS - PANADERÍA DELICIA'));
        console.log(chalk.blue.bold('=================================================='));
        console.log(chalk.cyan('1.  Registrar venta'));
        console.log(chalk.cyan('2.  Listar productos'));
        console.log(chalk.cyan('3.  Buscar producto'));
        console.log(chalk.cyan('4.  Ver carrito'));
        console.log(chalk.cyan('5.  Calcular total'));
        console.log(chalk.cyan('6.  Generar ticket'));
        console.log(chalk.cyan('7.  Reportes'));
        console.log(chalk.cyan('8.  Vaciar carrito'));
        console.log(chalk.cyan('9.  Salir'));
        console.log(chalk.gray('--------------------------------------------------'));
    }

    // Pregunta al usuario y ejecuta la opción seleccionada
    static async preguntarOpcion() {
        const opcion = prompt(chalk.yellow('\nSeleccione una opción (1-9): '));
        
        switch(opcion) {
            case '1':
                await this.registrarVenta();
                break;
            case '2':
                this.listarProductos();
                break;
            case '3':
                await this.buscarProducto();
                break;
            case '4':
                this.verCarrito();
                break;
            case '5':
                this.calcularTotal();
                break;
            case '6':
                await this.generarTicket();
                break;
            case '7':
                this.mostrarReportes();
                break;
            case '8':
                this.vaciarCarrito();
                break;
            case '9':
                this.salir();
                return false;
            default:
                console.log(chalk.red('ERROR: Opción no válida. Por favor seleccione 1-9.'));
                this.presionarContinuar();
        }
        return true;
    }

    // Función para registrar una venta (agregar productos al carrito)
    static async registrarVenta() {
        console.log(chalk.yellow.bold('\nREGISTRAR VENTA'));
        console.log(chalk.gray('--------------------------------------------------'));
        
        let continuar = true;
        let productosAgregados = 0;
        
        while (continuar) {
            const entrada = prompt(chalk.cyan('Producto (nombre o ID): '));
            
            // Validar entrada vacía
            if (!entrada.trim()) {
                console.log(chalk.red('ERROR: Debe ingresar un nombre o ID de producto'));
                continue;
            }

            const cantidadStr = prompt(chalk.cyan('Cantidad: '));
            const cantidad = parseInt(cantidadStr);

            // Validar cantidad
            if (isNaN(cantidad) || cantidad <= 0) {
                console.log(chalk.red('ERROR: La cantidad debe ser un número mayor a 0'));
                continue;
            }

            try {
                let producto;
                
                // Determinar si la entrada es ID o nombre
                if (!isNaN(entrada)) {
                    // Es un ID
                    producto = tienda.agregarAlCarritoPorId(parseInt(entrada), cantidad);
                    console.log(chalk.green(`AGREGADO: ${producto.nombre} agregado al carrito`));
                } else {
                    // Es un nombre - mostrar opciones si hay múltiples
                    const productosEncontrados = tienda.buscarProductos(entrada);
                    
                    if (productosEncontrados.length === 0) {
                        console.log(chalk.red(`NO ENCONTRADO: No se encontraron productos con "${entrada}"`));
                        continue;
                    } else if (productosEncontrados.length === 1) {
                        // Solo un producto encontrado
                        producto = productosEncontrados[0];
                        tienda.agregarAlCarritoPorNombre(entrada, cantidad);
                        console.log(chalk.green(`AGREGADO: ${producto.nombre} agregado al carrito`));
                    } else {
                        // Múltiples productos encontrados
                        console.log(chalk.yellow(`ENCONTRADOS: Se encontraron ${productosEncontrados.length} productos:`));
                        productosEncontrados.forEach((prod, index) => {
                            console.log(chalk.white(`   ${index + 1}. ${prod.nombre} - ${prod.precioFormateado()} (${prod.categoria})`));
                        });
                        
                        const seleccion = prompt(chalk.cyan('\nSeleccione el número del producto (0 para cancelar): '));
                        const seleccionNum = parseInt(seleccion);
                        
                        if (seleccionNum === 0 || isNaN(seleccionNum)) {
                            console.log(chalk.yellow('CANCELADO: Operación cancelada'));
                            continue;
                        }
                        
                        if (seleccionNum < 1 || seleccionNum > productosEncontrados.length) {
                            console.log(chalk.red('ERROR: Selección inválida'));
                            continue;
                        }
                        
                        producto = productosEncontrados[seleccionNum - 1];
                        tienda.carrito.agregar(producto, cantidad);
                        console.log(chalk.green(`AGREGADO: ${producto.nombre} agregado al carrito`));
                    }
                }
                
                productosAgregados++;
                
                // Mostrar resumen del item agregado
                const subtotalItem = producto.precio * cantidad;
                console.log(chalk.blue(`   DETALLE: ${cantidad} x ${producto.precioFormateado()} = S/${subtotalItem.toFixed(2)}`));
                
            } catch (error) {
                console.log(chalk.red(`ERROR: ${error.message}`));
                continue;
            }

            // Preguntar si quiere agregar otro producto
            const respuesta = prompt(chalk.cyan('\n¿Agregar otro producto? (s/n): ')).toLowerCase();
            continuar = respuesta === 's' || respuesta === 'si' || respuesta === 'sí';
        }

        if (productosAgregados > 0) {
            console.log(chalk.green(`\nEXITO: Se agregaron ${productosAgregados} productos al carrito`));
            this.mostrarResumenCarrito();
        }
        
        this.presionarContinuar();
    }

    // Listar todos los productos disponibles con formato profesional
    static listarProductos() {
        console.log(chalk.yellow.bold('\nPRODUCTOS DISPONIBLES'));
        console.log(chalk.gray('--------------------------------------------------'));
        
        const productos = tienda.catalogo.listar();
        
        if (productos.length === 0) {
            console.log(chalk.yellow('No hay productos disponibles'));
            return;
        }

        // Agrupar por categoría
        const productosPorCategoria = {};
        productos.forEach(producto => {
            if (!productosPorCategoria[producto.categoria]) {
                productosPorCategoria[producto.categoria] = [];
            }
            productosPorCategoria[producto.categoria].push(producto);
        });

        // Mostrar por categorías
        Object.keys(productosPorCategoria).forEach(categoria => {
            console.log(chalk.cyan.bold(`\nCATEGORIA: ${categoria.toUpperCase()}`));
            
            productosPorCategoria[categoria].forEach(producto => {
                console.log(chalk.white(`   ${producto.id.toString().padStart(2)}. ${producto.nombre.padEnd(20)} - ${producto.precioFormateado().padStart(8)}`));
            });
        });

        console.log(chalk.gray(`\nTOTAL: ${productos.length} productos disponibles`));
        this.presionarContinuar();
    }

    // Buscar producto por nombre - Versión profesional
    static async buscarProducto() {
        console.log(chalk.yellow.bold('\nBUSCAR PRODUCTO'));
        console.log(chalk.gray('--------------------------------------------------'));
        
        const nombre = prompt(chalk.cyan('Ingrese el nombre del producto a buscar: '));
        
        if (!nombre.trim()) {
            console.log(chalk.red('ERROR: Debe ingresar un nombre para buscar'));
            this.presionarContinuar();
            return;
        }

        const productosEncontrados = tienda.buscarProductos(nombre);
        
        if (productosEncontrados.length === 0) {
            console.log(chalk.red(`NO ENCONTRADO: No se encontraron productos con "${nombre}"`));
            
            // Sugerir búsquedas similares
            const todosProductos = tienda.catalogo.listar();
            const sugerencias = todosProductos
                .filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase().substring(0, 3)))
                .slice(0, 3);
                
            if (sugerencias.length > 0) {
                console.log(chalk.yellow('\nSUGERENCIAS: ¿Quizás quisiste decir?'));
                sugerencias.forEach(prod => {
                    console.log(chalk.white(`   - ${prod.nombre} (${prod.categoria})`));
                });
            }
        } else {
            console.log(chalk.green(`ENCONTRADOS: Se encontraron ${productosEncontrados.length} productos:`));
            console.log(chalk.gray('--------------------------------------------------'));
            
            productosEncontrados.forEach((producto, index) => {
                console.log(chalk.white(`   ${index + 1}. ${producto.nombre}`));
                console.log(chalk.blue(`      Precio: ${producto.precioFormateado()}`));
                console.log(chalk.blue(`      Categoria: ${producto.categoria}`));
                console.log(chalk.blue(`      ID: ${producto.id}`));
                if (index < productosEncontrados.length - 1) {
                    console.log(chalk.gray('      -----------------------------------------------'));
                }
            });

            // Preguntar si quiere agregar al carrito
            if (productosEncontrados.length === 1) {
                const agregar = prompt(chalk.cyan('\n¿Agregar este producto al carrito? (s/n): ')).toLowerCase();
                if (agregar === 's' || agregar === 'si') {
                    const cantidadStr = prompt(chalk.cyan('Cantidad: '));
                    const cantidad = parseInt(cantidadStr);
                    
                    if (!isNaN(cantidad) && cantidad > 0) {
                        try {
                            tienda.carrito.agregar(productosEncontrados[0], cantidad);
                            console.log(chalk.green(`AGREGADO: ${productosEncontrados[0].nombre} agregado al carrito`));
                        } catch (error) {
                            console.log(chalk.red(`ERROR: ${error.message}`));
                        }
                    }
                }
            }
        }
        
        this.presionarContinuar();
    }

// Ver contenido del carrito con formato profesional
static verCarrito() {
    console.log(chalk.yellow.bold('\nCARRITO DE COMPRAS'));
    console.log(chalk.gray('--------------------------------------------------'));
    
    const items = tienda.carrito.items();
    
    if (items.length === 0) {
        console.log(chalk.yellow('El carrito está vacío'));
        console.log(chalk.blue('NOTA: Use la opción 1 para agregar productos'));
        this.presionarContinuar(); //  AGREGADO: Para que no se quede sin continuar
        return;
    } else {
        // Mostrar encabezados
        console.log(chalk.white.bold('   Producto              Cant.   Precio    Subtotal'));
        console.log(chalk.gray('   --------------------------------------------------'));
        
        let totalItems = 0;
        
        // Mostrar cada producto
        items.forEach((item, index) => {
            const nombre = (item.producto.nombre.length > 20) 
                ? item.producto.nombre.substring(0, 17) + '...' 
                : item.producto.nombre.padEnd(20);
                
            const cantidad = item.cantidad.toString().padStart(2);
            const precio = item.producto.precioFormateado().padStart(6);
            const subtotal = `S/${item.subtotal().toFixed(2)}`.padStart(8);
            
            console.log(chalk.white(`   ${nombre} ${cantidad}     ${precio}   ${subtotal}`));
            totalItems += item.cantidad;
        });

        console.log(chalk.gray('   --------------------------------------------------'));
        console.log(chalk.blue(`   Total items: ${totalItems}`));
        console.log(chalk.blue(`   Subtotal: S/${tienda.carrito.subtotal().toFixed(2)}`));
    }
    
    // Mostrar opciones adicionales del carrito (solo si hay productos)
    if (items.length > 0) {
        this.mostrarOpcionesCarrito();
    }
}

// Mostrar opciones de gestión del carrito
static mostrarOpcionesCarrito() {
    const items = tienda.carrito.items();
    
    if (items.length === 0) {
        console.log(chalk.yellow('No hay productos en el carrito para gestionar'));
        this.presionarContinuar();
        return;
    }

    console.log(chalk.yellow('\nOPCIONES DEL CARRITO:'));
    console.log(chalk.white('   1. Eliminar producto'));
    console.log(chalk.white('   2. Vaciar carrito completo'));
    console.log(chalk.white('   3. Volver al menú principal'));
    
    const opcion = prompt(chalk.cyan('\nSeleccione una opción (1-3): '));
    
    switch(opcion) {
        case '1':
            const idEliminar = prompt(chalk.cyan('Ingrese ID del producto a eliminar: '));
            const idNum = parseInt(idEliminar);
            
            if (isNaN(idNum)) {
                console.log(chalk.red('ERROR: Debe ingresar un ID numérico válido'));
                this.mostrarOpcionesCarrito();
                return;
            }
            
            if (tienda.eliminarDelCarrito(idNum)) {
                console.log(chalk.green('EXITO: Producto eliminado del carrito'));
                
                // Verificar si aún hay productos después de eliminar
                if (tienda.carrito.items().length === 0) {
                    console.log(chalk.yellow('El carrito ahora está vacío'));
                    this.presionarContinuar();
                } else {
                    this.verCarrito();  // Mostrar carrito actualizado
                }
            } else {
                console.log(chalk.red('ERROR: Producto no encontrado en el carrito'));
                this.mostrarOpcionesCarrito();
            }
            break;
            
        case '2':
            this.vaciarCarrito(); // LLAMAR A LA FUNCIÓN MEJORADA
            break;
            
        case '3':
            // Volver al menú principal (no hacer nada)
            break;
            
        default:
            console.log(chalk.red('ERROR: Opción no válida'));
            this.mostrarOpcionesCarrito();
    }
}

    // Mostrar resumen rápido del carrito
    static mostrarResumenCarrito() {
        const items = tienda.carrito.items();
        if (items.length === 0) return;

        console.log(chalk.blue.bold('\nRESUMEN ACTUAL DEL CARRITO:'));
        console.log(chalk.gray('--------------------------------------------------'));
        console.log(chalk.white(`   Productos diferentes: ${items.length}`));
        console.log(chalk.white(`   Total de items: ${tienda.carrito.cantidadTotalItems()}`));
        console.log(chalk.white(`   Subtotal: S/${tienda.carrito.subtotal().toFixed(2)}`));
        console.log(chalk.green(`   Total estimado: S/${tienda.carrito.total().toFixed(2)}`));
    }

// Calcular y mostrar totales con formato profesional
static calcularTotal() {
    console.log(chalk.yellow.bold('\nCÁLCULO DE TOTALES'));
    console.log(chalk.gray('--------------------------------------------------'));
    
    const carrito = tienda.carrito;
    const items = carrito.items();
    
    if (items.length === 0) {
        console.log(chalk.yellow('El carrito está vacío'));
        console.log(chalk.blue('NOTA: No se pueden calcular totales sin productos'));
        this.presionarContinuar();
        return;
    }

    // Mostrar desglose detallado
    console.log(chalk.blue('Desglose de la compra:'));
    items.forEach(item => {
        console.log(chalk.white(`   ${item.producto.nombre}: ${item.cantidad} x ${item.producto.precioFormateado()} = S/${item.subtotal().toFixed(2)}`));
    });

    console.log(chalk.gray('   -----------------------------------------------'));
    console.log(chalk.white(`   Subtotal: ${chalk.yellow(`S/${carrito.subtotal().toFixed(2)}`)}`));
    
    const descuento = carrito.descuentoEscalonado();
    if (descuento > 0) {
        console.log(chalk.white(`   Descuento (${this.obtenerPorcentajeDescuento(carrito.subtotal())}%): ${chalk.green(`-S/${descuento.toFixed(2)}`)}`));
    } else {
        console.log(chalk.white(`   Descuento: ${chalk.gray('S/0.00 (Sin descuento)')}`));
    }
    
    console.log(chalk.white(`   IGV (18%): ${chalk.yellow(`S/${carrito.igv().toFixed(2)}`)}`));
    console.log(chalk.gray('   -----------------------------------------------'));
    console.log(chalk.green.bold(`   TOTAL A PAGAR: S/${carrito.total().toFixed(2)}`));
    
    this.presionarContinuar();
}

    // Obtener porcentaje de descuento aplicado
    static obtenerPorcentajeDescuento(subtotal) {
        if (subtotal >= 100) return 15;
        if (subtotal >= 50) return 10;
        if (subtotal >= 20) return 5;
        return 0;
    }

// Generar y mostrar ticket de compra
static async generarTicket() {
    console.log(chalk.yellow.bold('\nGENERAR TICKET DE COMPRA'));
    console.log(chalk.gray('--------------------------------------------------'));
    
    const items = tienda.carrito.items();
    
    // Validar que el carrito no esté vacío
    if (items.length === 0) {
        console.log(chalk.yellow('El carrito está vacío'));
        console.log(chalk.blue('NOTA: No se puede generar ticket sin productos'));
        this.presionarContinuar();
        return;
    }
    
    try {
        // Generar ticket con colores
        const ticket = TicketService.renderTicket(tienda, cliente);
        console.log(ticket);
        
        // Preguntar si quiere finalizar la compra
        const finalizar = prompt(chalk.cyan('\n¿Finalizar compra y registrar venta? (s/n): ')).toLowerCase();
        if (finalizar === 's' || finalizar === 'si') {
            const compra = tienda.finalizarCompra(cliente);
            console.log(chalk.green.bold('\nEXITO: VENTA REGISTRADA EXITOSAMENTE'));
            console.log(chalk.white(`   Fecha: ${compra.fecha.toLocaleString()}`));
            console.log(chalk.white(`   Cliente: ${compra.cliente}`));
            console.log(chalk.white(`   Productos: ${compra.itemsCount}`));
            console.log(chalk.green(`   Total: S/${compra.total.toFixed(2)}`));
            
            // Mostrar estadísticas actualizadas
            try {
                const stats = tienda.obtenerEstadisticas();
                console.log(chalk.blue(`\nESTADISTICAS: ${stats.totalVentas} ventas totales`));
            } catch (error) {
                console.log(chalk.yellow('INFO: No se pudieron cargar las estadísticas'));
            }
        } else {
            console.log(chalk.yellow('CANCELADO: Venta no registrada - El carrito se mantiene intacto'));
        }
    } catch (error) {
        console.log(chalk.red(`ERROR: ${error.message}`));
    }
    
    this.presionarContinuar();
}

    // Mostrar reportes y estadísticas profesionales
    static mostrarReportes() {
        console.log(chalk.yellow.bold('\nREPORTES Y ESTADÍSTICAS'));
        console.log(chalk.gray('--------------------------------------------------'));
        
        // Estadísticas generales
        const stats = tienda.obtenerEstadisticas();
        console.log(chalk.cyan.bold('ESTADÍSTICAS GENERALES:'));
        console.log(chalk.white(`   Total ventas realizadas: ${stats.totalVentas}`));
        console.log(chalk.white(`   Ingresos totales: S/${stats.ingresosTotales.toFixed(2)}`));
        console.log(chalk.white(`   Productos vendidos: ${stats.productosVendidos}`));
        console.log(chalk.white(`   Productos en catálogo: ${tienda.catalogo.totalProductos()}`));

        // Top 3 productos más caros
        console.log(chalk.cyan.bold('\nTOP 3 PRODUCTOS MÁS CAROS:'));
        const masCaros = ReporteService.topMasCaros(tienda.catalogo);
        if (masCaros.length === 0) {
            console.log(chalk.yellow('   No hay productos en el catálogo'));
        } else {
            masCaros.forEach((producto, index) => {
                const posicion = index === 0 ? '1.' : index === 1 ? '2.' : '3.';
                console.log(chalk.white(`   ${posicion} ${producto.nombre} - ${producto.precioFormateado()} (${producto.categoria})`));
            });
        }

        // Productos más vendidos
        console.log(chalk.cyan.bold('\nPRODUCTOS MÁS VENDIDOS:'));
        const masVendidos = ReporteService.masVendidos(tienda.ventas);
        if (masVendidos.length === 0) {
            console.log(chalk.yellow('   No hay ventas registradas aún'));
        } else {
            masVendidos.forEach(([nombre, cantidad], index) => {
                const posicion = index === 0 ? '1.' : index === 1 ? '2.' : '3.';
                console.log(chalk.white(`   ${posicion} ${nombre} - ${cantidad} unidades vendidas`));
            });
        }

        // Resumen del carrito actual
        console.log(chalk.cyan.bold('\nRESUMEN DEL CARRITO ACTUAL:'));
        const resumen = ReporteService.resumenCarrito(tienda.carrito);
        console.log(chalk.white(`   Total de ítems: ${resumen.totalItems}`));
        console.log(chalk.white(`   Monto acumulado: S/${resumen.montoAcumulado.toFixed(2)}`));
        
        this.presionarContinuar();
    }

   // Vaciar el carrito con confirmación y validaciones
static vaciarCarrito() {
    const items = tienda.carrito.items();
    
    if (items.length === 0) {
        console.log(chalk.yellow('\nEl carrito ya está vacío'));
        this.presionarContinuar();
        return;
    }

    console.log(chalk.red.bold('\nVACIAR CARRITO'));
    console.log(chalk.gray('--------------------------------------------------'));
    
    console.log(chalk.yellow(`ADVERTENCIA: Está a punto de eliminar ${items.length} productos del carrito:`));
    items.forEach(item => {
        console.log(chalk.white(`   - ${item.cantidad} x ${item.producto.nombre}`));
    });
    
    const confirmar = prompt(chalk.red('¿Está seguro de que desea vaciar el carrito? (s/n): ')).toLowerCase();
    if (confirmar === 's' || confirmar === 'si') {
        tienda.vaciarCarrito();
        console.log(chalk.green('EXITO: Carrito vaciado exitosamente'));
    } else {
        console.log(chalk.yellow('CANCELADO: Operación cancelada - El carrito se mantiene intacto'));
    }
    
    this.presionarContinuar();
}

    // Función para salir del programa
    static salir() {
        const itemsEnCarrito = tienda.carrito.items().length;
        
        console.log(chalk.blue.bold('\n=================================================='));
        console.log(chalk.blue.bold('                 RESUMEN FINAL'));
        console.log(chalk.blue.bold('=================================================='));
        
        const stats = tienda.obtenerEstadisticas();
        console.log(chalk.white(`   Ventas realizadas: ${stats.totalVentas}`));
        console.log(chalk.white(`   Ingresos totales: S/${stats.ingresosTotales.toFixed(2)}`));
        
        if (itemsEnCarrito > 0) {
            console.log(chalk.yellow(`   AVISO: Tiene ${itemsEnCarrito} productos en el carrito sin comprar`));
        }
        
        console.log(chalk.green('\nGracias por usar el sistema de Panadería Delicia!'));
    }

    // Utilidad para esperar que el usuario presione Enter
    static presionarContinuar() {
        prompt(chalk.gray('\nPresione Enter para continuar...'));
    }

    // Función principal que inicia la aplicación
    static async iniciar() {
        console.log(chalk.green.bold('Iniciando Sistema de Panadería Delicia...'));
        
        let continuar = true;
        
        // Ciclo principal del programa
        while (continuar) {
            console.clear();  // Limpiar consola (opcional)
            this.mostrarMenu();
            continuar = await this.preguntarOpcion();
        }
    }
}

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
    console.log(chalk.red('\nERROR INESPERADO:'), error.message);
    console.log(chalk.yellow('Reinicie la aplicación'));
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(chalk.red('\nPROMESA RECHAZADA:'), reason);
});

// Iniciar la aplicación cuando se ejecute el archivo
MenuController.iniciar().catch(error => {
    console.log(chalk.red('ERROR AL INICIAR:'), error.message);
});