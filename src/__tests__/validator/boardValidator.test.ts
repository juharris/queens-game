import { Board, Cell } from '../../app/board'
import { BoardValidator, InvalidBoardReason } from '../../app/validator/boardValidator'

describe('BoardValidator', () => {
    describe('areBlobsConnected', () => {
        it('should return true when all same-colored cells are connected', () => {
            const board = new Board([
                [new Cell(0), new Cell(0), new Cell(1)],
                [new Cell(2), new Cell(0), new Cell(1)],
                [new Cell(2), new Cell(2), new Cell(2)],
            ])
            expect(BoardValidator.areBlobsConnected(board)).toBe(true)
            expect(BoardValidator.isBoardValid(board).invalidReason).toBeUndefined()

        })

        it('should return false when same-colored cells are disconnected', () => {
            const board = new Board([
                [new Cell(0), new Cell(1), new Cell(1), new Cell(0)],
                [new Cell(1), new Cell(2), new Cell(2), new Cell(1)],
                [new Cell(1), new Cell(2), new Cell(2), new Cell(1)],
                [new Cell(0), new Cell(1), new Cell(1), new Cell(3)],
            ])
            expect(BoardValidator.areBlobsConnected(board)).toBe(false)
            expect(BoardValidator.isBoardValid(board).invalidReason).toBe(InvalidBoardReason.DisconnectedBlobs)
        })
    })

    describe('hasEnoughColors', () => {
        it('should return true when each row has enough unique colors', () => {
            const board = new Board([
                [new Cell(0), new Cell(1), new Cell(2)],
                [new Cell(1), new Cell(2), new Cell(0)],
                [new Cell(2), new Cell(0), new Cell(1)],
            ])
            expect(BoardValidator.hasEnoughColors(board)).toBe(true)
            // Blobs are not connected.
            expect(BoardValidator.isBoardValid(board).invalidReason).toBe(InvalidBoardReason.DisconnectedBlobs)
        })

        it('should return false when rows do not have enough unique colors', () => {
            const board = new Board([
                [new Cell(0), new Cell(0), new Cell(0)],
                [new Cell(1), new Cell(1), new Cell(1)],
                [new Cell(0), new Cell(1), new Cell(0)],
            ])
            expect(BoardValidator.hasEnoughColors(board)).toBe(false)
            expect(BoardValidator.isBoardValid(board).invalidReason).toBe(InvalidBoardReason.NotEnoughColors)
        })
    })
})