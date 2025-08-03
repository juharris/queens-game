from .board import Board
import numpy as np
from numpy.typing import NDArray


class Solver:
    def solve(self, board: Board) -> NDArray[np.bool]:
        result = np.zeros_like(board.colors, dtype=np.bool)
        return result
