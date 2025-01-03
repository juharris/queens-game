import { Board } from '../board'

export enum InvalidBoardReason {
    NotEnoughColors = "Board does not have enough unique colors.",
    DisconnectedBlobs = "Same-colored cells are disconnected.",
}

export class BoardValidatorResponse {
    constructor(
        public invalidReason: InvalidBoardReason | undefined = undefined,
    ) { }
}

export class ConnectBlobsResponse {
    constructor(
        public blobsByColor: Set<string>[],
    ) { }
}

export class BoardValidator {
    static areBlobsConnected(board: Board): ConnectBlobsResponse | undefined {
        const size = board.cells.length
        const traversedColors = new Set<number>()
        const blobsByColor: Set<string>[] = []
        for (let i = 0; i < size; ++i) {
            blobsByColor.push(new Set<string>())
        }
        const isInBlob: boolean[][] = []
        for (let i = 0; i < size; ++i) {
            isInBlob.push(new Array(size).fill(false))
        }

        const dfs = (i: number, j: number, color: number, blob: Set<string>): void => {
            if (i < 0 || i >= size || j < 0 || j >= size || isInBlob[i][j] || board.cells[i][j].color !== color) {
                return
            }

            // The cell has the same color and it's not in a blob yet.
            isInBlob[i][j] = true
            blob.add(`${i},${j}`)

            dfs(i - 1, j, color, blob)
            dfs(i + 1, j, color, blob)
            dfs(i, j - 1, color, blob)
            dfs(i, j + 1, color, blob)
        }

        // Find blobs.
        for (let i = 0; i < size; ++i) {
            for (let j = 0; j < size; ++j) {
                if (!isInBlob[i][j]) {
                    const color = board.cells[i][j].color
                    if (traversedColors.has(color)) {
                        // A blob for this color has already been traversed, but this cell would start a new blob for this color.
                        return undefined
                    }
                    const blob = blobsByColor[color]
                    dfs(i, j, color, blob)
                    traversedColors.add(color)
                }
            }
        }

        if (traversedColors.size === size) {
            return new ConnectBlobsResponse(blobsByColor)
        } else {
            return undefined
        }
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

        const blobs = BoardValidator.areBlobsConnected(board)
        if (blobs === undefined) {
            return new BoardValidatorResponse(InvalidBoardReason.DisconnectedBlobs)
        }

        // TODO Ensure that the game is deterministically solvable.
        return new BoardValidatorResponse()
    }
}