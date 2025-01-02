export enum CellValue {
    Blank = 0,
    NotQueen = 1,
    Queen = 2,
}

export class Cell {
    constructor(
        public color: number,
        public value: CellValue = CellValue.Blank,
    ) {
    }
}

export class Board {
    constructor(
        public cells: Cell[][],
    ) {
    }
}