import { AppRegistry } from 'react-native';
import ShareExtension from './ShareExtension';

const globalErrorHandler = (error, isFatal) => {
	console.error('SHARE EXTENSION GLOBAL ERROR:', error);
	console.error('Is Fatal:', isFatal);
	// In a real app, you might want to log this to an external service
	// Depending on the error, you might want to try and dismiss the extension
	// import { ShareMenuReactView } from 'react-native-share-menu';
	// ShareMenuReactView.dismissExtension('Error occurred'); // Example, use cautiously
};

ErrorUtils.setGlobalHandler(globalErrorHandler);

AppRegistry.registerComponent('ShareMenuModuleComponent', () => ShareExtension);
