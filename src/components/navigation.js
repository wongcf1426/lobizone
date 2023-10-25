import * as React from 'react';
import { Text, View, TouchableWithoutFeedback, Animated, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import * as store from '../../store';

const Navigation = () => {
  const [isexpandSideNav, setexpandSideNav] = React.useState(false);
  const animation = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, 1];
  const outputRange = [store.windowWidth*-4/6, 0]
  const animatedWidth = animation.interpolate({inputRange, outputRange});
  const styles= {
    transform:[{translateX: animatedWidth}],
  };
  const toggleAnimation=()=>{
    if(isexpandSideNav){
      Animated.timing(animation, {
        toValue : 0,
        duration : 300,
        useNativeDriver: false,
      }).start(()=>{
        setexpandSideNav(false)
      });
    }
    else
    {
      setexpandSideNav(true)
      Animated.timing(animation, {
        toValue : 1,
        duration : 300,
        useNativeDriver: false,
      }).start();
    }
  }

  const SideNavItem = ({icon, landing}) =>{
    return(
      <TouchableWithoutFeedback onPress={() => store.navigate(landing)}>
        <View className="justify-center px-2 py-3 relative group w-full hover:bg-primary">
            <Text className={(store.platformOS != 'web' && !isexpandSideNav ? 'hidden ': '')+"text-shiro w-full"}>
              <MaterialIcons name={icon} size={24}/>
              <Text className="text-shiro text-lg font-bold float-right">{icon}</Text>
            </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function SideNav() {
    return(
      <TouchableWithoutFeedback  onPress={toggleAnimation}>
        <View className={
          (store.platformOS == 'web' ? 'fixed w-1/6 ' :(isexpandSideNav) ? 'absolute w-full ' : 'w-0 ') +
          'left-0 top-0 h-full bg-dark/70 z-20 flex'
          }
        >
          <Animated.View style={(store.platformOS == 'web' ? [{height:"100%"}]: [styles])}>
            <View className={(store.platformOS == 'web' ? 'w-full ': 'w-4/6 ') + 'bg-accent h-full flex flex-col justify-between'}>
              <View className="top-3 w-full">
                  <View className="px-4 py-3 w-full h-24" >
                    <View className="w-10 h-10 bg-shiro rounded-lg "></View>
                    <Text className="text-shiro text-lg font-bold"></Text>
                    <Text className="text-shiro text-m">other information here</Text>
                  </View>
                <View>
                  <View className="flex flex-col p-2">
                    <View className="pt-4 space-y-1 border-t border-shiro">
                      <SideNavItem icon="dashboard" landing="Home"/>
                      <SideNavItem icon="view-list" landing="List"/>
                    </View>
                  </View>
                </View>
              </View>
              <View className="bottom-0 w-full bg-dark">
                <View className="pl-3 py-2 text-sm">
                  <TouchableWithoutFeedback>
                    <Text className="text-auxiliary"><MaterialIcons name="settings" size={32} /></Text>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function BottomNav() {
    return(
      <View className="absolute w-full bg-primary bottom-0 z-10">
        <View className="px-8 pb-2 pt-6 flex-row grow gap-4 justify-between">
          <TouchableWithoutFeedback onPress={toggleAnimation}>
            <View className="block w-8 h-8 bg-shiro rounded-lg"></View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Text className="text-auxiliary"><MaterialIcons name="search" size={32} /></Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Text className="text-auxiliary"><MaterialIcons name="home" size={32} /></Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Text className="text-auxiliary"><MaterialIcons name="bookmarks" size={32} /></Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Text className="text-auxiliary"><MaterialIcons name="comment" size={32} /></Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  return (
    <>
      <SideNav />
      {store.platformOS != 'web' && <BottomNav />}
    </>
  )
}

export default Navigation