from collections import defaultdict
from dataclasses import dataclass
from enum import Enum
from typing import Optional

import numpy as np
from numpy.typing import NDArray

from .board import Board


class SolutionLabel(Enum):
    UNKNOWN = 0
    NOT_QUEEN = 1
    QUEEN = 2


Solution = NDArray[np.int8]


@dataclass
class Solver:
    board: Board

    def solve(self) -> Solution:
        result = np.zeros_like(self.board.colors, dtype=SolutionLabel)
        self._init_groups()
        while not self._is_solved():
            self.check_easys(result)

        return result

    def _init_groups(self):
        self.groups: defaultdict[np.int8,
                                 set[tuple[int, int]]] = defaultdict(set)
        for i, row in enumerate(self.board.colors):
            for j, col in enumerate(row):
                self.groups[col].add((i, j))

    def _is_solved(self):
        return len(self.groups) == 0

    def check_easys(self, solution: Solution):
        # TODO Check rows for only 1 unknown.
        # TODO Check columns for only 1 unknown.
        # TODO Check groups for only 1 value.
        delete_color: Optional[np.int8] = None
        for color, positions in self.groups.items():
            if len(positions) == 1:
                pos = next(iter(positions))
                self.set_queen(solution, pos)
                delete_color = color
        if delete_color is not None:
            del self.groups[delete_color]

    def set_queen(self, solution: Solution, position: tuple[int, int]):
        solution[position] = SolutionLabel.QUEEN.value
        # TODO Clear rows, colums, adjacent, and groups.
