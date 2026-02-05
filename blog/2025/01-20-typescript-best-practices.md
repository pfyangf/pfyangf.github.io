---
slug: typescript-best-practices
title: TypeScript 最佳实践指南
authors: [autosec]
tags: [typescript, javascript, best-practices]
date: 2025-01-20T10:00
---

TypeScript 已经成为现代前端开发的标准配置。本文将分享一些 TypeScript 开发中的最佳实践。

<!--truncate-->

## 1. 使用严格模式

在 `tsconfig.json` 中启用严格模式：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## 2. 优先使用接口而非类型别名

对于对象类型定义，优先使用 `interface`：

```typescript
// ✅ 推荐
interface User {
  id: number;
  name: string;
  email: string;
}

// ⚠️ 类型别名也可以，但接口更适合对象
type User = {
  id: number;
  name: string;
  email: string;
};
```

## 3. 使用联合类型和类型守卫

```typescript
type Status = 'pending' | 'success' | 'error';

interface ApiResponse<T> {
  status: Status;
  data?: T;
  error?: string;
}

function handleResponse<T>(response: ApiResponse<T>): void {
  if (response.status === 'success' && response.data) {
    console.log('成功:', response.data);
  } else if (response.status === 'error') {
    console.error('错误:', response.error);
  }
}
```

## 4. 善用泛型

泛型让代码更加灵活和可复用：

```typescript
// 通用的异步请求函数
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as Promise<T>;
}

// 使用
interface Post {
  id: number;
  title: string;
  content: string;
}

const posts = await fetchData<Post[]>('/api/posts');
```

## 5. 使用 readonly 保护数据

```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// config.apiUrl = 'xxx'; // ❌ 编译错误
```

## 6. 枚举的正确使用

```typescript
// 字符串枚举更安全
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

function log(level: LogLevel, message: string): void {
  console.log(`[${level}] ${message}`);
}

log(LogLevel.INFO, '应用启动');
```

## 7. 使用 unknown 代替 any

```typescript
// ❌ 避免使用 any
function processData(data: any) {
  return data.value; // 没有类型检查
}

// ✅ 使用 unknown
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

## 总结

遵循这些最佳实践可以让你的 TypeScript 代码更加健壮、可维护。记住：

- 启用严格模式
- 合理使用类型系统
- 避免使用 `any`
- 善用泛型和类型守卫
- 保持代码的类型安全

Happy coding! 🚀
