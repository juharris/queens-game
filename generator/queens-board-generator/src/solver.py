from collections import defaultdict
from dataclasses import dataclass

import numpy as np
from numpy.typing import NDArray

from .board import Board


@dataclass
class Solver:
    board: Board

    def solve(self) -> NDArray[np.bool]:
        result = np.zeros_like(self.board.colors, dtype=np.bool)
        groups: defaultdict[np.int8,
                            list[tuple[int, int]]] = defaultdict(list)
        for i, row in enumerate(self.board.colors):
            for j, col in enumerate(row):
                groups[col].append((i, j))

        return result

    def check_easys(self):
        pass
