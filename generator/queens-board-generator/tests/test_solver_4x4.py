import numpy as np
import pytest

from src.solver import NoChangesMade, SolutionLabel, Solver
from src.board import Board


def test_simple():
    # Make a board that can be solved deterministically.
    colors = np.array([
        [1, 0, 1, 1],
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [3, 3, 3, 3],
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
    assert np.array_equal(expected_solution, solution)


def test_non_deterministic():
    colors = np.array([
        [2, 0, 1, 3],
        [2, 0, 1, 3],
        [2, 0, 1, 3],
        [2, 0, 1, 3],
    ], dtype=np.int8)
    board = Board(colors)
    solver = Solver(board)
    with pytest.raises(NoChangesMade):
        solver.solve()


def test_no_solution():
    colors = np.array([
        [2, 0, 0, 3],
        [2, 0, 0, 3],
        [2, 0, 0, 3],
        [2, 0, 0, 3],
    ], dtype=np.int8)
    board = Board(colors)
    solver = Solver(board)
    with pytest.raises(NoChangesMade):
        solver.solve()


def test_eliminates_color():
    # Make a board that can be solved deterministically by noticing that a space blocks a color.
    colors = np.array([
        [2, 0, 0, 3],
        [2, 2, 0, 3],
        [2, 2, 0, 0],
        [2, 1, 1, 0],
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
    assert np.array_equal(expected_solution, solution)
