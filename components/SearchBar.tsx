import { View, Text, Image, TextInput, TextInputProps } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

interface Props extends TextInputProps {
  placeholder: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  value?: string;
}
+9
const SearchBar = ({ onPress, placeholder, value, onChangeText, ...rest }: Props) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
      <Image 
        source={icons.search}
        className='size-5'
        resizeMode='contain'
        tintColor='#ab8bff'
      />
      <TextInput 
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor='#a8b5db'
        className='flex-1 ml-2 text-white'
        {...rest}
      />
    </View>
  )
}

export default SearchBar