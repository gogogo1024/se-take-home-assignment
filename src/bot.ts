// src/bot.ts
import {BotStatus, OrderStatus} from './enums';
import {sleep} from './utils';
import {Order} from './order';
import OrderManager from './orderManager';
import {RetryableError, NonRetryableError} from './errors';
import {MAX_RETRY_COUNT} from './constants';

class Bot {
    id: number;
    orderManager: OrderManager;
    currentOrder: Order | null = null;
    active: boolean = true;
    status: BotStatus = BotStatus.Idle;
    private processing: boolean = false;

    constructor(id: number, orderManager: OrderManager) {
        this.id = id;
        this.orderManager = orderManager;
        this.orderManager.on('newOrder', () => void this.tryProcess());
        void this.tryProcess();
    }

    async tryProcess() {
        if (!this.active || this.processing || this.currentOrder) return;

        this.processing = true;
        const order = this.orderManager.getNextOrder();
        if (!order) {
            this.processing = false;
            this.status = BotStatus.Idle;
            return;
        }

        this.currentOrder = order;
        this.status = BotStatus.Working;

        // 改进后的错误处理逻辑
        try {
            await Promise.race([sleep(10000), this.createTimeoutPromise()]);
            if (!this.active) throw new RetryableError('Bot stopped during processing');
            order.status = OrderStatus.Complete;
            this.orderManager.completeOrder(order);
        } catch (error) {
            if (this.currentOrder) {
                if (error instanceof RetryableError && this.currentOrder.retryCount < MAX_RETRY_COUNT) {
                    this.currentOrder.retryCount++;
                    this.currentOrder.status = OrderStatus.Pending;
                    this.orderManager.returnOrder(this.currentOrder);
                    console.warn(`Order ${this.currentOrder.id} retrying (${this.currentOrder.retryCount}/${MAX_RETRY_COUNT})`);
                } else if (error instanceof Error) {
                    this.currentOrder.status = OrderStatus.Failed;
                    console.error(`Order ${this.currentOrder.id} failed:`, error.message);
                } else {
                    this.currentOrder.status = OrderStatus.Failed;
                    console.error(`Order ${this.currentOrder.id} failed:`, error);
                }
            }
        } finally {
            this.resetState();
        }
    }

    stop() {
        this.active = false;
        if (this.processing && this.currentOrder) {
            this.currentOrder.status = OrderStatus.Pending;
            this.orderManager.returnOrder(this.currentOrder);
        }
        this.resetState();
    }

    private resetState() {
        this.currentOrder = null;
        this.status = BotStatus.Idle;
        this.processing = false;
    }

    private createTimeoutPromise(): Promise<void> {
        return new Promise((_, reject) => {
            const timer = setTimeout(() => reject(new Error('Processing timeout')), 12000);
            if (typeof timer.unref === 'function') timer.unref(); // 确保定时器不会阻塞进程
        });
    }
}

export default Bot;
