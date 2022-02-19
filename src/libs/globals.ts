
const makeClass = VuePropDecoratorAVariation.makeClass;
const Template = VuePropDecoratorAVariation.Template;
const VueImpl = VueClassComponent.Vue;
const GlobalComponent = VuePropDecoratorAVariation.Component;



const createApp: typeof Vue.createApp = function (...a) {
	let app = Vue.createApp(...a);
	VuePropDecoratorAVariation.registerKnownComponents(app);
	app.config.compilerOptions.isCustomElement = s => {
		// console.log('custom?', s);
		if (s.toUpperCase() == s) return true;
		return false;
	}
	return app;
}

// Object.defineProperty(globalThis, 'exports', {get(){return{}}})