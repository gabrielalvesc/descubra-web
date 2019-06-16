export class UserStorage {
    constructor(
        public administrator_id:number,
        public id: number,
        public username: string,
        public accessToken: string
    ){}
}