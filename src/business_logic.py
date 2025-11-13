"""
modulo de logica de negocio para o sistema de recomendacao hierarquica de produtos
conecta as operacoes de negocio categorias e produtos com a estrutura avl
"""

from src.avl_tree import AVLTree
from src.models import Categoria, Produto


class SistemaRecomendacao:
    """
    gerencia o sistema de recomendacao de produtos usando avl tree
    
    a arvore avl armazena as categorias chave igual nome da categoria
    cada no da arvore contem um objeto categoria com sua lista de produtos
    """
    
    def __init__(self):
        """inicializa o sistema com uma arvore avl vazia"""
        self.arvore_categorias = AVLTree()
        print("sistema de recomendacao inicializado com sucesso")
    
    def cadastrar_categoria(self, nome_categoria, descricao=""):
        """
        cadastra uma nova categoria no sistema
        
        args
            nome_categoria (str) nome unico da categoria usado como chave na AVL
            descricao (str) descricao opcional da categoria
        
        returns
            bool true se cadastrou com sucesso false se a categoria ja existe
        
        complexidade Olog n devido a insercao na AVL
        """
        # verifica se a categoria ja existe
        if self.arvore_categorias.find(nome_categoria) is not None:
            print(f"categoria {nome_categoria} ja existe")
            return False
        
        # cria o objeto categoria
        nova_categoria = Categoria(nome_categoria, descricao)
        
        # insere na arvore AVL chave igual nome data igual objeto Categoria
        self.arvore_categorias.insert(nome_categoria, nova_categoria)
        
        print(f"categoria {nome_categoria} cadastrada com sucesso")
        return True
