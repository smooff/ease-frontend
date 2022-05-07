import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import ReactFlow, {addEdge, Controls, isNode, MiniMap, ReactFlowProvider, removeElements,} from 'react-flow-renderer';
import dagre from 'dagre';

import './nodesLayouting.css';
import axios from "axios";
import {useOktaAuth} from "@okta/okta-react";

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

    const {authState, oktaAuth} = useOktaAuth();

    const [nodesEdgesGraph, setNodesEdgesGraph] = useState([]);

    const parseNodesEdges = (data) => {
        const nodes = []
        const edges = []
        var edgeCounterId = 0
        data.forEach((record) => {
            edgeCounterId = edgeCounterId+1;
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
                    data: { label: record.endNode },
                    position: {x: 0, y: 0},
                })
            }
            //pridanie hrany k dvom nodom
            edges.push(
                { id: 'e'+edgeCounterId,
                    source: record.startNodeId,
                    target: record.endNodeId,
                    type: 'smoothstep',
                    animated: true }
            )

        })
        const combinedNodesEdges = nodes.concat(edges)
        setNodesEdgesGraph(combinedNodesEdges)
    }
    const [elements, setElements] = useState();

    useLayoutEffect(() => {
        async function fetchData() {
            const urlByGraphType = props.graphType==="generalGraph" ? 'highLevelCompleteGraph' : ''
            const result = await axios.get(
                'https://tp2-ai.fei.stuba.sk:8080/graph/relation/'+urlByGraphType, {
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

    return (
        <div className="layoutflow" style={{height: "40rem"}}>
            <ReactFlowProvider>
                <ReactFlow
                    elements={elements}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    connectionLineType="smoothstep"
                    nodesDraggable={false}
                    nodesConnectable={false}
                >
                <Controls />
                    <MiniMap
                        nodeStrokeColor={(n) => {
                            if (n.style?.background) return n.style.background;

                            //farby hran
                            // if (n.type === 'input') return '#0041d0';
                            // if (n.type === 'output') return '#ff0072';
                            // if (n.type === 'default') return '#1a192b';

                            return '#eee';
                        }}
                        nodeColor={(n) => {
                            if (n.style?.background) return n.style.background;

                            return '#fff';
                        }}
                        nodeBorderRadius={2}
                    />
                </ReactFlow>
                <div className="controls">
                    <button onClick={() => onLayout('TB')}>vertical layout</button>
                    <button onClick={() => onLayout('LR')}>horizontal layout</button>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default GraphUniversalModal;