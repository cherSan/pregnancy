import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { name as appName } from './app.json';
import { Application } from './src/application.component';

enableScreens(true);

AppRegistry.registerComponent(appName, () => Application);
