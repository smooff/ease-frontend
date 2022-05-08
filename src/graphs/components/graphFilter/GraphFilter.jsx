import React from 'react';
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import {useRecoilState} from "recoil";
import {GraphColorsState} from "../../state/graphColorsState/GraphColorsState";

const GraphFilter = (props) => {

    const useStyles = makeStyles(() => ({
        dropDownStyles: {
            marginLeft: "0px",
            maxWidth: "95%",
            marginTop: "10px"
        },
        secondDropDown: {
            marginRight: "600px",
        },
        eachDropDownBackground: {
            backgroundColor: "rgba(0, 0, 0, .1)"
        }
    }));
    const classes = useStyles();

    //zmena connector typu
    const [connectorType, setConnectorType] = React.useState('');
    const handleConnectorType = (event) => {
        setConnectorType(event.target.value);
        props.changeConnectorType(event.target.value);
    };

    //data s hranami a ich farbami (ziskane pri init fetch mainpage)
    const [colorsState,] = useRecoilState(GraphColorsState);

    const connectorSet = new Set();
    Array.prototype.forEach.call(colorsState, x => {
        for (var a in x) {
            if (a === 'connectorType') {
                var b = x[a];
                for (var c in b) {
                    connectorSet.add(JSON.stringify({title: c}))
                }
            }
        }
    });
    const formattedSet = [...connectorSet].map(item => {
        if (typeof item === 'string') return JSON.parse(item);
        else if (typeof item === 'object') return item;
    });

    return (<Grid container className={classes.dropDownStyles}>
        <Grid item xs={2} className={classes.eachDropDownBackground}>
            <FormControl fullWidth>
                <InputLabel>Typ</InputLabel>
                <Select
                    value={connectorType}
                    onChange={handleConnectorType}
                >
                    <MenuItem key={"nefiltrovat"} value={''}>
                        <em>Nefiltrovať</em>
                    </MenuItem>
                    {formattedSet.map((c) => (
                        <MenuItem key={c.title} value={c.title}>{c.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    </Grid>);
}

export default GraphFilter;
