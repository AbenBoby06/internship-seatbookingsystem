import { Employee } from './employee'
import { Seats } from './seats'

export interface BookedSeat {
    id?:number,
    empId:number,
    emp?:Employee,
    seatId:number,
    seats?: Seats,
    date: string
}
