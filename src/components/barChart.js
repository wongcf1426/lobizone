import * as React from 'react';
import { View, Text } from "react-native";

import * as store from '../../store';

const BarChart = ({chartData, field}) => {
	const maximum = parseInt(Math.max.apply(Math, chartData.map(function(o) { return o[field]; })))
	const BarChartData = chartData.map((itemData, index) => ({
		name: itemData.name,
		value: itemData[field],
		percent: parseInt((parseInt(itemData[field])/maximum)*100),
		bgColor:store.chartPalette[index]
	}))

	return (
		<>
			<View className="py-2 flex flex-row flex-wrap">
				<View className='flex flex-row flex-wrap border-b-2 border-grey' >
				{BarChartData.map(function(item, i){
					let styles = {
						backgroundColor: item.bgColor,
						height:item.percent+'%'
					};
					return (
						<View className="basis-1/6 flex flex-row h-[10vh] items-end px-1" key={i}>
							<View className='w-[80%]' style={[styles]}></View>

						</View>
					);
				})}
				</View>
				<View className='flex flex-row flex-wrap pt-3' >
				{BarChartData.map(function(item, i){
					let styles = {
						backgroundColor: item.bgColor,
					};
					return (
						<View className="basis-full md:basis-1/2 flex flex-row my-0.5" key={i}>
							<View className={'h-[15px] w-[15px] align-middle h-auto '} style={[styles]}>
							</View>
							<View className='pl-2 w-[80%] text-center flex flex-row overflow-visible'>
								<Text className="text-kuro text-m">{item.name}</Text><Text className="text-kuro text-m font-semibold">: {item.value}</Text>
							</View>
						</View>
					);
				})}
				</View>
			</View>
		</>
	)
}



export default BarChart;