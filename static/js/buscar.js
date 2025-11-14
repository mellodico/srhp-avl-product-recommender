// pagina de busca

class SearchPage {
    constructor() {
        this.searchButton = document.getElementById('searchButton');
        this.searchResults = document.getElementById('searchResults');
        this.productsContainer = document.getElementById('productsContainer');
        this.selectedCategory = null;
        
        this.categories = [
            { id: 1, nome: 'Eletronicos', produtos: 2 },
            { id: 2, nome: 'Alimentos', produtos: 1 },
            { id: 3, nome: 'Roupas', produtos: 1 },
            { id: 4, nome: 'Livros', produtos: 1 },
            { id: 5, nome: 'Esportes', produtos: 0 }
        ];
        
        this.produtos = [
            {
                id: 1,
                nome: 'Smartphone Galaxy',
                preco: 2499.00,
                categoria: 'Eletronicos',
                breadcrumb: ['Eletronicos', 'Celulares', 'Smartphones']
            },
            {
                id: 2,
                nome: 'Notebook Dell',
                preco: 3999.00,
                categoria: 'Eletronicos',
                breadcrumb: ['Eletronicos', 'Computadores', 'Notebooks']
            },
            {
                id: 3,
                nome: 'Arroz Integral 1kg',
                preco: 12.90,
                categoria: 'Alimentos',
                breadcrumb: ['Alimentos', 'Graos', 'Arroz']
            },
            {
                id: 4,
                nome: 'Camiseta Basica',
                preco: 49.90,
                categoria: 'Roupas',
                breadcrumb: ['Roupas', 'Masculino', 'Camisetas']
            },
            {
                id: 5,
                nome: 'Python Avancado',
                preco: 89.90,
                categoria: 'Livros',
                breadcrumb: ['Livros', 'Tecnologia', 'Programacao']
            }
        ];
        
        this.init();
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
    
    selectCategory(categoryName) {
        this.selectedCategory = categoryName;
        this.searchButton.textContent = categoryName;
        this.hideResults();
        this.showProductsByCategory(categoryName);
        
        // esconder o botao de busca apos selecionar
        this.searchButton.style.display = 'none';
    }
    
    showSearchButton() {
        this.searchButton.style.display = 'block';
        this.searchButton.textContent = 'o que você deseja buscar?';
        this.hideProducts();
    }
    
    showProductsByCategory(categoryName) {
        const products = this.produtos.filter(p => p.categoria === categoryName);
        
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
                    <div class="breadcrumb-label">subcategoria</div>
                    <div class="breadcrumb-path">
                        ${product.breadcrumb.join(' <span class="breadcrumb-arrow">→</span> ')}
                    </div>
                </div>
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
