# YF Framework Documentation
### A Lightweight JavaScript Framework for Modern Web Applications

---

## Table of Contents
1. [Why YF Framework?](#why-yf-framework)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Data Binding](#data-binding)
5. [Components](#components)
6. [Iterators (Loops)](#iterators-loops)
7. [Conditional Rendering](#conditional-rendering)
8. [State Management (Routing)](#state-management-routing)
9. [Complete Examples](#complete-examples)
10. [API Reference](#api-reference)

---

## Why YF Framework?

**YF Framework** is designed for developers who want the power of modern frameworks without the complexity. Here's why you should use it:

### ✅ **Extremely Lightweight**
- Single file (~15KB unminified)
- No build tools required
- No dependencies
- Instant setup

### ✅ **Easy to Learn**
- Simple, intuitive syntax
- Familiar HTML attributes
- Minimal JavaScript API
- No complex concepts

### ✅ **Powerful Features**
- Two-way data binding
- Reactive components
- Conditional rendering
- Data iteration
- Client-side routing
- Nested object support

### ✅ **Perfect For**
- Small to medium projects
- Rapid prototyping
- Learning reactive programming
- Legacy project modernization
- Projects where bundle size matters

---

## Getting Started

### Installation

Simply include the framework in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>My YF App</title>
	<script src="framework.js"></script>
</head>
<body data-cloak>
<!-- Your app here -->
</body>
</html>
```

**Note:** The `data-cloak` attribute prevents flash of unstyled content during initialization.

### Your First App

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Hello YF</title>
	<script src="framework.js"></script>
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

**What's happening:**
1. `{name}` displays the value of the `name` variable
2. `data-bind="name"` creates a two-way binding with the input
3. `setData('name', 'World')` sets the initial value
4. When you type in the input, the heading updates automatically!

---

## Core Features

### Global Functions

YF Framework provides simple global functions for managing your app:

```javascript
// Set data
setData('username', 'yarek');
setData('user.age', 25); // Nested properties work too!

// Get data
const username = getData('username');

// Components
loadComponent('my-card', 'components/card.html');
registerComponent('my-button', '<button>{text}</button>');

// Routing
setState('myPanel', 'login');
const currentState = getState('myPanel');
```

---

## Data Binding

### 1. Text Interpolation

Display data in your HTML using curly braces:

```html
<h1>Welcome {username}!</h1>
<p>You have {messageCount} new messages</p>
<p>Your email: {user.email}</p>
```

```javascript
setData('username', 'Yarek');
setData('messageCount', 5);
setData('user', { email: 'yarek@example.com' });
```

### 2. Two-Way Binding with Inputs

Bind form inputs to data with `data-bind`:

```html
<!-- Text input -->
<input type="text" data-bind="username">

<!-- Textarea -->
<textarea data-bind="bio"></textarea>

<!-- Select -->
<select data-bind="country">
	<option value="FR">France</option>
	<option value="US">USA</option>
	<option value="UK">UK</option>
</select>
```

```javascript
setData('username', 'Yarek');
setData('bio', 'Web developer');
setData('country', 'FR');
```

**Why it's useful:** Changes in the input automatically update the data, and vice versa!

### 3. Attribute Binding

Bind data to HTML attributes:

```html
<img src="{imagePath}" alt="{imageAlt}">
<a href="{linkUrl}">{linkText}</a>
<div class="card {cardType}">Content</div>
<button disabled="{isDisabled}">Submit</button>
```

```javascript
setData('imagePath', '/images/photo.jpg');
setData('imageAlt', 'Profile photo');
setData('linkUrl', 'https://example.com');
setData('linkText', 'Visit our site');
setData('cardType', 'featured');
setData('isDisabled', 'true');
```

### 4. Nested Data

YF Framework supports nested objects seamlessly:

```html
<h2>{user.profile.firstName} {user.profile.lastName}</h2>
<p>Company: {user.company.name}</p>
<p>Role: {user.company.role}</p>
```

```javascript
setData('user', {
profile: {
firstName: 'Yarek',
lastName: 'Smith'
},
company: {
name: 'TechCorp',
role: 'Developer'
}
});

// Or set nested values directly
setData('user.profile.firstName', 'John');
setData('user.company.role', 'Senior Developer');
```

---

## Components

Components let you create reusable UI elements.

### Inline Components

Define components directly in your HTML:

```html
<template component="user-card">
	<div class="card">
		<h3>{name}</h3>
		<p>{role}</p>
		<span class="badge">{badge}</span>
	</div>
</template>

<!-- Use the component -->
<user-card name="Yarek" role="Developer" badge="Pro"></user-card>
<user-card name="John" role="Designer" badge="Premium"></user-card>
```

### External Components

Load components from separate files (recommended for larger projects):

**components/fancy-card.html:**
```html
<style>
	.fancy-card {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 20px;
		border-radius: 15px;
		box-shadow: 0 10px 25px rgba(0,0,0,0.2);
	}
</style>
<div class="fancy-card">
	<h2>{title}</h2>
	<p>{content}</p>
</div>
```

**index.html:**
```html
<fancyCard title="Welcome" content="Hello World"></fancyCard>

<script>
	loadComponent('fancyCard', 'components/fancy-card.html');
</script>
```

### Reactive Component Props

Pass reactive data to components:

```html
<fancyCard title="User Info" content="{username}"></fancyCard>

<input type="text" data-bind="username">

<script>
	setData('username', 'Yarek');
	loadComponent('fancyCard', 'components/fancy-card.html');
</script>
```

**When you type in the input, the component updates automatically!**

### Alternative Syntax for Reactive Props

You can also use `data-` prefix for clarity:

```html
<fancyCard title="Static Title" data-content="username"></fancyCard>

<script>
	setData('username', 'Dynamic content here');
</script>
```

---

## Iterators (Loops)

Display lists of data with `data-for`:

### Basic Iteration

```html
<div data-for="users as user">
	<div class="user-card">
		<h3>{user.name}</h3>
		<p>Role: {user.role}</p>
		<p>Email: {user.email}</p>
	</div>
</div>

<script>
	setData('users', [
		{ name: 'Yarek', role: 'Developer', email: 'yarek@example.com' },
		{ name: 'John', role: 'Designer', email: 'john@example.com' },
		{ name: 'Alice', role: 'Manager', email: 'alice@example.com' }
	]);
</script>
```

### Alternative Syntax

Both syntaxes work:
```html
<!-- "users as user" -->
<div data-for="users as user">
	<p>{user.name}</p>
</div>

<!-- "user in users" -->
<div data-for="user in users">
	<p>{user.name}</p>
</div>
```

### Dynamic Lists

Lists update automatically when data changes:

```html
<div data-for="tasks as task">
	<div class="task {task.status}">
		<input type="checkbox">
		<span>{task.title}</span>
	</div>
</div>

<button onclick="addTask()">Add Task</button>

<script>
	setData('tasks', [
		{ title: 'Learn YF Framework', status: 'completed' },
		{ title: 'Build an app', status: 'pending' }
	]);

	function addTask() {
		const currentTasks = getData('tasks');
		setData('tasks', [
			...currentTasks,
			{ title: 'New task', status: 'pending' }
		]);
	}
</script>
```

### Nested Iterations

You can nest loops:

```html
<div data-for="categories as category">
	<h2>{category.name}</h2>
	<div data-for="category.items as item">
		<div class="item">
			<p>{item.name} - ${item.price}</p>
		</div>
	</div>
</div>

<script>
	setData('categories', [
		{
			name: 'Electronics',
			items: [
				{ name: 'Laptop', price: 999 },
				{ name: 'Phone', price: 699 }
			]
		},
		{
			name: 'Books',
			items: [
				{ name: 'JavaScript Guide', price: 29 },
				{ name: 'CSS Mastery', price: 35 }
			]
		}
	]);
</script>
```

---

## Conditional Rendering

Show or hide elements based on data with the `show` attribute:

### Basic Conditional

```html
<h1 show="isLoggedIn">Welcome back!</h1>
<div show="hasMessages">You have new messages</div>

<script>
	setData('isLoggedIn', true);
	setData('hasMessages', false); // This div will be hidden
</script>
```

### With Curly Braces

```html
<h1 show="{isLoggedIn}">Welcome back!</h1>
```

### Expression-Based Conditions

Use expressions for complex conditions:

```html
<!-- Equality -->
<h1 show="{username=='yarek'}">Hello Yarek!</h1>

<!-- Comparison -->
<div show="{age>=18}">Adult content</div>
<div show="{score>100}">High score achieved!</div>

<!-- Logical operators -->
<div show="{isLoggedIn && isAdmin}">Admin Panel</div>
<div show="{username=='yarek' || username=='john'}">VIP Access</div>

<!-- Complex expressions -->
<div show="{users.length>0}">We have users!</div>
<div show="{score>=50 && score<=100}">Medium score range</div>
```

```javascript
setData('username', 'yarek');
setData('age', 25);
setData('score', 150);
setData('isLoggedIn', true);
setData('isAdmin', false);
setData('users', ['user1', 'user2']);
```

### Practical Example: Login State

```html
<div show="{!isLoggedIn}">
	<h2>Please login</h2>
	<button onclick="login()">Login</button>
</div>

<div show="{isLoggedIn}">
	<h2>Welcome {username}!</h2>
	<button onclick="logout()">Logout</button>
</div>

<script>
	setData('isLoggedIn', false);
	setData('username', '');

	function login() {
		setData('username', 'Yarek');
		setData('isLoggedIn', true);
	}

	function logout() {
		setData('isLoggedIn', false);
		setData('username', '');
	}
</script>
```

---

## State Management (Routing)

YF Framework includes built-in client-side routing for single-page applications.

### Basic States

Create multiple views in one container:

```html
<div id="app">
	<div state="home">
		<h1>Home Page</h1>
		<p>Welcome to our site!</p>
	</div>

	<div state="about">
		<h1>About Page</h1>
		<p>Learn more about us</p>
	</div>

	<div state="contact">
		<h1>Contact Page</h1>
		<p>Get in touch</p>
	</div>
</div>

<nav>
	<button onclick="setState('app', 'home')">Home</button>
	<button onclick="setState('app', 'about')">About</button>
	<button onclick="setState('app', 'contact')">Contact</button>
</nav>
```

**How it works:**
- Only one state is visible at a time
- The first state is shown by default
- URL hash updates automatically (`#app:about`)
- Browser back/forward buttons work!

### Nested States

Create multi-level navigation:

```html
<div id="dashboard">
	<div state="overview">
		<h1>Dashboard Overview</h1>
	</div>

	<div state="settings">
		<h2>Settings</h2>

		<div id="settingsPanel">
			<div state="profile">
				<h3>Profile Settings</h3>
				<input type="text" data-bind="username">
			</div>

			<div state="security">
				<h3>Security Settings</h3>
				<button>Change Password</button>
			</div>

			<div state="notifications">
				<h3>Notification Settings</h3>
				<input type="checkbox"> Email notifications
			</div>
		</div>

		<nav>
			<button onclick="setState('settingsPanel', 'profile')">Profile</button>
			<button onclick="setState('settingsPanel', 'security')">Security</button>
			<button onclick="setState('settingsPanel', 'notifications')">Notifications</button>
		</nav>
	</div>
</div>

<nav>
	<button onclick="setState('dashboard', 'overview')">Overview</button>
	<button onclick="setState('dashboard', 'settings')">Settings</button>
</nav>
```

### URL Persistence

States are automatically saved in the URL hash:

```
#dashboard:settings,settingsPanel:profile
```

This means:
- Users can bookmark specific views
- Back/forward buttons work correctly
- Page refreshes maintain state

### Getting Current State

```javascript
const currentView = getState('dashboard');
console.log(currentView); // "settings"

if (currentView === 'settings') {
// Do something when in settings view
}
```

---

## Complete Examples

### Example 1: Todo List Application

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Todo App - YF Framework</title>
	<script src="framework.js"></script>
	<style>
		.todo-item { padding: 10px; border-bottom: 1px solid #ddd; }
		.completed { text-decoration: line-through; color: #888; }
	</style>
</head>
<body data-cloak>
<h1>My Todo List</h1>

<div>
	<input type="text" data-bind="newTodo" placeholder="What needs to be done?">
	<button onclick="addTodo()">Add</button>
</div>

<div show="{todos.length>0}">
	<p>Total tasks: {todos.length}</p>

	<div data-for="todos as todo">
		<div class="todo-item {todo.status}">
			<input type="checkbox" onclick="toggleTodo({todo.id})">
			<span>{todo.text}</span>
			<button onclick="deleteTodo({todo.id})">Delete</button>
		</div>
	</div>
</div>

<div show="{todos.length==0}">
	<p>No tasks yet. Add one above!</p>
</div>

<script>
	setData('newTodo', '');
	setData('todos', []);
	let nextId = 1;

	function addTodo() {
		const text = getData('newTodo');
		if (!text.trim()) return;

		const todos = getData('todos') || [];
		todos.push({
			id: nextId++,
			text: text,
			status: 'pending'
		});

		setData('todos', todos);
		setData('newTodo', '');
	}

	function toggleTodo(id) {
		const todos = getData('todos');
		const todo = todos.find(t => t.id === id);
		if (todo) {
			todo.status = todo.status === 'pending' ? 'completed' : 'pending';
			setData('todos', [...todos]);
		}
	}

	function deleteTodo(id) {
		const todos = getData('todos').filter(t => t.id !== id);
		setData('todos', todos);
	}
</script>
</body>
</html>
```

### Example 2: User Dashboard with Routing

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Dashboard - YF Framework</title>
	<script src="framework.js"></script>
	<style>
		.nav { margin: 20px 0; }
		.nav button { margin-right: 10px; padding: 10px 20px; }
		.user-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
	</style>
</head>
<body data-cloak>
<h1>User Dashboard</h1>
<p>Welcome, {currentUser.name}!</p>

<div class="nav">
	<button onclick="setState('main', 'dashboard')">Dashboard</button>
	<button onclick="setState('main', 'users')">Users</button>
	<button onclick="setState('main', 'settings')">Settings</button>
</div>

<div id="main">
	<div state="dashboard">
		<h2>Dashboard Overview</h2>
		<p>Total users: {users.length}</p>
		<p>Active users: {activeUsersCount}</p>
	</div>

	<div state="users">
		<h2>User Management</h2>

		<div show="{users.length>0}">
			<div data-for="users as user">
				<div class="user-card">
					<h3>{user.name}</h3>
					<p>Email: {user.email}</p>
					<p>Role: {user.role}</p>
					<span show="{user.active}">✓ Active</span>
					<span show="{!user.active}">✗ Inactive</span>
				</div>
			</div>
		</div>
	</div>

	<div state="settings">
		<h2>Settings</h2>

		<label>
			Your Name:
			<input type="text" data-bind="currentUser.name">
		</label>

		<label>
			Email:
			<input type="email" data-bind="currentUser.email">
		</label>

		<button onclick="saveSettings()">Save</button>
	</div>
</div>

<script>
	setData('currentUser', {
		name: 'Yarek',
		email: 'yarek@example.com'
	});

	setData('users', [
		{ name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
		{ name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: true },
		{ name: 'Bob Johnson', email: 'bob@example.com', role: 'User', active: false }
	]);

	setData('activeUsersCount',
		getData('users').filter(u => u.active).length
	);

	function saveSettings() {
		alert('Settings saved!');
	}
</script>
</body>
</html>
```

### Example 3: E-commerce Product Catalog

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Shop - YF Framework</title>
	<script src="framework.js"></script>
	<style>
		.product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
		.product-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
		.cart { position: fixed; top: 20px; right: 20px; background: white;
			border: 1px solid #ddd; padding: 15px; }
		.filter { margin: 20px 0; }
	</style>
</head>
<body data-cloak>
<h1>Our Store</h1>

<div class="cart">
	<h3>Cart ({cart.length})</h3>
	<div show="{cart.length>0}">
		<div data-for="cart as item">
			<p>{item.name} - ${item.price}</p>
		</div>
		<p><strong>Total: ${cartTotal}</strong></p>
	</div>
	<p show="{cart.length==0}">Cart is empty</p>
</div>

<div class="filter">
	<label>
		Category:
		<select data-bind="selectedCategory">
			<option value="all">All</option>
			<option value="electronics">Electronics</option>
			<option value="clothing">Clothing</option>
			<option value="books">Books</option>
		</select>
	</label>

	<label>
		Max Price: ${maxPrice}
		<input type="range" data-bind="maxPrice" min="0" max="1000" step="50">
	</label>
</div>

<div class="product-grid" data-for="filteredProducts as product">
	<div class="product-card">
		<img src="{product.image}" alt="{product.name}" width="200">
		<h3>{product.name}</h3>
		<p>{product.category}</p>
		<p><strong>${product.price}</strong></p>
		<button onclick="addToCart({product.id})">Add to Cart</button>
	</div>
</div>

<script>
	setData('selectedCategory', 'all');
	setData('maxPrice', 1000);
	setData('cart', []);
	setData('cartTotal', 0);

	setData('products', [
		{ id: 1, name: 'Laptop', category: 'electronics', price: 999, image: '/images/laptop.jpg' },
		{ id: 2, name: 'T-Shirt', category: 'clothing', price: 29, image: '/images/tshirt.jpg' },
		{ id: 3, name: 'JavaScript Book', category: 'books', price: 45, image: '/images/book.jpg' },
		{ id: 4, name: 'Headphones', category: 'electronics', price: 199, image: '/images/headphones.jpg' },
		{ id: 5, name: 'Jeans', category: 'clothing', price: 79, image: '/images/jeans.jpg' }
	]);

	// Filter products based on selection
	function updateFilteredProducts() {
		const category = getData('selectedCategory');
		const maxPrice = getData('maxPrice');
		const products = getData('products');

		const filtered = products.filter(p => {
			const categoryMatch = category === 'all' || p.category === category;
			const priceMatch = p.price <= maxPrice;
			return categoryMatch && priceMatch;
		});

		setData('filteredProducts', filtered);
	}

	// Watch for filter changes
	setInterval(() => {
		updateFilteredProducts();
	}, 100);

	function addToCart(productId) {
		const products = getData('products');
		const product = products.find(p => p.id === productId);

		if (product) {
			const cart = getData('cart');
			cart.push(product);
			setData('cart', cart);

			const total = cart.reduce((sum, item) => sum + item.price, 0);
			setData('cartTotal', total);
		}
	}

	// Initialize
	updateFilteredProducts();
</script>
</body>
</html>
```

---

## API Reference

### Data Management

#### `setData(key, value)`
Set a data value. Supports nested keys.

```javascript
setData('username', 'Yarek');
setData('user.profile.age', 25);
```

#### `getData(key)`
Get a data value.

```javascript
const username = getData('username');
const age = getData('user.profile.age');
```

### Component Management

#### `registerComponent(name, template)`
Register a component with HTML template.

```javascript
registerComponent('my-button', '<button class="btn">{text}</button>');
```

#### `loadComponent(name, url)`
Load a component from an external file.

```javascript
loadComponent('user-card', 'components/user-card.html');
```

#### `renderComponents()`
Force re-render of all components (rarely needed).

```javascript
renderComponents();
```

### State Management

#### `setState(containerId, stateName)`
Change the active state in a container.

```javascript
setState('myPanel', 'login');
```

#### `getState(containerId)`
Get the current active state.

```javascript
const currentState = getState('myPanel');
```

### HTML Attributes

#### `data-bind="key"`
Two-way binding for form inputs.

```html
<input type="text" data-bind="username">
```

#### `{key}`
Display data in text or attributes.

```html
<p>Hello {username}!</p>
<img src="{imagePath}">
```

#### `show="condition"` or `show="{expression}"`
Conditional rendering.

```html
<div show="isVisible">Visible content</div>
<div show="{age>=18}">Adult content</div>
```

#### `data-for="array as item"` or `data-for="item in array"`
Loop over arrays.

```html
<div data-for="users as user">
	<p>{user.name}</p>
</div>
```

#### `state="stateName"`
Define a state within a container.

```html
<div id="app">
	<div state="home">Home content</div>
	<div state="about">About content</div>
</div>
```

#### `data-cloak`
Hide content until framework is initialized (add to `<body>`).

```html
<body data-cloak>
```

---

## Best Practices

### 1. Organize Your Data

```javascript
// Good: Group related data
setData('user', {
name: 'Yarek',
email: 'yarek@example.com',
settings: {
theme: 'dark',
notifications: true
}
});

// Instead of:
setData('userName', 'Yarek');
setData('userEmail', 'yarek@example.com');
setData('userTheme', 'dark');
```

### 2. Use Components for Reusability

Break down your UI into small, reusable components:

```html
<!-- Good -->
<user-card name="{user.name}" email="{user.email}"></user-card>

<!-- Instead of repeating HTML -->
```

### 3. Keep Logic Simple

For complex operations, use functions:

```javascript
function updateCart() {
const cart = getData('cart');
const total = cart.reduce((sum, item) => sum + item.price, 0);
setData('cartTotal', total);
setData('itemCount', cart.length);
}
```

### 4. Use Descriptive State Names

```javascript
// Good
setState('userPanel', 'editProfile');
setState('userPanel', 'changePassword');

// Not ideal
setState('userPanel', 'state1');
setState('userPanel', 'state2');
```

### 5. Leverage Nested States for Complex UIs

```html
<div id="dashboard">
	<div state="settings">
		<div id="settingsMenu">
			<div state="profile">...</div>
			<div state="security">...</div>
		</div>
	</div>
</div>
```

---

## Comparison with Other Frameworks

| Feature | YF Framework | React | Vue | Vanilla JS |
|---------|-------------|-------|-----|------------|
| **Size** | ~15KB | ~40KB (+ React DOM) | ~33KB | 0KB |
| **Setup** | Include 1 file | Build tools required | Build tools recommended | None |
| **Learning Curve** | Very Easy | Medium | Easy | N/A |
| **Two-way Binding** | Built-in | Manual | Built-in | Manual |
| **Components** | Built-in | Built-in | Built-in | Manual |
| **Routing** | Built-in | External library | External library | Manual |
| **Best For** | Small/Medium projects | Large apps | Medium/Large apps | Any size |

---

## Browser Support

YF Framework works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

No IE11 support (uses modern JavaScript features).

---

## Performance Tips

1. **Avoid excessive nesting** in data-for loops
2. **Use show directive** instead of creating/destroying elements frequently
3. **Batch data updates** when possible
4. **Keep component templates simple**
5. **Load external components** only when needed

---

## Troubleshooting

### Data not updating?
- Make sure you use `setData()`, not direct assignment
- Check browser console for errors
- Verify the data key matches exactly

### Component not showing?
- Ensure `loadComponent()` is called after setting initial data
- Check that the component file path is correct
- Look for JavaScript errors in console

### State not changing?
- Verify container and state names are correct
- Check that the container has an `id` attribute
- Ensure states are direct children of the container

---

## What's Next?

Now that you understand YF Framework, try:

1. **Build a real project** - The best way to learn!
2. **Create custom components** - Make reusable UI elements
3. **Experiment with nested states** - Build complex navigation
4. **Add styling** - YF works great with any CSS framework

---

## License

YF Framework is open source and free to use in personal and commercial projects.

---

## Support

Found a bug? Have a question? Open an issue on GitHub or reach out to the community!

Happy coding! 🚀