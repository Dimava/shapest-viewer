export const rmode = true;
export const PI12 = -Math.PI / 12;
export class SzContext2D {
    static fromCanvas(cv) {
        let ctx = cv.getContext('2d');
        const PI = Math.PI;
        const PI12 = -PI / 12;
        ctx.scale(cv.width / 2, cv.height / 2);
        ctx.translate(1, 1);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(1 / 1.15, 1 / 1.15);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        return new SzContext2D(ctx);
    }
    clear() {
        this.ctx.clearRect(-2, -2, 4, 4);
    }
    ctx;
    constructor(ctx) {
        this.ctx = ctx;
    }
    get lineWidth() { return this.ctx.lineWidth; }
    set lineWidth(v) { this.ctx.lineWidth = v; }
    get strokeStyle() { return this.ctx.strokeStyle; }
    set strokeStyle(v) { this.ctx.strokeStyle = v; }
    get fillStyle() { return this.ctx.fillStyle; }
    set fillStyle(v) { this.ctx.fillStyle = v; }
    get globalAlpha() { return this.ctx.globalAlpha; }
    set globalAlpha(v) { this.ctx.globalAlpha = v; }
    beginPath() { this.ctx.beginPath(); return this; }
    closePath() { this.ctx.closePath(); return this; }
    stroke() { this.ctx.stroke(); return this; }
    fill() { this.ctx.fill(); return this; }
    clip() { this.ctx.clip(); return this; }
    save() { this.ctx.save(); return this; }
    restore() { this.ctx.restore(); return this; }
    scale(x, y = x) {
        this.ctx.scale(x, y);
        return this;
    }
    rotate(angle) {
        this.ctx.rotate(-angle * PI12);
        return this;
    }
    moveTo(x, y) {
        // log({ move: { x: +x.toFixed(3), y: +y.toFixed(3) } });
        this.ctx.moveTo(y, x);
        return this;
    }
    moveToR(r, a) {
        this.moveTo(-r * Math.sin(a * PI12), r * Math.cos(a * PI12));
        return this;
    }
    lineTo(x, y) {
        // log({ line: { x: +x.toFixed(3), y: +y.toFixed(3) } })
        this.ctx.lineTo(y, x);
        return this;
    }
    lineToR(radius, direction) {
        this.lineTo(-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12));
        return this;
    }
    rToXY(radius, direction) {
        return [-radius * Math.sin(direction * PI12), radius * Math.cos(direction * PI12)];
    }
    arc(cx, cy, radius, from, to, dir) {
        this.ctx.arc(cx, cy, radius, -from * PI12, -to * PI12, dir);
        return this;
    }
    fillRect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h);
        return this;
    }
    saved(f) {
        this.save();
        f(this);
        this.restore();
    }
}
function log(...a) {
    console.error(...a);
    document.body.append(document.createElement('br'));
    for (let o of a)
        document.body.append(JSON.stringify(o));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3pDb250ZXh0MkQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2hhcGVzdC9fL1N6Q29udGV4dDJELnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDMUIsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFRbEMsTUFBTSxPQUFPLFdBQVc7SUFDdkIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFxQjtRQUN0QyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO1FBQy9CLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbkIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELEtBQUs7UUFDSixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFD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LFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxLQUFLLENBQUMsQ0FBc0I7UUFDM0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hCLENBQUM7Q0FDRDtBQUdELFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBUTtJQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25ELEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQztRQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmV4cG9ydCBjb25zdCBybW9kZSA9IHRydWU7XHJcbmV4cG9ydCBjb25zdCBQSTEyID0gLU1hdGguUEkgLyAxMjtcclxuXHJcbmV4cG9ydCB0eXBlIHJvdGF0aW9uMjQgPSBudW1iZXIgJiB7IF8/OiByb3RhdGlvbjI0IH1cclxuZXhwb3J0IHR5cGUgY2hhciA9IHN0cmluZyAmIHsgXz86IGNoYXIgfTtcclxuZXhwb3J0IHR5cGUgc3R5bGVTdHJpbmcgPSBzdHJpbmcgJiB7IF8/OiBzdHlsZVN0cmluZyB9O1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU3pDb250ZXh0MkQge1xyXG5cdHN0YXRpYyBmcm9tQ2FudmFzKGN2OiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG5cdFx0bGV0IGN0eCA9IGN2LmdldENvbnRleHQoJzJkJykhO1xyXG5cdFx0Y29uc3QgUEkgPSBNYXRoLlBJO1xyXG5cdFx0Y29uc3QgUEkxMiA9IC1QSSAvIDEyO1xyXG5cdFx0Y3R4LnNjYWxlKGN2LndpZHRoIC8gMiwgY3YuaGVpZ2h0IC8gMik7XHJcblx0XHRjdHgudHJhbnNsYXRlKDEsIDEpO1xyXG5cdFx0Y3R4LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xyXG5cdFx0Y3R4LnNjYWxlKDEgLyAxLjE1LCAxIC8gMS4xNSk7XHJcblx0XHRjdHgubGluZUNhcCA9ICdyb3VuZCc7XHJcblx0XHRjdHgubGluZUpvaW4gPSAncm91bmQnO1xyXG5cdFx0cmV0dXJuIG5ldyBTekNvbnRleHQyRChjdHgpO1xyXG5cdH1cclxuXHRjbGVhcigpIHtcclxuXHRcdHRoaXMuY3R4LmNsZWFyUmVjdCgtMiwgLTIsIDQsIDQpO1xyXG5cdH1cclxuXHJcblx0Y3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLmN0eCA9IGN0eDtcclxuXHR9XHJcblx0Z2V0IGxpbmVXaWR0aCgpIHsgcmV0dXJuIHRoaXMuY3R4LmxpbmVXaWR0aDsgfVxyXG5cdHNldCBsaW5lV2lkdGgodikgeyB0aGlzLmN0eC5saW5lV2lkdGggPSB2OyB9XHJcblx0Z2V0IHN0cm9rZVN0eWxlKCkgeyByZXR1cm4gdGhpcy5jdHguc3Ryb2tlU3R5bGUgYXMgc3R5bGVTdHJpbmc7IH1cclxuXHRzZXQgc3Ryb2tlU3R5bGUodikgeyB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHY7IH1cclxuXHRnZXQgZmlsbFN0eWxlKCkgeyByZXR1cm4gdGhpcy5jdHguZmlsbFN0eWxlIGFzIHN0eWxlU3RyaW5nOyB9XHJcblx0c2V0IGZpbGxTdHlsZSh2KSB7IHRoaXMuY3R4LmZpbGxTdHlsZSA9IHY7IH1cclxuXHRnZXQgZ2xvYmFsQWxwaGEoKSB7IHJldHVybiB0aGlzLmN0eC5nbG9iYWxBbHBoYTsgfVxyXG5cdHNldCBnbG9iYWxBbHBoYSh2KSB7IHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gdjsgfVxyXG5cclxuXHJcblx0YmVnaW5QYXRoKCkgeyB0aGlzLmN0eC5iZWdpblBhdGgoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRjbG9zZVBhdGgoKSB7IHRoaXMuY3R4LmNsb3NlUGF0aCgpOyByZXR1cm4gdGhpczsgfVxyXG5cdHN0cm9rZSgpIHsgdGhpcy5jdHguc3Ryb2tlKCk7IHJldHVybiB0aGlzOyB9XHJcblx0ZmlsbCgpIHsgdGhpcy5jdHguZmlsbCgpOyByZXR1cm4gdGhpczsgfVxyXG5cdGNsaXAoKSB7IHRoaXMuY3R4LmNsaXAoKTsgcmV0dXJuIHRoaXM7IH1cclxuXHRzYXZlKCkgeyB0aGlzLmN0eC5zYXZlKCk7IHJldHVybiB0aGlzOyB9XHJcblx0cmVzdG9yZSgpIHsgdGhpcy5jdHgucmVzdG9yZSgpOyByZXR1cm4gdGhpczsgfVxyXG5cclxuXHRzY2FsZSh4OiBudW1iZXIsIHk6IG51bWJlciA9IHgpIHtcclxuXHRcdHRoaXMuY3R4LnNjYWxlKHgsIHkpOyByZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHJvdGF0ZShhbmdsZTogcm90YXRpb24yNCkge1xyXG5cdFx0dGhpcy5jdHgucm90YXRlKC1hbmdsZSAqIFBJMTIpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdG1vdmVUbyh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0Ly8gbG9nKHsgbW92ZTogeyB4OiAreC50b0ZpeGVkKDMpLCB5OiAreS50b0ZpeGVkKDMpIH0gfSk7XHJcblx0XHR0aGlzLmN0eC5tb3ZlVG8oeSwgeCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0bW92ZVRvUihyOiBudW1iZXIsIGE6IHJvdGF0aW9uMjQpIHtcclxuXHRcdHRoaXMubW92ZVRvKC1yICogTWF0aC5zaW4oYSAqIFBJMTIpLCByICogTWF0aC5jb3MoYSAqIFBJMTIpKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRsaW5lVG8oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdC8vIGxvZyh7IGxpbmU6IHsgeDogK3gudG9GaXhlZCgzKSwgeTogK3kudG9GaXhlZCgzKSB9IH0pXHJcblx0XHR0aGlzLmN0eC5saW5lVG8oeSwgeCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblx0bGluZVRvUihyYWRpdXM6IG51bWJlciwgZGlyZWN0aW9uOiByb3RhdGlvbjI0KSB7XHJcblx0XHR0aGlzLmxpbmVUbygtcmFkaXVzICogTWF0aC5zaW4oZGlyZWN0aW9uICogUEkxMiksIHJhZGl1cyAqIE1hdGguY29zKGRpcmVjdGlvbiAqIFBJMTIpKTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHRyVG9YWShyYWRpdXM6IG51bWJlciwgZGlyZWN0aW9uOiByb3RhdGlvbjI0KSB7XHJcblx0XHRyZXR1cm4gWy1yYWRpdXMgKiBNYXRoLnNpbihkaXJlY3Rpb24gKiBQSTEyKSwgcmFkaXVzICogTWF0aC5jb3MoZGlyZWN0aW9uICogUEkxMildIGFzIGNvbnN0O1xyXG5cdH1cclxuXHRhcmMoXHJcblx0XHRjeDogbnVtYmVyLCBjeTogbnVtYmVyLCByYWRpdXM6IG51bWJlciwgZnJvbTogcm90YXRpb24yNCwgdG86IHJvdGF0aW9uMjQsIGRpcj86IGJvb2xlYW5cclxuXHQpIHtcclxuXHRcdHRoaXMuY3R4LmFyYyhjeCwgY3ksIHJhZGl1cywgLWZyb20gKiBQSTEyLCAtdG8gKiBQSTEyLCBkaXIpO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cdGZpbGxSZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xyXG5cdFx0dGhpcy5jdHguZmlsbFJlY3QoeCwgeSwgdywgaCk7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHNhdmVkKGY6IChjdHg6IHRoaXMpID0+IHZvaWQpIHtcclxuXHRcdHRoaXMuc2F2ZSgpO1xyXG5cdFx0Zih0aGlzKTtcclxuXHRcdHRoaXMucmVzdG9yZSgpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGxvZyguLi5hOiBhbnlbXSkge1xyXG5cdGNvbnNvbGUuZXJyb3IoLi4uYSk7XHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XHJcblx0Zm9yIChsZXQgbyBvZiBhKVxyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQoSlNPTi5zdHJpbmdpZnkobykpO1xyXG59XHJcbiJdfQ==