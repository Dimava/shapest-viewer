import { globalConfig } from "shapez/core/config";
import { smoothenDpi } from "shapez/core/dpi_manager";
import { THEME } from "shapez/game/theme";
import { BasicSerializableObject } from "shapez/savegame/serialization";
import { strToH } from "../common";
import { SzLayer } from "./layer";
import { SzContext2D } from "./SzContext2D";
export class SzDefinition extends BasicSerializableObject {
    static getId() {
        return "sz-definition";
    }
    get isSz() { return true; }
    static createTest() {
        return new SzDefinition({
            layers: [SzLayer.createTest()],
        });
    }
    constructor(data) {
        super();
        if (data?.layers)
            this.layers = data.layers.map(e => new SzLayer(e));
    }
    layers = [];
    cachedHash = '';
    bufferGenerator;
    getClonedLayers() {
        throw new Error("Method not implemented.");
    }
    isEntirelyEmpty() {
        throw new Error("Method not implemented.");
    }
    getHash() {
        if (this.cachedHash)
            return this.cachedHash;
        return this.cachedHash = 'sz!' + strToH(JSON.stringify(this.layers));
    }
    drawFullSizeOnCanvas(context, size) {
        throw new Error("Method not implemented.");
    }
    generateAsCanvas(size) {
        throw new Error("Method not implemented.");
    }
    cloneFilteredByQuadrants(includeQuadrants) {
        throw new Error("Method not implemented.");
    }
    cloneRotateCW() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(6))
        });
    }
    cloneRotateCCW() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(18))
        });
    }
    cloneRotate180() {
        return new SzDefinition({
            layers: this.layers.map(l => l.clone().rotate(12))
        });
    }
    cloneAndStackWith(definition) {
        throw new Error("Method not implemented.");
    }
    cloneAndPaintWith(color) {
        throw new Error("Method not implemented.");
    }
    cloneAndPaintWith4Colors(colors) {
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
    drawCentered(x, y, parameters, diameter) {
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
    internalGenerateShapeBuffer(canvas, ctx, w, h, dpi) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zaGFwZXN0L18vZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBSXRELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN4RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ25DLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEMsT0FBTyxFQUFTLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUduRCxNQUFNLE9BQU8sWUFBYSxTQUFRLHVCQUF1QjtJQUN4RCxNQUFNLENBQUMsS0FBSztRQUNYLE9BQU8sZUFBZSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFDLFVBQVU7UUFDaEIsT0FBTyxJQUFJLFlBQVksQ0FBQztZQUN2QixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDOUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUlELFlBQVksSUFBNEI7UUFDdkMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLElBQUksRUFBRSxNQUFNO1lBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNELE1BQU0sR0FBYyxFQUFFLENBQUM7SUFDdkIsVUFBVSxHQUFXLEVB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RTlDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXpCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWCxJQUFJLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXpELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRzNELENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdsb2JhbENvbmZpZyB9IGZyb20gXCJzaGFwZXovY29yZS9jb25maWdcIjtcclxuaW1wb3J0IHsgc21vb3RoZW5EcGkgfSBmcm9tIFwic2hhcGV6L2NvcmUvZHBpX21hbmFnZXJcIjtcclxuaW1wb3J0IHsgRHJhd1BhcmFtZXRlcnMgfSBmcm9tIFwic2hhcGV6L2NvcmUvZHJhd19wYXJhbWV0ZXJzXCI7XHJcbmltcG9ydCB7IEdhbWVSb290LCBsYXllcnMgfSBmcm9tIFwic2hhcGV6L2dhbWUvcm9vdFwiO1xyXG5pbXBvcnQgeyBTaGFwZURlZmluaXRpb24sIFNoYXBlTGF5ZXIgfSBmcm9tIFwic2hhcGV6L2dhbWUvc2hhcGVfZGVmaW5pdGlvblwiO1xyXG5pbXBvcnQgeyBUSEVNRSB9IGZyb20gXCJzaGFwZXovZ2FtZS90aGVtZVwiO1xyXG5pbXBvcnQgeyBCYXNpY1NlcmlhbGl6YWJsZU9iamVjdCB9IGZyb20gXCJzaGFwZXovc2F2ZWdhbWUvc2VyaWFsaXphdGlvblwiO1xyXG5pbXBvcnQgeyBzdHJUb0ggfSBmcm9tIFwiLi4vY29tbW9uXCI7XHJcbmltcG9ydCB7IFN6TGF5ZXIgfSBmcm9tIFwiLi9sYXllclwiO1xyXG5pbXBvcnQgeyBybW9kZSwgU3pDb250ZXh0MkQgfSBmcm9tIFwiLi9TekNvbnRleHQyRFwiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTekRlZmluaXRpb24gZXh0ZW5kcyBCYXNpY1NlcmlhbGl6YWJsZU9iamVjdCBpbXBsZW1lbnRzIFNoYXBlRGVmaW5pdGlvbiB7XHJcblx0c3RhdGljIGdldElkKCkge1xyXG5cdFx0cmV0dXJuIFwic3otZGVmaW5pdGlvblwiO1xyXG5cdH1cclxuXHJcblx0Z2V0IGlzU3ooKSB7IHJldHVybiB0cnVlOyB9XHJcblx0c3RhdGljIGNyZWF0ZVRlc3QoKSB7XHJcblx0XHRyZXR1cm4gbmV3IFN6RGVmaW5pdGlvbih7XHJcblx0XHRcdGxheWVyczogW1N6TGF5ZXIuY3JlYXRlVGVzdCgpXSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcihkYXRhPzogeyBsYXllcnM6IFN6TGF5ZXJbXSB9KSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0aWYgKGRhdGE/LmxheWVycykgdGhpcy5sYXllcnMgPSBkYXRhLmxheWVycy5tYXAoZSA9PiBuZXcgU3pMYXllcihlKSk7XHJcblx0fVxyXG5cdGxheWVyczogU3pMYXllcltdID0gW107XHJcblx0Y2FjaGVkSGFzaDogc3RyaW5nID0gJyc7XHJcblx0YnVmZmVyR2VuZXJhdG9yOiBhbnk7XHJcblx0Z2V0Q2xvbmVkTGF5ZXJzKCk6IFNoYXBlTGF5ZXJbXSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcclxuXHR9XHJcblx0aXNFbnRpcmVseUVtcHR5KCk6IGJvb2xlYW4ge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XHJcblx0fVxyXG5cdGdldEhhc2goKTogc3RyaW5nIHtcclxuXHRcdGlmICh0aGlzLmNhY2hlZEhhc2gpIHJldHVybiB0aGlzLmNhY2hlZEhhc2g7XHJcblx0XHRyZXR1cm4gdGhpcy5jYWNoZWRIYXNoID0gJ3N6IScgKyBzdHJUb0goSlNPTi5zdHJpbmdpZnkodGhpcy5sYXllcnMpKTtcclxuXHR9XHJcblx0ZHJhd0Z1bGxTaXplT25DYW52YXMoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBzaXplOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG5cdH1cclxuXHRnZW5lcmF0ZUFzQ2FudmFzKHNpemU/OiBudW1iZXIpOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcclxuXHR9XHJcblx0Y2xvbmVGaWx0ZXJlZEJ5UXVhZHJhbnRzKGluY2x1ZGVRdWFkcmFudHM6IG51bWJlcltdKTogU2hhcGVEZWZpbml0aW9uIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG5cdH1cclxuXHRjbG9uZVJvdGF0ZUNXKCk6IFNoYXBlRGVmaW5pdGlvbiB7XHJcblx0XHRyZXR1cm4gbmV3IFN6RGVmaW5pdGlvbih7XHJcblx0XHRcdGxheWVyczogdGhpcy5sYXllcnMubWFwKGwgPT4gbC5jbG9uZSgpLnJvdGF0ZSg2KSlcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRjbG9uZVJvdGF0ZUNDVygpOiBTaGFwZURlZmluaXRpb24ge1xyXG5cdFx0cmV0dXJuIG5ldyBTekRlZmluaXRpb24oe1xyXG5cdFx0XHRsYXllcnM6IHRoaXMubGF5ZXJzLm1hcChsID0+IGwuY2xvbmUoKS5yb3RhdGUoMTgpKVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGNsb25lUm90YXRlMTgwKCk6IFNoYXBlRGVmaW5pdGlvbiB7XHJcblx0XHRyZXR1cm4gbmV3IFN6RGVmaW5pdGlvbih7XHJcblx0XHRcdGxheWVyczogdGhpcy5sYXllcnMubWFwKGwgPT4gbC5jbG9uZSgpLnJvdGF0ZSgxMikpXHJcblx0XHR9KTtcclxuXHR9XHJcblx0Y2xvbmVBbmRTdGFja1dpdGgoZGVmaW5pdGlvbjogU2hhcGVEZWZpbml0aW9uKTogU2hhcGVEZWZpbml0aW9uIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG5cdH1cclxuXHRjbG9uZUFuZFBhaW50V2l0aChjb2xvcjogc3RyaW5nKTogU2hhcGVEZWZpbml0aW9uIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG5cdH1cclxuXHRjbG9uZUFuZFBhaW50V2l0aDRDb2xvcnMoY29sb3JzOiBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZywgc3RyaW5nXSk6IFNoYXBlRGVmaW5pdGlvbiB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcclxuXHR9XHJcblx0Ly8gc2VyaWFsaXplKCk6IHN0cmluZyB8IG51bWJlciB8IG9iamVjdCB7XHJcblx0Ly8gXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5sYXllcnMpO1xyXG5cdC8vIFx0dGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XHJcblx0Ly8gfVxyXG5cdC8vIGRlc2VyaWFsaXplKGRhdGE6IGFueSwgcm9vdD86IEdhbWVSb290KTogc3RyaW5nIHwgdm9pZCB7XHJcblx0Ly8gXHRkZWJ1Z2dlcjtcclxuXHQvLyBcdHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xyXG5cdC8vIH1cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gaW5oZXJpdGVkXHJcblx0ZHJhd0NlbnRlcmVkKHg6IG51bWJlciwgeTogbnVtYmVyLCBwYXJhbWV0ZXJzOiBEcmF3UGFyYW1ldGVycywgZGlhbWV0ZXI6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0Y29uc3QgZHBpID0gc21vb3RoZW5EcGkoZ2xvYmFsQ29uZmlnLnNoYXBlc1NoYXJwbmVzcyAqIHBhcmFtZXRlcnMuem9vbUxldmVsKTtcclxuXHRcdGlmICghdGhpcy5idWZmZXJHZW5lcmF0b3IpIHtcclxuXHRcdFx0dGhpcy5idWZmZXJHZW5lcmF0b3IgPSB0aGlzLmludGVybmFsR2VuZXJhdGVTaGFwZUJ1ZmZlci5iaW5kKHRoaXMpO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3Qga2V5ID0gZGlhbWV0ZXIgKyBcIi9cIiArIGRwaSArIFwiL1wiICsgdGhpcy5jYWNoZWRIYXNoO1xyXG5cdFx0Y29uc3QgY2FudmFzID0gcGFyYW1ldGVycy5yb290LmJ1ZmZlcnMuZ2V0Rm9yS2V5KHtcclxuXHRcdFx0a2V5OiBcInNoYXBlZGVmXCIsXHJcblx0XHRcdHN1YktleToga2V5LFxyXG5cdFx0XHR3OiBkaWFtZXRlcixcclxuXHRcdFx0aDogZGlhbWV0ZXIsXHJcblx0XHRcdGRwaSxcclxuXHRcdFx0cmVkcmF3TWV0aG9kOiB0aGlzLmJ1ZmZlckdlbmVyYXRvcixcclxuXHRcdH0pO1xyXG5cdFx0cGFyYW1ldGVycy5jb250ZXh0LmRyYXdJbWFnZShjYW52YXMsIHggLSBkaWFtZXRlciAvIDIsIHkgLSBkaWFtZXRlciAvIDIsIGRpYW1ldGVyLCBkaWFtZXRlcik7XHJcblx0fVxyXG5cclxuXHJcblx0aW50ZXJuYWxHZW5lcmF0ZVNoYXBlQnVmZmVyKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB3OiBudW1iZXIsIGg6IG51bWJlciwgZHBpOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdC8vIHByZXBhcmUgY29udGV4dFxyXG5cdFx0Y3R4LmxpbmVDYXAgPSAncm91bmQnO1xyXG5cdFx0Y3R4LmxpbmVKb2luID0gJ3JvdW5kJztcclxuXHRcdGN0eC5saW5lV2lkdGggPSAwLjA1O1xyXG5cclxuXHRcdGN0eC50cmFuc2xhdGUoKHcgKiBkcGkpIC8gMiwgKGggKiBkcGkpIC8gMik7XHJcblx0XHRjdHguc2NhbGUoKGRwaSAqIHcpIC8gMi4zLCAoZHBpICogaCkgLyAyLjMpO1xyXG5cdFx0Y3R4LmxpbmVDYXAgPSAncm91bmQnO1xyXG5cdFx0Y3R4LmxpbmVKb2luID0gJ3JvdW5kJztcclxuXHRcdGN0eC5zdHJva2VTdHlsZSA9IFRIRU1FLml0ZW1zLm91dGxpbmU7XHJcblx0XHRjdHgubGluZVdpZHRoID0gVEhFTUUuaXRlbXMub3V0bGluZVdpZHRoIC8gMTA7XHJcblxyXG5cdFx0Y3R4LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xyXG5cclxuXHRcdGN0eC5maWxsU3R5bGUgPSBUSEVNRS5pdGVtcy5jaXJjbGVCYWNrZ3JvdW5kO1xyXG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4LmFyYygwLCAwLCAxLjE1LCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHRjdHguZmlsbCgpO1xyXG5cclxuXHRcdGxldCBzQ3R4ID0gbmV3IFN6Q29udGV4dDJEKGN0eCk7XHJcblx0XHR0aGlzLmxheWVycy5mb3JFYWNoKGwgPT4gbC5kcmF3Q2VudGVyZWROb3JtYWxpemVkKHNDdHgpKTtcclxuXHJcblx0XHRsZXQgbGF5ZXJJbmRleCA9IDA7XHJcblx0XHRjb25zdCBsYXllclNjYWxlID0gTWF0aC5tYXgoMC4xLCAwLjkgLSBsYXllckluZGV4ICogMC4yMik7XHJcblxyXG5cclxuXHR9XHJcbn0iXX0=