import { IS_PART_2 } from "../../utils/env.ts";

const input = await Deno.readTextFile("./src/2024/day23/input.txt");

// https://en.wikipedia.org/wiki/Clique_problem

const _edges = input.split("\n").slice(0, -1).map((line) => line.split("-"));

const _nodes = _edges.reduce((set, edge) => {
  set.add(edge[0]);
  set.add(edge[1]);
  return set;
}, new Set<string>());
const n = _nodes.size;
const rawNodes = [..._nodes];
const nodeMapping = Object.fromEntries(
  rawNodes.map((node, i) => [node, i + 1]),
);

const edges = _edges.map((
  [left, right],
) => [nodeMapping[left], nodeMapping[right]]);
const size = edges.length;

const historianPcs = [..._nodes].filter((node) =>
  IS_PART_2 || node.startsWith("t")
).map(
  (node) => nodeMapping[node],
);

function isClique(current: number) {
  for (let i = 1; i < current; i++) {
    for (let j = i + 1; j < current; j++) {
      if (graph[vertices[i]][vertices[j]] == 0) {
        return false;
      }
    }
  }
  return true;
}

function findCliques(
  k: number,
  _current = 0,
  _size = 1,
  _cliques: number[][] = [],
) {
  for (let j = _current + 1; j <= n - (k - _size); j++) {
    if (degree[j] >= k - 1) {
      vertices[_size] = j;

      if (isClique(_size + 1)) {
        if (_size < k) {
          findCliques(k, j, _size + 1, _cliques);
        } else {
          _cliques.push(vertices.slice(1, _size + 1));
        }
      }
    }
  }
  return _cliques;
}

const vertices = new Array(size).fill(0);
const graph = new Array(size).fill(0).map(() => new Array(size).fill(0));
const degree = new Array(size).fill(0);

for (let i = 0; i < size; i++) {
  graph[edges[i][0]][edges[i][1]] = 1;
  graph[edges[i][1]][edges[i][0]] = 1;
  degree[edges[i][0]]++;
  degree[edges[i][1]]++;
}

if (IS_PART_2) {
  for (let i = 0; i < size; ++i) {
    const cliques = findCliques(size - i);
    const filtered = cliques.filter((clique) =>
      historianPcs.some((pc) => clique.includes(pc))
    );
    if (filtered.length !== 0) {
      const items = [...new Set(filtered.flat())];
      console.log(items.map((it) => rawNodes[it - 1]).sort().join(","));
      break;
    }
  }
} else {
  console.log(
    findCliques(3).filter((clique) =>
      historianPcs.some((pc) => clique.includes(pc))
    ).length,
  );
}
