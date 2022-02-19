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
let data = Vue.reactive({ layer });
Object.assign(globalThis, { layer, data });
// let layer = SzLayer.createTest();
// layer.drawCenteredNormalized(sctx);
let LayerCanvasVue = class LayerCanvasVue extends VueImpl.with(makeClass({
    layer: SzLayer,
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
        this.layer.drawCenteredNormalized(this.ctx);
    }
};
__decorate([
    Template
], LayerCanvasVue.prototype, "_t", null);
LayerCanvasVue = __decorate([
    GlobalComponent({
        watch: {
            layer: {
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
				<LayerCanvasVue :size="32"
					v-for="${q} of ${this.allQuads}"
					:layer="${this.quadLayer(q)}"
					:class="${this.quad.shape == q ? 'selected' : 'unselected'}"
					@click="${this.quad.shape = q}" />
				&emsp;
				<LayerCanvasVue :size="32"
					v-for="${c} of ${this.allColors}"
					:layer="${this.colorLayer(c)}"
					:class="${this.quad.color == c ? 'selected' : 'unselected'}"
					@click="${this.quad.color = c}" />
				&emsp;
				<a-slider
					range :min="0" :max="30"
					:value="[quad.from, quad.to]" @change="setFromTo($event)"
					style="width: 300px" />
			</a-row>
		`;
    }
    get layer() {
        return new SzLayer({ quads: [this.quad] });
    }
    get allColors() {
        console.log(SzInfo.color.colorList);
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
    layer: SzLayer,
})) {
    get _t() {
        let quad = this.layer.quads[0];
        let k = '';
        return `
			<APP>
				<h1> Shapest viewer </h1>
				<a-row>
					<a-col>
						<LayerCanvasVue :size="256" :layer="layer" />
					</a-col>
					<a-col>
						<QuadEditorVue
								v-for="${quad} of ${this.layer.quads}"
								:quad="quad" />
					</a-col>
				</a-row>
				<br>
				 {${layer.quads}}

			</APP>
		`;
    }
    ;
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
    get shapes() {
        return {
            '●': 'circle', '■': 'square',
        };
    }
    get colors() {
        return {
            r: 'red', g: 'green', b: 'blue'
        };
    }
    setFromTo(quad, v) {
        quad.from = v[0];
        quad.to = v[1];
    }
}
__decorate([
    Template
], LayerVue.prototype, "_t", null);
createApp(LayerVue, data).use(antd).mount('body');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZpZXdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxPQUFPLEVBQUUsT0FBTyxFQUFZLFdBQVcsRUFBRSxNQUFNLEVBQW9CLE1BQU0sb0JBQW9CLENBQUE7QUFDN0YsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBR3ZELE1BQU0sWUFBWSxHQUFhO0lBQzlCLElBQUksRUFBRTtJQUNMLHNEQUFzRDtJQUN0RCxzREFBc0Q7S0FDdEQ7SUFDRCxLQUFLLEVBQUU7UUFDTixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDbkQsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ25ELEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtLQUNyRDtJQUNELEtBQUssRUFBRTtJQUNOLDJEQUEyRDtLQUMzRDtDQUNELENBQUE7QUFFRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5Qyw2QkFBNkI7QUFHN0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMzQyxvQ0FBb0M7QUFFcEMsc0NBQXNDO0FBYXRDLElBQU0sY0FBYyxHQUFwQixNQUFNLGNBQWUsU0FBUSxP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Q29udGVudCI6WyJcclxuXHJcbmltcG9ydCB7IFN6TGF5ZXIsIElTekxheWVyLCBTekxheWVyUXVhZCwgU3pJbmZvLCBjb2xvciwgcXVhZFNoYXBlIH0gZnJvbSAnLi9zaGFwZXN0L2xheWVyLmpzJ1xyXG5pbXBvcnQgeyBTekNvbnRleHQyRCB9IGZyb20gJy4vc2hhcGVzdC9TekNvbnRleHQyRC5qcyc7XHJcblxyXG5cclxuY29uc3QgdGVzdFRlbXBsYXRlOiBJU3pMYXllciA9IHtcclxuXHRjdXRzOiBbXHJcblx0XHQvLyB7IGZyb206IDEwLCB0bzogMTAsIHNoYXBlOiAnbGluZScsIGNvbG9yOiAnYmx1ZScgfSxcclxuXHRcdC8vIHsgZnJvbTogMTQsIHRvOiAxNCwgc2hhcGU6ICdsaW5lJywgY29sb3I6ICdibHVlJyB9LFxyXG5cdF0sXHJcblx0cXVhZHM6IFtcclxuXHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBjb2xvcjogJ2dyZWVuJywgZnJvbTogMiwgdG86IDQgfSxcclxuXHRcdHsgc2hhcGU6ICdjaXJjbGUnLCBjb2xvcjogJ3BpbmsnLCBmcm9tOiA1LCB0bzogMTkgfSxcclxuXHRcdHsgc2hhcGU6ICdzcXVhcmUnLCBjb2xvcjogJ2dyZWVuJywgZnJvbTogMjAsIHRvOiAyMiB9LFxyXG5cdF0sXHJcblx0YXJlYXM6IFtcclxuXHRcdC8vIHsgc2hhcGU6ICdzZWN0b3InLCBjb2xvcjogJyNmZjAwMDAnLCBmcm9tOiAxMSwgdG86IDEzIH0sXHJcblx0XSxcclxufVxyXG5cclxubGV0IGxheWVyID0gU3pJbmZvLnF1YWQuZXhhbXBsZUxheWVyKCdjaXJjbGUnKVxyXG4vLyBuZXcgU3pMYXllcih0ZXN0VGVtcGxhdGUpO1xyXG5cclxuXHJcbmxldCBkYXRhID0gVnVlLnJlYWN0aXZlKHsgbGF5ZXIgfSk7XHJcbk9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgeyBsYXllciwgZGF0YSB9KTtcclxuLy8gbGV0IGxheWVyID0gU3pMYXllci5jcmVhdGVUZXN0KCk7XHJcblxyXG4vLyBsYXllci5kcmF3Q2VudGVyZWROb3JtYWxpemVkKHNjdHgpO1xyXG5cclxuXHJcbkBHbG9iYWxDb21wb25lbnQoe1xyXG5cdHdhdGNoOiB7XHJcblx0XHRsYXllcjoge1xyXG5cdFx0XHRoYW5kbGVyOiBmdW5jdGlvbiAodmFsKSB7XHJcblx0XHRcdFx0dGhpcy5yZWRyYXcoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVlcDogdHJ1ZSxcclxuXHRcdH1cclxuXHR9XHJcbn0pXHJcbmNsYXNzIExheWVyQ2FudmFzVnVlIGV4dGVuZHMgVnVlSW1wbC53aXRoKG1ha2VDbGFzcyh7XHJcblx0bGF5ZXI6IFN6TGF5ZXIsXHJcblx0c2l6ZTogTnVtYmVyLFxyXG59KSkge1xyXG5cdEBUZW1wbGF0ZVxyXG5cdGdldCBfdCgpIHtcclxuXHRcdHJldHVybiBgXHJcblx0XHRcdDxjYW52YXMgcmVmPVwiY3ZcIlxyXG5cdFx0XHRcdDp3aWR0aD1cInNpemVcIiA6aGVpZ2h0PVwic2l6ZVwiXHJcblx0XHRcdFx0c3R5bGU9XCJib3JkZXI6IDFweCBzb2xpZCBibGFjaztcIlxyXG5cdFx0XHRcdDpzdHlsZT1cInt3aWR0aDogc2l6ZSArICdweCcsIGhlaWdodDogc2l6ZSArICdweCd9XCJcclxuXHRcdFx0XHRAY2xpY2s9cmVkcmF3KCkgLz5cclxuXHRcdGA7XHJcblx0fVxyXG5cdHZfY3R4OiBTekNvbnRleHQyRCA9IG51bGwgYXMgYW55O1xyXG5cdGdldCBjdHgoKSB7XHJcblx0XHRpZiAodGhpcy52X2N0eCkgcmV0dXJuIHRoaXMudl9jdHg7XHJcblx0XHRpZiAoIXRoaXMuJHJlZnMuY3YpIHJldHVybiBudWxsO1xyXG5cdFx0cmV0dXJuIHRoaXMudl9jdHggPSBTekNvbnRleHQyRC5mcm9tQ2FudmFzKHRoaXMuJHJlZnMuY3YgYXMgSFRNTENhbnZhc0VsZW1lbnQpO1xyXG5cdH1cclxuXHRtb3VudGVkKCkge1xyXG5cdFx0dGhpcy5yZWRyYXcoKTtcclxuXHR9XHJcblx0cmVkcmF3KCkge1xyXG5cdFx0aWYgKCF0aGlzLmN0eCkgcmV0dXJuO1xyXG5cdFx0dGhpcy5jdHguY2xlYXIoKTtcclxuXHRcdHRoaXMubGF5ZXIuZHJhd0NlbnRlcmVkTm9ybWFsaXplZCh0aGlzLmN0eCk7XHJcblx0fVxyXG59XHJcblxyXG5AR2xvYmFsQ29tcG9uZW50XHJcbmNsYXNzIFF1YWRFZGl0b3JWdWUgZXh0ZW5kcyBWdWVJbXBsLndpdGgobWFrZUNsYXNzKHtcclxuXHRxdWFkOiBTekxheWVyUXVhZCxcclxufSkpIHtcclxuXHRAVGVtcGxhdGVcclxuXHRnZXQgX3QoKSB7XHJcblx0XHRsZXQgYyA9IHRoaXMuYWxsQ29sb3JzWzBdO1xyXG5cdFx0bGV0IHEgPSB0aGlzLmFsbFF1YWRzWzBdO1xyXG5cdFx0cmV0dXJuIGBcclxuXHRcdFx0PGEtcm93PlxyXG5cdFx0XHRcdDxMYXllckNhbnZhc1Z1ZSA6c2l6ZT1cIjY0XCIgOmxheWVyPVwibGF5ZXJcIiAvPlxyXG5cdFx0XHRcdCZlbXNwO1xyXG5cdFx0XHRcdDxMYXllckNhbnZhc1Z1ZSA6c2l6ZT1cIjMyXCJcclxuXHRcdFx0XHRcdHYtZm9yPVwiJHtxfSBvZiAke3RoaXMuYWxsUXVhZHN9XCJcclxuXHRcdFx0XHRcdDpsYXllcj1cIiR7dGhpcy5xdWFkTGF5ZXIocSl9XCJcclxuXHRcdFx0XHRcdDpjbGFzcz1cIiR7dGhpcy5xdWFkLnNoYXBlID09IHEgPyAnc2VsZWN0ZWQnIDogJ3Vuc2VsZWN0ZWQnfVwiXHJcblx0XHRcdFx0XHRAY2xpY2s9XCIke3RoaXMucXVhZC5zaGFwZSA9IHF9XCIgLz5cclxuXHRcdFx0XHQmZW1zcDtcclxuXHRcdFx0XHQ8TGF5ZXJDYW52YXNWdWUgOnNpemU9XCIzMlwiXHJcblx0XHRcdFx0XHR2LWZvcj1cIiR7Y30gb2YgJHt0aGlzLmFsbENvbG9yc31cIlxyXG5cdFx0XHRcdFx0OmxheWVyPVwiJHt0aGlzLmNvbG9yTGF5ZXIoYyl9XCJcclxuXHRcdFx0XHRcdDpjbGFzcz1cIiR7dGhpcy5xdWFkLmNvbG9yID09IGMgPyAnc2VsZWN0ZWQnIDogJ3Vuc2VsZWN0ZWQnfVwiXHJcblx0XHRcdFx0XHRAY2xpY2s9XCIke3RoaXMucXVhZC5jb2xvciA9IGN9XCIgLz5cclxuXHRcdFx0XHQmZW1zcDtcclxuXHRcdFx0XHQ8YS1zbGlkZXJcclxuXHRcdFx0XHRcdHJhbmdlIDptaW49XCIwXCIgOm1heD1cIjMwXCJcclxuXHRcdFx0XHRcdDp2YWx1ZT1cIltxdWFkLmZyb20sIHF1YWQudG9dXCIgQGNoYW5nZT1cInNldEZyb21UbygkZXZlbnQpXCJcclxuXHRcdFx0XHRcdHN0eWxlPVwid2lkdGg6IDMwMHB4XCIgLz5cclxuXHRcdFx0PC9hLXJvdz5cclxuXHRcdGA7XHJcblx0fVxyXG5cdGdldCBsYXllcigpIHtcclxuXHRcdHJldHVybiBuZXcgU3pMYXllcih7IHF1YWRzOiBbdGhpcy5xdWFkXSB9KTtcclxuXHR9XHJcblx0Z2V0IGFsbENvbG9ycygpIHtcclxuXHRcdGNvbnNvbGUubG9nKFN6SW5mby5jb2xvci5jb2xvckxpc3QpXHJcblx0XHRyZXR1cm4gU3pJbmZvLmNvbG9yLmNvbG9yTGlzdDtcclxuXHR9XHJcblx0Z2V0IGFsbFF1YWRzKCkge1xyXG5cdFx0cmV0dXJuIFN6SW5mby5xdWFkLnF1YWRMaXN0O1xyXG5cdH1cclxuXHRjb2xvckxheWVyKGNvbG9yOiBjb2xvcikge1xyXG5cdFx0cmV0dXJuIFN6SW5mby5jb2xvci5leGFtcGxlTGF5ZXIoY29sb3IpO1xyXG5cdH1cclxuXHRxdWFkTGF5ZXIoc2hhcGU6IHF1YWRTaGFwZSkge1xyXG5cdFx0cmV0dXJuIFN6SW5mby5xdWFkLmV4YW1wbGVMYXllcihzaGFwZSk7XHJcblx0fVxyXG5cdHNldEZyb21UbyhbZnJvbSwgdG9dOiBbbnVtYmVyLCBudW1iZXJdKSB7XHJcblx0XHRpZiAodGhpcy5xdWFkLnRvID09IHRvKSB7XHJcblx0XHRcdHRoaXMucXVhZC50byArPSBmcm9tIC0gdGhpcy5xdWFkLmZyb207XHJcblx0XHRcdHRoaXMucXVhZC5mcm9tID0gZnJvbTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucXVhZC50byA9IHRvO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbmNsYXNzIExheWVyVnVlIGV4dGVuZHMgVnVlSW1wbC53aXRoKG1ha2VDbGFzcyh7XHJcblx0bGF5ZXI6IFN6TGF5ZXIsXHJcbn0pKSB7XHJcblx0QFRlbXBsYXRlXHJcblx0Z2V0IF90KCkge1xyXG5cdFx0bGV0IHF1YWQgPSB0aGlzLmxheWVyLnF1YWRzWzBdO1xyXG5cdFx0bGV0IGsgPSAnJyBhcyBrZXlvZiB0eXBlb2YgdGhpcy5zaGFwZXM7XHJcblx0XHRyZXR1cm4gYFxyXG5cdFx0XHQ8QVBQPlxyXG5cdFx0XHRcdDxoMT4gU2hhcGVzdCB2aWV3ZXIgPC9oMT5cclxuXHRcdFx0XHQ8YS1yb3c+XHJcblx0XHRcdFx0XHQ8YS1jb2w+XHJcblx0XHRcdFx0XHRcdDxMYXllckNhbnZhc1Z1ZSA6c2l6ZT1cIjI1NlwiIDpsYXllcj1cImxheWVyXCIgLz5cclxuXHRcdFx0XHRcdDwvYS1jb2w+XHJcblx0XHRcdFx0XHQ8YS1jb2w+XHJcblx0XHRcdFx0XHRcdDxRdWFkRWRpdG9yVnVlXHJcblx0XHRcdFx0XHRcdFx0XHR2LWZvcj1cIiR7cXVhZH0gb2YgJHt0aGlzLmxheWVyLnF1YWRzfVwiXHJcblx0XHRcdFx0XHRcdFx0XHQ6cXVhZD1cInF1YWRcIiAvPlxyXG5cdFx0XHRcdFx0PC9hLWNvbD5cclxuXHRcdFx0XHQ8L2Etcm93PlxyXG5cdFx0XHRcdDxicj5cclxuXHRcdFx0XHQgeyR7bGF5ZXIucXVhZHN9fVxyXG5cclxuXHRcdFx0PC9BUFA+XHJcblx0XHRgO1xyXG5cdH07XHJcblxyXG5cclxuXHRtb3VudGVkKCkge1xyXG5cdFx0dGhpcy5kcmF3KCk7XHJcblx0XHRWdWUud2F0Y2godGhpcy5sYXllciwgKCkgPT4gdGhpcy5kcmF3KCksIHsgZGVlcDogdHJ1ZSB9KTtcclxuXHR9XHJcblx0Y3R4OiBTekNvbnRleHQyRCB8IG51bGwgPSBudWxsO1xyXG5cdGRyYXcoKSB7XHJcblx0XHRpZiAoIXRoaXMuY3R4KSB7XHJcblx0XHRcdGlmICghdGhpcy4kcmVmcy5jdikgcmV0dXJuO1xyXG5cdFx0XHR0aGlzLmN0eCA9IFN6Q29udGV4dDJELmZyb21DYW52YXModGhpcy4kcmVmcy5jdiBhcyBhbnkpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5jdHguY2xlYXIoKTtcclxuXHRcdHRoaXMubGF5ZXIuZHJhd0NlbnRlcmVkTm9ybWFsaXplZCh0aGlzLmN0eCk7XHJcblx0XHRyZXR1cm4gJyc7XHJcblx0fVxyXG5cdGdldCBzaGFwZXMoKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHQn4pePJzogJ2NpcmNsZScsICfilqAnOiAnc3F1YXJlJyxcclxuXHRcdH1cclxuXHR9XHJcblx0Z2V0IGNvbG9ycygpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHI6ICdyZWQnLCBnOiAnZ3JlZW4nLCBiOiAnYmx1ZSdcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNldEZyb21UbyhxdWFkOiBTekxheWVyUXVhZCwgdjogW251bWJlciwgbnVtYmVyXSkge1xyXG5cdFx0cXVhZC5mcm9tID0gdlswXTtcclxuXHRcdHF1YWQudG8gPSB2WzFdO1xyXG5cdH1cclxufVxyXG5cclxuY3JlYXRlQXBwKExheWVyVnVlLCBkYXRhKS51c2UoYW50ZCkubW91bnQoJ2JvZHknKTsiXX0=