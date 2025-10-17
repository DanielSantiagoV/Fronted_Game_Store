const backend_URL = "http://localhost:3000/api"

const productsList = document.getElementById("products-list");

async function fetchAPI(url) {
    const result = await fetch(url, {headers: {"Content-Type": "application/json"}})
    if(!result.ok){
        const errorData = await result.json().catch(()=>({}));
        const message = errorData.message || errorData.error || JSON.stringify(errorData);
        throw new Error(message)
    }
    return result.json()
}

async function getProducts() {
    const data = await fetchAPI(`${backend_URL}/productos`);
    const products = data.productos || [];
    
    if (productsList) {
        productsList.innerHTML = `
            <div class="list-products">
                ${products.map(p => `
                    <div class="product">
                        <p>${p.nombre}</p>
                        <p>$${parseFloat(p.precio).toFixed(2)}</p>
                        <p>${p.tipo === 'juego' ? '🎮 Videojuego' : '🕹️ Consola'}</p>
                        <p>Stock: ${p.cantidad}</p>
                    </div>
                    `).join("")}
            </div>
        `
    }
}


(async function initt() {
    try {
        await getProducts();
    } catch (error) {
        console.error(error);
    }
})();