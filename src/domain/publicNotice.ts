import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class PublicNotice {

    @PrimaryGeneratedColumn()
    id : number | undefined;

    @CreateDateColumn({type : "timestamp"})
    createdAt : string | undefined;

    @UpdateDateColumn({type : "timestamp"})
    updatedAt : string | undefined;

    @Column()
    fullName : string | undefined;

    @Column()
    noticeNumber : string | undefined;

    @Column()
    valid : boolean = true;


    constructor(fullName: string | undefined, noticeNumber: string | undefined) {
        this.fullName = fullName;
        this.noticeNumber = noticeNumber;
    }
}