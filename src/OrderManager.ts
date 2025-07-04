// src/OrderManager.ts
import {EventEmitter} from 'events';
import {OrderType, OrderStatus} from './enums';
import {Order} from './Order';
import Bot from './Bot';
import {PriorityQueue} from './PriorityQueue';
import {OrderPriorityStrategy, defaultOrderPriority} from './OrderPriorityStrategy';

class OrderManager extends EventEmitter {
    private orders: PriorityQueue<Order>;
    private completed: Order[] = [];
    private bots: Bot[] = [];
    private orderSeq = 1;

    constructor(priorityStrategy: OrderPriorityStrategy = defaultOrderPriority) {
        super();
        this.orders = new PriorityQueue<Order>(priorityStrategy);
    }

    addOrder(type: OrderType): Order {
        // 用自增序号保证唯一且递增
        const id = `${this.orderSeq++}`;
        const order = new Order(id, type);
        this.orders.insert(order);
        this.emit('newOrder');
        return order;
    }

    getNextOrder(): Order | undefined {
        return this.orders.extract();
    }

    completeOrder(order: Order) {
        order.status = OrderStatus.Complete;
        this.completed.push(order);
    }

    returnOrder(order: Order) {
        order.status = OrderStatus.Pending;
        this.orders.insert(order);
        this.emit('newOrder');
    }

    addBot() {
        const bot = new Bot(this.bots.length + 1, this);
        this.bots.push(bot);
    }


    removeBot() {
        const bot = this.bots.pop();
        if (bot) bot.stop();
    }

    getPendingOrders(): Order[] {
        // 只读访问队列内容
        return this.orders.toSortedArray();
    }

    getCompletedOrders(): Order[] {
        return this.completed;
    }

    getBots(): Bot[] {
        return this.bots;
    }

}

export default OrderManager;
