import { CellValue } from "@/app/board"
import { RandomBruteBoardGenerator } from "@/app/generator/randomBruteBoardGenerator"

describe("RandomBruteBoardGenerator", () => {
    describe("generateBoard", () => {
        it("size 1", () => {
            const generator = new RandomBruteBoardGenerator()
            const response = generator.generateBoard(1)
            expect(response.board.cells.length).toBe(1)
            expect(response.board.cells[0].length).toBe(1)
            const {board, numAttempts, stats} = response
            expect(numAttempts).toBe(1)
            expect(stats).toStrictEqual(new Map())
            const cell = board.cells[0][0]
            expect(cell.color).toBe(0)
            expect(cell.position).toStrictEqual([0, 0])
            expect(cell.value).toBe(CellValue.Queen)
        })
    })
})