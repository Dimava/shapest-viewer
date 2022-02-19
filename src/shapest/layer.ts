import { char, rotation24, styleString, SzContext2D } from "./SzContext2D.js";



export type cutShape = (
	| 'line'
);
export type quadShape = (
	| 'circle' | 'square' | 'star'
);
export type areaShape = (
	| 'whole' | 'sector'
);
export type color =
	| 'red' | 'orange' | 'yellow'
	| 'lawngreen' | 'green' | 'cyan'
	| 'blue' | 'purple' | 'pink'
	| 'black' | 'grey' | 'white'
	| `#${string}`;


export namespace SzInfo {
	export namespace color {
		const colorWheelNameList = [
			'red', 'orange', 'yellow',
			'lawngreen', 'green', 'cyan',
			'blue', 'purple', 'pink',
		] as const;
		const colorGreyNameList = [
			'black', 'grey', 'white',
		] as const;

		export type colorInfo = { name: color, style: styleString, code: char };

		export const list: colorInfo[] =
			[...colorWheelNameList, ...colorGreyNameList].map((name, i) => ({
				name, style: name, code: name[0],
			}));

		export const colorList = list.map(e => e.name);

		export const byName: Record<color, colorInfo> = Object.fromEntries(list.map(e => [e.name, e] as const));
		export const byChar: Record<char, colorInfo> = Object.fromEntries(list.map(e => [e.code, e] as const));

		export function exampleLayer(color: color) {
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
	}
	export namespace quad {
		export type quadInfo = { name: quadShape, code: char };
		export const list: quadInfo[] = [
			{ name: 'circle', code: 'C' },
			{ name: 'square', code: 'R' },
			{ name: 'star', code: 'S' },
		];

		export function exampleLayer(shape: quadShape) {
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

		export const extraShapes: Record<string, (ctx: SzContext2D, quad: SzLayerQuad) => void> = {
			clover(ctx: SzContext2D) {
				// begin({ size: 1.3, path: true, zero: true });
				// const inner = 0.5;
				// const inner_center = 0.45;
				// context.lineTo(0, inner);
				// context.bezierCurveTo(0, 1, inner, 1, inner_center, inner_center);
				// context.bezierCurveTo(1, inner, 1, 0, inner, 0);
			},
			star8(ctx: SzContext2D, { from, to }: SzLayerQuad) {
				const r = 1.22 / 2, R = 1.22, d = (n: number) => from * (1 - n) + to * n;
				ctx
					.lineToR(r, d(0))
					.lineToR(R, d(0.25))
					.lineToR(r, d(0.5))
					.lineToR(R, d(0.75))
					.lineToR(r, d(1))
			},
			rhombus(ctx: SzContext2D) {
			},
			plus(ctx: SzContext2D, { from, to }: SzLayerQuad) {
				const r = 0.4, R = 1.0, d = (n: number) => from * (1 - n) + to * n;
				const rr = (r1: number, r2: number) => (r1 * r1 + r2 * r2) ** 0.5
				const at = (a: number, b: number) => Math.atan2(b, a) / Math.PI * 2;
				const tor = (r: number, R: number) => [rr(r, R), d(at(r, R))] as const;
				ctx
					.lineToR(...tor(R, 0))
					.lineToR(...tor(R, r))
					.lineToR(...tor(r, r))
					.lineToR(...tor(r, R))
					.lineToR(...tor(0, R))
			},
			saw(ctx: SzContext2D) {
			},
			sun(ctx: SzContext2D) {
			},
			leaf(ctx: SzContext2D) {
			},
			diamond(ctx: SzContext2D) {
			},
			mill(ctx: SzContext2D) {
			},
			halfleaf(ctx: SzContext2D) {
			},
			yinyang(ctx: SzContext2D) {
			},
			octagon(ctx: SzContext2D) {
			},
		}

		Object.entries(extraShapes).map(([k, v]) => list.push({ name: k } as any));

		export const quadList = list.map(e => e.name);
	}

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
}



export interface ISzLayer {
	cuts: ({
		shape: cutShape,
		from: rotation24, to: rotation24,
		color: color,
	})[];
	quads: ({
		shape: quadShape,
		from: rotation24, to: rotation24,
		color: color,
	})[];
	areas: ({
		shape: areaShape,
		color: color,
		from: rotation24, to: rotation24,
	})[];
}


export class SzLayerCut {
	shape: cutShape = 'line';
	color: color = 'black';

