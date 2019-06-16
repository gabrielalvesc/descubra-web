import { DatePipe } from '@angular/common';
export class Evento {
    constructor(
        public name: string,
        public description: string,
        public category: string,
        public startDate: string,
        public endDate: string,
        public startHour: string,
        public endHour: string,
        public address: string,
        public location: string,
        public imageLink: string,
        public videoLink: string,
        public city: string,
        public freePaid: string
    ){}
}
