import config from '../config/app.config'

const defaultColors = {
    primary: '#2B9348',
    primaryTransparent: '#2B934844',
    black: '#363537',
    gray: '#79787A',
    white: '#F9F9F9',
    red: '#EF2D56',
    whitebg: '#E8F7E1',
    greenGoogle: '#173D07',
    grayBorders: '#BCBCBC',
    screenBg: '#f2f2f2',
    darkBlack: '#111111',
    darkGray: '#EFEFF0',
    lightGray: '#585758',
    borderGray: '#DEE6DB',
    orange: '#FF8F00',
    borderColor: '#EAEAEB',
    properBlack: '#000000',
    properWhite: '#ffffff',
    placeholder: '#D7D7D7',
    ligtGreen: '#F3FAF0',
    cardText: '#555555',
    lightRed: '#FAEEEB',
    redBorder: '#FFC9B9',
    lightText: '#585758',
    lightGreen : '#EBFAEF',
    greenBorder: '#D5E9DA',
    // orange: '#ED7D3A',
}

let colors = defaultColors

if(config?.theme?.colors) {
    for(let key in config?.theme?.colors) {
        if(config?.theme?.colors?.[key]) {
            colors[key] = config?.theme?.colors?.[key]
        }
    }
}

export default colors