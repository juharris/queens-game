import { Board, Cell, CellPosition } from '.'

export function getCell(board: Board, position: CellPosition): Cell {
    const pos = position.split(',').map(Number)
    const result = board.cells[pos[0]][pos[1]]
    if (result.position === undefined) {
        result.position = pos
    }
    return result
}