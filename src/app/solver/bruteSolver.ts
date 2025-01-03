import { Board } from '../board'
import { ConnectBlobsResponse } from '../validator/boardValidator'
import { BoardSolution } from './solution'

export class BruteSolver {
    /**
     * Finds a unique solution for the given board, if it exists.
     * @param board A square board with enough colors and properly connected blobs.
     */
    findUniqueSolution(board: Board, blobs: ConnectBlobsResponse): BoardSolution | undefined{
        // TODO Check if any blobs have only one open cell.
        // Check if any rows have only one open cell.
        // Check if any columns have only one open cell.
        // Check if any blobs only have cells in one row.
        // Check if any blobs only have cells in one column.
        // Check if any blobs are only in some rows, then mark other cells as not having a queen.
        return undefined
    }
}