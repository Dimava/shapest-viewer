// import { globalConfig } from "shapez/core/config";
// import { smoothenDpi } from "shapez/core/dpi_manager";
// import { DrawParameters } from "shapez/core/draw_utils";
// import { ShapeItem } from "shapez/game/items/shape_item";
// import { THEME } from "shapez/game/theme";
// import { types } from "shapez/savegame/serialization";
// import { ShapestDefinition } from "./definition";
// import { ShapestLayer } from "./layers/layer";
// import { Pi2, shapeHash } from "./types";

import { DrawParameters } from "shapez/core/draw_parameters";
import { BaseItem } from "shapez/game/base_item";
import { ShapeItem } from "shapez/game/items/shape_item";
import { GameRoot } from "shapez/game/root";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { types } from "shapez/savegame/serialization";
import { SzDefinition } from "./definition";
import { SzLayer } from "./layer";


export class SzItem extends ShapeItem implements ShapeItem {
	static getId() {
		return 'szItem';
	}
	// @ts-ignore
	definition!: SzDefinition;
	constructor(definition: SzDefinition) {
		super(null as any);
		this.definition = definition;
		this.definition.getHash();
	}
	static getSchema() {
        return types.string;
    }
	getItemType() {
		return 'shape';
	}
	equals(other: BaseItem): boolean {
		return other.getItemType() == this.getItemType() && (other as SzItem).definition == this.definition;
	}
	drawItemCenteredClipped(x: number, y: number, parameters: DrawParameters, diameter?: number): void {
		if (!parameters.visibleRect.containsCircle(x, y, diameter! / 2)) return;
		if (!diameter) throw new Error();
		this.drawItemCenteredImpl(x, y, parameters, diameter);
	}
	getBackgroundColorAsResource(): string {
		throw new Error("Method not implemented.");
	}


	static deserialize(data: any): SzItem {
		console.log('deserialize', data);
		return new SzItem(
			new SzDefinition(
				JSON.parse(data),
			)
		);
	}
	serialize(): string | number | object {
		return JSON.stringify(this.definition);
		// debugger;
		return this.definition.serialize();
		throw new Error("Method not implemented.");
	}
	// deserialize(data: any, root?: GameRoot): string | void {
	// 	throw new Error("Method not implemented.");
	// }


	getAsCopyableKey(): string {
		throw new Error("Method not implemented.");
	}
	equalsImpl(other: BaseItem): boolean {
		throw new Error("Method not implemented.");
	}
	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number): void {
		throw new Error("Method not implemented.");
	}
	drawItemCenteredImpl(x: number, y: number, parameters: DrawParameters, diameter: number): void {
		this.definition.drawCentered(x, y, parameters, diameter);
	}

}


// export class ShapestItem extends ShapeItem {
// 	static getId() {
// 		return "shapest";
// 	}
// 	static getSchema() {
// 		return types.string;
// 	}
// 	static isValidShortKey(hash: shapeHash) {
// 		return hash.split(':').every(e => ShapestLayer.isValidKey(e));
// 	}
// 	static fromShortKey(hash: shapeHash) {
// 		return new ShapestItem(hash);
// 	}
// 	hash: shapeHash;
// 	constructor(hash: shapeHash) {
// 		super(null as any);
// 		this.hash = hash;
// 	}
// 	serialize() { return this.hash; }
// 	deserialize(data: string) { this.hash = data; }
// 	// @ts-ignore
// 	get definition() {
// 		return new ShapestDefinition(this.hash);
// 	}
// 	set definition(d: any) { }

// 	drawItemCenteredImpl(x: number, y: number, parameters: DrawParameters, diameter: number) {
// 		this.drawCentered(x, y, parameters, diameter);
// 	}

// 	/**
// 	 * Draws the shape definition
// 	 */
// 	drawCentered(x: number, y: number, parameters: DrawParameters, diameter = 20) {
// 		const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
// 		const key = diameter + "/" + dpi + "/" + this.hash;
// 		const canvas = parameters.root.buffers.getForKey({
// 			key: "shapedef",
// 			subKey: key,
// 			w: diameter,
// 			h: diameter,
// 			dpi,
// 			redrawMethod: this.internalGenerateShapeBuffer.bind(this),
// 		});
// 		parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);
// 	}



