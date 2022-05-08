import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import ReactFlow, {addEdge, Controls, isNode, MiniMap, ReactFlowProvider, removeElements,} from 'react-flow-renderer';
import dagre from 'dagre';

import './nodesLayouting.css';
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";
import {makeStyles} from "@material-ui/core";
import {useRecoilState} from "recoil";
import {GraphColorsState} from "../../state/graphColorsState/GraphColorsState";
import {Dialog, DialogTitle} from "@mui/material";
import NodeDetailModal from "../nodeDetailModal/NodeDetailModal";
import {useStateWithCallbackLazy} from "use-state-with-callback";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (elements, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({rankdir: direction});

    elements.forEach((el) => {
        if (isNode(el)) {
            dagreGraph.setNode(el.id, {width: nodeWidth, height: nodeHeight});
        } else {
            dagreGraph.setEdge(el.source, el.target);
        }
    });

    dagre.layout(dagreGraph);

    return elements.map((el) => {
        if (isNode(el)) {
            const nodeWithPosition = dagreGraph.node(el.id);
            el.targetPosition = isHorizontal ? 'left' : 'top';
            el.sourcePosition = isHorizontal ? 'right' : 'bottom';

            // unfortunately we need this little hack to pass a slightly different position
            // to notify react flow about the change. Moreover we are shifting the dagre node position
            // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
            el.position = {
                x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
                y: nodeWithPosition.y - nodeHeight / 2,
            };
        }

        return el;
    });
};


