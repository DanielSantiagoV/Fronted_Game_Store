# 🎮 GameStore Pro - Frontend

<div align="center">
  <img src="https://media.tenor.com/_mOMxTWntRcAAAAi/pepe-gaming.gif" alt="Pepe Gaming" width="300" height="200">
</div>

> **Sistema de Gestión de Inventario para Tienda de Videojuegos**  
> *Interfaz de usuario moderna y responsiva para la gestión completa de productos y ventas*

## 📋 Descripción del Proyecto

Este es el **frontend** de GameStore Pro, una aplicación web moderna diseñada para la gestión integral de inventario de una tienda de videojuegos. La aplicación permite administrar productos, registrar ventas, y monitorear estadísticas en tiempo real con una interfaz de usuario elegante y funcional.

### ✨ Características Principales

- 🛒 **Gestión de Productos**: Agregar, editar y eliminar productos (videojuegos y consolas)
- 💰 **Registro de Ventas**: Sistema completo de ventas con cálculo automático de totales
- 📊 **Dashboard en Tiempo Real**: Estadísticas actualizadas automáticamente
- 🎯 **Filtrado Inteligente**: Filtros por tipo de producto
- 📱 **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- 🎨 **UI Moderna**: Efectos glassmorphism y animaciones fluidas
- 🔔 **Sistema de Notificaciones**: Feedback visual para todas las acciones
- ⚡ **Actualización Automática**: Sincronización cada 30 segundos

## 🛠️ Tecnologías Utilizadas

### Frontend Core
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Frameworks y Librerías
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Animate.css](https://img.shields.io/badge/Animate.css-FF6B6B?style=for-the-badge&logo=animate.css&logoColor=white)

### Backend (Requerido)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)

### Fuentes y Recursos
- **Google Fonts**: Inter (tipografía principal)
- **Iconos**: Emojis nativos para mejor rendimiento
- **CDN**: Tailwind CSS y Animate.css

## 🚀 Instalación y Configuración

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor backend corriendo en `http://localhost:3000`

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Fronted
   ```

2. **Abrir en navegador**
   ```bash
   # Opción 1: Servidor local simple
   python -m http.server 8000
   # Luego abrir: http://localhost:8000
   
   # Opción 2: Live Server (VS Code)
   # Instalar extensión "Live Server" y hacer clic derecho en index.html
   ```

3. **Configurar URL del Backend**
   - La aplicación se conecta por defecto a `http://localhost:3000/api`
   - Puedes cambiar la URL desde la interfaz de usuario
   - La configuración se guarda automáticamente en localStorage

## 📁 Estructura del Proyecto

```
Fronted/
├── 📄 index.html          # Página principal
├── 📁 css/
│   └── 📄 style.css       # Estilos personalizados
├── 📁 js/
│   ├── 📄 main.js         # Lógica principal de la aplicación
│   └── 📄 app.js          # Funciones auxiliares
└── 📄 README.md           # Documentación del proyecto
```

## 🎯 Funcionalidades Detalladas

### 📦 Gestión de Productos
- **Agregar Productos**: Formulario completo con validación
- **Tipos Soportados**: Videojuegos 🎮 y Consolas 🕹️
- **Campos**: Nombre, tipo, precio, cantidad
- **Validaciones**: Precios positivos, cantidades válidas
- **Actualización**: Modificación de stock en tiempo real
- **Eliminación**: Confirmación antes de eliminar

### 💰 Sistema de Ventas
- **Selección de Producto**: Dropdown con productos disponibles
- **Información en Tiempo Real**: Precio unitario y stock disponible
- **Cálculo Automático**: Total de venta calculado dinámicamente
- **Validación de Stock**: No permite vender más de lo disponible
- **Registro Completo**: Fecha, cantidad, precio, total

### 📊 Dashboard de Estadísticas
- **Productos Totales**: Contador de productos en inventario
- **Valor del Inventario**: Suma total del valor de todos los productos
- **Stock Bajo**: Alertas para productos con stock ≤ 5
- **Ventas Realizadas**: Historial completo de transacciones

### 🎨 Características de UI/UX
- **Glassmorphism**: Efectos de cristal modernos
- **Animaciones**: Transiciones suaves con Animate.css
- **Responsive Design**: Adaptable a todos los dispositivos
- **Tema Oscuro**: Interfaz elegante con gradientes
- **Notificaciones**: Sistema de toast para feedback
- **Modales**: Confirmaciones elegantes para acciones críticas

## 🔧 Configuración Avanzada

### Variables de Entorno
```javascript
// En main.js - Configuración de API
let API_URL = 'http://localhost:3000/api';

// Actualización automática cada 30 segundos
setInterval(() => {
    loadProducts();
    loadSales();
}, 30000);
```

### Personalización de Estilos
```css
/* Variables CSS personalizables en style.css */
:root {
    --primary-color: #06b6d4;
    --secondary-color: #a855f7;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
}
```

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px (Layout completo)
- **Tablet**: 768px - 1024px (Grid adaptativo)
- **Mobile**: < 768px (Layout vertical)

### Características Móviles
- Navegación táctil optimizada
- Botones de tamaño adecuado
- Formularios adaptativos
- Notificaciones full-width

## 🔌 Integración con Backend

### Endpoints Requeridos
```
GET    /api/productos     # Obtener todos los productos
POST   /api/productos     # Crear nuevo producto
PUT    /api/productos/:id # Actualizar producto
DELETE /api/productos/:id # Eliminar producto

GET    /api/ventas        # Obtener historial de ventas
POST   /api/ventas        # Registrar nueva venta
```

### Formato de Datos
```javascript
// Producto
{
  "_id": "string",
  "nombre": "string",
  "tipo": "juego" | "consola",
  "precio": number,
  "cantidad": number
}

// Venta
{
  "_id": "string",
  "producto": "producto_id",
  "cantidadVendida": number,
  "precioUnitario": number,
  "total": number,
  "fecha": "ISO_string"
}
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de Conexión al Backend**
   ```
   ❌ Error: No se pudo conectar con el backend
   ```
   - Verificar que el servidor backend esté corriendo
   - Comprobar la URL en la configuración
   - Revisar CORS en el backend

2. **Productos No Cargan**
   - Verificar formato de respuesta del API
   - Comprobar estructura de datos
   - Revisar consola del navegador

3. **Ventas No se Registran**
   - Verificar que el producto tenga stock
   - Comprobar validaciones del backend
   - Revisar formato de datos enviados

## 🚀 Próximas Mejoras

- [ ] 🔐 Sistema de autenticación
- [ ] 📈 Gráficos y reportes avanzados
- [ ] 🏷️ Sistema de categorías
- [ ] 📦 Gestión de proveedores
- [ ] 💾 Exportación de datos
- [ ] 🌙 Modo oscuro/claro
- [ ] 📱 PWA (Progressive Web App)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Desarrollado con ❤️ para la gestión moderna de inventarios**

---

### 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- 📧 Email: [vinascodaniel9@gmail.com]
- 🐛 Issues: [DanielSantiagoV]


---

*¡Gracias por usar GameStore Pro! 🎮✨*