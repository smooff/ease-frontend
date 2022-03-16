import {atom} from "recoil";

//vyuziva sa na prenos stringu z history drawera do search fieldu
export const SearchHistoryString  = atom({
    key: 'SearchHistoryString',
    default: '',
});
