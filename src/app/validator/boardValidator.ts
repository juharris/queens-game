import { Board } from '../board'

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

    public static isBoardValid(board: Board): boolean {
        if (!BoardValidator.hasEnoughColors(board)) {
            return false
        }

        if (!BoardValidator.areBlobsConnected(board)) {
            return false
        }

        // TODO Ensure that the game is deterministically solvable.
        return true
    }
}