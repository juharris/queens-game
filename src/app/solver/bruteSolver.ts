import { Board, Cell, CellPosition, CellValue } from '../board'
import { ConnectBlobsResponse } from '../validator/boardValidator'
import { BoardSolution } from './solution'

export class BruteSolver {
    private static markCellAsNotQueen(cell: Cell): void {
        if (cell.value === CellValue.Queen) {
            throw new Error(`The cell ${cell.position} is already marked as having a queen.`)
        }
        cell.value = CellValue.NotQueen
    }

    private static markAsNotQueen(board: Board, position: CellPosition): void {
        const cell = board.getCell(position)
        BruteSolver.markCellAsNotQueen(cell)
    }

    private static markAsQueen(cell: Cell, board: Board, position: CellPosition, unfilledBlobCells: Set<string>[]): void {
        if (cell.value === CellValue.NotQueen) {
            throw new Error(`The cell ${position} is already marked as not having a queen.`)
        }
        cell.value = CellValue.Queen
        // Clear the blob.
        const blob = unfilledBlobCells[cell.color]
        blob.delete(position)
        for (const pos of blob) {
            BruteSolver.markAsNotQueen(board, pos)
        }
        blob.clear()

        const [row, column] = cell.position!

        // Mark all cells in the same row as not having a queen.
        for (let c = 0; c < board.cells[row].length; ++c) {
            if (c === column) {
                continue
            }
            BruteSolver.markCellAsNotQueen(board.cells[row][c])
        }

        // Mark all cells in the same column as not having a queen.
        for (let r = 0; r < board.cells.length; ++r) {
            if (r === row) {
                continue
            }
            BruteSolver.markCellAsNotQueen(board.cells[r][column])
        }

        // Mark any adjacent cells as not having a queen.
        // Just need to check the corner cell since we already checked the row and column.
        if (row > 0) {
            if (column > 0) {
                BruteSolver.markCellAsNotQueen(board.cells[row - 1][column - 1])
            }
            if (column + 1 < board.cells[row].length) {
                BruteSolver.markCellAsNotQueen(board.cells[row - 1][column + 1])
            }
        }

        if (row + 1 < board.cells.length) {
            if (column > 0) {
                BruteSolver.markCellAsNotQueen(board.cells[row + 1][column - 1])
            }
            if (column + 1 < board.cells[row].length) {
                BruteSolver.markCellAsNotQueen(board.cells[row + 1][column + 1])
            }
        }
    }

    /**
     * Finds a unique solution for the given board, if it exists.
     * @param board A square board with enough colors and properly connected blobs.
     */
    findUniqueSolution(board: Board, blobs: ConnectBlobsResponse): BoardSolution {
        const unfilledBlobCells: ConnectBlobsResponse['blobsByColor'] = []
        for (const blob of blobs.blobsByColor) {
            unfilledBlobCells.push(new Set(blob))
        }

        // Check if any blobs have only one open cell.
        for (const blob of unfilledBlobCells) {
            if (blob.size === 1) {
                const position = blob.values().next().value!
                const cell = board.getCell(position)
                BruteSolver.markAsQueen(cell, board, position, unfilledBlobCells)
            }
        }
        // Check if any rows have only one open cell.
        // Check if any columns have only one open cell.
        // Check if any blobs only have cells in one row.
        // Check if any blobs only have cells in one column.
        // Check if any rows or columns have just 2 cells that can have a queen and mark the adjacent cells as not having a queen.
        // Check if any rows or columns have just 3 cells that can have a queen and mark the adjacent middle cells as not having a queen.
        // Check if any blobs are only in some rows, then mark other cells as not having a queen.
        // TODO Get queens.
        return new BoardSolution([])
    }
}