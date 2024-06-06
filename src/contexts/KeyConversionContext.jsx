import { createContext } from 'react'
export const KeyConversionContext = createContext({});

const majorKeyConversions = {
    0: ['C ', '8B'],
    1: ['C#', '3B'],
    2: ['D', '10B'],
    3: ['E♭', '5B'], // D# > E♭
    4: ['E', '12B'],
    5: ['F', '7B'],
    6: ['F#', '2B'],
    7: ['G', '9B'],
    8: ['A♭', '4B'], // G# > A♭
    9: ['A', '11B'],
    10: ['B♭', '6B'], // A# > B♭
    11: ['B', '1B']
}

const minorKeyConversions = {
    0: ['C', '5A'],
    1: ['C#', '12A'], // D♭ > C#
    2: ['D', '7A'],
    3: ['E♭', '2A'],
    4: ['E', '9A'],
    5: ['F', '4A'],
    6: ['F#', '11A'], // G♭ > F#
    7: ['G', '6A'],
    8: ['A♭', '1A'],
    9: ['A', '8A'],
    10: ['B♭', '3A'],
    11: ['B', '10A']
}

export const convertToKey = (keyModeArr) => {
    if(keyModeArr[1] === 1) {
        return `${majorKeyConversions[keyModeArr[0]][0]} Major`;
    } else {
        return `${minorKeyConversions[keyModeArr[0]][0]} Minor`;
    }
}

export const convertToCamelotKey = (keyModeArr) => {
    if(keyModeArr[1] === 1) {
        return majorKeyConversions[keyModeArr[0]][1];
    } else {
        return minorKeyConversions[keyModeArr[0]][1];
    }
}

export const compareCamelotKey = (key1, key2) => {
    const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let [num1, letter1] = key1.match(/\D+|\d+/g);
    num1 = parseInt(num1);
    let [num2, letter2] = key2.match(/\D+|\d+/g);
    num2 = parseInt(num2);

    if(letter1 === letter2) {
        for(let i = -1; i < 3; i++) { 
            const match = (num[(num1 + i + num.length - 1) % num.length] === num2);
            if(i === -1 && match) return 'Minus One';
            if(i === 0 && match) return 'Perfect';
            if(i === 1 && match) return 'Plus One';
            if(i === 2 && match) return 'Plus Two';
        }
        return 'No Match'
    } else {
        if(num1 === num2) return 'Scale Change';
        // Diagonal mix: minor
        if(letter1 === 'B') {
            if(num[(num1 + 1 + num.length -1) % num.length] === num2) return 'Diagonal';
        } else if(letter1 === 'A') {
            if(num[(num1 -1 + num.length - 1) % num.length] === num2) return 'Diagonal';
        }
        return 'No Match'
    }
}