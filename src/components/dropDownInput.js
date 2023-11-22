import * as React from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

const DropDownInput = ({selectedObj, labelField, optionList, editable=true, onChangeFunc = function(){}}) => {
  const [dropDown, setDropDown] = React.useState(false);

  const updateValue= (value)=>{
    let tmp = value
    tmp[labelField] = value.labelField
    delete value.labelField
    onChangeFunc(tmp)
    setDropDown(false)
  }
  const toggleDropdown= ()=>{
    if(editable) setDropDown(!dropDown)
  }

  React.useEffect(() => {
    setDropDown(false);
  }, []);
  return (
    <View className="relative">
      <TouchableWithoutFeedback onPress={() => toggleDropdown()}>
        <View className={(editable ? 'bg-shiro border-auxiliary ':'bg-grey border-grey ') + (dropDown ? 'rounded-t-xl ' : 'rounded-xl ') + 'text-l text-kuro h-[50px] border-2 p-2  flex flex-row justify-between'} >
          <View className="justify-center"><Text>{selectedObj[labelField]}</Text></View>
          <View className="justify-center">
            <Text>
              {dropDown ?
                <MaterialIcons name='arrow-drop-up' size={26}/>:
                <MaterialIcons name='arrow-drop-down' size={26}/>
              }

            </Text>
          </View>

        </View>
      </TouchableWithoutFeedback>
      <View className={(dropDown && editable ? 'block ': 'hidden ')+'w-full h-[120px] bg-shiro absolute top-[48px] z-40  border-auxiliary border-2 border-t-0 rounded-b-xl shadow-l'}>
        <ScrollView>
          {
            optionList.map(function(option, i){
              return (
                <TouchableWithoutFeedback key ={i} onPress={() => updateValue({'id':option.id, 'labelField': option[labelField]})}>
                <View className={(option.id == selectedObj.id ? 'bg-auxiliary ' : 'bg-shiro ') +'px-4 py-3 w-[90%] mx-auto border-grey border-b border-dotted' }>
                  <Text className='text-kuro text-l'>{option[labelField]}</Text>
                </View>
                </TouchableWithoutFeedback>
                );
            })
          }
        </ScrollView>
      </View>
    </View>
  );
};

export default DropDownInput
