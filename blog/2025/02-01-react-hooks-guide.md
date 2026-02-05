---
slug: react-hooks-guide
title: React Hooks 完全指南
authors: [autosec]
tags: [react, frontend, javascript, tutorial]
date: 2025-02-01T09:00
description: 深入理解 React Hooks 的使用方法和最佳实践
---

React Hooks 是 React 16.8 引入的新特性，让你在不编写 class 的情况下使用 state 和其他 React 特性。

<!--truncate-->

## 为什么需要 Hooks？

在 Hooks 出现之前，React 组件主要分为两类：

- **类组件**：可以使用 state 和生命周期方法
- **函数组件**：只能接收 props，被称为"无状态组件"

Hooks 的出现解决了以下问题：

1. **组件之间复用状态逻辑困难**
2. **复杂组件难以理解**
3. **class 组件的 this 指向问题**

## 常用 Hooks

### 1. useState - 状态管理

```typescript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
```

**最佳实践：**

```typescript
// ✅ 使用函数式更新
setCount(prevCount => prevCount + 1);

// ❌ 避免直接使用当前值
setCount(count + 1);
```

### 2. useEffect - 副作用处理

```typescript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 数据获取
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('获取用户失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // 清理函数
    return () => {
      // 取消请求或清理订阅
    };
  }, [userId]); // 依赖数组

  if (loading) return <div>加载中...</div>;
  if (!user) return <div>用户不存在</div>;

  return <div>用户名: {user.name}</div>;
}
```

### 3. useContext - 上下文管理

```typescript
import React, { createContext, useContext, useState } from 'react';

// 创建上下文
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider 组件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自定义 Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 使用
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      style={{ 
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff'
      }}
    >
      切换主题
    </button>
  );
}
```

### 4. useReducer - 复杂状态管理

```typescript
import React, { useReducer } from 'react';

// 定义状态类型
interface State {
  count: number;
  step: number;
}

// 定义 action 类型
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number }
  | { type: 'reset' };

// Reducer 函数
function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return { count: 0, step: 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 });

  return (
    <div>
      <p>计数: {state.count}</p>
      <p>步长: {state.step}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ 
          type: 'setStep', 
          payload: Number(e.target.value) 
        })}
      />
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
    </div>
  );
}
```

### 5. useMemo 和 useCallback - 性能优化

```typescript
import React, { useState, useMemo, useCallback } from 'react';

function ExpensiveComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<number[]>([]);

  // useMemo: 缓存计算结果
  const expensiveValue = useMemo(() => {
    console.log('计算昂贵的值...');
    return items.reduce((sum, item) => sum + item, 0);
  }, [items]); // 只在 items 变化时重新计算

  // useCallback: 缓存函数
  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, Math.random()]);
  }, []); // 函数永远不会改变

  return (
    <div>
      <p>总和: {expensiveValue}</p>
      <p>点击次数: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>增加计数</button>
      <button onClick={handleAddItem}>添加项目</button>
    </div>
  );
}
```

### 6. useRef - 引用和 DOM 访问

```typescript
import React, { useRef, useEffect } from 'react';

function TextInputWithFocus() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    // 组件挂载时自动聚焦
    inputRef.current?.focus();
    
    // 记录渲染次数（不会触发重新渲染）
    renderCount.current += 1;
  });

  return (
    <div>
      <input ref={inputRef} type="text" />
      <p>渲染次数: {renderCount.current}</p>
    </div>
  );
}
```

## 自定义 Hooks

自定义 Hooks 让你可以提取组件逻辑到可复用的函数中：

```typescript
import { useState, useEffect } from 'react';

// 自定义 Hook: 窗口尺寸
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// 使用自定义 Hook
function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      窗口尺寸: {width} x {height}
    </div>
  );
}
```

```typescript
// 自定义 Hook: 本地存储
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// 使用
function App() {
  const [name, setName] = useLocalStorage('name', 'Guest');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

## Hooks 使用规则

### 规则 1: 只在最顶层使用 Hooks

❌ **错误示例：**

```typescript
function BadComponent() {
  if (condition) {
    const [count, setCount] = useState(0); // ❌ 不要在条件语句中使用
  }
  
  for (let i = 0; i < 10; i++) {
    useEffect(() => {}); // ❌ 不要在循环中使用
  }
}
```

✅ **正确示例：**

```typescript
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (condition) {
      // 条件逻辑放在 Hook 内部
    }
  });
}
```

### 规则 2: 只在 React 函数中使用 Hooks

- ✅ 在 React 函数组件中使用
- ✅ 在自定义 Hook 中使用
- ❌ 不要在普通 JavaScript 函数中使用

## 性能优化技巧

### 1. 避免不必要的重新渲染

```typescript
import React, { memo } from 'react';

// 使用 React.memo 包裹组件
const ExpensiveChild = memo(function ExpensiveChild({ data }: { data: string }) {
  console.log('ExpensiveChild 渲染');
  return <div>{data}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const data = useMemo(() => 'static data', []); // 缓存 props

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild data={data} />
    </div>
  );
}
```

### 2. 合理使用依赖数组

```typescript
// ❌ 缺少依赖
useEffect(() => {
  console.log(count);
}, []); // count 变化时不会重新执行

// ✅ 正确的依赖
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ 空依赖数组（仅在挂载时执行）
useEffect(() => {
  console.log('组件挂载');
}, []);
```

## 总结

React Hooks 的核心优势：

1. **更简洁的代码** - 无需 class 组件
2. **更好的逻辑复用** - 通过自定义 Hooks
3. **更清晰的副作用管理** - useEffect
4. **更好的 TypeScript 支持**

记住 Hooks 的两个规则，合理使用依赖数组，你就能充分发挥 Hooks 的威力！

## 参考资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [useHooks - 自定义 Hooks 集合](https://usehooks.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
