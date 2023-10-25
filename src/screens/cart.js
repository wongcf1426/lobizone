import * as React from 'react';
import { View, Text, WebView } from "react-native";
import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';

import { testing } from '../controller/productController';
import * as store from '../../store';
const Home = () => {
	//testing();

	const testData = [
		{id:1, name:'明信片（款A）', price:10, 'description':'postcard', thumbnail:'https://media.istockphoto.com/id/828156368/de/foto/demo.jpg?s=612x612&w=0&k=20&c=jT1TzYO-5XJYjUByI-G12oATtB6yO8QXcm1iesvlKTA='},
		{id:2, name:'明信片（款B）', price:15, 'description':'B4 size', thumbnail:'https://www.shutterstock.com/image-photo/word-demo-appearing-behind-torn-260nw-1782295403.jpg'},
		{id:3, name:'貼紙', price:30, 'description':'', thumbnail:'https://static.wixstatic.com/media/ed70df_b5f46dcbb55f49b2bb27550accacca05~mv2.jpg/v1/fill/w_640,h_478,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/ed70df_b5f46dcbb55f49b2bb27550accacca05~mv2.jpg'},
		{id:4, name:'貼紙（小）', price:25, 'description':'7x7cm', thumbnail:'https://mydeermoon.com/cdn/shop/files/image_fd85722f-d5bd-416e-98b8-67f0ce5f92b4.png?v=1692945697'},
		{id:5, name:'加購', price:1, 'description':'', thumbnail:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppnVRGfKkfeXXBHZxfR-2bdiQ4mLofWwrgQ&usqp=CAU'}
	]
	return (
		<View className={(store.device !== 'mobile' ? 'w-full pl-[4rem] absolute right-0 ' : 'w-full ') + 'bg-auxiliary h-full'}>
			<View className='w-full h-full'>
				<View className="py-8 px-6 h-5/6 w-full">
					<View className="grid grid-cols-12 gap-6 pb-5">
						<View className="col-span-12 bg-primary shadow-lg p-8 rounded-xl" >
							<View className="sm:pr-8">
								<Text className="text-shiro text-xl font-bold"></Text>
							</View>
						</View>
					</View>
					<View className="grid grid-cols-12 gap-6 pb-5">
						{testData.map(function(itemData, i){
							return <ItemBox data={itemData} key={i}/>;
						})}
					</View>
				</View>
			</View>
			<Navigation currentScreen='Cart'/>
		</View>
	)
}

export default Home