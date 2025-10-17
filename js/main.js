// ===== Variables Globales =====
let API_URL = 'http://localhost:3000/api';
let productos = [];
let ventas = [];
let deleteCallback = null;
let currentFilter = 'todos';

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Cargar URL guardada del localStorage
    const savedUrl = localStorage.getItem('apiUrl');
    if (savedUrl) {
        document.getElementById('apiUrl').value = savedUrl;
        API_URL = savedUrl;
    }

    // Event Listeners
    document.getElementById('apiUrl').addEventListener('change', handleApiUrlChange);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('saleForm').addEventListener('submit', handleSaleSubmit);
    document.getElementById('filterTipo').addEventListener('change', filterProducts);
    document.getElementById('productoVenta').addEventListener('change', handleProductSelect);
    document.getElementById('cantidadVenta').addEventListener('input', calculateTotal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('confirmBtn').addEventListener('click', executeDelete);

    // Cargar datos iniciales
    loadProducts();
    loadSales();
    
    // Actualizar datos cada 30 segundos
    setInterval(() => {
        loadProducts();
        loadSales();
    }, 30000);
}

// ===== Manejo de API URL =====
function handleApiUrlChange(e) {
    API_URL = e.target.value.trim();
    localStorage.setItem('apiUrl', API_URL);
    showNotification('✅ URL del backend actualizada correctamente', 'success');
    loadProducts();
    loadSales();
}

// ===== Funciones de Productos =====
async function loadProducts() {
    try {
        console.log('🔄 Cargando productos desde:', `${API_URL}/productos`);
        const response = await fetch(`${API_URL}/productos`);
        
        console.log('📡 Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo conectar con el backend`);
        }

        const data = await response.json();
        console.log('📦 Datos recibidos:', data);
        
        // Nuestro backend devuelve { message: "...", productos: [...] }
        productos = data.productos || [];
        console.log('📋 Productos procesados:', productos);
        
        renderProducts();
        updateProductSelect();
        updateStats();
        
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        showNotification(`❌ Error: ${error.message}`, 'error');
        
        // Mostrar estado vacío
        document.getElementById('productList').innerHTML = `
            <div class="empty-state col-span-full">
                <div class="empty-icon">🔌</div>
                <div class="empty-text">No se pudo conectar con el backend</div>
                <div class="empty-subtext">Verifica que el servidor esté corriendo en: ${API_URL}</div>
            </div>
        `;
    }
}

