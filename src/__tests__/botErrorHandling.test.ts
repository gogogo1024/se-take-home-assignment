// src/__tests__/botErrorHandling.test.ts
import OrderManager from '../OrderManager';
import {OrderType, OrderStatus} from '../enums';
import {RetryableError} from '../errors';
import {MAX_RETRY_COUNT} from '../constants';
import {vipFirstOrderPriority} from "../OrderPriorityStrategy";
import Bot from '../Bot';

describe('Bot 异常处理分支测试', () => {
    let orderManager: OrderManager;

    beforeEach(() => {
        orderManager = new OrderManager(vipFirstOrderPriority);
    });

    test('处理超时后订单重试', async () => {
        // 先 mock prototype，保证自动处理时生效
        jest.spyOn(Bot.prototype as any, 'createTimeoutPromise').mockImplementationOnce(() => {
            return Promise.reject(new RetryableError('timeout'));
        });
        const order = orderManager.addOrder(OrderType.Normal);
        orderManager.addBot();
        const bot = orderManager.getBots()[0];

        // 等待微任务队列，确保 bot 自动处理流程结束
        await new Promise(process.nextTick);
        expect(order.status).toBe(OrderStatus.Pending);
        expect(order.retryCount).toBe(1);
        jest.restoreAllMocks();
    });

    test('达到最大重试次数后订单失败', async () => {
        // 先 mock prototype，保证自动处理时生效
        jest.spyOn(Bot.prototype as any, 'createTimeoutPromise').mockImplementationOnce(() => {
            return Promise.reject(new RetryableError('test'));
        });
        const order = orderManager.addOrder(OrderType.Normal);
        order.retryCount = MAX_RETRY_COUNT;
        orderManager.addBot();
        await new Promise(process.nextTick); // 等待自动处理流程结束
        const bot = orderManager.getBots()[0];
        expect(order.status).toBe(OrderStatus.Failed);
    });

    test('未知错误导致订单失败', async () => {
        jest.spyOn(Bot.prototype as any, 'createTimeoutPromise').mockImplementationOnce(() => {
            return Promise.reject(new Error('unknown'));
        });
        const order = orderManager.addOrder(OrderType.Normal);
        orderManager.addBot();
        await new Promise(process.nextTick); // 等待自动处理流程结束
        expect(order.status).toBe(OrderStatus.Failed);
        jest.restoreAllMocks();
    });
});
