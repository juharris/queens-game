from collections import Counter
from dataclasses import dataclass
from enum import Enum
from typing import Iterable

import numpy as np
from numpy.typing import NDArray

from .board import Board


class SolutionLabel(Enum):
    UNKNOWN = 0
    NOT_QUEEN = 1
    QUEEN = 2


Position = tuple[int, int]
Solution = NDArray[np.int8]


class NoChangesMade(Exception):
    pass


@dataclass
class Changes:
    was_changed_made: bool


@dataclass
class Solver:
    board: Board

    def __post_init__(self):
        self._init_groups()

    def solve(self) -> Solution:
        result = np.zeros_like(self.board.colors, dtype=SolutionLabel)
        difficulty = 0
        while not self._is_solved():
            changes = self.check_easys(result)
            if changes.was_changed_made:
                # Try to look for easy changes.
                continue
            changes = self.check_blocking_colors(result)
            if changes.was_changed_made:
                difficulty = max(difficulty, 1)
            else:
                raise NoChangesMade("Possible infinite loop.")

        return result

    def _init_groups(self):
        self.groups: dict[np.int8,
                          set[Position]] = dict()
        for i, row in enumerate(self.board.colors):
            for j, color in enumerate(row):
                positions: set[Position
                               ] | None = self.groups.get(color, None)
                if positions is None:
                    self.groups[color] = positions = set()
                positions.add((i, j))

    def _is_solved(self):
        return len(self.groups) == 0

    def check_blocking_colors(self, solution: Solution) -> Changes:
        was_change_made = False

        # For each cell that is unknown, check if it blocks all of a color.
        for i, row in enumerate(solution):
            for j, sol in enumerate(row):
                if sol == SolutionLabel.UNKNOWN.value:
                    # Check if any colors are completely covered by targets.
                    targets = self.get_target_positions(solution, i, j)
                    color_counts = self.get_color_counts(targets)
                    for color, count in color_counts.items():
                        if len(self.groups[color]) <= count:
                            self.set_not_queen(solution, i, j)
                            was_change_made = True
                            break

        return Changes(was_change_made)

    def check_easys(self, solution: Solution) -> Changes:
        was_change_made = False
        # Check rows for only 1 unknown.
        for i, row in enumerate(solution):
            pos = None
            for j, sol in enumerate(row):
                if sol == SolutionLabel.UNKNOWN.value:
                    if pos is not None:
                        # There are at least 2 unknowns in this column.
                        pos = None
                        break
                    pos = (i, j)
            if pos is not None:
                was_change_made = True
                self.set_queen(solution, pos)

        # Check columns for only 1 unknown.
        for j, col in enumerate(solution.transpose()):
            pos = None
            for i, sol in enumerate(col):
                if sol == SolutionLabel.UNKNOWN.value:
                    if pos is not None:
                        # There are at least 2 unknowns in this row.
                        pos = None
                        break
                    pos = (i, j)
            if pos is not None:
                was_change_made = True
                self.set_queen(solution, pos)

        # Check colors for only 1 value.
        for _color, positions in tuple(self.groups.items()):
            if len(positions) == 1:
                pos = next(iter(positions))
                was_change_made = True
                self.set_queen(solution, pos)

        return Changes(was_change_made)

    def _generate_target_positions(self, solution: Solution, row: int, col: int):
        """Finds the positions that this `position` attacks."""
        size = solution.shape[0]
        # Get the row.
        for x in range(size):
            if x != row and solution[x, col] == SolutionLabel.UNKNOWN.value:
                yield (x, col)
        # Get the column.
        for y in range(size):
            if y != col and solution[row, y] == SolutionLabel.UNKNOWN.value:
                yield (row, y)
        if row > 0:
            if col > 0 and solution[row - 1, col-1] == SolutionLabel.UNKNOWN.value:
                yield (row-1, col-1)
            if col + 1 < size and solution[row - 1, col+1] == SolutionLabel.UNKNOWN.value:
                yield (row-1, col+1)
        if row + 1 < size:
            if col > 0 and solution[row + 1, col-1] == SolutionLabel.UNKNOWN.value:
                yield (row+1, col-1)
            if col + 1 < size and solution[row+1, col+1] == SolutionLabel.UNKNOWN.value:
                yield (row+1, col+1)

    def get_color_counts(self, targets: Iterable[Position]) -> Counter[np.int8]:
        result: Counter[np.int8] = Counter()
        for pos in targets:
            result[self.board.colors[pos]] += 1
        return result

    def get_target_positions(self, solution: Solution, row: int, col: int) -> list[Position]:
        """Finds the positions that this `position` attacks."""
        return list(self._generate_target_positions(solution, row, col))

    def set_queen(self, solution: Solution, position: Position):
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

    def _remove_from_groups(self, position: Position):
        color = self.board.colors[position]
        try:
            positions_for_color = self.groups[color]
            positions_for_color.remove(position)
            if len(positions_for_color) == 0:
                del self.groups[color]
        except:
            pass