	from: rotation24 = 0; to: rotation24 = 0;
	constructor(source: Partial<SzLayerCut>) {
		Object.assign(this, source);
	}
	get smallRadius() {
		return 0.0001;
	}
	pathInside(ctx: SzContext2D) {
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
	pathOutsize(ctx: SzContext2D) {
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
	shape: quadShape = 'circle';
	color: color = 'black';

	from: rotation24 = 0; to: rotation24 = 0;
	constructor(source: Partial<SzLayerQuad>) {
		Object.assign(this, source);
	}
	outerPath(ctx: SzContext2D) {
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
	shape: areaShape = 'whole';
	color: color = 'black';

	from: rotation24 = 0; to: rotation24 = 0;
	constructor(source: Partial<SzLayerArea>) {
		Object.assign(this, source);
	}
	outerPath(ctx: SzContext2D) {
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
	clip(ctx: SzContext2D) {
		this.outerPath(ctx);
		ctx.clip();
	}
	fill(ctx: SzContext2D) {
		this.outerPath(ctx);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

const testTemplate: ISzLayer = {
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
}



export class SzLayer implements ISzLayer {
	layerIndex = 0;
	cuts: SzLayerCut[] = [];
	quads: SzLayerQuad[] = [];
	areas: SzLayerArea[] = [];


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

	constructor(source?: Partial<ISzLayer>, layerIndex?: number) {
		if (source) {
			this.cuts = (source.cuts ?? []).map(e => new SzLayerCut(e));
			this.quads = (source.quads ?? []).map(e => new SzLayerQuad(e));
			this.areas = (source.areas ?? []).map(e => new SzLayerArea(e));
			if ((source as SzLayer).layerIndex) {
				this.layerIndex = (source as SzLayer).layerIndex;
			}
		}
		if (layerIndex) {
			this.layerIndex = layerIndex;
		}
	}

	drawCenteredLayerScaled(ctx: SzContext2D, layerIndex?: number) {
		layerIndex ??= this.layerIndex;
		let scale = 1 - 0.22 * layerIndex;
		ctx.saved(ctx => {
			ctx.scale(scale);
			this.drawCenteredNormalized(ctx);
		});
	}

	drawCenteredNormalized(ctx: SzContext2D) {
		ctx.saved(ctx => {
			this.clipShapes(ctx);
			this.quads.forEach(q => ctx.saved(ctx => this.fillQuad(q, ctx)));

			this.cuts.forEach(c => ctx.saved(ctx => this.strokeCut(c, ctx)));

			this.areas.forEach(a => ctx.saved(ctx => this.fillArea(a, ctx)));
		});
		ctx.saved(ctx => this.drawQuadOutline(ctx, true));
	}




	strokeCut(cut: SzLayerCut, ctx: SzContext2D) {
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = cut.color;
		ctx.beginPath();

		if (cut.shape == 'line') {
			ctx.rotate(cut.from);
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 1);
			ctx.stroke();
		} else {
			throw log('bad cut', cut);
		}

	}
	fillQuad(quad: SzLayerQuad, ctx: SzContext2D) {
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = ctx.fillStyle = quad.color;

		ctx.beginPath();
		ctx.moveTo(0, 0);
		quad.outerPath(ctx);
		ctx.fill();
	}

	fillArea(area: SzLayerArea, ctx: SzContext2D) {
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = ctx.fillStyle = area.color;

		area.clip(ctx);
		ctx.fill();
	}

	fullQuadPath(ctx: SzContext2D, withCuts?: boolean) {
		ctx.beginPath();
		for (let i = 0; i < this.quads.length; i++) {
			let prev = i > 0 ? this.quads[i - 1] : this.quads.slice(-1)[0];
			let shape = this.quads[i];
			if (withCuts || shape.from != prev.to % 24) ctx.lineTo(0, 0);
			shape.outerPath(ctx);
		}
		ctx.closePath();
	}

	drawQuadOutline(ctx: SzContext2D, withCuts?: boolean) {
		this.fullQuadPath(ctx, withCuts);
		ctx.lineWidth = 0.05;
		ctx.strokeStyle = 'orange';
		ctx.stroke();
	}

	clipShapes(ctx: SzContext2D) {
		this.fullQuadPath(ctx);
		ctx.clip();
	}




	clone() {
		return new SzLayer(this);
	}

	rotate(rot: rotation24) {
		this.areas.map(e => { e.from += rot; e.to += rot; });
		this.cuts.map(e => { e.from += rot; });
		this.quads.map(e => { e.from += rot; e.to += rot; });
		return this.normalize();
	}

	normalize() {
		this.areas = this.areas.map(e => {
			if (e.from < 0 || e.to < 0) { e.from += 24; e.to += 24; }
			if (e.from >= 24 && e.to >= 24) { e.from -= 24; e.to -= 24; }
			return e;
		}).sort((a, b) => {
			if (a.from != b.from) return a.from - b.from;
			if (a.to != b.to) return a.to - b.to;
			return 0;
		});
		this.quads = this.quads.map(e => {
			if (e.from < 0 || e.to < 0) { e.from += 24; e.to += 24; }
			if (e.from >= 24 && e.to >= 24) { e.from -= 24; e.to -= 24; }
			return e;
		}).sort((a, b) => {
			if (a.from != b.from) return a.from - b.from;
			if (a.to != b.to) return a.to - b.to;
			return 0;
		});
		this.cuts = this.cuts.map(e => {
			if (e.from < 0) { e.from += 24; }
			if (e.from >= 24) { e.from -= 24; }
			return e;
		}).sort((a, b) => {
			if (a.from != b.from) return a.from - b.from;
			return 0;
		});
		return this;
	}

	canStackWith(layer: SzLayer) {
		// can stack if: 
	}
	stackWith(layer: SzLayer) {

	}

	static fromShapezHash(hash: string) {
		const colors: Record<string, color> = { u: 'grey', r: 'red', b: 'blue', g: 'green' };
		const shapes: Record<string, quadShape> = { C: 'circle', R: 'square', S: 'star', };
		return new SzLayer({
			areas: [],
			quads: hash.match(/../g)!.map((s, i) => {
				if (s[0] == '-') return null as any as SzLayerQuad;
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


function log(...a: any[]) {
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