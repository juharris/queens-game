import numpy as np
import pytest

from src.solver import SolutionLabel, Solver
from src.board import Board

x = SolutionLabel.NOT_QUEEN.value
Q = SolutionLabel.QUEEN.value


def test_simple():
    # Make a board that can be solved deterministically.
    colors = np.array([
        [1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2],
        [3, 3, 3, 3, 3],
        [3, 3, 3, 3, 4],
    ], dtype=np.int8)
    size = colors.shape[0]
    board = Board(colors)
    solver = Solver(board)
    solution = solver.solve()
    expected_solution = np.zeros((size, size), dtype=np.int8)
    expected_solution.fill(SolutionLabel.NOT_QUEEN.value)
    expected_solution[0, 1] = SolutionLabel.QUEEN.value
    expected_solution[1, 3] = SolutionLabel.QUEEN.value
    expected_solution[2, 0] = SolutionLabel.QUEEN.value
    expected_solution[3, 2] = SolutionLabel.QUEEN.value
    expected_solution[4, 4] = SolutionLabel.QUEEN.value
    assert np.array_equal(expected_solution, solution.board)
    assert 0 == solution.difficulty


@pytest.mark.skip("Needs review.")
def test_color_runs():
    # FIXME Review, might need to be bigger.
    colors = np.array([
        [5, 0, 0, 0, 2, 2],
        [5, 5, 0, 0, 0, 2],
        [5, 3, 3, 4, 0, 2],
        [3, 3, 3, 4, 0, 0],
        [3, 3, 4, 4, 0, 1],
        [3, 3, 3, 4, 1, 1],
    ], dtype=np.int8)
    board = Board(colors)
    solver = Solver(board)
    solution = solver.solve()
    expected_solution = np.array([
        [x, Q, x, x, x, x],
        [x, x, x, x, x, Q],
        [Q, x, x, x, x, x],
        [x, x, x, 0, x, x],
        [x, x, x, x, x, x],
        [x, x, x, x, Q, x],
    ], dtype=np.int8)
    assert np.array_equal(expected_solution, solution.board)
    assert 2 == solution.difficulty
