import { Board } from '../board'
import { InvalidBoardReason } from '../validator/boardValidator'

export class BoardGeneratorResponse {
    constructor(
        public board: Board,
        public stats: Map<InvalidBoardReason, number> | undefined = undefined,
    ) {
    }
}

export interface BoardGenerator {
    generateBoard(size: number, maxNumTries?: number): BoardGeneratorResponse
}