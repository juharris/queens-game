import numpy as np

from src.solver import SolutionLabel, Solver
from src.board import Board


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
    assert np.array_equal(expected_solution, solution)
