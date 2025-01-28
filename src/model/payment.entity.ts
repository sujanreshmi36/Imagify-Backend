import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { User } from "./user.entity";

@Entity('payment')
export class paymentEntity extends parentEntity {
    @Column()
    plan: string;

    @Column({ default: false })
    payment: boolean;

    @Column()
    amount: number;

    @Column()
    credits: number;

    @ManyToOne(() => User, (user) => user.payments)
    user: User;

}
