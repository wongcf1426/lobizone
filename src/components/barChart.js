import * as React from 'react';
import { View, Text } from "react-native";

import * as store from '../../store';

const BarChart = ({chartData, field}) => {
	const maximum = parseInt(Math.max.apply(Math, chartData.map(function(o) { return o[field]; })))
	const BarChartData = chartData.map((itemData, index) => ({
		name: itemData.name,
		value: itemData[field],
		width: parseInt((parseInt(itemData[field])/maximum)*100),
		bgColor:store.chartPalette[index]
	}))

	return (
		<>
			<View className="py-2 flex flex-row flex-wrap">
				<View className='flex flex-row flex-wrap' >
				{BarChartData.map(function(item, i){
					if(item.value > 0)
					{
						let styles = {
							backgroundColor: item.bgColor,
							width:item.width+'%'
						};
						return (
							<View className="basis-full flex flex-row my-1" key={i}>
								<View className="basis-1/6">
									<Text>{item.name}</Text>
								</View>
								<View className="basis-4/6 flex flex-row ">
									<View className='h-[30px]' style={[styles]}></View>
								</View>
								<View className="basis-1/6">
									<Text>{item.value}</Text>
								</View>
							</View>
						);
					}

				})}
				</View>
			</View>
		</>
	)
}



export default BarChart;