import { Board, Cell, CellValue } from "@/app/board"
import { BruteSolver } from "@/app/solver"
import { BoardValidator } from "@/app/validator/boardValidator"

describe("BruteSolver", () => {
    const solver = new BruteSolver()
    describe("findUniqueSolution", () => {
        it("should solve - 1 cell", () => {
            const board = new Board([
                [new Cell(0)],
            ])
            const blobs = BoardValidator.areBlobsConnected(board)!
            const solution = solver.findUniqueSolution(board, blobs)
            expect(solution).toBeDefined()
            expect(board.cells[0][0].value).toBe(CellValue.Queen)
        })

        it("should not solve - 2 cells", () => {
            const board = new Board([
                [new Cell(0), new Cell(0)],
                [new Cell(0), new Cell(1)],
            ])
            const blobs = BoardValidator.areBlobsConnected(board)!
            expect(() => solver.findUniqueSolution(board, blobs))
                .toThrow("TODO")
        })

        it("should not solve - 3 cells", () => {
            const board = new Board([
                [new Cell(0), new Cell(0), new Cell(1)],
                [new Cell(0), new Cell(1), new Cell(1)],
                [new Cell(2), new Cell(1), new Cell(1)],
            ])
            const blobs = BoardValidator.areBlobsConnected(board)!
            expect(() => solver.findUniqueSolution(board, blobs))
                .toThrow("TODO")
        })

        it("should solve - 4 cells", () => {
            const board = new Board([
                [new Cell(0), new Cell(0), new Cell(2), new Cell(0)],
                [new Cell(0), new Cell(0), new Cell(0), new Cell(0)],
                [new Cell(0), new Cell(0), new Cell(0), new Cell(3)],
                [new Cell(0), new Cell(1), new Cell(0), new Cell(0)],
            ])
            const blobs = BoardValidator.areBlobsConnected(board)!
            const solution = solver.findUniqueSolution(board, blobs)
            expect(solution).toBeDefined()
            expect(board.cells[0][2].value).toBe(CellValue.Queen)
            expect(board.cells[1][0].value).toBe(CellValue.Queen)
            expect(board.cells[2][3].value).toBe(CellValue.Queen)
            expect(board.cells[3][1].value).toBe(CellValue.Queen)
        })
    })
})