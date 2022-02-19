

import { PropOptionsWith } from '@dimava/vue-prop-decorator-a-variation';
import { SzLayer, ISzLayer, SzLayerQuad, SzInfo, color, quadShape } from './shapest/layer.js'
import { SzContext2D } from './shapest/SzContext2D.js';


const testTemplate: ISzLayer = {
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
}

let layer = SzInfo.quad.exampleLayer('circle')
// new SzLayer(testTemplate);


let data = Vue.reactive({
	layer, layers: [layer]
});
Object.assign(globalThis, { layer, data });
// let layer = SzLayer.createTest();

// layer.drawCenteredNormalized(sctx);


@GlobalComponent({
	watch: {
		layers: {
			handler: function (val) {
				this.redraw();
			},
			deep: true,
		}
	}
})
class LayerCanvasVue extends VueImpl.with(makeClass({
	layer: [SzLayer],
	layers: [Array] as any as PropOptionsWith<SzLayer[], never, false>,
	size: Number,
})) {
	@Template
	get _t() {
		return `
			<canvas ref="cv"
				:width="size" :height="size"
				style="border: 1px solid black;"
				:style="{width: size + 'px', height: size + 'px'}"
				@click=redraw() />
		`;
	}
	v_ctx: SzContext2D = null as any;
	get ctx() {
		if (this.v_ctx) return this.v_ctx;
		if (!this.$refs.cv) return null;
		return this.v_ctx = SzContext2D.fromCanvas(this.$refs.cv as HTMLCanvasElement);
	}
	mounted() {
		this.redraw();
	}
	redraw() {
		if (!this.ctx) return;
		this.ctx.clear();
		if (this.layer) {
			this.layer.drawCenteredNormalized(this.ctx);
		}
		if (this.layers) {
			this.layers.map((e, i) => {
				e.drawCenteredLayerScaled(this.ctx!, i);
			})
		}
	}
}

@GlobalComponent
class QuadEditorVue extends VueImpl.with(makeClass({
	quad: SzLayerQuad,
})) {
	@Template
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
	colorLayer(color: color) {
		return SzInfo.color.exampleLayer(color);
	}
	quadLayer(shape: quadShape) {
		return SzInfo.quad.exampleLayer(shape);
	}
	setFromTo([from, to]: [number, number]) {
		if (this.quad.to == to) {
			this.quad.to += from - this.quad.from;
			this.quad.from = from;
		} else {
			this.quad.to = to;
		}
	}
}


class LayerVue extends VueImpl.with(makeClass({
	layers: Array as any as PropOptionsWith<SzLayer[], never, true>,
	layer: SzLayer,
})) {
	@Template
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
	};
	selectedLayer = 0;

	mounted() {
		this.draw();
		Vue.watch(this.layer, () => this.draw(), { deep: true });
	}
	ctx: SzContext2D | null = null;
	draw() {
		if (!this.ctx) {
			if (!this.$refs.cv) return;
			this.ctx = SzContext2D.fromCanvas(this.$refs.cv as any);
		}
		this.ctx.clear();
		this.layer.drawCenteredNormalized(this.ctx);
		return '';
	}

	setFromTo(quad: SzLayerQuad, v: [number, number]) {
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

createApp(LayerVue, data).use(antd).mount('body');