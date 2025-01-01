import { Board } from '../board'

export interface BoardGenerator {
    generateBoard(): Board
}