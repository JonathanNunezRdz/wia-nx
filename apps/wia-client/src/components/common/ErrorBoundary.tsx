import { Component } from 'react';

type ErrorBoundaryProps = {
	fallback: React.ReactNode;
	children: React.ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

export default class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps | Readonly<ErrorBoundaryProps>) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static getDerivedStateFromError(_error: any) {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		console.log({ error, errorInfo });
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}

		return this.props.children;
	}
}
