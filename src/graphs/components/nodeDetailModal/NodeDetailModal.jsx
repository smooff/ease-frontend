import React, {useEffect, useState} from 'react';

import {useOktaAuth} from "@okta/okta-react";
import {makeStyles} from "@material-ui/core";
import TreeItem from "@material-ui/lab/TreeItem";
import axios from "axios";


const NodeDetailModal = (props) => {

    const useStyles = makeStyles(() => ({}));
    const classes = useStyles();

    const {authState, oktaAuth} = useOktaAuth();

    const [nodeData, setNodeData] = useState();

    useEffect(async () => {
        const result = await axios.get(
            'https://tp2-ai.fei.stuba.sk:8080/core/object/' + props.nodeId, {
                headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`}
            }
        ).then((res) => {
            setNodeData(res.data);
        }).catch(console.log);

    }, []);

    return (
        <>
            <TreeItem nodeId={"type"}
                      label={nodeData?.type === undefined || nodeData?.type === null ? "" : "Typ: " + nodeData.type}
            />
            <TreeItem nodeId={"name"}
                      label={nodeData?.name === undefined || nodeData?.name === null ? "" : "Názov: " + nodeData.name}
            />
            <TreeItem nodeId={"alias"}
                      label={nodeData?.alias === undefined || nodeData?.alias === null ? "" : "Alias: " + nodeData.alias}
            />
            <TreeItem nodeId={"author"}
                      label={nodeData?.author === undefined || nodeData?.author === null ? "" : "Autor: " + nodeData.author}
            />
            <TreeItem nodeId={"note"}
                      label={nodeData?.note === undefined || nodeData?.note === null ? "" : "Poznámka: " + nodeData.note}
            />
            <TreeItem nodeId={"epackage.name"}
                      label={nodeData?.epackage.name === undefined || nodeData?.epackage.name === null ? "" : "Epackage názov: " + nodeData.epackage.name}
            />
        </>
    );
};

export default NodeDetailModal;