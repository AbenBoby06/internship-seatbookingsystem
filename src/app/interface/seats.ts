import { Project } from "./project"
import { Module } from './module'

export interface Seats {
    seatId: number,
    seatName: string,
    projId: number,
    project: Project,
    moduleId: number,
    module?:Module
}