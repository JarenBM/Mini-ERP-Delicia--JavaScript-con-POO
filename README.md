# Mini ERP Delicia – Proyecto en JavaScript con POO

## 1. Descripción general del proyecto
El proyecto **Mini ERP Delicia** es una aplicación desarrollada en **JavaScript** que implementa los fundamentos de la **Programación Orientada a Objetos (POO)** para la gestión básica de un sistema empresarial. Su propósito es simular un entorno de administración simplificado, donde se pueden realizar operaciones como registrar productos, gestionar un catálogo, crear carritos de compra y calcular totales. Este proyecto se orienta principalmente al aprendizaje práctico del paradigma POO, mediante el uso de clases, módulos y funciones estructuradas.

## 2. Objetivo y propósito educativo
El objetivo principal del proyecto es demostrar cómo la Programación Orientada a Objetos puede aplicarse en un contexto empresarial, mediante un sistema que organice información y operaciones de forma estructurada y reutilizable. Desde un enfoque educativo, busca reforzar la comprensión de conceptos como clases, métodos, atributos, instancias y relaciones entre objetos, mostrando cómo estas estructuras permiten crear programas más claros, escalables y fáciles de mantener.

## 3. Diseño y estructura orientada a objetos
El diseño del sistema sigue una estructura modular y orientada a objetos. Cada clase representa una entidad o componente funcional del sistema, lo que facilita la organización del código y la separación de responsabilidades. En términos generales, se aplican los principios básicos de la POO:
- **Encapsulamiento:** cada clase agrupa sus propios atributos y métodos, limitando el acceso directo a los datos y permitiendo su manipulación mediante funciones específicas.
- **Abstracción:** las clases modelan entidades del mundo real (como productos o carritos), mostrando solo la información y las operaciones necesarias para su uso.
- **Herencia y polimorfismo:** aunque en este proyecto no se utilizan jerarquías complejas, el diseño modular permite extender fácilmente las clases o redefinir comportamientos en versiones futuras.

## 4. Componentes principales y su función
El sistema está compuesto por las siguientes clases y módulos principales:

- **Producto:** representa los productos del catálogo, almacenando información como nombre, precio y cantidad disponible.
- **Catalogo:** contiene y administra los objetos de tipo Producto, ofreciendo métodos para agregar, mostrar o buscar productos.
- **Carrito:** gestiona los productos seleccionados por el usuario, permitiendo calcular subtotales y totales de compra.
- **Ticket:** genera un comprobante de venta con el detalle de los productos y montos finales.
- **app.js:** actúa como el programa principal, integrando todos los módulos y gestionando la interacción con el usuario mediante un menú en consola.

Esta estructura modular permite que cada clase cumpla un rol específico dentro del sistema, favoreciendo la claridad del código y su mantenimiento.

## 5. Flujo de ejecución del programa
El programa principal inicia ejecutando un menú interactivo en la consola, desde el cual el usuario puede elegir diferentes opciones. El flujo general es el siguiente:

1. Mostrar el menú principal con las opciones disponibles.
2. Registrar productos en el catálogo o listarlos.
3. Agregar productos al carrito.
4. Calcular el total de la compra.
5. Generar y mostrar el ticket con el detalle final.

Cada opción invoca métodos de las clases correspondientes, demostrando la interacción entre objetos y la modularidad del código.

## 6. Instrucciones de instalación y uso
1. Clonar o descargar el repositorio del proyecto.
2. Asegurarse de tener instalado **Node.js** en el sistema.
3. Abrir la terminal en la carpeta principal del proyecto.
4. Instalar las dependencias necesarias con el comando:
   ```bash
   npm install
   ```
5. Ejecutar el programa con el comando:
   ```bash
   node app.js
   ```
6. Seguir las instrucciones mostradas en consola para navegar por las opciones del sistema.

## 7. Ejemplo de ejecución
Al ejecutar el programa, se muestra un menú en consola similar al siguiente:

```
===== Mini ERP Delicia =====
1. Registrar producto
2. Mostrar catálogo
3. Agregar al carrito
4. Mostrar carrito
5. Calcular total
6. Generar ticket
0. Salir
```

El usuario puede ingresar los datos de los productos, agregarlos al carrito y finalmente generar un ticket con el total calculado. Este flujo permite observar de manera práctica la relación entre los objetos y cómo interactúan para cumplir una tarea común.

## 8. Conclusión sobre la aplicación del paradigma POO
El desarrollo de **Mini ERP Delicia** demuestra de manera práctica cómo los principios de la Programación Orientada a Objetos permiten construir sistemas organizados, comprensibles y escalables. El uso de clases y objetos facilita la administración de información empresarial, el control de las operaciones y la reutilización del código. De esta forma, el proyecto no solo cumple una función técnica, sino también educativa, ayudando a consolidar los conocimientos fundamentales del paradigma POO mediante su aplicación en un caso práctico.
