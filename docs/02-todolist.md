# 🧋 奶茶小程序开发任务清单 (TODO List)

**项目**: Naicha-taro (奶茶点单小程序)
**技术栈**: Taro 3 + React + TypeScript
**冲刺周期**: 2025.11.20 - 2025.11.30 (10天)
**当前日期**: 2025.11.22
**当前阶段**: M1基建完成 → M2业务攻坚期

---

## 📊 里程碑概览

| 里程碑 | 日期 | 状态 | 验收标准 |
|-------|------|------|---------|
| M0: 项目启动 | 11.20 | ✅ 完成 | Git仓初始化、需求定稿 |
| M1: 基建完成 | 11.21-11.23 | ✅ 完成 | 网络层/状态管理/UI组件/埋点框架全部就绪 |
| M2: 业务攻坚 | 11.26 | ⏳ 待开始 | 菜单/购物车/结算页完成、preview调通 |
| M3: 支付联调 | 11.29 | ⏳ 待开始 | 真机可唤起支付、状态更新正确、P0=0 |
| M4: Dev Freeze | 11.30 | ⏳ 待开始 | 提测包、Checklist全绿、回滚演练通过 |

---

## 🔥 P0 任务 (阻断性，必须完成)

### 1. 基建与公共层 【11.20-11.22】 ✅ 已完成

#### 1.1 网络层封装 ✅
- [x] **创建 `src/utils/request.ts`**
  - [x] 封装 `Taro.request` 拦截器
  - [x] Token 自动注入 (从 Storage 读取)
  - [x] `X-Idempotency-Key` 生成逻辑 (UUID v4)
  - [x] 统一错误码处理与 Toast 提示
  - [x] 超时配置 (默认 10s)
  - [x] 环境切换逻辑 (dev/staging/prod)
  
- [x] **创建 `src/config/env.ts`**
  - [x] dev 环境配置 (`http://localhost:8000`)
  - [x] prod 环境配置 (`https://guajunyan.top`)
  - [x] staging 环境配置 (待定)
  - [x] 导出当前环境判断函数

#### 1.2 状态管理 ✅
- [x] **选择状态管理方案** (推荐 Zustand，轻量级)
  - [x] 安装依赖: `pnpm add zustand`
  
- [x] **创建 `src/store/userStore.ts`**
  - [x] 用户信息状态 (token, phone, nickname)
  - [x] 登录/登出方法
  - [x] 持久化到 Storage
  
- [x] **创建 `src/store/shopStore.ts`**
  - [x] 商家信息 (营业状态、配送范围、联系方式)
  - [x] 菜单数据缓存
  - [x] 优惠券列表
  
- [x] **创建 `src/store/cartStore.ts`**
  - [x] 购物车商品列表
  - [x] 添加/删除/更新商品
  - [x] 清空购物车
  - [x] 持久化到 Storage
  - [x] 计算商品总数量

#### 1.3 UI 组件库集成 ✅
- [x] **安装 Taroify**
  - [x] `pnpm add @taroify/core @taroify/icons`
  - [x] 配置按需引入 (Babel 插件)
  - [x] 主题变量配置 (CSS Vars)
  
- [x] **创建通用组件**
  - [x] `src/components/Skeleton/index.tsx` (骨架屏)
  - [x] `src/components/Empty/index.tsx` (空态)
  - [x] `src/components/ErrorBoundary/index.tsx` (错误边界)

#### 1.4 埋点框架 ✅
- [x] **创建 `src/utils/analytics.ts`**
  - [x] 事件上报函数 (track/page/user)
  - [x] 数据脱敏 (手机号仅后4位)
  - [x] 批量上报与本地缓存
  - [x] 后端接口对接 (POST /api/v1/analytics/events) - **2025.11.23 已完成**
  
- [x] **集成 Sentry (可选)**
  - [x] `pnpm add @sentry/react`
  - [x] 初始化配置 (DSN、环境、采样率)

---

### 2. 登录与授权 【11.21-11.22】

#### 2.1 静默登录
- [ ] **创建 `src/services/auth.ts`**
  - [ ] `getWxCode()` - 获取微信 code
  - [ ] `silentLogin(code)` - 调用后端换取 token
  - [ ] `getPhoneNumber()` - 手机号授权流程
  
- [ ] **创建登录页 `src/pages/login/index.tsx`**
  - [ ] 品牌 Logo 展示
  - [ ] "手机号快捷登录" 按钮
  - [ ] 隐私协议勾选框
  - [ ] 调用 `button open-type="getPhoneNumber"`
  
