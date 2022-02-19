var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SzLayer, SzLayerQuad, SzInfo } from './shapest/layer.js';
import { SzContext2D } from './shapest/SzContext2D.js';
const testTemplate = {
    cuts: [
    // { from: 10, to: 10, shape: 'line', color: 'blue' },
    // { from: 14, to: 14, shape: 'line', color: 'blue' },
    ],
    quads: [
        { shape: 'square', color: 'green', from: 2, to: 4 },
        { shape: 'circle', color: 'pink', from: 5, to: 19 },
        { shape: 'square', color: 'green', from: 20, to: 22 },
    ],
    areas: [
    // { shape: 'sector', color: '#ff0000', from: 11, to: 13 },
    ],
};
let layer = SzInfo.quad.exampleLayer('circle');
// new SzLayer(testTemplate);
let data = Vue.reactive({
    layer, layers: [layer]
});
Object.assign(globalThis, { layer, data });
// let layer = SzLayer.createTest();
// layer.drawCenteredNormalized(sctx);
let LayerCanvasVue = class LayerCanvasVue extends VueImpl.with(makeClass({
    layer: [SzLayer],
    layers: [Array],
    size: Number,
})) {
    get _t() {
        return `
			<canvas ref="cv"
				:width="size" :height="size"
				style="border: 1px solid black;"
				:style="{width: size + 'px', height: size + 'px'}"
				@click=redraw() />
		`;
    }
    v_ctx = null;
    get ctx() {
        if (this.v_ctx)
            return this.v_ctx;
        if (!this.$refs.cv)
            return null;
        return this.v_ctx = SzContext2D.fromCanvas(this.$refs.cv);
    }
    mounted() {
        this.redraw();
    }
    redraw() {
        if (!this.ctx)
            return;
        this.ctx.clear();
        if (this.layer) {
            this.layer.drawCenteredNormalized(this.ctx);
        }
        if (this.layers) {
            this.layers.map((e, i) => {
                e.drawCenteredLayerScaled(this.ctx, i);
            });
        }
    }
};
__decorate([
    Template
], LayerCanvasVue.prototype, "_t", null);
LayerCanvasVue = __decorate([
    GlobalComponent({
        watch: {
            layers: {
                handler: function (val) {
                    this.redraw();
                },
                deep: true,
            }
        }
    })
], LayerCanvasVue);
let QuadEditorVue = class QuadEditorVue extends VueImpl.with(makeClass({
    quad: SzLayerQuad,
})) {
    get _t() {
        let c = this.allColors[0];
        let q = this.allQuads[0];
        return `
			<a-row>
				<LayerCanvasVue :size="64" :layer="layer" />
				&emsp;
				<div style="line-height:0" >
					<LayerCanvasVue :size="32"
						v-for="${q} of ${this.allQuads}"
						:layer="${this.quadLayer(q)}"
						:class="${this.quad.shape == q ? 'selected' : 'unselected'}"
						@click="${this.quad.shape = q}" />
					<br>
					<LayerCanvasVue :size="32"
						v-for="${c} of ${this.allColors}"
						:layer="${this.colorLayer(c)}"
						:class="${this.quad.color == c ? 'selected' : 'unselected'}"
						@click="${this.quad.color = c}" />
					<br>
					<a-slider
						range :min="0" :max="30" :marks="${{ 0: '', 6: '', 12: '', 18: '', 24: '', 30: '' }}"
						:value="[quad.from, quad.to]" @change="setFromTo($event)"
						style="width: 300px" />
				</div>
			</a-row>
		`;
    }
    get layer() {
        return new SzLayer({ quads: [this.quad] });
    }
    get allColors() {
        return SzInfo.color.colorList;
    }
    get allQuads() {
        return SzInfo.quad.quadList;
    }
    colorLayer(color) {
        return SzInfo.color.exampleLayer(color);
    }
    quadLayer(shape) {
        return SzInfo.quad.exampleLayer(shape);
    }
    setFromTo([from, to]) {
        if (this.quad.to == to) {
            this.quad.to += from - this.quad.from;
            this.quad.from = from;
        }
        else {
            this.quad.to = to;
        }
    }
};
__decorate([
    Template
], QuadEditorVue.prototype, "_t", null);
QuadEditorVue = __decorate([
    GlobalComponent
], QuadEditorVue);
class LayerVue extends VueImpl.with(makeClass({
    layers: Array,
    layer: SzLayer,
})) {
    get _t() {
        let quad = this.layer.quads[0];
        return `
			<APP>
				<h1> Shapest viewer </h1>
				<a-row>
					<a-col>
						<LayerCanvasVue :size="256" :layers="layers" />
						<template v-for="(l, i) of layers">
							<br v-if="i % 2 == 0">
							<LayerCanvasVue :size="128" :layer="l"
								:class="i == selectedLayer ? 'selected' : 'unselected'"
								@click="selectedLayer = i"
								/>
						</template>
						<br>
						<button @click="${this.popLayer}"> - </button>
						<button @click="${this.pushLayer}"> + </button>
					</a-col>
					<a-col>
						<QuadEditorVue
							v-for="(${quad}, i) of ${this.layers[this.selectedLayer].quads}" :key="selectedLayer + i*10"
							:quad="quad" />
						<button @click="${this.popQuad}"> - </button>
						<button @click="${this.pushQuad}"> + </button>
					</a-col>
				</a-row>
			</APP>
		`;
    }
    ;
    selectedLayer = 0;
    mounted() {
        this.draw();
        Vue.watch(this.layer, () => this.draw(), { deep: true });
    }
    ctx = null;
    draw() {
        if (!this.ctx) {
            if (!this.$refs.cv)
                return;
            this.ctx = SzContext2D.fromCanvas(this.$refs.cv);
        }
        this.ctx.clear();
        this.layer.drawCenteredNormalized(this.ctx);
        return '';
    }
    setFromTo(quad, v) {
        quad.from = v[0];
        quad.to = v[1];
    }
    popQuad() { this.layers[this.selectedLayer].quads.pop(); }
    pushQuad() {
        let from = this.layers[this.selectedLayer].quads.slice(-1)[0]?.to ?? 0;
        this.layers[this.selectedLayer].quads.push(new SzLayerQuad({ from, to: from + 6 }));
    }
    popLayer() { this.layers.pop(); }
    pushLayer() { this.layers.push(new SzLayer()); }
}
__decorate([
    Template
], LayerVue.prototype, "_t", null);
createApp(LayerVue, data).use(antd).mount('body');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZpZXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSxPQUFPLEVBQUUsT0FBTyxFQUFZLFdBQVcsRUFBRSxNQUFNLEVBQW9CLE1BQU0sb0JBQW9CLENBQUE7QUFDN0YsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBR3ZELE1BQU0sWUFBWSxHQUFhO0lBQzlCLElBQUksRUFBRTtJQUNMLHNEQUFzRDtJQUN0RCxzREFBc0Q7S0FDdEQ7SUFDRCxLQUFLLEVBQUU7UUFDTixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDbkQsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25ELEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNyRDtJQUNELEtBQUssRUFBRTtJQUNOLDJEQUEyRDtLQUMzRDtDQUNELENBQUE7QUFFRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5Qyw2QkFBNkI7QUFHN0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUN2QixLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDM0Msb0NBQW9DO0FBRXBDLHNDQUFzQztBQWF0QyxJ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QUFFLENBQUM7SUFDWCxDQUFDO0lBRUQsU0FBUyxDQUFDLElBQWlCLEVBQUUsQ0FBbUI7UUFDL0MsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFELFFBQVE7UUFDUCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxRQUFRLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakMsU0FBUyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDaEQ7QUE1REE7SUFEQyxRQUFRO2tDQThCUjtBQWlDRixTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcbmltcG9ydCB7IFByb3BPcHRpb25zV2l0aCB9IGZyb20gJ0BkaW1hdmEvdnVlLXByb3AtZGVjb3JhdG9yLWEtdmFyaWF0aW9uJztcclxuaW1wb3J0IHsgU3pMYXllciwgSVN6TGF5ZXIsIFN6TGF5ZXJRdWFkLCBTekluZm8sIGNvbG9yLCBxdWFkU2hhcGUgfSBmcm9tICcuL3NoYXBlc3QvbGF5ZXIuanMnXHJcbmltcG9ydCB7IFN6Q29udGV4dDJEIH0gZnJvbSAnLi9zaGFwZXN0L1N6Q29udGV4dDJELmpzJztcclxuXHJcblxyXG5jb25zdCB0ZXN0VGVtcGxhdGU6IElTekxheWVyID0ge1xyXG5cdGN1dHM6IFtcclxuXHRcdC8vIHsgZnJvbTogMTAsIHRvOiAxMCwgc2hhcGU6ICdsaW5lJywgY29sb3I6ICdibHVlJyB9LFxyXG5cdFx0Ly8geyBmcm9tOiAxNCwgdG86IDE0LCBzaGFwZTogJ2xpbmUnLCBjb2xvcjogJ2JsdWUnIH0sXHJcblx0XSxcclxuXHRxdWFkczogW1xyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyLCB0bzogNCB9LFxyXG5cdFx0eyBzaGFwZTogJ2NpcmNsZScsIGNvbG9yOiAncGluaycsIGZyb206IDUsIHRvOiAxOSB9LFxyXG5cdFx0eyBzaGFwZTogJ3NxdWFyZScsIGNvbG9yOiAnZ3JlZW4nLCBmcm9tOiAyMCwgdG86IDIyIH0sXHJcblx0XSxcclxuXHRhcmVhczogW1xyXG5cdFx0Ly8geyBzaGFwZTogJ3NlY3RvcicsIGNvbG9yOiAnI2ZmMDAwMCcsIGZyb206IDExLCB0bzogMTMgfSxcclxuXHRdLFxyXG59XHJcblxyXG5sZXQgbGF5ZXIgPSBTekluZm8ucXVhZC5leGFtcGxlTGF5ZXIoJ2NpcmNsZScpXHJcbi8vIG5ldyBTekxheWVyKHRlc3RUZW1wbGF0ZSk7XHJcblxyXG5cclxubGV0IGRhdGEgPSBWdWUucmVhY3RpdmUoe1xyXG5cdGxheWVyLCBsYXllcnM6IFtsYXllcl1cclxufSk7XHJcbk9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgeyBsYXllciwgZGF0YSB9KTtcclxuLy8gbGV0IGxheWVyID0gU3pMYXllci5jcmVhdGVUZXN0KCk7XHJcblxyXG4vLyBsYXllci5kcmF3Q2VudGVyZWROb3JtYWxpemVkKHNjdHgpO1xyXG5cclxuXHJcbkBHbG9iYWxDb21wb25lbnQoe1xyXG5cdHdhdGNoOiB7XHJcblx0XHRsYXllcnM6IHtcclxuXHRcdFx0aGFuZGxlcjogZnVuY3Rpb24gKHZhbCkge1xyXG5cdFx0XHRcdHRoaXMucmVkcmF3KCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlZXA6IHRydWUsXHJcblx0XHR9XHJcblx0fVxyXG59KVxyXG5jbGFzcyBMYXllckNhbnZhc1Z1ZSBleHRlbmRzIFZ1ZUltcGwud2l0aChtYWtlQ2xhc3Moe1xyXG5cdGxheWVyOiBbU3pMYXllcl0sXHJcblx0bGF5ZXJzOiBbQXJyYXldIGFzIGFueSBhcyBQcm9wT3B0aW9uc1dpdGg8U3pMYXllcltdLCBuZXZlciwgZmFsc2U+LFxyXG5cdHNpemU6IE51bWJlcixcclxufSkpIHtcclxuXHRAVGVtcGxhdGVcclxuXHRnZXQgX3QoKSB7XHJcblx0XHRyZXR1cm4gYFxyXG5cdFx0XHQ8Y2FudmFzIHJlZj1cImN2XCJcclxuXHRcdFx0XHQ6d2lkdGg9XCJzaXplXCIgOmhlaWdodD1cInNpemVcIlxyXG5cdFx0XHRcdHN0eWxlPVwiYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XCJcclxuXHRcdFx0XHQ6c3R5bGU9XCJ7d2lkdGg6IHNpemUgKyAncHgnLCBoZWlnaHQ6IHNpemUgKyAncHgnfVwiXHJcblx0XHRcdFx0QGNsaWNrPXJlZHJhdygpIC8+XHJcblx0XHRgO1xyXG5cdH1cclxuXHR2X2N0eDogU3pDb250ZXh0MkQgPSBudWxsIGFzIGFueTtcclxuXHRnZXQgY3R4KCkge1xyXG5cdFx0aWYgKHRoaXMudl9jdHgpIHJldHVybiB0aGlzLnZfY3R4O1xyXG5cdFx0aWYgKCF0aGlzLiRyZWZzLmN2KSByZXR1cm4gbnVsbDtcclxuXHRcdHJldHVybiB0aGlzLnZfY3R4ID0gU3pDb250ZXh0MkQuZnJvbUNhbnZhcyh0aGlzLiRyZWZzLmN2IGFzIEhUTUxDYW52YXNFbGVtZW50KTtcclxuXHR9XHJcblx0bW91bnRlZCgpIHtcclxuXHRcdHRoaXMucmVkcmF3KCk7XHJcblx0fVxyXG5cdHJlZHJhdygpIHtcclxuXHRcdGlmICghdGhpcy5jdHgpIHJldHVybjtcclxuXHRcdHRoaXMuY3R4LmNsZWFyKCk7XHJcblx0XHRpZiAodGhpcy5sYXllcikge1xyXG5cdFx0XHR0aGlzLmxheWVyLmRyYXdDZW50ZXJlZE5vcm1hbGl6ZWQodGhpcy5jdHgpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubGF5ZXJzKSB7XHJcblx0XHRcdHRoaXMubGF5ZXJzLm1hcCgoZSwgaSkgPT4ge1xyXG5cdFx0XHRcdGUuZHJhd0NlbnRlcmVkTGF5ZXJTY2FsZWQodGhpcy5jdHghLCBpKTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbkBHbG9iYWxDb21wb25lbnRcclxuY2xhc3MgUXVhZEVkaXRvclZ1ZSBleHRlbmRzIFZ1ZUltcGwud2l0aChtYWtlQ2xhc3Moe1xyXG5cdHF1YWQ6IFN6TGF5ZXJRdWFkLFxyXG59KSkge1xyXG5cdEBUZW1wbGF0ZVxyXG5cdGdldCBfdCgpIHtcclxuXHRcdGxldCBjID0gdGhpcy5hbGxDb2xvcnNbMF07XHJcblx0XHRsZXQgcSA9IHRoaXMuYWxsUXVhZHNbMF07XHJcblx0XHRyZXR1cm4gYFxyXG5cdFx0XHQ8YS1yb3c+XHJcblx0XHRcdFx0PExheWVyQ2FudmFzVnVlIDpzaXplPVwiNjRcIiA6bGF5ZXI9XCJsYXllclwiIC8+XHJcblx0XHRcdFx0JmVtc3A7XHJcblx0XHRcdFx0PGRpdiBzdHlsZT1cImxpbmUtaGVpZ2h0OjBcIiA+XHJcblx0XHRcdFx0XHQ8TGF5ZXJDYW52YXNWdWUgOnNpemU9XCIzMlwiXHJcblx0XHRcdFx0XHRcdHYtZm9yPVwiJHtxfSBvZiAke3RoaXMuYWxsUXVhZHN9XCJcclxuXHRcdFx0XHRcdFx0OmxheWVyPVwiJHt0aGlzLnF1YWRMYXllcihxKX1cIlxyXG5cdFx0XHRcdFx0XHQ6Y2xhc3M9XCIke3RoaXMucXVhZC5zaGFwZSA9PSBxID8gJ3NlbGVjdGVkJyA6ICd1bnNlbGVjdGVkJ31cIlxyXG5cdFx0XHRcdFx0XHRAY2xpY2s9XCIke3RoaXMucXVhZC5zaGFwZSA9IHF9XCIgLz5cclxuXHRcdFx0XHRcdDxicj5cclxuXHRcdFx0XHRcdDxMYXllckNhbnZhc1Z1ZSA6c2l6ZT1cIjMyXCJcclxuXHRcdFx0XHRcdFx0di1mb3I9XCIke2N9IG9mICR7dGhpcy5hbGxDb2xvcnN9XCJcclxuXHRcdFx0XHRcdFx0OmxheWVyPVwiJHt0aGlzLmNvbG9yTGF5ZXIoYyl9XCJcclxuXHRcdFx0XHRcdFx0OmNsYXNzPVwiJHt0aGlzLnF1YWQuY29sb3IgPT0gYyA/ICdzZWxlY3RlZCcgOiAndW5zZWxlY3RlZCd9XCJcclxuXHRcdFx0XHRcdFx0QGNsaWNrPVwiJHt0aGlzLnF1YWQuY29sb3IgPSBjfVwiIC8+XHJcblx0XHRcdFx0XHQ8YnI+XHJcblx0XHRcdFx0XHQ8YS1zbGlkZXJcclxuXHRcdFx0XHRcdFx0cmFuZ2UgOm1pbj1cIjBcIiA6bWF4PVwiMzBcIiA6bWFya3M9XCIke3sgMDogJycsIDY6ICcnLCAxMjogJycsIDE4OiAnJywgMjQ6ICcnLCAzMDogJycgfX1cIlxyXG5cdFx0XHRcdFx0XHQ6dmFsdWU9XCJbcXVhZC5mcm9tLCBxdWFkLnRvXVwiIEBjaGFuZ2U9XCJzZXRGcm9tVG8oJGV2ZW50KVwiXHJcblx0XHRcdFx0XHRcdHN0eWxlPVwid2lkdGg6IDMwMHB4XCIgLz5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9hLXJvdz5cclxuXHRcdGA7XHJcblx0fVxyXG5cdGdldCBsYXllcigpIHtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7IHF1YWRzOiBbdGhpcy5xdWFkXSB9KTtcclxuXHR9XHJcblx0Z2V0IGFsbENvbG9ycygpIHtcclxuXHRcdHJldHVybiBTekluZm8uY29sb3IuY29sb3JMaXN0O1xyXG5cdH1cclxuXHRnZXQgYWxsUXVhZHMoKSB7XHJcblx0XHRyZXR1cm4gU3pJbmZvLnF1YWQucXVhZExpc3Q7XHJcblx0fVxyXG5cdGNvbG9yTGF5ZXIoY29sb3I6IGNvbG9yKSB7XHJcblx0XHRyZXR1cm4gU3pJbmZvLmNvbG9yLmV4YW1wbGVMYXllcihjb2xvcik7XHJcblx0fVxyXG5cdHF1YWRMYXllcihzaGFwZTogcXVhZFNoYXBlKSB7XHJcblx0XHRyZXR1cm4gU3pJbmZvLnF1YWQuZXhhbXBsZUxheWVyKHNoYXBlKTtcclxuXHR9XHJcblx0c2V0RnJvbVRvKFtmcm9tLCB0b106IFtudW1iZXIsIG51bWJlcl0pIHtcclxuXHRcdGlmICh0aGlzLnF1YWQudG8gPT0gdG8pIHtcclxuXHRcdFx0dGhpcy5xdWFkLnRvICs9IGZyb20gLSB0aGlzLnF1YWQuZnJvbTtcclxuXHRcdFx0dGhpcy5xdWFkLmZyb20gPSBmcm9tO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5xdWFkLnRvID0gdG87XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5cclxuY2xhc3MgTGF5ZXJWdWUgZXh0ZW5kcyBWdWVJbXBsLndpdGgobWFrZUNsYXNzKHtcclxuXHRsYXllcnM6IEFycmF5IGFzIGFueSBhcyBQcm9wT3B0aW9uc1dpdGg8U3pMYXllcltdLCBuZXZlciwgdHJ1ZT4sXHJcblx0bGF5ZXI6IFN6TGF5ZXIsXHJcbn0pKSB7XHJcblx0QFRlbXBsYXRlXHJcblx0Z2V0IF90KCkge1xyXG5cdFx0bGV0IHF1YWQgPSB0aGlzLmxheWVyLnF1YWRzWzBdO1xyXG5cdFx0cmV0dXJuIGBcclxuXHRcdFx0PEFQUD5cclxuXHRcdFx0XHQ8aDE+IFNoYXBlc3Qgdmlld2VyIDwvaDE+XHJcblx0XHRcdFx0PGEtcm93PlxyXG5cdFx0XHRcdFx0PGEtY29sPlxyXG5cdFx0XHRcdFx0XHQ8TGF5ZXJDYW52YXNWdWUgOnNpemU9XCIyNTZcIiA6bGF5ZXJzPVwibGF5ZXJzXCIgLz5cclxuXHRcdFx0XHRcdFx0PHRlbXBsYXRlIHYtZm9yPVwiKGwsIGkpIG9mIGxheWVyc1wiPlxyXG5cdFx0XHRcdFx0XHRcdDxiciB2LWlmPVwiaSAlIDIgPT0gMFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxMYXllckNhbnZhc1Z1ZSA6c2l6ZT1cIjEyOFwiIDpsYXllcj1cImxcIlxyXG5cdFx0XHRcdFx0XHRcdFx0OmNsYXNzPVwiaSA9PSBzZWxlY3RlZExheWVyID8gJ3NlbGVjdGVkJyA6ICd1bnNlbGVjdGVkJ1wiXHJcblx0XHRcdFx0XHRcdFx0XHRAY2xpY2s9XCJzZWxlY3RlZExheWVyID0gaVwiXHJcblx0XHRcdFx0XHRcdFx0XHQvPlxyXG5cdFx0XHRcdFx0XHQ8L3RlbXBsYXRlPlxyXG5cdFx0XHRcdFx0XHQ8YnI+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gQGNsaWNrPVwiJHt0aGlzLnBvcExheWVyfVwiPiAtIDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHQ8YnV0dG9uIEBjbGljaz1cIiR7dGhpcy5wdXNoTGF5ZXJ9XCI+ICsgPC9idXR0b24+XHJcblx0XHRcdFx0XHQ8L2EtY29sPlxyXG5cdFx0XHRcdFx0PGEtY29sPlxyXG5cdFx0XHRcdFx0XHQ8UXVhZEVkaXRvclZ1ZVxyXG5cdFx0XHRcdFx0XHRcdHYtZm9yPVwiKCR7cXVhZH0sIGkpIG9mICR7dGhpcy5sYXllcnNbdGhpcy5zZWxlY3RlZExheWVyXS5xdWFkc31cIiA6a2V5PVwic2VsZWN0ZWRMYXllciArIGkqMTBcIlxyXG5cdFx0XHRcdFx0XHRcdDpxdWFkPVwicXVhZFwiIC8+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gQGNsaWNrPVwiJHt0aGlzLnBvcFF1YWR9XCI+IC0gPC9idXR0b24+XHJcblx0XHRcdFx0XHRcdDxidXR0b24gQGNsaWNrPVwiJHt0aGlzLnB1c2hRdWFkfVwiPiArIDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0PC9hLWNvbD5cclxuXHRcdFx0XHQ8L2Etcm93PlxyXG5cdFx0XHQ8L0FQUD5cclxuXHRcdGA7XHJcblx0fTtcclxuXHRzZWxlY3RlZExheWVyID0gMDtcclxuXHJcblx0bW91bnRlZCgpIHtcclxuXHRcdHRoaXMuZHJhdygpO1xyXG5cdFx0VnVlLndhdGNoKHRoaXMubGF5ZXIsICgpID0+IHRoaXMuZHJhdygpLCB7IGRlZXA6IHRydWUgfSk7XHJcblx0fVxyXG5cdGN0eDogU3pDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcclxuXHRkcmF3KCkge1xyXG5cdFx0aWYgKCF0aGlzLmN0eCkge1xyXG5cdFx0XHRpZiAoIXRoaXMuJHJlZnMuY3YpIHJldHVybjtcclxuXHRcdFx0dGhpcy5jdHggPSBTekNvbnRleHQyRC5mcm9tQ2FudmFzKHRoaXMuJHJlZnMuY3YgYXMgYW55KTtcclxuXHRcdH1cclxuXHRcdHRoaXMuY3R4LmNsZWFyKCk7XHJcblx0XHR0aGlzLmxheWVyLmRyYXdDZW50ZXJlZE5vcm1hbGl6ZWQodGhpcy5jdHgpO1xyXG5cdFx0cmV0dXJuICcnO1xyXG5cdH1cclxuXHJcblx0c2V0RnJvbVRvKHF1YWQ6IFN6TGF5ZXJRdWFkLCB2OiBbbnVtYmVyLCBudW1iZXJdKSB7XHJcblx0XHRxdWFkLmZyb20gPSB2WzBdO1xyXG5cdFx0cXVhZC50byA9IHZbMV07XHJcblx0fVxyXG5cclxuXHRwb3BRdWFkKCkgeyB0aGlzLmxheWVyc1t0aGlzLnNlbGVjdGVkTGF5ZXJdLnF1YWRzLnBvcCgpOyB9XHJcblx0cHVzaFF1YWQoKSB7XHJcblx0XHRsZXQgZnJvbSA9IHRoaXMubGF5ZXJzW3RoaXMuc2VsZWN0ZWRMYXllcl0ucXVhZHMuc2xpY2UoLTEpWzBdPy50byA/PyAwO1xyXG5cdFx0dGhpcy5sYXllcnNbdGhpcy5zZWxlY3RlZExheWVyXS5xdWFkcy5wdXNoKG5ldyBTekxheWVyUXVhZCh7IGZyb20sIHRvOiBmcm9tICsgNiB9KSk7XHJcblx0fVxyXG5cclxuXHRwb3BMYXllcigpIHsgdGhpcy5sYXllcnMucG9wKCk7IH1cclxuXHRwdXNoTGF5ZXIoKSB7IHRoaXMubGF5ZXJzLnB1c2gobmV3IFN6TGF5ZXIoKSk7IH1cclxufVxyXG5cclxuY3JlYXRlQXBwKExheWVyVnVlLCBkYXRhKS51c2UoYW50ZCkubW91bnQoJ2JvZHknKTsiXX0=