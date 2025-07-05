import OrderManager from '../orderManager';
import { OrderType } from '../enums';
import { sleep } from '../utils';
import {vipFirstOrderPriority} from "../orderPriorityStrategy";

describe('麦当劳订单系统端到端测试', () => {
    let orderManager: OrderManager;

    beforeEach(() => {
        orderManager = new OrderManager(vipFirstOrderPriority);
    });
    afterEach(() => {
        // 移除所有 bot，防止事件监听和定时器泄漏
        while (orderManager.getBots().length > 0) {
            orderManager.removeBot();
        }
    });

    test('普通顾客下单后，订单进入待处理区，订单号唯一递增', () => {
        const order1 = orderManager.addOrder(OrderType.Normal);
        const order2 = orderManager.addOrder(OrderType.Normal);
        expect(order1.status).toBe('Pending');
        expect(order2.status).toBe('Pending');
        expect(Number(order2.id)).toBeGreaterThan(Number(order1.id));
    });

    test('VIP 订单优先于普通订单，VIP 之间按顺序', () => {
        const normal = orderManager.addOrder(OrderType.Normal);
        const vip1 = orderManager.addOrder(OrderType.VIP);
        const vip2 = orderManager.addOrder(OrderType.VIP);
        const queue = orderManager.getPendingOrders();
        expect(queue[0].type).toBe(OrderType.VIP);
        expect(queue[1].type).toBe(OrderType.VIP);
        expect(queue[2].type).toBe(OrderType.Normal);
    });

    test('新增机器人后立即处理队首订单', async () => {
        orderManager.addOrder(OrderType.VIP);
        orderManager.addBot();
        await sleep(11000); // 等待机器人处理
        const completed = orderManager.getCompletedOrders();
        expect(completed.length).toBe(1);
        expect(completed[0].status).toBe('Complete');
    },15000);

    test('机器人空闲时有新订单会立即处理', async () => {
        orderManager.addBot();
        orderManager.addOrder(OrderType.Normal);
        await sleep(11000);
        const completed = orderManager.getCompletedOrders();
        expect(completed.length).toBe(1);
    },15000);

    test('减少机器人，处理中断，订单回到待处理区', async () => {
        orderManager.addOrder(OrderType.Normal);
        orderManager.addBot();
        setTimeout(() => orderManager.removeBot(), 2000); // 2秒后移除机器人
        await sleep(3000);
        const Pending = orderManager.getPendingOrders();
        expect(Pending.length).toBe(1);
        expect(orderManager.getBots().length).toBe(0);
    });

    test('订单号唯一且递增', () => {
        const ids = [];
        for (let i = 0; i < 5; i++) {
            ids.push(Number(orderManager.addOrder(OrderType.Normal).id));
        }
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeGreaterThan(ids[i - 1]);
        }
    });

    test('动态调整机器人数量', () => {
        orderManager.addBot();
        orderManager.addBot();
        expect(orderManager.getBots().length).toBe(2);
        orderManager.removeBot();
        expect(orderManager.getBots().length).toBe(1);
    });

    test('订单被处理后进入已完成区', async () => {
        orderManager.addOrder(OrderType.Normal);
        orderManager.addBot();
        await sleep(11000);
        const completed = orderManager.getCompletedOrders();
        expect(completed.length).toBe(1);
        expect(completed[0].status).toBe('Complete');
    },15000);

});
