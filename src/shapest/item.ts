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


export class SzShapeItem extends ShapeItem implements ShapeItem {
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
		return other.getItemType() == this.getItemType() && (other as SzShapeItem).definition == this.definition;
	}
	drawItemCenteredClipped(x: number, y: number, parameters: DrawParameters, diameter?: number): void {
		if (!parameters.visibleRect.containsCircle(x, y, diameter! / 2)) return;
		if (!diameter) throw new Error();
		this.drawItemCenteredImpl(x, y, parameters, diameter);
	}
	getBackgroundColorAsResource(): string {
		throw new Error("Method not implemented.");
	}


	static deserialize(data: any): SzShapeItem {
		console.log('deserialize', data);
		return new SzShapeItem(
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

