/** 18 客户端用的 GNET 大端整数、紧凑长度和 UTF-16LE 名字。 */

export function u16Name(text: string): number[] {
    const out: number[] = [];
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        out.push(c & 255, (c >>> 8) & 255);
    }
    return out;
}

export class W {
    readonly b: number[] = [];

    i32(n: number): this {
        const v = n | 0;
        this.b.push((v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255);
        return this;
    }

    u8(n: number): this {
        this.b.push(n & 255);
        return this;
    }

    i16(n: number): this {
        const v = n & 0xffff;
        this.b.push((v >>> 8) & 255, v & 255);
        return this;
    }

    compact(n: number): this {
        const v = n >>> 0;
        if (v < 0x80) {
            this.b.push(v);
        } else if (v < 0x4000) {
            const x = v | 0x8000;
            this.b.push((x >>> 8) & 255, x & 255);
        } else if (v < 0x20000000) {
            this.i32((v | 0xc0000000) | 0);
        } else {
            this.b.push(0xe0);
            this.i32(v);
        }
        return this;
    }

    octets(text: string): this {
        const raw = u16Name(text);
        this.compact(raw.length);
        for (let i = 0; i < raw.length; i++) this.b.push(raw[i]);
        return this;
    }

    raw(bytes: number[]): this {
        for (let i = 0; i < bytes.length; i++) this.b.push(bytes[i]);
        return this;
    }
}

export class R {
    private p = 0;

    constructor(private readonly b: number[]) {}

    i32(): number {
        if (this.p + 4 > this.b.length) return 0;
        const v = (this.b[this.p] << 24) | (this.b[this.p + 1] << 16) | (this.b[this.p + 2] << 8) | this.b[this.p + 3];
        this.p += 4;
        return v | 0;
    }

    u8(): number {
        if (this.p >= this.b.length) return 0;
        return this.b[this.p++];
    }

    compact(): number {
        if (this.p >= this.b.length) return 0;
        const b0 = this.b[this.p];
        if ((b0 & 0xe0) === 0xe0) {
            this.p++;
            return this.i32() >>> 0;
        }
        if ((b0 & 0xc0) === 0xc0) {
            return this.i32() & 0x3fffffff;
        }
        if ((b0 & 0x80) === 0x80) {
            if (this.p + 2 > this.b.length) return 0;
            const v = ((this.b[this.p] << 8) | this.b[this.p + 1]) & 0x7fff;
            this.p += 2;
            return v;
        }
        this.p++;
        return b0;
    }

    octets(): number {
        const n = this.compact();
        this.p += n;
        return n;
    }
}

export function intAt(body: number[], index: number): number {
    const o = index * 4;
    if (o + 4 > body.length) return 0;
    return ((body[o] << 24) | (body[o + 1] << 16) | (body[o + 2] << 8) | body[o + 3]) | 0;
}

export function lastInt(body: number[]): number {
    const n = body.length;
    if (n < 4) return 0;
    return ((body[n - 4] << 24) | (body[n - 3] << 16) | (body[n - 2] << 8) | body[n - 1]) | 0;
}
