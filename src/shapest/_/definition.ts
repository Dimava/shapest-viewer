import { globalConfig } from "shapez/core/config";
import { smoothenDpi } from "shapez/core/dpi_manager";
import { DrawParameters } from "shapez/core/draw_parameters";
import { GameRoot, layers } from "shapez/game/root";
import { ShapeDefinition, ShapeLayer } from "shapez/game/shape_definition";
import { THEME } from "shapez/game/theme";
import { BasicSerializableObject } from "shapez/savegame/serialization";
import { strToH } from "../common";
import { SzLayer } from "./layer";
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
		if (data?.layers) this.layers = data.layers.map(e => new SzLayer(e));
	}
	layers: SzLayer[] = [];
	cachedHash: string = '';
	bufferGenerator: any;
	getClonedLayers(): ShapeLayer[] {
		throw new Error("Method not implemented.");
	}
	isEntirelyEmpty(): boolean {
		throw new Error("Method not implemented.");
	}
	getHash(): string {
		if (this.cachedHash) return this.cachedHash;
		return this.cachedHash = 'sz!' + strToH(JSON.stringify(this.layers));
	}
	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number): void {
		throw new Error("Method not implemented.");
	}
	generateAsCanvas(size?: number): HTMLCanvasElement {
		throw new Error("Method not implemented.");
	}
	cloneFilteredByQuadrants(includeQuadrants: number[]): ShapeDefinition {
		throw new Error("Method not implemented.");
	}
	cloneRotateCW(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(6))
		});
	}
	cloneRotateCCW(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(18))
		});
	}
	cloneRotate180(): ShapeDefinition {
		return new SzDefinition({
			layers: this.layers.map(l => l.clone().rotate(12))
		});
	}
	cloneAndStackWith(definition: ShapeDefinition): ShapeDefinition {
		throw new Error("Method not implemented.");
	}
	cloneAndPaintWith(color: string): ShapeDefinition {
		throw new Error("Method not implemented.");
	}
	cloneAndPaintWith4Colors(colors: [string, string, string, string]): ShapeDefinition {
		throw new Error("Method not implemented.");
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
		this.layers.forEach(l => l.drawCenteredNormalized(sCtx));

		let layerIndex = 0;
		const layerScale = Math.max(0.1, 0.9 - layerIndex * 0.22);


	}
}