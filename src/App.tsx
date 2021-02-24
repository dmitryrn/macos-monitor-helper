import * as React from "react";

import "./styles.css";

const KB = "kb",
  MB = "mb",
  GB = "gb";

export const getDisplayTotalMem = (totalMemKb: number): string => {
  const postfixed = (n: number, pf: string) => String(n.toFixed(2)) + " " + pf;

  if (totalMemKb < 1024) {
    return postfixed(Number(totalMemKb), KB.toUpperCase());
  }

  if (totalMemKb >= 1024 && totalMemKb < 1024 * 1024) {
    return postfixed(Number(totalMemKb) / 1024, MB.toUpperCase());
  }

  return postfixed(Number(totalMemKb) / 1024 / 1024, GB.toUpperCase());
};

// returns mem in Kb
export const parseMem = (mem: string): number | undefined => {
  const match = mem.toLowerCase().match(/(?<numStr>.+) (?<sizeStr>kb|mb|gb)/);
  if (!match?.groups) {
    return;
  }

  const { numStr, sizeStr } = match.groups;
  if (!sizeStr.length || !numStr.length) {
    return;
  }

  const _numStr = numStr.replace(",", ".");

  if (sizeStr === KB) return Number(_numStr);
  if (sizeStr === MB) return Number(_numStr) * 1024;
  if (sizeStr === GB) return Number(_numStr) * 1024 * 1024;
};

const newDebounce = (f: Function, t: number): (() => void) => {
  let id = 0;
  return () => {
    clearTimeout(id);
    id = setTimeout(f, t);
  };
};

const _debounceCache = new Map<string, () => void>();
const debounce = (id: string, f: Function, t: number): (() => void) => {
  if (!_debounceCache.has(id)) {
    _debounceCache.set(id, newDebounce(f, t));
  }

  return _debounceCache.get(id) as () => void;
};

export default function App() {
  console.log("render");

  const [input, inputChange] = React.useState("");
  const [search, searchChange] = React.useState("");

  let totalMem = 0;

  const rows = input.split("\n");

  const tableOutput: [string, string, string][] = [];

  const keys = new Map<string, number>();

  let parsed: number | undefined,
    name: string | undefined,
    mem: string | undefined;
  for (let i = 0; i < rows.length; i++) {
    if (!rows[i].length) continue;

    [name, mem] = rows[i].split("\t");

    if (!name.toLowerCase().includes(search.toLowerCase())) {
      continue;
    }

    parsed = parseMem(mem);
    totalMem += Number.isNaN(parsed) ? 0 : parsed ?? 0;

    let key = name + mem;
    let index = 0;
    if (keys.has(name + mem)) {
      index = keys.get(name + mem) as number;
      key += index + ++index;
    }

    tableOutput.push([name, mem, key]);

    keys.set(name + mem, index);
  }

  console.log(totalMem);

  let m1 = 0,
    m2 = 0;
  tableOutput.sort(([_, mem1], [__, mem2]) => {
    m1 = parseMem(mem1) ?? 0;
    m2 = parseMem(mem2) ?? 0;
    if (m1 > m2) return -1;
    if (m1 < m2) return 1;
    return 0;
  });

  return (
    <div>
      <div>
        MacOS: open Activity Monitor, open Memory tab, cmd+a, cmd+c, paste here.
      </div>
      <div>
        <label>Add input here:</label>
        <textarea
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          value={input}
          onChange={(e) => inputChange(e.target.value.trim())}
        />
      </div>
      <div>
        <label>Search:</label>
        <input value={search} onChange={(e) => searchChange(e.target.value)} />
      </div>
      <div className="total-grid">
        <div className="table">
          {tableOutput.map(([name, mem, key]) => (
            <div key={key}>
              <div>{name}</div>
              <div>{mem}</div>
            </div>
          ))}
        </div>
        <div className="info">total mem: {getDisplayTotalMem(totalMem)}</div>
      </div>
    </div>
  );
}
