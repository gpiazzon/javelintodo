import App from "./react-app.js";
import ErrorBoundary from "./ErrorBoundary.js";

// React and ReactDOM are available globally via the UMD scripts in index.html
const { createElement } = React;
const { createRoot } = ReactDOM;

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  createElement(
    ErrorBoundary,
    null,
    createElement(App)
  )
);
