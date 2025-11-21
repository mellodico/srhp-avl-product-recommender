import time
from statistics import mean

class AVLAnalysis:
    """
    Classe utilitária para medir o tempo de execução das operações
    insert, delete e find de uma AVLTree usando time.perf_counter().
    """

    def __init__(self, tree):
        """
        Recebe uma instância já criada de AVLTree.
        """
        self.tree = tree

    # ---------------------------------------------------------------------
    #  MÉTODOS QUE MEDem UMA ÚNICA OPERAÇÃO
    # ---------------------------------------------------------------------

    def time_insert(self, key, data):
        """Mede o tempo de execução da operação insert()."""
        start = time.perf_counter()
        self.tree.insert(key, data)
        end = time.perf_counter()
        return end - start

    def time_delete(self, key):
        """Mede o tempo da operação delete()."""
        start = time.perf_counter()
        self.tree.delete(key)
        end = time.perf_counter()
        return end - start

    def time_find(self, key):
        """Mede o tempo da operação find()."""
        start = time.perf_counter()
        self.tree.find(key)
        end = time.perf_counter()
        return end - start

    # ---------------------------------------------------------------------
    #  MÉTODOS PARA BENCHMARK COMPLETO
    # ---------------------------------------------------------------------

    def benchmark_many_inserts(self, items, repeat=5):
        """
        Mede o tempo médio de várias inserções.
        items: lista de chaves a serem inseridas.
        repeat: número de repetições para média.
        """
        resultados = []

        for _ in range(repeat):
            # resetar árvore para cada repetição
            from avl_tree import AVLTree
            self.tree = AVLTree()

            start = time.perf_counter()
            for key in items:
                self.tree.insert(key, {"produtos": []})
            end = time.perf_counter()

            resultados.append(end - start)

        return {
            "min": min(resultados),
            "max": max(resultados),
            "media": mean(resultados)
        }

    def benchmark_many_searches(self, items, repeat=5):
        """
        Mede o tempo médio de várias operações find().
        items: lista de chaves existentes na árvore.
        """
        resultados = []

        for _ in range(repeat):
            start = time.perf_counter()
            for key in items:
                self.tree.find(key)
            end = time.perf_counter()
            resultados.append(end - start)

        return {
            "min": min(resultados),
            "max": max(resultados),
            "media": mean(resultados)
        }

    def benchmark_many_deletes(self, items, repeat=5):
        """
        Mede o tempo médio de várias operações delete().
        items: lista de chaves existentes na árvore.
        """
        resultados = []

        for _ in range(repeat):
            # reconstruir árvore para cada repetição
            from avl_tree import AVLTree
            self.tree = AVLTree()

            # primeiro inserir tudo
            for key in items:
                self.tree.insert(key, {"produtos": []})

            # medir remoções
            start = time.perf_counter()
            for key in items:
                self.tree.delete(key)
            end = time.perf_counter()

            resultados.append(end - start)

        return {
            "min": min(resultados),
            "max": max(resultados),
            "media": mean(resultados)
        }
