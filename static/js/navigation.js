// sistema de navegacao entre paginas

document.addEventListener('DOMContentLoaded', function() {
    // obter o caminho atual
    const currentPath = window.location.pathname;
    
    // marcar o item ativo no menu
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            item.classList.add('active');
        }
    });
    
    // adicionar eventos de clique
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // remover active de todos
            menuItems.forEach(i => i.classList.remove('active'));
            
            // adicionar active no clicado
            this.classList.add('active');
            
            // navegar apos animacao
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        });
    });
});
