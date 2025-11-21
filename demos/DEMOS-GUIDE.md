# YF Framework - Demo Examples Summary

## Overview
This collection contains 17 simple, focused demos that teach YF Framework concepts one at a time.

## 📋 Form Elements (Demos 1-10)

### Basic Input Types
1. **Text Input** - Simple data binding with text fields
2. **Checkbox** - Boolean handling with automatic syncing
3. **Select Dropdown** - Dropdown menus with data binding
4. **Textarea** - Multi-line text with character counting
5. **Range Slider** - Interactive slider with conditional display
6. **Number Input** - Numeric validation with ternary operators
7. **Radio Buttons** - Single-choice selection groups
8. **Email Input** - Email validation with real-time feedback
9. **Multiple Checkboxes** - Multi-select with conditional rendering

### Complete Example
10. **Complete Form** - All form elements combined

## 🗺️ Routing (Demos 11-12)

11. **Simple Routing** - Basic page navigation with setState
12. **Tabs with Routing** - Tabbed interface using routing

**Key Concepts:**
- `setState(containerId, stateName)` - Change active state
- `state="name"` attribute - Define different states
- Client-side navigation without page reloads

## 🧩 Components (Demos 13-14)

13. **Simple Component** - Reusable UI components with static props
14. **Component Data Binding** - Components with reactive data

**Key Concepts:**
- `<template component="name">` - Define component
- `<component-name prop="value">` - Use component
- `data-prop="dataKey"` - Bind props to reactive data
- Reusable, encapsulated UI elements

## 🔄 Iterators (Demos 15-17)

15. **Simple Iterator** - Loop through arrays
16. **Interactive Iterator** - Add/delete items dynamically
17. **Iterator with Methods** - Use JavaScript methods in loops

**Key Concepts:**
- `data-for="array as item"` - Loop syntax
- `{item.property}` - Access item properties
- `{item.method()}` - Call methods on items
- `{array.length}` - Use array properties
- Dynamic updates when data changes

## 🎯 Learning Path

### Beginners Start Here:
1. Text Input (01)
2. Checkbox (02)
3. Select Dropdown (03)
4. Simple Routing (11)
5. Simple Component (13)
6. Simple Iterator (15)

### Intermediate:
- Textarea (04)
- Range Slider (05)
- Number Input (06)
- Radio Buttons (07)
- Email Input (08)
- Multiple Checkboxes (09)
- Tabs with Routing (12)
- Component Data Binding (14)
- Interactive Iterator (16)
- Iterator with Methods (17)

### Advanced:
- Complete Form (10)

## 💡 Key Takeaways

### Data Binding
```html
<input type="text" data-bind="key">
<div>{key}</div>
```

### Routing
```html
<button onclick="setState('app', 'home')">Home</button>
<div id="app">
  <div state="home">Home content</div>
</div>
```

### Components
```html
<template component="card">
  <div>{title}</div>
</template>
<card title="Hello"></card>
```

### Iterators
```html
<div data-for="items as item">
  <div>{item.name}</div>
</div>
```

## 🚀 Next Steps

1. Open `index.html` to browse all demos
2. Start with demos 1-6 to learn basics
3. Try modifying the code in each demo
4. Combine concepts to build your own app
5. Check the full `demo.html` for advanced examples

## 📚 Additional Resources

- **README.md** - Full documentation
- **demo.html** - Complete feature showcase
- **formDemo.html** - Comprehensive form example

---

Built with ❤️ for easy learning
