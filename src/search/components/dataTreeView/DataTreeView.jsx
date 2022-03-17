import React from 'react';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import {Inventory2Outlined, PolylineOutlined} from "@mui/icons-material";
import {AdjustOutlined} from "@material-ui/icons";
import {Button, Dialog, DialogTitle, Typography} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";

const DataTreeView = (props) => {

    const useStyles = makeStyles(() => ({
        tableBackgroundStyle:{
            backgroundColor:"rgba(0, 0, 0, .1)"
        }
    }));
    const classes = useStyles();

    //data pre modal
    const [modalData, setModalData] = React.useState('');
    //urcuje typ zaznamu, na zaklade toho sa davaju do modalu data
    const [modalTypeData, setModalTypeData] = React.useState('');

    // modal
    const [openModal, setOpenModal] = React.useState(false);
    const handleClickOpenModal = (event, item) => {
        setOpenModal(true);
        makeRequestDetails(item.type.toLowerCase(), item.id);
        setModalTypeData(item.type);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
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
                <Typography variant={"h5"} >
                    Typ:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.type}
                    </Typography>
                </Typography>
                <Typography variant={"h5"} >
                    Názov:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.name}
                    </Typography>
                </Typography>
                <Typography variant={"h5"} >
                    Alias:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.alias}
                    </Typography>
                </Typography>
                <Typography variant={"h5"}>
                    Autor:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.author}
                    </Typography>
                </Typography>
                <Typography variant={"h5"}>
                    Verzia:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.version}
                    </Typography>
                </Typography>
                <Typography variant={"h5"}>
                    Poznámka:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.note}
                    </Typography>
                </Typography>
            </>)
        } else if (modalTypeData === 'DIAGRAM') {
            return (<>
                <Typography variant={"h5"} >
                    Názov:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.name}
                    </Typography>
                </Typography>
                <Typography variant={"h5"}>
                    Autor:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.author}
                    </Typography>
                </Typography>
                <Typography variant={"h5"}>
                    Verzia:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.version}
                    </Typography>
                </Typography>
            </>)
        } else if (modalTypeData === 'PACKAGE') {
            return (<>
                <Typography variant={"h5"} >
                    Názov:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.name}
                    </Typography>
                </Typography>
                <Typography variant={"h5"}>
                    Verzia:
                    <Typography display="inline" variant={"h5"}>
                        {modalData.version}
                    </Typography>
                </Typography>
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
                    <Button onClick={(e) => handleClickOpenModal(e, treeItemData)} style={{marginBottom: "15px"}}
                            variant="outlined">Viac informácií</Button>
                    <Button style={{marginLeft: "10px", marginBottom: "15px"}} variant="outlined">Graf</Button>

                    <Dialog fullWidth={true} maxWidth={"sm"} scroll={"paper"} onClose={handleCloseModal}
                            open={openModal}>
                        <DialogTitle onClose={handleCloseModal}>
                            {infoByType()}
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
