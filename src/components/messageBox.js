import * as React from 'react';
import {View, Text, Modal } from "react-native";
import * as store from '../../store';

const MessageBox = (props, ref) => {
  const [display, setDisplay] = React.useState(false);
	const [message, setMessage] = React.useState('');
	const [boxClass, setBoxClass] = React.useState('');

  React.useImperativeHandle(ref, () => ({
		open: (msg, style) => { displayMessageBox(msg, style) },
	}))

  const displayMessageBox = async (msg, style) => {
    setMessage(msg)
    setBoxClass(style)
    setDisplay(true)
    setTimeout(() => {
      setDisplay(false)
    }, 1500);
	}

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={display}
       >
    <View className={'absolute w-[88%] h-[30px] mx-[6%] justify-center rounded-xl z-[999] top-3 ' + boxClass}>
      <View className="px-3"><Text className="text-shiro font-bold">{message}</Text></View>
    </View>
    </Modal>
  )
}

export default React.forwardRef(MessageBox)