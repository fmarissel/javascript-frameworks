import React from 'react';
import {COLOR} from "./constants";

const HelpContext = React.createContext({
    enabled: false,
    next: COLOR.BLACK,
    toggle: () => {
    },
    isValidSquare: () => {
    }
});

export default HelpContext;