- [ ] **App 启动流程优化 `src/app.ts`**
  - [ ] 检查 token 有效性
  - [ ] 无效则跳转登录页
  - [ ] 有效则继续进入首页

---

### 3. 菜单页开发 【11.22-11.24】

#### 3.1 页面结构
- [ ] **创建 `src/pages/menu/index.tsx`**
  - [ ] 顶部导航栏 (搜索框)
  - [ ] 左右联动布局 (Sidebar + ScrollView)
  - [ ] 底部吸附栏 (购物车入口 + 去结算按钮)
  
- [ ] **创建 `src/pages/menu/components/CategorySidebar.tsx`**
  - [ ] 分类列表渲染
  - [ ] 选中高亮样式
  - [ ] 点击滚动到对应商品区域
  
- [ ] **创建 `src/pages/menu/components/ProductCard.tsx`**
  - [ ] 商品图片 (1:1 缩略图，WebP 格式)
  - [ ] 标题、描述、价格
  - [ ] 售罄角标与置灰
  - [ ] 加购 "+" 按钮
  - [ ] 点击打开规格弹层

#### 3.2 数据加载
- [ ] **创建 `src/services/menu.ts`**
  - [ ] `getMenuData()` - 获取菜单与分类
  - [ ] 数据缓存策略 (SWR 或 Storage)
  
- [ ] **骨架屏加载**
  - [ ] 商品列表骨架屏 (图片方块 + 两行文字)
  - [ ] 至少展示 300ms

#### 3.3 搜索功能
- [ ] **创建 `src/pages/menu/components/SearchBar.tsx`**
  - [ ] 实时搜索 (300ms 防抖)
  - [ ] 清空按钮
  - [ ] 搜索结果高亮
  - [ ] 无结果空态展示

---

### 4. 规格弹层开发 【11.23-11.24】

#### 4.1 弹层组件
- [ ] **创建 `src/components/SpecPopup/index.tsx`**
  - [ ] 底部 Popup (高度 70-80% 屏幕)
  - [ ] 商品信息头部 (图片、标题、实时价格)
  - [ ] 规格选项渲染
  - [ ] 数量 Stepper
  - [ ] 底部操作按钮 (加入购物车 / 立即购买)
  
- [ ] **创建 `src/components/SpecPopup/SpecOption.tsx`**
  - [ ] Radio 单选样式 (甜度、冰度)
  - [ ] Checkbox 多选样式 (加料，最多2种各1份)
  - [ ] 售罄选项置灰
  - [ ] 价格增量显示 `+¥x`

#### 4.2 业务逻辑
- [ ] **默认规格选中**
  - [ ] 读取 `default_spec_option_ids`
  - [ ] 默认选中中杯/常规糖/常规冰
  
- [ ] **热饮处理**
  - [ ] 判断商品类型，隐藏冰度选项
  
- [ ] **加料限制**
  - [ ] 最多选择 2 种加料
  - [ ] 每种加料数量固定为 1
  - [ ] 超出限制时 Toast 提示
  
- [ ] **实时价格计算**
  - [ ] 基础价 + 规格价差 + 加料价
  - [ ] 数量 × 单价
  - [ ] 实时更新头部显示

#### 4.3 加入购物车
- [ ] **数据结构设计**
  ```ts
  interface CartItem {
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    specOptionIds: number[];
    specText: string; // 规格描述: "中杯 常规糖 常规冰 +珍珠"
    unitPrice: number;
    totalPrice: number;
  }
  ```
  
- [ ] **添加逻辑**
  - [ ] 检查是否已存在相同规格商品
  - [ ] 存在则累加数量，不存在则新增
  - [ ] 更新 CartStore
  - [ ] Toast 提示 "已加入购物车" (1.5s)
  - [ ] 关闭弹层

---

### 5. 购物车功能 【11.23-11.25】

#### 5.1 购物车页面
- [ ] **创建 `src/pages/cart/index.tsx`**
  - [ ] 商品列表展示
  - [ ] 增减数量控件
  - [ ] 删除商品 (左滑或长按)
  - [ ] 失效商品置灰 (库存不足/下架)
  - [ ] 清空购物车按钮
  - [ ] 底部总价与结算按钮
  
