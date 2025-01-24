import { Column, Entity } from "typeorm";
import { parentEntity } from ".";

@Entity('users')
export class User extends parentEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 5 })
    creditBalance: number;

}
