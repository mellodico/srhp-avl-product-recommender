# Roda a análise

from avl_tree import AVLTree
from analysis import AVLAnalysis

def testar_rotacoes():
    print("\n==== TESTANDO TODAS AS ROTAÇÕES ====\n")

    # ============================
    # RR — Rotação Simples Esquerda
    # ============================
    print("➡️  TESTE RR (Rotação Simples Esquerda)")
    tree = AVLTree()
    tree.insert(1, {})
    tree.insert(2, {})
    tree.insert(3, {})   # causa RR
    print()

    # ============================
    # LL — Rotação Simples Direita
    # ============================
    print("➡️  TESTE LL (Rotação Simples Direita)")
    tree = AVLTree()
    tree.insert(3, {})
    tree.insert(2, {})
    tree.insert(1, {})   # causa LL
    print()

    # ============================
    # LR — Rotação Dupla Esquerda-Direita
    # ============================
    print("➡️  TESTE LR (Rotação Dupla Esquerda–Direita)")
    tree = AVLTree()
    tree.insert(3, {})
    tree.insert(1, {})
    tree.insert(2, {})   # causa LR
    print()

    # ============================
    # RL — Rotação Dupla Direita-Esquerda
    # ============================
    print("➡️  TESTE RL (Rotação Dupla Direita–Esquerda)")
    tree = AVLTree()
    tree.insert(1, {})
    tree.insert(3, {})
    tree.insert(2, {})   # causa RL
    print()

def main():
    testar_rotacoes()

    print("\n==== TESTES DE PERFORMANCE ====\n")

    tree = AVLTree()
    bench = AVLAnalysis(tree)

    print("➡️ Teste individual:")
    print("Tempo inserir(50):", bench.time_insert(50, {"produtos": []}))
    print("Tempo find(50):   ", bench.time_find(50))
    print("Tempo delete(50): ", bench.time_delete(50))

if __name__ == "__main__":
    main()
