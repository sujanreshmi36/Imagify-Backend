import { Injectable } from "@nestjs/common";
import * as argon from "argon2";

@Injectable()
export class hash {
    async value(value: string) {
        try {
            return await argon.hash(value);
        } catch (error) {
            throw error
        }
    }

    async verifyHashing(originalData: string, newData: string): Promise<boolean> {
        return await argon.verify(originalData, newData)
    }
}