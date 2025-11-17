/**
 * Lightweight JS Framework with Data Binding and Routing
 */
class Framework {
	constructor() {
		this.data = {};
		this.states = {};
		this.currentStates = {};
		this.bindings = new Map();
		this.components = new Map();
		this.initialized = false;
		this.ready = false;
		this.pendingOperations = [];
		this.observer = null;
	}

	init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.setup());
		} else {
			this.setup();
		}
	}

	setup() {
		if (this.initialized) return;
		this.initialized = true;

		// CRITICAL: Store original attributes on ALL elements before any processing
		this.storeOriginalAttributes();

		this.loadComponents();
		this.setupDataBinding();
		this.setupRouting();
		this.parseDOM();
		this.restoreStateFromURL();

		document.body.removeAttribute('data-cloak');

		this.ready = true;
		this.pendingOperations.forEach(fn => fn());
		this.pendingOperations = [];
	}
	storeOriginalAttributes() {
		// Store original attribute values for ALL elements before any processing
		const allElements = document.querySelectorAll('*');
		allElements.forEach(el => {
			el._originalAttributes = {};
			Array.from(el.attributes).forEach(attr => {
				el._originalAttributes[attr.name] = attr.value;
			});
		});
	}

	getNestedValue(obj, path) {
		if (!path.includes('.')) {
			return obj[path];
		}

		const keys = path.split('.');
		let value = obj;

		for (let key of keys) {
			if (value && typeof value === 'object' && key in value) {
				value = value[key];
			} else {
				return undefined;
			}
		}

		return value;
	}

	setNestedValue(obj, path, value) {
		if (!path.includes('.')) {
			obj[path] = value;
			return;
		}

		const keys = path.split('.');
		const lastKey = keys.pop();
		let current = obj;

		for (let key of keys) {
			if (!(key in current) || typeof current[key] !== 'object') {
				current[key] = {};
			}
			current = current[key];
		}

		current[lastKey] = value;
	}

	set(key, value) {
		if (!this.ready) {
			this.pendingOperations.push(() => this.set(key, value));
			return;
		}

		const oldValue = this.getNestedValue(this.data, key);

		if (oldValue !== value) {
			this.setNestedValue(this.data, key, value);
			this.updateBindings(key);

			if (key.includes('.')) {
				const parts = key.split('.');
				for (let i = parts.length - 1; i > 0; i--) {
					const parentKey = parts.slice(0, i).join('.');
					this.updateBindings(parentKey);
				}
			}
		}
	}

	get(key) {
		return this.getNestedValue(this.data, key);
	}

	setupDataBinding() {
		this.scanBindings();

		this.observer = new MutationObserver((mutations) => {
			// Temporarily disconnect to avoid infinite loops
			this.observer.disconnect();
			this.scanBindings();
			// Reconnect
			this.observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	scanBindings() {
		const bindElements = document.querySelectorAll('[data-bind]');
		bindElements.forEach(el => {
			const key = el.getAttribute('data-bind');

			if (!this.bindings.has(key)) {
				this.bindings.set(key, new Set());
			}

			// Check if already in set to avoid duplicates
			let alreadyBound = false;
			this.bindings.get(key).forEach(existing => {
				if (existing === el) alreadyBound = true;
			});

			if (!alreadyBound) {
				this.bindings.get(key).add(el);
			}

			if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
				if (!el._bindingHandler) {
					el._bindingHandler = (e) => {
						this.set(key, e.target.value);
					};
					el.addEventListener('input', el._bindingHandler);
				}

				const currentValue = this.getNestedValue(this.data, key);
				if (currentValue !== undefined) {
					el.value = currentValue;
				} else if (el.value) {
					this.set(key, el.value);
				}
			}
		});

		this.scanTemplateBindings();
		this.scanAttributeBindings();
		this.processShowDirectives();
		this.processIterators();
	}

	scanTemplateBindings() {
		const walker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT,
			null,
			false
		);

		const textNodes = [];
		let node;
		while (node = walker.nextNode()) {
			if (node.nodeValue.includes('{') && node.nodeValue.includes('}')) {
				textNodes.push(node);
			}
		}

		textNodes.forEach(node => {
			const template = node.nodeValue;
			const matches = template.match(/\{([\w.]+)\}/g);

			if (matches) {
				matches.forEach(match => {
					const path = match.slice(1, -1);

					if (!this.bindings.has(path)) {
						this.bindings.set(path, new Set());
					}

					if (!node._originalTemplate) {
						node._originalTemplate = template;
					}

					// Check if already in set
					let alreadyBound = false;
					this.bindings.get(path).forEach(existing => {
						if (existing === node) alreadyBound = true;
					});

					if (!alreadyBound) {
						this.bindings.get(path).add(node);
					}
				});
			}
		});
	}

	scanAttributeBindings() {
		const allElements = document.querySelectorAll('*');

		allElements.forEach(el => {
			// Skip custom component elements that haven't been processed yet
			if (this.components.has(el.tagName.toLowerCase())) {
				return;
			}

			Array.from(el.attributes).forEach(attr => {
				const attrValue = attr.value;

				if (attrValue.includes('{') && attrValue.includes('}')) {
					const matches = attrValue.match(/\{([\w.]+)\}/g);

					if (matches) {
						matches.forEach(match => {
							const path = match.slice(1, -1);

							if (!this.bindings.has(path)) {
								this.bindings.set(path, new Set());
							}

							if (!el._attributeTemplates) {
								el._attributeTemplates = {};
							}
							if (!el._attributeTemplates[attr.name]) {
								el._attributeTemplates[attr.name] = attrValue;
							}

							const binding = {
								element: el,
								attribute: attr.name,
								isAttribute: true
							};

							let alreadyBound = false;
							this.bindings.get(path).forEach(existing => {
								if (existing.isAttribute && existing.element === el && existing.attribute === attr.name) {
									alreadyBound = true;
								}
							});

							if (!alreadyBound) {
								this.bindings.get(path).add(binding);
							}
						});
					}
				}
			});
		});
	}

	processShowDirectives() {
		const showElements = document.querySelectorAll('[show]');

		showElements.forEach(el => {
			// Use original attribute if available, otherwise use current
			let condition = el._originalAttributes && el._originalAttributes['show']
				? el._originalAttributes['show']
				: el.getAttribute('show');

			console.log('Original condition:', condition);

			// Extract key from {key} syntax if present
			const match = condition.match(/^\{(.+)\}$/);
			if (match) {
				condition = match[1]; // Extract everything inside braces
				console.log('Extracted condition:', condition);
			}

			if (!el._originalDisplay) {
				el._originalDisplay = el.style.display || '';
			}

			if (!this.bindings.has(condition)) {
				this.bindings.set(condition, new Set());
			}

			const binding = {
				element: el,
				isShow: true,
				condition: condition
			};

			// Check if already bound
			let alreadyBound = false;
			this.bindings.get(condition).forEach(existing => {
				if (existing.isShow && existing.element === el) {
					alreadyBound = true;
				}
			});

			if (!alreadyBound) {
				this.bindings.get(condition).add(binding);
			}

			this.evaluateShow(el, condition);
		});
	}

	evaluateShow(element, condition) {
		console.log('Evaluating show condition:', condition);
		let value;

		// Check if condition contains an expression (operators like ==, !=, >, <, etc.)
		if (condition.match(/[=!<>]/)) {
			console.log('Is expression');
			// It's an expression, evaluate it
			value = this.evaluateExpression(condition);
		} else {
			console.log('Is simple key');
			// It's a simple data key
			value = this.getNestedValue(this.data, condition);
		}

		console.log('Evaluated value:', value);

		if (!element._originalDisplay) {
			element._originalDisplay = element.style.display || '';
		}

		if (value) {
			element.style.display = element._originalDisplay === 'none' ? '' : element._originalDisplay;
		} else {
			element.style.display = 'none';
		}
	}

	evaluateExpression(expression) {
		console.log('Evaluating expression:', expression);
		console.log('Current data:', this.data);

		// Replace data keys with their values
		let processedExpression = expression;

		// Find all potential data keys (word characters and dots)
		const tokens = expression.match(/[\w.]+/g) || [];
		console.log('Tokens found:', tokens);

		tokens.forEach(token => {
			// Skip JavaScript keywords and boolean literals
			if (['true', 'false', 'null', 'undefined'].includes(token)) {
				return;
			}

			const value = this.getNestedValue(this.data, token);
			console.log(`Token "${token}" has value:`, value);

			if (value !== undefined) {
				// Replace the token with the actual value
				// For strings, wrap in quotes
				const replacement = typeof value === 'string' ? `"${value}"` : value;
				processedExpression = processedExpression.replace(new RegExp(`\\b${token}\\b`, 'g'), replacement);
			}
		});

		console.log('Processed expression:', processedExpression);

		try {
			// Safely evaluate the expression
			const result = new Function('return ' + processedExpression)();
			console.log('Expression result:', result);
			return result;
		} catch (e) {
			console.warn(`Failed to evaluate expression: ${expression}`, e);
			return false;
		}
	}

	updateBindings(key) {
		const elements = this.bindings.get(key);
		if (!elements) return;

		elements.forEach(el => {
			if (el.isShow) {
				this.evaluateShow(el.element, el.condition);
			}
			else if (el.isAttribute) {
				const element = el.element;
				const attrName = el.attribute;
				const template = element._attributeTemplates[attrName];

				const newValue = template.replace(/\{([\w.]+)\}/g, (match, k) => {
					const value = this.getNestedValue(this.data, k);
					return value !== undefined ? value : '';
				});

				element.setAttribute(attrName, newValue);
			}
			else if (el.nodeType === Node.TEXT_NODE) {
				const template = el._originalTemplate || el.nodeValue;
				el.nodeValue = template.replace(/\{([\w.]+)\}/g, (match, k) => {
					const value = this.getNestedValue(this.data, k);
					return value !== undefined ? value : match;
				});
			}
			else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
				const value = this.getNestedValue(this.data, key);
				if (el.value !== value) {
					el.value = value || '';
				}
			}
			else {
				const value = this.getNestedValue(this.data, key);
				el.textContent = value || '';
			}
		});
	}

	setupRouting() {
		this.parseStates();
		window.addEventListener('hashchange', () => {
			this.restoreStateFromURL();
		});
	}

	parseStates() {
		// Only get direct state children, not nested ones
		const containers = document.querySelectorAll('[id]');

		containers.forEach(container => {
			// Get only direct children with [state] attribute
			const directStateChildren = Array.from(container.children).filter(child =>
				child.hasAttribute('state')
			);

			if (directStateChildren.length > 0) {
				const containerId = container.id;

				if (!this.states[containerId]) {
					this.states[containerId] = {};
				}

				directStateChildren.forEach(el => {
					const stateName = el.getAttribute('state');
					this.states[containerId][stateName] = el;
					el.style.display = 'none';
				});
			}
		});
	}

	parseDOM() {
		const containers = document.querySelectorAll('[id]');

		containers.forEach(container => {
			// Get only direct state children
			const directStateChildren = Array.from(container.children).filter(child =>
				child.hasAttribute('state')
			);

			if (directStateChildren.length > 0 && !this.currentStates[container.id]) {
				const firstState = directStateChildren[0].getAttribute('state');
				this.currentStates[container.id] = firstState;
				directStateChildren[0].style.display = '';
			}
		});
	}

	setState(containerId, stateName) {
		if (!this.states[containerId]) {
			console.warn(`Container "${containerId}" not found`);
			return;
		}

		if (!this.states[containerId][stateName]) {
			console.warn(`State "${stateName}" not found in container "${containerId}"`);
			return;
		}

		Object.values(this.states[containerId]).forEach(el => {
			el.style.display = 'none';
		});

		this.states[containerId][stateName].style.display = '';
		this.currentStates[containerId] = stateName;
		this.updateURL();
	}

	updateURL() {
		const stateString = Object.entries(this.currentStates)
			.map(([container, state]) => `${container}:${state}`)
			.join(',');

		window.location.hash = stateString;
	}

	restoreStateFromURL() {
		const hash = window.location.hash.slice(1);
		if (!hash) return;

		const states = hash.split(',');
		states.forEach(stateStr => {
			const [container, state] = stateStr.split(':');
			if (container && state && this.states[container] && this.states[container][state]) {
				Object.values(this.states[container]).forEach(el => {
					el.style.display = 'none';
				});

				this.states[container][state].style.display = '';
				this.currentStates[container] = state;
			}
		});
	}

	getState(containerId) {
		return this.currentStates[containerId];
	}

	registerComponent(name, template) {
		this.components.set(name, template);
	}

	loadComponents() {
		const templates = document.querySelectorAll('template[component]');

		templates.forEach(template => {
			const name = template.getAttribute('component');
			const content = template.innerHTML;
			this.registerComponent(name, content);
		});

		// Store original attributes for custom tags BEFORE any processing
		this.components.forEach((template, componentName) => {
			const customTags = document.querySelectorAll(componentName);
			customTags.forEach(el => {
				if (!el._originalAttributes) {
					el._originalAttributes = {};
					Array.from(el.attributes).forEach(attr => {
						el._originalAttributes[attr.name] = attr.value;
					});
				}
			});
		});

		this.processComponents();
	}

	processIterators() {
		const iteratorElements = document.querySelectorAll('[data-for]');

		iteratorElements.forEach(container => {
			const forExpression = container.getAttribute('data-for');
			// Parse: "user in users" or "users as user"
			const match = forExpression.match(/([\w.]+)\s+(?:in|as)\s+([\w.]+)/);

			if (!match) {
				console.warn(`Invalid data-for syntax: "${forExpression}"`);
				return;
			}

			const itemName = match[2]; // "user"
			const arrayKey = match[1]; // "users"

			// Store the template if not already stored
			if (!container._iteratorTemplate) {
				container._iteratorTemplate = container.innerHTML;
				container._iteratorItemName = itemName;
				container._iteratorArrayKey = arrayKey;
			}

			// Register binding for the array
			if (!this.bindings.has(arrayKey)) {
				this.bindings.set(arrayKey, new Set());
			}

			const binding = {
				element: container,
				isIterator: true,
				arrayKey: arrayKey,
				itemName: itemName
			};

			// Check if already bound
			let alreadyBound = false;
			this.bindings.get(arrayKey).forEach(existing => {
				if (existing.isIterator && existing.element === container) {
					alreadyBound = true;
				}
			});

			if (!alreadyBound) {
				this.bindings.get(arrayKey).add(binding);
			}

			// Render the iterator
			this.renderIterator(container);
		});
	}

	renderIterator(container) {
		const template = container._iteratorTemplate;
		const itemName = container._iteratorItemName;
		const arrayKey = container._iteratorArrayKey;

		const arrayData = this.getNestedValue(this.data, arrayKey);

		if (!Array.isArray(arrayData)) {
			container.innerHTML = '';
			return;
		}

		let html = '';

		arrayData.forEach((item, index) => {
			let itemHtml = template;

			// Replace {itemName.property} with actual values
			itemHtml = itemHtml.replace(new RegExp(`\\{${itemName}\\.(\\w+)\\}`, 'g'), (match, prop) => {
				return item[prop] !== undefined ? item[prop] : '';
			});

			// Replace {itemName} with the whole item (if it's a primitive)
			itemHtml = itemHtml.replace(new RegExp(`\\{${itemName}\\}`, 'g'), () => {
				return typeof item === 'object' ? JSON.stringify(item) : item;
			});

			html += itemHtml;
		});

		container.innerHTML = html;

		// After rendering, scan for any new bindings in the rendered content
		setTimeout(() => {
			this.scanBindings();
		}, 0);
	}

	processComponents() {
		const componentElements = document.querySelectorAll('[component]:not(template)');

		componentElements.forEach(el => {
			const componentName = el.getAttribute('component');
			const template = this.components.get(componentName);

			if (!template) {
				console.warn(`Component "${componentName}" not found`);
				return;
			}

			const props = {};
			Array.from(el.attributes).forEach(attr => {
				if (attr.name !== 'component') {
					props[attr.name] = attr.value;
				}
			});

			const rendered = this.renderComponent(template, props);
			el.innerHTML = rendered;
			el.removeAttribute('component');
		});

		this.components.forEach((template, componentName) => {
			const customTags = document.querySelectorAll(componentName);

			customTags.forEach(el => {
				const props = {};
				Array.from(el.attributes).forEach(attr => {
					props[attr.name] = attr.value;
				});

				const rendered = this.renderComponent(template, props);
				const wrapper = document.createElement('div');
				wrapper.innerHTML = rendered;
				el.replaceWith(...wrapper.childNodes);
			});
		});
	}

	renderComponent(template, props) {
		let rendered = template;

		// First pass: replace {prop:xxx} syntax
		rendered = rendered.replace(/\{prop:([\w.]+)\}/g, (match, propName) => {
			return props[propName] || '';
		});

		// Second pass: handle {xxx} placeholders
		rendered = rendered.replace(/\{([\w.]+)\}/g, (match, propName) => {
			// Check if there's a data-xxx attribute that specifies a binding
			const dataBindProp = props['data-' + propName];
			if (dataBindProp !== undefined) {
				// Return the binding syntax with the data key
				return '{' + dataBindProp + '}';
			}

			const propValue = props[propName];

			if (propValue === undefined) {
				return match;
			}

			if (typeof propValue === 'string' && propValue.includes('{') && propValue.includes('}')) {
				return propValue;
			}

			return propValue;
		});

		return rendered;
	}

	async loadComponentFromFile(name, url) {
		try {
			const response = await fetch(url);
			const template = await response.text();
			this.registerComponent(name, template);

			const customTags = document.querySelectorAll(name);

			customTags.forEach(el => {
				const props = {};

				// ALWAYS use the original attributes stored at page load
				if (el._originalAttributes) {
					Object.assign(props, el._originalAttributes);
				} else {
					Array.from(el.attributes).forEach(attr => {
						props[attr.name] = attr.value;
					});
				}

				const rendered = this.renderComponent(template, props);
				const wrapper = document.createElement('div');
				wrapper.innerHTML = rendered;
				el.replaceWith(...wrapper.childNodes);
			});

			await new Promise(resolve => setTimeout(resolve, 0));

			// Clean up dead nodes
			this.bindings.forEach((elements, key) => {
				elements.forEach(el => {
					if (el.nodeType === Node.TEXT_NODE) {
						if (!el.parentNode || !document.body.contains(el.parentNode)) {
							elements.delete(el);
						}
					} else if (el.element) {
						if (!document.body.contains(el.element)) {
							elements.delete(el);
						}
					} else if (!document.body.contains(el)) {
						elements.delete(el);
					}
				});
			});

			this.scanBindings();

			this.bindings.forEach((elements, key) => {
				this.updateBindings(key);
			});

		} catch (error) {
			console.error(`Failed to load component "${name}" from ${url}:`, error);
		}
	}
}

const app = new Framework();
app.init();

window.setState = (container, state) => app.setState(container, state);
window.getState = (container) => app.getState(container);
window.setData = (key, value) => app.set(key, value);
window.getData = (key) => app.get(key);
window.registerComponent = (name, template) => app.registerComponent(name, template);
window.loadComponent = (name, url) => app.loadComponentFromFile(name, url);
window.renderComponents = () => app.processComponents();

if (document.head) {
	const style = document.createElement('style');
	style.textContent = '[data-cloak] { visibility: hidden; }';
	document.head.appendChild(style);
}