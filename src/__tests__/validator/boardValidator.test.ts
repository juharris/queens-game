import { CellCoordinates } from '@/app/board/cell'
import { Board, Cell, CellPosition } from '../../app/board'
import { BoardValidator, InvalidBoardReason } from '../../app/validator/boardValidator'

describe("BoardValidator", () => {
    describe("areBlobsConnected", () => {
        it("should return blobs when all same-colored cells are connected", () => {
            const board = new Board([
                [new Cell(0), new Cell(0), new Cell(1)],
                [new Cell(2), new Cell(0), new Cell(1)],
                [new Cell(2), new Cell(2), new Cell(2)],
            ])
            const blobs = BoardValidator.areBlobsConnected(board)
            expect(blobs).toBeDefined()
            expect(blobs!.blobsByColor).toStrictEqual([
                new Map<CellPosition, CellCoordinates>([['0,0', [0, 0]], ['0,1', [0, 1]], ['1,1', [1, 1]]]),
                new Map<CellPosition, CellCoordinates>([['0,2', [0, 2]], ['1,2', [1, 2]]]),
                new Map<CellPosition, CellCoordinates>([['1,0', [1, 0]], ['2,0', [2, 0]], ['2,1', [2, 1]], ['2,2', [2, 2]]]),
            ])
            expect(BoardValidator.isBoardValid(board).invalidReason).toBe(InvalidBoardReason.NoUniqueSolution)

        })

        it("should return undefined with connected blobs, but not enough colors", () => {
            const board = new Board([
                [new Cell(0), new Cell(0), new Cell(1)],
                [new Cell(1), new Cell(0), new Cell(1)],
                [new Cell(1), new Cell(1), new Cell(1)],
            ])
            const blobs = BoardValidator.areBlobsConnected(board)
            expect(blobs).toBeUndefined()
            expect(BoardValidator.isBoardValid(board).invalidReason).toBe(InvalidBoardReason.NotEnoughColors)
        })

        it("should return undefined when same-colored cells are disconnected", () => {
            const board = new Board([
                [new Cell(0), new Cell(1), new Cell(1), new Cell(0)],
                [new Cell(1), new Cell(2), new Cell(2), new Cell(1)],
                [new Cell(1), new Cell(2), new Cell(2), new Cell(1)],
                [new Cell(0), new Cell(1), new Cell(1), new Cell(3)],
            ])
            expect(BoardValidator.areBlobsConnected(board)).toBeUndefined()
            expect(BoardValidator.isBoardValid(board).invalidReason).toBe(InvalidBoardReason.DisconnectedBlobs)
        })
    })

    describe("hasEnoughColors", () => {
        it("should return true when each row has enough unique colors", () => {
            const board = new Board([
                [new Cell(0), new Cell(1), new Cell(2)],
                [new Cell(1), new Cell(2), new Cell(0)],
                [new Cell(2), new Cell(0), new Cell(1)],
            ])
            expect(BoardValidator.hasEnoughColors(board)).toBe(true)
            // Blobs are not connected.
            expect(BoardValidator.isBoardValid(board).invalidReason).toBe(InvalidBoardReason.DisconnectedBlobs)
        })

        it("should return false when rows do not have enough unique colors", () => {
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