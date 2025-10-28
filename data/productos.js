import { Producto } from '../domain/Producto.js';

// Array con los productos iniciales de la panadería
export const productos = [
    new Producto(1, "Pan Francés", 2.00, "panaderia"),
    new Producto(2, "Pan Integral", 2.50, "panaderia"),
    new Producto(3, "Croissant", 3.00, "panaderia"),
    new Producto(4, "Torta Chocolate", 25.00, "pasteleria"),
    new Producto(5, "Cheesecake", 30.00, "pasteleria"),
    new Producto(6, "Leche", 3.50, "lacteos"),
    new Producto(7, "Queso", 7.00, "lacteos"),
    new Producto(8, "Galletas", 4.00, "snacks"),
    new Producto(9, "Empanada", 5.00, "panaderia"),
    new Producto(10, "Torta Red Velvet", 35.00, "pasteleria"),
    new Producto(11, "Café", 8.00, "bebidas"),
    new Producto(12, "Jugo Natural", 6.00, "bebidas")
];