import { globalConfig } from "shapez/core/config";
import { smoothenDpi } from "shapez/core/dpi_manager";
import { DrawParameters } from "shapez/core/draw_parameters";
import { GameRoot } from "shapez/game/root";
import { ShapeDefinition, ShapeLayer } from "shapez/game/shape_definition";
import { THEME } from "shapez/game/theme";
import { Mod } from "shapez/mods/mod";
import { BasicSerializableObject } from "shapez/savegame/serialization";
import { override, strToH } from "../common";
import { color, SzInfo, SzLayer } from "./layer";
import { rmode, SzContext2D } from "./SzContext2D";


export class SzDefinition extends BasicSerializableObject implements ShapeDefinition {
	static getId() {
		return "sz-definition";
	}

	get isSz() { return true; }
	static createTest() {
		return new SzDefinition({
			layers: [SzLayer.createTest()],
		});
	}



	constructor(data?: { layers: SzLayer[] }) {
		super();
		if (data?.layers) this.layers = data.layers.map((e, i) => new SzLayer(e, i));
		if (!this.layers.every(e => e.isNormalized())) {
			this.layers = SzDefinition.createTest().layers;
		}
		console.log(this.getHash())
	}
	layers: SzLayer[] = [];
	cachedHash: string = '';
	bufferGenerator: any;
	getClonedLayers(): ShapeLayer[] {
		throw new Error("Method not implemented.");
	}
	isEntirelyEmpty(): boolean {
		return this.layers.every(e => e.isEmpty());
	}
	getHash(): string {
		if (this.cachedHash) return this.cachedHash;
		return this.cachedHash = 'sz!' + this.layers.map(e => e.getHash()).join(':');
		// return this.cachedHash = 'sz!' + strToH(JSON.stringify(this.layers));
	}
	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number): void {
		throw new Error("Method not implemented.");
	}
	generateAsCanvas(size?: number): HTMLCanvasElement {
		throw new Error("Method not implemented.");
	}
	cloneFilteredByQuadrants(includeQuadrants: number[]): ShapeDefinition {
		let layers = this.layers.map(e => e.cloneFilteredByQuadrants(includeQuadrants)).filter(e => !e.isEmpty());
		return new SzDefinition({ layers });
	}
	cloneRotateCW(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(6))
		});
	}
	cloneRotateCCW(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(24 - 8))
		});
	}
	cloneRotate180(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(12))
		});
	}
	cloneAndStackWith(upper: SzDefinition): ShapeDefinition {
		let bottom = this.clone(e => e.removeCover()).layers;
		let top = upper.clone().layers;
		let dh = 0;
		while (!bottom.every((l, i) => {
			return l.canStackWith(top[i - dh]);
		})) dh++;
		let overlap = bottom.length - dh;
		let newLayers = bottom.map((l, i) => {
			return l.stackWith(top[i + dh]);
		}).concat(top.slice(
			overlap
		));
		return new SzDefinition({ layers: newLayers.slice(0, 4) });
	}

	cloneAndPaintWith(color: color): SzDefinition {
		let rawPaints = Array<color | null>(24).fill(color);
		return this.clone((l, i, a) => {
			let paints = a.slice(i).reduceRight((v, e) => e.filterPaint(v), rawPaints);
			return l.removeCover().paint(paints);
		});
	}

	cloneAndPaintWith4Colors(colors: [string, string, string, string]): ShapeDefinition {
		throw new Error("Method not implemented.");
	}

	cloneAndMakeCover() {
		return new SzDefinition({ layers: this.layers.map(e => e.cloneAsCover()) })
	}


	clone(layerMapper?: (layer: SzLayer, i: number, a: SzLayer[]) => SzLayer | SzLayer[] | null) {
		if (layerMapper) {
			return new SzDefinition({
				layers: this.layers.map(e => e.clone()).flatMap((e, i, a) => {
					return layerMapper(e, i, a) || [];
				}).filter(e => !e.isEmpty())
			});
		}
		return new SzDefinition(this);
	}
	// serialize(): string | number | object {
	// 	return JSON.stringify(this.layers);
	// 	throw new Error("Method not implemented.");
	// }
	// deserialize(data: any, root?: GameRoot): string | void {
	// 	debugger;
	// 	throw new Error("Method not implemented.");
	// }




	// inherited
	drawCentered(x: number, y: number, parameters: DrawParameters, diameter: number): void {
		const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
		if (!this.bufferGenerator) {
			this.bufferGenerator = this.internalGenerateShapeBuffer.bind(this);
		}
		const key = diameter + "/" + dpi + "/" + this.cachedHash;
		const canvas = parameters.root.buffers.getForKey({
			key: "shapedef",
			subKey: key,
			w: diameter,
			h: diameter,
			dpi,
			redrawMethod: this.bufferGenerator,
		});
		parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);
	}


	internalGenerateShapeBuffer(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, w: number, h: number, dpi: number): void {
		// prepare context
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 0.05;

		ctx.translate((w * dpi) / 2, (h * dpi) / 2);
		ctx.scale((dpi * w) / 2.3, (dpi * h) / 2.3);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = THEME.items.outline;
		ctx.lineWidth = THEME.items.outlineWidth / 10;

		ctx.rotate(-Math.PI / 2);

		ctx.fillStyle = THEME.items.circleBackground;
		ctx.beginPath();
		ctx.arc(0, 0, 1.15, 0, 2 * Math.PI);
		ctx.fill();

		let sCtx = new SzContext2D(ctx);
		this.layers.forEach((l, i) => l.drawCenteredLayerScaled(sCtx, i));

	}

	static fromRawShape(shapeDefinition: ShapeDefinition) {
		return new SzDefinition({
			layers: shapeDefinition.getHash().split(':').map(e => SzLayer.fromShapezHash(e))
		});
	}

	static fromShortKey(key: string): ShapeDefinition {
		if (!key.startsWith('sz!')) throw 0;
		return new SzDefinition({
			layers: key.slice('sz!'.length).split(':').map(e => SzLayer.fromShortKey(e))
		})
	}

	install(mod: Mod) {
		mod.modInterface.extendObject(ShapeDefinition, ({ $old }) => ({
			fromShortKey(key: string) {
				if (key.startsWith('sz!')) {
					return SzDefinition.fromShortKey(key);
				}
				return $old.fromShortKey.call(this, key);
			}
		}));
	}
}

