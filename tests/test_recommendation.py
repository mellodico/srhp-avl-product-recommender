# Testes unitários para SRHP-10: Recomendação por Categoria + Subcategorias

import pytest
import sys
import os

# Para importar o módulo 'avl_tree', adicionamos o diretório 'src' ao path.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.avl_tree import AVLTree
from src.business_logic import SistemaRecomendacao


# --- SRHP-10: Testes de Recomendação de Produtos ---


def test_recommendation_descendant_categories():
    """
    Valida que a recomendação retorna produtos da categoria
    e de todas as subcategorias descendentes.

    Estrutura de categorias (AVL balanceada):

                50 (Eletrônicos)
               /               \
         30 (Celulares)       70 (TVs)
           /      \
    20 (Smartphones) 40 (Feature Phones)

    Produtos:
        Eletrônicos(50): P1
        Celulares(30): P2, P3
        Smartphones(20): P4
        Feature Phones(40): P5

    Recomendação para categoria 30 -> {P2, P3, P4, P5}
    """

    tree = AVLTree()

    # Inserção de categorias (value contém dict com nome e produtos)
    tree.insert(50, {"nome": "Eletrônicos", "produtos": ["P1"]})
    tree.insert(30, {"nome": "Celulares", "produtos": ["P2", "P3"]})
    tree.insert(70, {"nome": "TVs", "produtos": []})
    tree.insert(20, {"nome": "Smartphones", "produtos": ["P4"]})
    tree.insert(40, {"nome": "Feature Phones", "produtos": ["P5"]})

    recomendados = tree.recommend(30)

    esperado = set(["P2", "P3", "P4", "P5"])

    assert set(recomendados) == esperado


def test_recommendation_single_category_no_children():
    """
    Categoria sem subcategorias deve retornar apenas seus próprios produtos.
    """

    tree = AVLTree()

    tree.insert(10, {"nome": "Periféricos", "produtos": ["Mouse", "Teclado"]})

    recomendados = tree.recommend(10)

    assert set(recomendados) == {"Mouse", "Teclado"}


def test_recommendation_invalid_category():
    """
    Categoria inexistente deve retornar lista vazia.
    """

    tree = AVLTree()

    tree.insert(10, {"nome": "Livros", "produtos": ["Livro1"]})

    recomendados = tree.recommend(999)

    assert recomendados == []


def test_recommendation_empty_tree():
    """
    Recomendação em árvore vazia deve retornar lista vazia.
    """

    tree = AVLTree()

    assert tree.recommend(10) == []

# --- SRHP 15 -------
def test_integration_business_avl_srhp15():
    """
    SRHP-15 ou Teste de Itegração (Interface > Negócio > AVL), é um teste super importante
    que garante que tudo funcione direitinho quando você isere ddos via módulo de negocio.
    Ele verifica se esses dados são salvos certinhos na AVL e se a recomendação recursiva 
    está rodando sem problemas. Resumindo 😂, esse teste confirma que a integração entre a 
    interface, o negócio e a AVL está perfeita, garantindo que tudo está funcionando como 
    esperado.
    """
    # 1. passo: o sistema inicializa a sua própria AVL internamente
    sistema = SistemaRecomendacao() # não adiciona argumentos

    # 2. passo: vamos usar APENAS o método 'cadastrar_categoria'
    sistema.cadastrar_categoria("Livros", "Categoria Pai")

    # CORREÇÃO AQUI: Mude de "Livros" para "Ficção"
    sistema.cadastrar_categoria("Ficção", "Gênero Literário") 
    
    # Cadastrando um produto na "subcategoria"
    sistema.cadastrar_produto("Ficção", 101, "1984 - George Orwell", 40.00)

    # 3. passo: Verificação (Prova Real 📝)
    # Pedimos recomendação da categoria PAI 👨 ("Livros")
    # O sistema deve descer a árvore e achar o produto que está em "Ficção"
    recomendacoes = sistema.recomendar_produtos("Livros")

    # Verifica se a lista não está vazia
    assert len(recomendacoes) > 0, "A lista de recomendações não retornou nada!"

    # Verifica se achou o produto correto ✅
    nomes_encontrados = [item["produto"].nome for item in recomendacoes]
    assert "1984 - George Orwell" in nomes_encontrados