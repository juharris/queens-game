import { Board } from '../board'
import { ConnectBlobsResponse } from '../validator/boardValidator'
import { BoardSolution } from './solution'

export class BruteSolver {
    /**
     * Finds a unique solution for the given board, if it exists.
     * @param board A square board with enough colors and properly connected blobs.
     */
    findUniqueSolution(board: Board, blobs: ConnectBlobsResponse): BoardSolution | undefined{
        // TODO
        return undefined
    }
}