# YF Framework

> A lightweight, reactive JavaScript framework for modern web applications

[![Size](https://img.shields.io/badge/size-~15KB-blue.svg)](https://github.com/yourusername/yf-framework)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)

## Why YF Framework ?

YF Framework brings the power of reactive data binding, components, and routing to your web applications **without the complexity**. No build tools, no configuration, no dependencies - just pure JavaScript magic.

### ✨ Key Features

- 🎯 **Reactive Data Binding** - Two-way binding with automatic UI updates
- ☑️ **Full Form Support** - Text inputs, checkboxes, radio buttons, selects, textareas - all work automatically
- 🎭 **Ternary Operators** - Full JavaScript expressions including conditional logic
- 🧩 **Component System** - Reusable UI components with props
- 🔄 **Smart Iterators** - Loop through arrays with reactive updates
- 👁️ **Conditional Rendering** - Show/hide elements with expressions
- 🗺️ **Built-in Routing** - Client-side navigation out of the box
- 🌳 **Nested Data** - Deep object support with dot notation
- ⚡ **Lightweight** - Only ~15KB unminified
- 🚀 **Zero Dependencies** - No external libraries required
- 💨 **Fast Setup** - Include one file and start coding
- 🔄 **Progressive** - Works with existing code, no refactoring needed

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My App</title>
    <script src="yf.js"></script>
</head>
<body data-cloak>
    <h1>Hello {name}!</h1>
    <input type="text" data-bind="name" placeholder="Enter your name">
    
    <script>
        setData('name', 'World');
    </script>
</body>
</html>
```

That's it! Type in the input and watch the heading update automatically.

## What's New in Latest Version

### ✅ Automatic Checkbox Support
Checkboxes now work automatically with `data-bind` - no manual syncing needed!

```html
<input type="checkbox" data-bind="subscribe">
<p>{subscribe ? '✓ Subscribed' : '✗ Not subscribed'}</p>

<script>
    setData('subscribe', true); // Checkbox is automatically checked!
</script>
```

### ✅ Full Ternary Operator Support
Use conditional logic directly in templates:

```html
<div>{score >= 50 ? 'Pass' : 'Fail'}</div>
<div>{isLoggedIn ? 'Welcome back!' : 'Please login'}</div>
<div>{items.length > 0 ? items.length + ' items' : 'Empty cart'}</div>
```

## Core Features

### 📊 Data Binding

#### All Form Elements Supported

```html
<!-- Text inputs -->
<input type="text" data-bind="username">
<input type="email" data-bind="email">
<input type="number" data-bind="age">

<!-- Checkboxes (automatic boolean handling!) -->
<input type="checkbox" data-bind="subscribe">
<input type="checkbox" data-bind="notifications">

<!-- Textarea -->
<textarea data-bind="bio"></textarea>

<!-- Select -->
<select data-bind="country">
    <option value="us">USA</option>
    <option value="fr">France</option>
</select>

<!-- Range -->
<input type="range" data-bind="volume" min="0" max="100">
```

#### Expression Evaluation

Full JavaScript expressions supported:

```html
<!-- String methods -->
<div>{username.toUpperCase()}</div>
<div>{text.substring(0, 10)}...</div>

<!-- Array operations -->
<div>{users.length} users online</div>

<!-- Math -->
<div>Total: ${price * quantity}</div>
<div>{(price * 1.2).toFixed(2)}</div>

<!-- Ternary operators -->
<div>{age >= 18 ? 'Adult' : 'Minor'}</div>
<div>{score >= 50 ? 'Pass' : 'Fail'}</div>
<div>{subscribe ? '✓ Yes' : '✗ No'}</div>
<div>{items.length > 0 ? items.length + ' items' : 'Empty'}</div>

<!-- Nested ternary -->
<div>{age >= 18 ? 'Adult' : age >= 13 ? 'Teen' : 'Child'}</div>

<!-- Combined -->
<div>{user.name.substring(0, 20).toUpperCase()}</div>
<div>{username ? username.toUpperCase() : 'Guest'}</div>
```

### 🔄 Iterators

```html
<div data-for="users as user">
    <div class="user-card">
        <h3>{user.name.toUpperCase()}</h3>
        <p>Email: {user.email.toLowerCase()}</p>
        <p>Status: {user.active ? '🟢 Active' : '⚫ Inactive'}</p>
    </div>
</div>

<script>
    setData('users', [
        { name: 'John', email: 'JOHN@EXAMPLE.COM', active: true },
        { name: 'Jane', email: 'JANE@EXAMPLE.COM', active: false }
    ]);
</script>
```

### 👁️ Conditional Rendering

```html
<!-- Simple -->
<div show="{isLoggedIn}">Welcome back!</div>

<!-- With expressions -->
<div show="{age>=18}">Adult content</div>
<div show="{score>100}">High score!</div>
<div show="{users.length>0}">User list</div>

<!-- Complex -->
<div show="{isLoggedIn && isAdmin}">Admin panel</div>
<div show="{cart.length==0}">Cart is empty</div>
```

### 🗺️ Routing

```html
<div id="app">
    <div state="home">Home Page</div>
    <div state="about">About Page</div>
</div>

<button onclick="setState('app', 'home')">Home</button>
<button onclick="setState('app', 'about')">About</button>
```

## Complete Example: Todo App

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Todo App</title>
    <script src="yf.js"></script>
    <style>
        body { max-width: 600px; margin: 50px auto; font-family: Arial; }
        .todo { padding: 10px; margin: 5px 0; background: #f0f0f0; }
        .done { text-decoration: line-through; opacity: 0.6; }
    </style>
</head>
<body data-cloak>
    <h1>Todo List</h1>
    
    <p>{todos.length} tasks - {completedCount} done, {pendingCount} pending</p>
    
    <input type="text" data-bind="newTodo" placeholder="New task...">
    <button onclick="add()">Add</button>
    
    <div data-for="todos as todo">
        <div class="todo">
            <input type="checkbox" data-bind="todo.done">
            <span class="{todo.done ? 'done' : ''}">{todo.text}</span>
            <button onclick="del({todo.id})">Delete</button>
        </div>
    </div>
    
    <p show="{todos.length==0}">No tasks yet!</p>
    
    <script>
        setData('newTodo', '');
        setData('completedCount', 0);
        setData('pendingCount', 0);
        setData('todos', [
            { id: 1, text: 'Learn YF Framework', done: false },
            { id: 2, text: 'Build something cool', done: false }
        ]);

        let id = 3;

        function stats() {
            const t = getData('todos') || [];
            setData('completedCount', t.filter(x => x.done).length);
            setData('pendingCount', t.filter(x => !x.done).length);
        }

        function add() {
            const text = getData('newTodo');
            if (!text.trim()) return;
            setData('todos', [...getData('todos'), { id: id++, text, done: false }]);
            setData('newTodo', '');
            stats();
        }

        function del(todoId) {
            setData('todos', getData('todos').filter(x => x.id !== todoId));
            stats();
        }

        stats();
    </script>
</body>
</html>
```

## API Reference

### Global Functions

- `setData(key, value)` - Set data (supports nested keys)
- `getData(key)` - Get data
- `setState(container, state)` - Change state
- `getState(container)` - Get current state
- `loadComponent(name, url)` - Load external component
- `registerComponent(name, template)` - Register component

### HTML Attributes

- `data-bind="key"` - Two-way binding (all form elements)
- `{expression}` - Display data or evaluate expressions
- `show="{condition}"` - Conditional rendering
- `data-for="array as item"` - Loop over arrays
- `state="name"` - Define a state
- `data-cloak` - Hide until ready

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ❌ IE11 (not supported)

## License

MIT License - Free to use in personal and commercial projects.

---

**Built with ❤️ for developers who want simplicity without sacrificing power.**

[View Full Documentation](docs/) | [See More Examples](examples/)