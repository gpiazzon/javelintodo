import App from './react-app.js';
import ErrorBoundary from './ErrorBoundary.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  React.createElement(ErrorBoundary, null, React.createElement(App))
);
