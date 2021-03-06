import React from 'react';
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";

const SearchFilter = (props) => {

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

    //auth
    const {authState, oktaAuth} = useOktaAuth();

    //request
    const config = {
        headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`}
    };

    //udrziava jednu hodnotu - ziskanu z druheho dropdownu po selecnuti hodnoty z prveho dropdownu a nasledneho requestu
    //tato hodnota sa ziska ako selected choice z dropdownu
    const [selectedDetailedType, setSelectedDetailedType] = React.useState('');
    const handleChangeSelectedDetailedType = (event) => {
        setSelectedDetailedType(event.target.value);
        if (entityType === "DIAGRAM") {
            props.changeDropDownDiagram(event.target.value);
            props.changeDropDownObject(null);
        } else if (entityType === "OBJECT") {
            props.changeDropDownObject(event.target.value);
            props.changeDropDownDiagram(null);
        }
    };

    //udrziava vsetky hodnoty, ktore sa nastavia po zmene entity
    //pouziva sa v dropdowne ako choices
    const [allDetailedTypes, setAllDetailedTypes] = React.useState('');

    const [entityType, setEntityType] = React.useState('');
    const handleChangeEntityType = (event) => {
        setSelectedDetailedType('');
        setEntityType(event.target.value);
        setAllDetailedTypes('');
        props.changeDropDownObject(null);
        props.changeDropDownDiagram(null);
        makeRequest(event.target.value);
        props.changeDropDownEntity(event.target.value);
    };

    const [descendingSort, setDescendingSort] = React.useState('');
    const handleChangeDescendingSort = (event) => {
        setDescendingSort(event.target.value);
        props.changeDescending(event.target.value);
    };

    const makeRequest = (entity) => {
        return axios.get(
            'https://tp2-ai.fei.stuba.sk:8080/core/search/filterContents',
            config
        ).then((res) => {
            if (entity === "DIAGRAM") {
                setAllDetailedTypes(res.data.diagramDetailedTypes);
            } else if (entity === "OBJECT") {
                setAllDetailedTypes(res.data.objectDetailedTypes);
            }
        }).catch(console.log);
    }

    return (<Grid container className={classes.dropDownStyles}>
        <Grid item xs={2} className={classes.eachDropDownBackground}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Zoradi??</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={descendingSort}
                    label="Age"
                    onChange={handleChangeDescendingSort}
                >
                    <MenuItem key={"Nezoradi??"} value={''}>
                        <em>Nezoradi??</em>
                    </MenuItem>
                    <MenuItem key={"Zostupne"} value={true}>Zostupne</MenuItem>
                    <MenuItem key={"Vzostupne"} value={false}>Vzostupne</MenuItem>
                </Select>
            </FormControl>
        </Grid>

        <Grid item xs={1}/>

        <Grid item xs={2}>
            <FormControl fullWidth className={classes.eachDropDownBackground}>
                <InputLabel id="demo-simple-select-label">Entita</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={entityType}
                    label="Age"
                    onChange={handleChangeEntityType}
                >
                    <MenuItem key={"nefiltrovat"} value={''}>
                        <em>Nefiltrova??</em>
                    </MenuItem>
                    <MenuItem key={"OBJECT"} value={"OBJECT"}>OBJECT</MenuItem>
                    <MenuItem key={"PACKAGE"} value={"PACKAGE"}>PACKAGE</MenuItem>
                    <MenuItem key={"DIAGRAM"} value={"DIAGRAM"}>DIAGRAM</MenuItem>
                </Select>
            </FormControl>
        </Grid>

        <Grid item xs={1}/>

        <Grid item xs={2}>
            {allDetailedTypes !== '' ?
                <FormControl fullWidth className={classes.eachDropDownBackground}>
                    <InputLabel id="demo-simple-select-label">Detail</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedDetailedType}
                        label="Age"
                        onChange={handleChangeSelectedDetailedType}
                    >
                        <MenuItem key={"Nefiltrova??"} value={''}>
                            <em>Nefiltrova??</em>
                        </MenuItem>
                        {allDetailedTypes.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                : ''}
        </Grid>
    </Grid>);
}

export default SearchFilter;
