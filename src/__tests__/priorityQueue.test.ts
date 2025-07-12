import {Order} from '../order';
import {OrderType} from '../enums';
import {PriorityQueue} from '../priorityQueue';

// 原始排序实现
function originalToSortedArray<T extends Order>(heap: T[], compare: (a: T, b: T) => number): T[] {
    const copy = [...heap];
    const result: T[] = [];
    while (copy.length > 0) {
        let minIndex = 0;
        for (let i = 1; i < copy.length; i++) {
            if (compare(copy[i], copy[minIndex]) < 0) {
                minIndex = i;
            }
        }
        result.push(copy[minIndex]);
        copy.splice(minIndex, 1);
    }
    return result;
}

describe('PriorityQueue.toSortedArray顺序与性能测试', () => {
    const compare = (a: Order, b: Order) => {
        // 仓库里优先按 type（VIP优先），再按 id 升序
        if (a.type === b.type) {
            return Number(a.id) - Number(b.id);
        }
        return a.type === OrderType.VIP ? -1 : 1;
    };

    test('顺序一致性测试', () => {
        const pq = new PriorityQueue<Order>(compare);
        [
            new Order('1', OrderType.Normal),
            new Order('2', OrderType.VIP),
            new Order('3', OrderType.Normal),
            new Order('4', OrderType.VIP),
            new Order('5', OrderType.Normal),
        ].forEach(o => pq.insert(o));

        const oldResult = originalToSortedArray(pq.getItems(), compare);
        const newResult = pq.toSortedArray();
        expect(newResult.map(o => o.id)).toEqual(oldResult.map(o => o.id));
    });

    test('性能对比测试', () => {
        const dataSize = 30000;
        const pq = new PriorityQueue<Order>(compare);
        for (let i = 0; i < dataSize; i++) {
            const type = i % 3 === 0 ? OrderType.VIP : OrderType.Normal;
            pq.insert(new Order(i.toString(), type));
        }
        const heap = pq.getItems();

        console.time('originalToSortedArray');
        const oldSorted = originalToSortedArray(heap, compare);
        console.timeEnd('originalToSortedArray');

        console.time('optimizedToSortedArray');
        const newSorted = [...heap].sort(compare);
        console.timeEnd('optimizedToSortedArray');

        expect(newSorted.map(o => o.id)).toEqual(oldSorted.map(o => o.id));
    });
});
