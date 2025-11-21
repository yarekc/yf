# YF Framework

> A lightweight, reactive JavaScript framework for modern web applications

[![Size](https://img.shields.io/badge/size-~15KB-blue.svg)](https://github.com/yourusername/yf-framework)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)

## Why YF Framework?

YF Framework brings the power of reactive data binding, components, and routing to your web applications **without the complexity**. No build tools, no configuration, no dependencies - just pure JavaScript magic.

### ✨ Key Features

- 🎯 **Reactive Data Binding** - Two-way binding with automatic UI updates
- ☑️ **Full Form Support** - Text inputs, checkboxes, radio buttons, selects, textareas - all work automatically
- 🎭 **Ternary Operators** - Full JavaScript expressions including conditional logic
- 🧩 **Component System** - Reusable UI components with props and data binding
- 🔄 **Smart Iterators** - Loop through arrays with reactive updates
- 👁️ **Conditional Rendering** - Show/hide elements with expressions
- 🗺️ **Built-in Routing** - Client-side navigation out of the box
- 🌳 **Nested Data** - Deep object support with dot notation
- ⚡ **Lightweight** - Only ~15KB unminified
- 🚀 **Zero Dependencies** - No external libraries required
- 💨 **Fast Setup** - Include one file and start coding
- 📄 **Progressive** - Works with existing code, no refactoring needed

## Quick Start
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My App</title>
    <script src="https://cdn.jsdelivr.net/gh/yarekc/yf@master/yf.min.js"></script>
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

## Core Features

### 📊 Data Binding

#### All Form Elements Supported
```html
<!-- Text inputs -->
<input type="text" data-bind="username">
<input type="email" data-bind="email">
<input type="number" data-bind="age">

<!-- Checkboxes -->
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

### 🧩 Components

Build reusable components with props and reactive data binding.

#### Internal Components (Template-based)

Define components directly in your HTML using `<template>` tags:
```html
<!-- Define the component -->
<template component="user-profile">
    <div class="profile-card">
        <h3>{name}</h3>
        <p>{title}</p>
        <p>📧 {email}</p>
    </div>
</template>

<!-- Use the component with data binding -->
<user-profile 
    data-name="userName"
    data-title="userTitle"
    data-email="userEmail">
</user-profile>

<script>
    setData('userName', 'John Doe');
    setData('userTitle', 'Senior Developer');
    setData('userEmail', 'john@example.com');
</script>
```

#### External Components (File-based)

Load components from external HTML files for better organization:

**components/alert-box.html:**
```html
<div class="alert-box {type}">
    <strong>{type == 'success' ? '✅' : type == 'warning' ? '⚠️' : '❌'}</strong>
    <span>{message}</span>
</div>
```

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/gh/yarekc/yf@master/yf.min.js"></script>
</head>
<body data-cloak>
    <!-- Component placeholder -->
    <alert-box 
        data-type="alertType"
        data-message="alertMessage">
    </alert-box>

    <script>
        // Set component data
        setData('alertType', 'success');
        setData('alertMessage', 'Operation completed!');
        
        // Load the component from file
        loadComponent('alert-box', 'components/alert-box.html');
    </script>
</body>
</html>
```

#### Component Props

Components support both static and dynamic props:
```html
<!-- Static props -->
<user-card name="John Doe" email="john@example.com"></user-card>

<!-- Data-bound props (reactive) -->
<user-card data-name="currentUser" data-email="currentEmail"></user-card>

<!-- Mixed props -->
<user-card 
    title="Welcome"
    data-name="userName"
    class="highlight">
</user-card>
```

**Key Features:**
- 📦 **Encapsulation** - Keep UI logic organized and reusable
- 🔄 **Reactive** - Components update automatically when data changes
- 🎯 **Props** - Pass static values or bind to reactive data
- 📁 **External Files** - Load components from separate files
- 🎨 **Flexible** - Use inline templates or external files
- ⚡ **Dynamic Loading** - Load components on-demand

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

## Complete Example: Dashboard with Components
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <script src="https://cdn.jsdelivr.net/gh/yarekc/yf@master/yf.min.js"></script>
    <style>
        body { font-family: Arial; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                     color: white; padding: 20px; border-radius: 10px; margin: 10px 0; }
        .user-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
        .user-card { background: #f5f5f5; padding: 15px; border-radius: 8px; }
    </style>
</head>
<body data-cloak>
    <h1>Dashboard</h1>

    <!-- Statistics Component -->
    <template component="stat-card">
        <div class="stat-card">
            <h2>{value}</h2>
            <p>{label}</p>
        </div>
    </template>

    <stat-card data-value="users.length" label="Total Users"></stat-card>
    <stat-card data-value="activeCount" label="Active Users"></stat-card>

    <!-- User List with Iterator -->
    <h2>Users</h2>
    <div class="user-list" data-for="users as user">
        <div class="user-card">
            <h3>{user.name}</h3>
            <p>📧 {user.email}</p>
            <p>{user.active ? '🟢 Active' : '⚫ Inactive'}</p>
        </div>
    </div>

    <script>
        setData('users', [
            { id: 1, name: 'Alice Johnson', email: 'alice@example.com', active: true },
            { id: 2, name: 'Bob Smith', email: 'bob@example.com', active: true },
            { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', active: false }
        ]);

        // Calculate active users
        function updateStats() {
            const users = getData('users') || [];
            setData('activeCount', users.filter(u => u.active).length);
        }

        updateStats();
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
- `registerComponent(name, template)` - Register component manually
- `loadComponent(name, url)` - Load component from external file
- `renderComponents()` - Re-render all components (called automatically)

### HTML Attributes

- `data-bind="key"` - Two-way binding (all form elements)
- `{expression}` - Display data or evaluate expressions
- `show="{condition}"` - Conditional rendering
- `data-for="array as item"` - Loop over arrays
- `state="name"` - Define a state
- `component="name"` - Define a component template
- `data-xxx="key"` - Bind component prop to data
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
