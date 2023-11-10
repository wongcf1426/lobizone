import * as React from 'react';
import { Text, View, TouchableWithoutFeedback} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import * as store from '../../store';

const Navigation = props => {
  const SideNavItem = ({icon, landing}) =>{
    return(
      <TouchableWithoutFeedback onPress={() => store.navigate(landing)}>
        <View className={(props.currentScreen == landing ? 'bg-accent ': '')+"justify-center items-center py-2 relative group w-full hover:bg-accent rounded-xl"}>
            <Text className="text-shiro w-fit">
              <MaterialIcons name={icon} size={26}/>
            </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function SideNav() {
    return(
      <View className='w-16 h-full'>
          <View className='w-full bg-primary h-full flex flex-col justify-between'>
            <View className="top-3 w-full">
                <View className="items-center w-full h-10" >
                  <View className="w-10 h-10 bg-shiro rounded-lg"></View>
                </View>
                <View>
                  <View className="flex flex-col p-2">
                    <View className="pt-4 space-y-1 border-t border-shiro">
                      <SideNavItem icon="shopping-cart" landing="Cart"/>
                      <SideNavItem icon="receipt" landing="Order"/>
                      <SideNavItem icon="view-list" landing="Item"/>
                      <SideNavItem icon="bar-chart" landing="List"/>
                    </View>
                  </View>
              </View>
            </View>
            <View className="bottom-0 w-full bg-accent">
              <View className="items-center py-2 text-sm">
                <TouchableWithoutFeedback onPress={() => store.navigate('Info')}>
                  <Text className="text-shiro"><MaterialIcons name="info-outline" size={32} /></Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
      </View>
    );
  }

  const BottomNavItem = ({icon, landing}) =>{
    return(
      <TouchableWithoutFeedback onPress={() => store.navigate(landing)}>
        <View className={(props.currentScreen == landing ? 'bg-accent ': '') + "justify-center items-center rounded-xl h-[40px] w-[40px] my-auto"}>
            <Text className='text-shiro'>
              <MaterialIcons name={icon} size={28}/>
            </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  function BottomNav() {
    return(
      <View className="absolute w-full bg-primary bottom-0 z-10 h-[55px] px-6 pl-9">
        <View className="flex-row grow gap-4 justify-between h-full pt-2">
            <BottomNavItem icon="shopping-cart" landing="Cart"/>
            <BottomNavItem icon="receipt" landing="Order"/>
            <BottomNavItem icon="view-list" landing="Item"/>
            <BottomNavItem icon="bar-chart" landing="List"/>
            <BottomNavItem icon="info-outline" landing="Info"/>
        </View>
      </View>
    );
  }

  return (
    <>
      {store.device == 'mobile' ? <BottomNav /> : <SideNav />}
    </>
  )
}

export default Navigation