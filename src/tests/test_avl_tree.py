import pytest
from avl_tree import AVLTree, AVLNode


# -------------------------
# TESTES BÁSICOS DE INSERÇÃO
# -------------------------

def test_insert_single_node():
    tree = AVLTree()
    tree.insert(10, {"produtos": ["A"]})

    assert tree.root.key == 10
    assert tree.root.data["produtos"] == ["A"]
    assert tree.root.height == 1


def test_insert_multiple_nodes_balanced():
    tree = AVLTree()
    tree.insert(20, None)
    tree.insert(10, None)
    tree.insert(30, None)

    assert tree.root.key == 20
    assert tree.root.leftChild.key == 10
    assert tree.root.rightChild.key == 30


# -------------------------
# TESTES DE ROTAÇÕES
# -------------------------

def test_rotation_LL():
    tree = AVLTree()
    # provoca rotação simples à direita
    tree.insert(30, None)
    tree.insert(20, None)
    tree.insert(10, None)

    assert tree.root.key == 20
    assert tree.root.leftChild.key == 10
    assert tree.root.rightChild.key == 30


def test_rotation_RR():
    tree = AVLTree()
    # provoca rotação simples à esquerda
    tree.insert(10, None)
    tree.insert(20, None)
    tree.insert(30, None)

    assert tree.root.key == 20
    assert tree.root.leftChild.key == 10
    assert tree.root.rightChild.key == 30


def test_rotation_LR():
    tree = AVLTree()
    tree.insert(30, None)
    tree.insert(10, None)
    tree.insert(20, None)  # causa a rotação dupla (LR)

    assert tree.root.key == 20
    assert tree.root.leftChild.key == 10
    assert tree.root.rightChild.key == 30


def test_rotation_RL():
    tree = AVLTree()
    tree.insert(10, None)
    tree.insert(30, None)
    tree.insert(20, None)  # causa rotação dupla (RL)

    assert tree.root.key == 20
    assert tree.root.leftChild.key == 10
    assert tree.root.rightChild.key == 30


# -------------------------
# TESTES DE BUSCA
# -------------------------

def test_find_existing():
    tree = AVLTree()
    tree.insert(5, {"x": 1})
    assert tree.find(5) == {"x": 1}


def test_find_missing():
    tree = AVLTree()
    tree.insert(5, None)
    assert tree.find(10) is None


# -------------------------
# TESTES DE REMOÇÃO
# -------------------------

def test_delete_leaf():
    tree = AVLTree()
    tree.insert(10, None)
    tree.insert(5, None)
    tree.insert(15, None)

    tree.delete(5)
    assert tree.find(5) is None
    assert tree.root.leftChild is None


def test_delete_node_with_one_child():
    tree = AVLTree()
    tree.insert(10, None)
    tree.insert(5, None)
    tree.insert(2, None)

    tree.delete(5)
    assert tree.find(5) is None
    assert tree.root.leftChild.key == 2


def test_delete_node_two_children():
    tree = AVLTree()
    tree.insert(20, None)
    tree.insert(10, None)
    tree.insert(30, None)
    tree.insert(25, None)
    tree.insert(40, None)

    tree.delete(30)

    assert tree.find(30) is None
    assert tree.root.rightChild.key in (25, 40)


# -------------------------
# TESTE DO GET_MIN_VALUE
# -------------------------

def test_get_min_value():
    tree = AVLTree()
    tree.insert(50, None)
    tree.insert(20, None)
    tree.insert(10, None)
    tree.insert(30, None)

    node = tree._get_min_value_node(tree.root)
    assert node.key == 10


# -------------------------
# TESTES DE ALTURA E BALANCEAMENTO
# -------------------------

def test_height_and_balance():
    tree = AVLTree()
    tree.insert(30, None)
    tree.insert(20, None)
    tree.insert(40, None)

    assert tree._get_height(tree.root) == 2
    assert tree._get_balance(tree.root) == 0


# -------------------------
# TESTES DO MÉTODO RECOMMEND
# -------------------------

def test_recommend_missing_category():
    tree = AVLTree()
    tree.insert(10, {"produtos": ["A"]})
    assert tree.recommend(99) == []


def test_recommend_single_category():
    tree = AVLTree()
    tree.insert(10, {"produtos": ["A", "B"]})
    assert set(tree.recommend(10)) == {"A", "B"}


def test_recommend_with_subcategories():
    tree = AVLTree()

    tree.insert(50, {"produtos": ["A"]})
    tree.insert(30, {"produtos": ["B"]})
    tree.insert(70, {"produtos": ["C", "D"]})
    tree.insert(20, {"produtos": ["E"]})

    result = tree.recommend(30)
    assert set(result) == {"B", "E"}


# -------------------------
# TESTES EXTRA PARA COBERTURA
# -------------------------

def test_insert_duplicate_key_goes_right():
    tree = AVLTree()
    tree.insert(10, None)
    tree.insert(10, "duplicado")

    assert tree.root.rightChild.key == 10
    assert tree.root.rightChild.data == "duplicado"


def test_delete_nonexistent():
    tree = AVLTree()
    tree.insert(10, None)
    tree.delete(999)  # não deve quebrar
    assert tree.root.key == 10
