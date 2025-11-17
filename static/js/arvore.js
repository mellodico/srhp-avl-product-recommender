// visualizador de arvore avl com javascript puro

class TreeVisualizer {
    constructor() {
        this.expandedNodes = new Set();
        this.levelColors = ['#9F4444', '#8B6B61', '#C89B9B', '#7B9ACF'];
        this.tree = null;
        
        this.carregarArvore();
    }
    
    async carregarArvore() {
        try {
            const response = await fetch('/api/tree');
            const treeData = await response.json();
            
            // converter dados da api para o formato esperado
            if (treeData && treeData.length > 0) {
                this.tree = this.convertTreeData(treeData);
            } else {
                // arvore vazia, criar no raiz
                this.tree = {
                    id: 'root',
                    altura: 'altura 0',
                    nome: 'sem categorias',
                    iniciais: 'SC',
                    numeroProdutos: 0,
                    children: []
                };
            }
            
            this.init();
        } catch (error) {
            console.error('erro ao carregar arvore:', error);
            // criar arvore vazia em caso de erro
            this.tree = {
                id: 'root',
                altura: 'altura 0',
                nome: 'erro ao carregar',
                iniciais: 'ER',
                numeroProdutos: 0,
                children: []
            };
            this.init();
        }
    }
    
    convertTreeData(treeData) {
        // se tem multiplas raizes, criar um no pai artificial
        if (treeData.length > 1) {
            return {
                id: 'root',
                altura: 'altura 0',
                nome: 'todas as categorias',
                iniciais: 'TC',
                numeroProdutos: treeData.reduce((sum, node) => sum + (node.produtos?.length || 0), 0),
                children: treeData.map((node, index) => this.convertNode(node, 1))
            };
        } else if (treeData.length === 1) {
            return this.convertNode(treeData[0], 0);
        }
        
        return null;
    }
    
    convertNode(node, level) {
        const iniciais = node.nome.substring(0, 2).toUpperCase();
        const numeroProdutos = node.produtos?.length || 0;
        
        return {
            id: `cat-${node.id}`,
            altura: `altura ${level}`,
            nome: node.nome,
            iniciais: iniciais,
            numeroProdutos: numeroProdutos,
            children: (node.children || []).map((child, index) => 
                this.convertNode(child, level + 1)
            )
        };
    }

    init() {
        this.container = document.getElementById('treeContainer');
        this.render();
    }

    toggleNode(nodeId) {
        if (this.expandedNodes.has(nodeId)) {
            this.expandedNodes.delete(nodeId);
        } else {
            this.expandedNodes.add(nodeId);
        }
        this.render();
    }

    createCard(node, level, stackIndex = 0) {
        const color = this.levelColors[level] || this.levelColors[0];
        const stackOffset = stackIndex * 4;
        const rotationOffset = stackIndex * 2 - 4;
        
        const card = document.createElement('div');
        card.className = 'node-card';
        if (!node.children || node.children.length === 0) {
            card.className += ' no-children';
        }
        card.style.backgroundColor = color;
        card.style.transform = `translateY(-${stackOffset}px) translateX(${stackOffset}px) rotate(${rotationOffset}deg)`;
        card.style.zIndex = 10 - stackIndex;
        
        card.innerHTML = `
            <div class="node-altura">${node.altura}</div>
            <div class="node-nome">${node.nome}</div>
            <div class="node-footer">
                <span class="node-iniciais">${node.iniciais}</span>
                <span class="node-produtos">${node.numeroProdutos} produtos</span>
            </div>
            ${node.children && node.children.length > 0 ? '<div class="node-indicator"></div>' : ''}
        `;
        
        return card;
    }

    createStackedCards(node, level) {
        const fragment = document.createDocumentFragment();
        const numStacks = Math.min(3, node.children.length);
        
        for (let i = 0; i < numStacks; i++) {
            const child = node.children[i];
            const stackedCard = this.createCard(child, level + 1, i + 1);
            stackedCard.className = 'stacked-card';
            fragment.appendChild(stackedCard);
        }
        
        return fragment;
    }

    createNode(node, level) {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = this.expandedNodes.has(node.id);
        
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'tree-node';
        
        // wrapper do card
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'node-card-wrapper';
        
        // cards empilhados quando nao expandido
        if (hasChildren && !isExpanded) {
            cardWrapper.appendChild(this.createStackedCards(node, level));
        }
        
        // card principal
        const mainCard = this.createCard(node, level);
        if (hasChildren) {
            mainCard.addEventListener('click', () => this.toggleNode(node.id));
        }
        cardWrapper.appendChild(mainCard);
        
        nodeDiv.appendChild(cardWrapper);
        
        // filhos expandidos
        if (hasChildren && isExpanded) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children-container';
            
            // criar svg para as linhas
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'tree-svg');
            
            // adicionar filhos
            node.children.forEach((child, index) => {
                const childNode = this.createNode(child, level + 1);
                childrenContainer.appendChild(childNode);
            });
            
            nodeDiv.appendChild(childrenContainer);
            
            // calcular e desenhar linhas apos renderizacao
            setTimeout(() => {
                this.drawLines(cardWrapper, childrenContainer, svg);
                childrenContainer.insertBefore(svg, childrenContainer.firstChild);
            }, 50);
        }
        
        return nodeDiv;
    }

    drawLines(parentWrapper, childrenContainer, svg) {
        const parentRect = parentWrapper.getBoundingClientRect();
        const containerRect = childrenContainer.getBoundingClientRect();
        
        // ponto de partida centro inferior do card pai
        const parentX = parentRect.left - containerRect.left + parentRect.width / 2;
        const parentY = parentRect.bottom - containerRect.top;
        
        // desenhar linha para cada filho
        const children = childrenContainer.querySelectorAll(':scope > .tree-node');
        children.forEach(child => {
            const childCard = child.querySelector('.node-card-wrapper');
            if (childCard) {
                const childRect = childCard.getBoundingClientRect();
                
                // ponto de chegada centro superior do card filho
                const childX = childRect.left - containerRect.left + childRect.width / 2;
                const childY = childRect.top - containerRect.top;
                
                // criar linha
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('class', 'tree-line');
                line.setAttribute('x1', parentX);
                line.setAttribute('y1', parentY);
                line.setAttribute('x2', childX);
                line.setAttribute('y2', childY);
                
                svg.appendChild(line);
            }
        });
    }

    render() {
        this.container.innerHTML = '';
        const treeNode = this.createNode(this.tree, 0);
        this.container.appendChild(treeNode);
    }
}

// inicializar quando a pagina carregar
let treeVisualizer;
window.addEventListener('DOMContentLoaded', () => {
    treeVisualizer = new TreeVisualizer();
    treeVisualizer.init();
});
