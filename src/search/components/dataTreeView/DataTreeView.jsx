import React from 'react';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const DataTreeView = (props) => {

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
                    {/*<TreeItem*/}
                    {/*    label={treeItemData.id}*/}
                    {/*/>*/}
                    <TreeItem
                        label={treeItemData.type}
                    />
                    <TreeItem
                        label={treeItemData.name}
                    />
                    {/*<TreeItem*/}
                    {/*    label={treeItemData.packageId}*/}
                    {/*/>*/}
                </TreeItem>
            );
        });
    };

    return (<TreeView
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpandIcon={<ChevronRightIcon/>}
    >
        {getTreeItemsFromData(props.treeItems)}
    </TreeView>);
}

export default DataTreeView;