- [ ] **空态处理**
  - [ ] 空购物车插画
  - [ ] 文案: "肚子在叫?来一杯吧~"
  - [ ] "去逛逛" 按钮返回菜单页

#### 5.2 底部吸附栏 (菜单页)
- [ ] **创建 `src/pages/menu/components/CartBar.tsx`**
  - [ ] 购物车图标 + 数量徽标
  - [ ] 总价显示
  - [ ] "去结算" 按钮
  - [ ] 点击购物车图标展开购物车抽屉 (可选)

---

### 6. 结算页开发 【11.24-11.26】 ⚠️ 重头戏

#### 6.1 页面结构
- [ ] **创建 `src/pages/checkout/index.tsx`**
  - [ ] 顶部 Tabs (自提 / 外送)
  - [ ] 自提卡片 (预计时间)
  - [ ] 外送卡片 (地址选择 / 表单)
  - [ ] 商品明细折叠面板
  - [ ] 优惠券选择入口
  - [ ] 集点进度展示
  - [ ] 费用明细 (小计/优惠/运费/实付)
  - [ ] 底部提交按钮

#### 6.2 地址选择 (外送)
- [ ] **创建 `src/pages/checkout/components/AddressSelector.tsx`**
  - [ ] 地图选点按钮 (调起腾讯地图)
  - [ ] 手动输入表单 (收货人/手机号/详细地址)
  - [ ] 表单校验 (必填项、手机号格式)
  
- [ ] **地图选点**
  - [ ] 集成腾讯地图 SDK (`@tarojs/plugin-html`)
  - [ ] 地图选点返回经纬度
  - [ ] 逆地理编码获取地址文本
  
- [ ] **配送范围校验**
  - [ ] 创建 `src/services/delivery.ts`
  - [ ] `checkDeliveryRange(lat, lng)` - 调用 `POST /shop/delivery/check`
  - [ ] 超过 10km 弹窗提示并阻断
  - [ ] 引导切换为自提

#### 6.3 算价核心逻辑
- [ ] **创建 `src/services/order.ts`**
  - [ ] `previewOrder(params)` - 调用 `POST /orders/preview`
  - [ ] 防抖处理 (≥200ms)
  - [ ] 错误码处理:
    - [ ] `PRICE_CHANGED` - 二次确认对话框
    - [ ] `COUPON_INVALID` - 清除券并重算
    - [ ] `INVENTORY_SHORTAGE` - 提示并移除失效商品
  
- [ ] **触发时机**
  - [ ] 进入结算页
  - [ ] 切换自提/外送
  - [ ] 选择/取消优惠券
  - [ ] 修改商品数量 (购物车)

#### 6.4 优惠券面板
- [ ] **创建 `src/pages/checkout/components/CouponPanel.tsx`**
  - [ ] 可用券列表 (按即将过期排序)
  - [ ] 不可用券列表 (显示原因: 未满足门槛/已过期)
  - [ ] 选中状态高亮
  - [ ] "不使用优惠券" 选项
  
- [ ] **创建 `src/services/coupon.ts`**
  - [ ] `getMyCoupons()` - 获取用户优惠券列表

#### 6.5 集点展示
- [ ] **创建 `src/pages/checkout/components/StampCard.tsx`**
  - [ ] 当前进度显示 "X/10"
  - [ ] 进度条 (10连杯图标)
  - [ ] 提示文案: "下单后可累计 1 杯"
  - [ ] **不提供兑换按钮** (MVP: 后台人工核销)

#### 6.6 提交订单
- [ ] **订单创建**
  - [ ] `createOrder(params)` - 调用 `POST /api/v1/orders`
  - [ ] 生成幂等键 `X-Idempotency-Key`
  - [ ] 成功返回 `order_id`
  
- [ ] **跳转支付**
  - [ ] 跳转到支付页 `/pages/payment/index`
  - [ ] 传递 `order_id`

---

### 7. 支付流程 【11.27-11.29】

#### 7.1 支付页面
- [ ] **创建 `src/pages/payment/index.tsx`**
  - [ ] 订单信息展示
  - [ ] 支付倒计时 (15分钟)
  - [ ] "立即支付" 按钮
  - [ ] "取消订单" 按钮
  
- [ ] **创建 `src/services/payment.ts`**
  - [ ] `getPayParams(orderId)` - 调用 `POST /orders/{id}/pay/native`
  - [ ] `checkPayStatus(orderId)` - 轮询支付状态
  
