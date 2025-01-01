import { Board, CellValue } from '../board'

export class RandomBruteBoardGenerator {
    private static generateRandomBoardCandidate = (size: number): Board => {
        // TODO Optimization: Investigate optimizing with less call to `Math.random` by converting the random number to base `size`, then using that value for multiple cells.
        const cells: Board['cells'] = []
        for (let i = 0; i < size; ++i) {
            const row = []
            for (let j = 0; j < size; ++j) {
                row.push({
                    color: Math.floor(Math.random() * size),
                    value: CellValue.Blank,
                })
            }
            cells.push(row)
        }
        return new Board(cells)
    }

    private static isBoardValid(board: Board): boolean {
        // TODO
        throw new Error('Method not implemented.')
    }

    generateBoard(size: number): Board {
        let tryNumber = 0
        const maxTries = 1_000_000
        while (tryNumber++ < maxTries) {
            const board = RandomBruteBoardGenerator.generateRandomBoardCandidate(size)
            if (RandomBruteBoardGenerator.isBoardValid(board)) {
                return board
            }
        }

        throw new Error(`Failed to generate a valid board after ${maxTries} tries.`)
    }
}