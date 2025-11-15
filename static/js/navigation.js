// sistema de navegacao entre paginas

document.addEventListener('DOMContentLoaded', function() {
    // obter o caminho atual
    const currentPath = window.location.pathname;
    
    // marcar o item ativo no menu (.menu-item para home, .menu-btn para outras paginas)
    const menuItems = document.querySelectorAll('.menu-item, .menu-btn');
    menuItems.forEach(item => {
        const href = item.getAttribute('href') || item.getAttribute('data-page');
        if (href === currentPath || (href && currentPath.includes(href))) {
            item.classList.add('active');
        }
    });
    
    // adicionar eventos de clique nos botoes
    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // remover active de todos
            menuBtns.forEach(b => b.classList.remove('active'));
            
            // adicionar active no clicado
            this.classList.add('active');
            
            // navegar
            setTimeout(() => {
                window.location.href = `/${page}`;
            }, 200);
        });
    });
    
    // adicionar eventos de clique nos links
    const menuLinks = document.querySelectorAll('.menu-item');
    menuLinks.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // remover active de todos
            menuLinks.forEach(i => i.classList.remove('active'));
            
            // adicionar active no clicado
            this.classList.add('active');
            
            // navegar apos animacao
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        });
    });
});
