import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class UtGuard extends AuthGuard('jwt-reset') {
    constructor() {
        super();
    }
}