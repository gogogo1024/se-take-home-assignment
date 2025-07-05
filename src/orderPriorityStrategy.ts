// src/orderPriorityStrategy.ts
import { Order } from './order';
import { OrderType } from './enums';

export type OrderPriorityStrategy = (a: Order, b: Order) => number;

export const defaultOrderPriority: OrderPriorityStrategy = (a, b) => {
    if (a.type === b.type) {
        return Number(a.id) - Number(b.id);
    }
    return 0;
};

export const vipFirstOrderPriority = (a: Order, b: Order) => {
    if (a.type === OrderType.VIP && b.type !== OrderType.VIP) return -1;
    if (a.type !== OrderType.VIP && b.type === OrderType.VIP) return 1;
    // 类型相同，按 id 升序
    return Number(a.id) - Number(b.id);
};
