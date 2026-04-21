import {HookFuncCore} from "../base/HookFuncCore";

const MAP_FIND = "_ZNSt3mapIiiSt4lessIiESaISt4pairIKiiEEE4findERS3_";
const MAP_END = "_ZNSt3mapIiiSt4lessIiESaISt4pairIKiiEEE3endEv";

const ITER_SIZE = 0x20;

function zeroMem(p: NativePointer, size: number): void {
    for (let i = 0; i < size; i++) {
        p.add(i).writeU8(0);
    }
}

function isReadablePtr(p: NativePointer): boolean {
    if (p.isNull()) return false;
    try {
        return Process.findRangeByAddress(p) !== null;
    } catch (_e) {
        return false;
    }
}

// libstdc++ 常见 rb_tree_node_base 布局（i386）：
// +0x00 color(int)
// +0x04 parent(ptr)  -> root（在 header 节点上）
// +0x08 left(ptr)    -> leftmost（在 header 节点上）
// +0x0c right(ptr)   -> rightmost（在 header 节点上）
// 节点 value（pair<const int,int>）常见从 +0x10 开始：key@0x10, value@0x14
function rbHeaderInfo(header: NativePointer) {
    const root = header.add(0x04).readPointer();
    const leftmost = header.add(0x08).readPointer();
    const rightmost = header.add(0x0c).readPointer();
    return {root, leftmost, rightmost};
}

function rbLeftmost(header: NativePointer, node: NativePointer): NativePointer {
    let cur = node;
    let guard = 0;
    while (!cur.isNull() && !cur.equals(header)) {
        const left = cur.add(0x08).readPointer();
        if (left.isNull() || left.equals(header)) break;
        cur = left;
        if (++guard > 100000) break;
    }
    return cur;
}

function rbNext(header: NativePointer, node: NativePointer): NativePointer {
    if (node.isNull() || node.equals(header)) return header;

    const right = node.add(0x0c).readPointer();
    if (!right.isNull() && !right.equals(header)) {
        return rbLeftmost(header, right);
    }

    let cur = node;
    let parent = cur.add(0x04).readPointer();
    let guard = 0;
    while (!parent.isNull() && !parent.equals(header)) {
        const parentRight = parent.add(0x0c).readPointer();
        if (!parentRight.equals(cur)) return parent;
        cur = parent;
        parent = parent.add(0x04).readPointer();
        if (++guard > 100000) break;
    }
    return header;
}

function rbFindNodeIntInt(header: NativePointer, key: number): NativePointer {
    const {root} = rbHeaderInfo(header);
    let node = root;
    while (!node.isNull() && !node.equals(header)) {
        const nodeKey = node.add(0x10).readS32();
        if (key < nodeKey) node = node.add(0x08).readPointer();
        else if (key > nodeKey) node = node.add(0x0c).readPointer();
        else return node;
    }
    return NULL;
}

/**
 * 读取 std::map<int,int> 的 end() 迭代器 header（sret-first 版本）。
 * 该项目里验证过 end(outIter, this) 能稳定写出 header 指针到 outIter.p0。
 */
export function StdMapIntIntHeader(mapObj: NativePointer): NativePointer {
    const outIter = Memory.alloc(ITER_SIZE);
    zeroMem(outIter, ITER_SIZE);

    const addr = HookFuncCore.getFuncAddress(MAP_END);
    const endSretFirst = new NativeFunction(addr, "pointer", ["pointer", "pointer"], "default");
    endSretFirst(outIter, mapObj);

    return outIter.readPointer(); // header 指针
}

/**
 * 调用 std::map<int,int>::find（sret-first 版本）得到 header/node 指针（outIter.p0）。
 * 返回 NULL 表示没找到（或 map/header 异常）。
 */
export function StdMapIntIntFindNode(mapObj: NativePointer, key: number): NativePointer {
    const outIter = Memory.alloc(ITER_SIZE);
    zeroMem(outIter, ITER_SIZE);

    const keyPtr = Memory.alloc(4);
    keyPtr.writeS32(key);

    const addr = HookFuncCore.getFuncAddress(MAP_FIND);
    const findSretFirst = new NativeFunction(
        addr,
        "pointer",
        ["pointer", "pointer", "pointer"],
        "default",
    );
    findSretFirst(outIter, mapObj, keyPtr);

    const p0 = outIter.readPointer();
    if (p0.isNull()) return NULL;

    // 找不到时通常会返回 end(header)，也就是 header 本身
    const header = StdMapIntIntHeader(mapObj);
    if (!header.isNull() && p0.equals(header)) return NULL;

    return p0;
}

export function StdMapIntIntGet(mapObj: NativePointer, key: number): number | null {
    const header = StdMapIntIntHeader(mapObj);
    if (header.isNull() || !isReadablePtr(header)) return null;
    const node = rbFindNodeIntInt(header, key);
    if (node.isNull()) return null;
    return node.add(0x14).readS32();
}

export function StdMapIntIntForEach(
    mapObj: NativePointer,
    cb: (key: number, value: number, node: NativePointer) => void,
    maxItems = 100,
): void {
    const header = StdMapIntIntHeader(mapObj);
    if (header.isNull() || !isReadablePtr(header)) return;

    const h = rbHeaderInfo(header);
    if (h.leftmost.equals(header)) return;

    let node = h.leftmost;
    let i = 0;
    let guard = 0;
    while (!node.isNull() && !node.equals(header) && i < maxItems) {
        if (!isReadablePtr(node)) return;
        const k = node.add(0x10).readS32();
        const v = node.add(0x14).readS32();
        cb(k, v, node);
        node = rbNext(header, node);
        i++;
        if (++guard > 200000) return;
    }
}

export function StdMapIntIntDump(mapObj: NativePointer, maxItems = 30): void {
    StdMapIntIntForEach(
        mapObj,
        (k, v, node) => {
            console.log(`map<int,int>[${k}] = ${v} (node=${node})`);
        },
        maxItems,
    );
}

