// ErrorBoundary.js (UMD-safe, no JSX, no imports/exports)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement("div", null, "Something went wrong.");
    }
    return this.props.children;
  }
}

// Expose globally
window.ErrorBoundary = ErrorBoundary;
