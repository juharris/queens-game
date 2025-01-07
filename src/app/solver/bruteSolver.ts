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
        const cell = board.getCellByPosition(position)
        BruteSolver.markCellAsNotQueen(cell)
    }

    private static markAsQueen(cell: Cell, board: Board, position: CellPosition, unfilledBlobCells: ConnectBlobsResponse['blobsByColor']): void {
        if (cell.value === CellValue.NotQueen) {
            throw new Error(`The cell ${position} is already marked as not having a queen.`)
        }
        cell.value = CellValue.Queen
        // Clear the blob.
        const blob = unfilledBlobCells[cell.color]
        blob.delete(position)
        for (const pos of blob.values()) {
            BruteSolver.markCellAsNotQueen(board.getCell(pos))
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
        const size = board.cells.length
        const unfilledBlobCells: ConnectBlobsResponse['blobsByColor'] = []
        for (const blob of blobs.blobsByColor) {
            unfilledBlobCells.push(new Map(blob))
        }

        // TODO Loop.

        // Check if any blobs have only one available cell.
        for (const blob of unfilledBlobCells) {
            if (blob.size === 1) {
                const position = blob.keys().next().value!
                const coords = blob.values().next().value!
                const cell = board.getCell(coords)
                BruteSolver.markAsQueen(cell, board, position, unfilledBlobCells)
            }
        }

        // Check if any rows have only one available cell.
        for (let row = 0; row < size; ++row) {
            // TODO Optimize if we don't need all and just try to get the one.
            const availableCells = board.cells[row].filter(cell => cell.value === CellValue.Blank)
            if (availableCells.length === 1) {
                const cell = availableCells[0]
                BruteSolver.markAsQueen(cell, board, cell.getIndexablePosition(), unfilledBlobCells)
            }
            /* Don't need because we'll check for straight-like blobs.
            // TODO Check for just 2 or 3 cells sequentially and mark the adjacent cells as not having a queen.
            if (availableCells.length === 2) {
                const [cell1, cell2] = availableCells
                if (Math.abs(cell1.position![1] - cell2.position![1]) === 1) {
                    // The cells are adjacent.
                    // TODO Mark the adjacent cells as not having a queen.
                }
            }
            */
        }

        // Check if any columns have only one available cell.
        for (let column = 0; column < size; ++column) {
            // TODO Optimize if we don't need all and just try to get the one.
            const availableCells = board.cells
                .map(row => row[column])
                .filter(cell => cell.value === CellValue.Blank)
            if (availableCells.length === 1) {
                const cell = availableCells[0]
                BruteSolver.markAsQueen(cell, board, cell.getIndexablePosition(), unfilledBlobCells)
            }
            /* Don't need because we'll check for straight-like blobs.
            // TODO Check for just 2 or 3 cells sequentially and mark the adjacent cells as not having a queen.
            */
        }

        // Check if any blobs only have cells in one row.
        // Check if any blobs only have cells in one column.
        // Check if any blobs are only in some rows/columns, then mark the other rows/columns cells as not having a queen in that blob.
        // Check for for cells adjacent to straight like blobs, then we don't need some checks above.
        // Example: Check for cells outside of and inside of L-like blobs or T-like blobs.
        // TODO Get queens.
        return new BoardSolution([])
    }
}