function renderProducts() {
    console.log('🎨 Renderizando productos...');
    const productList = document.getElementById('productList');
    
    // Filtrar productos según el filtro seleccionado
    const filteredProducts = currentFilter === 'todos' 
        ? productos 
        : productos.filter(p => p.tipo === currentFilter);
    
    console.log('🔍 Productos filtrados:', filteredProducts);
    
    if (filteredProducts.length === 0) {
        console.log('📭 No hay productos para mostrar');
        productList.innerHTML = `
            <div class="empty-state col-span-full">
                <div class="empty-icon">📦</div>
                <div class="empty-text">No hay productos disponibles</div>
                <div class="empty-subtext">Agrega tu primer producto usando el formulario</div>
            </div>
        `;
        return;
    }
    
    productList.innerHTML = filteredProducts.map(producto => {
        const stockClass = producto.cantidad > 10 ? 'high' : producto.cantidad > 5 ? 'medium' : 'low';
        const stockText = producto.cantidad > 10 ? '✓ En Stock' : producto.cantidad > 5 ? '⚠ Stock Medio' : '❗ Stock Bajo';
        
        return `
            <div class="product-card animate__animated animate__fadeInUp">
                <span class="product-type-badge ${producto.tipo}">
                    ${producto.tipo === 'juego' ? '🎮' : '🕹️'} 
                    ${producto.tipo === 'juego' ? 'Videojuego' : 'Consola'}
                </span>
                
                <h3 class="product-name">${producto.nombre}</h3>
                
                <div class="product-details-grid">
                    <div class="detail-row">
                        <span class="detail-label">Precio</span>
                        <span class="detail-value price">$${parseFloat(producto.precio).toFixed(2)}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Stock</span>
                        <span class="stock-badge ${stockClass}">${stockText} (${producto.cantidad})</span>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button onclick="openUpdateModal('${producto._id}')" class="btn-update">
                        ✏️ Actualizar
                    </button>
                    <button onclick="confirmDelete('${producto._id}', '${producto.nombre}')" class="btn-delete">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateProductSelect() {
    const select = document.getElementById('productoVenta');
    
    if (productos.length === 0) {
        select.innerHTML = '<option value="">No hay productos disponibles</option>';
        return;
    }
    
    const options = productos
        .filter(p => p.cantidad > 0)
        .map(p => `
            <option value="${p._id}" data-precio="${p.precio}" data-stock="${p.cantidad}">
                ${p.tipo === 'juego' ? '🎮' : '🕹️'} ${p.nombre} - $${parseFloat(p.precio).toFixed(2)} (Stock: ${p.cantidad})
            </option>
        `).join('');
    
    if (options) {
        select.innerHTML = '<option value="">Seleccionar producto...</option>' + options;
    } else {
        select.innerHTML = '<option value="">No hay productos con stock disponible</option>';
    }
}

function updateStats() {
    // Total de productos
    document.getElementById('totalProductos').textContent = productos.length;
    
    // Valor del inventario
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    document.getElementById('valorInventario').textContent = `$${valorTotal.toFixed(2)}`;
    
    // Productos con stock bajo
    const stockBajo = productos.filter(p => p.cantidad <= 5).length;
    document.getElementById('stockBajo').textContent = stockBajo;
    
    // Total de ventas
    document.getElementById('totalVentas').textContent = ventas.length;
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productoData = {
        nombre: document.getElementById('nombre').value.trim(),
        tipo: document.getElementById('tipo').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value)
    };
    
    // Validaciones del lado del cliente
    if (!productoData.nombre) {
        showNotification('❌ El nombre del producto es requerido', 'error');
        return;
    }
    
    if (!productoData.tipo) {
        showNotification('❌ Debes seleccionar un tipo de producto', 'error');
        return;
    }
    
    if (productoData.precio <= 0) {
        showNotification('❌ El precio debe ser mayor a 0', 'error');
        return;
    }
    
    if (productoData.cantidad < 0) {
        showNotification('❌ La cantidad no puede ser negativa', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.errors?.[0]?.msg || 'Error al crear producto');
        }
        
        showNotification(`✅ Producto "${productoData.nombre}" agregado exitosamente`, 'success');
        document.getElementById('productForm').reset();
        loadProducts();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(`❌ ${error.message}`, 'error');
    }
}

function filterProducts() {
    currentFilter = document.getElementById('filterTipo').value;
    renderProducts();
}

// ===== Funciones de Ventas =====
async function loadSales() {
    try {
        const response = await fetch(`${API_URL}/ventas`);
        
        if (!response.ok) {
            throw new Error('Error al cargar ventas');
        }

        const data = await response.json();
        // Nuestro backend devuelve { message: "...", ventas: [...] }
        ventas = data.ventas || [];
        
        renderSales();
        updateStats();
        
    } catch (error) {
        console.error('Error al cargar ventas:', error);
        document.getElementById('salesHistory').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📈</div>
                <div class="empty-text">No se pudieron cargar las ventas</div>
            </div>
        `;
    }
}

function renderSales() {
    const salesHistory = document.getElementById('salesHistory');
    
    if (ventas.length === 0) {
        salesHistory.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💰</div>
                <div class="empty-text">No hay ventas registradas</div>
                <div class="empty-subtext">Las ventas aparecerán aquí</div>
            </div>
        `;
        return;
    }
    
    // Ordenar ventas por fecha (más reciente primero)
    const sortedSales = [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    salesHistory.innerHTML = sortedSales.map(venta => {
        const fecha = new Date(venta.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Nuestro backend devuelve la información del producto en productoInfo
        const productoNombre = venta.productoInfo?.nombre || venta.producto?.nombre || 'Producto eliminado';
        const total = venta.total || (venta.cantidadVendida * venta.precioUnitario).toFixed(2);
        
        return `
            <div class="sale-card animate__animated animate__fadeIn">
                <div class="sale-header">
                    <span class="sale-product-name">🛒 ${productoNombre}</span>
                    <span class="sale-date">${fechaFormateada}</span>
                </div>
                
                <div class="sale-details-grid">
                    <div class="sale-detail-item">
                        <div class="sale-detail-label">Cantidad</div>
                        <div class="sale-detail-value">${venta.cantidadVendida}</div>
                    </div>
                    
                    <div class="sale-detail-item">
                        <div class="sale-detail-label">Precio Unit.</div>
                        <div class="sale-detail-value">$${parseFloat(venta.precioUnitario).toFixed(2)}</div>
                    </div>
                    
                    <div class="sale-detail-item">
                        <div class="sale-detail-label">Total</div>
                        <div class="sale-detail-value text-green-400">$${parseFloat(total).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function handleProductSelect(e) {
    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const productInfo = document.getElementById('productInfo');
    
    if (select.value) {
        const precio = selectedOption.getAttribute('data-precio');
        const stock = selectedOption.getAttribute('data-stock');
        
        document.getElementById('infoPrecio').textContent = `$${parseFloat(precio).toFixed(2)}`;
        document.getElementById('infoStock').textContent = stock;
        document.getElementById('cantidadVenta').max = stock;
        
        productInfo.classList.remove('hidden');
        calculateTotal();
    } else {
        productInfo.classList.add('hidden');
        document.getElementById('totalVenta').textContent = '$0.00';
    }
}

function calculateTotal() {
    const select = document.getElementById('productoVenta');
    const cantidad = parseInt(document.getElementById('cantidadVenta').value) || 0;
    
    if (select.value && cantidad > 0) {
        const selectedOption = select.options[select.selectedIndex];
        const precio = parseFloat(selectedOption.getAttribute('data-precio'));
        const stock = parseInt(selectedOption.getAttribute('data-stock'));
        
        if (cantidad > stock) {
            showNotification(`⚠️ Solo hay ${stock} unidades disponibles`, 'warning');
            document.getElementById('cantidadVenta').value = stock;
            return;
        }
        
        const total = (precio * cantidad).toFixed(2);
        document.getElementById('totalVenta').textContent = `$${total}`;
    } else {
        document.getElementById('totalVenta').textContent = '$0.00';
    }
}

async function handleSaleSubmit(e) {
    e.preventDefault();
    
    const productoId = document.getElementById('productoVenta').value;
    const cantidad = parseInt(document.getElementById('cantidadVenta').value);
    
    if (!productoId) {
        showNotification('❌ Debes seleccionar un producto', 'error');
        return;
    }
    
    if (!cantidad || cantidad <= 0) {
        showNotification('❌ La cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    const ventaData = {
        producto: productoId,
        cantidadVendida: cantidad
    };
    
    try {
        const response = await fetch(`${API_URL}/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.errors?.[0]?.msg || 'Error al registrar venta');
        }
        
        const total = (data.venta?.cantidadVendida * data.venta?.precioUnitario).toFixed(2);
        showNotification(`✅ Venta registrada exitosamente - Total: $${total}`, 'success');
        
        document.getElementById('saleForm').reset();
        document.getElementById('productInfo').classList.add('hidden');
        document.getElementById('totalVenta').textContent = '$0.00';
        
        loadProducts();
        loadSales();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(`❌ ${error.message}`, 'error');
    }
}

// ===== Funciones de Eliminación =====
function confirmDelete(id, nombre) {
    document.getElementById('confirmTitle').textContent = '¿Eliminar producto?';
    document.getElementById('confirmMessage').textContent = `¿Estás seguro de que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`;
    
    deleteCallback = () => deleteProduct(id, nombre);
    
    document.getElementById('confirmModal').classList.add('show');
}

async function deleteProduct(id, nombre) {
    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al eliminar producto');
        }
        
        showNotification(`✅ Producto "${nombre}" eliminado correctamente`, 'success');
        closeModal();
        loadProducts();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(`❌ ${error.message}`, 'error');
    }
}

function executeDelete() {
    if (deleteCallback) {
        deleteCallback();
        deleteCallback = null;
    }
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('show');
    deleteCallback = null;
}

// ===== Función de Actualización (Modal simple) =====
function openUpdateModal(id) {
    const producto = productos.find(p => p._id === id);
    if (!producto) return;
    
    const nuevaCantidad = prompt(`Actualizar stock de "${producto.nombre}"\nStock actual: ${producto.cantidad}\n\nIngresa la nueva cantidad:`, producto.cantidad);
    
    if (nuevaCantidad !== null) {
        const cantidad = parseInt(nuevaCantidad);
        
        if (isNaN(cantidad) || cantidad < 0) {
            showNotification('❌ Cantidad inválida', 'error');
            return;
        }
        
        updateProduct(id, { cantidad });
    }
}

async function updateProduct(id, updateData) {
    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar producto');
        }
        
        showNotification('✅ Producto actualizado correctamente', 'success');
        loadProducts();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(`❌ ${error.message}`, 'error');
    }
}

// ===== Sistema de Notificaciones =====
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    
    // Limpiar clases previas
    notification.className = 'notification-toast';
    
    // Agregar nueva clase de tipo
    notification.classList.add(type);
    
    // Establecer mensaje
    notification.textContent = message;
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ===== Cerrar modal al hacer clic fuera =====
document.addEventListener('click', (e) => {
    const modal = document.getElementById('confirmModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ===== Manejo de errores de red global =====
window.addEventListener('online', () => {
    showNotification('✅ Conexión restaurada', 'success');
    loadProducts();
    loadSales();
});

window.addEventListener('offline', () => {
    showNotification('⚠️ Sin conexión a Internet', 'warning');
});

// ===== Logs de consola para debugging =====
console.log('%c🎮 GameStore Pro', 'font-size: 24px; font-weight: bold; color: #a855f7;');
console.log('%cSistema de gestión de inventario iniciado', 'font-size: 14px; color: #06b6d4;');
console.log(`%cAPI URL: ${API_URL}`, 'font-size: 12px; color: #10b981;');