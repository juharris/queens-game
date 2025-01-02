import { Board } from '../board'

export class BoardGeneratorResponse {
    constructor(
        public board: Board,
        public attempts: number | undefined = undefined,
    ) {
    }
}

export interface BoardGenerator {
    generateBoard(size: number, maxNumTries?: number): BoardGeneratorResponse
}