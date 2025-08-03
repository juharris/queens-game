import numpy as np

from src.board import Board
from src.solver import Solver


def main():
    size = 4
    board = Board.from_size(size)
    for r in range(size):
        board.colors[r, :] = r
        for c in range(size):
            board.groups[np.int8(r)].append((r, c))
    solver = Solver()
    print(f"Board: {board}")
    solution = solver.solve(board)
    print(f"solution: {solution}")


if __name__ == "__main__":
    main()
