import * as React from 'react';
import { View, Text, TouchableWithoutFeedback } from "react-native";

const Pagination = ({currPage, totalPages, onPressFunc = function(){}}) => {

	const buildPageArray = (currPage, totalPages) =>{
		let pageArray = [], i = 1;

		while (i <= totalPages) {
		  if (i <= 2 ||
			  i >= totalPages - 1 ||
			  i >= currPage - 1 && i <= currPage + 1) {
			pageArray.push(i);
			i++;
		  } else {
			pageArray.push('...');
			i = i < currPage ? currPage - 1 : totalPages - 1;
		  }
		}
		return pageArray;

	}
	const handlePress = async (value) => {
		if(value != '...' && value !='currPage') await onPressFunc(value);
    }
	return (
	  <View className="w-full h-[30px] mt-[10px] z-[80]">
		<View className="flex-row gap-4 justify-around w-full">
			{
				buildPageArray(currPage, totalPages).map(function(pagemark, i){
					return (
						<TouchableWithoutFeedback key={i} onPress={()=>{handlePress(pagemark)}}>
							<View className={(pagemark == currPage ? 'bg-auxiliary border-auxiliary border-2  ' : 'bg-shiro ') + 'rounded-full overflow-hide w-[22px] h-[22px]'}><Text className='text-center'>{pagemark}</Text></View>
						</TouchableWithoutFeedback>
					);
				})
			}
		</View>
	  </View>
	);
};

export default Pagination