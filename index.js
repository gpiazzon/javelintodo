// React and ReactDOM are available globally from the UMD scripts in index.html
const { createElement } = React;
const { createRoot } = ReactDOM;

const container = document.getElementById("root");
const root = createRoot(container);

// Render App wrapped in ErrorBoundary
root.render(
  createElement(
    window.ErrorBoundary || React.Fragment, // fallback if ErrorBoundary missing
    null,
    createElement(window.App)
  )
);
