import { Column, Entity, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { paymentEntity } from "./payment.entity";

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

    @OneToMany(() => paymentEntity, (payment) => payment.user)
    payments: paymentEntity[]
}
