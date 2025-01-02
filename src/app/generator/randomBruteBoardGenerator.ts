import { BoardGenerator, BoardGeneratorResponse } from '.'
import { Board, CellValue } from '../board'
import { BoardValidator } from '../validator'

export class RandomBruteBoardGenerator implements BoardGenerator {
    private static generateRandomBoardCandidate(size: number): Board {
        // TODO Optimization: Investigate optimizing with less call to `Math.random` by converting the random number to base `size`, then using that value for multiple cells.
        const cells: Board['cells'] = []
        for (let i = 0; i < size; ++i) {
            const row = []
            for (let j = 0; j < size; ++j) {
                // Randomly pick a color.
                // Could try biasing to pick a nearby color to avoid boards with disconnected color blobs.
                const color = Math.floor(Math.random() * size)
                row.push({
                    color,
                    value: CellValue.Blank,
                })
            }
            cells.push(row)
        }
        return new Board(cells)
    }

    generateBoard(size: number, maxNumTries?: number): BoardGeneratorResponse {
        let tryNumber = 0
        maxNumTries = maxNumTries || 1_000_000
        while (tryNumber++ < maxNumTries) {
            const board = RandomBruteBoardGenerator.generateRandomBoardCandidate(size)
            if (BoardValidator.isBoardValid(board)) {
                return new BoardGeneratorResponse(board, tryNumber)
            }
        }

        throw new Error(`Failed to generate a valid board after ${maxNumTries} tries.`)
    }
}