- [ ] **微信支付调起**
  - [ ] `Taro.requestPayment(params)`
  - [ ] 成功回调 → 跳转订单详情
  - [ ] 失败回调 → Toast 提示并保留支付页
  - [ ] 取消回调 → 返回订单列表

#### 7.2 支付结果处理
- [ ] **支付成功**
  - [ ] 跳转订单详情页
  - [ ] 展示取餐码 (自提) 或 配送信息 (外送)
  - [ ] 埋点上报 `pay_success`
  
- [ ] **支付失败**
  - [ ] Toast 提示失败原因
  - [ ] 保留在支付页可重试
  - [ ] 埋点上报 `pay_fail`
  
- [ ] **超时取消**
  - [ ] 15分钟后订单自动取消
  - [ ] 前端倒计时归零后更新状态
  - [ ] 跳转订单列表

---

### 8. 订单管理 【11.25-11.27】

#### 8.1 订单列表
- [ ] **创建 `src/pages/orders/index.tsx`**
  - [ ] Tabs (全部/待支付/制作中/已完成)
  - [ ] 订单卡片 (状态/商品/金额/操作按钮)
  - [ ] 下拉刷新
  - [ ] 上拉加载更多
  - [ ] 空态展示
  
- [ ] **创建 `src/services/order.ts`**
  - [ ] `getOrderList(status, page)` - 获取订单列表
  - [ ] `cancelOrder(orderId)` - 取消订单

#### 8.2 订单详情
- [ ] **创建 `src/pages/order-detail/index.tsx`**
  - [ ] 状态步进条 (未支付/制作中/待取/配送中/已完成)
  - [ ] 取餐码大字号展示 (自提)
  - [ ] 配送信息与预计送达 (外送)
  - [ ] 商品明细
  - [ ] 金额明细
  - [ ] 联系商家按钮 (拨打电话)
  
- [ ] **创建 `src/services/order.ts`**
  - [ ] `getOrderDetail(orderId)` - 获取订单详情

---

### 9. 个人中心 【11.26-11.27】

#### 9.1 我的页面
- [ ] **创建 `src/pages/profile/index.tsx`**
  - [ ] 用户信息卡片 (头像/昵称/手机号)
  - [ ] 集点卡 (当前进度 X/10)
  - [ ] 我的订单入口
  - [ ] 优惠券入口
  - [ ] 关于与隐私
  - [ ] 客服电话
  
- [ ] **创建 `src/services/user.ts`**
  - [ ] `getUserInfo()` - 获取用户信息
  - [ ] `getStampProgress()` - 获取集点进度

#### 9.2 优惠券列表
- [ ] **创建 `src/pages/coupons/index.tsx`**
  - [ ] Tabs (可用/已使用/已过期)
  - [ ] 优惠券卡片
  - [ ] 使用规则说明

---

## ⚡ P1 任务 (重要但不阻断)

### 10. 性能优化 【11.27-11.28】

- [ ] **图片优化**
  - [ ] 使用 WebP 格式
  - [ ] 缩略图 w≈200，详情图 w≈600
  - [ ] 懒加载 (Intersection Observer)
  - [ ] 失败占位图
  
- [ ] **代码分包**
  - [ ] 配置 `app.config.ts` subpackages
  - [ ] 主包: 菜单/购物车/结算
  - [ ] 分包: 订单/个人中心
  
- [ ] **首屏优化**
  - [ ] 预渲染骨架屏
  - [ ] 关键资源预加载
  - [ ] 移除不必要的同步操作
  
- [ ] **请求优化**
  - [ ] 接口数据缓存 (SWR)
  - [ ] 防抖与节流
  - [ ] 并行请求合并

### 11. 错误处理与监控 【11.28】

- [ ] **全局错误捕获**
  - [ ] React ErrorBoundary
  - [ ] `Taro.onError` 监听
  - [ ] 友好错误页面
  
- [ ] **Sentry 集成**
  - [ ] 安装与初始化
  - [ ] 错误上报配置
  - [ ] 面包屑追踪
  - [ ] 数据脱敏
  
- [ ] **埋点完善**
  - [ ] 页面访问 PV/UV
  - [ ] 关键操作漏斗 (浏览→加购→下单→支付)
  - [ ] 接口性能监控 (P95/P99)
  - [ ] 异常事件上报

### 12. 用户体验优化 【11.28】

- [ ] **加载状态**
  - [ ] 按钮 loading 态
  - [ ] 页面 loading 遮罩
  - [ ] 骨架屏优化
  
