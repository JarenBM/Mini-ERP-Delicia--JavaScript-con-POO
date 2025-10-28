// Clase que maneja el catálogo de productos usando Map
export class Catalogo {
    // Map para almacenar productos (clave: id, valor: producto)
    #productos = new Map();

    // Agrega un producto al catálogo
    agregar(producto) {
        this.#productos.set(producto.id, producto);
    }

    // Retorna todos los productos como array
    listar() {
        return Array.from(this.#productos.values());
    }

    // Busca un producto por ID
    buscarPorId(id) {
        return this.#productos.get(id);
    }

    // Busca un producto por nombre (no distingue mayúsculas/minúsculas)
    buscarPorNombre(nombre) {
        const nombreLower = nombre.toLowerCase();
        return this.listar().find(producto => 
            producto.nombre.toLowerCase().includes(nombreLower)
        );
    }

    // Retorna los n productos más caros
    topMasCaros(n = 3) {
        return this.listar()
            .sort((a, b) => b.precio - a.precio)  // Ordenar de mayor a menor precio
            .slice(0, n);  // Tomar los primeros n
    }
}