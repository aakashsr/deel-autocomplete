## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

- `React.Component`:  Think of Component as the basic building block for creating React components. By default, it doesn’t have any special logic to decide whether it should re-render or not. So, every time its parent component re-renders or when its own state (via setState) or props changes, it will re-render. This can sometimes lead to unnecessary re-renders, especially if the props or state haven’t actually changed.

- `PureComponent`: PureComponent comes with a built-in optimization. It automatically implements a method called shouldComponentUpdate(), which performs a shallow comparison of the component’s props and state. If it notices that neither the props nor the state have changed, it doesn't re-render. This can help boost performance by avoiding unnecessary updates.

Example of Breaking: If a prop is an object or array that is directly mutated without creating a new reference, PureComponent won’t detect the change and won’t re-render, potentially leaving the UI out of sync.

```javascript
// Assume `this.state` is: { nested: { count: 10 } }
// This would NOT trigger a re-render in PureComponent
const updatedNested = this.state.nested;
updatedNested.count = 20;
this.setState({ nested: updatedNested });
```
Here, the nested reference remains the same, so PureComponent won’t re-render.


## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

- When you use `Context`, any component that’s subscribed to it will re-render whenever the Context value changes. `shouldComponentUpdate` only looks at the component’s `props` and `state` to decide if it should re-render. But the thing is, context isn’t passed in through props or state. It’s handled behind the scenes by React.
So if the context changes but your props and state stay the same, `shouldComponentUpdate` might stop the component from updating. This can cause your UI to show old or incorrect data because it never sees the context changes. That’s why mixing shouldComponentUpdate with context can be dangerous—it can break your component’s ability to keep up with the latest context values.


## 3. Describe 3 ways to pass information from a component to its PARENT.

- `Callback Functions:`
This is most common way. The parent component passes a function as a prop to the child, and the child calls this function whenever it wants to send data back.

- `Lifting state up:`
In this pattern, state is managed in the parent component, and the child component receives it as props. The child can then update the state by calling a function passed down from the parent.


- `Using Context/ State Management Libraries:`
If you have a deeply nested component or more complex data flow and don’t want to pass props through multiple levels, you can use React Context or external libraries like Redux or Zustand. The child component can update the Context or dispatch an action, and parent will reflect the updated state automatically


## 4. Give 2 ways to prevent components from re-rendering.

- Using `React.memo()`(Functional components) or `React.PureComponent`(Class components)
- `useMemo` / `useCallback`

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

- It's an invisible wrapper that allows us to group multiple elements without adding an extra DOM node.

- A Fragment doesn’t create a DOM node, so you can’t attach refs or event listeners directly to it. If your code depends on interacting with the “parent” DOM element (like scrolling a container or calculating its dimensions), using a Fragment instead of a regular element will break that logic.

// Incorrect code
```javascript
<Fragment onClick={handleClick}>...</Fragment>
```


## 6. Give 3 examples of the HOC pattern.
- `Error Boundary HOC`:  React provides error boundaries via class components. For functional components, we can create an HOC to handle errors gracefully. 

```javascript
const withErrorBoundary = (WrappedComponent, FallbackComponent) => {
  return class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      // Log the error to an error reporting service
      console.error("Error caught by ErrorBoundary:", error, info);
    }

    render() {
      if (this.state.hasError) {
        return <FallbackComponent />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

- `Feature Flag HOC`

```javascript
function withFeatureFlag(Component, featureFlag) {
  return function WrappedComponent(props) {
    const isFeatureEnabled = checkFeatureFlag(featureFlag);
    if (!isFeatureEnabled) {
      return <div>Feature Not Available</div>;
    }
    return <Component {...props} />;
  };
}

const NewFeatureComponent = withFeatureFlag(MyComponent, 'new-feature');
```

- `Authorization HOC`

```javascript
const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!props.isAuthenticated) {
        navigate("/login");
      }
    }, [props.isAuthenticated, navigate]);

    return props.isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
```


## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

- In Promises, errors are handled using `.catch()` method or the second argument of `.then()`

```javascript
somePromise()
  .then(result => {
    // do something
  })
  .catch(error => {
    console.error('Error:', error);
  });
  ```

- In Callbacks, errors are handled using `"error-first"` callback pattern.
Errors are passed as the first argument to the callback function and subsequent arguemnts are data.

```javascript
someAsyncFunction((error, result) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  // handle result
});
```

- In Async/Await, errors are handled synchronous-looking `try/catch` blocks.

```javascript
async function someFunction() {
  try {
    const result = await someAsyncOperation();
    // do something with result
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 8. How many arguments does setState take and why is it async.

- `setState` takes two arguments.The first is either an object with the updated state values or a function that returns an object with the updated state. The second, which is optional, is a Callback Function that will be executed after the state has been updated and the component has been re-rendered.

- setState is asynchronous because 
    - `Batching Updates` - React batches multiple setState calls into a single update for better performance
    - `Avoid Unnecessary Re-renders` - By making setState asynchronous, React avoids re-rendering the component immediately after every state change. Instead, it waits for all state updates to complete before triggering a re-render.
    - `Consistency` - Asynchronous behavior ensures that the state updates are consistent. If setState were synchronous, it could lead to inconsistencies when multiple state updates are triggered in quick succession.


## 9. List the steps needed to migrate a Class to Function Component.

- Change the component declaration from a class to a function.
- Remove the render() method.
- Remove the constructor and replace this.state with useState.
- Convert lifecycle methods to hooks (e.g componentDidMount, componentDidUpdate, and componentWillUnmount can be replaced with useEffect)
- Remove this bindings and class methods:
- Replace this.props with direct props.
- Replace refs with useRef.


## 10.List a few ways styles can be used with components.
- Inline Styling
ex - <div style={{color: "red", fontWeight: "bold"}}>
- CSS Stylesheets
```javascript
import './styles.css' and 
<div className="my-class"></div>
```
- CSS Modules
Use CSS files with the .module.css extension
Import styles as objects and use them in your components
Example: import styles from './mystyle.module.css' and <div className={styles.myClass}>
- Sass/SCSS
With Sass/SCSS, we can use features like variables, nesting, and mixins.
vi) Tailwind CSS
Using utility classes provided by frameworks like Tailwind CSS, you can quickly apply styles without writing custom CSS classes.

```javascript
function MyComponent() {
  return (
    <div className="text-blue-500 text-xl p-2.5">
      Hello, World!
    </div>
  );
}
```

## 11. How to render an HTML string coming from the server.

We can do it via `dangerouslySetInnerHTML` attribute. However, it comes with security risk if the HTML is not properly sanitized. To mitigate risk, one can use a sanitization library like `DOMPurify` before rendering.
If security is not much concern, one can use libraries like `html-to-react` or `html-react-parser` to convert HTML string int oReact elements.