- [ ] **反馈提示**
  - [ ] Toast 统一样式与时长
  - [ ] Dialog 确认框样式
  - [ ] 操作成功/失败提示
  
- [ ] **交互细节**
  - [ ] 按钮防抖 (≥1.5s)
  - [ ] 表单校验提示
  - [ ] 滚动锚点定位
  - [ ] 返回顶部按钮

---

## 🔧 P2 任务 (Nice to Have)

### 13. 高级功能 【时间允许时】

- [ ] **搜索历史**
  - [ ] 本地存储搜索记录
  - [ ] 热门搜索推荐
  - [ ] 清空历史
  
- [ ] **商品收藏**
  - [ ] 收藏/取消收藏
  - [ ] 我的收藏列表
  
- [ ] **订单评价**
  - [ ] 评分与评论
  - [ ] 上传图片
  
- [ ] **分享功能**
  - [ ] 商品分享
  - [ ] 优惠券分享

### 14. 多端适配 【未来迭代】

- [ ] H5 适配
- [ ] 支付宝小程序适配
- [ ] 字节跳动小程序适配

---

## 📋 配置与资质 【负责人: 小菊】

### 15. 环境配置 【11.22】

- [ ] **创建环境变量文件**
  - [ ] `.env.development`
    ```
    TARO_APP_API_BASE_URL=http://127.0.0.1:xxxx
    TARO_APP_WX_APPID=wxXXXXXXXX
    TARO_APP_MAP_KEY=XXXXX-XXXXX
    ```
  - [ ] `.env.production`
    ```
    TARO_APP_API_BASE_URL=https://guajunyan.top
    TARO_APP_WX_APPID=wxXXXXXXXX
    TARO_APP_MAP_KEY=XXXXX-XXXXX
    ```
  
- [ ] **更新 `config/dev.ts` 与 `config/prod.ts`**
  - [ ] 使用环境变量
  - [ ] 配置合法域名白名单

### 16. 微信小程序配置 【11.20-11.25】

- [ ] **申请小程序 APPID** (负责人: 小菊)
- [ ] **配置服务器域名白名单**
  - [ ] `https://guajunyan.top`
  - [ ] WebSocket (如需要)
  
- [ ] **申请微信支付商户号** (DDL: 11.25)
  - [ ] 提交资质审核
  - [ ] 配置支付密钥
  - [ ] 下载支付证书
  
- [ ] **申请腾讯地图 Key**
  - [ ] 申请开发者账号
  - [ ] 创建应用获取 Key
  - [ ] 配置额度与白名单

### 17. 法律与合规 【11.22-11.23】

- [ ] **编写隐私政策 `docs/privacy.md`**
  - [ ] 收集的信息类型
  - [ ] 使用目的
  - [ ] 第三方共享
  - [ ] 用户权利
  - [ ] 联系方式
  
- [ ] **客服电话确认**
  - [ ] 提供给后端配置接口
  - [ ] 前端读取并展示
  
- [ ] **业务类目与权限说明**
  - [ ] 准备提审资料
  - [ ] 权限用途说明文档

---

## 🧪 测试与质量保证 【11.29-11.30】

### 18. 真机测试 【11.29】

- [ ] **设备矩阵测试**
  - [ ] iOS 13 (iPhone 8)
  - [ ] iOS 15 (iPhone 12)
  - [ ] iOS 17 (iPhone 14)
  - [ ] Android 10 (华为)
  - [ ] Android 12 (小米)
  - [ ] Android 14 (OPPO)
  
- [ ] **弱网测试**
  - [ ] 3G 网络
  - [ ] 200ms+ 抖动
  - [ ] 离线状态提示
  
- [ ] **兼容性测试**
  - [ ] 微信基础库 ≥ 2.32
  - [ ] 不同屏幕尺寸
  - [ ] 横竖屏切换

### 19. 功能测试 【11.29】

- [ ] **E2E 核心用例**
  - [ ] 自提 Happy Path
  - [ ] 外送 Happy Path
  - [ ] 超距阻断
  - [ ] 售罄处理
  - [ ] 价格变更二次确认
  - [ ] 优惠券失效
  - [ ] 超时未付自动取消
  
- [ ] **异常流程测试**
  - [ ] 网络异常
  - [ ] 接口 500
  - [ ] 支付失败
  - [ ] 库存不足
  - [ ] 优惠券不可用

