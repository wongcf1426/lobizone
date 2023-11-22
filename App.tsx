import React from "react";
import { StyleSheet, View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as store from './store';
import Constants from "expo-constants";

import { StatusBar } from 'expo-status-bar';

import Cart from './src/screens/cart';
import Order from './src/screens/order';
import Item from './src/screens/item';
import Settings from './src/screens/settings';
import Stat from './src/screens/stat';
import EventLog from './src/screens/eventLog';
import Info from './src/screens/info';
import Category from './src/screens/category';

import "./styles";

const Stack = createNativeStackNavigator()
export default function App() {
  //const [currentUser, setCurrentUser] = React.useState({state:true, id:2, name: 'testing'});
  return (
      <View className="w-full h-full overflow-x-hidden overflow-y-hidden md:overflow-y-scroll" style={[styles.screen]}>
        <StatusBar style="dark" />
        <NavigationContainer ref={store.navigationRef}>
          <Stack.Navigator
            initialRouteName="Item"
            screenOptions={{
              headerShown: false,
              animation: 'none'
            }}
          >
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Item" component={Item} />
            <Stack.Screen name="Stat" component={Stat} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="EventLog" component={EventLog} />
            <Stack.Screen name="Info" component={Info} />
            <Stack.Screen name="Category" component={Category} />
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