import { Board } from '../board'

export enum InvalidBoardReason {
    NotEnoughColors = "Board does not have enough unique colors.",
    DisconnectedBlobs = "Same-colored cells are disconnected.",
}

export class BoardValidatorResponse {
    constructor(public invalidReason: InvalidBoardReason | undefined = undefined) {}
}

export class BoardValidator {
    static areBlobsConnected(board: Board): boolean {
        const size = board.cells.length
        const traversedColors = new Set<number>()
        const isInBlob: boolean[][] = []
        for (let i = 0; i < size; ++i) {
            isInBlob.push(new Array(size).fill(false))
        }

        const dfs = (i: number, j: number, color: number) => {
            if (i < 0 || i >= size || j < 0 || j >= size || isInBlob[i][j] || board.cells[i][j].color !== color) {
                return
            }

            isInBlob[i][j] = true

            dfs(i - 1, j, color)
            dfs(i + 1, j, color)
            dfs(i, j - 1, color)
            dfs(i, j + 1, color)
        }

        // Find blobs.
        for (let i = 0; i < size; ++i) {
            for (let j = 0; j < size; ++j) {
                if (!isInBlob[i][j]) {
                    const color = board.cells[i][j].color
                    if (traversedColors.has(color)) {
                        // A blob for this color has already been traversed, this is a new blob.
                        return false
                    }
                    dfs(i, j, color)
                    traversedColors.add(color)
                }
            }
        }

        return traversedColors.size === size
    }

    static hasEnoughColors(board: Board): boolean {
        const size = board.cells.length
        const colors = new Set<number>()
        for (let i = 0; i < size; ++i) {
            for (let j = 0; j < size; ++j) {
                colors.add(board.cells[i][j].color)
            }
            if (colors.size === size) {
                return true
            }
        }

        return false
    }

    /**
     * Determines if the board is valid.
     * @param board A square board with at most `board.cells.length` unique colors.
     * @returns `true` if the board is valid, `false` otherwise.
     */
    public static isBoardValid(board: Board): BoardValidatorResponse {
        if (!BoardValidator.hasEnoughColors(board)) {
            return new BoardValidatorResponse(InvalidBoardReason.NotEnoughColors)
        }

        if (!BoardValidator.areBlobsConnected(board)) {
            return new BoardValidatorResponse(InvalidBoardReason.DisconnectedBlobs)
        }

        // TODO Ensure that the game is deterministically solvable.
        return new BoardValidatorResponse()
    }
}