import React from 'react';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import {Inventory2Outlined, PolylineOutlined} from "@mui/icons-material";
import {AdjustOutlined} from "@material-ui/icons";
import {Button, Dialog, DialogTitle} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
import GraphUniversalModal from "../../../graphs/components/graphUniversalModal/GraphUniversalModal";

const DataTreeView = (props) => {

    const useStyles = makeStyles(() => ({
        tableBackgroundStyle: {
            backgroundColor: "rgba(0, 0, 0, .1)"
        }
    }));
    const classes = useStyles();

    //data pre modal
    const [modalData, setModalData] = React.useState('');
    //urcuje typ zaznamu, na zaklade toho sa davaju do modalu data
    const [modalTypeData, setModalTypeData] = React.useState('');

    // modal pre viac informacii k zaznamu
    const [openModalMoreInfo, setOpenModalMoreInfo] = React.useState(false);
    const handleClickOpenModalMoreInfo = (event, item) => {
        setOpenModalMoreInfo(true);
        makeRequestDetails(item.type.toLowerCase(), item.id);
        setModalTypeData(item.type);
    };
    const handleCloseModalMoreInfo = () => {
        setOpenModalMoreInfo(false);
    };

    //sluzi na posielanie id pre single unit graf
    const [graphItemId, setGraphItemId] = React.useState('');

    // modal pre graf k zaznamu
    const [openModalGraph, setOpenModalGraph] = React.useState(false);
    const handleClickOpenModalGraph = (event, item) => {
        setOpenModalGraph(true);
        setGraphItemId(item.id);
    };
    const handleCloseModalGraph = () => {
        setOpenModalGraph(false);
    };

    const {authState, oktaAuth} = useOktaAuth();

    const makeRequestDetails = (type, id) => {
        return axios.get(
            'https://tp2-ai.fei.stuba.sk:8080/core/' + type + '/' + id, {
                headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`},
            }
        ).then((res) => {
            setModalData(res.data);
        }).catch(console.log);
    }

    //urcuje ikonku pre tree item podla typu itemu
    const iconByType = (type) => {
        if (type === 'OBJECT') {
            return <AdjustOutlined/>
        } else if (type === 'DIAGRAM') {
            return <PolylineOutlined/>
        } else if (type === 'PACKAGE') {
            return <Inventory2Outlined/>
        }
    }

    //urcuje ikonku pre tree item podla typu itemu
    const infoByType = () => {
        if (modalTypeData === 'OBJECT') {
            return (<>
                <TreeItem
                    label={modalData.type === undefined || modalData.type === null ? "" : "Typ: " + modalData.type}
                />
                <TreeItem
                    label={modalData.name === undefined || modalData.name === null ? "" : "Názov: " + modalData.name}
                />
                <TreeItem
                    label={modalData.alias === undefined || modalData.alias === null ? "" : "Alias: " + modalData.alias}
                />
                <TreeItem
                    label={modalData.author === undefined || modalData.author === null ? "" : "Autor: " + modalData.author}
                />
                <TreeItem
                    label={modalData.version === undefined || modalData.version === null ? "" : "Verzia: " + modalData.version}
                />
                <TreeItem
                    label={modalData.note === undefined || modalData.note === null ? "" : "Poznámka: " + modalData.note}
                />
            </>)
        } else if (modalTypeData === 'DIAGRAM') {
            return (<>
                <TreeItem
                    label={modalData.name === undefined || modalData.name === null ? "" : "Názov: " + modalData.name}
                />
                <TreeItem
                    label={modalData.author === undefined || modalData.author === null ? "" : "Autor: " + modalData.author}
                />
                <TreeItem
                    label={modalData.version === undefined || modalData.version === null ? "" : "Verzia: " + modalData.version}
                />
            </>)
        } else if (modalTypeData === 'PACKAGE') {
            return (<>
                <TreeItem
                    label={modalData.name === undefined || modalData.name === null ? "" : "Názov: " + modalData.name}
                />
                <TreeItem
                    label={modalData.version === undefined || modalData.version === null ? "" : "Verzia: " + modalData.version}
                />
            </>)
        }
    }

    const getTreeItemsFromData = treeItems => {
        return treeItems.results.map(treeItemData => {
            let children = treeItemData.type;
            // if (treeItemData.type && treeItemData.type.length > 0) {
            //     children = getTreeItemsFromData(treeItemData.type);
            // }
            return (
                <TreeItem
                    key={treeItemData.id}
                    nodeId={treeItemData.id}
                    label={treeItemData.name}
                    // children={children}
                >
                    <TreeItem
                        label={treeItemData.name}
                    />
                    <TreeItem
                        label={treeItemData.type}
                        icon={iconByType(treeItemData.type)}
                    />
                    <TreeItem
                        label={treeItemData.detailedType}
                    />
                    <Button onClick={(e) => handleClickOpenModalMoreInfo(e, treeItemData)}
                            style={{marginBottom: "15px"}}
                            variant="outlined">Viac informácií</Button>
                    <Button onClick={(e) => handleClickOpenModalGraph(e, treeItemData)}
                            style={{marginLeft: "10px", marginBottom: "15px"}}
                            variant="outlined">Graf</Button>

                    <Dialog fullWidth={true} maxWidth={"sm"} scroll={"paper"} onClose={handleCloseModalMoreInfo}
                            open={openModalMoreInfo}>
                        <DialogTitle onClose={handleCloseModalMoreInfo}>
                            {infoByType()}
                        </DialogTitle>
                    </Dialog>

                    <Dialog fullWidth={true} maxWidth={"xl"} scroll={"paper"} onClose={handleCloseModalGraph}
                            open={openModalGraph}>
                        <DialogTitle onClose={handleCloseModalGraph}>
                            <GraphUniversalModal graphType={"singleUnitGraph"} itemId={graphItemId}/>
                        </DialogTitle>
                    </Dialog>
                </TreeItem>
            );
        });
    };

    return (<TreeView
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
        className={classes.tableBackgroundStyle}
    >
        {getTreeItemsFromData(props.treeItems)}
    </TreeView>);
}

export default DataTreeView;
