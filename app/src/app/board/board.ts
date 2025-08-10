import { Cell, CellPosition } from '.'
import { CellCoordinates } from './cell'

export class Board {
    constructor(
        public cells: Cell[][],
    ) {
        for (let row = 0; row < cells.length; ++row) {
            for (let column = 0; column < cells[row].length; ++column) {
                cells[row][column].position = [row, column]
            }
        }
    }

    public getCell(position: CellCoordinates): Cell {
        return this.cells[position[0]][position[1]]
    }

    public getCellByPosition(position: CellPosition): Cell {
        const pos = position.split(',').map(Number)
        return this.cells[pos[0]][pos[1]]
    }
}