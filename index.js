// index.js - mounts the App with ErrorBoundary using global React
const { createElement } = React;
const { createRoot } = ReactDOM;

const container = document.getElementById("root");
const root = createRoot(container);

const App = window.App || function () {
  return createElement("div", null, "App not found");
};
const Boundary = window.ErrorBoundary || React.Fragment;

root.render(createElement(Boundary, null, createElement(App)));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}

