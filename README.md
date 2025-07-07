## FeedMe Software Engineer Take Home Assignment
Below is a take home assignment before the interview of the position. You are required to
1. Understand the situation and use case. You may contact the interviewer for further clarification.
2. Fork this repo and implement the requirement with your most familiar tools.
3. Complete the requirement and perform your own testing.
4. Provide documentation for any part that you think is needed.
5. Commit into your own github and share your repo with the interviewer.
6. Bring the source code and functioning prototype to the interview session.

### Situation
McDonald is transforming their business during COVID-19. They wish to build the automated cooking bots to reduce workforce and increase their efficiency. As one of the software engineer in the project. You task is to create an order controller which handle the order control flow. 

### User Story
As below is part of the user story:
1. As McDonald's normal customer, after I submitted my order, I wish to see my order flow into "PENDING" area. After the cooking bot process my order, I want to see it flow into to "COMPLETE" area.
2. As McDonald's VIP member, after I submitted my order, I want my order being process first before all order by normal customer.  However, if there's existing order from VIP member, my order should queue behind his/her order.
3. As McDonald's manager, I want to increase or decrease number of cooking bot available in my restaurant. When I increase a bot, it should immediately process any pending order. When I decrease a bot, the processing order should remain un-process.
4. As McDonald bot, it can only pick up and process 1 order at a time, each order required 10 seconds to complete process.

### Requirements
1. When "New Normal Order" clicked, a new order should show up "PENDING" Area.
2. When "New VIP Order" clicked, a new order should show up in "PENDING" Area. It should place in-front of all existing "Normal" order but behind of all existing "VIP" order.
3. The order number should be unique and increasing.
4. When "+ Bot" clicked, a bot should be created and start processing the order inside "PENDING" area. after 10 seconds picking up the order, the order should move to "COMPLETE" area. Then the bot should start processing another order if there is any left in "PENDING" area.
5. If there is no more order in the "PENDING" area, the bot should become IDLE until a new order come in.
6. When "- Bot" clicked, the newest bot should be destroyed. If the bot is processing an order, it should also stop the process. The order now back to "PENDING" and ready to process by other bot.
7. No data persistence is needed for this prototype, you may perform all the process inside memory.

### Functioning Prototype
You may demonstrate your final functioning prototype with **one and only one** of the following method:
- CLI application
- UI application
- E2E test case

### Tips on completing this task
- Testing, testing and testing. Make sure the prototype is functioning and meeting all the requirements.
- Do not over engineering. Try to scope your working hour within 3 hours (1 hour per day). You may document all the optimization or technology concern that you think good to bring in the solution.
- Complete the implementation as clean as possible, clean code is a strong plus point, do not bring in all the fancy tech stuff.

### ⚙️ 快速开始

#### 安装依赖

```bash
  npm install
```

#### 运行测试（推荐验证方式）

```bash
  npm run test
```

> 所有核心功能均通过 Jest 自动化测试模拟真实流程。

---

### 🗂️ 项目结构说明

```
src/
├── bot.ts                     # Bot 实例逻辑，每次处理一个订单
├── order.ts                   # Order 数据结构定义
├── orderManager.ts            # 核心控制器，调度订单与机器人
├── enums.ts                   # 枚举常量：订单状态、客户类型等
├── errors.ts                  # 自定义异常类型
├── utils.ts                   # 工具函数，如生成唯一订单号
├── priorityQueue.ts           # 优先队列实现，支持 VIP 插队
├── orderPriorityStrategy.ts   # 策略模式封装订单优先级逻辑
└── __tests__/
    ├── orderManager.test.ts       # 主流程 E2E 测试
    └── botErrorHandling.test.ts   # 边界与错误中断测试
```

---

### 🔍 已实现的核心功能

| 功能 | 说明 |
|------|------|
| 🔢 唯一订单号 | 所有订单编号递增且唯一 |
| ⚖️ 优先级队列 | VIP 优先策略，基于策略模式可扩展 |
| 🤖 动态机器人 | 支持添加和移除机器人，并处理队列 |
| ⏱️ 定时处理 | 每个订单耗时固定为 10 秒 |
| 💤 空闲等待 | 若无订单，机器人处于 IDLE 状态 |
| 🧨 处理中断 | 删除机器人时，可安全回退订单 |
| 🧪 完整测试覆盖 | Jest 测试包含正常与异常流程 |

---

### 🧪 测试说明

测试采用 Jest 编写，模拟实际业务流程与边界情况：

#### 测试文件
- `orderManager.test.ts`:
    - 订单流转顺序正确性（普通、VIP）
    - 增加机器人后是否立即处理订单
    - 减少机器人后是否安全停止
- `botErrorHandling.test.ts`:
    - 正在处理中的 bot 被销毁后订单是否回退
    - 机器人处理中断逻辑验证

运行：
```bash
  npm run test
```

---

### 🧠 技术设计亮点

| 模块 | 描述 |
|------|------|
| TypeScript | 提供强类型保障，便于维护 |
| 策略模式 | 封装订单优先级策略，支持扩展 |
| 事件解耦 | 通过事件机制解耦机器人与控制器 |
| 队列机制 | 自研优先队列，精准控制处理顺序 |
| 错误处理 | 错误中断与恢复机制健全 |
| 测试驱动 | 所有功能均由自动化测试验证支持 |