const GraphUniversalModal = (props) => {

    const useStyles = makeStyles(() => ({
        emptyRecordMessage: {
            textAlign: "center"
        }
    }));
    const classes = useStyles();

    const {authState, oktaAuth} = useOktaAuth();

    const [nodesEdgesGraph, setNodesEdgesGraph] = useState([]);

    const [colorsState,] = useRecoilState(GraphColorsState);

    const [descriptionLegend, setDescriptionLegend] = useState([]);

    const parseNodesEdges = (data) => {
        const nodes = []
        const edges = []
        var edgeCounterId = 0
        const colorSet = new Set();
        data.forEach((record) => {
            edgeCounterId = edgeCounterId + 1;
            const startNodeAlreadyExist = nodes.find(node => node.id == record.startNodeId);
            const endNodeAlreadyExist = nodes.find(node => node.id == record.endNodeId);
            //pridanie neexistujuceho nodu
            if (startNodeAlreadyExist === undefined) {
                nodes.push({
                    id: record.startNodeId,
                    data: {label: record.startNode},
                    position: {x: 0, y: 0},
                })
            }
            if (endNodeAlreadyExist === undefined) {
                nodes.push({
                    id: record.endNodeId,
                    data: {label: record.endNode},
                    position: {x: 0, y: 0},
                })
            }

            //pridanie hrany k dvom nodom
            if (record.stereotype === null) {
                let color;
                Array.prototype.forEach.call(colorsState, x => {
                    if (record.edgeType in x.connectorType) {
                        color = x.connectorType[record.edgeType];
                        colorSet.add(JSON.stringify({color: color, title: record.edgeType}))
                    }
                });
                edges.push(
                    {
                        id: 'e' + edgeCounterId,
                        source: record.startNodeId,
                        target: record.endNodeId,
                        type: 'smoothstep',
                        animated: true,
                        style: {
                            stroke: color,
                            strokeWidth: 3
                        },
                    }
                )
            } else {
                let color2;
                Array.prototype.forEach.call(colorsState, x => {
                    if (record.edgeType in x.connectorType) {
                        if (record.stereotype in x.stereotype) {
                            color2 = x.stereotype[record.stereotype];
                            colorSet.add(JSON.stringify({color: color2, title: record.stereotype}))
                        }
                    }
                });
                edges.push(
                    {
                        id: 'e' + edgeCounterId,
                        source: record.startNodeId,
                        target: record.endNodeId,
                        type: 'smoothstep',
                        animated: true,
                        style: {
                            stroke: color2,
                            strokeWidth: 3
                        },
                    }
                )
            }
        })
        const formattedSet = [...colorSet].map(item => {
            if (typeof item === 'string') return JSON.parse(item);
            else if (typeof item === 'object') return item;
        });
        setDescriptionLegend(formattedSet);
        const combinedNodesEdges = nodes.concat(edges)
        setNodesEdgesGraph(combinedNodesEdges)
    }
    const [elements, setElements] = useState([]);

    useLayoutEffect(() => {
        async function fetchData() {
            let urlByGraphType = ''
            if (props.graphType === "generalGraph") {
                if (props.connectorType !== null) {
                    urlByGraphType = 'highLevelCompleteGraph?connectorType=' + props.connectorType;
                } else {
                    urlByGraphType = 'highLevelCompleteGraph';
                }
            } else if (props.graphType === "singleUnitGraph") {
                urlByGraphType = 'highLevelObjectOutgoingRelations/' + props.itemId;
            }
            const result = await axios.get(
                'https://tp2-ai.fei.stuba.sk:8080/graph/relation/' + urlByGraphType, {
                    headers: {Authorization: `Bearer ${authState.accessToken.accessToken}`},
                }
            ).then((res) => {
                parseNodesEdges(res.data)
            }).catch(console.log);
        }

        fetchData().then(setElements())
    }, []);

    const layoutedElements = getLayoutedElements(nodesEdgesGraph);

    useEffect(() => {
        setElements(layoutedElements);
    }, [nodesEdgesGraph]);

    const onConnect = (params) =>
        setElements((els) =>
            addEdge({...params, type: 'smoothstep', animated: true}, els)
        );
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));

    const onLayout = useCallback(
        (direction) => {
            const layoutedElements = getLayoutedElements(elements, direction);
            setElements(layoutedElements);
        },
        [elements]
    );

    const [clickedElement, setClickedElement] = useStateWithCallbackLazy(0);
    //KLIKNUTIE NA NODE
    const onClickElement = useCallback((event, element) => {
        setClickedElement(element, () => {
            handleClickOpenNodeModal();
        });
    }, [])

    //NODE MODAL
    const [openNodeModal, setOpenNodeModal] = React.useState(false);
    const handleClickOpenNodeModal = () => {
        setOpenNodeModal(true);
    };
    const handleCloseNodeModal = () => {
        setOpenNodeModal(false);
    };
    return (
        <>
            {elements.length !== 0 ?
                <>{descriptionLegend.map(x => <p key={x.title}
                                                 style={{color: x.color, display: "inline"}}>{x.title}&emsp;</p>)}
                    <div className="layoutflow" style={{height: "40rem"}}>

                        <ReactFlowProvider>
                            <ReactFlow
                                elements={elements}
                                onConnect={onConnect}
                                onElementsRemove={onElementsRemove}
                                connectionLineType="smoothstep"
                                nodesDraggable={false}
                                nodesConnectable={false}
                                onElementClick={onClickElement}
                            >
                                <Controls/>
                                <MiniMap
                                    nodeStrokeWidth={10}
                                />
                            </ReactFlow>

                            {/*MOZNOST PRIDANIA LAYOUTU*/}
                            {/*<div className="controls">*/}
                            {/*    <button onClick={() => onLayout('TB')}>vertical layout</button>*/}
                            {/*    <button onClick={() => onLayout('LR')}>horizontal layout</button>*/}
                            {/*</div>*/}
                        </ReactFlowProvider>
                    </div>
                </>
                :
                <div className={classes.emptyRecordMessage}>
                    K tomuto objektu sa nenašli žiadne závislosti.
                </div>}
            <Dialog fullWidth={true} maxWidth={"sm"} scroll={"paper"} onClose={handleCloseNodeModal}
                    open={openNodeModal}>
                <DialogTitle onClose={handleCloseNodeModal}>
                    <NodeDetailModal nodeId={clickedElement?.id}/>
                </DialogTitle>
            </Dialog>
        </>
    );
};

export default GraphUniversalModal;