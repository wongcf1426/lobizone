import React from "react";
import { StyleSheet, View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as store from './store';
import Constants from "expo-constants";

import { StatusBar } from 'expo-status-bar';

import Home from './src/screens/home';
import List from './src/screens/list';

import "./styles";

const Stack = createNativeStackNavigator()
export default function App() {
  //const [currentUser, setCurrentUser] = React.useState({state:true, id:2, name: 'testing'});
  return (
      <View className="w-full overflow-x-hidden" style={[styles.screen]}>
        <StatusBar style="dark" />
        <NavigationContainer ref={store.navigationRef}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animationTypeForReplace: 'push',
              animation: 'slide_from_right'
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="List" component={List} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
  );
}
const styles = StyleSheet.create({
  screen: {
      paddingTop: Constants.statusBarHeight,
      flex: 1
  }
});