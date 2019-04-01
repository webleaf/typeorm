import {Column, Entity, PrimaryColumn} from "../../../../src";

@Entity()
export class User {

    @PrimaryColumn()
    id: number;

    @Column({nullable:true})
    name:string
    
    @Column({nullable:true})
    status:string

}