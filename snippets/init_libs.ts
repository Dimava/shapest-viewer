import * as _jp from 'fs-jetpack';
const jp = _jp.cwd().endsWith('snippets') ? _jp.cwd('..') : _jp;

const libs = [
	{
		id: 'vue',
		path: 'vue/dist/vue.global',
		global: 'Vue',
	}, {
		id: 'vue-class-component',
		path: 'vue-class-component/dist/vue-class-component.global',
		global: 'VueClassComponent',
	}, {
		id: '@dimava/vue-prop-decorator-a-variation',
		path: '@dimava/vue-prop-decorator-a-variation/dist/vue-prop-decorator-a-variation.global',
		global: 'VuePropertyDefinitionAVariation',
	},
	{ path: 'twind', rel: '/../twind.umd.js' },
	{ path: 'twind', rel: '/../observe/observe.umd.js' },
	{ path: 'twind', rel: '/../shim/shim.umd.js' },
	{ path: '@dimava/poopjs' },
];

function resolve(path: string) {
	console.log({path})
	try {return require.resolve(path)} catch{}
	try {return require.resolve(path + '.js')} catch{}
	throw 'fail ' + path
}

for (let { id, path, global, rel } of libs) {
	let name = (rel ?? path).split('/').pop();
	let source = resolve(path) + (rel ?? '');
	jp.copy(source, `./dist/js/libs/${name}.js`, { overwrite: true });
	if (id && global) {
		jp.write(`./src/libs/${global}.d.ts`, `	
			import * as ${global} from "${id}";
			export as namespace ${global};
			export = ${global};
		`.replace(/\n\t+/g, '\n'));
	}
}

// jp.write('testfile', 'test');
