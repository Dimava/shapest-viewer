export var SzInfo;
(function (SzInfo) {
    let color;
    (function (color_1) {
        const colorWheelNameList = [
            'red', 'orange', 'yellow',
            'lawngreen', 'green', 'cyan',
            'blue', 'purple', 'pink',
        ];
        const colorGreyNameList = [
            'black', 'grey', 'white',
        ];
        color_1.list = [...colorWheelNameList, ...colorGreyNameList].map((name, i) => ({
            name, style: name, code: name[0],
        }));
        color_1.colorList = color_1.list.map(e => e.name);
        color_1.byName = Object.fromEntries(color_1.list.map(e => [e.name, e]));
        color_1.byChar = Object.fromEntries(color_1.list.map(e => [e.code, e]));
        function exampleLayer(color) {
            let i = 0;
            return new SzLayer({
                quads: [
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                    { shape: 'circle', from: i, to: i += 6, color },
                    { shape: 'square', from: i, to: i += 6, color },
                ]
            });
        }
        color_1.exampleLayer = exampleLayer;
    })(color = SzInfo.color || (SzInfo.color = {}));
    let quad;
    (function (quad_1) {
        quad_1.list = [
            { name: 'circle', code: 'C' },
            { name: 'square', code: 'R' },
            { name: 'star', code: 'S' },
        ];
        function exampleLayer(shape) {
            let i = 0;
            return new SzLayer({
                quads: [
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                    { shape, from: i, to: i += 6, color: 'grey' },
                ]
            });
        }
        quad_1.exampleLayer = exampleLayer;
        quad_1.extraShapes = {
            clover(ctx) {
                // begin({ size: 1.3, path: true, zero: true });
                // const inner = 0.5;
                // const inner_center = 0.45;
                // context.lineTo(0, inner);
                // context.bezierCurveTo(0, 1, inner, 1, inner_center, inner_center);
                // context.bezierCurveTo(1, inner, 1, 0, inner, 0);
            },
            star8(ctx, { from, to }) {
                const r = 1.22 / 2, R = 1.22, d = (n) => from * (1 - n) + to * n;
                ctx
                    .lineToR(r, d(0))
                    .lineToR(R, d(0.25))
                    .lineToR(r, d(0.5))
                    .lineToR(R, d(0.75))
                    .lineToR(r, d(1));
            },
            rhombus(ctx) {
            },
            plus(ctx, { from, to }) {
                const r = 0.4, R = 1.0, d = (n) => from * (1 - n) + to * n;
                const rr = (r1, r2) => (r1 * r1 + r2 * r2) ** 0.5;
                const at = (a, b) => Math.atan2(b, a) / Math.PI * 2;
                const tor = (r, R) => [rr(r, R), d(at(r, R))];
                ctx
                    .lineToR(...tor(R, 0))
                    .lineToR(...tor(R, r))
                    .lineToR(...tor(r, r))
                    .lineToR(...tor(r, R))
                    .lineToR(...tor(0, R));
            },
            saw(ctx) {
            },
            sun(ctx) {
            },
            leaf(ctx) {
            },
            diamond(ctx) {
            },
            mill(ctx) {
            },
            halfleaf(ctx) {
            },
            yinyang(ctx) {
            },
            octagon(ctx) {
            },
        };
        Object.entries(quad_1.extraShapes).map(([k, v]) => quad_1.list.push({ name: k }));
        quad_1.quadList = quad_1.list.map(e => e.name);
    })(quad = SzInfo.quad || (SzInfo.quad = {}));
    /* old:

    
export const shape4svg = {
    R: "M 0 0 L 1 0 L 1 1 L 0 1 Z",
    C: "M 0 0 L 1 0 A 1 1 0 0 1 0 1 Z",
    S: "M 0 0 L 0.6 0 L 1 1 L 0 0.6 Z",
    W: "M 0 0 L 0.6 0 L 1 1 L 0 1 Z",
    "-": "M 0 0",
}
function dotPos(l, a) {
    return `${l * Math.cos(Math.PI / a)} ${l * Math.sin(Math.PI / a)}`;
}

function sinPiBy(a) {
    return Math.sin(Math.PI / a);
}
function cosPiBy(a) {
    return Math.cos(Math.PI / a);
}
let shape6long = 1 / cosPiBy(6);

export const shape6svg = {
    R: `M 0 0 L 1 0 L ${dotPos(shape6long, 6)} L ${dotPos(1, 3)} Z`,
    C: `M 0 0 L 1 0 A 1 1 0 0 1 ${dotPos(1, 3)} Z`,
    S: `M 0 0 L 0.6 0 L ${dotPos(shape6long, 6)} L ${dotPos(0.6, 3)} Z`,
    W: `M 0 0 L 0.6 0 L ${dotPos(shape6long, 6)} L ${dotPos(1, 3)} Z`,
    "-": "M 0 0",
}



registerCustomShape({
    id: "rhombus",
    code: "B",
    ...customDefaults,
    draw({ dims, innerDims, layer, quad, context, color, begin }) {
        begin({ size: 1.2, path: true, zero: true });
        const rad = 0.001;
        // with rounded borders
        context.arcTo(0, 1, 1, 0, rad);
        context.arcTo(1, 0, 0, 0, rad);
    },
});

registerCustomShape({
    id: "plus",
    code: "P",
    ...customDefaults,
    draw: "M 0 0 L 1.1 0 1.1 0.5 0.5 0.5 0.5 1.1 0 1.1 z",
    tier: 3,
});

registerCustomShape({
    id: "saw",
    code: "Z",
    ...customDefaults,
    draw({ dims, innerDims, layer, quad, context, color, begin }) {
        begin({ size: 1.1, path: true, zero: true });
        const inner = 0.5;
        context.lineTo(inner, 0);
        context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
        context.bezierCurveTo(
            1,
            inner,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT1_2,
            inner * Math.SQRT1_2
        );
        context.rotate(Math.PI / 4);
        context.bezierCurveTo(inner, 0.3, 1, 0.3, 1, 0);
        context.bezierCurveTo(
            1,
            inner,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT2 * 0.9,
            inner * Math.SQRT1_2,
            inner * Math.SQRT1_2
        );
    },
    tier: 3,
});

registerCustomShape({
    id: "sun",
    code: "U",
    ...customDefaults,
    spawnColor: "yellow",
    draw({ dims, innerDims, layer, quad, context, color, begin }) {
        begin({ size: 1.3, path: true, zero: true });
        const PI = Math.PI;
        const PI3 = ((PI * 3) / 8) * 0.75;
        const c = 1 / Math.cos(Math.PI / 8);
        const b = c * Math.sin(Math.PI / 8);

        context.moveTo(0, 0);
        context.rotate(Math.PI / 2);
        context.arc(c, 0, b, -PI, -PI + PI3);
        context.rotate(-Math.PI / 4);
        context.arc(c, 0, b, -PI - PI3, -PI + PI3);
        context.rotate(-Math.PI / 4);
        context.arc(c, 0, b, PI - PI3, PI);
    },
});

registerCustomShape({
    id: "leaf",
    code: "F",
    ...customDefaults,
    draw: "M 0 0 v 0.5 a 0.5 0.5 0 0 0 0.5 0.5 h 0.5 v -0.5 a 0.5 0.5 0 0 0 -0.5 -0.5 z",
});

registerCustomShape({
    id: "diamond",
    code: "D",
    ...customDefaults,
    draw: "M 0 0 l 0 0.5 0.5 0.5 0.5 0 0 -0.5 -0.5 -0.5 z",
});

registerCustomShape({
    id: "mill",
    code: "M",
    ...customDefaults,
    draw: "M 0 0 L 0 1 1 1 Z",
});

// registerCustomShape({
//     id: "halfleaf",
//     code: "H",
//     ...customDefaults,
//     draw: "100 M 0 0 L 0 100 A 45 45 0 0 0 30 30 A 45 45 0 0 0 100 0 Z",
// })

registerCustomShape({
    id: "yinyang",
    code: "Y",
    ...customDefaults,
    // draw({ dims, innerDims, layer, quad, context, color, begin }) {
    //     begin({ size: 1/(0.5+Math.SQRT1_2), path: true });

    //     /** @type{CanvasRenderingContext2D} * /
    //     let ctx = context;

    //     with (ctx) { with (Math) {
    //     ////////////////////////
    //     // draw mostly in [0,1]x[0,1] square
    //     // draw: "100 M 0 50 A 50 50 0 1 1 85 85 A 121 121 0 0 1 -85 85 A 50 50 0 0 0 0 50",
    //     moveTo(0, 0.5);
    //     arc(0.5, 0.5, 0.5, PI, PI/4)
    //     arc(0, 0, 0.5+SQRT1_2, PI/4, PI/4+PI/2, 0)
    //     arc(-0.5, 0.5, 0.5, 3*PI/4, 0, 1)

    //     moveTo(0.6, 0.5)
    //     arc(0.5, 0.5, 0.1, 0, 2*PI)
    //     }}

    // },
    draw:
        "120.71 M 0 50 A 50 50 0 1 1 85.355 85.355 A 120.71 120.71 0 0 1 -85.355 85.355 A 50 50 0 0 0 0 50 Z M 40 50 A 10 10 0 1 0 40 49.99 Z",
    tier: 4,
});

registerCustomShape({
    id: "octagon",
    code: "O",
    ...customDefaults,
    draw: "M 0 0 L 0 1 0.4142 1 1 0.4142 1 0 Z",
});

    
    */
})(SzInfo || (SzInfo = {}));
export class SzLayerCut {
    shape = 'line';
    color = 'black';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    get smallRadius() {
        return 0.0001;
    }
    pathInside(ctx) {
        switch (this.shape) {
            case 'line': {
                ctx.lineToR(0.5, this.from);
                ctx.lineToR(this.smallRadius, this.from);
                return;
            }
            default: {
                throw log(this);
            }
        }
    }
    pathOutsize(ctx) {
        switch (this.shape) {
            case 'line': {
                ctx.lineToR(this.smallRadius, this.from);
                ctx.lineToR(0.5, this.from);
                return;
            }
            default: {
                throw log(this);
            }
        }
    }
}
export class SzLayerQuad {
    shape = 'circle';
    color = 'black';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    outerPath(ctx) {
        switch (this.shape) {
            case 'circle': {
                ctx.arc(0, 0, 1, this.from, this.to);
                return;
            }
            case 'square': {
                ctx.lineToR(1, this.from);
                ctx.lineToR(Math.SQRT2, (this.from + this.to) / 2);
                ctx.lineToR(1, this.to);
                return;
            }
            case 'star': {
                ctx.lineToR(0.6, this.from);
                ctx.lineToR(Math.SQRT2, (this.from + this.to) / 2);
                ctx.lineToR(0.6, this.to);
                return;
            }
            default: {
                if (SzInfo.quad.extraShapes[this.shape]) {
                    SzInfo.quad.extraShapes[this.shape](ctx, this);
                    return;
                }
                throw log(this);
            }
        }
    }
}
export class SzLayerArea {
    shape = 'whole';
    color = 'black';
    from = 0;
    to = 0;
    constructor(source) {
        Object.assign(this, source);
    }
    outerPath(ctx) {
        switch (this.shape) {
            case 'whole': {
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, 24);
                ctx.closePath();
                return;
            }
            case 'sector': {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, 5, this.from, this.to);
                ctx.closePath();
                return;
            }
            default: {
                throw log(this);
            }
        }
    }
    clip(ctx) {
        this.outerPath(ctx);
        ctx.clip();
    }
    fill(ctx) {
        this.outerPath(ctx);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
const testTemplate = {
    cuts: [
        { from: 10, to: 10, shape: 'line', color: 'blue' },
        { from: 14, to: 14, shape: 'line', color: 'blue' },
    ],
    quads: [
        { shape: 'square', color: 'green', from: 2, to: 4 },
        { shape: 'circle', color: 'pink', from: 5, to: 19 },
        { shape: 'square', color: 'green', from: 20, to: 22 },
    ],
    areas: [
        { shape: 'sector', color: '#ff0000', from: 11, to: 13 },
    ],
};
export class SzLayer {
    layerIndex = 0;
    cuts = [];
    quads = [];
    areas = [];
    static createTest() {
        let l = new SzLayer(testTemplate);
        l.areas.map(e => {
            let r = (Math.random() - 0.5) * 8;
            e.from += r;
            e.to += r;
        });
        console.error('test layer', l);
        return l;
    }
    constructor(source, layerIndex) {
        if (source) {
            this.cuts = (source.cuts ?? []).map(e => new SzLayerCut(e));
            this.quads = (source.quads ?? []).map(e => new SzLayerQuad(e));
            this.areas = (source.areas ?? []).map(e => new SzLayerArea(e));
            if (source.layerIndex) {
                this.layerIndex = source.layerIndex;
            }
        }
        if (layerIndex) {
            this.layerIndex = layerIndex;
        }
    }
    drawCenteredLayerScaled(ctx, layerIndex) {
        layerIndex ??= this.layerIndex;
        let scale = 1 - 0.22 * layerIndex;
        ctx.saved(ctx => {
            ctx.scale(scale);
            this.drawCenteredNormalized(ctx);
        });
    }
    drawCenteredNormalized(ctx) {
        ctx.saved(ctx => {
            this.clipShapes(ctx);
            this.quads.forEach(q => ctx.saved(ctx => this.fillQuad(q, ctx)));
            this.cuts.forEach(c => ctx.saved(ctx => this.strokeCut(c, ctx)));
            this.areas.forEach(a => ctx.saved(ctx => this.fillArea(a, ctx)));
        });
        ctx.saved(ctx => this.drawQuadOutline(ctx, true));
    }
    strokeCut(cut, ctx) {
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = cut.color;
        ctx.beginPath();
        if (cut.shape == 'line') {
            ctx.rotate(cut.from);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 1);
            ctx.stroke();
        }
        else {
            throw log('bad cut', cut);
        }
    }
    fillQuad(quad, ctx) {
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = ctx.fillStyle = quad.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        quad.outerPath(ctx);
        ctx.fill();
    }
    fillArea(area, ctx) {
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = ctx.fillStyle = area.color;
        area.clip(ctx);
        ctx.fill();
    }
    fullQuadPath(ctx, withCuts) {
        ctx.beginPath();
        for (let i = 0; i < this.quads.length; i++) {
            let prev = i > 0 ? this.quads[i - 1] : this.quads.slice(-1)[0];
            let shape = this.quads[i];
            if (withCuts || shape.from != prev.to % 24)
                ctx.lineTo(0, 0);
            shape.outerPath(ctx);
        }
        ctx.closePath();
    }
    drawQuadOutline(ctx, withCuts) {
        this.fullQuadPath(ctx, withCuts);
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = 'orange';
        ctx.stroke();
    }
    clipShapes(ctx) {
        this.fullQuadPath(ctx);
        ctx.clip();
    }
    clone() {
        return new SzLayer(this);
    }
    rotate(rot) {
        this.areas.map(e => { e.from += rot; e.to += rot; });
        this.cuts.map(e => { e.from += rot; });
        this.quads.map(e => { e.from += rot; e.to += rot; });
        return this.normalize();
    }
    normalize() {
        this.areas = this.areas.map(e => {
            if (e.from < 0 || e.to < 0) {
                e.from += 24;
                e.to += 24;
            }
            if (e.from >= 24 && e.to >= 24) {
                e.from -= 24;
                e.to -= 24;
            }
            return e;
        }).sort((a, b) => {
            if (a.from != b.from)
                return a.from - b.from;
            if (a.to != b.to)
                return a.to - b.to;
            return 0;
        });
        this.quads = this.quads.map(e => {
            if (e.from < 0 || e.to < 0) {
                e.from += 24;
                e.to += 24;
            }
            if (e.from >= 24 && e.to >= 24) {
                e.from -= 24;
                e.to -= 24;
            }
            return e;
        }).sort((a, b) => {
            if (a.from != b.from)
                return a.from - b.from;
            if (a.to != b.to)
                return a.to - b.to;
            return 0;
        });
        this.cuts = this.cuts.map(e => {
            if (e.from < 0) {
                e.from += 24;
            }
            if (e.from >= 24) {
                e.from -= 24;
            }
            return e;
        }).sort((a, b) => {
            if (a.from != b.from)
                return a.from - b.from;
            return 0;
        });
        return this;
    }
    canStackWith(layer) {
        // can stack if: 
    }
    stackWith(layer) {
    }
    static fromShapezHash(hash) {
        const colors = { u: 'grey', r: 'red', b: 'blue', g: 'green' };
        const shapes = { C: 'circle', R: 'square', S: 'star', };
        return new SzLayer({
            areas: [],
            quads: hash.match(/../g).map((s, i) => {
                if (s[0] == '-')
                    return null;
                return new SzLayerQuad({
                    shape: shapes[s[0]],
                    color: colors[s[1]],
                    from: i * 6,
                    to: (i + 1) * 6,
                });
            }).filter(e => e),
            cuts: [],
        });
    }
}
function log(...a) {
    console.error(...a);
    for (let o of a)
        document.body.append(JSON.stringify(o));
}
// try {
// 	hashForEach(testHash, 'shapes', drawShape, sctx);
// 	hashForEach(testHash, 'cuts', drawCut, sctx);
// 	clipShapes(testHash, sctx);
// 	// hashForEach(testHash, 'areas', drawArea, sctx);
// } catch (e: any) {
// 	log('error: ', e.stack);
// }
// ctx.globalAlpha = 0.4;
// ctx.fillRect(-2, -2, 4, 4);
// function hashForEach<K extends keyof SzDefinition>(
// 	hash: SzDefinition, k: K,
// 	mapper: (e: SzDefinition[K][0], i: number, hash: SzDefinition, ctx: SzContext2D) => void,
// 	ctx: SzContext2D,
// ) {
// 	hash[k].map((e, i) => {
// 		ctx.save();
// 		mapper(e, i, hash, ctx);
// 		ctx.restore();
// 	});
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2hhcGVzdC9sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxQkEsTUFBTSxLQUFXLE1BQU0sQ0EwUnRCO0FBMVJELFdBQWlCLE1BQU07SUFDdEIsSUFBaUIsS0FBSyxDQWlDckI7SUFqQ0QsV0FBaUIsT0FBSztRQUNyQixNQUFNLGtCQUFrQixHQUFHO1lBQzFCLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUTtZQUN6QixXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU07WUFDNUIsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNO1NBQ2YsQ0FBQztRQUNYLE1BQU0saUJBQWlCLEdBQUc7WUFDekIsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPO1NBQ2YsQ0FBQztRQUlFLFlBQUksR0FDaEIsQ0FBQyxHQUFHLGtCQUFrQixFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBRVEsaUJBQVMsR0FBRyxRQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEMsY0FBTSxHQUE2QixNQUFNLENBQUMsV0FBVyxDQUFDLFFBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQVUsQ0FBQyxDQUFDLENBQUM7UUFDM0YsY0FBTSxHQUE0QixNQUFNLENBQUMsV0FBVyxDQUFDLFFBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFD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QUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztpQkFDZixDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxFQUFFLEVBQUU7U0FDUixDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0Q7QUFHRCxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQVE7SUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQztRQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBU0QsUUFBUTtBQUNSLHFEQUFxRDtBQUNyRCxpREFBaUQ7QUFDakQsK0JBQStCO0FBQy9CLHNEQUFzRDtBQUN0RCxxQkFBcUI7QUFDckIsNEJBQTRCO0FBQzVCLElBQUk7QUFFSix5QkFBeUI7QUFDekIsOEJBQThCO0FBTTlCLHNEQUFzRDtBQUN0RCw2QkFBNkI7QUFDN0IsNkZBQTZGO0FBQzdGLHFCQUFxQjtBQUNyQixNQUFNO0FBQ04sMkJBQTJCO0FBQzNCLGdCQUFnQjtBQUNoQiw2QkFBNkI7QUFDN0IsbUJBQW1CO0FBQ25CLE9BQU87QUFDUCxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hhciwgcm90YXRpb24yNCwgc3R5bGVTdHJpbmcsIFN6Q29udGV4dDJEIH0gZnJvbSBcIi4vU3pDb250ZXh0MkQuanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IHR5cGUgY3V0U2hhcGUgPSAoXHJcblx0fCAnbGluZSdcclxuKTtcclxuZXhwb3J0IHR5cGUgcXVhZFNoYXBlID0gKFxyXG5cdHwgJ2NpcmNsZScgfCAnc3F1YXJlJyB8ICdzdGFyJ1xyXG4pO1xyXG5leHBvcnQgdHlwZSBhcmVhU2hhcGUgPSAoXHJcblx0fCAnd2hvbGUnIHwgJ3NlY3RvcidcclxuKTtcclxuZXhwb3J0IHR5cGUgY29sb3IgPVxyXG5cdHwgJ3JlZCcgfCAnb3JhbmdlJyB8ICd5ZWxsb3cnXHJcblx0fCAnbGF3bmdyZWVuJyB8ICdncmVlbicgfCAnY3lhbidcclxuXHR8ICdibHVlJyB8ICdwdXJwbGUnIHwgJ3BpbmsnXHJcblx0fCAnYmxhY2snIHwgJ2dyZXknIHwgJ3doaXRlJ1xyXG5cdHwgYCMke3N0cmluZ31gO1xyXG5cclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgU3pJbmZvIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIGNvbG9yIHtcclxuXHRcdGNvbnN0IGNvbG9yV2hlZWxOYW1lTGlzdCA9IFtcclxuXHRcdFx0J3JlZCcsICdvcmFuZ2UnLCAneWVsbG93JyxcclxuXHRcdFx0J2xhd25ncmVlbicsICdncmVlbicsICdjeWFuJyxcclxuXHRcdFx0J2JsdWUnLCAncHVycGxlJywgJ3BpbmsnLFxyXG5cdFx0XSBhcyBjb25zdDtcclxuXHRcdGNvbnN0IGNvbG9yR3JleU5hbWVMaXN0ID0gW1xyXG5cdFx0XHQnYmxhY2snLCAnZ3JleScsICd3aGl0ZScsXHJcblx0XHRdIGFzIGNvbnN0O1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIGNvbG9ySW5mbyA9IHsgbmFtZTogY29sb3IsIHN0eWxlOiBzdHlsZVN0cmluZywgY29kZTogY2hhciB9O1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBsaXN0OiBjb2xvckluZm9bXSA9XHJcblx0XHRcdFsuLi5jb2xvcldoZWVsTmFtZUxpc3QsIC4uLmNvbG9yR3JleU5hbWVMaXN0XS5tYXAoKG5hbWUsIGkpID0+ICh7XHJcblx0XHRcdFx0bmFtZSwgc3R5bGU6IG5hbWUsIGNvZGU6IG5hbWVbMF0sXHJcblx0XHRcdH0pKTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgY29sb3JMaXN0ID0gbGlzdC5tYXAoZSA9PiBlLm5hbWUpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBieU5hbWU6IFJlY29yZDxjb2xvciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLm5hbWUsIGVdIGFzIGNvbnN0KSk7XHJcblx0XHRleHBvcnQgY29uc3QgYnlDaGFyOiBSZWNvcmQ8Y2hhciwgY29sb3JJbmZvPiA9IE9iamVjdC5mcm9tRW50cmllcyhsaXN0Lm1hcChlID0+IFtlLmNvZGUsIGVdIGFzIGNvbnN0KSk7XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGV4YW1wbGVMYXllcihjb2xvcjogY29sb3IpIHtcclxuXHRcdFx0bGV0IGkgPSAwO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRcdHF1YWRzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnY2lyY2xlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvciB9LFxyXG5cdFx0XHRcdFx0eyBzaGFwZTogJ2NpcmNsZScsIGZyb206IGksIHRvOiBpICs9IDYsIGNvbG9yIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlOiAnc3F1YXJlJywgZnJvbTogaSwgdG86IGkgKz0gNiwgY29sb3IgfSxcclxuXHRcdFx0XHRdXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRleHBvcnQgbmFtZXNwYWNlIHF1YWQge1xyXG5cdFx0ZXhwb3J0IHR5cGUgcXVhZEluZm8gPSB7IG5hbWU6IHF1YWRTaGFwZSwgY29kZTogY2hhciB9O1xyXG5cdFx0ZXhwb3J0IGNvbnN0IGxpc3Q6IHF1YWRJbmZvW10gPSBbXHJcblx0XHRcdHsgbmFtZTogJ2NpcmNsZScsIGNvZGU6ICdDJyB9LFxyXG5cdFx0XHR7IG5hbWU6ICdzcXVhcmUnLCBjb2RlOiAnUicgfSxcclxuXHRcdFx0eyBuYW1lOiAnc3RhcicsIGNvZGU6ICdTJyB9LFxyXG5cdFx0XTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZXhhbXBsZUxheWVyKHNoYXBlOiBxdWFkU2hhcGUpIHtcclxuXHRcdFx0bGV0IGkgPSAwO1xyXG5cdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIoe1xyXG5cdFx0XHRcdHF1YWRzOiBbXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XHR7IHNoYXBlLCBmcm9tOiBpLCB0bzogaSArPSA2LCBjb2xvcjogJ2dyZXknIH0sXHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY29uc3QgZXh0cmFTaGFwZXM6IFJlY29yZDxzdHJpbmcsIChjdHg6IFN6Q29udGV4dDJELCBxdWFkOiBTekxheWVyUXVhZCkgPT4gdm9pZD4gPSB7XHJcblx0XHRcdGNsb3ZlcihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdFx0Ly8gYmVnaW4oeyBzaXplOiAxLjMsIHBhdGg6IHRydWUsIHplcm86IHRydWUgfSk7XHJcblx0XHRcdFx0Ly8gY29uc3QgaW5uZXIgPSAwLjU7XHJcblx0XHRcdFx0Ly8gY29uc3QgaW5uZXJfY2VudGVyID0gMC40NTtcclxuXHRcdFx0XHQvLyBjb250ZXh0LmxpbmVUbygwLCBpbm5lcik7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5iZXppZXJDdXJ2ZVRvKDAsIDEsIGlubmVyLCAxLCBpbm5lcl9jZW50ZXIsIGlubmVyX2NlbnRlcik7XHJcblx0XHRcdFx0Ly8gY29udGV4dC5iZXppZXJDdXJ2ZVRvKDEsIGlubmVyLCAxLCAwLCBpbm5lciwgMCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHN0YXI4KGN0eDogU3pDb250ZXh0MkQsIHsgZnJvbSwgdG8gfTogU3pMYXllclF1YWQpIHtcclxuXHRcdFx0XHRjb25zdCByID0gMS4yMiAvIDIsIFIgPSAxLjIyLCBkID0gKG46IG51bWJlcikgPT4gZnJvbSAqICgxIC0gbikgKyB0byAqIG47XHJcblx0XHRcdFx0Y3R4XHJcblx0XHRcdFx0XHQubGluZVRvUihyLCBkKDApKVxyXG5cdFx0XHRcdFx0LmxpbmVUb1IoUiwgZCgwLjI1KSlcclxuXHRcdFx0XHRcdC5saW5lVG9SKHIsIGQoMC41KSlcclxuXHRcdFx0XHRcdC5saW5lVG9SKFIsIGQoMC43NSkpXHJcblx0XHRcdFx0XHQubGluZVRvUihyLCBkKDEpKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRyaG9tYnVzKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0fSxcclxuXHRcdFx0cGx1cyhjdHg6IFN6Q29udGV4dDJELCB7IGZyb20sIHRvIH06IFN6TGF5ZXJRdWFkKSB7XHJcblx0XHRcdFx0Y29uc3QgciA9IDAuNCwgUiA9IDEuMCwgZCA9IChuOiBudW1iZXIpID0+IGZyb20gKiAoMSAtIG4pICsgdG8gKiBuO1xyXG5cdFx0XHRcdGNvbnN0IHJyID0gKHIxOiBudW1iZXIsIHIyOiBudW1iZXIpID0+IChyMSAqIHIxICsgcjIgKiByMikgKiogMC41XHJcblx0XHRcdFx0Y29uc3QgYXQgPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IE1hdGguYXRhbjIoYiwgYSkgLyBNYXRoLlBJICogMjtcclxuXHRcdFx0XHRjb25zdCB0b3IgPSAocjogbnVtYmVyLCBSOiBudW1iZXIpID0+IFtycihyLCBSKSwgZChhdChyLCBSKSldIGFzIGNvbnN0O1xyXG5cdFx0XHRcdGN0eFxyXG5cdFx0XHRcdFx0LmxpbmVUb1IoLi4udG9yKFIsIDApKVxyXG5cdFx0XHRcdFx0LmxpbmVUb1IoLi4udG9yKFIsIHIpKVxyXG5cdFx0XHRcdFx0LmxpbmVUb1IoLi4udG9yKHIsIHIpKVxyXG5cdFx0XHRcdFx0LmxpbmVUb1IoLi4udG9yKHIsIFIpKVxyXG5cdFx0XHRcdFx0LmxpbmVUb1IoLi4udG9yKDAsIFIpKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXcoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdW4oY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRsZWFmKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGlhbW9uZChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdH0sXHJcblx0XHRcdG1pbGwoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRoYWxmbGVhZihjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRcdH0sXHJcblx0XHRcdHlpbnlhbmcoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRvY3RhZ29uKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdFx0fSxcclxuXHRcdH1cclxuXHJcblx0XHRPYmplY3QuZW50cmllcyhleHRyYVNoYXBlcykubWFwKChbaywgdl0pID0+IGxpc3QucHVzaCh7IG5hbWU6IGsgfSBhcyBhbnkpKTtcclxuXHJcblx0XHRleHBvcnQgY29uc3QgcXVhZExpc3QgPSBsaXN0Lm1hcChlID0+IGUubmFtZSk7XHJcblx0fVxyXG5cclxuXHQvKiBvbGQ6IFxyXG5cclxuXHRcclxuZXhwb3J0IGNvbnN0IHNoYXBlNHN2ZyA9IHtcclxuXHRSOiBcIk0gMCAwIEwgMSAwIEwgMSAxIEwgMCAxIFpcIixcclxuXHRDOiBcIk0gMCAwIEwgMSAwIEEgMSAxIDAgMCAxIDAgMSBaXCIsXHJcblx0UzogXCJNIDAgMCBMIDAuNiAwIEwgMSAxIEwgMCAwLjYgWlwiLFxyXG5cdFc6IFwiTSAwIDAgTCAwLjYgMCBMIDEgMSBMIDAgMSBaXCIsXHJcblx0XCItXCI6IFwiTSAwIDBcIixcclxufVxyXG5mdW5jdGlvbiBkb3RQb3MobCwgYSkge1xyXG5cdHJldHVybiBgJHtsICogTWF0aC5jb3MoTWF0aC5QSSAvIGEpfSAke2wgKiBNYXRoLnNpbihNYXRoLlBJIC8gYSl9YDtcclxufVxyXG5cclxuZnVuY3Rpb24gc2luUGlCeShhKSB7XHJcblx0cmV0dXJuIE1hdGguc2luKE1hdGguUEkgLyBhKTtcclxufVxyXG5mdW5jdGlvbiBjb3NQaUJ5KGEpIHtcclxuXHRyZXR1cm4gTWF0aC5jb3MoTWF0aC5QSSAvIGEpO1xyXG59XHJcbmxldCBzaGFwZTZsb25nID0gMSAvIGNvc1BpQnkoNik7XHJcblxyXG5leHBvcnQgY29uc3Qgc2hhcGU2c3ZnID0ge1xyXG5cdFI6IGBNIDAgMCBMIDEgMCBMICR7ZG90UG9zKHNoYXBlNmxvbmcsIDYpfSBMICR7ZG90UG9zKDEsIDMpfSBaYCxcclxuXHRDOiBgTSAwIDAgTCAxIDAgQSAxIDEgMCAwIDEgJHtkb3RQb3MoMSwgMyl9IFpgLFxyXG5cdFM6IGBNIDAgMCBMIDAuNiAwIEwgJHtkb3RQb3Moc2hhcGU2bG9uZywgNil9IEwgJHtkb3RQb3MoMC42LCAzKX0gWmAsXHJcblx0VzogYE0gMCAwIEwgMC42IDAgTCAke2RvdFBvcyhzaGFwZTZsb25nLCA2KX0gTCAke2RvdFBvcygxLCAzKX0gWmAsXHJcblx0XCItXCI6IFwiTSAwIDBcIixcclxufVxyXG5cclxuXHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJyaG9tYnVzXCIsXHJcblx0Y29kZTogXCJCXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdyh7IGRpbXMsIGlubmVyRGltcywgbGF5ZXIsIHF1YWQsIGNvbnRleHQsIGNvbG9yLCBiZWdpbiB9KSB7XHJcblx0XHRiZWdpbih7IHNpemU6IDEuMiwgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdGNvbnN0IHJhZCA9IDAuMDAxO1xyXG5cdFx0Ly8gd2l0aCByb3VuZGVkIGJvcmRlcnNcclxuXHRcdGNvbnRleHQuYXJjVG8oMCwgMSwgMSwgMCwgcmFkKTtcclxuXHRcdGNvbnRleHQuYXJjVG8oMSwgMCwgMCwgMCwgcmFkKTtcclxuXHR9LFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcInBsdXNcIixcclxuXHRjb2RlOiBcIlBcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIEwgMS4xIDAgMS4xIDAuNSAwLjUgMC41IDAuNSAxLjEgMCAxLjEgelwiLFxyXG5cdHRpZXI6IDMsXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwic2F3XCIsXHJcblx0Y29kZTogXCJaXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdyh7IGRpbXMsIGlubmVyRGltcywgbGF5ZXIsIHF1YWQsIGNvbnRleHQsIGNvbG9yLCBiZWdpbiB9KSB7XHJcblx0XHRiZWdpbih7IHNpemU6IDEuMSwgcGF0aDogdHJ1ZSwgemVybzogdHJ1ZSB9KTtcclxuXHRcdGNvbnN0IGlubmVyID0gMC41O1xyXG5cdFx0Y29udGV4dC5saW5lVG8oaW5uZXIsIDApO1xyXG5cdFx0Y29udGV4dC5iZXppZXJDdXJ2ZVRvKGlubmVyLCAwLjMsIDEsIDAuMywgMSwgMCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oXHJcblx0XHRcdDEsXHJcblx0XHRcdGlubmVyLFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDIgKiAwLjksXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMV8yXHJcblx0XHQpO1xyXG5cdFx0Y29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDQpO1xyXG5cdFx0Y29udGV4dC5iZXppZXJDdXJ2ZVRvKGlubmVyLCAwLjMsIDEsIDAuMywgMSwgMCk7XHJcblx0XHRjb250ZXh0LmJlemllckN1cnZlVG8oXHJcblx0XHRcdDEsXHJcblx0XHRcdGlubmVyLFxyXG5cdFx0XHRpbm5lciAqIE1hdGguU1FSVDIgKiAwLjksXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMiAqIDAuOSxcclxuXHRcdFx0aW5uZXIgKiBNYXRoLlNRUlQxXzIsXHJcblx0XHRcdGlubmVyICogTWF0aC5TUVJUMV8yXHJcblx0XHQpO1xyXG5cdH0sXHJcblx0dGllcjogMyxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJzdW5cIixcclxuXHRjb2RlOiBcIlVcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRzcGF3bkNvbG9yOiBcInllbGxvd1wiLFxyXG5cdGRyYXcoeyBkaW1zLCBpbm5lckRpbXMsIGxheWVyLCBxdWFkLCBjb250ZXh0LCBjb2xvciwgYmVnaW4gfSkge1xyXG5cdFx0YmVnaW4oeyBzaXplOiAxLjMsIHBhdGg6IHRydWUsIHplcm86IHRydWUgfSk7XHJcblx0XHRjb25zdCBQSSA9IE1hdGguUEk7XHJcblx0XHRjb25zdCBQSTMgPSAoKFBJICogMykgLyA4KSAqIDAuNzU7XHJcblx0XHRjb25zdCBjID0gMSAvIE1hdGguY29zKE1hdGguUEkgLyA4KTtcclxuXHRcdGNvbnN0IGIgPSBjICogTWF0aC5zaW4oTWF0aC5QSSAvIDgpO1xyXG5cclxuXHRcdGNvbnRleHQubW92ZVRvKDAsIDApO1xyXG5cdFx0Y29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDIpO1xyXG5cdFx0Y29udGV4dC5hcmMoYywgMCwgYiwgLVBJLCAtUEkgKyBQSTMpO1xyXG5cdFx0Y29udGV4dC5yb3RhdGUoLU1hdGguUEkgLyA0KTtcclxuXHRcdGNvbnRleHQuYXJjKGMsIDAsIGIsIC1QSSAtIFBJMywgLVBJICsgUEkzKTtcclxuXHRcdGNvbnRleHQucm90YXRlKC1NYXRoLlBJIC8gNCk7XHJcblx0XHRjb250ZXh0LmFyYyhjLCAwLCBiLCBQSSAtIFBJMywgUEkpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxucmVnaXN0ZXJDdXN0b21TaGFwZSh7XHJcblx0aWQ6IFwibGVhZlwiLFxyXG5cdGNvZGU6IFwiRlwiLFxyXG5cdC4uLmN1c3RvbURlZmF1bHRzLFxyXG5cdGRyYXc6IFwiTSAwIDAgdiAwLjUgYSAwLjUgMC41IDAgMCAwIDAuNSAwLjUgaCAwLjUgdiAtMC41IGEgMC41IDAuNSAwIDAgMCAtMC41IC0wLjUgelwiLFxyXG59KTtcclxuXHJcbnJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG5cdGlkOiBcImRpYW1vbmRcIixcclxuXHRjb2RlOiBcIkRcIixcclxuXHQuLi5jdXN0b21EZWZhdWx0cyxcclxuXHRkcmF3OiBcIk0gMCAwIGwgMCAwLjUgMC41IDAuNSAwLjUgMCAwIC0wLjUgLTAuNSAtMC41IHpcIixcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJtaWxsXCIsXHJcblx0Y29kZTogXCJNXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCBMIDAgMSAxIDEgWlwiLFxyXG59KTtcclxuXHJcbi8vIHJlZ2lzdGVyQ3VzdG9tU2hhcGUoe1xyXG4vLyAgICAgaWQ6IFwiaGFsZmxlYWZcIixcclxuLy8gICAgIGNvZGU6IFwiSFwiLFxyXG4vLyAgICAgLi4uY3VzdG9tRGVmYXVsdHMsXHJcbi8vICAgICBkcmF3OiBcIjEwMCBNIDAgMCBMIDAgMTAwIEEgNDUgNDUgMCAwIDAgMzAgMzAgQSA0NSA0NSAwIDAgMCAxMDAgMCBaXCIsXHJcbi8vIH0pXHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJ5aW55YW5nXCIsXHJcblx0Y29kZTogXCJZXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0Ly8gZHJhdyh7IGRpbXMsIGlubmVyRGltcywgbGF5ZXIsIHF1YWQsIGNvbnRleHQsIGNvbG9yLCBiZWdpbiB9KSB7XHJcblx0Ly8gICAgIGJlZ2luKHsgc2l6ZTogMS8oMC41K01hdGguU1FSVDFfMiksIHBhdGg6IHRydWUgfSk7XHJcblxyXG5cdC8vICAgICAvKiogQHR5cGV7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSAqIC9cclxuXHQvLyAgICAgbGV0IGN0eCA9IGNvbnRleHQ7XHJcblxyXG5cdC8vICAgICB3aXRoIChjdHgpIHsgd2l0aCAoTWF0aCkge1xyXG5cdC8vICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHQvLyAgICAgLy8gZHJhdyBtb3N0bHkgaW4gWzAsMV14WzAsMV0gc3F1YXJlXHJcblx0Ly8gICAgIC8vIGRyYXc6IFwiMTAwIE0gMCA1MCBBIDUwIDUwIDAgMSAxIDg1IDg1IEEgMTIxIDEyMSAwIDAgMSAtODUgODUgQSA1MCA1MCAwIDAgMCAwIDUwXCIsXHJcblx0Ly8gICAgIG1vdmVUbygwLCAwLjUpO1xyXG5cdC8vICAgICBhcmMoMC41LCAwLjUsIDAuNSwgUEksIFBJLzQpXHJcblx0Ly8gICAgIGFyYygwLCAwLCAwLjUrU1FSVDFfMiwgUEkvNCwgUEkvNCtQSS8yLCAwKVxyXG5cdC8vICAgICBhcmMoLTAuNSwgMC41LCAwLjUsIDMqUEkvNCwgMCwgMSlcclxuXHJcblx0Ly8gICAgIG1vdmVUbygwLjYsIDAuNSlcclxuXHQvLyAgICAgYXJjKDAuNSwgMC41LCAwLjEsIDAsIDIqUEkpXHJcblx0Ly8gICAgIH19XHJcblxyXG5cdC8vIH0sXHJcblx0ZHJhdzpcclxuXHRcdFwiMTIwLjcxIE0gMCA1MCBBIDUwIDUwIDAgMSAxIDg1LjM1NSA4NS4zNTUgQSAxMjAuNzEgMTIwLjcxIDAgMCAxIC04NS4zNTUgODUuMzU1IEEgNTAgNTAgMCAwIDAgMCA1MCBaIE0gNDAgNTAgQSAxMCAxMCAwIDEgMCA0MCA0OS45OSBaXCIsXHJcblx0dGllcjogNCxcclxufSk7XHJcblxyXG5yZWdpc3RlckN1c3RvbVNoYXBlKHtcclxuXHRpZDogXCJvY3RhZ29uXCIsXHJcblx0Y29kZTogXCJPXCIsXHJcblx0Li4uY3VzdG9tRGVmYXVsdHMsXHJcblx0ZHJhdzogXCJNIDAgMCBMIDAgMSAwLjQxNDIgMSAxIDAuNDE0MiAxIDAgWlwiLFxyXG59KTtcclxuXHJcblx0XHJcblx0Ki9cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTekxheWVyIHtcclxuXHRjdXRzOiAoe1xyXG5cdFx0c2hhcGU6IGN1dFNoYXBlLFxyXG5cdFx0ZnJvbTogcm90YXRpb24yNCwgdG86IHJvdGF0aW9uMjQsXHJcblx0XHRjb2xvcjogY29sb3IsXHJcblx0fSlbXTtcclxuXHRxdWFkczogKHtcclxuXHRcdHNoYXBlOiBxdWFkU2hhcGUsXHJcblx0XHRmcm9tOiByb3RhdGlvbjI0LCB0bzogcm90YXRpb24yNCxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHR9KVtdO1xyXG5cdGFyZWFzOiAoe1xyXG5cdFx0c2hhcGU6IGFyZWFTaGFwZSxcclxuXHRcdGNvbG9yOiBjb2xvcixcclxuXHRcdGZyb206IHJvdGF0aW9uMjQsIHRvOiByb3RhdGlvbjI0LFxyXG5cdH0pW107XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU3pMYXllckN1dCB7XHJcblx0c2hhcGU6IGN1dFNoYXBlID0gJ2xpbmUnO1xyXG5cdGNvbG9yOiBjb2xvciA9ICdibGFjayc7XHJcblxyXG5cdGZyb206IHJvdGF0aW9uMjQgPSAwOyB0bzogcm90YXRpb24yNCA9IDA7XHJcblx0Y29uc3RydWN0b3Ioc291cmNlOiBQYXJ0aWFsPFN6TGF5ZXJDdXQ+KSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIHNvdXJjZSk7XHJcblx0fVxyXG5cdGdldCBzbWFsbFJhZGl1cygpIHtcclxuXHRcdHJldHVybiAwLjAwMDE7XHJcblx0fVxyXG5cdHBhdGhJbnNpZGUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC41LCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKHRoaXMuc21hbGxSYWRpdXMsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyBsb2codGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0cGF0aE91dHNpemUoY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0c3dpdGNoICh0aGlzLnNoYXBlKSB7XHJcblx0XHRcdGNhc2UgJ2xpbmUnOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IodGhpcy5zbWFsbFJhZGl1cywgdGhpcy5mcm9tKTtcclxuXHRcdFx0XHRjdHgubGluZVRvUigwLjUsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHR0aHJvdyBsb2codGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJRdWFkIHtcclxuXHRzaGFwZTogcXVhZFNoYXBlID0gJ2NpcmNsZSc7XHJcblx0Y29sb3I6IGNvbG9yID0gJ2JsYWNrJztcclxuXHJcblx0ZnJvbTogcm90YXRpb24yNCA9IDA7IHRvOiByb3RhdGlvbjI0ID0gMDtcclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U6IFBhcnRpYWw8U3pMYXllclF1YWQ+KSB7XHJcblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIHNvdXJjZSk7XHJcblx0fVxyXG5cdG91dGVyUGF0aChjdHg6IFN6Q29udGV4dDJEKSB7XHJcblx0XHRzd2l0Y2ggKHRoaXMuc2hhcGUpIHtcclxuXHRcdFx0Y2FzZSAnY2lyY2xlJzoge1xyXG5cdFx0XHRcdGN0eC5hcmMoMCwgMCwgMSwgdGhpcy5mcm9tLCB0aGlzLnRvKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FzZSAnc3F1YXJlJzoge1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDEsIHRoaXMuZnJvbSk7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoTWF0aC5TUVJUMiwgKHRoaXMuZnJvbSArIHRoaXMudG8pIC8gMik7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMSwgdGhpcy50byk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhc2UgJ3N0YXInOiB7XHJcblx0XHRcdFx0Y3R4LmxpbmVUb1IoMC42LCB0aGlzLmZyb20pO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKE1hdGguU1FSVDIsICh0aGlzLmZyb20gKyB0aGlzLnRvKSAvIDIpO1xyXG5cdFx0XHRcdGN0eC5saW5lVG9SKDAuNiwgdGhpcy50byk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlZmF1bHQ6IHtcclxuXHRcdFx0XHRpZiAoU3pJbmZvLnF1YWQuZXh0cmFTaGFwZXNbdGhpcy5zaGFwZV0pIHtcclxuXHRcdFx0XHRcdFN6SW5mby5xdWFkLmV4dHJhU2hhcGVzW3RoaXMuc2hhcGVdKGN0eCwgdGhpcyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aHJvdyBsb2codGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN6TGF5ZXJBcmVhIHtcclxuXHRzaGFwZTogYXJlYVNoYXBlID0gJ3dob2xlJztcclxuXHRjb2xvcjogY29sb3IgPSAnYmxhY2snO1xyXG5cclxuXHRmcm9tOiByb3RhdGlvbjI0ID0gMDsgdG86IHJvdGF0aW9uMjQgPSAwO1xyXG5cdGNvbnN0cnVjdG9yKHNvdXJjZTogUGFydGlhbDxTekxheWVyQXJlYT4pIHtcclxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgc291cmNlKTtcclxuXHR9XHJcblx0b3V0ZXJQYXRoKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHN3aXRjaCAodGhpcy5zaGFwZSkge1xyXG5cdFx0XHRjYXNlICd3aG9sZSc6IHtcclxuXHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCA1LCAwLCAyNCk7XHJcblx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXNlICdzZWN0b3InOiB7XHJcblx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdGN0eC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRcdFx0Y3R4LmFyYygwLCAwLCA1LCB0aGlzLmZyb20sIHRoaXMudG8pO1xyXG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0ZGVmYXVsdDoge1xyXG5cdFx0XHRcdHRocm93IGxvZyh0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRjbGlwKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMub3V0ZXJQYXRoKGN0eCk7XHJcblx0XHRjdHguY2xpcCgpO1xyXG5cdH1cclxuXHRmaWxsKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMub3V0ZXJQYXRoKGN0eCk7XHJcblx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuXHRcdGN0eC5maWxsKCk7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCB0ZXN0VGVtcGxhdGU6IElTekxheWVyID0ge1xyXG5cdGN1dHM6IFtcclxuXHRcdHsgZnJvbTogMTAsIHRvOiAxMCwgc2hhcGU6ICdsaW5lJywgY29sb3I6ICdibHVlJyB9LFxyXG5cdFx0eyBmcm9tOiAxNCwgdG86IDE0LCBzaGFwZTogJ2xpbmUnLCBjb2xvcjogJ2JsdWUnIH0sXHJcblx0XSxcclxuXHRxdWFkczogW1xyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyLCB0bzogNCB9LFxyXG5cdFx0eyBzaGFwZTogJ2NpcmNsZScsIGNvbG9yOiAncGluaycsIGZyb206IDUsIHRvOiAxOSB9LFxyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyMCwgdG86IDIyIH0sXHJcblx0XSxcclxuXHRhcmVhczogW1xyXG5cdFx0eyBzaGFwZTogJ3NlY3RvcicsIGNvbG9yOiAnI2ZmMDAwMCcsIGZyb206IDExLCB0bzogMTMgfSxcclxuXHRdLFxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekxheWVyIGltcGxlbWVudHMgSVN6TGF5ZXIge1xyXG5cdGxheWVySW5kZXggPSAwO1xyXG5cdGN1dHM6IFN6TGF5ZXJDdXRbXSA9IFtdO1xyXG5cdHF1YWRzOiBTekxheWVyUXVhZFtdID0gW107XHJcblx0YXJlYXM6IFN6TGF5ZXJBcmVhW10gPSBbXTtcclxuXHJcblxyXG5cdHN0YXRpYyBjcmVhdGVUZXN0KCkge1xyXG5cdFx0bGV0IGwgPSBuZXcgU3pMYXllcih0ZXN0VGVtcGxhdGUpO1xyXG5cdFx0bC5hcmVhcy5tYXAoZSA9PiB7XHJcblx0XHRcdGxldCByID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogODtcclxuXHRcdFx0ZS5mcm9tICs9IHI7XHJcblx0XHRcdGUudG8gKz0gcjtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5lcnJvcigndGVzdCBsYXllcicsIGwpO1xyXG5cdFx0cmV0dXJuIGw7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3Rvcihzb3VyY2U/OiBQYXJ0aWFsPElTekxheWVyPiwgbGF5ZXJJbmRleD86IG51bWJlcikge1xyXG5cdFx0aWYgKHNvdXJjZSkge1xyXG5cdFx0XHR0aGlzLmN1dHMgPSAoc291cmNlLmN1dHMgPz8gW10pLm1hcChlID0+IG5ldyBTekxheWVyQ3V0KGUpKTtcclxuXHRcdFx0dGhpcy5xdWFkcyA9IChzb3VyY2UucXVhZHMgPz8gW10pLm1hcChlID0+IG5ldyBTekxheWVyUXVhZChlKSk7XHJcblx0XHRcdHRoaXMuYXJlYXMgPSAoc291cmNlLmFyZWFzID8/IFtdKS5tYXAoZSA9PiBuZXcgU3pMYXllckFyZWEoZSkpO1xyXG5cdFx0XHRpZiAoKHNvdXJjZSBhcyBTekxheWVyKS5sYXllckluZGV4KSB7XHJcblx0XHRcdFx0dGhpcy5sYXllckluZGV4ID0gKHNvdXJjZSBhcyBTekxheWVyKS5sYXllckluZGV4O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobGF5ZXJJbmRleCkge1xyXG5cdFx0XHR0aGlzLmxheWVySW5kZXggPSBsYXllckluZGV4O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZHJhd0NlbnRlcmVkTGF5ZXJTY2FsZWQoY3R4OiBTekNvbnRleHQyRCwgbGF5ZXJJbmRleD86IG51bWJlcikge1xyXG5cdFx0bGF5ZXJJbmRleCA/Pz0gdGhpcy5sYXllckluZGV4O1xyXG5cdFx0bGV0IHNjYWxlID0gMSAtIDAuMjIgKiBsYXllckluZGV4O1xyXG5cdFx0Y3R4LnNhdmVkKGN0eCA9PiB7XHJcblx0XHRcdGN0eC5zY2FsZShzY2FsZSk7XHJcblx0XHRcdHRoaXMuZHJhd0NlbnRlcmVkTm9ybWFsaXplZChjdHgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkcmF3Q2VudGVyZWROb3JtYWxpemVkKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdGN0eC5zYXZlZChjdHggPT4ge1xyXG5cdFx0XHR0aGlzLmNsaXBTaGFwZXMoY3R4KTtcclxuXHRcdFx0dGhpcy5xdWFkcy5mb3JFYWNoKHEgPT4gY3R4LnNhdmVkKGN0eCA9PiB0aGlzLmZpbGxRdWFkKHEsIGN0eCkpKTtcclxuXHJcblx0XHRcdHRoaXMuY3V0cy5mb3JFYWNoKGMgPT4gY3R4LnNhdmVkKGN0eCA9PiB0aGlzLnN0cm9rZUN1dChjLCBjdHgpKSk7XHJcblxyXG5cdFx0XHR0aGlzLmFyZWFzLmZvckVhY2goYSA9PiBjdHguc2F2ZWQoY3R4ID0+IHRoaXMuZmlsbEFyZWEoYSwgY3R4KSkpO1xyXG5cdFx0fSk7XHJcblx0XHRjdHguc2F2ZWQoY3R4ID0+IHRoaXMuZHJhd1F1YWRPdXRsaW5lKGN0eCwgdHJ1ZSkpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0c3Ryb2tlQ3V0KGN1dDogU3pMYXllckN1dCwgY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuMDU7XHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBjdXQuY29sb3I7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblxyXG5cdFx0aWYgKGN1dC5zaGFwZSA9PSAnbGluZScpIHtcclxuXHRcdFx0Y3R4LnJvdGF0ZShjdXQuZnJvbSk7XHJcblx0XHRcdGN0eC5tb3ZlVG8oMCwgMCk7XHJcblx0XHRcdGN0eC5saW5lVG8oMCwgMSk7XHJcblx0XHRcdGN0eC5zdHJva2UoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IGxvZygnYmFkIGN1dCcsIGN1dCk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHRmaWxsUXVhZChxdWFkOiBTekxheWVyUXVhZCwgY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuMDU7XHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBjdHguZmlsbFN0eWxlID0gcXVhZC5jb2xvcjtcclxuXHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgubW92ZVRvKDAsIDApO1xyXG5cdFx0cXVhZC5vdXRlclBhdGgoY3R4KTtcclxuXHRcdGN0eC5maWxsKCk7XHJcblx0fVxyXG5cclxuXHRmaWxsQXJlYShhcmVhOiBTekxheWVyQXJlYSwgY3R4OiBTekNvbnRleHQyRCkge1xyXG5cdFx0Y3R4LmxpbmVXaWR0aCA9IDAuMDU7XHJcblx0XHRjdHguc3Ryb2tlU3R5bGUgPSBjdHguZmlsbFN0eWxlID0gYXJlYS5jb2xvcjtcclxuXHJcblx0XHRhcmVhLmNsaXAoY3R4KTtcclxuXHRcdGN0eC5maWxsKCk7XHJcblx0fVxyXG5cclxuXHRmdWxsUXVhZFBhdGgoY3R4OiBTekNvbnRleHQyRCwgd2l0aEN1dHM/OiBib29sZWFuKSB7XHJcblx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucXVhZHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IHByZXYgPSBpID4gMCA/IHRoaXMucXVhZHNbaSAtIDFdIDogdGhpcy5xdWFkcy5zbGljZSgtMSlbMF07XHJcblx0XHRcdGxldCBzaGFwZSA9IHRoaXMucXVhZHNbaV07XHJcblx0XHRcdGlmICh3aXRoQ3V0cyB8fCBzaGFwZS5mcm9tICE9IHByZXYudG8gJSAyNCkgY3R4LmxpbmVUbygwLCAwKTtcclxuXHRcdFx0c2hhcGUub3V0ZXJQYXRoKGN0eCk7XHJcblx0XHR9XHJcblx0XHRjdHguY2xvc2VQYXRoKCk7XHJcblx0fVxyXG5cclxuXHRkcmF3UXVhZE91dGxpbmUoY3R4OiBTekNvbnRleHQyRCwgd2l0aEN1dHM/OiBib29sZWFuKSB7XHJcblx0XHR0aGlzLmZ1bGxRdWFkUGF0aChjdHgsIHdpdGhDdXRzKTtcclxuXHRcdGN0eC5saW5lV2lkdGggPSAwLjA1O1xyXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ29yYW5nZSc7XHJcblx0XHRjdHguc3Ryb2tlKCk7XHJcblx0fVxyXG5cclxuXHRjbGlwU2hhcGVzKGN0eDogU3pDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMuZnVsbFF1YWRQYXRoKGN0eCk7XHJcblx0XHRjdHguY2xpcCgpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0Y2xvbmUoKSB7XHJcblx0XHRyZXR1cm4gbmV3IFN6TGF5ZXIodGhpcyk7XHJcblx0fVxyXG5cclxuXHRyb3RhdGUocm90OiByb3RhdGlvbjI0KSB7XHJcblx0XHR0aGlzLmFyZWFzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgZS50byArPSByb3Q7IH0pO1xyXG5cdFx0dGhpcy5jdXRzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgfSk7XHJcblx0XHR0aGlzLnF1YWRzLm1hcChlID0+IHsgZS5mcm9tICs9IHJvdDsgZS50byArPSByb3Q7IH0pO1xyXG5cdFx0cmV0dXJuIHRoaXMubm9ybWFsaXplKCk7XHJcblx0fVxyXG5cclxuXHRub3JtYWxpemUoKSB7XHJcblx0XHR0aGlzLmFyZWFzID0gdGhpcy5hcmVhcy5tYXAoZSA9PiB7XHJcblx0XHRcdGlmIChlLmZyb20gPCAwIHx8IGUudG8gPCAwKSB7IGUuZnJvbSArPSAyNDsgZS50byArPSAyNDsgfVxyXG5cdFx0XHRpZiAoZS5mcm9tID49IDI0ICYmIGUudG8gPj0gMjQpIHsgZS5mcm9tIC09IDI0OyBlLnRvIC09IDI0OyB9XHJcblx0XHRcdHJldHVybiBlO1xyXG5cdFx0fSkuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRpZiAoYS5mcm9tICE9IGIuZnJvbSkgcmV0dXJuIGEuZnJvbSAtIGIuZnJvbTtcclxuXHRcdFx0aWYgKGEudG8gIT0gYi50bykgcmV0dXJuIGEudG8gLSBiLnRvO1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5xdWFkcyA9IHRoaXMucXVhZHMubWFwKGUgPT4ge1xyXG5cdFx0XHRpZiAoZS5mcm9tIDwgMCB8fCBlLnRvIDwgMCkgeyBlLmZyb20gKz0gMjQ7IGUudG8gKz0gMjQ7IH1cclxuXHRcdFx0aWYgKGUuZnJvbSA+PSAyNCAmJiBlLnRvID49IDI0KSB7IGUuZnJvbSAtPSAyNDsgZS50byAtPSAyNDsgfVxyXG5cdFx0XHRyZXR1cm4gZTtcclxuXHRcdH0pLnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0aWYgKGEuZnJvbSAhPSBiLmZyb20pIHJldHVybiBhLmZyb20gLSBiLmZyb207XHJcblx0XHRcdGlmIChhLnRvICE9IGIudG8pIHJldHVybiBhLnRvIC0gYi50bztcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuY3V0cyA9IHRoaXMuY3V0cy5tYXAoZSA9PiB7XHJcblx0XHRcdGlmIChlLmZyb20gPCAwKSB7IGUuZnJvbSArPSAyNDsgfVxyXG5cdFx0XHRpZiAoZS5mcm9tID49IDI0KSB7IGUuZnJvbSAtPSAyNDsgfVxyXG5cdFx0XHRyZXR1cm4gZTtcclxuXHRcdH0pLnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0aWYgKGEuZnJvbSAhPSBiLmZyb20pIHJldHVybiBhLmZyb20gLSBiLmZyb207XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGNhblN0YWNrV2l0aChsYXllcjogU3pMYXllcikge1xyXG5cdFx0Ly8gY2FuIHN0YWNrIGlmOiBcclxuXHR9XHJcblx0c3RhY2tXaXRoKGxheWVyOiBTekxheWVyKSB7XHJcblxyXG5cdH1cclxuXHJcblx0c3RhdGljIGZyb21TaGFwZXpIYXNoKGhhc2g6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgY29sb3JzOiBSZWNvcmQ8c3RyaW5nLCBjb2xvcj4gPSB7IHU6ICdncmV5JywgcjogJ3JlZCcsIGI6ICdibHVlJywgZzogJ2dyZWVuJyB9O1xyXG5cdFx0Y29uc3Qgc2hhcGVzOiBSZWNvcmQ8c3RyaW5nLCBxdWFkU2hhcGU+ID0geyBDOiAnY2lyY2xlJywgUjogJ3NxdWFyZScsIFM6ICdzdGFyJywgfTtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7XHJcblx0XHRcdGFyZWFzOiBbXSxcclxuXHRcdFx0cXVhZHM6IGhhc2gubWF0Y2goLy4uL2cpIS5tYXAoKHMsIGkpID0+IHtcclxuXHRcdFx0XHRpZiAoc1swXSA9PSAnLScpIHJldHVybiBudWxsIGFzIGFueSBhcyBTekxheWVyUXVhZDtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFN6TGF5ZXJRdWFkKHtcclxuXHRcdFx0XHRcdHNoYXBlOiBzaGFwZXNbc1swXV0sXHJcblx0XHRcdFx0XHRjb2xvcjogY29sb3JzW3NbMV1dLFxyXG5cdFx0XHRcdFx0ZnJvbTogaSAqIDYsXHJcblx0XHRcdFx0XHR0bzogKGkgKyAxKSAqIDYsXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pLmZpbHRlcihlID0+IGUpLFxyXG5cdFx0XHRjdXRzOiBbXSxcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGxvZyguLi5hOiBhbnlbXSkge1xyXG5cdGNvbnNvbGUuZXJyb3IoLi4uYSk7XHJcblx0Zm9yIChsZXQgbyBvZiBhKVxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoSlNPTi5zdHJpbmdpZnkobykpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8gdHJ5IHtcclxuLy8gXHRoYXNoRm9yRWFjaCh0ZXN0SGFzaCwgJ3NoYXBlcycsIGRyYXdTaGFwZSwgc2N0eCk7XHJcbi8vIFx0aGFzaEZvckVhY2godGVzdEhhc2gsICdjdXRzJywgZHJhd0N1dCwgc2N0eCk7XHJcbi8vIFx0Y2xpcFNoYXBlcyh0ZXN0SGFzaCwgc2N0eCk7XHJcbi8vIFx0Ly8gaGFzaEZvckVhY2godGVzdEhhc2gsICdhcmVhcycsIGRyYXdBcmVhLCBzY3R4KTtcclxuLy8gfSBjYXRjaCAoZTogYW55KSB7XHJcbi8vIFx0bG9nKCdlcnJvcjogJywgZS5zdGFjayk7XHJcbi8vIH1cclxuXHJcbi8vIGN0eC5nbG9iYWxBbHBoYSA9IDAuNDtcclxuLy8gY3R4LmZpbGxSZWN0KC0yLCAtMiwgNCwgNCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8gZnVuY3Rpb24gaGFzaEZvckVhY2g8SyBleHRlbmRzIGtleW9mIFN6RGVmaW5pdGlvbj4oXHJcbi8vIFx0aGFzaDogU3pEZWZpbml0aW9uLCBrOiBLLFxyXG4vLyBcdG1hcHBlcjogKGU6IFN6RGVmaW5pdGlvbltLXVswXSwgaTogbnVtYmVyLCBoYXNoOiBTekRlZmluaXRpb24sIGN0eDogU3pDb250ZXh0MkQpID0+IHZvaWQsXHJcbi8vIFx0Y3R4OiBTekNvbnRleHQyRCxcclxuLy8gKSB7XHJcbi8vIFx0aGFzaFtrXS5tYXAoKGUsIGkpID0+IHtcclxuLy8gXHRcdGN0eC5zYXZlKCk7XHJcbi8vIFx0XHRtYXBwZXIoZSwgaSwgaGFzaCwgY3R4KTtcclxuLy8gXHRcdGN0eC5yZXN0b3JlKCk7XHJcbi8vIFx0fSk7XHJcbi8vIH0iXX0=