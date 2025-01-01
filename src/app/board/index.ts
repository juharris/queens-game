export enum CellValue {
    Blank = 0,
    NotQueen = 1,
    Queen = 2,
}

export interface Cell {
    color: number
    value: number
}

export class Board {
    constructor(public cells: Cell[][]) { }
}