// 	getItemType() { return "shape" as const; }
// 	getAsCopyableKey(): string { return this.hash; }
// 	getHash(): string { return this.hash; }
// 	equalsImpl(other: ShapestItem) { return this.hash == other.hash; }
// 	getBackgroundColorAsResource() {
// 		return THEME.map.resources.shape;
// 	}

// 	/** Draws the item to a canvas */
// 	drawFullSizeOnCanvas(context: CanvasRenderingContext2D, size: number) {
// 		this.internalGenerateShapeBuffer(null, context, size, size, 1);
// 	}

// 	// /**
// 	//  * @param {number} x
// 	//  * @param {number} y
// 	//  * @param {DrawParameters} parameters
// 	//  * @param {number=} diameter
// 	//  */
// 	// drawItemCenteredImpl(x, y, parameters, diameter = globalConfig.defaultItemDiameter) {
// 	//     this.drawCentered(x, y, parameters, diameter);
// 	// }

// 	// /**
// 	//  * Draws the shape definition
// 	//  * @param {number} x
// 	//  * @param {number} y
// 	//  * @param {DrawParameters} parameters
// 	//  * @param {number=} diameter
// 	//  */
// 	// drawCentered(x, y, parameters, diameter = 20) {
// 	//     const dpi = smoothenDpi(globalConfig.shapesSharpness * parameters.zoomLevel);
// 	//     const key = diameter + "/" + dpi + "/" + this.hash;
// 	//     const canvas = parameters.root.buffers.getForKey({
// 	//         key: "shapedef",
// 	//         subKey: key,
// 	//         w: diameter,
// 	//         h: diameter,
// 	//         dpi,
// 	//         redrawMethod: this.internalGenerateShapeBuffer.bind(this),
// 	//     });
// 	//     parameters.context.drawImage(canvas, x - diameter / 2, y - diameter / 2, diameter, diameter);
// 	// }


// 	internalGenerateShapeBuffer(canvas: HTMLCanvasElement | null, context: CanvasRenderingContext2D, w: number, h: number, dpi: number) {
// 		context.translate((w * dpi) / 2, (h * dpi) / 2);
// 		context.scale((dpi * w) / 2.3, (dpi * h) / 2.3);

// 		context.fillStyle = "#e9ecf7";

// 		context.fillStyle = THEME.items.circleBackground;
// 		context.beginPath();
// 		context.arc(0, 0, 1.15, 0, Pi2);
// 		context.fill();

// 		for (let layer of this.layers) {
// 			context.save();

// 			context.strokeStyle = THEME.items.outline;
// 			context.lineWidth = THEME.items.outlineWidth / 10;
// 			context.miterLimit = 2;
// 			context.textAlign = "center";
// 			context.textBaseline = "middle";

// 			layer.draw(context)

// 			context.restore();
// 		}
// 	}

// 	// /**
// 	//  * Generates this shape as a canvas
// 	//  * @param {number} size
// 	//  */
// 	// generateAsCanvas(size = 120) {
// 	//     const [canvas, context] = makeOffscreenBuffer(size, size, {
// 	//         smooth: true,
// 	//         label: "definition-canvas-cache-" + this.getHash(),
// 	//         reusable: false,
// 	//     });

// 	//     this.internalGenerateShapeBuffer(canvas, context, size, size, 1);
// 	//     return canvas;
// 	// }

// 	// /**
// 	//  * @returns {ShapestItemDefinition}
// 	//  */
// 	// get do() {
// 	//     return new ShapestItemDefinition(this);
// 	// }
// 	// /**
// 	//  * @returns {ShapestItemDefinition}
// 	//  */
// 	// get definition() {
// 	//     return new ShapestItemDefinition(this);
// 	// }
// 	// set definition(v) { }


// 	get layers() {
// 		return this.hash.split(':').map((e, i) => ShapestLayer.fromShape(this.hash, i));
// 	}

// 	// cloneRotateCW
// }