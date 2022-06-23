export function dijkstras(grid, startNode, endNode) {

    const nodesVisited = [];
    startNode.distance = 0;
    const unvisitedNodes = getNodes(grid);

    while (!!unvisitedNodes.length) {
        sortNodes(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return nodesVisited;
        closestNode.hasBeenVisited = true;
        nodesVisited.push(closestNode);
        if (closestNode === endNode) return nodesVisited;
        updateUnvisitedNearbyNodes(closestNode, grid);
    }

}

function updateUnvisitedNearbyNodes(node, grid) {
    const unvisitedNearbyNodes = getNearbyNodes(node, grid);
    for (const nearbyNode of unvisitedNearbyNodes) {
        nearbyNode.distance = node.distance + 1;
        nearbyNode.prevNode = node;
    }
}

function getNearbyNodes(node, grid) {
    const nearby = [];
    const row = node.row;
    const column = node.column;
    if (row > 0) nearby.push(grid[row - 1][column]);
    if (row < grid.length - 1) nearby.push(grid[row + 1][column]);
    if (column > 0) nearby.push(grid[row][column - 1]);
    if (column < grid[0].length - 1) nearby.push(grid[row][column + 1]);
    return nearby.filter(node => !node.hasBeenVisited);
}

function sortNodes(unvisitedNodes) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
}

function getNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function shortestPath(end) {
    const shortestPath = [];
    let current = end;
    while (current !== null) {
        shortestPath.unshift(current);
        current = current.prevNode;
    }
    return shortestPath;
}