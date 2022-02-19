










type ResolveablePromise<T> = PromiseLike<T> & {
	resolve(value: T): void;
}
function empty<T>(): UnwrappedPromise<T> {
	let resolve!: (value: T) => void;
	let reject!: (reason?: any) => void;
	let p = new Promise<T>((r, j) => {
		resolve = r;
		reject = j;
	});
	return Object.assign(p, { resolve, reject, r: resolve, j: reject });
}
type UnwrappedPromise<T> = Promise<T> & {
	resolve: (value: T) => void;
	reject: (reason?: any) => void;
	r: (value: T) => void;
	j: (reason?: any) => void;
}


export class PMap<T, V, E = never> {
	/** Original array */
	source: T[] = [];
	/** Async element converter function */
	mapper: (e: T, i: number, a: T[], pmap: PMap<T, V, E>) => Promise<V | E> = (e: T) => e as any as Promise<V>;
	/** Max number of requests at once.   
	 *  *May* be changed in runtime */
	threads: number = 5;
	/** Max distance between the olders incomplete and newest active elements.   
	 *  *May* be changed in runtime */
	window: number = Infinity;

	/** Unfinished result array */
	results: (V | E | undefined)[] = [];
	/** Promises for every element */
	requests: UnwrappedPromise<V | E>[] = [];

	beforeStart: (e: T, i: number, a: T[], pmap: PMap<T, V, E>) => Promise<void> | void = () => { };
	afterComplete: (e: T, i: number, a: T[], pmap: PMap<T, V, E>) => Promise<void> | void = () => { };

	/** Length of the array */
	length: number = -1;
	/** The number of elements finished converting */
	completed: number = -1;
	/** Threads currently working   
	 *  in the mapper function: including the current one */
	activeThreads: number = -1;
	lastStarted: number = -1;

	allTasksDone: UnwrappedPromise<(V | E)[]> & { pmap: PMap<T, V, E> };
	anyTaskResolved: UnwrappedPromise<void>;

	constructor(source: Partial<PMap<T, V, E>>) {
		this.allTasksDone = Object.assign(this.emptyResult<(V | E)[]>(), { pmap: this });
		this.anyTaskResolved = this.emptyResult();
		for (let k of Object.keys(this) as (keyof PMap<T, V, E>)[]) {
			if (typeof source[k] == typeof this[k]) {
				this[k] = source[k] as any;
			} else if (source[k]) {
				throw new Error(`PMap: invalid constructor parameter: property ${k}: expected ${typeof this[k]}, but got ${typeof source[k]}`);
			}
		}
	}


	async startTask(arrayIndex: number) {
		this.activeThreads++;
		this.beforeStart(this.source[arrayIndex], arrayIndex, this.source, this);
		this.lastStarted = arrayIndex;
		let v = await this.mapper(this.source[arrayIndex], arrayIndex, this.source, this).catch<E>(e => e);
		this.results[arrayIndex] = v;
		this.requests[arrayIndex].resolve(v);
		this.completed++;
		this.afterComplete(this.source[arrayIndex], arrayIndex, this.source, this);
		this.activeThreads--;
		this.anyTaskResolved.resolve();
	}
	async run_internal() {
		for (let arrayIndex = 0; arrayIndex < this.length; arrayIndex++) {
			while (this.activeThreads >= this.threads) await this.anyTaskResolved;
			this.anyTaskResolved = this.emptyResult();
			
			await this.requests[arrayIndex - this.window];
			this.startTask(arrayIndex);
		}
		this.allTasksDone.resolve(this.results as (V | E)[]);
		return this.allTasksDone;
	}
	run() {
		this.prepare();
		this.run_internal();
		return this.allTasksDone;
	}

	prepare() {
		if (this.length == -1) this.length = this.source.length;
		if (this.results.length == 0) {
			this.results = Array(this.length);
		}
		if (this.requests.length == 0) {
			this.requests = this.source.map(e => this.emptyResult());
		}
		if (this.completed < 0) this.completed = 0;
		if (this.activeThreads < 0) this.activeThreads = 0;
		if (this.lastStarted < -1) this.lastStarted = -1;
		this.anyTaskResolved = this.emptyResult();
		Object.assign(this.allTasksDone, { pmap: this });
		return this;
	}

	emptyResult<T = V | E>(): UnwrappedPromise<T> {
		let resolve!: (value: T) => void;
		let reject!: (reason?: any) => void;
		let p = new Promise<T>((r, j) => {
			resolve = r;
			reject = j;
		});
		return Object.assign(p, { resolve, reject, r: resolve, j: reject });
	}

	static this_pmap<T, V, E = never>(array: T[], mapper: PMap<T, V, E>['mapper'], options: Partial<PMap<T, V, E>> = {}) {
		let pmap = new PMap({ source: array, mapper, ...options });
		return pmap.run();
	}
	static pmap<T, V, E = never>(array: T[], mapper: PMap<T, V, E>['mapper'], options: Partial<PMap<T, V, E>> = {}) {
		let pmap = new PMap({ source: array, mapper, ...options });
		return pmap.run();
	}
}

