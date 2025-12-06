class PuzzleNode {
    constructor(state, parent = null, move = null, depth = 0, cost = 0) {
        this.state = state;
        this.parent = parent;
        this.move = move;
        this.depth = depth;
        this.cost = cost;
    }
}

// Manhattan Distance Heuristic
function manhattanDistance(state, goal) {
    let distance = 0;
    for (let i = 1; i < 9; i++) {
        let x1 = Math.floor(state.indexOf(i) / 3);
        let y1 = state.indexOf(i) % 3;
        let x2 = Math.floor(goal.indexOf(i) / 3);
        let y2 = goal.indexOf(i) % 3;
        distance += Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    return distance;
}

// Get Neighbors (Possible Moves)
function getNeighbors(state) {
    const neighbors = [];
    const zeroIndex = state.indexOf(0);
    const x = Math.floor(zeroIndex / 3);
    const y = zeroIndex % 3;

    const moves = {
        'Up': [x - 1, y],
        'Down': [x + 1, y],
        'Left': [x, y - 1],
        'Right': [x, y + 1]
    };

    for (const [move, [newX, newY]] of Object.entries(moves)) {
        if (newX >= 0 && newX < 3 && newY >= 0 && newY < 3) {
            let newIndex = newX * 3 + newY;
            let newState = [...state];
            [newState[zeroIndex], newState[newIndex]] = [newState[newIndex], newState[zeroIndex]];
            neighbors.push([newState, move]);
        }
    }
    return neighbors;
}

// A* Search Algorithm
function solvePuzzle(initialState, goalState) {
    let priorityQueue = [];
    let initialNode = new PuzzleNode(initialState, null, null, 0, manhattanDistance(initialState, goalState));
    priorityQueue.push(initialNode);
    let visited = new Set();

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => (a.depth + a.cost) - (b.depth + b.cost)); // Sort by f(n) = g(n) + h(n)
        let currentNode = priorityQueue.shift();

        if (JSON.stringify(currentNode.state) === JSON.stringify(goalState)) {
            let path = [];
            while (currentNode.parent) {
                path.push(currentNode.move);
                currentNode = currentNode.parent;
            }
            return path.reverse();
        }

        visited.add(JSON.stringify(currentNode.state));

        for (let [neighbor, move] of getNeighbors(currentNode.state)) {
            if (!visited.has(JSON.stringify(neighbor))) {
                let newCost = manhattanDistance(neighbor, goalState);
                let neighborNode = new PuzzleNode(neighbor, currentNode, move, currentNode.depth + 1, newCost);
                priorityQueue.push(neighborNode);
            }
        }
    }
    return null;
}

// Define Initial and Goal States
let initialState = [1, 2, 3, 8, 4, 0, 7, 6, 5]; // 0 represents the blank space
let goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];

let solution = solvePuzzle(initialState, goalState);
console.log(solution ? `Steps to solve: ${solution.join(' -> ')}` : "No solution found.");
