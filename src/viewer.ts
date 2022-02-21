

import { PropOptionsWith } from '@dimava/vue-prop-decorator-a-variation';
import { SzLayer, ISzLayer, SzLayerQuad, SzInfo, color, quadShape, SzLayerArea } from './shapest/layer.js'
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

let layer =// new SzLayer();
	SzLayer.fromShortKey('q!C-06C-6cC-ciC-io|a!su06su6csucisuio|c!')
// SzInfo.quad.exampleLayer('circle');
// new SzLayer();
// new SzLayer(testTemplate);

let rawData = {
	layer, layers: [layer]
}
let data = Vue.reactive({ source: rawData });
Object.assign(globalThis, { layer, data, rawData });
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
	quad: [SzLayerQuad] as any as PropOptionsWith<SzLayerQuad, never, true>,
	area: [SzLayerArea] as any as PropOptionsWith<SzLayerArea, never, true>,
})) {
	@Template
	get _t() {
		let c = this.allColors[0];
		let q = this.allQuads[0];
		return `
			<a-row>
				<LayerCanvasVue :size="64" :layer="layer" :key="layer.getHash()" />
				&emsp;
				<div style="line-height:0" >
					<LayerCanvasVue :size="32" v-if="quad"
						v-for="${q} of ${this.allQuads}"
						:title="${q}"
						:layer="${this.quadLayer(q)}"
						:class="${this.quad.shape == q ? 'selected' : 'unselected'}"
						@click="${this.quad.shape = q}" />
					<br>
					<LayerCanvasVue :size="32" v-if="area"
						v-for="${c} of ${this.allColors}"
						:title="${c}"
						:layer="${this.colorLayer(c)}"
						:class="${this.area.color == c ? 'selected' : 'unselected'}"
						@click="${this.area.color = c}" />
					<br>
					<a-slider
						range :min="0" :max="30" :marks="${{ 0: '', 6: '', 12: '', 18: '', 24: '', 30: '' }}"
						v-model:value="fromTo"
						style="width: 300px" />
				</div>
			</a-row>
		`;
	}
	rnd = 0;
	get layer() {
		this.rnd;
		if (this.quad) {
			return new SzLayer({
				quads: [this.quad],
				areas: [new SzLayerArea({ from: 0, to: 24, color: 'grey', shape: 'sector' })],
			});
		}
		if (this.area) {
			return new SzLayer({
				quads: [new SzLayerQuad({ to: 24 })],
				areas: [this.area],
			});
		}
		return SzInfo.color.exampleLayer('grey');
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
	get fromTo(): [number, number] {
		let e = this.quad || this.area;
		return [e.from, e.to];
	}
	set fromTo([from, to]: [number, number]) {
		let e = this.quad || this.area;
		if (e.to == to) {
			e.to += from - e.from;
			e.from = from;
		} else {
			e.to = to;
		}
	}
}


class LayerVue extends VueImpl.with(makeClass({
	source: null as any as PropOptionsWith<{ layers: SzLayer[] }, never, true>,
})) {
	@Template
	get _t() {
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
								@click="selectedLayerIndex = i"
								/>
						</template>
						<br>
						<button @click="${this.popLayer}"> - </button>
						<button @click="${this.pushLayer}"> + </button>
						<br>
						<input :value="${this.hash}" @change="hash=$event.target.value" style="width: 100%;font-family: monospace;font-size: small;" />
					</a-col>
					<a-col>
						<QuadEditorVue
							v-for="(quad, i) of selectedLayer.quads" :key="selectedLayerIndex + i*10"
							:quad="quad" />
						<button @click="${this.popQuad}"> - </button>
						<button @click="${this.pushQuad}"> + </button>
						<QuadEditorVue
							v-for="(area, i) of selectedLayer.areas" :key="selectedLayerIndex + i*10"
							:area="area" />
						<button @click="${this.popArea}"> - </button>
						<button @click="${this.pushArea}"> + </button>
					</a-col>
				</a-row>
			</APP>
		`;
	};
	get layers() {
		return this.source.layers;
	}
	selectedLayerIndex = 0;
	get selectedLayer() {
		return this.layers[this.selectedLayerIndex];
	}

	mounted() {
		// this.pushQuad();
		// this.pushQuad();
		// this.pushQuad();
		// this.pushQuad();
	}

	ctx: SzContext2D | null = null;

	setFromTo(quad: SzLayerQuad, v: [number, number]) {
		quad.from = v[0];
		quad.to = v[1];
	}

	popQuad() {
		this.selectedLayer.quads.pop();
	}
	pushQuad() {
		let from = this.selectedLayer.quads.slice(-1)[0]?.to ?? 0;
		this.selectedLayer.quads.push(new SzLayerQuad({ from, to: from + 6 }));
	}
	popArea() {
		this.selectedLayer.areas.pop();
	}
	pushArea() {
		let from = this.selectedLayer.areas.slice(-1)[0]?.to ?? 0;
		this.selectedLayer.areas.push(new SzLayerArea({ from, to: from + 6 }));
	}

	popLayer() { this.layers.pop(); }
	pushLayer() {
		this.layers.push(
			SzLayer.fromShortKey('q!C-06C-6cC-ciC-io|a!su06su6csucisuio|c!')
		);
	}
	get hash() {
		return 'sz!' + this.layers.map(e => e.clone().getHash()).join(':');
	}
	set hash(v) {
		this.source.layers = v.slice(3).split(':').map(SzLayer.fromShortKey);
	}
}

createApp(LayerVue, data).use(antd).mount('body');