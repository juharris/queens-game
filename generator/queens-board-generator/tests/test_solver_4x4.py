import numpy as np

from src.solver import SolutionLabel, Solver
from src.board import Board


def test_simple():
    # Make a board that can be solved deterministically.
    size = 4
    board = Board.from_size(size)
    board.colors[0, :] = 1
    board.colors[0, 1] = 0
    board.colors[1, :] = 1
    board.colors[2, :] = 2
    board.colors[3, :] = 3
    solver = Solver(board)
    solution = solver.solve()
    expected_solution = np.zeros((size, size), dtype=np.int8)
    expected_solution.fill(SolutionLabel.NOT_QUEEN.value)
    expected_solution[0, 1] = SolutionLabel.QUEEN.value
    expected_solution[1, 3] = SolutionLabel.QUEEN.value
    expected_solution[2, 0] = SolutionLabel.QUEEN.value
    expected_solution[3, 2] = SolutionLabel.QUEEN.value
    assert np.array_equal(expected_solution, solution)
