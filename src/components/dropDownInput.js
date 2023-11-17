import * as React from 'react';
import { View, Text, TouchableWithoutFeedback, TextInput } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

const DropDownInput = ({selectedObj, labelField, optionList, editable=true, onChangeFunc = function(){}}) => {
  const updateValue= (value)=>{
    onChangeFunc(value)
  }
  return (
    <View className={(editable ? 'bg-shiro border-auxiliary ':'bg-grey border-grey ') + 'rounded-xl text-l text-kuro h-[50px] border-2 p-2  flex flex-row justify-between'} >
      <View className="justify-center"><Text>{selectedObj[labelField]}</Text></View>
      <View className="justify-center"><Text><MaterialIcons name='arrow-drop-down' size={26}/></Text></View>
    </View>
  );
};

export default DropDownInput