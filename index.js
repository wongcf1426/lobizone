//import { Provider } from 'react-redux'
import { registerRootComponent } from 'expo';

//import store from './store/store'
import App from './App'

export default function Main() {
  /*return (
      <Provider store={store}>
        <App />
      </Provider>
  );*/
  return (
      <App />
  );
}
registerRootComponent(Main);