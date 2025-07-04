import {OrderPriorityStrategy} from "./OrderPriorityStrategy";
import {Order} from "./Order";
export class PriorityQueue<T extends Order> {
    private heap: T[] = [];
    private compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {
        this.compare = compare;
    }

    insert(item: T) {
        this.heap.push(item);
        this.heapifyUp();
    }

    extract(): T | undefined {
        if (this.heap.length === 0) return undefined;
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0 && last !== undefined) {
            this.heap[0] = last;
            this.heapifyDown();
        }
        return top;
    }

    updatePriority(item: T) {
        const index = this.heap.findIndex((element) => element === item);
        if (index === -1) return;
        this.heapifyUp(index);
        this.heapifyDown(index);
    }

    size(): number {
        return this.heap.length;
    }

    private heapifyUp(index?: number) {
        index = index ?? this.heap.length - 1;
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parent]) < 0) {
                [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
                index = parent;
            } else {
                break;
            }
        }
    }

    private heapifyDown(index?: number) {
        index = index ?? 0;
        const length = this.heap.length;
        while (true) {
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            let swap: number = index;

            if (left < length && this.compare(this.heap[left], this.heap[swap]) < 0) {
                swap = left;
            }
            if (right < length && this.compare(this.heap[right], this.heap[swap]) < 0) {
                swap = right;
            }
            if (swap === index) break;
            [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
            index = swap;
        }
    }

    getItems(): T[] {
        return [...this.heap];
    }
    toSortedArray(): T[] {
        const copy = [...this.heap];
        const result: T[] = [];
        while (copy.length > 0) {
            // 构建临时堆
            let minIndex = 0;
            for (let i = 1; i < copy.length; i++) {
                if (this.compare(copy[i], copy[minIndex]) < 0) {
                    minIndex = i;
                }
            }
            result.push(copy[minIndex]);
            copy.splice(minIndex, 1);
        }
        return result;
    }
}
