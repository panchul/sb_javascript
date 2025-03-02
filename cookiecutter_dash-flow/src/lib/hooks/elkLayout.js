// src/lib/components/elkLayout.js
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

// Helper function to parse dimension values
const parseDimension = (value) => {
    if (typeof value === 'number') {return value;}
    if (typeof value === 'string') {
        const numValue = parseFloat(value);
        // eslint-disable-next-line no-magic-numbers
        return isNaN(numValue) ? 150 : numValue;
    }
    // eslint-disable-next-line no-magic-numbers
    return 150;
};

export const useLayoutedElements = () => {
    const defaultOptions = {
        'elk.algorithm': 'layered',
        'elk.layered.spacing.nodeNodeBetweenLayers': 100,
        'elk.spacing.nodeNode': 80,
    };

    const getLayoutedElements = async (nodes, edges, options = {}) => {
        if (!nodes || nodes.length === 0) {return { nodes, edges };}

        const layoutOptions = { ...defaultOptions, ...options };

        // Process nodes to handle dimensions
        const elkNodes = nodes.map((node) => {
            // Check if this node is animated (either by type or by being referenced in edges)
            const isAnimatedNode = node.type === 'circle' || edges.some(edge =>
                edge.type === 'animated' && edge.data?.animatedNode === node.id
            );

            if (isAnimatedNode) {
                // For animated nodes, we use fixed dimensions and preserve their properties
                return {
                    ...node,
                    width: 60,
                    height: 60,
                    type: node.type,
                    data: node.data,
                    style: node.style
                };
            }

            // Regular nodes get their dimensions from style or defaults
            const width = parseDimension(node.style?.width);
            const height = parseDimension(node.style?.height);

            return {
                ...node,
                // eslint-disable-next-line no-magic-numbers
                width: Math.max(width, 150),
                // eslint-disable-next-line no-magic-numbers
                height: Math.max(height, 50),
                // Preserve properties
                type: node.type,
                data: node.data,
                style: node.style
            };
        });

        // Process edges
        const elkEdges = edges.map((edge) => ({
            id: edge.id,
            sources: [edge.source],
            targets: [edge.target],
            type: edge.type,
            data: edge.data,
            style: edge.style
        }));

        const graph = {
            id: 'root',
            layoutOptions: layoutOptions,
            children: elkNodes,
            edges: elkEdges,
        };

        try {
            const layout = await elk.layout(graph);

            // Update node positions while preserving all original properties
            const layoutedNodes = layout.children.map((node) => {
                // Get the original node to preserve special properties
                const originalNode = nodes.find(n => n.id === node.id);

                return {
                    ...originalNode,
                    position: { x: node.x, y: node.y },
                };
            });

            return { nodes: layoutedNodes, edges };
        } catch (error) {
            console.error('ELK layout error:', error);
            return { nodes, edges };
        }
    };

    return { getLayoutedElements };
};