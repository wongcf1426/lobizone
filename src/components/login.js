import * as React from 'react';
import { Text, View, TextInput, TouchableWithoutFeedback } from "react-native";

import * as store from '../../store';

import LoadingBar from '../components/loadingBar';
import { userLogin } from '../controller/UserController';

const Login = () => {
  const [isLoading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState('ritawcf');
  const [password, setPassword] = React.useState('123456');

  const { currentUser, setCurrentUser } = React.useContext(store.UserContext);

  const login =async()=>{
		setLoading(true)
		let loginResult = await userLogin(username, password)
    if(loginResult.state == 'success') {
      setCurrentUser(loginResult.data);
    }else{
      alert('fail to login')
    }
		setLoading(false)
	}

  return (
    <View className={(currentUser.state ? 'hidden' : 'bg-auxiliary h-full z-30')}>
      <View className='w-full h-full'>
      {isLoading && <LoadingBar loading={isLoading}/>}
        <View className="py-8 px-6 h-full">
            <View className="h-full grid grid-cols-12 gap-6 place-items-center">
              <View className={(store.platformOS == 'web' ? 'w-1/3 ' : 'w-5/6') + 'col-span-12'}>
                <View className="bg-primary shadow-lg py-6 px-8 rounded-t-xl" >
                  {/*<Text className="text-center text-auxiliary text-2xl font-bold">&lt;Lobizone /&gt;</Text>*/}
                  <Text className="text-center text-auxiliary text-2xl font-bold">&lt;LegalFlyer/&gt;</Text>
                  <Text className="text-center text-auxiliary text-l font-bold">-susume-</Text>
                </View>
                <View className="bg-shiro shadow-lg p-8 rounded-b-xl" >
                  <View className="p-2">
                    <Text className="text-primary text-xl font-bold">UserName</Text>
                    <TextInput
                      className="shadow rounded w-full py-2 px-3 bg-gray-200 text-dark text-lg border-solid border-2 border-gray-200 focus:border-primary focus:outline-none"
                      onChangeText={newText => setUsername(newText)}
                      defaultValue={username}
                    />
                  </View>
                  <View className="p-2">
                    <Text className="text-primary text-xl font-bold">Password</Text>
                    <TextInput
                      name='bar'
                      className="shadow rounded w-full py-2 px-3 bg-gray-200 text-dark text-lg border-solid border-2 border-gray-200 focus:border-primary focus:outline-none"
                      onChangeText={newText => setPassword(newText)}
                      defaultValue={password}
                      secureTextEntry={true}
                    />
                  </View>
                  <View className="p-2 pt-6 place-items-center">
                    <TouchableWithoutFeedback onPress={login}>
                      <View className={(store.platformOS == 'web' ? ' w-1/4 ' : 'w-1/2') + 'cursor-pointer bg-primary shadow-lg p-3 rounded-2xl'}>
                        <Text className="text-center text-auxiliary text-xl font-bold">Login</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </View>
        </View>
      </View>
    </View>
  )
}

export default Login