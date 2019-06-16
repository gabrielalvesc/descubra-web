import { User } from "./user.model";
import { Evento } from "./evento.model";

export class Administrator {
    constructor(
        public events: Array<Evento>,
        public user: User
    ){}
}