---
slug: react-hooks-guide
title: Complete Guide to React Hooks
authors: [admin]
tags: [react, frontend, javascript, tutorial]
date: 2025-02-01T09:00
description: A comprehensive guide to understanding and using React Hooks
---

React Hooks, introduced in React 16.8, allow you to use state and other React features without writing a class.

<!--truncate-->

## Why Hooks?

Before Hooks, React components were mainly divided into two types:

- **Class components**: Could use state and lifecycle methods
- **Function components**: Could only receive props, called "stateless components"

Hooks solve the following problems:

1. **Difficulty reusing stateful logic between components**
2. **Complex components are hard to understand**
3. **The `this` keyword problem in class components**

## Common Hooks

### 1. useState - State Management

```typescript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**Best Practice:**

```typescript
// ✅ Use functional updates
setCount(prevCount => prevCount + 1);

// ❌ Avoid using current value directly
setCount(count + 1);
```

### 2. useEffect - Side Effects

```typescript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data fetching
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // Cleanup function
    return () => {
      // Cancel requests or cleanup subscriptions
    };
  }, [userId]); // Dependency array

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>Username: {user.name}</div>;
}
```

### 3. useContext - Context Management

```typescript
import React, { createContext, useContext, useState } from 'react';

// Create context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
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

// Custom Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage
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
      Toggle Theme
    </button>
  );
}
```

### 4. useReducer - Complex State Management

```typescript
import React, { useReducer } from 'react';

// Define state type
interface State {
  count: number;
  step: number;
}

// Define action type
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number }
  | { type: 'reset' };

// Reducer function
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
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
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
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### 5. useMemo and useCallback - Performance Optimization

```typescript
import React, { useState, useMemo, useCallback } from 'react';

function ExpensiveComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<number[]>([]);

  // useMemo: Cache computed results
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value...');
    return items.reduce((sum, item) => sum + item, 0);
  }, [items]); // Only recompute when items change

  // useCallback: Cache function
  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, Math.random()]);
  }, []); // Function never changes

  return (
    <div>
      <p>Sum: {expensiveValue}</p>
      <p>Click count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment Count</button>
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
}
```

### 6. useRef - References and DOM Access

```typescript
import React, { useRef, useEffect } from 'react';

function TextInputWithFocus() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
    
    // Track render count (doesn't trigger re-render)
    renderCount.current += 1;
  });

  return (
    <div>
      <input ref={inputRef} type="text" />
      <p>Render count: {renderCount.current}</p>
    </div>
  );
}
```

## Custom Hooks

Custom Hooks let you extract component logic into reusable functions:

```typescript
import { useState, useEffect } from 'react';

// Custom Hook: Window size
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

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}
```

```typescript
// Custom Hook: Local storage
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

// Usage
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

## Hooks Rules

### Rule 1: Only Call Hooks at the Top Level

❌ **Wrong:**

```typescript
function BadComponent() {
  if (condition) {
    const [count, setCount] = useState(0); // ❌ Don't use in conditions
  }
  
  for (let i = 0; i < 10; i++) {
    useEffect(() => {}); // ❌ Don't use in loops
  }
}
```

✅ **Correct:**

```typescript
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (condition) {
      // Conditional logic inside Hook
    }
  });
}
```

### Rule 2: Only Call Hooks from React Functions

- ✅ Call from React function components
- ✅ Call from custom Hooks
- ❌ Don't call from regular JavaScript functions

## Performance Optimization Tips

### 1. Avoid Unnecessary Re-renders

```typescript
import React, { memo } from 'react';

// Use React.memo to wrap component
const ExpensiveChild = memo(function ExpensiveChild({ data }: { data: string }) {
  console.log('ExpensiveChild rendered');
  return <div>{data}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const data = useMemo(() => 'static data', []); // Cache props

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild data={data} />
    </div>
  );
}
```

### 2. Use Dependency Arrays Properly

```typescript
// ❌ Missing dependencies
useEffect(() => {
  console.log(count);
}, []); // count changes won't trigger re-execution

// ✅ Correct dependencies
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ Empty dependency array (only run on mount)
useEffect(() => {
  console.log('Component mounted');
}, []);
```

## Summary

Core advantages of React Hooks:

1. **Cleaner code** - No need for class components
2. **Better logic reuse** - Through custom Hooks
3. **Clearer side effect management** - useEffect
4. **Better TypeScript support**

Remember the two rules of Hooks and use dependency arrays properly, and you'll unlock the full power of Hooks!

## References

- [React Hooks Official Documentation](https://react.dev/reference/react)
- [useHooks - Custom Hooks Collection](https://usehooks.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
