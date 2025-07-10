# Supabase 类型使用指南

这个项目使用从 Supabase 数据库架构自动生成的 TypeScript 类型，确保完全的类型安全性。

## 生成类型

### 自动生成

使用以下命令生成最新的类型：

```bash
npm run types:generate
```

### 手动生成

如果你需要手动生成类型：

```bash
# 从已链接的项目生成
npx supabase gen types typescript --linked > lib/database.types.ts

# 或者从特定项目生成
npx supabase gen types typescript --project-ref your-project-ref > lib/database.types.ts
```

## 使用类型

### 基本表类型

```typescript
import { Product, ProductItem, UserPurchase } from '@/lib/types';

// 使用表类型
const product: Product = {
  id: 'prod_123',
  name: 'Premium Plan',
  description: 'A premium subscription',
  // ... 其他字段
};
```

### 插入和更新类型

```typescript
import { ProductInsert, ProductUpdate } from '@/lib/types';

// 插入新产品
const newProduct: ProductInsert = {
  id: 'prod_456',
  name: 'New Product',
  // 注意：created_at 和 updated_at 是可选的，会自动生成
};

// 更新产品
const updateData: ProductUpdate = {
  name: 'Updated Product Name',
  description: 'New description',
  // 只需要包含要更新的字段
};
```

### 复合类型

```typescript
import { ProductWithItems } from '@/lib/types';

// 带有关联产品项的产品
const productWithItems: ProductWithItems = {
  id: 'prod_123',
  name: 'Premium Plan',
  description: 'A premium subscription',
  // ... 其他产品字段
  product_items: [
    {
      id: 'price_123',
      name: 'Monthly Plan',
      price: 2999,
      // ... 其他产品项字段
    }
  ]
};
```

### 在 Supabase 查询中使用

```typescript
import { createClient } from '@/utils/supabase/client';
import { Product, ProductItem } from '@/lib/types';

const supabase = createClient();

// 查询产品
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .returns<Product[]>();

// 查询带关联数据的产品
const { data: productsWithItems, error } = await supabase
  .from('products')
  .select(`
    *,
    product_items (*)
  `)
  .returns<ProductWithItems[]>();

// 插入新产品
const { data, error } = await supabase
  .from('products')
  .insert({
    id: 'prod_new',
    name: 'New Product',
    description: 'Product description'
  })
  .returns<Product>();
```

## 类型定义文件

### `lib/database.types.ts`

这是 Supabase 自动生成的类型文件，包含：
- 完整的数据库架构类型
- 所有表的 Row、Insert、Update 类型
- 关系定义
- 枚举类型等

**注意：不要手动编辑这个文件，因为它会在每次运行 `npm run types:generate` 时被重写。**

### `lib/types.ts`

这是我们自定义的类型文件，包含：
- 从数据库类型提取的更友好的类型别名
- 复合类型定义
- 业务逻辑相关的类型

## 最佳实践

1. **定期更新类型**：当数据库架构发生变化时，记得运行 `npm run types:generate` 更新类型。

2. **使用类型别名**：优先使用 `lib/types.ts` 中的类型别名，而不是直接使用 `database.types.ts` 中的复杂类型。

3. **类型安全查询**：始终为 Supabase 查询指定返回类型，确保类型安全。

4. **处理可选字段**：注意 JSON 字段（如 `features`）可能为 `null`，需要进行类型守卫。

```typescript
// 好的做法
if (Array.isArray(item.features)) {
  item.features.map(feature => {
    // 安全地处理 features
  });
}

// 或者使用可选链
const featuresArray = Array.isArray(item.features) ? item.features : [];
```

5. **环境一致性**：确保开发、测试和生产环境的数据库架构保持一致。

## 故障排除

### 类型错误

如果遇到类型错误：
1. 检查数据库架构是否最新
2. 重新生成类型：`npm run types:generate`
3. 重启 TypeScript 服务器

### 生成失败

如果类型生成失败：
1. 确保 Supabase CLI 已登录：`npx supabase login`
2. 确保项目已链接：`npx supabase link --project-ref your-project-ref`
3. 检查网络连接和项目权限

### 缺少类型

如果某些类型缺失：
1. 检查数据库中是否存在对应的表/列
2. 确保 RLS 策略允许访问
3. 检查是否需要更新 Supabase CLI 版本 