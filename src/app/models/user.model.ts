export interface user {
    id:number;
    username: string;
    email:string;
    hashed_password:string;
    isLocked:boolean;
    security_question_id:number;
    answer_id:number;
    roles:string;
}