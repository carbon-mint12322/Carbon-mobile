import React from 'react';
import { Text,View,StyleSheet } from 'react-native';

export default function NoDataComponent({message,icon,textWeight}) {
  return (
    <View style={styles.container}>
        <>{icon}</>
        {(<Text style={{fontWeight:textWeight || '400'}}>{message}</Text>)}
    </View>  
  )
}

const styles=StyleSheet.create({
   container:{
    alignItems:'center',
    marginTop:50
   }
})
