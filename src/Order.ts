import {OrderStatus, OrderType} from "./enums";

export class Order {
    id: string;
    type: OrderType;
    status: OrderStatus;
    retryCount: number = 0;

    constructor(id: string, type: OrderType) {
        this.id = id;
        this.type = type;
        this.status = OrderStatus.Pending;
    }
}
