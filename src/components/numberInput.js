import * as React from 'react';
import { View, Text, TouchableWithoutFeedback, TextInput } from "react-native";

const NumberInput = ({num, enableTextInput=false, editable=true, onChangeFunc = function(){}}) => {
  const updateText= (value)=>{
    if(editable) onChangeFunc(value)
  }
  return (
    <View className='flex flex-row rounded-xl mx-1 shadow-l bg-shiro h-full'>
      <View className={(editable ? 'bg-accent ': 'bg-grey ') + 'basis-1/3 rounded-l-xl align-middle'}>
        <TouchableWithoutFeedback onPress={() => updateText('minus')}>
          <Text className="text-xl text-shiro text-center font-black my-auto">-</Text>
        </TouchableWithoutFeedback>
      </View>
      <View className={(editable ? 'border-accent ': 'border-grey ')+ 'basis-1/3 border-2' }>
        <TextInput
          className='text-kuro h-[50px] text-center text-l font-semibold my-auto'
          keyboardType='numeric'
          onChangeText={(text)=> updateText(text)}
          value={num.toString()}
          editable={enableTextInput && editable}
        />
          { /*<Text className="text-l text-kuro text-center font-semibold my-auto">{num}</Text>*/}
      </View>
      <View className={(editable ? 'bg-accent ': 'bg-grey ') + 'basis-1/3 rounded-r-xl align-middle'}>
        <TouchableWithoutFeedback onPress={() => updateText('plus')}>
          <Text className="text-xl text-shiro text-center font-black my-auto">+</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default NumberInput