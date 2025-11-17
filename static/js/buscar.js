// pagina de busca

class SearchPage {
    constructor() {
        this.searchButton = document.getElementById('searchButton');
        this.searchResults = document.getElementById('searchResults');
        this.productsContainer = document.getElementById('productsContainer');
        this.selectedCategory = null;
        
        this.categories = [];
        this.produtos = [];
        
        this.init();
        this.carregarDados();
    }
    
    async carregarDados() {
        // carregar categorias e produtos do backend
        await this.carregarCategorias();
        await this.carregarProdutos();
    }
    
    async carregarCategorias() {
        try {
            const response = await fetch('/api/categorias');
            this.categories = await response.json();
        } catch (error) {
            console.error('erro ao carregar categorias:', error);
            this.categories = [];
        }
    }
    
    async carregarProdutos() {
        try {
            const response = await fetch('/api/produtos');
            this.produtos = await response.json();
        } catch (error) {
            console.error('erro ao carregar produtos:', error);
            this.produtos = [];
        }
    }
    
    init() {
        console.log('searchButton:', this.searchButton);
        console.log('searchResults:', this.searchResults);
        
        if (!this.searchButton) {
            console.error('searchButton nao encontrado!');
            return;
        }
        
        // clicar no botao abre/fecha o dropdown
        this.searchButton.addEventListener('click', (e) => {
            console.log('clicou no botao!');
            e.stopPropagation();
            this.toggleCategories();
        });
        
        // clicar fora fecha os resultados
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-input-container') && 
                !e.target.closest('.search-results')) {
                this.hideResults();
            }
        });
        
        // detectar quando usuario retorna para a pagina buscar
        window.addEventListener('pageshow', (e) => {
            // resetar ao voltar para a pagina
            this.showSearchButton();
        });
    }
    
    toggleCategories() {
        console.log('toggleCategories chamado, display atual:', this.searchResults.style.display);
        if (this.searchResults.style.display === 'block') {
            this.hideResults();
        } else {
            console.log('abrindo categorias...');
            this.showCategories();
            this.searchButton.classList.add('active');
        }
    }
    

    
    showCategories(categories = null) {
        const categoriesToShow = categories || this.categories;
        
        this.searchResults.innerHTML = `
            <ul class="category-list">
                ${categoriesToShow.map(cat => `
                    <li class="category-item" data-category="${cat.nome}">
                        ${cat.nome}
                    </li>
                `).join('')}
            </ul>
        `;
        
        this.searchResults.style.display = 'block';
        
        // adicionar eventos de clique
        this.searchResults.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const categoryName = e.target.dataset.category;
                this.selectCategory(categoryName);
            });
        });
    }
    
    async selectCategory(categoryName) {
        // encontrar a categoria pelo nome
        const categoria = this.categories.find(c => c.nome === categoryName);
        if (!categoria) return;
        
        this.selectedCategory = categoryName;
        this.searchButton.textContent = categoryName;
        this.hideResults();
        await this.showProductsByCategory(categoria.id, categoryName);
        
        // esconder o botao de busca apos selecionar
        this.searchButton.style.display = 'none';
    }
    
    showSearchButton() {
        this.searchButton.style.display = 'block';
        this.searchButton.textContent = 'o que você deseja buscar?';
        this.hideProducts();
    }
    
    async showProductsByCategory(categoriaId, categoryName) {
        try {
            // buscar produtos dessa categoria
            const response = await fetch(`/api/produtos/categoria/${categoriaId}`);
            const products = await response.json();
            
            if (products.length === 0) {
                this.showEmptyState();
                return;
            }
            
            this.productsContainer.innerHTML = `
                <div class="products-header">${categoryName}</div>
                <ul class="product-list">
                    ${products.map(product => this.renderProduct(product)).join('')}
                </ul>
            `;
            
            this.productsContainer.style.display = 'block';
        } catch (error) {
            console.error('erro ao carregar produtos:', error);
            this.showEmptyState();
        }
    }
    
    searchProducts(query) {
        const products = this.produtos.filter(p => 
            p.nome.toLowerCase().includes(query)
        );
        
        if (products.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.productsContainer.innerHTML = `
            <div class="products-header">resultados da busca</div>
            <ul class="product-list">
                ${products.map(product => this.renderProduct(product)).join('')}
            </ul>
        `;
        
        this.productsContainer.style.display = 'block';
    }
    
    renderProduct(product) {
        return `
            <li class="product-item">
                <div class="product-header">
                    <div class="product-name">${product.nome}</div>
                    <div class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="product-breadcrumb">
                    <div class="breadcrumb-label">categoria</div>
                    <div class="breadcrumb-path">
                        ${product.categoria_nome}
                    </div>
                </div>
                ${product.descricao ? `<div class="product-description">${product.descricao}</div>` : ''}
            </li>
        `;
    }
    
    showEmptyState() {
        this.productsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div>nenhum produto encontrado</div>
            </div>
        `;
        this.productsContainer.style.display = 'block';
    }
    
    hideResults() {
        this.searchResults.style.display = 'none';
        this.searchButton.classList.remove('active');
    }
    
    hideProducts() {
        this.productsContainer.style.display = 'none';
    }
}

// inicializar quando a pagina carregar
let searchPageInstance;
document.addEventListener('DOMContentLoaded', () => {
    searchPageInstance = new SearchPage();
});

// resetar quando navegar de volta
window.addEventListener('popstate', () => {
    if (searchPageInstance && window.location.pathname === '/buscar') {
        searchPageInstance.showSearchButton();
    }
});
