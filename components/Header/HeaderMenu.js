import { View, Image, Text } from 'react-native';
import Menu, {
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers,
} from 'react-native-popup-menu';
import common from '../../styles/common';
import ProfilePicName from '../ProfilePicName';

const { Popover } = renderers;
export default function HeaderMenu({ image, options = [], firstName, lastName, triggerComponent }) {
    return (
        <Menu renderer={Popover} rendererProps={{ placement: 'bottom', anchorStyle: { display: 'none' } }} >
            <MenuTrigger style={{}}>
                {
                    triggerComponent ||
                    (
                        image ?
                            <View style={{}}>
                                <Image style={common.profilePic} resizeMode={'cover'} source={image ? { uri: image } : require('../../assets/profile.png')} />
                            </View>
                            :
                            <ProfilePicName isAtNavbar={true} firstName={firstName} lastName={lastName} />
                    )
                }
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={{ borderRadius: 9, minWidth: 150, marginTop: 15, marginRight: 15 }}>
                {options.map((option, key) => (
                    <MenuOption key={key} value={1} onSelect={option.onSelect || (() => { })}>
                        {option.element}
                    </MenuOption>
                ))}
            </MenuOptions>
        </Menu>
    )
}