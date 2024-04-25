import axios from 'axios';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Text } from 'react-native'
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Slider } from '@miblanchard/react-native-slider';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'react-native-toast-message/lib/src/Toast';


function Button(props) {
    <TouchableOpacity style={props.btnStyle} title={props.title} onPress={props.onPress}>
        <Text style={props.textStyle}>{props.title}</Text>
    </TouchableOpacity>
}

// import { colors } from '../constants/colors'
// import { GOOGLE } from '../constants/google';
const colors = {
    disableGreen: 'gray',
    green: 'green',
    white: 'white',
    red: 'red'
}
export default function Player(props) {
    const [sound, setSound] = useState();
    const [soundLoaded, setSoundLoaded] = useState(false)
    // const [img, setImg] = useState(require('../assets/idk.png'))
    const [repeat, setRepeat] = useState(false)
    const [repeatBtnColor, setRepeatBtnColor] = useState(colors.disableGreen)
    const [sliderValue, setSliderValue] = useState(0)
    const [currentPosition, setCurrentPosition] = useState(0)
    const [maxSeconds, setMaxSeconds] = useState(1)
    const [startPlay, setStartPlay] = useState(false)
    const [stopPlay, setStopPlay] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isCounting, setIsCounting] = useState(false)

    const iterationConstant = 50 // value between 50 to 1000

    const playSound = async (currentPosition = 0) => {
        // await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        // const { sound } = await Audio.Sound.createAsync({ uri: props.uri });
        // await sound.setIsLoopingAsync(repeat)
        // sound.playAsync();
        // setSound(sound);
        if(sound) {
            await sound.setStatusAsync({ positionMillis: currentPosition * iterationConstant })
            await sound.playAsync();
        }
    }
    
    const loadSound = async (uri) => {
        try{
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync({ uri: uri });
            const secc = await sound.getStatusAsync()
            console.log(secc.durationMillis)
            setMaxSeconds(secc.durationMillis/iterationConstant)
            await sound.setIsLoopingAsync(repeat)
            setSound(sound);
            setSoundLoaded(true)
            console.log("Sound Loaded")
        }catch(e){
            console.log(e?.message)
        }
    }

    useEffect(() => {
        console.log("URI", props.uri)
        if(props.uri){
            loadSound(props.uri)
        }
    }, [props.uri])

    useEffect(() => {
        setCurrentPosition(props.currentPosition)
    }, [props.currentPosition])

    useEffect(() => {
        if (currentPosition > 0) {
            updateStatus(currentPosition)
        }
    }, [currentPosition])


    const updateStatus = (currentPosition) => {
        sound && sound.setStatusAsync({ positionMillis: currentPosition * iterationConstant })
    }

    const stopSound = async () => {
        await sound.pauseAsync()
        let status = await sound.getStatusAsync()
        setCurrentPosition(status.positionMillis/iterationConstant)
        // await sound.unloadAsync();
    }

    const repeatSound = async () => {
        setRepeatBtnColor(repeatBtnColor === colors.disableGreen ? colors.green : colors.disableGreen)
        setRepeat(repeat === false ? true : false)
    }

    const getCoverImage = async () => {
        // try{
        //   let r = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE.API}&cx=${GOOGLE.CX}&q=${encodeURIComponent(props.name)}&searchType=image&fileType=jpg&imgSize=large&alt=json`)
        //   setImg({uri: r.data.items[0].link})  
        // } catch (e) {
        //     console.error(e)
        // }    
    }

    useEffect(() => {
        getCoverImage()
    }, [props.name])

    useEffect(() => {
        if (startPlay) {
            playSound(currentPosition)
        }
    }, [startPlay])

    // useEffect(() => {
    //     if (stopPlay) {
    //         stopSound()
    //     }
    // }, [stopPlay])

    // useEffect(() => {
    //     return sound
    //         ? () => {
    //             sound.unloadAsync();
    //         }
    //         : undefined;
    // }, [sound]);
    // sound && sound.getStatusAsync()
    // .then((res) => {
    //     console.log(res)
    // })
    


    useEffect(() => {
        if (isCounting) {
            const secInt = setInterval(() => {
                setSliderValue((prevValue) => {
                    if (prevValue < maxSeconds) { return (Number.parseInt(prevValue) + 1) } else {
                        setStopPlay(true)
                        setStartPlay(false)
                        setIsPlaying(false)
                        setIsCounting(false)
                        setCurrentPosition(0)
                        return 0
                    }
                })
            }, iterationConstant)
            return () => clearInterval(secInt)
        }
    }, [isCounting])



    return (
        <View style={styles.container} >

            {(!isPlaying) ? (<TouchableOpacity onPress={() => { 
                if(soundLoaded){
                    setStartPlay(true);
                    setStopPlay(false);
                    setIsPlaying(true);
                    setIsCounting(true)
                }else{
                    Toast.show({
                        type: 'error',
                        text2: 'Unable to load the audio.'
                    })
                }
             }} >
                <Ionicons name='play-circle-outline' size={24} style={styles.microphoneIcon} />
            </TouchableOpacity>)
                :
                (<TouchableOpacity onPress={() => { setStopPlay(true); stopSound(); setStartPlay(false); setIsPlaying(false); setIsCounting(false) }} >
                    <Ionicons name='stop-circle-outline' style={styles.microphoneIcon} size={24} />
                </TouchableOpacity>)}

            <View style={styles.sliderContainer} >

            <Slider
                minimumValue={0}
                maximumValue={maxSeconds}
                value={sliderValue}
                onValueChange={value => { setSliderValue(value); setCurrentPosition(value) }}
                style={styles.slider}
                minimumTrackTintColor={colors.black}
                maximumTrackTintColor={colors.gray}
                onSlidingStart={() => setIsCounting(false)}
                onSlidingComplete={(value) => { setCurrentPosition(parseInt(value)); setStartPlay(true); setStopPlay(false); setIsPlaying(true); setIsCounting(true); }}
                thumbStyle={{
                    width: 10,
                    height: 10
                }}
            />
            </View>


            {/* <Image
            style={styles.img}
            source={img}/> */}
            {/* <Text>Hello I am frmo payer</Text>
        <TouchableOpacity style={styles.playBtn} onPress={playSound}>
            <Text>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playBtn} onPress={stopSound}>
            <Text>Stop</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.playBtn} onPress={repeatSound}>
            <Text>Repeat</Text>
        </TouchableOpacity>
        <Button 
            title='Play'
            onPress={playSound}
            btnStyle={styles.playBtn}
            textStyle={styles.textPlay}/>

        <View style={styles.smallBtns}>
            <Button 
                title='Stop'
                onPress={stopSound}
                btnStyle={styles.stopBtn}
                textStyle={styles.smallBtnText}/>
            <Button 
                title='Repeat'
                onPress={repeatSound}
                btnStyle={{...styles.repeatBtn,  backgroundColor: repeatBtnColor}}
                textStyle={styles.smallBtnText}/>
        </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    microphoneIcon:{
        marginEnd: 12
    },
    sliderContainer: {
        // height: "70%",
        width: "80%",
    },
    container:{
        display: 'flex',
        flexDirection: 'row',
        width: "100%",
        alignItems: "center"
    },
    songCard: {
        padding: 10,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        width: Dimensions.get("window").width * 0.8,
        height: Dimensions.get("window").width * 0.8,
        borderRadius: 10,
    },
    playBtn: {
        marginTop: 40,
        padding: 20,
        borderRadius: 10,
        margin: 10,
        width: Dimensions.get("window").width * 0.8,
        textAlign: 'center',
        backgroundColor: colors.green,
        height: 100,
        width: 100
    },
    textPlay:{
        color: colors.white,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 20,
    },
    smallBtnText:{
        padding: 20,
        fontSize: 15,
        color: colors.white,
        textAlign: 'center',
    },
    smallBtns:{
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    stopBtn:{
        backgroundColor: colors.red,
        margin: 10,
        width: Dimensions.get("window").width * 0.38,
        borderRadius: 10,
    },
    repeatBtn:{
        margin: 10,
        width: Dimensions.get("window").width * 0.38,
        borderRadius: 10,
    }
})