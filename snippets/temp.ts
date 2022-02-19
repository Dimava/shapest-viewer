import jetpack from "fs-jetpack";
import sharp from "sharp";




// jetpack.find('', {
// 	directories: true,
// 	files: false,
// })

let jp = jetpack.cwd('dist/img-src/dl')

console.log(jp.list())

let inp = jp.path('giftest.gif');
let out = jp.path('giftest.webp');

sharp(inp, {animated: true})
	.webp({lossless: true})
	.toFile(out)

.then(() => {
	console.log(jp.inspect('giftest.gif'));
	console.log(jp.inspect('giftest.webp'));
})