import { Board, CellPosition, CellValue, getCell } from '../board'
import { ConnectBlobsResponse } from '../validator/boardValidator'
import { BoardSolution } from './solution'

export class BruteSolver {
    private static markAsNotQueen(board: Board, position: CellPosition): void {
        const cell = getCell(board, position)
        if (cell.value === CellValue.Queen) {
            throw new Error(`The cell ${position} is already marked as having a queen.`)
        }
        cell.value = CellValue.NotQueen
    }

    private static markAsQueen(board: Board, position: CellPosition, unfilledBlobCells: Set<string>[]): void {
        const cell = getCell(board, position)
        if (cell.value === CellValue.NotQueen) {
            throw new Error(`The cell ${position} is already marked as not having a queen.`)
        }
        cell.value = CellValue.Queen
        // Clear the blob.
        const blob = unfilledBlobCells[cell.color]
        blob.delete(position)
        for (const blobPosition of blob) {
            BruteSolver.markAsNotQueen(board, blobPosition)
        }
        blob.clear()

        const [row, column] = cell.position!
        // TODO Mark all cells in the same row as not having a queen.
        // TODO Mark all cells in the same column as not having a queen.
        // TODO Mark any adjacent cells as not having a queen.
        // If any of these cells are already marked as having a queen, then throw an exception.
    }

    /**
     * Finds a unique solution for the given board, if it exists.
     * @param board A square board with enough colors and properly connected blobs.
     */
    findUniqueSolution(board: Board, blobs: ConnectBlobsResponse): BoardSolution | undefined {
        const unfilledBlobCells: ConnectBlobsResponse['blobsByColor'] = []
        for (const blob of blobs.blobsByColor) {
            unfilledBlobCells.push(new Set(blob))
        }

        // Check if any blobs have only one open cell.
        for (const blob of unfilledBlobCells) {
            if (blob.size === 1) {
                const position = blob.values().next().value!
                BruteSolver.markAsQueen(board, position, unfilledBlobCells)
            }
        }
        // Check if any rows have only one open cell.
        // Check if any columns have only one open cell.
        // Check if any blobs only have cells in one row.
        // Check if any blobs only have cells in one column.
        // Check if any blobs are only in some rows, then mark other cells as not having a queen.
        return undefined
    }
}