### 20. 性能测试 【11.29】

- [ ] **关键指标验收**
  - [ ] 首屏 LCP < 1.5s (4G)
  - [ ] 接口 P95 < 800ms
  - [ ] 支付成功率 ≥ 98%
  - [ ] JS 错误率 < 0.3%
  
- [ ] **体验评分**
  - [ ] 微信开发者工具评分 ≥ 80
  - [ ] Lighthouse 性能评分
  
- [ ] **包体大小**
  - [ ] 主包 < 2MB
  - [ ] 总包 < 20MB

### 21. Bug 修复 【11.29-11.30】

- [ ] **P0 Bug (阻断上线)**
  - [ ] 白屏/崩溃
  - [ ] 无法下单
  - [ ] 支付失败
  
- [ ] **P1 Bug (影响体验)**
  - [ ] UI 还原度低
  - [ ] 交互卡顿
  - [ ] 错误提示不友好

---

## 📦 发布与上线 【11.30】

### 22. 发布准备

- [ ] **提审资料准备**
  - [ ] 小程序介绍与描述
  - [ ] 类目资质证明
  - [ ] 客服电话
  - [ ] 隐私政策链接
  - [ ] 体验版账号与密码
  - [ ] 审核视频/截图
  
- [ ] **版本管理**
  - [ ] 版本号: v1.0.0
  - [ ] 更新日志
  - [ ] Git Tag 打标签
  
- [ ] **回滚演练**
  - [ ] 准备上一稳定版包
  - [ ] 回滚 SOP 文档
  - [ ] 目标 10 分钟内恢复

### 23. 上线 Checklist

- [ ] 服务器域名白名单已配置
- [ ] HTTPS 证书有效
- [ ] 支付商户号配置正确
- [ ] 地图 Key 可用
- [ ] 隐私政策可访问
- [ ] 客服电话已配置
- [ ] 体验评分 ≥ 80
- [ ] P0 Bug = 0
- [ ] 真机测试通过
- [ ] 性能指标达标
- [ ] 埋点正常上报
- [ ] Sentry 监控正常
- [ ] 灰度开关可用
- [ ] 回滚演练通过

### 24. 上线后监控

- [ ] **实时监控**
  - [ ] JS 错误率
  - [ ] 接口成功率
  - [ ] 支付成功率
  - [ ] 崩溃率
  
- [ ] **告警配置**
  - [ ] preview P95 > 800ms (连续5分钟)
  - [ ] 支付失败率 > 2%
  - [ ] JS 错误率 > 0.3%
  
- [ ] **灰度策略**
  - [ ] 初始 10% 灰度
  - [ ] 观察 24 小时无异常
  - [ ] 逐步放量至 100%

---

## ⚠️ 风险项与预案

| 风险 | 等级 | 触发信号 | 预案 |
|-----|------|---------|------|
| 微信支付未开通 | 🔥 P0 | 11/25 商户号未审核通过 | 延期上线支付；保留"自提不支付"演示流 + Mock 支付回调 |
| 算价 preview 延期 | P1 | 11/23 不可用/错误率高 | 前端先用假数据联通 UI；接口就绪后切换 |
| 地图 Key 额度限制 | P2 | 选点报错/限额 | 临时切文本地址输入；外卖下单禁用，保留自提 |
| 10 天工期不足 | P2 | 11/27 结算未完 | 砍掉优惠券 & 集点仅展示，仅保留基础点单+支付 |
| 包体超限 (>2MB) | P2 | 打包超限 | 分包、按需引入、图片瘦身 (WebP、w=200/600) |

---

## 📈 进度追踪

| 日期 | 计划任务 | 实际完成 | 阻塞项 | 备注 |
|------|---------|---------|-------|------|
| 11.20 | 项目启动 | ✅ | - | Git 仓初始化完成 |
| 11.21 | 基建搭建 | ✅ | - | 网络层/状态管理/组件库已完成 |
| 11.22-11.23 | 基建完善 | ✅ | - | 环境配置/埋点/类型修复全部完成 |
| 11.23 | 规格弹层/购物车 | ⏳ | - | - |
| 11.24 | 结算页开发 | ⏳ | - | - |
| 11.25 | 结算页/订单列表 | ⏳ | 支付商户号 | - |
| 11.26 | 业务攻坚验收 (M2) | ⏳ | - | preview 调通 |
| 11.27 | 支付联调 | ⏳ | - | - |
| 11.28 | 优化与测试 | ⏳ | - | - |
| 11.29 | 支付联调验收 (M3) | ⏳ | - | P0=0 |
| 11.30 | Dev Freeze (M4) | ⏳ | - | 提测包 |

