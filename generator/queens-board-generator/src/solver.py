from dataclasses import dataclass
from enum import Enum

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

    def __post_init__(self):
        self._init_groups()

    def solve(self) -> Solution:
        result = np.zeros_like(self.board.colors, dtype=SolutionLabel)
        while not self._is_solved():
            self.check_easys(result)

        return result

    def _init_groups(self):
        self.groups: dict[np.int8,
                          set[tuple[int, int]]] = dict()
        for i, row in enumerate(self.board.colors):
            for j, color in enumerate(row):
                positions: set[tuple[int, int]
                               ] | None = self.groups.get(color, None)
                if positions is None:
                    self.groups[color] = positions = set()
                positions.add((i, j))

    def _is_solved(self):
        return len(self.groups) == 0

    def check_easys(self, solution: Solution):
        # Check rows for only 1 unknown.
        for i, row in enumerate(solution):
            pos = None
            for j, sol in enumerate(row):
                if sol == SolutionLabel.UNKNOWN.value:
                    if pos is not None:
                        pos = None
                        break
                    pos = (i, j)
            if pos is not None:
                self.set_queen(solution, pos)
                break

        # Check columns for only 1 unknown.
        for j, col in enumerate(solution.transpose()):
            pos = None
            for i, sol in enumerate(col):
                if sol == SolutionLabel.UNKNOWN.value:
                    if pos is not None:
                        pos = None
                        break
                    pos = (i, j)
            if pos is not None:
                self.set_queen(solution, pos)
                break

        # Check colors for only 1 value.
        for _color, positions in tuple(self.groups.items()):
            if len(positions) == 1:
                pos = next(iter(positions))
                self.set_queen(solution, pos)
                break

    def set_queen(self, solution: Solution, position: tuple[int, int]):
        row, col = position
        size = solution.shape[0]
        # Clear rows, colums, adjacent.
        solution[row, :] = SolutionLabel.NOT_QUEEN.value
        for col_index in range(size):
            self._remove_from_groups((row, col_index))
        solution[:, col] = SolutionLabel.NOT_QUEEN.value
        for row_index in range(size):
            self._remove_from_groups((row_index, col))
        if row > 0:
            if col > 0:
                self.set_not_queen(solution, row-1, col-1)
            if col + 1 < size:
                self.set_not_queen(solution, row-1, col+1)
        if row + 1 < size:
            if col > 0:
                self.set_not_queen(solution, row+1, col-1)
            if col + 1 < size:
                self.set_not_queen(solution, row+1, col+1)

        solution[position] = SolutionLabel.QUEEN.value
        # It is already removed from groups from the loops above.

    def set_not_queen(self, solution: Solution, row: int, col: int):
        solution[row, col] = SolutionLabel.NOT_QUEEN.value
        self._remove_from_groups((row, col))

    def _remove_from_groups(self, position: tuple[int, int]):
        color = self.board.colors[position]
        try:
            positions_for_color = self.groups[color]
            positions_for_color.remove(position)
            if len(positions_for_color) == 0:
                del self.groups[color]
        except:
            pass
