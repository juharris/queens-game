from src.board import Board
from src.solver import Solver


def main():
    # Make a board that can be solved deterministically.
    size = 4
    board = Board.from_size(size)
    board.colors[0, :] = 1
    board.colors[0, 1] = 0
    board.colors[1, :] = 1
    board.colors[2, :] = 2
    board.colors[3, :] = 3
    solver = Solver(board)
    print(f"Board: {board}")
    solution = solver.solve()
    print(f"solution: {solution}")


if __name__ == "__main__":
    main()