---

## 📝 开发规范提醒

- **Git 提交**: 遵循 Conventional Commits (`feat:`, `fix:`, `chore:`)
- **代码风格**: ESLint + Prettier 自动格式化
- **命名规范**: 
  - 组件: PascalCase (`ProductCard`)
  - 文件: kebab-case (`product-card.tsx`)
  - 变量/函数: camelCase (`getMenuData`)
- **注释**: 关键逻辑必须注释
- **类型**: 优先使用 TypeScript 类型，避免 `any`
- **性能**: 避免不必要的 re-render，善用 `memo`/`useMemo`

---

## 🎯 每日站会三问

1. **昨天完成了什么?**
2. **今天计划做什么?**
3. **有什么阻塞项?**

---

**最后更新**: 2025.11.23
**负责人**: 开发团队
**审核人**: 小菊 (PM)

---

## 📝 M1 完成总结 (2025.11.23)

### ✅ 已完成的基建工作

#### 1. 网络层 (100%)
- ✅ `src/utils/request.ts` - 完整的请求封装,支持 token 注入、幂等键、错误处理
- ✅ `src/config/env.ts` - 三环境配置 (dev/staging/prod) + 运行时切换
- ✅ 环境变量文件 `.env.development` / `.env.production` 已配置

#### 2. 状态管理 (100%)
- ✅ Zustand 5.0.8 已安装并配置
- ✅ `src/store/userStore.ts` - 用户认证状态 (token/profile + 401 监听)
- ✅ `src/store/shopStore.ts` - 商家数据缓存 (5分钟 TTL + 菜单/优惠券)
- ✅ `src/store/cartStore.ts` - 购物车 (规格去重算法 + 持久化)
- ✅ `src/store/storage.ts` - Taro Storage 适配器

#### 3. UI 组件库 (100%)
- ✅ Taroify 0.9.0 已安装 (core + icons)
- ✅ Babel 按需引入已配置
- ✅ 主题变量已定义 (app.scss)
- ✅ `src/components/Skeleton/index.tsx` - 骨架屏 + shimmer 动画
- ✅ `src/components/Empty/index.tsx` - 空态组件
- ✅ `src/components/ErrorBoundary/index.tsx` - 错误边界 + Sentry 集成

#### 4. 埋点与监控 (100%)
- ✅ `src/utils/analytics.ts` - 事件队列 + 批量上报 + 数据脱敏
- ✅ Sentry 10.26.0 已集成
- ✅ 队列持久化 + 15s 定时刷新
- ⚠️ 后端接口 `/api/v1/analytics/events` 未实现,已暂时禁用上报 (参考 `docs/analytics-endpoint-issue.md`)

#### 5. 类型定义 (100%)
- ✅ `types/api.ts` - OpenAPI 类型定义 (手动提取自 naicha-openapi.json)
- ✅ TypeScript 编译通过 (`pnpm tsc --noEmit`)

#### 6. 代码质量 (100%)
- ✅ ESLint + Prettier 配置完成
- ✅ Commitlint + Husky 已配置
- ✅ 遵循 Conventional Commits 规范

### 🎯 验收标准达成情况

| 验收项 | 状态 | 说明 |
|-------|------|------|
| 网络层可用 | ✅ | request.ts 支持所有必需功能 |
| 状态管理可用 | ✅ | 三个 store 全部实现并持久化 |
| lint 通过 | ✅ | TypeScript/ESLint 无错误 |
| 基础埋点可用 | ⚠️ | 框架已就绪,等待后端接口 |
| 环境切换正常 | ✅ | 支持 dev/staging/prod 运行时切换 |

### 📚 相关文档

- `docs/task-completion-report.md` - 三个立即任务完成报告
- `docs/analytics-endpoint-issue.md` - 埋点接口问题说明
- `docs/env-analytics-fix.md` - 环境配置与埋点机制修复

### 🚀 下一步 (M2 业务攻坚)

现在可以开始业务开发:
1. 登录与授权 (11.24)
2. 菜单页开发 (11.24-11.25)
3. 规格弹层 (11.25)
4. 购物车功能 (11.25-11.26)
5. 结算页开发 (11.26-11.27)
