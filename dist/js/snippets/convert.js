"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
const sharp_1 = __importDefault(require("sharp"));
const probe_image_size_1 = __importDefault(require("probe-image-size"));
const process_1 = require("process");
// let path = "C:/Users/Dimava/Desktop/projects/@seamless/dist/img-src/dl/1644414666192289895.png";
// let dir = 'C:/Users/Dimava/Desktop/projects/@seamless/dist/img-src/dl';
// let jp = jetpack.cwd(dir);
const supportedImageTypes = 'JPG, GIF, PNG, WebP, BMP, TIFF, SVG, PSD, ICO, AVIF, HEIC, HEIF.'.match(/\w+/g);
let count = 0;
let total = 0;
let copyOrSkip = 'ignore';
function empty() {
    let resolve;
    let reject;
    let p = new Promise((r, j) => {
        resolve = r;
        reject = j;
    });
    p.resolve = p.r = resolve;
    p.reject = p.j = reject;
    return p;
}
async function pmap(_this, mapper, threads = 5) {
    if (!(threads > 0))
        throw new Error();
    let tasks = _this.map((e, i, a) => [e, i, a]);
    let results = Array(tasks.length);
    let anyResolved = empty();
    let freeThreads = threads;
    async function runTask(task) {
        try {
            return await mapper(...task);
        }
        catch (err) {
            return err;
        }
    }
    async function run(task) {
        freeThreads--;
        results[task[1]] = await runTask(task);
        freeThreads++;
        let oldAnyResolved = anyResolved;
        anyResolved = empty();
        oldAnyResolved.r(undefined);
    }
    for (let task of tasks) {
        if (freeThreads == 0) {
            await anyResolved;
        }
        run(task);
    }
    while (freeThreads < threads) {
        await anyResolved;
    }
    return results;
}
let gifQueue = Promise.resolve();
let threader = (() => {
    let startList = Array(10000).fill(0).map(e => empty());
    let finishList = Array(10000).fill(0).map(e => empty());
    pmap(startList, (e, i, a) => {
        startList[i].resolve(0);
        return finishList[i];
    });
    let i = 0;
    return function () {
        let r = { start: startList[i], finish: finishList[i] };
        i++;
        return r;
    };
})();
async function convertImage(name, cwd_inp, cwd_out) {
    let inp = cwd_inp.path(name);
    let out = cwd_out.path(name);
    let fileType = name.split('.').pop().toUpperCase();
    if (fileType == 'GIF') {
        // 	let inpData = cwd_inp.inspect(inp)!;
        // 	let outData = cwd_out.inspect(out);
        // 	if (inpData.size != outData?.size) {
        // 		cwd_inp.copy(inp, out, { overwrite: true });
        // 		if (!outData) count++;
        // 		return;
        // 	}
    }
    if (cwd_out.exists(name)) {
        return;
    }
    // console.log(name);
    let { start, finish } = threader();
    await start;
    function logResult() {
        let inpData = cwd_inp.inspect(inp);
        let outData = cwd_out.inspect(out);
        let f = (x) => ((x?.size ?? 0) / 1e6).toFixed(2).padStart(6);
        count++;
        let cs = count.toString().padStart(total.toString().length);
        console.log(`${cs}/${total}       ${f(inpData)} > ${f(outData)} MB    ${inp}`);
        return (outData?.size ?? 0) / inpData.size;
    }
    if (!supportedImageTypes.includes(fileType)) {
        if (copyOrSkip == 'copy') {
            cwd_inp.copy(inp, out, { overwrite: true });
            logResult();
            console.log(`==copy`);
        }
        if (copyOrSkip == 'skip') {
            logResult();
            console.log(`==skip`);
        }
        finish.r(0);
        return;
    }
    let imgdata = await (0, probe_image_size_1.default)(cwd_inp.createReadStream(name)).catch(err => {
        throw name + '\n' + err;
    });
    let height = imgdata.height > 1080 * 1.5 ? 1080 : undefined;
    await (0, sharp_1.default)(inp, { animated: true })
        .resize({ height, fastShrinkOnLoad: false, withoutEnlargement: true })
        .webp({ lossless: true, reductionEffort: 6 })
        .toFile(out);
    let imgdata2 = await (0, probe_image_size_1.default)(cwd_out.createReadStream(name));
    let pc = logResult();
    if (pc < 1.5) {
        console.log(`compress: ${((1 - pc) * 100).toFixed(2)}%   ${imgdata.height} > ${imgdata2.height} px`);
    }
    else {
        console.log(`bad: x${pc}`);
        cwd_inp.copy(inp, out, { overwrite: true });
    }
    finish.r(0);
}
async function convertDir(name, cwd_inp, cwd_out) {
    async function convertNode(node, cwd_inp, cwd_out) {
        if (node.type == 'file') {
            await convertImage(node.name, cwd_inp, cwd_out);
        }
        if (node.type == 'dir') {
            await Promise.all(node.children.map(child => convertNode(child, cwd_inp.cwd(node.name), cwd_out.cwd(node.name))));
            // for (let child of node.children) {
            // 	await convertNode(child, cwd_inp.cwd(node.name), cwd_out.cwd(node.name))
            // }
        }
    }
    let info = {};
    let exists = 0;
    function countNodes(node, cwd_out) {
        if (node.type == 'dir') {
            cwd_out = cwd_out.dir(node.name);
            return node.children.reduce((v, e) => v + countNodes(e, cwd_out), 0);
        }
        if (node.type == cwd_out.exists(node.name)) {
            exists++;
            return 0;
        }
        if (copyOrSkip == 'ignore') {
            let fileType = node.name.split('.').pop().toUpperCase();
            if (!supportedImageTypes.includes(fileType)) {
                return 0;
            }
        }
        return 1;
    }
    let inpTree = cwd_inp.inspectTree(name, { symlinks: 'follow' });
    let outTree = cwd_out.inspectTree(name, { symlinks: 'follow' });
    count = 0;
    total = countNodes(inpTree, cwd_out);
    console.log({ exists, total, name });
    await convertNode(inpTree, cwd_inp, cwd_out);
}
let targetDir = process_1.argv[2] ?? 'dl';
// convertDir(targetDir,
// 	jetpack.dir('dist/img-src'),
// 	jetpack.dir('dist/img-dist'),
// )
let folders = [
    'Gweda Collection [Uncensored]',
    "AANiX",
    "Akt 2021",
    "Animations",
    "AnimeFlux",
    "ARTIST Lasterk",
    "bisiro MMD",
    "Bulging Senpai",
    "Chronicles of Wormwood",
    "dl",
    "Exga Collection",
    "Fallen Lady 2",
    "Fukuro",
    "Gecko",
    "generalbutch",
    "Hado",
    "Hell and Heaven",
    "lambda",
    "Mantis-X Animations",
    "MdaStarou1107",
    "MdaStarou788",
    "Melkor Mancin",
    "metafulgurlux2",
    "Nagoonimation",
    "Nagoonimation collection 1080p",
    "NeoArtCore",
    "OttosFoxHole",
    "Oyuwari",
    "Personalami",
    "PetAniBG",
    "Sayika",
    "Sensual Adventures Episode 6 The Revelation",
    "Skuddbutt",
    "src",
    "sys3.6.3",
    "titles",
    "Vaesark - part 5",
    "VG Erotica",
    "xxNIKICHENxx",
    "[DMM.com] Ayakashi Rumble X",
    "[DMM.com] Ayakashi Rumble X [2021-11-30]",
    "[FANBOX] Fumihiko",
    "[Hopuhopu team] PE Uniform and Preppy Girl [RUS]",
    "[Kiga Natsuno] 2020 Compilation 14 Work Set",
    "[seismic] Sweet Mami 2 [Puella Magi Madoka Magica][animated gif]",
    "[兔子老大 (Sayika)]"
];
// folders = ['dl']
void async function () {
    for (let targetDir of folders) {
        await convertDir(targetDir, fs_jetpack_1.default.dir('dist/img-src'), fs_jetpack_1.default.dir('dist/img-dist'));
    }
}();
// void async function () {
// 	for (let path of list) {
// 		let out = jp.path(path, '../webp1080', path);
// 		path = jp.path(path);
// 		console.log({ path, out });
// 		let imgdata = await isize(jp.createReadStream(path));
// 		let height = imgdata.height > 1080 * 1.5 ? 1080 : undefined;
// 		await sharp(path)
// 			.resize({ height, fastShrinkOnLoad: false, withoutEnlargement: true })
// 			.webp({ lossless: true, reductionEffort: 6 })
// 			.toFile(out)
// 	}
// }();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NuaXBwZXRzL2NvbnZlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSw0REFBaUM7QUFDakMsa0RBQTBCO0FBQzFCLHdFQUFxQztBQUVyQyxxQ0FBK0I7QUFFL0IsbUdBQW1HO0FBRW5HLDBFQUEwRTtBQUMxRSw2QkFBNkI7QUFFN0IsTUFBTSxtQkFBbUIsR0FDeEIsa0VBQWtFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBRSxDQUFDO0FBRW5GLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUVkLElBQUksVUFBVSxHQUErQixRQUFRLENBQUM7QUFHdEQsU0FBUyxLQUFLO0lBQ2IsSUFBSSxPQUFPLENBQUM7SUFDWixJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVCLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDWixNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQyxDQUFRLENBQUM7SUFDVixDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDeEIsT0FBTyxDQUFDLENBQUM7QUFDVixDQUFDO0FBRUQsS0FBSyxVQUFVLElBQUksQ0FBTyxLQUFVLEVBQUUsTUFBc0MsRUFBRSxPQUFPLEdBQUcsQ0FBQztJQUN4RixJQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUNuQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFD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QWlCO0NBQ2pCLENBQUM7QUFFRixtQkFBbUI7QUFFbkIsS0FBSyxLQUFLO0lBRVQsS0FBSyxJQUFJLFNBQVMsSUFBSSxPQUFPLEVBQUU7UUFDOUIsTUFBTSxVQUFVLENBQUMsU0FBUyxFQUN6QixvQkFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFDM0Isb0JBQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQzVCLENBQUE7S0FDRDtBQUVGLENBQUMsRUFBRSxDQUFDO0FBSUosMkJBQTJCO0FBRTNCLDRCQUE0QjtBQUM1QixrREFBa0Q7QUFDbEQsMEJBQTBCO0FBQzFCLGdDQUFnQztBQUVoQywwREFBMEQ7QUFDMUQsaUVBQWlFO0FBRWpFLHNCQUFzQjtBQUN0Qiw0RUFBNEU7QUFDNUUsbURBQW1EO0FBQ25ELGtCQUFrQjtBQUNsQixLQUFLO0FBRUwsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuaW1wb3J0IGpldHBhY2sgZnJvbSAnZnMtamV0cGFjayc7XHJcbmltcG9ydCBzaGFycCBmcm9tICdzaGFycCc7XHJcbmltcG9ydCBpc2l6ZSBmcm9tICdwcm9iZS1pbWFnZS1zaXplJztcclxuaW1wb3J0IHsgRlNKZXRwYWNrLCBJbnNwZWN0UmVzdWx0LCBJbnNwZWN0VHJlZVJlc3VsdCB9IGZyb20gJ2ZzLWpldHBhY2svdHlwZXMnO1xyXG5pbXBvcnQgeyBhcmd2IH0gZnJvbSAncHJvY2Vzcyc7XHJcblxyXG4vLyBsZXQgcGF0aCA9IFwiQzovVXNlcnMvRGltYXZhL0Rlc2t0b3AvcHJvamVjdHMvQHNlYW1sZXNzL2Rpc3QvaW1nLXNyYy9kbC8xNjQ0NDE0NjY2MTkyMjg5ODk1LnBuZ1wiO1xyXG5cclxuLy8gbGV0IGRpciA9ICdDOi9Vc2Vycy9EaW1hdmEvRGVza3RvcC9wcm9qZWN0cy9Ac2VhbWxlc3MvZGlzdC9pbWctc3JjL2RsJztcclxuLy8gbGV0IGpwID0gamV0cGFjay5jd2QoZGlyKTtcclxuXHJcbmNvbnN0IHN1cHBvcnRlZEltYWdlVHlwZXMgPVxyXG5cdCdKUEcsIEdJRiwgUE5HLCBXZWJQLCBCTVAsIFRJRkYsIFNWRywgUFNELCBJQ08sIEFWSUYsIEhFSUMsIEhFSUYuJy5tYXRjaCgvXFx3Ky9nKSE7XHJcblxyXG5sZXQgY291bnQgPSAwO1xyXG5sZXQgdG90YWwgPSAwO1xyXG5cclxubGV0IGNvcHlPclNraXA6ICdjb3B5JyB8ICdza2lwJyB8ICdpZ25vcmUnID0gJ2lnbm9yZSc7XHJcblxyXG5cclxuZnVuY3Rpb24gZW1wdHk8VD4oKTogUHJvbWlzZTxUPiAmIHsgcmVzb2x2ZSh2OiBUKTogdm9pZCwgcmVqZWN0KCk6IHZvaWQsIHIodjogVCk6IHZvaWQgfSB7XHJcblx0bGV0IHJlc29sdmU7XHJcblx0bGV0IHJlamVjdDtcclxuXHRsZXQgcCA9IG5ldyBQcm9taXNlKChyLCBqKSA9PiB7XHJcblx0XHRyZXNvbHZlID0gcjtcclxuXHRcdHJlamVjdCA9IGo7XHJcblx0fSkgYXMgYW55O1xyXG5cdHAucmVzb2x2ZSA9IHAuciA9IHJlc29sdmU7XHJcblx0cC5yZWplY3QgPSBwLmogPSByZWplY3Q7XHJcblx0cmV0dXJuIHA7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHBtYXA8VCwgVj4oX3RoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IFYsIHRocmVhZHMgPSA1KSB7XHJcblx0aWYgKCEodGhyZWFkcyA+IDApKVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCk7XHJcblx0bGV0IHRhc2tzID0gX3RoaXMubWFwKChlLCBpLCBhKSA9PiBbZSwgaSwgYV0gYXMgY29uc3QpO1xyXG5cdGxldCByZXN1bHRzID0gQXJyYXkodGFza3MubGVuZ3RoKTtcclxuXHRsZXQgYW55UmVzb2x2ZWQgPSBlbXB0eSgpO1xyXG5cdGxldCBmcmVlVGhyZWFkcyA9IHRocmVhZHM7XHJcblx0YXN5bmMgZnVuY3Rpb24gcnVuVGFzayh0YXNrOiB0eXBlb2YgdGFza3NbMF0pIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBhd2FpdCBtYXBwZXIoLi4udGFzayk7XHJcblx0XHR9XHJcblx0XHRjYXRjaCAoZXJyKSB7XHJcblx0XHRcdHJldHVybiBlcnI7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFzeW5jIGZ1bmN0aW9uIHJ1bih0YXNrOiB0eXBlb2YgdGFza3NbMF0pIHtcclxuXHRcdGZyZWVUaHJlYWRzLS07XHJcblx0XHRyZXN1bHRzW3Rhc2tbMV1dID0gYXdhaXQgcnVuVGFzayh0YXNrKTtcclxuXHRcdGZyZWVUaHJlYWRzKys7XHJcblx0XHRsZXQgb2xkQW55UmVzb2x2ZWQgPSBhbnlSZXNvbHZlZDtcclxuXHRcdGFueVJlc29sdmVkID0gZW1wdHkoKTtcclxuXHRcdG9sZEFueVJlc29sdmVkLnIodW5kZWZpbmVkKTtcclxuXHR9XHJcblx0Zm9yIChsZXQgdGFzayBvZiB0YXNrcykge1xyXG5cdFx0aWYgKGZyZWVUaHJlYWRzID09IDApIHtcclxuXHRcdFx0YXdhaXQgYW55UmVzb2x2ZWQ7XHJcblx0XHR9XHJcblx0XHRydW4odGFzayk7XHJcblx0fVxyXG5cdHdoaWxlIChmcmVlVGhyZWFkcyA8IHRocmVhZHMpIHtcclxuXHRcdGF3YWl0IGFueVJlc29sdmVkO1xyXG5cdH1cclxuXHRyZXR1cm4gcmVzdWx0cztcclxufVxyXG5cclxuXHJcblxyXG5sZXQgZ2lmUXVldWUgPSBQcm9taXNlLnJlc29sdmUoKTtcclxuXHJcbmxldCB0aHJlYWRlciA9ICgoKSA9PiB7XHJcblx0bGV0IHN0YXJ0TGlzdCA9IEFycmF5KDEwMDAwKS5maWxsKDApLm1hcChlID0+IGVtcHR5KCkpO1xyXG5cdGxldCBmaW5pc2hMaXN0ID0gQXJyYXkoMTAwMDApLmZpbGwoMCkubWFwKGUgPT4gZW1wdHkoKSk7XHJcblx0cG1hcChzdGFydExpc3QsIChlLCBpLCBhKSA9PiB7XHJcblx0XHRzdGFydExpc3RbaV0ucmVzb2x2ZSgwKTtcclxuXHRcdHJldHVybiBmaW5pc2hMaXN0W2ldO1xyXG5cdH0pO1xyXG5cdGxldCBpID0gMDtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHIgPSB7IHN0YXJ0OiBzdGFydExpc3RbaV0sIGZpbmlzaDogZmluaXNoTGlzdFtpXSB9O1xyXG5cdFx0aSsrO1xyXG5cdFx0cmV0dXJuIHI7XHJcblx0fVxyXG59KSgpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29udmVydEltYWdlKG5hbWU6IHN0cmluZywgY3dkX2lucDogRlNKZXRwYWNrLCBjd2Rfb3V0OiBGU0pldHBhY2spIHtcclxuXHRsZXQgaW5wID0gY3dkX2lucC5wYXRoKG5hbWUpO1xyXG5cdGxldCBvdXQgPSBjd2Rfb3V0LnBhdGgobmFtZSk7XHJcblx0bGV0IGZpbGVUeXBlID0gbmFtZS5zcGxpdCgnLicpLnBvcCgpIS50b1VwcGVyQ2FzZSgpO1xyXG5cclxuXHRpZiAoZmlsZVR5cGUgPT0gJ0dJRicpIHtcclxuXHRcdC8vIFx0bGV0IGlucERhdGEgPSBjd2RfaW5wLmluc3BlY3QoaW5wKSE7XHJcblx0XHQvLyBcdGxldCBvdXREYXRhID0gY3dkX291dC5pbnNwZWN0KG91dCk7XHJcblx0XHQvLyBcdGlmIChpbnBEYXRhLnNpemUgIT0gb3V0RGF0YT8uc2l6ZSkge1xyXG5cdFx0Ly8gXHRcdGN3ZF9pbnAuY29weShpbnAsIG91dCwgeyBvdmVyd3JpdGU6IHRydWUgfSk7XHJcblx0XHQvLyBcdFx0aWYgKCFvdXREYXRhKSBjb3VudCsrO1xyXG5cdFx0Ly8gXHRcdHJldHVybjtcclxuXHRcdC8vIFx0fVxyXG5cdH1cclxuXHRpZiAoY3dkX291dC5leGlzdHMobmFtZSkpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0Ly8gY29uc29sZS5sb2cobmFtZSk7XHJcblx0bGV0IHsgc3RhcnQsIGZpbmlzaCB9ID0gdGhyZWFkZXIoKTtcclxuXHRhd2FpdCBzdGFydDtcclxuXHJcblx0ZnVuY3Rpb24gbG9nUmVzdWx0KCkge1xyXG5cdFx0bGV0IGlucERhdGEgPSBjd2RfaW5wLmluc3BlY3QoaW5wKSE7XHJcblx0XHRsZXQgb3V0RGF0YSA9IGN3ZF9vdXQuaW5zcGVjdChvdXQpO1xyXG5cdFx0bGV0IGYgPSAoeD86IEluc3BlY3RSZXN1bHQpID0+ICgoeD8uc2l6ZSA/PyAwKSAvIDFlNikudG9GaXhlZCgyKS5wYWRTdGFydCg2KTtcclxuXHJcblx0XHRjb3VudCsrO1xyXG5cdFx0bGV0IGNzID0gY291bnQudG9TdHJpbmcoKS5wYWRTdGFydCh0b3RhbC50b1N0cmluZygpLmxlbmd0aCk7XHJcblx0XHRjb25zb2xlLmxvZyhgJHtjc30vJHt0b3RhbH0gICAgICAgJHtmKGlucERhdGEpfSA+ICR7ZihvdXREYXRhKX0gTUIgICAgJHtpbnB9YCk7XHJcblx0XHRyZXR1cm4gKG91dERhdGE/LnNpemUgPz8gMCkgLyBpbnBEYXRhLnNpemU7XHJcblx0fVxyXG5cclxuXHRpZiAoIXN1cHBvcnRlZEltYWdlVHlwZXMuaW5jbHVkZXMoZmlsZVR5cGUpKSB7XHJcblx0XHRpZiAoY29weU9yU2tpcCA9PSAnY29weScpIHtcclxuXHRcdFx0Y3dkX2lucC5jb3B5KGlucCwgb3V0LCB7IG92ZXJ3cml0ZTogdHJ1ZSB9KTtcclxuXHRcdFx0bG9nUmVzdWx0KCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGA9PWNvcHlgKTtcclxuXHRcdH1cclxuXHRcdGlmIChjb3B5T3JTa2lwID09ICdza2lwJykge1xyXG5cdFx0XHRsb2dSZXN1bHQoKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYD09c2tpcGApO1xyXG5cdFx0fVxyXG5cdFx0ZmluaXNoLnIoMCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHRsZXQgaW1nZGF0YSA9IGF3YWl0IGlzaXplKGN3ZF9pbnAuY3JlYXRlUmVhZFN0cmVhbShuYW1lKSkuY2F0Y2goZXJyID0+IHtcclxuXHRcdHRocm93IG5hbWUgKyAnXFxuJyArIGVycjtcclxuXHR9KTtcclxuXHRsZXQgaGVpZ2h0ID0gaW1nZGF0YS5oZWlnaHQgPiAxMDgwICogMS41ID8gMTA4MCA6IHVuZGVmaW5lZDtcclxuXHJcblx0YXdhaXQgc2hhcnAoaW5wLCB7IGFuaW1hdGVkOiB0cnVlIH0pXHJcblx0XHQucmVzaXplKHsgaGVpZ2h0LCBmYXN0U2hyaW5rT25Mb2FkOiBmYWxzZSwgd2l0aG91dEVubGFyZ2VtZW50OiB0cnVlIH0pXHJcblx0XHQud2VicCh7IGxvc3NsZXNzOiB0cnVlLCByZWR1Y3Rpb25FZmZvcnQ6IDYgfSlcclxuXHRcdC50b0ZpbGUob3V0KTtcclxuXHJcblx0bGV0IGltZ2RhdGEyID0gYXdhaXQgaXNpemUoY3dkX291dC5jcmVhdGVSZWFkU3RyZWFtKG5hbWUpKTtcclxuXHRsZXQgcGMgPSBsb2dSZXN1bHQoKTtcclxuXHRpZiAocGMgPCAxLjUpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBjb21wcmVzczogJHsoKDEgLSBwYykgKiAxMDApLnRvRml4ZWQoMil9JSAgICR7aW1nZGF0YS5oZWlnaHR9ID4gJHtpbWdkYXRhMi5oZWlnaHR9IHB4YCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNvbnNvbGUubG9nKGBiYWQ6IHgke3BjfWApO1xyXG5cdFx0Y3dkX2lucC5jb3B5KGlucCwgb3V0LCB7IG92ZXJ3cml0ZTogdHJ1ZSB9KTtcclxuXHR9XHJcblx0ZmluaXNoLnIoMCk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvbnZlcnREaXIobmFtZTogc3RyaW5nLCBjd2RfaW5wOiBGU0pldHBhY2ssIGN3ZF9vdXQ6IEZTSmV0cGFjaykge1xyXG5cdGFzeW5jIGZ1bmN0aW9uIGNvbnZlcnROb2RlKG5vZGU6IEluc3BlY3RUcmVlUmVzdWx0LCBjd2RfaW5wOiBGU0pldHBhY2ssIGN3ZF9vdXQ6IEZTSmV0cGFjaykge1xyXG5cdFx0aWYgKG5vZGUudHlwZSA9PSAnZmlsZScpIHtcclxuXHRcdFx0YXdhaXQgY29udmVydEltYWdlKG5vZGUubmFtZSwgY3dkX2lucCwgY3dkX291dCk7XHJcblx0XHR9XHJcblx0XHRpZiAobm9kZS50eXBlID09ICdkaXInKSB7XHJcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFxyXG5cdFx0XHRcdG5vZGUuY2hpbGRyZW4ubWFwKGNoaWxkID0+XHJcblx0XHRcdFx0XHRjb252ZXJ0Tm9kZShjaGlsZCwgY3dkX2lucC5jd2Qobm9kZS5uYW1lKSwgY3dkX291dC5jd2Qobm9kZS5uYW1lKSlcclxuXHRcdFx0XHQpXHJcblx0XHRcdClcclxuXHRcdFx0Ly8gZm9yIChsZXQgY2hpbGQgb2Ygbm9kZS5jaGlsZHJlbikge1xyXG5cdFx0XHQvLyBcdGF3YWl0IGNvbnZlcnROb2RlKGNoaWxkLCBjd2RfaW5wLmN3ZChub2RlLm5hbWUpLCBjd2Rfb3V0LmN3ZChub2RlLm5hbWUpKVxyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHRsZXQgaW5mbzogUmVjb3JkPHN0cmluZywgeyBleGlzdHM6IG51bWJlciwgdG90bGE6IG51bWJlciB9PiA9IHt9O1xyXG5cdGxldCBleGlzdHMgPSAwO1xyXG5cdGZ1bmN0aW9uIGNvdW50Tm9kZXMobm9kZTogSW5zcGVjdFRyZWVSZXN1bHQsIGN3ZF9vdXQ6IEZTSmV0cGFjayk6IG51bWJlciB7XHJcblx0XHRpZiAobm9kZS50eXBlID09ICdkaXInKSB7XHJcblx0XHRcdGN3ZF9vdXQgPSBjd2Rfb3V0LmRpcihub2RlLm5hbWUpO1xyXG5cdFx0XHRyZXR1cm4gbm9kZS5jaGlsZHJlbi5yZWR1Y2UoKHYsIGUpID0+IHYgKyBjb3VudE5vZGVzKGUsIGN3ZF9vdXQpLCAwKTtcclxuXHRcdH1cclxuXHRcdGlmIChub2RlLnR5cGUgPT0gY3dkX291dC5leGlzdHMobm9kZS5uYW1lKSkge1xyXG5cdFx0XHRleGlzdHMrKztcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblx0XHRpZiAoY29weU9yU2tpcCA9PSAnaWdub3JlJykge1xyXG5cdFx0XHRsZXQgZmlsZVR5cGUgPSBub2RlLm5hbWUuc3BsaXQoJy4nKS5wb3AoKSEudG9VcHBlckNhc2UoKTtcclxuXHRcdFx0aWYgKCFzdXBwb3J0ZWRJbWFnZVR5cGVzLmluY2x1ZGVzKGZpbGVUeXBlKSkge1xyXG5cdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gMTtcclxuXHR9XHJcblxyXG5cdGxldCBpbnBUcmVlID0gY3dkX2lucC5pbnNwZWN0VHJlZShuYW1lLCB7IHN5bWxpbmtzOiAnZm9sbG93JyB9KSE7XHJcblx0bGV0IG91dFRyZWUgPSBjd2Rfb3V0Lmluc3BlY3RUcmVlKG5hbWUsIHsgc3ltbGlua3M6ICdmb2xsb3cnIH0pITtcclxuXHRjb3VudCA9IDA7XHJcblx0dG90YWwgPSBjb3VudE5vZGVzKGlucFRyZWUsIGN3ZF9vdXQpO1xyXG5cdGNvbnNvbGUubG9nKHsgZXhpc3RzLCB0b3RhbCwgbmFtZSB9KTtcclxuXHRhd2FpdCBjb252ZXJ0Tm9kZShpbnBUcmVlLCBjd2RfaW5wLCBjd2Rfb3V0KTtcclxufVxyXG5cclxuXHJcbmxldCB0YXJnZXREaXIgPSBhcmd2WzJdID8/ICdkbCc7XHJcblxyXG4vLyBjb252ZXJ0RGlyKHRhcmdldERpcixcclxuLy8gXHRqZXRwYWNrLmRpcignZGlzdC9pbWctc3JjJyksXHJcbi8vIFx0amV0cGFjay5kaXIoJ2Rpc3QvaW1nLWRpc3QnKSxcclxuLy8gKVxyXG5cclxubGV0IGZvbGRlcnMgPSBbXHJcblx0J0d3ZWRhIENvbGxlY3Rpb24gW1VuY2Vuc29yZWRdJyxcclxuXHRcIkFBTmlYXCIsXHJcblx0XCJBa3QgMjAyMVwiLFxyXG5cdFwiQW5pbWF0aW9uc1wiLFxyXG5cdFwiQW5pbWVGbHV4XCIsXHJcblx0XCJBUlRJU1QgTGFzdGVya1wiLFxyXG5cdFwiYmlzaXJvIE1NRFwiLFxyXG5cdFwiQnVsZ2luZyBTZW5wYWlcIixcclxuXHRcIkNocm9uaWNsZXMgb2YgV29ybXdvb2RcIixcclxuXHRcImRsXCIsXHJcblx0XCJFeGdhIENvbGxlY3Rpb25cIixcclxuXHRcIkZhbGxlbiBMYWR5IDJcIixcclxuXHRcIkZ1a3Vyb1wiLFxyXG5cdFwiR2Vja29cIixcclxuXHRcImdlbmVyYWxidXRjaFwiLFxyXG5cdFwiSGFkb1wiLFxyXG5cdFwiSGVsbCBhbmQgSGVhdmVuXCIsXHJcblx0XCJsYW1iZGFcIixcclxuXHRcIk1hbnRpcy1YIEFuaW1hdGlvbnNcIixcclxuXHRcIk1kYVN0YXJvdTExMDdcIixcclxuXHRcIk1kYVN0YXJvdTc4OFwiLFxyXG5cdFwiTWVsa29yIE1hbmNpblwiLFxyXG5cdFwibWV0YWZ1bGd1cmx1eDJcIixcclxuXHRcIk5hZ29vbmltYXRpb25cIixcclxuXHRcIk5hZ29vbmltYXRpb24gY29sbGVjdGlvbiAxMDgwcFwiLFxyXG5cdFwiTmVvQXJ0Q29yZVwiLFxyXG5cdFwiT3R0b3NGb3hIb2xlXCIsXHJcblx0XCJPeXV3YXJpXCIsXHJcblx0XCJQZXJzb25hbGFtaVwiLFxyXG5cdFwiUGV0QW5pQkdcIixcclxuXHRcIlNheWlrYVwiLFxyXG5cdFwiU2Vuc3VhbCBBZHZlbnR1cmVzIEVwaXNvZGUgNiBUaGUgUmV2ZWxhdGlvblwiLFxyXG5cdFwiU2t1ZGRidXR0XCIsXHJcblx0XCJzcmNcIixcclxuXHRcInN5czMuNi4zXCIsXHJcblx0XCJ0aXRsZXNcIixcclxuXHRcIlZhZXNhcmsgLSBwYXJ0IDVcIixcclxuXHRcIlZHIEVyb3RpY2FcIixcclxuXHRcInh4TklLSUNIRU54eFwiLFxyXG5cdFwiW0RNTS5jb21dIEF5YWthc2hpIFJ1bWJsZSBYXCIsXHJcblx0XCJbRE1NLmNvbV0gQXlha2FzaGkgUnVtYmxlIFggWzIwMjEtMTEtMzBdXCIsXHJcblx0XCJbRkFOQk9YXSBGdW1paGlrb1wiLFxyXG5cdFwiW0hvcHVob3B1IHRlYW1dIFBFIFVuaWZvcm0gYW5kIFByZXBweSBHaXJsIFtSVVNdXCIsXHJcblx0XCJbS2lnYSBOYXRzdW5vXSAyMDIwIENvbXBpbGF0aW9uIDE0IFdvcmsgU2V0XCIsXHJcblx0XCJbc2Vpc21pY10gU3dlZXQgTWFtaSAyIFtQdWVsbGEgTWFnaSBNYWRva2EgTWFnaWNhXVthbmltYXRlZCBnaWZdXCIsXHJcblx0XCJb5YWU5a2Q6ICB5aSnIChTYXlpa2EpXVwiXHJcbl07XHJcblxyXG4vLyBmb2xkZXJzID0gWydkbCddXHJcblxyXG52b2lkIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0Zm9yIChsZXQgdGFyZ2V0RGlyIG9mIGZvbGRlcnMpIHtcclxuXHRcdGF3YWl0IGNvbnZlcnREaXIodGFyZ2V0RGlyLFxyXG5cdFx0XHRqZXRwYWNrLmRpcignZGlzdC9pbWctc3JjJyksXHJcblx0XHRcdGpldHBhY2suZGlyKCdkaXN0L2ltZy1kaXN0JyksXHJcblx0XHQpXHJcblx0fVxyXG5cclxufSgpO1xyXG5cclxuXHJcblxyXG4vLyB2b2lkIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHJcbi8vIFx0Zm9yIChsZXQgcGF0aCBvZiBsaXN0KSB7XHJcbi8vIFx0XHRsZXQgb3V0ID0ganAucGF0aChwYXRoLCAnLi4vd2VicDEwODAnLCBwYXRoKTtcclxuLy8gXHRcdHBhdGggPSBqcC5wYXRoKHBhdGgpO1xyXG4vLyBcdFx0Y29uc29sZS5sb2coeyBwYXRoLCBvdXQgfSk7XHJcblxyXG4vLyBcdFx0bGV0IGltZ2RhdGEgPSBhd2FpdCBpc2l6ZShqcC5jcmVhdGVSZWFkU3RyZWFtKHBhdGgpKTtcclxuLy8gXHRcdGxldCBoZWlnaHQgPSBpbWdkYXRhLmhlaWdodCA+IDEwODAgKiAxLjUgPyAxMDgwIDogdW5kZWZpbmVkO1xyXG5cclxuLy8gXHRcdGF3YWl0IHNoYXJwKHBhdGgpXHJcbi8vIFx0XHRcdC5yZXNpemUoeyBoZWlnaHQsIGZhc3RTaHJpbmtPbkxvYWQ6IGZhbHNlLCB3aXRob3V0RW5sYXJnZW1lbnQ6IHRydWUgfSlcclxuLy8gXHRcdFx0LndlYnAoeyBsb3NzbGVzczogdHJ1ZSwgcmVkdWN0aW9uRWZmb3J0OiA2IH0pXHJcbi8vIFx0XHRcdC50b0ZpbGUob3V0KVxyXG4vLyBcdH1cclxuXHJcbi8vIH0oKTsiXX0=