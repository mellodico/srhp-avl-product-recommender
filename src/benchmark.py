# benchmark.py - comparativo busca: AVL (O(log n)) vs lista (O(n))
import random
import time
from avl_tree import AVLTree  # ajuste apenas se seu arquivo tiver outro nome

def benchmark(N: int, num_buscas: int = 5000):
    print(f"\n=== Benchmark com {N} elementos ===")

    # ------------------------------
    # 1. Gerar dados
    # ------------------------------
    dados = list(range(N))
    random.shuffle(dados)

    # ------------------------------
    # 2. Popular AVL (OBS: insert exige key e data)
    # ------------------------------
    avl = AVLTree()
    for valor in dados:
        avl.insert(valor, {"produtos": []})  # fornecendo 'data' mínimo

    # ------------------------------
    # 3. Popular lista comum
    # ------------------------------
    lista = dados.copy()

    # ------------------------------
    # 4. Gerar valores para buscar (garantir <= N)
    # ------------------------------
    num_buscas = min(num_buscas, N)
    valores_busca = random.sample(dados, num_buscas)

    # ------------------------------
    # 5. Tempo de busca na AVL (usando find)
    # ------------------------------
    inicio = time.perf_counter()
    for v in valores_busca:
        _ = avl.find(v)   # retorna data ou None
    tempo_avl = time.perf_counter() - inicio

    # ------------------------------
    # 6. Tempo de busca na LISTA (operador 'in' - O(n))
    # ------------------------------
    inicio = time.perf_counter()
    for v in valores_busca:
        _ = v in lista
    tempo_lista = time.perf_counter() - inicio

    # ------------------------------
    # RESULTADOS
    # ------------------------------
    print(f"Tempo busca AVL  : {tempo_avl:.6f} s")
    print(f"Tempo busca LISTA: {tempo_lista:.6f} s")

    if tempo_avl > 0:
        fator = tempo_lista / tempo_avl
        print(f"AVL foi aproximadamente {fator:.1f}x mais rápida.")
    else:
        print("Tempo AVL muito pequeno (≈0); não é possível calcular fator.")

if __name__ == "__main__":
    # Rode benchmarks crescentes
    for N in [10_000, 50_000, 100_000, 200_000]:
        benchmark(N)
