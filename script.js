/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "App": () => /* binding */ App
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./utils.js");


let _instance;

class App {
    constructor(canvas) {
        this.canvas = canvas;

        /** @type {Component[]} */
        this._components = [];
        this.ctx = canvas.getContext('2d', { alpha: false });
        this.ctx.strokeStyle = '#222222';
        this.ctx.fillStyle = '#7affd1';
        this.ctx.font = '12px sans-serif';
        this.lastHovered = null;
        this.lastActivated = null;
        this._init();
    }

    static get instance() {
        return _instance || (i => _instance = i)(new App(document.getElementById('canvas')));
    }

    static onContextMenu(e) {
        e.preventDefault();
        return false;
    }

    /** @param {Component[]} components */
    set components(components) {
        this._components = components;
    }

    /** @returns {Component[]} */
    get components() {
        return this._components;
    }

    _init() {
        this.canvas.addEventListener('mousemove', (0,_utils__WEBPACK_IMPORTED_MODULE_0__.throttle)().bind(undefined, this.onMouseMove.bind(this)));
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('contextmenu', App.onContextMenu);
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    }

    dispatch(e) {
        this.canvas.dispatchEvent(e);
    }

    listen(eventType, handler) {
        this.canvas.addEventListener(eventType, handler);
    }

    unlisten(eventType, handler) {
        this.canvas.removeEventListener(eventType, handler);
    }

    onMouseUp() {
        this.lastActivated && this.lastActivated.onMouseUp();
    }

    onMouseDown(e) {
        e.preventDefault();
        const {offsetX: x, offsetY: y, button} = e;
        let topMost;
        for (let i = 0, zIndex = -1, items = this._components, {length} = items; i < length; i++) {
            if (
                items[i].zIndex > zIndex && (
                    items[i].x < x &&
                    items[i].y < y &&
                    (items[i].x + items[i].width) > x &&
                    (items[i].y + items[i].height) > y
                )
            ) {
                topMost = items[i];
                zIndex = topMost.zIndex;
            }
        }
        !Object.is(topMost, this.lastActivated) &&
            this.lastActivated && (
                this.lastActivated.onBlur() || this.lastActivated.onMouseOut()
        );
        this.lastActivated = topMost;
        topMost && (
            button === 2 ?
                topMost.onContextMenu({x, y}) : topMost.onMouseDown({x, y})
        );
    }

    onMouseMove({offsetX: x, offsetY: y}) {
        let topMost;
        for (let i = 0, zIndex = -1, items = this._components, {length} = items; i < length; i++) {
            if (
                items[i].zIndex > zIndex && (
                    items[i].x < x &&
                    items[i].y < y &&
                    (items[i].x + items[i].width) > x &&
                    (items[i].y + items[i].height) > y
                )
            ) {
                topMost = items[i];
                zIndex = topMost.zIndex;
            }
        }
        !Object.is(topMost, this.lastHovered) &&
            this.lastHovered &&
                this.lastHovered.onMouseOut();
        this.lastHovered = topMost;
        topMost && topMost.onMouseOver({x, y});
    }

    onTouchStart(e) {
        this.pointerContextMenuDelay = setTimeout(this.onTouchContextMenu.bind(this), 500, e);
        this.canvas.addEventListener('touchmove', this);
        this.canvas.addEventListener('touchend', this);
    }

    onTouchContextMenu({touches: [{pageX, pageY}]}) {
        const {offsetTop, offsetLeft} = this.canvas;
        this.onMouseDown({
            offsetX: Math.round(pageX - offsetLeft),
            offsetY: Math.round(pageY - offsetTop),
            button: 2,
            preventDefault() {}
        });
        this.handleEvent();
    }

    assignLastActivated(component) {
        this.lastActivated && this.lastActivated.onBlur();
        this.lastActivated = component;
    }

    repaintAffected({id, x, y, width, height, zIndex}) {
        for (let i = 0, items = this._components, {length} = items; i < length; i++) {
            if (
                items[i].id !== id &&
                items[i].zIndex > zIndex && (
                    (
                        items[i].y >= y && items[i].y <= (y + height) ||
                        items[i].y <= y && (items[i].y + items[i].height) >= y
                    ) && (
                        items[i].x >= x && items[i].x <= (x + width) ||
                        items[i].x <= x && (items[i].x + items[i].width) >= x
                    )
                )
            ) {
                items[i].render();
            }
        }
    }

    render() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0, items = this._components, {length} = items; i < length; i++) {
            items[i].render();
        }
    }

    handleEvent() {
        clearTimeout(this.pointerContextMenuDelay);
        this.canvas.removeEventListener('touchmove', this);
        this.canvas.removeEventListener('touchend', this);
    }
}


/***/ }),

/***/ "./components/button.js":
/*!******************************!*\
  !*** ./components/button.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button": () => /* binding */ Button
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");



class Button extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({value= 'Apply', callback = () => {}, ...params}) {
        super(params);
        this.name = 'Button';
        this.pressed = false;
        this.value = value;
        this.fontSize = 12;
        this.callback = callback;
        const ctx = _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx;
        ctx.save();
            ctx.font = `bold ${this.fontSize}px sans-serif`;
            Object.assign(this, Button.geometric, {width: ctx.measureText(value).width + 20});
        ctx.restore();
        this.x += Button.geometric.width - this.width - 2;
    }

    static get geometric() {
        return {
            width: 50,
            height: 20
        }
    }

    /**
     * @param {Object} o
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, value, fontSize, pressed, radius = 3}, ctx) {
        ctx.fillRect(x - 3, y - 3, width + 9, height + 9);
        ctx.save();
            ctx.fillStyle = '#a2a2a2';
            if (!pressed) {
                ctx.fillStyle = '#b1b1b1';
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 2;
                ctx.shadowColor = 'rgba(127,127,127,0.7)';
            }
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            ctx.lineTo(x + radius, y + height);
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.fill();
            if (pressed) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + 2, y + 2 + height - radius);
                ctx.lineTo(x + 2, y + 2 + radius);
                ctx.arcTo(x + 2, y + 2, x + 2 + radius, y, radius);
                ctx.lineTo(x + 2 + width - radius, y + 2);
                ctx.stroke();
            }
        ctx.restore();
        ctx.save();
            ctx.fillStyle = '#353535';
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillText(value, x + 10, y + height - 5);
        ctx.restore();
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'pointer';
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
    }

    onMouseDown() {
        super.onMouseDown();
        this.pressed = true;
        this.render();
        this.callback();
    }

    onMouseUp() {
        this.pressed = false;
        this.render();
    }

    render() {
        Button.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }
}


/***/ }),

/***/ "./components/chart-item.js":
/*!**********************************!*\
  !*** ./components/chart-item.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChartItem": () => /* binding */ ChartItem
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");




class ChartItem extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(params) {
        super(params);
        this.name = 'ChartItem';
        this.scale = 1;
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
        this.dataDrawAreaMap = [];
        this.ctxMenuConfig = [
            {
                title: 'Zoom In',
                children: [],
                type: this.setScale.bind(this, 1.1)
            },
            {
                title: 'Zoom Out',
                children: [],
                type: this.setScale.bind(this, 0.9)
            },
            {
                title: 'Zoom Reset',
                children: [],
                type: this.resetScale.bind(this)
            }
        ];
        this._init();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render(config, ctx) {
        const chartMargin = 20;
        const {x, y, width, height, padding, data: {points}} = config;
        const chartArea = {
            x: x + padding[3],
            y: y + padding[0],
            width: width - padding[1] - padding[3],
            height: height - padding[0] - padding[2]
        };
        const {min, max} = ChartItem.normalizeRange(points);
        const rangeScale = (chartArea.height - chartMargin) / (max - min);
        const zeroLevel = Math.floor((chartArea.y + chartMargin / 2) + max * rangeScale);
        ctx.save();
            ctx.fillStyle = 'white';
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = 'rgba(127, 127, 127, 0.2)';
            ctx.fillRect.apply(ctx, Object.values(chartArea));
        ctx.restore();
        ChartItem.drawXAxis({...config, ...chartArea}, ctx);
        ChartItem.drawYAxis({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
        return ChartItem.drawData({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawData({x, y, width, height, padding, scale, data: {points = [], margin = 0.2}, zeroLevel, rangeScale}, ctx) {
        const dataDrawAreaMap = [...points];
        ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.clip();
            ctx.setTransform(1, 0, 0, 1, x, zeroLevel);
            for (let i = 0,
                     {length} = points,
                     step = width / length,
                     barWidth = step * (1 - margin),
                     barHeight = -points[i].value * scale * rangeScale,
                     xPos = step / 2 - barWidth / 2,
                    fillStyle = points[i].value > 0 ? (
                        points[i].highlighted ? '#006b00' : '#00ff00') :
                        (points[i].highlighted ? '#810000' : '#ff0000');
                 i < length;
                 i++, xPos += step) {
                fillStyle = points[i].value > 0 ? (
                    points[i].highlighted ? '#006b00' : '#00ff00') :
                    (points[i].highlighted ? '#810000' : '#ff0000');
                barHeight = -points[i].value * scale * rangeScale;
                ctx.fillStyle = fillStyle;
                ctx.fillRect(xPos, 0, barWidth, -points[i].value * scale * rangeScale);
                dataDrawAreaMap[i] = {
                    ...dataDrawAreaMap[i],
                    ...{
                        x: xPos + x,
                        y: Math.min(zeroLevel, zeroLevel + barHeight),
                        width: barWidth,
                        height: Math.abs(barHeight)
                    }
                };
            }
        ctx.restore();
        return dataDrawAreaMap;
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawXAxis({x, y, width, height, data: {points}}, ctx) {
        ctx.save();
            ctx.strokeStyle = '#3c3c3c';
            ctx.fillStyle = '#3c3c3c';
            ctx.beginPath();
            ctx.moveTo(x, y + height + 5);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
            for (let i = 0,
                     step = width  / points.length,
                     xPos = x + step / 2,
                     roundedXPos = Math.round(xPos);
                 i < points.length;
                 i++, xPos += step, roundedXPos = Math.round(xPos)) {
                ctx.beginPath();
                ctx.moveTo(roundedXPos, y + height + 5);
                ctx.lineTo(roundedXPos, y);
                ctx.stroke();
                ctx.save();
                    ctx.font = '10px sans-serif';
                    ctx.setTransform(1, 0, 0, 1, roundedXPos + 5, y + height + ctx.measureText(points[i].category).width + 5)
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText(points[i].category, 0, 0);
                ctx.restore();
            }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawYAxis({x, y, width, height, ticks = 5, zeroLevel, scale, rangeScale, data: {points}}, ctx) {
        ctx.save();
            ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
            ctx.fillStyle = '#1a1a1a';
            ctx.font = 'bold 14px sans-serif';
            const interval = Math.floor(height / ticks);
            for (let i = 0,
                     yPos = y + height - Math.abs(zeroLevel - y - height) % interval,
                     label = ((zeroLevel - yPos) / rangeScale / scale).toFixed(2);
                 i < ticks;
                 yPos -= interval,
                 i++, label = ((zeroLevel - yPos ) / rangeScale / scale).toFixed(2)) {
                ctx.beginPath();
                ctx.moveTo(x - 5, yPos);
                ctx.lineTo(x + width, yPos);
                ctx.stroke();
                ctx.fillText(label, x - ctx.measureText(label).width - 10, yPos);
            }
        ctx.restore();
    }

    static normalizeRange(data) {
        return data.reduce(({min, max, maxNegative, minPositive}, {value}) => (
            {
                min: Math.min(value, min),
                max: Math.max(value, max)
            }
        ), {
            min: Infinity,
            max: -Infinity
        });
    }

    static mockData() {
        return new Array(30).fill([1, -1]).map((bi, idx) => (
            {
                category: `Category${idx + 1}`,
                value: Math.floor(Math.random() * 10000* bi[Math.round(Math.random())]) / 100,
            }
        ))
    }

    _init() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('randomizeChartData', this);
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    render() {
        this.data.points = ChartItem.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }

    resetScale() {
        this.scale = 1;
    }

    setScale(scale = 1) {
        this.scale *= scale;
        this.render();
    }

    highlightItems({x, y}) {
        let highlighted = null;
        this.tooltipContent = '';
        super.onMouseOut();
        this.data.points.forEach(i => {
            const {x: itemX, y: itemY, width, height} = i;
            i.highlighted = itemX < x &&
                                itemY < y &&
                                    (itemX + width) > x &&
                                        (itemY + height) > y;
            if (i.highlighted) highlighted = i;
        });
        this.render();
        if (highlighted) {
            this.tooltipContent = highlighted.value;
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = setTimeout(this.initTooltip.bind(this), 500, {...this, ...{x, y}});
        }
    }

    handleEvent({type, offsetX: x, offsetY: y}) {
        switch (type) {
            case 'mousemove':
                this.throttle(this.highlightItems.bind(this), {x, y});
                break;
            case 'randomizeChartData':
                this.data.points = ChartItem.mockData();
                this.render();
                break;
            default:
        }
    }
}


/***/ }),

/***/ "./components/clock.js":
/*!*****************************!*\
  !*** ./components/clock.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Clock": () => /* binding */ Clock
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tooltip */ "./components/tooltip.js");





class Clock extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(params) {
        super(params);
        this.name = 'Clock';
        this.value = this.tooltipContent = '';
        this.fontSize = 20;
        Object.assign(this, Clock.geometric);
        this._init();
    }

    static get geometric() {
        return {
            width: 30,
            height: 20
        }
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, value, fontSize}, ctx) {
        ctx.fillRect(x, y, width, height);
        ctx.save();
			ctx.fillStyle = '#161616';
			ctx.font = `bold ${fontSize}px sans-serif`;
			const fontHeight = ctx.measureText(value).actualBoundingBoxAscent;
			ctx.fillText(value, x + 1, y + fontHeight + 5);
        ctx.restore();
    }

    _init() {
        const ctx = _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx;
        setInterval(this.onValueChange.bind(this), 1000);
        this.setValue((0,_utils__WEBPACK_IMPORTED_MODULE_2__.timeFormat)(Date.now()));
        ctx.save();
            ctx.font = `bold ${this.fontSize}px sans-serif`;
            this.width = Math.ceil(ctx.measureText(this.value).width) + 1;
        ctx.restore();
        this.x = _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.width - this.width;
    }

    onMouseOver(pos) {
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = setTimeout(this.initTooltip.bind(this), 500, {...this, ...pos});
    }

    onMouseOut() {
        clearTimeout(this.tooltipTimeout);
        _tooltip__WEBPACK_IMPORTED_MODULE_3__.Tooltip.instance.hide();
    }

    setValue(value) {
        this.value = this.tooltipContent = value;
        this.render();
    }

    onValueChange() {
        this.setValue((0,_utils__WEBPACK_IMPORTED_MODULE_2__.timeFormat)(Date.now()));
    }

    render() {
        Clock.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }
}


/***/ }),

/***/ "./components/collection-item.js":
/*!***************************************!*\
  !*** ./components/collection-item.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectionItem": () => /* binding */ CollectionItem
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _value_item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./value-item */ "./components/value-item.js");




class CollectionItem {

    /** @returns {Component[]} */
    static compose({x, y, cols, rows, gap = 20, ctor}) {
        const {width, height} = ctor.geometric;
        return new Array(rows).fill(_app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx).reduce((result, ctx, row) => (
            [
                ...result,
                ...new Array(cols).fill(ctor).map((ctor, col) => {
                    const [id, xPos, yPos, zIndex] = [
                        _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId,
                        x + col * (width + gap),
                        y + row * (height + gap),
                        (row + 1) * (col + 1)
                    ];
                    const instance = new ctor({id, x: xPos, y: yPos, value: _value_item__WEBPACK_IMPORTED_MODULE_2__.ValueItem.randomValue, zIndex, ctx});
                    instance.initRandomChange();
                    return instance;
                })
            ]
        ), []);
    }
}


/***/ }),

/***/ "./components/combo-box.js":
/*!*********************************!*\
  !*** ./components/combo-box.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComboBox": () => /* binding */ ComboBox
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");




class ComboBox extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({width = ComboBox.geometric.width, menuItems = [], variableName, ...params}) {
        super(params);
        this.name = 'ComboBox';
        this.opened = false;
        Object.assign(this, ComboBox.geometric, {width});
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
        this.variable = {
            name: variableName,
            value: null,
            title: 'Select...'
        };
        this.menuItems = menuItems.map((i, idx) => ({
            ...i,
            ...{
                y: this.y + this.height + idx * this.height,
                height: this.height,
                highlighted: false
            }
        }));
        this.triggerArea = {
            x: this.x + width - 20,
            y: this.y,
            width: 20,
            height: this.height
        }
        this.fullHeight = this.height + menuItems.length * 20;
    }

    static get geometric() {
        return {
            width: 70,
            height: 20
        }
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, fullHeight, opened, variable: {title}, menuItems}, ctx) {
        const borderColor = '#808080';
        const fontColor = '#242424';
        const backgroundColor = '#c8c8c8';
        const highlightColor = '#8d8d8d';
        ctx.fillRect(x - 2, y - 2, width + 3, fullHeight + 3);
        ctx.save();
            ctx.fillStyle = fontColor;
            ctx.strokeStyle = borderColor;
            ctx.font = 'bold 12px sans-serif';
            ctx.strokeRect(x, y, width, height);
            ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, x + width - height, height);
                ctx.clip();
                ctx.fillText(title, x + 3, y + height - 5);
            ctx.restore();
            ctx.save();
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(x + width - height, y, height, height);
                ctx.font = '12px sans-serif';
                ctx.fillStyle = fontColor;
                ctx.fillText(opened ? '\u25B2' : '\u25BC', x + width - height / 2 - 5, y + height - 6);
            ctx.restore();
            if (!opened) return ctx.restore();
            for (let i = 0,
                     {length} = menuItems,
                     yPos = y + height + 1,
                     fontHeight = ctx.measureText(menuItems[i].title).actualBoundingBoxAscent,
                     textYPos = (height - fontHeight) / 2 + fontHeight;
                 i < length; i++, yPos = y + height + 1 + height * i) {
                ctx.fillStyle = menuItems[i].highlighted ? highlightColor : backgroundColor;
                ctx.fillRect(x, yPos, width, height);
                ctx.fillStyle = fontColor;
                ctx.fillText(menuItems[i].title, x + 3, yPos + textYPos);
            }
        ctx.restore();
    }

    onMouseOver({x, y}) {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = (
            this.triggerArea.x > x ||
            this.triggerArea.y > y ||
            (this.triggerArea.x + this.triggerArea.width) < x ||
            (this.triggerArea.y + this.triggerArea.height) < y
        ) ? 'initial' : 'pointer';
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
    }

    onBlur() {
        this.opened = false;
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    onMouseDown({x, y}) {
        super.onMouseDown({x, y});
        if (
            this.triggerArea.x > x ||
            this.triggerArea.y > y ||
            (this.triggerArea.x + this.triggerArea.width) < x ||
            (this.triggerArea.y + this.triggerArea.height) < y
        ) return;
        this.opened = !this.opened;
        this.render();
        this.opened ? (
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this) ||
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousedown', this)
        ) : (
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this) ||
            _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousedown', this)
        );
    }

    onMenuSelect({offsetX: x, offsetY: y}) {
        if (
            this.triggerArea.x < x &&
            this.triggerArea.y < y &&
            (this.triggerArea.x + this.triggerArea.width) > x &&
            (this.triggerArea.y + this.triggerArea.height) > y
        ) return;
        const selectedItem = this.menuItems.find(({y: menuY, height}) => (
            this.x < x &&
            menuY < y &&
            (this.x + this.width) > x &&
            (menuY + height) > y
        ));
        this.hideMenu();
        selectedItem && (this.setValue(selectedItem) || this.render());
    }

    hideMenu() {
        this.opened = false;
        this.render();
    }

    render() {
        ComboBox.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render({...this, ...{height: this.fullHeight}});
    }

    highlightItems({offsetX: x, offsetY: y}) {
        this.menuItems.forEach(i => {
            const {y: itemY, height} = i;
            i.highlighted = this.x < x &&
                itemY < y &&
                (this.x + this.width) > x &&
                (itemY + height) > y;
        });
        this.render();
    }

    setValue({title, value}) {
        Object.assign(this.variable, {title, value});
        // App.instance.dispatch(new CustomEvent('updateLocalVariable', {detail: this.variable}));
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mousedown':
                this.onMenuSelect(e);
                break;
            case 'mousemove':
                this.throttle(this.highlightItems.bind(this), e);
                break;
            default:
        }
    }
}


/***/ }),

/***/ "./components/component.js":
/*!*********************************!*\
  !*** ./components/component.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => /* binding */ Component
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _context_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context-menu */ "./components/context-menu.js");
/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tooltip */ "./components/tooltip.js");
/* harmony import */ var _hover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hover */ "./components/hover.js");





let _id = 0;

class Component {
    constructor(params) {
        this.visible = true;
        this.zIndex = -1;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.ctxMenuConfig = [];
        this.tooltipContent = '';
        this.name = '';
        Object.assign(this, params);
        this.tooltipTimeout = 0;
        this.firstRender = true;
    }

    static get nextId() {
        return (_id++).toString();
    }

    onContextMenu(pos) {
        clearTimeout(this.tooltipTimeout);
        _tooltip__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.hide();
        _context_menu__WEBPACK_IMPORTED_MODULE_1__.ContextMenu.instance.show({...this, ...pos});
    }

    onBlur() {
    }

    onMouseUp() {}

    onMouseDown() {}

    onMouseOver(pos) {
        _hover__WEBPACK_IMPORTED_MODULE_3__.Hover.instance.show(this);
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = setTimeout(this.initTooltip.bind(this), 500, {...this, ...pos});
    }

    onMouseOut() {
        clearTimeout(this.tooltipTimeout);
        _tooltip__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.hide();
        _hover__WEBPACK_IMPORTED_MODULE_3__.Hover.instance.hide();
    }

    render(config = this) {
        if (this.firstRender) return this.firstRender = false;
        _app__WEBPACK_IMPORTED_MODULE_0__.App.instance.repaintAffected(config);
    }

    translate({x = 0, y = 0}) {
        this.hide();
        Object.assign(this, {
            x: this.x + x,
            y: this.y + y
        });
        this.show();
    }

    resize({width = 0, height = 0}) {
        this.render({...this, ...{visible: false}});
        Object.assign(this, {
            width: this.width + width,
            height: this.height + height
        });
        this.render();
    }

    hide() {
        this.visible = false;
        this.render();
    }

    show() {
        this.visible = true;
        this.render();
    }

    initTooltip(config) {
        _tooltip__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance.show(config);
    }
}


/***/ }),

/***/ "./components/context-menu.js":
/*!************************************!*\
  !*** ./components/context-menu.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContextMenu": () => /* binding */ ContextMenu
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app */ "./app.js");




let _instance;

class ContextMenu {
    constructor({id}) {
        this.id = id;
        this.ctxMenuItems = [];
        this.initialWidth = this.initialHeight = 0;
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.throttle)(50);
    }

    /** @returns {ContextMenu} */
    static get instance() {
        return _instance || (i => _instance = i)(new ContextMenu({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     * @returns Object[]
     */
    static render({x, y, width: fullWidth, height: fullHeight, initialWidth: width, initialHeight: height, ctxMenuItems}, ctx) {
        ctx.fillRect(x, y, fullWidth, fullHeight);
        if (!ctxMenuItems.length) return [];

        ctx.save();
            ctx.font = '10px/1 sans-serif';
            const {width: arrowWidth, actualBoundingBoxAscent: arrowHeight} = ctx.measureText('\u25b6');
            const {collection} = ctxMenuItems.reduce(function recurse({x, y, width, visible, collection}, {type, title, highlighted, disabled = false, children = []}, idx) {
                ctx.font = '12px/normal sans-serif';
                const {width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText(title);
                const area = {x, y: y + (fontHeight + 10) * idx, width, height: fontHeight + 10};
                const returnValue = {x, y, width, visible,
                    collection: [
                        ...collection,
                        ...[{
                            ...area,
                            ...{
                                type, title, highlighted, disabled,
                                children: children.reduce(recurse, {
                                    x: area.x + area.width,
                                    y: area.y,
                                    width: children.reduce(ContextMenu.calculateMaxWidth, {ctx, maxWidth: 0}).maxWidth,
                                    visible: highlighted,
                                    collection: []
                                }).collection
                            }
                        }]
                    ]
                };
                if (!visible) return returnValue;
                ctx.fillStyle = highlighted ? '#91b5c8' : '#d0d0d0';
                ctx.fillRect.apply(ctx, Object.values(area));
                ctx.fillStyle = disabled ? '#9d9d9d' : '#181818';
                ctx.font = '12px/normal sans-serif';
                ctx.fillText(title, area.x + 10, area.y + area.height - 5);
                if (!children.length) return returnValue;

                ctx.font = '10px/1 sans-serif';
                ctx.fillText('\u25b6', area.x + area.width - arrowWidth - 2, area.y + area.height / 2 + arrowHeight / 2);
                return returnValue;
            }, {x, y, width, visible: true, collection: []});
        ctx.restore();
        return collection;
    }

    static findItemUnderPointer({x, y, right = 0, bottom = 0, highlighted}, item) {
        let wasHighlighted = item.highlighted, hasHighlightedChild;
        item.highlighted = !item.disabled && (
            item.x <= x &&
            item.y <= y &&
            (item.x + item.width) > x &&
            (item.y + item.height) > y
        );
        if (item.highlighted || wasHighlighted) {
            ({highlighted: hasHighlightedChild, right, bottom} = item.children.reduce(ContextMenu.findItemUnderPointer, {x, y, right, bottom}));
        }
        item.highlighted = item.highlighted || hasHighlightedChild;
        return {
            x, y,
            right: Math.max(right, item.x + item.width),
            bottom: Math.max(bottom, item.y + item.height),
            highlighted: item.highlighted || highlighted
        };
    }

    static calculateMaxWidth({ctx, maxWidth}, {title}) {
        return {ctx, maxWidth: Math.floor(Math.max(maxWidth, ctx.measureText(title).width + 30))};
    }

    onMouseUp() {}

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.unlisten('mousemove', this);
    }

    onMouseDown({x: clickX, y: clickY}) {
        this.handleEvent({offsetX: clickX, offsetY: clickY});
        const {found} = this.ctxMenuItems.reduce(function recurse({zIndex: highestZIndex, found}, item) {
            const {x, y, width, height, zIndex = 1, highlighted, children = []} = item;
            return (
                zIndex > highestZIndex &&
                highlighted &&
                x < clickX &&
                y < clickY &&
                (x + width) > clickX &&
                (y + height) > clickY && {zIndex, found: item}
            ) || children.reduce(recurse, {zIndex: highestZIndex, found});
        }, {zIndex: -1, found: null});
        found && found.type && (found.type() || this.hide());
    }

    onBlur() {
        this.hide();
    }

    show({x, y, ctxMenuConfig: ctxMenuItems}) {
        if (!ctxMenuItems) return;
        Object.assign(this, {x, y, zIndex: Infinity, ctxMenuItems});
        ({maxWidth: this.initialWidth, maxWidth: this.width} = ctxMenuItems.reduce(ContextMenu.calculateMaxWidth, {ctx: _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.ctx, maxWidth: 0}));
        this.render();
        this.height = this.initialHeight = this.ctxMenuItems.reduce((totalHeight, {height}) => totalHeight += height, 0);
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.assignLastActivated(this);
    }

    hide() {
        Object.assign(this, {zIndex: -1, ctxMenuItems: []});
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.repaintAffected(this);
        Object.assign(this, {x: -Infinity, y: -Infinity, width: 0, height: 0});
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.unlisten('mousemove', this);
    }

    render() {
        this.ctxMenuItems = ContextMenu.render(this, _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.ctx);
    }

    highlightItems({x, y}) {
        const {width, height} = this;
        const {right, bottom} = this.ctxMenuItems.reduce(ContextMenu.findItemUnderPointer, {x, y, right: 0, bottom: 0});
        this.render();
        this.width = right - this.x;
        this.height = bottom - this.y;
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.repaintAffected({...this, ...{width, height, zIndex: -1}});
    }

    handleEvent({offsetX: x, offsetY: y}) {
        this.throttle(this.highlightItems.bind(this), {x, y});
    }
}


/***/ }),

/***/ "./components/date-picker.js":
/*!***********************************!*\
  !*** ./components/date-picker.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DatePicker": () => /* binding */ DatePicker
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");




let _instance;

class DatePicker {
    constructor({id}) {
        this.id = id;
        this.opened = false;
        this.currentDate = new Date();
        this.calendarData = null;
        this.observableAreas = {dates: [], rest: []};
        this.initiator = null;
        Object.assign(this, DatePicker.geometric);
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
        this._init();
    }

    /** @returns {DatePicker} */
    static get instance() {
        return _instance || (i => _instance = i)(new DatePicker({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    static get geometric() {
        return {
            width: 300,
            height: 240
        }
    }

    /**
     * @param {Object} o
     * @param {CanvasRenderingContext2D} ctx
     * @returns {{year: string, month: string, observableAreas?: Object[], dates: Object[]}}
     */
    static render({x, y, width, height, opened, calendarData: {year, month, dates = []}, currentDate}, ctx) {
        ctx.fillRect(x, y, width, height);
        if (!opened) return {year, month, dates};
        ctx.save();
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#006d99';
            ctx.font = 'bold 16px/1 sans-serif';
            let {width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText(month);
            const {width: arrowWidth} = ctx.measureText('\u25B2');
            ctx.translate(10, 8);
            let {e: leftArrowXPos} = ctx.getTransform();
            ctx.fillText('\u25C0', 0, fontHeight + 8);
            ctx.translate(arrowWidth + 10, 0);
            ctx.fillText(month, 0, fontHeight + 8);
            ctx.translate(fontWidth + 10, 0);
            let {e: rightArrowXPos} = ctx.getTransform();
            ctx.fillText('\u25B6', 0, fontHeight + 8);
            let observableAreas = [{
                x: leftArrowXPos,
                y,
                width: arrowWidth,
                height: 30,
                zIndex: 2,
                type: 'decreaseCurrentMonth',
                cursorType: 'pointer'
            }, {
                x: rightArrowXPos,
                y,
                width: arrowWidth,
                height: 30,
                zIndex: 2,
                type: 'increaseCurrentMonth',
                cursorType: 'pointer'
            }];
            ({width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText(year));
            ctx.setTransform(1, 0, 0, 1, x + width - fontWidth - arrowWidth * 2 - 30, y + 8);
            ({e: leftArrowXPos} = ctx.getTransform());
            ctx.fillText('\u25C0', 0, fontHeight + 8);
            ctx.translate(arrowWidth + 10, 0);
            ctx.fillText(year, 0, fontHeight + 8);
            ctx.translate(fontWidth + 10, 0);
            ({e: rightArrowXPos} = ctx.getTransform());
            ctx.fillText('\u25B6', 0, fontHeight + 8);
            observableAreas = [
                ...observableAreas,
                ...[{
                    x: leftArrowXPos,
                    y,
                    width: fontWidth,
                    height: 30,
                    zIndex: 2,
                    type: 'decreaseCurrentYear',
                    cursorType: 'pointer'
                }, {
                    x: rightArrowXPos,
                    y,
                    width: fontWidth,
                    height: 30,
                    zIndex: 2,
                    type: 'increaseCurrentYear',
                    cursorType: 'pointer'
                }]
            ];
            const returnValue = {
                year,
                month,
                observableAreas,
                dates: DatePicker.renderCalendarData({
                    x: x + 4,
                    y: y + 40 + 4,
                    width: width - 8,
                    height: height - 40 - 8,
                    data: dates,
                    currentDate
                }, ctx)
            };
        ctx.restore();
        return returnValue;
    }

    /**
     * @param {Object} o
     * @param {CanvasRenderingContext2D} ctx
     * @returns Object[]
     */
    static renderCalendarData({x, y, width, height, data, currentDate}, ctx) {
        ctx.save();
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.font = '18px sans-serif';
            let xPos = 0, roundedXPos = 0, yPos = 0, roundedYPos = 0, contentWidth;
            const interval = {
                horizontal: width / 7,
                vertical: height / Math.ceil(data.length / 7)
            };
            const fontYPos = Math.round(interval.vertical / 2 + ctx.measureText('0').actualBoundingBoxAscent / 2) - 2;
            const currentDateDate = currentDate.getDate();
            const dataArea = data.reduce((collection, item, i) => {
                if (!item) return [...collection, ...[item]];
                const {date, highlighted} = item;
                const isCurrentSelectedDate = currentDateDate === date;
                xPos = i % 7 * interval.horizontal;
                roundedXPos = Math.round(xPos);
                yPos = xPos ? yPos : (i ? yPos + interval.vertical : yPos);
                roundedYPos = Math.round(yPos);
                ctx.save();
                    ctx.fillStyle = isCurrentSelectedDate ? 'red' : '#003b6e';
                    if (highlighted) {
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;
                        ctx.shadowBlur = 1;
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                    }
                    ctx.fillRect(roundedXPos, roundedYPos, Math.round(interval.horizontal) - 4, Math.round(interval.vertical) - 4);
                ctx.restore();
                ctx.fillStyle = 'white';
                ({width: contentWidth} = ctx.measureText(date));
                ctx.fillText(date, roundedXPos + Math.round((interval.horizontal - 4) / 2 - contentWidth / 2), roundedYPos + fontYPos);
                return [
                    ...collection,
                    ...[{
                        date,
                        highlighted,
                        x: x + roundedXPos,
                        y: y + roundedYPos,
                        width: Math.round(interval.horizontal) - 4,
                        height: Math.round(interval.vertical) - 4,
                        zIndex: 2,
                        type: 'pickDate',
                        cursorType: 'pointer'
                    }]
                ];
            }, []);
        ctx.restore();
        return dataArea;
    }

    /** @this {DatePicker.prototype} */
    static findItemUnderPointer({x: pointerX, y: pointerY, cursorType: latestKnownCursorType, zIndex: highestZIndex}, area) {
        if (!area) return {x: pointerX, y: pointerY, cursorType: latestKnownCursorType, zIndex: highestZIndex};
        const {x, y, width, height, zIndex} = area;
        const match = zIndex > highestZIndex &&
            x < pointerX &&
            y < pointerY &&
            (x + width) > pointerX &&
            (y + height) > pointerY;
        area.highlighted = match;
        return {...{x: pointerX, y: pointerY}, ...((match && area) || {cursorType: latestKnownCursorType, zIndex: highestZIndex})};
    }

    static calendarBuilder(date) {
        date = new Date(date);
        date.setDate(1);
        let idx = (date.getDay() + 6) % 7;
        const result = {
            year: date.getFullYear(),
            month: new Intl.DateTimeFormat('ru', {month: 'long'})
                .format(date)
                .replace(/^[а-я]/, match => match.toUpperCase())
        };
        const data = [];
        do {
            data[idx++] = {
                date: date.getDate(),
                highlighted: false
            };
            date.setDate(date.getDate() + 1)
        } while (date.getDate() > 1);
        return {...result, ...{dates: [...data]}};
    }

    _init() {
        this.calendarData = DatePicker.calendarBuilder(this.currentDate);
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    onBlur() {
        this.hide();
    }

    onMouseUp() {}

    onMouseDown({x: clickX, y: clickY}) {
        const _find = area => (
            area && area.x < clickX && area.y < clickY && (area.x + area.width) > clickX && (area.y + area.height) > clickY
        );
        const area = this.calendarData.observableAreas.find(_find) || this.calendarData.dates.find(_find) || {type: ''};
        switch (area.type) {
            case 'pickDate':
                this.currentDate.setDate(area.date);
                break;
            case 'increaseCurrentMonth':
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                break;
            case 'decreaseCurrentMonth':
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                break;
            case 'increaseCurrentYear':
                this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
                break;
            case 'decreaseCurrentYear':
                this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
                break;
            default:
                return;
        }
        this.calendarData = DatePicker.calendarBuilder(this.currentDate);
        this.render();
        this.initiator.setDate(this.currentDate);
    }

    show({x = this.x, y = this.y, initiator}) {
        Object.assign(this, {x, y, zIndex: Infinity, initiator, opened: true});
        this.currentDate = initiator.date || new Date();
        this.calendarData = DatePicker.calendarBuilder(this.currentDate);
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.assignLastActivated(this);
    }

    hide() {
        Object.assign(this, {opened: false, zIndex: -1});
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.repaintAffected(this);
        Object.assign(this, {x: -Infinity, y: -Infinity, initiator: null});
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    render() {
        this.calendarData = DatePicker.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
    }

    highlightAreas(pos) {
        ({cursorType: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor} = [
            ...this.calendarData.dates,
            ...this.calendarData.observableAreas
        ].reduce(DatePicker.findItemUnderPointer, {...pos, ...{cursorType: 'initial', zIndex: -1}}));
        this.render();
    }

    handleEvent({offsetX: x, offsetY: y}) {
        this.throttle(this.highlightAreas.bind(this), {x, y});
    }
}


/***/ }),

/***/ "./components/edit-box.js":
/*!********************************!*\
  !*** ./components/edit-box.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditBox": () => /* binding */ EditBox
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _date_picker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./date-picker */ "./components/date-picker.js");





class EditBox extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({width = EditBox.geometric.width, isCalendar = false, date = isCalendar ? new Date() : null, value = isCalendar ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.dateFormat)(date) : '', ...params}) {
        super(params);
        this.name = 'EditBox';
        this.focused = false;
        this.value = value;
        this.date = date;
        this.isCalendar = isCalendar;
        this.htmlInput = null;
        Object.assign(this, EditBox.geometric, {width});
        this.observableAreas = [
            ...(
                isCalendar ? [
                    {
                        x: this.x,
                        y: this.y,
                        width: this.width - this.height,
                        height: this.height,
                        type: 'focus',
                        cursorType: 'text'
                    },
                    {
                        x: this.x + this.width - this.height,
                        y: this.y,
                        width: this.height,
                        height: this.height,
                        zIndex: 1,
                        type: 'showCalendar',
                        cursorType: 'pointer'
                    }
                ] : [
                    {
                        x: this.x,
                        y: this.y,
                        width: this.width,
                        height: this.height,
                        type: 'focus',
                        cursorType: 'text'
                    }
                ]
            )
        ];
        this.throttle = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.throttle)();
    }

    static get geometric() {
        return {
            width: 90,
            height: 20
        }
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, value, isCalendar}, ctx) {
        ctx.fillRect(x - 2, y - 2, width + 3, height + 3);
        ctx.save();
            ctx.font = '14px sans-serif';
            ctx.strokeStyle = '#666666';
            ctx.fillStyle = '#dddddd';
            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);
            ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.clip();
                if (value) {
                    ctx.fillStyle = '#1d1d1d';
                    ctx.fillText(value, x + 3, y + height - 4);
                }
            ctx.restore();
            if (!isCalendar) return ctx.restore();

            ctx.font = '18px/1 emoji';
            const fontHeight = ctx.measureText('📆').actualBoundingBoxAscent;
            ctx.fillStyle = '#666666';
            ctx.fillText('📆', x + width - height, y + fontHeight);
        ctx.restore();
    }

    /** @this {EditBox.prototype} */
    static defineCursorType({x, y}) {
        ({cursorType: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor} = (
            this.observableAreas.find(function({x, y, width, height}) {
                return x < this.x && y < this.y && (x + width) > this.x && (y + height) > this.y;
            }, {x, y}) || {cursorType: 'initial'}
        ));
    }

    onMouseOver() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('mousemove', this);
    }

    onMouseOut() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.style.cursor = 'initial';
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.unlisten('mousemove', this);
    }

    onBlur() {
        this.focused = false;
        const unsafeValue = this.htmlInput?.value ?? this.value;
        this.isCalendar ?
            /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(unsafeValue) && this.setDate(new Date(unsafeValue)) :
            this.setValue(unsafeValue);
        this.render();
        this.htmlInput && (this.htmlInput.remove() || this.htmlInput.removeEventListener('keydown', this));
    }

    onMouseDown({x, y}) {
        const area = this.observableAreas.find(function({x, y, width, height}) {
            return x < this.x && y < this.y && (x + width) > this.x && (y + height) > this.y;
        }, {x, y});
        if (!area) return;
        switch (area.type) {
            case 'focus':
                this.focus();
                break;
            case 'showCalendar':
                this.showCalendar({x, y});
                break;
            default:
        }
    }

    showCalendar({x, y}) {
        _date_picker__WEBPACK_IMPORTED_MODULE_3__.DatePicker.instance.show({initiator: this, x, y});
    }

    focus() {
        const offset = {
            top: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.offsetTop,
            left: _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.canvas.offsetLeft
        };
        this.focused = true;
        this.render();
        this.htmlInput = document.createElement('input');
        this.htmlInput.setAttribute('style', Object.entries({
            position: 'absolute',
            top: `${this.y + offset.top}px`,
            left: `${this.x + offset.left}px`,
            width: `${this.isCalendar ? this.width - this.height : this.width}px`,
            font: '14px sans-serif',
            'background-color': '#dddddd',
            border: 'none',
            padding: '2px 0'
        }).map(e => e.join(':')).join(';'));
        this.htmlInput.id = 'html-input-element';
        this.htmlInput.value = this.value;
        document.body.appendChild(this.htmlInput);
        this.htmlInput.focus();
        this.htmlInput.addEventListener('keydown', this);
    }

    setDate(date = this.date) {
        if (!date) return;
        this.date = date;
        this.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.dateFormat)(date);
        this.render();
    }

    setValue(value = this.value) {
        this.value = value;
        this.render();
    }

    render() {
        EditBox.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }

    handleEvent({type, key, offsetX: x, offsetY: y}) {
        switch (type) {
            case 'keydown':
                switch (key) {
                    case 'Enter':
                        this.onBlur();
                        break;
                    default:
                }
                break;
            case 'mousemove':
                return this.throttle(EditBox.defineCursorType.bind(this), {x, y});
            default:
        }
        this.render();
    }
}


/***/ }),

/***/ "./components/hover.js":
/*!*****************************!*\
  !*** ./components/hover.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hover": () => /* binding */ Hover
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");



let _instance;

class Hover {
    constructor({id}) {
        this.id = id;
        this.active = false;
    }

    /** @returns {Hover} */
    static get instance() {
        return _instance || (i => _instance = i)(new Hover({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, active}, ctx) {
        ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
        if (!active) return;
        ctx.save();
            ctx.strokeStyle = '#fd2929';
            ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }

    onContextMenu() {}

    onBlur() {}

    onMouseOver() {}

    onMouseOut() {}

    onMouseDown() {}

    onMouseUp() {}

    show({x, y, width, height, zIndex = 1}) {
        Object.assign(this, {
            x: x - 1,
            y: y - 1,
            width: width + 2,
            height: height + 2,
            zIndex: zIndex - 1,
            active: true
        });
        this.render();
    }

    hide() {
        this.zIndex = -1;
        this.active = false;
        this.render();
        Object.assign(this, {
            x: -Infinity,
            y: -Infinity,
            width: 0,
            height: 0
        });
    }

    render() {
        Hover.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.repaintAffected(this);
    }
}


/***/ }),

/***/ "./components/tooltip.js":
/*!*******************************!*\
  !*** ./components/tooltip.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tooltip": () => /* binding */ Tooltip
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./utils.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app */ "./app.js");




let _instance;

class Tooltip {
    constructor({id}) {
        this.id = id;
        this.text = '';
        this.debounce = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.debounce)();
    }

    /** @returns {Tooltip} */
    static get instance() {
        return _instance || (i => _instance = i)(new Tooltip({id: _component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}));
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, text}, ctx) {
        ctx.fillRect(x, y, width, height);
        if (!text) return;
        ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, 500, height);
            ctx.clip();
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#ffea9f';
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = '#323232';
            ctx.fillText(text, x + 10, y + height - 10);
        ctx.restore();
    }

    onContextMenu() {}

    onBlur() {}

    onMouseOver() {}

    onMouseOut() {}

    onMouseDown() {}

    onMouseUp() {}

    show({x, y, tooltipContent}) {
        const {ctx, canvas: {width: canvasWidth}} = _app__WEBPACK_IMPORTED_MODULE_2__.App.instance;
        ctx.save();
            ctx.font = '10px sans-serif';
            const {actualBoundingBoxAscent: contentHeight, width: contentWidth} = ctx.measureText(tooltipContent);
        ctx.restore();
        Object.assign(this, {
            x: x > (canvasWidth - contentWidth - 20) ? x - contentWidth - 20 : x,
            y: y > contentHeight + 20 ? y - contentHeight - 20 : y,
            width: contentWidth + 20,
            height: contentHeight + 20,
            text: tooltipContent,
            zIndex: Number.MAX_SAFE_INTEGER
        });
        this.render();
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.listen('mousemove', this);
    }

    hide() {
        this.zIndex = -1;
        this.text = '';
        this.render();
        Object.assign(this, {
            x: -Infinity,
            y: -Infinity,
            width: 0,
            height: 0
        });
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.unlisten('mousemove', this);
    }

    translate({x, y}) {
        const {text, zIndex} = this;
        Object.assign(this, {text: '', zIndex: -1});
        this.render();
        Object.assign(this, {...{x, y: y - this.height, text, zIndex}});
        this.render();
    }

    render() {
        Tooltip.render(this, _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.ctx);
        _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.repaintAffected(this);
    }

    handleEvent({offsetX: x, offsetY: y}) {
        this.debounce(this.translate.bind(this), {x, y});
    }
}


/***/ }),

/***/ "./components/trender.js":
/*!*******************************!*\
  !*** ./components/trender.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Trender": () => /* binding */ Trender
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./utils.js");





class Trender extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(params) {
        super(params);
        this.name = 'Trender';
        this.scale = 1;
        this.ctxMenuConfig = [
            {
                title: 'Zoom In',
                callback: function() {
                    this.scale *= 1.1;
                    this.render();
                }
            },
            {
                title: 'Zoom Out',
                callback: function() {
                    this.scale *= 0.9;
                    this.render();
                }
            },
            {
                title: 'Zoom Reset',
                callback: function() {
                    this.scale = 1;
                    this.render();
                }
            }
        ].map(({callback, ...rest}) => ({
            ...rest,
            ...{
                callback: callback.bind(this)
            }
        }));
        this.debounce = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)();
        this._init();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render(config, ctx) {
        const chartMargin = 20;
        const {x, y, width, height, padding, data: {points}} = config;
        const chartArea = {
            x: x + padding[3],
            y: y + padding[0],
            width: width - padding[1] - padding[3],
            height: height - padding[0] - padding[2]
        };
        const {min, max} = Trender.normalizeRange(points);
        const rangeScale = (chartArea.height - chartMargin) / (max - min);
        const zeroLevel = Math.floor((chartArea.y + chartMargin / 2) + max * rangeScale);
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = 'rgba(127, 127, 127, 0.2)';
        ctx.fillRect.apply(ctx, Object.values(chartArea));
        ctx.restore();
        Trender.drawXAxis({...config, ...chartArea}, ctx);
        Trender.drawYAxis({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
        Trender.drawData({...config, ...chartArea, ...{zeroLevel, rangeScale}}, ctx);
        Trender.drawLegend({...config, ...{
            x,
            y: y + height - 40,
            width,
            height: 40
        }}, ctx);
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawData({x, y, width, height, padding, scale, data: {points = []}, zeroLevel, rangeScale}, ctx) {
        ctx.save();
            ctx.strokeStyle = '#0000ff';
            ctx.fillStyle = 'white';
            ctx.setTransform(1, 0, 0, 1, x, zeroLevel);
            ctx.beginPath();
            ctx.moveTo(0, (-points[0]?.value || 0) * scale * rangeScale);
            for (let i = 0,
                     {length} = points,
                     step = width / length,
                     scaledValue = -points[i].value * scale * rangeScale,
                     xPos = 0;
                 i < length;
                 xPos += step, scaledValue = (-points[++i]?.value || 0) * scale * rangeScale) {
                ctx.lineTo(xPos, scaledValue);
            }
            ctx.stroke();
            for (let i = 0,
                     {length} = points,
                     step = width / length,
                     scaledValue = -points[i].value * scale * rangeScale,
                     xPos = 0;
                 i < length;
                 xPos += step, scaledValue = (-points[++i]?.value || 0) * scale * rangeScale) {
                ctx.fillRect(xPos - 4, scaledValue - 4, 8, 8);
                ctx.strokeRect(xPos - 4, scaledValue - 4, 8, 8);
            }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawXAxis({x, y, width, height, data: {points}}, ctx) {
        ctx.save();
            ctx.strokeStyle = '#3c3c3c';
            ctx.fillStyle = '#3c3c3c';
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
            ctx.font = '10px sans-serif';
            for (let i = 0,
                    xPos = x,
                    interval = width / points.length,
                    roundedXPos = Math.round(xPos),
                    labelWidth = ctx.measureText(points[0].time).width,
                    labelOffset = Math.round(labelWidth / 2),
                    labelsInterval = Math.ceil((labelWidth + 20) / interval),
                    nextLabelPos = xPos + labelsInterval,
                    isMajorTick = false;
                 i < points.length;
                 i++,
                     xPos += interval,
                     roundedXPos = Math.round(xPos),
                     isMajorTick = !(i % labelsInterval)) {
                ctx.strokeStyle = isMajorTick ? '#3c3c3c' : 'rgba(160, 160, 160, 0.5)';
                ctx.beginPath();
                ctx.moveTo(roundedXPos, isMajorTick ? y + height + 5 : y + height);
                ctx.lineTo(roundedXPos, y);
                ctx.stroke();
                if (!isMajorTick) continue;
                ctx.fillText(points[i].time, roundedXPos - labelOffset, y + height + 20);
                nextLabelPos += labelsInterval;
            }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawYAxis({x, y, width, height, ticks = 20, majorTicksInterval, zeroLevel, scale, rangeScale, data: {points}}, ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 14px sans-serif';
        const interval = height / ticks;
        ctx.beginPath();
        ctx.rect(x -100, y, width + 100, height);
        ctx.clip();
        for (let i = 0,
                 yPos = zeroLevel + Math.ceil((y + height - zeroLevel) / interval) * interval,
                 roundedYPos = Math.round(yPos),
                 label = ((zeroLevel - yPos) / rangeScale / scale).toFixed(2),
                isMajorTick = false;
             i < ticks;
             i++,
                yPos -= interval,
                 roundedYPos = Math.round(yPos),
                label = ((zeroLevel - yPos ) / rangeScale / scale).toFixed(2),
                 isMajorTick = Math.abs(yPos - zeroLevel) % (interval * majorTicksInterval) < interval / 2) {
            ctx.strokeStyle = isMajorTick ? '#434343' : 'rgba(160, 160, 160, 0.5)';
            ctx.beginPath();
            ctx.moveTo(isMajorTick ? x - 5 : x, roundedYPos);
            ctx.lineTo(x + width, roundedYPos);
            ctx.stroke();
            if (!isMajorTick) continue;
            ctx.fillText(label, x - ctx.measureText(label).width - 10, roundedYPos);
        }
        ctx.restore();
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawLegend({x, y, width, height, data: {name}}, ctx) {
        ctx.save();
            ctx.strokeStyle = 'rgb(0,0,255)';
            ctx.font = 'bold 12px sans-serif';
            const fontHeight = ctx.measureText(name).actualBoundingBoxAscent;
            ctx.setTransform(-1, 0, 0, 1, x + width / 2 - 5, y + height / 2);
            ctx.beginPath();
            ctx.moveTo(0, 4);
            ctx.lineTo(20, 4);
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fillRect(6, 0, 8, 8);
            ctx.strokeRect(6, 0, 8, 8);
            ctx.setTransform(1, 0, 0, 1, x + width / 2 + 5, y + height / 2);
            ctx.fillStyle = '#151515';
            ctx.fillText(name, 0, fontHeight - 2);
        ctx.restore();
    }

    static normalizeRange(data) {
        return data.reduce(({min, max, maxNegative, minPositive}, {value}) => (
            {
                min: Math.min(value, min),
                max: Math.max(value, max)
            }
        ), {
            min: Infinity,
            max: -Infinity
        });
    }

    static mockData() {
        const startTime = Date.now() - 1000 * 29;
        return new Array(30)
            .fill(startTime)
            .map((time, idx) => (
                {
                    time: new Date(time + 1000 * idx).toLocaleTimeString(),
                    value: _utils__WEBPACK_IMPORTED_MODULE_2__.sinusoidGen.next().value,
                }
            ));
    }

    static mockNextData() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.dispatch(new CustomEvent('trenderNextTick', {detail: {
            time: new Date().toLocaleTimeString(),
            value: _utils__WEBPACK_IMPORTED_MODULE_2__.sinusoidGen.next().value,
        }}))
    }

    _init() {
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.listen('trenderNextTick', this);
    }

    onMouseOver() {
    }

    render() {
        Trender.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }

    handleEvent({detail}) {
        this.data.points.shift();
        this.data.points.push(detail);
        this.render();
    }
}


/***/ }),

/***/ "./components/value-item.js":
/*!**********************************!*\
  !*** ./components/value-item.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ValueItem": () => /* binding */ ValueItem
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./components/component.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app */ "./app.js");



class ValueItem extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor({value, ...params}) {
        super(params);
        this.name = 'ValueItem';
        this.value = this.tooltipContent = value;
        this.active = false;
        this.trend = 0;
        this.ctxMenuConfig = [
            {
                title: 'Move',
                children: [
                    {
                        title: 'Horizontally',
                        children: [
                            {
                                title: 'Left',
                                type: this.translate.bind(this, {x: -20})
                            },
                            {
                                title: 'Right',
                                type: this.translate.bind(this, {x: 20})
                            }
                        ]
                    },
                    {
                        title: 'Vertically',
                        children: [
                            {
                                title: 'Up',
                                type: this.translate.bind(this, {y: -20})
                            },
                            {
                                title: 'Down',
                                type: this.translate.bind(this, {y: 20})
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Resize',
                children: [
                    {
                        title: 'X',
                        children: [
                            {
                                title: 'Grow',
                                type: this.resize.bind(this, {x: 20})
                            },
                            {
                                title: 'Shrink',
                                type: this.resize.bind(this, {x: -20})
                            }
                        ]
                    },
                    {
                        title: 'Y',
                        children: [
                            {
                                title: 'Grow',
                                type: this.resize.bind(this, {y: 20})
                            },
                            {
                                title: 'Shrink',
                                type: this.resize.bind(this, {x: -20})
                            }
                        ]
                    }
                ],
                disabled: true
            },
            {
                title: 'Hide',
                type: this.hide.bind(this)
            }
        ];
        Object.assign(this, ValueItem.geometric);
    }

    static get geometric() {
        return {
            width: 30,
            height: 20
        }
    }

    static get randomValue() {
        return (Math.random() * 100).toFixed(2);
    }

    /**
     * @param {Object} config
     * @param {CanvasRenderingContext2D} ctx
     */
    static render({x, y, width, height, visible, value, trend, active}, ctx) {
        let stack = 0;
        ctx.fillRect(x, y, width, height);
        if (!visible) return;
        ctx.save();
			ctx.fillStyle = '#161616';
			ctx.font = 'bold 12px serif';
			const fontHeight = ctx.measureText(value).actualBoundingBoxAscent;
			if (active) {
				ctx.save();
				stack++;
				if (trend > 0) {
					ctx.fillStyle = '#00FF00';
					ctx.fillRect(x, y, width, height);
					ctx.fillStyle = "black";
				} else if (trend < 0) {
					ctx.fillStyle = '#e50000';
					ctx.fillRect(x, y, width, height);
					ctx.fillStyle = "white";
				}
			}
			ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.clip();
			ctx.fillText(value, x + 1, y + fontHeight + 5);
			stack && ctx.restore();
        ctx.restore();
    }

    initRandomChange() {
        setInterval(this.onValueChange.bind(this), 10000 + Math.random() * 60000);
    }

    onMouseDown() {
        super.onMouseDown();
        this.active = true;
        this.render();
    }

    setText(value) {
        this.active = true;
        this.trend = value > this.value ? 1 : (value < this.value ? -1 : 0);
        this.value = this.tooltipContent = value;
        this.render();
        setTimeout(this.blink.bind(this), 200);
    }

    blink() {
        this.active = false;
        this.render();
    }

    onValueChange() {
        this.setText(ValueItem.randomValue);
    }

    render() {
        ValueItem.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }
}


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/component */ "./components/component.js");
/* harmony import */ var _components_collection_item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/collection-item */ "./components/collection-item.js");
/* harmony import */ var _components_tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/tooltip */ "./components/tooltip.js");
/* harmony import */ var _components_value_item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/value-item */ "./components/value-item.js");
/* harmony import */ var _components_chart_item__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/chart-item */ "./components/chart-item.js");
/* harmony import */ var _components_edit_box__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/edit-box */ "./components/edit-box.js");
/* harmony import */ var _components_context_menu__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/context-menu */ "./components/context-menu.js");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app */ "./app.js");
/* harmony import */ var _components_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/button */ "./components/button.js");
/* harmony import */ var _components_combo_box__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/combo-box */ "./components/combo-box.js");
/* harmony import */ var _components_trender__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/trender */ "./components/trender.js");
/* harmony import */ var _components_hover__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/hover */ "./components/hover.js");
/* harmony import */ var _components_clock__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/clock */ "./components/clock.js");
/* harmony import */ var _components_date_picker__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/date-picker */ "./components/date-picker.js");















const chartConfig = {
    type: 'column',
    padding: [20, 20, 70, 70],
    ticks: 5,
    data: {
        points: _components_chart_item__WEBPACK_IMPORTED_MODULE_4__.ChartItem.mockData(),
        margin: 0.1
    }
};

const trenderConfig = {
    padding: [20, 20, 70, 70],
    ticks: 20,
    majorTicksInterval: 4,
    data: {
        name: 'sin(x)',
        points: _components_trender__WEBPACK_IMPORTED_MODULE_10__.Trender.mockData()
    }
};

const menuItems = [
    {
        title: 'One',
        value: 1,
    },
    {
        title: 'Two',
        value: 2,
    },
    {
        title: 'Three',
        value: 3,
    }
];

const buttonCallback = () => (
    _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.dispatch(new CustomEvent('randomizeChartData'))
);

setInterval(_components_trender__WEBPACK_IMPORTED_MODULE_10__.Trender.mockNextData, 1000);

_app__WEBPACK_IMPORTED_MODULE_7__.App.instance.components = [
    ...[
        new _components_clock__WEBPACK_IMPORTED_MODULE_12__.Clock({y: 0, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId})
    ],
    ..._components_collection_item__WEBPACK_IMPORTED_MODULE_1__.CollectionItem.compose({x: 0, y: 30, cols: 25, rows: 12, gap: 20, ctor: _components_value_item__WEBPACK_IMPORTED_MODULE_3__.ValueItem}),
    ...[
        new _components_edit_box__WEBPACK_IMPORTED_MODULE_5__.EditBox({x: 0, y: 600, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_edit_box__WEBPACK_IMPORTED_MODULE_5__.EditBox({x: 100, y: 600, width: 100, zIndex: 1, isCalendar: true, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_combo_box__WEBPACK_IMPORTED_MODULE_9__.ComboBox({x: 250, y: 600, zIndex: 1, variableName: 'Combobox1', menuItems, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_chart_item__WEBPACK_IMPORTED_MODULE_4__.ChartItem({...{x: _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.canvas.width - 600, y: 30, width: 600, height: 400, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}, ...chartConfig}),
        new _components_button__WEBPACK_IMPORTED_MODULE_8__.Button({x: _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.canvas.width - _components_button__WEBPACK_IMPORTED_MODULE_8__.Button.geometric.width, y: 450, zIndex: 1, value: 'Randomize', callback: buttonCallback, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}),
        new _components_trender__WEBPACK_IMPORTED_MODULE_10__.Trender({...{x: _app__WEBPACK_IMPORTED_MODULE_7__.App.instance.canvas.width - 600, y: 490, width: 600, height: 400, zIndex: 1, id: _components_component__WEBPACK_IMPORTED_MODULE_0__.Component.nextId}, ...trenderConfig}),
        _components_tooltip__WEBPACK_IMPORTED_MODULE_2__.Tooltip.instance,
        _components_hover__WEBPACK_IMPORTED_MODULE_11__.Hover.instance,
        _components_context_menu__WEBPACK_IMPORTED_MODULE_6__.ContextMenu.instance,
        _components_date_picker__WEBPACK_IMPORTED_MODULE_13__.DatePicker.instance
    ]
];

_app__WEBPACK_IMPORTED_MODULE_7__.App.instance.render();


/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": () => /* binding */ debounce,
/* harmony export */   "throttle": () => /* binding */ throttle,
/* harmony export */   "sinusoidGen": () => /* binding */ sinusoidGen,
/* harmony export */   "timeFormat": () => /* binding */ timeFormat,
/* harmony export */   "dateFormat": () => /* binding */ dateFormat
/* harmony export */ });
function debounce(threshold = 100) {
    let timeout = 0;
    return (fn, arg) => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, threshold, arg);
    }
}

function throttle(threshold = 100) {
    let timeout = true;
    setInterval(() => timeout = true, threshold);
    return (fn, arg) => {
        timeout && fn(arg);
        timeout = false;
    };
}

const sinusoidGen = (function* () {
    const period = Math.PI * 2;
    const q = 0.5;
    let _i = 0;
    while (true) yield Math.round(Math.sin(_i++ * q % period) * 10000) / 100;
})();

const timeFormat = (timeFormatter => {
    return time => timeFormatter.format(time);
})(new Intl.DateTimeFormat('ru', {hour: '2-digit', minute: '2-digit', second: '2-digit'}));

const dateFormat = (dateFormatter => {
    return date => dateFormatter.format(date);
})(new Intl.DateTimeFormat('en', {day: '2-digit', month: '2-digit', year: 'numeric'}));




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMvLi9hcHAuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jaGFydC1pdGVtLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvY2xvY2suanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21iby1ib3guanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL2VkaXQtYm94LmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvaG92ZXIuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy90b29sdGlwLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvdHJlbmRlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBv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akY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanM/Y2MyYjU4NGYwZDUxNGQ1N2Y2ZWIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIHtDb21wb25lbnRbXX0gKi9cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjMjIyMjIyJztcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnIzdhZmZkMSc7XHJcbiAgICAgICAgdGhpcy5jdHguZm9udCA9ICcxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgIHRoaXMubGFzdEhvdmVyZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgQXBwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvbkNvbnRleHRNZW51KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0NvbXBvbmVudFtdfSBjb21wb25lbnRzICovXHJcbiAgICBzZXQgY29tcG9uZW50cyhjb21wb25lbnRzKSB7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIGdldCBjb21wb25lbnRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRocm90dGxlKCkuYmluZCh1bmRlZmluZWQsIHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSkpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgQXBwLm9uQ29udGV4dE1lbnUpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaChlKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuZGlzcGF0Y2hFdmVudChlKTtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0ZW4oZXZlbnRUeXBlLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubGlzdGVuKGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIHRoaXMubGFzdEFjdGl2YXRlZC5vbk1vdXNlVXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5LCBidXR0b259ID0gZTtcclxuICAgICAgICBsZXQgdG9wTW9zdDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgekluZGV4ID0gLTEsIGl0ZW1zID0gdGhpcy5fY29tcG9uZW50cywge2xlbmd0aH0gPSBpdGVtczsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnpJbmRleCA+IHpJbmRleCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS55ICsgaXRlbXNbaV0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0ID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICB6SW5kZXggPSB0b3BNb3N0LnpJbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAhT2JqZWN0LmlzKHRvcE1vc3QsIHRoaXMubGFzdEFjdGl2YXRlZCkgJiZcclxuICAgICAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIChcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKSB8fCB0aGlzLmxhc3RBY3RpdmF0ZWQub25Nb3VzZU91dCgpXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSB0b3BNb3N0O1xyXG4gICAgICAgIHRvcE1vc3QgJiYgKFxyXG4gICAgICAgICAgICBidXR0b24gPT09IDIgP1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdC5vbkNvbnRleHRNZW51KHt4LCB5fSkgOiB0b3BNb3N0Lm9uTW91c2VEb3duKHt4LCB5fSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlKHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIGxldCB0b3BNb3N0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCB6SW5kZXggPSAtMSwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCB7bGVuZ3RofSA9IGl0ZW1zOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS54IDwgeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnggKyBpdGVtc1tpXS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID4geVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRvcE1vc3QgPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIHpJbmRleCA9IHRvcE1vc3QuekluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICFPYmplY3QuaXModG9wTW9zdCwgdGhpcy5sYXN0SG92ZXJlZCkgJiZcclxuICAgICAgICAgICAgdGhpcy5sYXN0SG92ZXJlZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SG92ZXJlZC5vbk1vdXNlT3V0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0SG92ZXJlZCA9IHRvcE1vc3Q7XHJcbiAgICAgICAgdG9wTW9zdCAmJiB0b3BNb3N0Lm9uTW91c2VPdmVyKHt4LCB5fSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Ub3VjaFN0YXJ0KGUpIHtcclxuICAgICAgICB0aGlzLnBvaW50ZXJDb250ZXh0TWVudURlbGF5ID0gc2V0VGltZW91dCh0aGlzLm9uVG91Y2hDb250ZXh0TWVudS5iaW5kKHRoaXMpLCA1MDAsIGUpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Ub3VjaENvbnRleHRNZW51KHt0b3VjaGVzOiBbe3BhZ2VYLCBwYWdlWX1dfSkge1xyXG4gICAgICAgIGNvbnN0IHtvZmZzZXRUb3AsIG9mZnNldExlZnR9ID0gdGhpcy5jYW52YXM7XHJcbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bih7XHJcbiAgICAgICAgICAgIG9mZnNldFg6IE1hdGgucm91bmQocGFnZVggLSBvZmZzZXRMZWZ0KSxcclxuICAgICAgICAgICAgb2Zmc2V0WTogTWF0aC5yb3VuZChwYWdlWSAtIG9mZnNldFRvcCksXHJcbiAgICAgICAgICAgIGJ1dHRvbjogMixcclxuICAgICAgICAgICAgcHJldmVudERlZmF1bHQoKSB7fVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25MYXN0QWN0aXZhdGVkKGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJiB0aGlzLmxhc3RBY3RpdmF0ZWQub25CbHVyKCk7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkID0gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGFpbnRBZmZlY3RlZCh7aWQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHpJbmRleH0pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCB7bGVuZ3RofSA9IGl0ZW1zOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uaWQgIT09IGlkICYmXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS56SW5kZXggPiB6SW5kZXggJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA+PSB5ICYmIGl0ZW1zW2ldLnkgPD0gKHkgKyBoZWlnaHQpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPD0geSAmJiAoaXRlbXNbaV0ueSArIGl0ZW1zW2ldLmhlaWdodCkgPj0geVxyXG4gICAgICAgICAgICAgICAgICAgICkgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS54ID49IHggJiYgaXRlbXNbaV0ueCA8PSAoeCArIHdpZHRoKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS54IDw9IHggJiYgKGl0ZW1zW2ldLnggKyBpdGVtc1tpXS53aWR0aCkgPj0geFxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGl0ZW1zID0gdGhpcy5fY29tcG9uZW50cywge2xlbmd0aH0gPSBpdGVtczsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5wb2ludGVyQ29udGV4dE1lbnVEZWxheSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt2YWx1ZT0gJ0FwcGx5JywgY2FsbGJhY2sgPSAoKSA9PiB7fSwgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0J1dHRvbic7XHJcbiAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSAxMjtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBCdXR0b24uZ2VvbWV0cmljLCB7d2lkdGg6IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggKyAyMH0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgdGhpcy54ICs9IEJ1dHRvbi5nZW9tZXRyaWMud2lkdGggLSB0aGlzLndpZHRoIC0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgZm9udFNpemUsIHByZXNzZWQsIHJhZGl1cyA9IDN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDMsIHkgLSAzLCB3aWR0aCArIDksIGhlaWdodCArIDkpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2EyYTJhMic7XHJcbiAgICAgICAgICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjYjFiMWIxJztcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDEyNywxMjcsMTI3LDAuNyknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0LCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cywgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHgsIHksIHggKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgMiwgeSArIDIgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMiwgeSArIDIgKyByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyY1RvKHggKyAyLCB5ICsgMiwgeCArIDIgKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyAyICsgd2lkdGggLSByYWRpdXMsIHkgKyAyKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzUzNTM1JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAxMCwgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bigpO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEJ1dHRvbi5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDaGFydEl0ZW0nO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuZGF0YURyYXdBcmVhTWFwID0gW107XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zZXRTY2FsZS5iaW5kKHRoaXMsIDEuMSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIE91dCcsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnNldFNjYWxlLmJpbmQodGhpcywgMC45KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNldFNjYWxlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKGNvbmZpZywgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgY2hhcnRNYXJnaW4gPSAyMDtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgZGF0YToge3BvaW50c319ID0gY29uZmlnO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0QXJlYSA9IHtcclxuICAgICAgICAgICAgeDogeCArIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIHk6IHkgKyBwYWRkaW5nWzBdLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggLSBwYWRkaW5nWzFdIC0gcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSBwYWRkaW5nWzBdIC0gcGFkZGluZ1syXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qge21pbiwgbWF4fSA9IENoYXJ0SXRlbS5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhjaGFydEFyZWEpKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIENoYXJ0SXRlbS5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBDaGFydEl0ZW0uZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIHJldHVybiBDaGFydEl0ZW0uZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3RGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgc2NhbGUsIGRhdGE6IHtwb2ludHMgPSBbXSwgbWFyZ2luID0gMC4yfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgZGF0YURyYXdBcmVhTWFwID0gWy4uLnBvaW50c107XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAge2xlbmd0aH0gPSBwb2ludHMsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAvIGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgYmFyV2lkdGggPSBzdGVwICogKDEgLSBtYXJnaW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICBiYXJIZWlnaHQgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0gc3RlcCAvIDIgLSBiYXJXaWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gcG9pbnRzW2ldLnZhbHVlID4gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyMwMDZiMDAnIDogJyMwMGZmMDAnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzgxMDAwMCcgOiAnI2ZmMDAwMCcpO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLCB4UG9zICs9IHN0ZXApIHtcclxuICAgICAgICAgICAgICAgIGZpbGxTdHlsZSA9IHBvaW50c1tpXS52YWx1ZSA+IDAgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyMwMDZiMDAnIDogJyMwMGZmMDAnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgKHBvaW50c1tpXS5oaWdobGlnaHRlZCA/ICcjODEwMDAwJyA6ICcjZmYwMDAwJyk7XHJcbiAgICAgICAgICAgICAgICBiYXJIZWlnaHQgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4UG9zLCAwLCBiYXJXaWR0aCwgLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBkYXRhRHJhd0FyZWFNYXBbaV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uZGF0YURyYXdBcmVhTWFwW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogeFBvcyArIHgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGgubWluKHplcm9MZXZlbCwgemVyb0xldmVsICsgYmFySGVpZ2h0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGJhckhlaWdodClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZGF0YURyYXdBcmVhTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd1hBeGlzKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHgsIHkgKyBoZWlnaHQgKyA1KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAgLyBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0geCArIHN0ZXAgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLCB4UG9zICs9IHN0ZXAsIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhyb3VuZGVkWFBvcywgeSArIGhlaWdodCArIDUpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhyb3VuZGVkWFBvcywgeSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCByb3VuZGVkWFBvcyArIDUsIHkgKyBoZWlnaHQgKyBjdHgubWVhc3VyZVRleHQocG9pbnRzW2ldLmNhdGVnb3J5KS53aWR0aCArIDUpXHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChwb2ludHNbaV0uY2F0ZWdvcnksIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WUF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRpY2tzID0gNSwgemVyb0xldmVsLCBzY2FsZSwgcmFuZ2VTY2FsZSwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMWExYTFhJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gdGlja3MpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgeVBvcyA9IHkgKyBoZWlnaHQgLSBNYXRoLmFicyh6ZXJvTGV2ZWwgLSB5IC0gaGVpZ2h0KSAlIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcykgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHRpY2tzO1xyXG4gICAgICAgICAgICAgICAgIHlQb3MgLT0gaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgaSsrLCBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcyApIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHggLSA1LCB5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChsYWJlbCwgeCAtIGN0eC5tZWFzdXJlVGV4dChsYWJlbCkud2lkdGggLSAxMCwgeVBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVSYW5nZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKCh7bWluLCBtYXgsIG1heE5lZ2F0aXZlLCBtaW5Qb3NpdGl2ZX0sIHt2YWx1ZX0pID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWluOiBNYXRoLm1pbih2YWx1ZSwgbWluKSxcclxuICAgICAgICAgICAgICAgIG1heDogTWF0aC5tYXgodmFsdWUsIG1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICksIHtcclxuICAgICAgICAgICAgbWluOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgbWF4OiAtSW5maW5pdHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja0RhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheSgzMCkuZmlsbChbMSwgLTFdKS5tYXAoKGJpLCBpZHgpID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGBDYXRlZ29yeSR7aWR4ICsgMX1gLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKiBiaVtNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpXSkgLyAxMDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApKVxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ3JhbmRvbWl6ZUNoYXJ0RGF0YScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cyA9IENoYXJ0SXRlbS5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRTY2FsZSgpIHtcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZShzY2FsZSA9IDEpIHtcclxuICAgICAgICB0aGlzLnNjYWxlICo9IHNjYWxlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0SXRlbXMoe3gsIHl9KSB7XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodGVkID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZU91dCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge3g6IGl0ZW1YLCB5OiBpdGVtWSwgd2lkdGgsIGhlaWdodH0gPSBpO1xyXG4gICAgICAgICAgICBpLmhpZ2hsaWdodGVkID0gaXRlbVggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtWCArIHdpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtWSArIGhlaWdodCkgPiB5O1xyXG4gICAgICAgICAgICBpZiAoaS5oaWdobGlnaHRlZCkgaGlnaGxpZ2h0ZWQgPSBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSBoaWdobGlnaHRlZC52YWx1ZTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnt4LCB5fX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7dHlwZSwgb2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JhbmRvbWl6ZUNoYXJ0RGF0YSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucG9pbnRzID0gQ2hhcnRJdGVtLm1vY2tEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHt0aW1lRm9ybWF0fSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi90b29sdGlwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2xvY2sgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnQ2xvY2snO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IDIwO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgQ2xvY2suZ2VvbWV0cmljKTtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgZm9udFNpemV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTYxNjE2JztcclxuXHRcdFx0Y3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xyXG5cdFx0XHRjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KHZhbHVlKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudDtcclxuXHRcdFx0Y3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMSwgeSArIGZvbnRIZWlnaHQgKyA1KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IEFwcC5pbnN0YW5jZS5jdHg7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwodGhpcy5vblZhbHVlQ2hhbmdlLmJpbmQodGhpcyksIDEwMDApO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGltZUZvcm1hdChEYXRlLm5vdygpKSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3RoaXMuZm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBNYXRoLmNlaWwoY3R4Lm1lYXN1cmVUZXh0KHRoaXMudmFsdWUpLndpZHRoKSArIDE7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB0aGlzLnggPSBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gdGhpcy53aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3Zlcihwb3MpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgdGhpcy50b29sdGlwVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5pbml0VG9vbHRpcC5iaW5kKHRoaXMpLCA1MDAsIHsuLi50aGlzLCAuLi5wb3N9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICBUb29sdGlwLmluc3RhbmNlLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblZhbHVlQ2hhbmdlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGltZUZvcm1hdChEYXRlLm5vdygpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIENsb2NrLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7VmFsdWVJdGVtfSBmcm9tIFwiLi92YWx1ZS1pdGVtXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sbGVjdGlvbkl0ZW0ge1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29tcG9uZW50W119ICovXHJcbiAgICBzdGF0aWMgY29tcG9zZSh7eCwgeSwgY29scywgcm93cywgZ2FwID0gMjAsIGN0b3J9KSB7XHJcbiAgICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gY3Rvci5nZW9tZXRyaWM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheShyb3dzKS5maWxsKEFwcC5pbnN0YW5jZS5jdHgpLnJlZHVjZSgocmVzdWx0LCBjdHgsIHJvdykgPT4gKFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAuLi5yZXN1bHQsXHJcbiAgICAgICAgICAgICAgICAuLi5uZXcgQXJyYXkoY29scykuZmlsbChjdG9yKS5tYXAoKGN0b3IsIGNvbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtpZCwgeFBvcywgeVBvcywgekluZGV4XSA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcG9uZW50Lm5leHRJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeCArIGNvbCAqICh3aWR0aCArIGdhcCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgKyByb3cgKiAoaGVpZ2h0ICsgZ2FwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJvdyArIDEpICogKGNvbCArIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBjdG9yKHtpZCwgeDogeFBvcywgeTogeVBvcywgdmFsdWU6IFZhbHVlSXRlbS5yYW5kb21WYWx1ZSwgekluZGV4LCBjdHh9KTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5pbml0UmFuZG9tQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICksIFtdKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7IHRocm90dGxlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tYm9Cb3ggZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3Ioe3dpZHRoID0gQ29tYm9Cb3guZ2VvbWV0cmljLndpZHRoLCBtZW51SXRlbXMgPSBbXSwgdmFyaWFibGVOYW1lLCAuLi5wYXJhbXN9KSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnQ29tYm9Cb3gnO1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBDb21ib0JveC5nZW9tZXRyaWMsIHt3aWR0aH0pO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IHZhcmlhYmxlTmFtZSxcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnU2VsZWN0Li4uJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5tZW51SXRlbXMgPSBtZW51SXRlbXMubWFwKChpLCBpZHgpID0+ICh7XHJcbiAgICAgICAgICAgIC4uLmksXHJcbiAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgIHk6IHRoaXMueSArIHRoaXMuaGVpZ2h0ICsgaWR4ICogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyQXJlYSA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy54ICsgd2lkdGggLSAyMCxcclxuICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICB3aWR0aDogMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5mdWxsSGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBtZW51SXRlbXMubGVuZ3RoICogMjA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDcwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBmdWxsSGVpZ2h0LCBvcGVuZWQsIHZhcmlhYmxlOiB7dGl0bGV9LCBtZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjb25zdCBib3JkZXJDb2xvciA9ICcjODA4MDgwJztcclxuICAgICAgICBjb25zdCBmb250Q29sb3IgPSAnIzI0MjQyNCc7XHJcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZENvbG9yID0gJyNjOGM4YzgnO1xyXG4gICAgICAgIGNvbnN0IGhpZ2hsaWdodENvbG9yID0gJyM4ZDhkOGQnO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4IC0gMiwgeSAtIDIsIHdpZHRoICsgMywgZnVsbEhlaWdodCArIDMpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmb250Q29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGJvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgeCArIHdpZHRoIC0gaGVpZ2h0LCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgeCArIDMsIHkgKyBoZWlnaHQgLSA1KTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCArIHdpZHRoIC0gaGVpZ2h0LCB5LCBoZWlnaHQsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChvcGVuZWQgPyAnXFx1MjVCMicgOiAnXFx1MjVCQycsIHggKyB3aWR0aCAtIGhlaWdodCAvIDIgLSA1LCB5ICsgaGVpZ2h0IC0gNik7XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGlmICghb3BlbmVkKSByZXR1cm4gY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIHtsZW5ndGh9ID0gbWVudUl0ZW1zLFxyXG4gICAgICAgICAgICAgICAgICAgICB5UG9zID0geSArIGhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgIGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQobWVudUl0ZW1zW2ldLnRpdGxlKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudCxcclxuICAgICAgICAgICAgICAgICAgICAgdGV4dFlQb3MgPSAoaGVpZ2h0IC0gZm9udEhlaWdodCkgLyAyICsgZm9udEhlaWdodDtcclxuICAgICAgICAgICAgICAgICBpIDwgbGVuZ3RoOyBpKyssIHlQb3MgPSB5ICsgaGVpZ2h0ICsgMSArIGhlaWdodCAqIGkpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBtZW51SXRlbXNbaV0uaGlnaGxpZ2h0ZWQgPyBoaWdobGlnaHRDb2xvciA6IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5UG9zLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmb250Q29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQobWVudUl0ZW1zW2ldLnRpdGxlLCB4ICsgMywgeVBvcyArIHRleHRZUG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoe3gsIHl9KSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA+IHggfHxcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55ID4geSB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPCB4IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPCB5XHJcbiAgICAgICAgKSA/ICdpbml0aWFsJyA6ICdwb2ludGVyJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eCwgeX0pIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bih7eCwgeX0pO1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS54ID4geCB8fFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnkgPiB5IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnggKyB0aGlzLnRyaWdnZXJBcmVhLndpZHRoKSA8IHggfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueSArIHRoaXMudHJpZ2dlckFyZWEuaGVpZ2h0KSA8IHlcclxuICAgICAgICApIHJldHVybjtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9ICF0aGlzLm9wZW5lZDtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMub3BlbmVkID8gKFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKSB8fFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZWRvd24nLCB0aGlzKVxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcykgfHxcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZWRvd24nLCB0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgb25NZW51U2VsZWN0KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS54IDwgeCAmJlxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnkgPCB5ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnggKyB0aGlzLnRyaWdnZXJBcmVhLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueSArIHRoaXMudHJpZ2dlckFyZWEuaGVpZ2h0KSA+IHlcclxuICAgICAgICApIHJldHVybjtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLm1lbnVJdGVtcy5maW5kKCh7eTogbWVudVksIGhlaWdodH0pID0+IChcclxuICAgICAgICAgICAgdGhpcy54IDwgeCAmJlxyXG4gICAgICAgICAgICBtZW51WSA8IHkgJiZcclxuICAgICAgICAgICAgKHRoaXMueCArIHRoaXMud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAobWVudVkgKyBoZWlnaHQpID4geVxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIHRoaXMuaGlkZU1lbnUoKTtcclxuICAgICAgICBzZWxlY3RlZEl0ZW0gJiYgKHRoaXMuc2V0VmFsdWUoc2VsZWN0ZWRJdGVtKSB8fCB0aGlzLnJlbmRlcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlTWVudSgpIHtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIENvbWJvQm94LnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoey4uLnRoaXMsIC4uLntoZWlnaHQ6IHRoaXMuZnVsbEhlaWdodH19KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLm1lbnVJdGVtcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7eTogaXRlbVksIGhlaWdodH0gPSBpO1xyXG4gICAgICAgICAgICBpLmhpZ2hsaWdodGVkID0gdGhpcy54IDwgeCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbVkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAodGhpcy54ICsgdGhpcy53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICAgICAoaXRlbVkgKyBoZWlnaHQpID4geTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHt0aXRsZSwgdmFsdWV9KSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnZhcmlhYmxlLCB7dGl0bGUsIHZhbHVlfSk7XHJcbiAgICAgICAgLy8gQXBwLmluc3RhbmNlLmRpc3BhdGNoKG5ldyBDdXN0b21FdmVudCgndXBkYXRlTG9jYWxWYXJpYWJsZScsIHtkZXRhaWw6IHRoaXMudmFyaWFibGV9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoZSkge1xyXG4gICAgICAgIHN3aXRjaCAoZS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uTWVudVNlbGVjdChlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEl0ZW1zLmJpbmQodGhpcyksIGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7Q29udGV4dE1lbnV9IGZyb20gXCIuL2NvbnRleHQtbWVudVwiO1xyXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcclxuaW1wb3J0IHtIb3Zlcn0gZnJvbSBcIi4vaG92ZXJcIjtcclxuXHJcbmxldCBfaWQgPSAwO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy54ID0gMDtcclxuICAgICAgICB0aGlzLnkgPSAwO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSAwO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVDb25maWcgPSBbXTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJyc7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSAwO1xyXG4gICAgICAgIHRoaXMuZmlyc3RSZW5kZXIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgbmV4dElkKCkge1xyXG4gICAgICAgIHJldHVybiAoX2lkKyspLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db250ZXh0TWVudShwb3MpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2Uuc2hvdyh7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIEhvdmVyLmluc3RhbmNlLnNob3codGhpcyk7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb25maWcgPSB0aGlzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHJldHVybiB0aGlzLmZpcnN0UmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCA9IDAsIHkgPSAwfSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB4LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKHt3aWR0aCA9IDAsIGhlaWdodCA9IDB9KSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoey4uLnRoaXMsIC4uLnt2aXNpYmxlOiBmYWxzZX19KTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArIGhlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKGNvbmZpZykge1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2Uuc2hvdyhjb25maWcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoID0gdGhpcy5pbml0aWFsSGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoNTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29udGV4dE1lbnV9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IENvbnRleHRNZW51KHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoOiBmdWxsV2lkdGgsIGhlaWdodDogZnVsbEhlaWdodCwgaW5pdGlhbFdpZHRoOiB3aWR0aCwgaW5pdGlhbEhlaWdodDogaGVpZ2h0LCBjdHhNZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgZnVsbFdpZHRoLCBmdWxsSGVpZ2h0KTtcclxuICAgICAgICBpZiAoIWN0eE1lbnVJdGVtcy5sZW5ndGgpIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweC8xIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBhcnJvd0hlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoJ1xcdTI1YjYnKTtcclxuICAgICAgICAgICAgY29uc3Qge2NvbGxlY3Rpb259ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt4LCB5LCB3aWR0aCwgdmlzaWJsZSwgY29sbGVjdGlvbn0sIHt0eXBlLCB0aXRsZSwgaGlnaGxpZ2h0ZWQsIGRpc2FibGVkID0gZmFsc2UsIGNoaWxkcmVuID0gW119LCBpZHgpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHgvbm9ybWFsIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0ge3gsIHk6IHkgKyAoZm9udEhlaWdodCArIDEwKSAqIGlkeCwgd2lkdGgsIGhlaWdodDogZm9udEhlaWdodCArIDEwfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge3gsIHksIHdpZHRoLCB2aXNpYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFyZWEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSwgdGl0bGUsIGhpZ2hsaWdodGVkLCBkaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJlYS54ICsgYXJlYS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJlYS55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2hpbGRyZW4ucmVkdWNlKENvbnRleHRNZW51LmNhbGN1bGF0ZU1heFdpZHRoLCB7Y3R4LCBtYXhXaWR0aDogMH0pLm1heFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGhpZ2hsaWdodGVkID8gJyM5MWI1YzgnIDogJyNkMGQwZDAnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhhcmVhKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZGlzYWJsZWQgPyAnIzlkOWQ5ZCcgOiAnIzE4MTgxOCc7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4L25vcm1hbCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgYXJlYS54ICsgMTAsIGFyZWEueSArIGFyZWEuaGVpZ2h0IC0gNSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHgvMSBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjViNicsIGFyZWEueCArIGFyZWEud2lkdGggLSBhcnJvd1dpZHRoIC0gMiwgYXJlYS55ICsgYXJlYS5oZWlnaHQgLyAyICsgYXJyb3dIZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICAgICAgfSwge3gsIHksIHdpZHRoLCB2aXNpYmxlOiB0cnVlLCBjb2xsZWN0aW9uOiBbXX0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4LCB5LCByaWdodCA9IDAsIGJvdHRvbSA9IDAsIGhpZ2hsaWdodGVkfSwgaXRlbSkge1xyXG4gICAgICAgIGxldCB3YXNIaWdobGlnaHRlZCA9IGl0ZW0uaGlnaGxpZ2h0ZWQsIGhhc0hpZ2hsaWdodGVkQ2hpbGQ7XHJcbiAgICAgICAgaXRlbS5oaWdobGlnaHRlZCA9ICFpdGVtLmRpc2FibGVkICYmIChcclxuICAgICAgICAgICAgaXRlbS54IDw9IHggJiZcclxuICAgICAgICAgICAgaXRlbS55IDw9IHkgJiZcclxuICAgICAgICAgICAgKGl0ZW0ueCArIGl0ZW0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAoaXRlbS55ICsgaXRlbS5oZWlnaHQpID4geVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKGl0ZW0uaGlnaGxpZ2h0ZWQgfHwgd2FzSGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgKHtoaWdobGlnaHRlZDogaGFzSGlnaGxpZ2h0ZWRDaGlsZCwgcmlnaHQsIGJvdHRvbX0gPSBpdGVtLmNoaWxkcmVuLnJlZHVjZShDb250ZXh0TWVudS5maW5kSXRlbVVuZGVyUG9pbnRlciwge3gsIHksIHJpZ2h0LCBib3R0b219KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW0uaGlnaGxpZ2h0ZWQgPSBpdGVtLmhpZ2hsaWdodGVkIHx8IGhhc0hpZ2hsaWdodGVkQ2hpbGQ7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgcmlnaHQ6IE1hdGgubWF4KHJpZ2h0LCBpdGVtLnggKyBpdGVtLndpZHRoKSxcclxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLm1heChib3R0b20sIGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGl0ZW0uaGlnaGxpZ2h0ZWQgfHwgaGlnaGxpZ2h0ZWRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjYWxjdWxhdGVNYXhXaWR0aCh7Y3R4LCBtYXhXaWR0aH0sIHt0aXRsZX0pIHtcclxuICAgICAgICByZXR1cm4ge2N0eCwgbWF4V2lkdGg6IE1hdGguZmxvb3IoTWF0aC5tYXgobWF4V2lkdGgsIGN0eC5tZWFzdXJlVGV4dCh0aXRsZSkud2lkdGggKyAzMCkpfTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eDogY2xpY2tYLCB5OiBjbGlja1l9KSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudCh7b2Zmc2V0WDogY2xpY2tYLCBvZmZzZXRZOiBjbGlja1l9KTtcclxuICAgICAgICBjb25zdCB7Zm91bmR9ID0gdGhpcy5jdHhNZW51SXRlbXMucmVkdWNlKGZ1bmN0aW9uIHJlY3Vyc2Uoe3pJbmRleDogaGlnaGVzdFpJbmRleCwgZm91bmR9LCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXggPSAxLCBoaWdobGlnaHRlZCwgY2hpbGRyZW4gPSBbXX0gPSBpdGVtO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgekluZGV4ID4gaGlnaGVzdFpJbmRleCAmJlxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHggPCBjbGlja1ggJiZcclxuICAgICAgICAgICAgICAgIHkgPCBjbGlja1kgJiZcclxuICAgICAgICAgICAgICAgICh4ICsgd2lkdGgpID4gY2xpY2tYICYmXHJcbiAgICAgICAgICAgICAgICAoeSArIGhlaWdodCkgPiBjbGlja1kgJiYge3pJbmRleCwgZm91bmQ6IGl0ZW19XHJcbiAgICAgICAgICAgICkgfHwgY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHt6SW5kZXg6IGhpZ2hlc3RaSW5kZXgsIGZvdW5kfSk7XHJcbiAgICAgICAgfSwge3pJbmRleDogLTEsIGZvdW5kOiBudWxsfSk7XHJcbiAgICAgICAgZm91bmQgJiYgZm91bmQudHlwZSAmJiAoZm91bmQudHlwZSgpIHx8IHRoaXMuaGlkZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyh7eCwgeSwgY3R4TWVudUNvbmZpZzogY3R4TWVudUl0ZW1zfSkge1xyXG4gICAgICAgIGlmICghY3R4TWVudUl0ZW1zKSByZXR1cm47XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eCwgeSwgekluZGV4OiBJbmZpbml0eSwgY3R4TWVudUl0ZW1zfSk7XHJcbiAgICAgICAgKHttYXhXaWR0aDogdGhpcy5pbml0aWFsV2lkdGgsIG1heFdpZHRoOiB0aGlzLndpZHRofSA9IGN0eE1lbnVJdGVtcy5yZWR1Y2UoQ29udGV4dE1lbnUuY2FsY3VsYXRlTWF4V2lkdGgsIHtjdHg6IEFwcC5pbnN0YW5jZS5jdHgsIG1heFdpZHRoOiAwfSkpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmluaXRpYWxIZWlnaHQgPSB0aGlzLmN0eE1lbnVJdGVtcy5yZWR1Y2UoKHRvdGFsSGVpZ2h0LCB7aGVpZ2h0fSkgPT4gdG90YWxIZWlnaHQgKz0gaGVpZ2h0LCAwKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuYXNzaWduTGFzdEFjdGl2YXRlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3pJbmRleDogLTEsIGN0eE1lbnVJdGVtczogW119KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIHdpZHRoOiAwLCBoZWlnaHQ6IDB9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IENvbnRleHRNZW51LnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHtyaWdodCwgYm90dG9tfSA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZShDb250ZXh0TWVudS5maW5kSXRlbVVuZGVyUG9pbnRlciwge3gsIHksIHJpZ2h0OiAwLCBib3R0b206IDB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSByaWdodCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGJvdHRvbSAtIHRoaXMueTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHsuLi50aGlzLCAuLi57d2lkdGgsIGhlaWdodCwgekluZGV4OiAtMX19KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlKHRoaXMuaGlnaGxpZ2h0SXRlbXMuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7dGhyb3R0bGV9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtpZH0pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMgPSB7ZGF0ZXM6IFtdLCByZXN0OiBbXX07XHJcbiAgICAgICAgdGhpcy5pbml0aWF0b3IgPSBudWxsO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgRGF0ZVBpY2tlci5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0RhdGVQaWNrZXJ9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IERhdGVQaWNrZXIoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZ2VvbWV0cmljKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjQwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9cclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogc3RyaW5nLCBtb250aDogc3RyaW5nLCBvYnNlcnZhYmxlQXJlYXM/OiBPYmplY3RbXSwgZGF0ZXM6IE9iamVjdFtdfX1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgb3BlbmVkLCBjYWxlbmRhckRhdGE6IHt5ZWFyLCBtb250aCwgZGF0ZXMgPSBbXX0sIGN1cnJlbnREYXRlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGlmICghb3BlbmVkKSByZXR1cm4ge3llYXIsIG1vbnRoLCBkYXRlc307XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB5KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDA2ZDk5JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNnB4LzEgc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGxldCB7d2lkdGg6IGZvbnRXaWR0aCwgYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGZvbnRIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KG1vbnRoKTtcclxuICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBhcnJvd1dpZHRofSA9IGN0eC5tZWFzdXJlVGV4dCgnXFx1MjVCMicpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKDEwLCA4KTtcclxuICAgICAgICAgICAgbGV0IHtlOiBsZWZ0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCdcXHUyNUMwJywgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGFycm93V2lkdGggKyAxMCwgMCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChtb250aCwgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGZvbnRXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgbGV0IHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjVCNicsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgbGV0IG9ic2VydmFibGVBcmVhcyA9IFt7XHJcbiAgICAgICAgICAgICAgICB4OiBsZWZ0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBhcnJvd1dpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdkZWNyZWFzZUN1cnJlbnRNb250aCcsXHJcbiAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgeDogcmlnaHRBcnJvd1hQb3MsXHJcbiAgICAgICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGFycm93V2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2luY3JlYXNlQ3VycmVudE1vbnRoJyxcclxuICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgKHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoeWVhcikpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHggKyB3aWR0aCAtIGZvbnRXaWR0aCAtIGFycm93V2lkdGggKiAyIC0gMzAsIHkgKyA4KTtcclxuICAgICAgICAgICAgKHtlOiBsZWZ0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjVDMCcsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShhcnJvd1dpZHRoICsgMTAsIDApO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoeWVhciwgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGZvbnRXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgKHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCkpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJ1xcdTI1QjYnLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgIG9ic2VydmFibGVBcmVhcyA9IFtcclxuICAgICAgICAgICAgICAgIC4uLm9ic2VydmFibGVBcmVhcyxcclxuICAgICAgICAgICAgICAgIC4uLlt7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogbGVmdEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmb250V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudFllYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHJpZ2h0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGZvbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5jcmVhc2VDdXJyZW50WWVhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgIHllYXIsXHJcbiAgICAgICAgICAgICAgICBtb250aCxcclxuICAgICAgICAgICAgICAgIG9ic2VydmFibGVBcmVhcyxcclxuICAgICAgICAgICAgICAgIGRhdGVzOiBEYXRlUGlja2VyLnJlbmRlckNhbGVuZGFyRGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogeCArIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSArIDQwICsgNCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggLSA4LFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gNDAgLSA4LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlXHJcbiAgICAgICAgICAgICAgICB9LCBjdHgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMgT2JqZWN0W11cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlckNhbGVuZGFyRGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YSwgY3VycmVudERhdGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxOHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBsZXQgeFBvcyA9IDAsIHJvdW5kZWRYUG9zID0gMCwgeVBvcyA9IDAsIHJvdW5kZWRZUG9zID0gMCwgY29udGVudFdpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHtcclxuICAgICAgICAgICAgICAgIGhvcml6b250YWw6IHdpZHRoIC8gNyxcclxuICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBoZWlnaHQgLyBNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyA3KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBmb250WVBvcyA9IE1hdGgucm91bmQoaW50ZXJ2YWwudmVydGljYWwgLyAyICsgY3R4Lm1lYXN1cmVUZXh0KCcwJykuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQgLyAyKSAtIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlRGF0ZSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YUFyZWEgPSBkYXRhLnJlZHVjZSgoY29sbGVjdGlvbiwgaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gWy4uLmNvbGxlY3Rpb24sIC4uLltpdGVtXV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7ZGF0ZSwgaGlnaGxpZ2h0ZWR9ID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ3VycmVudFNlbGVjdGVkRGF0ZSA9IGN1cnJlbnREYXRlRGF0ZSA9PT0gZGF0ZTtcclxuICAgICAgICAgICAgICAgIHhQb3MgPSBpICUgNyAqIGludGVydmFsLmhvcml6b250YWw7XHJcbiAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyk7XHJcbiAgICAgICAgICAgICAgICB5UG9zID0geFBvcyA/IHlQb3MgOiAoaSA/IHlQb3MgKyBpbnRlcnZhbC52ZXJ0aWNhbCA6IHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgcm91bmRlZFlQb3MgPSBNYXRoLnJvdW5kKHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gaXNDdXJyZW50U2VsZWN0ZWREYXRlID8gJ3JlZCcgOiAnIzAwM2I2ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3Qocm91bmRlZFhQb3MsIHJvdW5kZWRZUG9zLCBNYXRoLnJvdW5kKGludGVydmFsLmhvcml6b250YWwpIC0gNCwgTWF0aC5yb3VuZChpbnRlcnZhbC52ZXJ0aWNhbCkgLSA0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgICAgICh7d2lkdGg6IGNvbnRlbnRXaWR0aH0gPSBjdHgubWVhc3VyZVRleHQoZGF0ZSkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGRhdGUsIHJvdW5kZWRYUG9zICsgTWF0aC5yb3VuZCgoaW50ZXJ2YWwuaG9yaXpvbnRhbCAtIDQpIC8gMiAtIGNvbnRlbnRXaWR0aCAvIDIpLCByb3VuZGVkWVBvcyArIGZvbnRZUG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAuLi5be1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogeCArIHJvdW5kZWRYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB5ICsgcm91bmRlZFlQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKGludGVydmFsLmhvcml6b250YWwpIC0gNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGludGVydmFsLnZlcnRpY2FsKSAtIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpY2tEYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIH0sIFtdKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhQXJlYTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHRoaXMge0RhdGVQaWNrZXIucHJvdG90eXBlfSAqL1xyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4OiBwb2ludGVyWCwgeTogcG9pbnRlclksIGN1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fSwgYXJlYSkge1xyXG4gICAgICAgIGlmICghYXJlYSkgcmV0dXJuIHt4OiBwb2ludGVyWCwgeTogcG9pbnRlclksIGN1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fTtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4fSA9IGFyZWE7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB6SW5kZXggPiBoaWdoZXN0WkluZGV4ICYmXHJcbiAgICAgICAgICAgIHggPCBwb2ludGVyWCAmJlxyXG4gICAgICAgICAgICB5IDwgcG9pbnRlclkgJiZcclxuICAgICAgICAgICAgKHggKyB3aWR0aCkgPiBwb2ludGVyWCAmJlxyXG4gICAgICAgICAgICAoeSArIGhlaWdodCkgPiBwb2ludGVyWTtcclxuICAgICAgICBhcmVhLmhpZ2hsaWdodGVkID0gbWF0Y2g7XHJcbiAgICAgICAgcmV0dXJuIHsuLi57eDogcG9pbnRlclgsIHk6IHBvaW50ZXJZfSwgLi4uKChtYXRjaCAmJiBhcmVhKSB8fCB7Y3Vyc29yVHlwZTogbGF0ZXN0S25vd25DdXJzb3JUeXBlLCB6SW5kZXg6IGhpZ2hlc3RaSW5kZXh9KX07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNhbGVuZGFyQnVpbGRlcihkYXRlKSB7XHJcbiAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZSgxKTtcclxuICAgICAgICBsZXQgaWR4ID0gKGRhdGUuZ2V0RGF5KCkgKyA2KSAlIDc7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICB5ZWFyOiBkYXRlLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgICAgICAgIG1vbnRoOiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgncnUnLCB7bW9udGg6ICdsb25nJ30pXHJcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGRhdGUpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlvQsC3Rj10vLCBtYXRjaCA9PiBtYXRjaC50b1VwcGVyQ2FzZSgpKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IFtdO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgZGF0YVtpZHgrK10gPSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLmdldERhdGUoKSxcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKVxyXG4gICAgICAgIH0gd2hpbGUgKGRhdGUuZ2V0RGF0ZSgpID4gMSk7XHJcbiAgICAgICAgcmV0dXJuIHsuLi5yZXN1bHQsIC4uLntkYXRlczogWy4uLmRhdGFdfX07XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLmNhbGVuZGFyQnVpbGRlcih0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3g6IGNsaWNrWCwgeTogY2xpY2tZfSkge1xyXG4gICAgICAgIGNvbnN0IF9maW5kID0gYXJlYSA9PiAoXHJcbiAgICAgICAgICAgIGFyZWEgJiYgYXJlYS54IDwgY2xpY2tYICYmIGFyZWEueSA8IGNsaWNrWSAmJiAoYXJlYS54ICsgYXJlYS53aWR0aCkgPiBjbGlja1ggJiYgKGFyZWEueSArIGFyZWEuaGVpZ2h0KSA+IGNsaWNrWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgYXJlYSA9IHRoaXMuY2FsZW5kYXJEYXRhLm9ic2VydmFibGVBcmVhcy5maW5kKF9maW5kKSB8fCB0aGlzLmNhbGVuZGFyRGF0YS5kYXRlcy5maW5kKF9maW5kKSB8fCB7dHlwZTogJyd9O1xyXG4gICAgICAgIHN3aXRjaCAoYXJlYS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3BpY2tEYXRlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RGF0ZShhcmVhLmRhdGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2luY3JlYXNlQ3VycmVudE1vbnRoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0TW9udGgodGhpcy5jdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVjcmVhc2VDdXJyZW50TW9udGgnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRNb250aCh0aGlzLmN1cnJlbnREYXRlLmdldE1vbnRoKCkgLSAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdpbmNyZWFzZUN1cnJlbnRZZWFyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RnVsbFllYXIodGhpcy5jdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVjcmVhc2VDdXJyZW50WWVhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldEZ1bGxZZWFyKHRoaXMuY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYXRvci5zZXREYXRlKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coe3ggPSB0aGlzLngsIHkgPSB0aGlzLnksIGluaXRpYXRvcn0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4LCB5LCB6SW5kZXg6IEluZmluaXR5LCBpbml0aWF0b3IsIG9wZW5lZDogdHJ1ZX0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudERhdGUgPSBpbml0aWF0b3IuZGF0ZSB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuYXNzaWduTGFzdEFjdGl2YXRlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge29wZW5lZDogZmFsc2UsIHpJbmRleDogLTF9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIGluaXRpYXRvcjogbnVsbH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0QXJlYXMocG9zKSB7XHJcbiAgICAgICAgKHtjdXJzb3JUeXBlOiBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvcn0gPSBbXHJcbiAgICAgICAgICAgIC4uLnRoaXMuY2FsZW5kYXJEYXRhLmRhdGVzLFxyXG4gICAgICAgICAgICAuLi50aGlzLmNhbGVuZGFyRGF0YS5vYnNlcnZhYmxlQXJlYXNcclxuICAgICAgICBdLnJlZHVjZShEYXRlUGlja2VyLmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7Li4ucG9zLCAuLi57Y3Vyc29yVHlwZTogJ2luaXRpYWwnLCB6SW5kZXg6IC0xfX0pKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRBcmVhcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtkYXRlRm9ybWF0LCB0aHJvdHRsZX0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7RGF0ZVBpY2tlcn0gZnJvbSBcIi4vZGF0ZS1waWNrZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFZGl0Qm94IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt3aWR0aCA9IEVkaXRCb3guZ2VvbWV0cmljLndpZHRoLCBpc0NhbGVuZGFyID0gZmFsc2UsIGRhdGUgPSBpc0NhbGVuZGFyID8gbmV3IERhdGUoKSA6IG51bGwsIHZhbHVlID0gaXNDYWxlbmRhciA/IGRhdGVGb3JtYXQoZGF0ZSkgOiAnJywgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0VkaXRCb3gnO1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICAgIHRoaXMuaXNDYWxlbmRhciA9IGlzQ2FsZW5kYXI7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQgPSBudWxsO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgRWRpdEJveC5nZW9tZXRyaWMsIHt3aWR0aH0pO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2YWJsZUFyZWFzID0gW1xyXG4gICAgICAgICAgICAuLi4oXHJcbiAgICAgICAgICAgICAgICBpc0NhbGVuZGFyID8gW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmb2N1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICd0ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLnggKyB0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaG93Q2FsZW5kYXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdIDogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZm9jdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAndGV4dCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZ2VvbWV0cmljKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiA5MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgdmFsdWUsIGlzQ2FsZW5kYXJ9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDIsIHkgLSAyLCB3aWR0aCArIDMsIGhlaWdodCArIDMpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjNjY2NjY2JztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZGRkZGRkJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzFkMWQxZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMywgeSArIGhlaWdodCAtIDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWlzQ2FsZW5kYXIpIHJldHVybiBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMThweC8xIGVtb2ppJztcclxuICAgICAgICAgICAgY29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCgn8J+ThicpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyM2NjY2NjYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJ/Cfk4YnLCB4ICsgd2lkdGggLSBoZWlnaHQsIHkgKyBmb250SGVpZ2h0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAdGhpcyB7RWRpdEJveC5wcm90b3R5cGV9ICovXHJcbiAgICBzdGF0aWMgZGVmaW5lQ3Vyc29yVHlwZSh7eCwgeX0pIHtcclxuICAgICAgICAoe2N1cnNvclR5cGU6IEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yfSA9IChcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMuZmluZChmdW5jdGlvbih7eCwgeSwgd2lkdGgsIGhlaWdodH0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4IDwgdGhpcy54ICYmIHkgPCB0aGlzLnkgJiYgKHggKyB3aWR0aCkgPiB0aGlzLnggJiYgKHkgKyBoZWlnaHQpID4gdGhpcy55O1xyXG4gICAgICAgICAgICB9LCB7eCwgeX0pIHx8IHtjdXJzb3JUeXBlOiAnaW5pdGlhbCd9XHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCB1bnNhZmVWYWx1ZSA9IHRoaXMuaHRtbElucHV0Py52YWx1ZSA/PyB0aGlzLnZhbHVlO1xyXG4gICAgICAgIHRoaXMuaXNDYWxlbmRhciA/XHJcbiAgICAgICAgICAgIC9eXFxkezEsMn1cXC9cXGR7MSwyfVxcL1xcZHs0fSQvLnRlc3QodW5zYWZlVmFsdWUpICYmIHRoaXMuc2V0RGF0ZShuZXcgRGF0ZSh1bnNhZmVWYWx1ZSkpIDpcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh1bnNhZmVWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dCAmJiAodGhpcy5odG1sSW5wdXQucmVtb3ZlKCkgfHwgdGhpcy5odG1sSW5wdXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5vYnNlcnZhYmxlQXJlYXMuZmluZChmdW5jdGlvbih7eCwgeSwgd2lkdGgsIGhlaWdodH0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHggPCB0aGlzLnggJiYgeSA8IHRoaXMueSAmJiAoeCArIHdpZHRoKSA+IHRoaXMueCAmJiAoeSArIGhlaWdodCkgPiB0aGlzLnk7XHJcbiAgICAgICAgfSwge3gsIHl9KTtcclxuICAgICAgICBpZiAoIWFyZWEpIHJldHVybjtcclxuICAgICAgICBzd2l0Y2ggKGFyZWEudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdmb2N1cyc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnc2hvd0NhbGVuZGFyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0NhbGVuZGFyKHt4LCB5fSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0NhbGVuZGFyKHt4LCB5fSkge1xyXG4gICAgICAgIERhdGVQaWNrZXIuaW5zdGFuY2Uuc2hvdyh7aW5pdGlhdG9yOiB0aGlzLCB4LCB5fSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9jdXMoKSB7XHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0ge1xyXG4gICAgICAgICAgICB0b3A6IEFwcC5pbnN0YW5jZS5jYW52YXMub2Zmc2V0VG9wLFxyXG4gICAgICAgICAgICBsZWZ0OiBBcHAuaW5zdGFuY2UuY2FudmFzLm9mZnNldExlZnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQuc2V0QXR0cmlidXRlKCdzdHlsZScsIE9iamVjdC5lbnRyaWVzKHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgIHRvcDogYCR7dGhpcy55ICsgb2Zmc2V0LnRvcH1weGAsXHJcbiAgICAgICAgICAgIGxlZnQ6IGAke3RoaXMueCArIG9mZnNldC5sZWZ0fXB4YCxcclxuICAgICAgICAgICAgd2lkdGg6IGAke3RoaXMuaXNDYWxlbmRhciA/IHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCA6IHRoaXMud2lkdGh9cHhgLFxyXG4gICAgICAgICAgICBmb250OiAnMTRweCBzYW5zLXNlcmlmJyxcclxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2RkZGRkZCcsXHJcbiAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxyXG4gICAgICAgICAgICBwYWRkaW5nOiAnMnB4IDAnXHJcbiAgICAgICAgfSkubWFwKGUgPT4gZS5qb2luKCc6JykpLmpvaW4oJzsnKSk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQuaWQgPSAnaHRtbC1pbnB1dC1lbGVtZW50JztcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC52YWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmh0bWxJbnB1dCk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQuZm9jdXMoKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0ZShkYXRlID0gdGhpcy5kYXRlKSB7XHJcbiAgICAgICAgaWYgKCFkYXRlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gZGF0ZUZvcm1hdChkYXRlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlID0gdGhpcy52YWx1ZSkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBFZGl0Qm94LnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7dHlwZSwga2V5LCBvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdrZXlkb3duJzpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnRW50ZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQmx1cigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50aHJvdHRsZShFZGl0Qm94LmRlZmluZUN1cnNvclR5cGUuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhvdmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtpZH0pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0hvdmVyfSAqL1xyXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gX2luc3RhbmNlIHx8IChpID0+IF9pbnN0YW5jZSA9IGkpKG5ldyBIb3Zlcih7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGFjdGl2ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4IC0gMiwgeSAtIDIsIHdpZHRoICsgNCwgaGVpZ2h0ICsgNCk7XHJcbiAgICAgICAgaWYgKCFhY3RpdmUpIHJldHVybjtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnI2ZkMjkyOSc7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db250ZXh0TWVudSgpIHt9XHJcblxyXG4gICAgb25CbHVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgc2hvdyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4ID0gMX0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeDogeCAtIDEsXHJcbiAgICAgICAgICAgIHk6IHkgLSAxLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggKyAyLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCArIDIsXHJcbiAgICAgICAgICAgIHpJbmRleDogekluZGV4IC0gMSxcclxuICAgICAgICAgICAgYWN0aXZlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIHk6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBIb3Zlci5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRvb2x0aXAge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnRleHQgPSAnJztcclxuICAgICAgICB0aGlzLmRlYm91bmNlID0gZGVib3VuY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge1Rvb2x0aXB9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IFRvb2x0aXAoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0ZXh0fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGlmICghdGV4dCkgcmV0dXJuO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgNTAwLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxMHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmVhOWYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzMyMzIzMic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCB4ICsgMTAsIHkgKyBoZWlnaHQgLSAxMCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNvbnRleHRNZW51KCkge31cclxuXHJcbiAgICBvbkJsdXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHt9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBzaG93KHt4LCB5LCB0b29sdGlwQ29udGVudH0pIHtcclxuICAgICAgICBjb25zdCB7Y3R4LCBjYW52YXM6IHt3aWR0aDogY2FudmFzV2lkdGh9fSA9IEFwcC5pbnN0YW5jZTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxMHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCB7YWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGNvbnRlbnRIZWlnaHQsIHdpZHRoOiBjb250ZW50V2lkdGh9ID0gY3R4Lm1lYXN1cmVUZXh0KHRvb2x0aXBDb250ZW50KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB4ID4gKGNhbnZhc1dpZHRoIC0gY29udGVudFdpZHRoIC0gMjApID8geCAtIGNvbnRlbnRXaWR0aCAtIDIwIDogeCxcclxuICAgICAgICAgICAgeTogeSA+IGNvbnRlbnRIZWlnaHQgKyAyMCA/IHkgLSBjb250ZW50SGVpZ2h0IC0gMjAgOiB5LFxyXG4gICAgICAgICAgICB3aWR0aDogY29udGVudFdpZHRoICsgMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogY29udGVudEhlaWdodCArIDIwLFxyXG4gICAgICAgICAgICB0ZXh0OiB0b29sdGlwQ29udGVudCxcclxuICAgICAgICAgICAgekluZGV4OiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMudGV4dCA9ICcnO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgeTogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGUoe3gsIHl9KSB7XHJcbiAgICAgICAgY29uc3Qge3RleHQsIHpJbmRleH0gPSB0aGlzO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3RleHQ6ICcnLCB6SW5kZXg6IC0xfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsuLi57eCwgeTogeSAtIHRoaXMuaGVpZ2h0LCB0ZXh0LCB6SW5kZXh9fSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVG9vbHRpcC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLmRlYm91bmNlKHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge3NpbnVzb2lkR2VufSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVuZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ1RyZW5kZXInO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUNvbmZpZyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIEluJyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlICo9IDEuMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gT3V0JyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlICo9IDAuOTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLm1hcCgoe2NhbGxiYWNrLCAuLi5yZXN0fSkgPT4gKHtcclxuICAgICAgICAgICAgLi4ucmVzdCxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmRlYm91bmNlID0gZGVib3VuY2UoKTtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoY29uZmlnLCBjdHgpIHtcclxuICAgICAgICBjb25zdCBjaGFydE1hcmdpbiA9IDIwO1xyXG4gICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBkYXRhOiB7cG9pbnRzfX0gPSBjb25maWc7XHJcbiAgICAgICAgY29uc3QgY2hhcnRBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB4ICsgcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgeTogeSArIHBhZGRpbmdbMF0sXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIHBhZGRpbmdbMV0gLSBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCAtIHBhZGRpbmdbMF0gLSBwYWRkaW5nWzJdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB7bWluLCBtYXh9ID0gVHJlbmRlci5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICBjdHguZmlsbFJlY3QuYXBwbHkoY3R4LCBPYmplY3QudmFsdWVzKGNoYXJ0QXJlYSkpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdZQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWEsIC4uLnt6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9fSwgY3R4KTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdEYXRhKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd0xlZ2VuZCh7Li4uY29uZmlnLCAuLi57XHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHk6IHkgKyBoZWlnaHQgLSA0MCxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9fSwgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdEYXRhKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBzY2FsZSwgZGF0YToge3BvaW50cyA9IFtdfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMwMDAwZmYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgKC1wb2ludHNbMF0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIHtsZW5ndGh9ID0gcG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICBzdGVwID0gd2lkdGggLyBsZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFZhbHVlID0gLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICB4UG9zICs9IHN0ZXAsIHNjYWxlZFZhbHVlID0gKC1wb2ludHNbKytpXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeFBvcywgc2NhbGVkVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIHtsZW5ndGh9ID0gcG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICBzdGVwID0gd2lkdGggLyBsZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFZhbHVlID0gLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICB4UG9zICs9IHN0ZXAsIHNjYWxlZFZhbHVlID0gKC1wb2ludHNbKytpXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4UG9zIC0gNCwgc2NhbGVkVmFsdWUgLSA0LCA4LCA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHhQb3MgLSA0LCBzY2FsZWRWYWx1ZSAtIDQsIDgsIDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdYQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4LCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgeFBvcyA9IHgsXHJcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSB3aWR0aCAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsV2lkdGggPSBjdHgubWVhc3VyZVRleHQocG9pbnRzWzBdLnRpbWUpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsT2Zmc2V0ID0gTWF0aC5yb3VuZChsYWJlbFdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzSW50ZXJ2YWwgPSBNYXRoLmNlaWwoKGxhYmVsV2lkdGggKyAyMCkgLyBpbnRlcnZhbCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dExhYmVsUG9zID0geFBvcyArIGxhYmVsc0ludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zICs9IGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyksXHJcbiAgICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gIShpICUgbGFiZWxzSW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBpc01ham9yVGljayA/ICcjM2MzYzNjJyA6ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhyb3VuZGVkWFBvcywgaXNNYWpvclRpY2sgPyB5ICsgaGVpZ2h0ICsgNSA6IHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhyb3VuZGVkWFBvcywgeSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTWFqb3JUaWNrKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChwb2ludHNbaV0udGltZSwgcm91bmRlZFhQb3MgLSBsYWJlbE9mZnNldCwgeSArIGhlaWdodCArIDIwKTtcclxuICAgICAgICAgICAgICAgIG5leHRMYWJlbFBvcyArPSBsYWJlbHNJbnRlcnZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WUF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRpY2tzID0gMjAsIG1ham9yVGlja3NJbnRlcnZhbCwgemVyb0xldmVsLCBzY2FsZSwgcmFuZ2VTY2FsZSwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzFhMWExYSc7XHJcbiAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gaGVpZ2h0IC8gdGlja3M7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZWN0KHggLTEwMCwgeSwgd2lkdGggKyAxMDAsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICB5UG9zID0gemVyb0xldmVsICsgTWF0aC5jZWlsKCh5ICsgaGVpZ2h0IC0gemVyb0xldmVsKSAvIGludGVydmFsKSAqIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgIHJvdW5kZWRZUG9zID0gTWF0aC5yb3VuZCh5UG9zKSxcclxuICAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcykgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMiksXHJcbiAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgaSA8IHRpY2tzO1xyXG4gICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyksXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcyApIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gTWF0aC5hYnMoeVBvcyAtIHplcm9MZXZlbCkgJSAoaW50ZXJ2YWwgKiBtYWpvclRpY2tzSW50ZXJ2YWwpIDwgaW50ZXJ2YWwgLyAyKSB7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGlzTWFqb3JUaWNrID8gJyM0MzQzNDMnIDogJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhpc01ham9yVGljayA/IHggLSA1IDogeCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGlmICghaXNNYWpvclRpY2spIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobGFiZWwsIHggLSBjdHgubWVhc3VyZVRleHQobGFiZWwpLndpZHRoIC0gMTAsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdMZWdlbmQoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtuYW1lfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMCwwLDI1NSknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQobmFtZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oLTEsIDAsIDAsIDEsIHggKyB3aWR0aCAvIDIgLSA1LCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCA0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbygyMCwgNCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCg2LCAwLCA4LCA4KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoNiwgMCwgOCwgOCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCArIHdpZHRoIC8gMiArIDUsIHkgKyBoZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMTUxNTE1JztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG5hbWUsIDAsIGZvbnRIZWlnaHQgLSAyKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVSYW5nZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKCh7bWluLCBtYXgsIG1heE5lZ2F0aXZlLCBtaW5Qb3NpdGl2ZX0sIHt2YWx1ZX0pID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWluOiBNYXRoLm1pbih2YWx1ZSwgbWluKSxcclxuICAgICAgICAgICAgICAgIG1heDogTWF0aC5tYXgodmFsdWUsIG1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICksIHtcclxuICAgICAgICAgICAgbWluOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgbWF4OiAtSW5maW5pdHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja0RhdGEoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKSAtIDEwMDAgKiAyOTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKVxyXG4gICAgICAgICAgICAuZmlsbChzdGFydFRpbWUpXHJcbiAgICAgICAgICAgIC5tYXAoKHRpbWUsIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKHRpbWUgKyAxMDAwICogaWR4KS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc2ludXNvaWRHZW4ubmV4dCgpLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja05leHREYXRhKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3RyZW5kZXJOZXh0VGljaycsIHtkZXRhaWw6IHtcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgdmFsdWU6IHNpbnVzb2lkR2VuLm5leHQoKS52YWx1ZSxcclxuICAgICAgICB9fSkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigndHJlbmRlck5leHRUaWNrJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIFRyZW5kZXIucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtkZXRhaWx9KSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMucHVzaChkZXRhaWwpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbHVlSXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7dmFsdWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdWYWx1ZUl0ZW0nO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gMDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVDb25maWcgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92ZScsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdIb3Jpem9udGFsbHknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVydGljYWxseScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eTogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEb3duJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt5OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVzaXplJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eTogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hpZGUnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5oaWRlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBWYWx1ZUl0ZW0uZ2VvbWV0cmljKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCByYW5kb21WYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAxMDApLnRvRml4ZWQoMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZpc2libGUsIHZhbHVlLCB0cmVuZCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgbGV0IHN0YWNrID0gMDtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF2aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTYxNjE2JztcclxuXHRcdFx0Y3R4LmZvbnQgPSAnYm9sZCAxMnB4IHNlcmlmJztcclxuXHRcdFx0Y29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcblx0XHRcdGlmIChhY3RpdmUpIHtcclxuXHRcdFx0XHRjdHguc2F2ZSgpO1xyXG5cdFx0XHRcdHN0YWNrKys7XHJcblx0XHRcdFx0aWYgKHRyZW5kID4gMCkge1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMDBGRjAwJztcclxuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0cmVuZCA8IDApIHtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnI2U1MDAwMCc7XHJcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFx0XHRjdHguY2xpcCgpO1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG5cdFx0XHRzdGFjayAmJiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJhbmRvbUNoYW5nZSgpIHtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMDAgKyBNYXRoLnJhbmRvbSgpICogNjAwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTW91c2VEb3duKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGV4dCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gdmFsdWUgPiB0aGlzLnZhbHVlID8gMSA6ICh2YWx1ZSA8IHRoaXMudmFsdWUgPyAtMSA6IDApO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYmxpbmsuYmluZCh0aGlzKSwgMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBibGluaygpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25WYWx1ZUNoYW5nZSgpIHtcclxuICAgICAgICB0aGlzLnNldFRleHQoVmFsdWVJdGVtLnJhbmRvbVZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVmFsdWVJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtDb2xsZWN0aW9uSXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW1cIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi9jb21wb25lbnRzL3Rvb2x0aXBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL2NvbXBvbmVudHMvdmFsdWUtaXRlbVwiO1xyXG5pbXBvcnQge0NoYXJ0SXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jaGFydC1pdGVtXCI7XHJcbmltcG9ydCB7RWRpdEJveH0gZnJvbSBcIi4vY29tcG9uZW50cy9lZGl0LWJveFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRleHQtbWVudVwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4vYXBwXCI7XHJcbmltcG9ydCB7QnV0dG9ufSBmcm9tIFwiLi9jb21wb25lbnRzL2J1dHRvblwiO1xyXG5pbXBvcnQge0NvbWJvQm94fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbWJvLWJveFwiO1xyXG5pbXBvcnQge1RyZW5kZXJ9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJlbmRlclwiO1xyXG5pbXBvcnQge0hvdmVyfSBmcm9tIFwiLi9jb21wb25lbnRzL2hvdmVyXCI7XHJcbmltcG9ydCB7Q2xvY2t9IGZyb20gXCIuL2NvbXBvbmVudHMvY2xvY2tcIjtcclxuaW1wb3J0IHtEYXRlUGlja2VyfSBmcm9tIFwiLi9jb21wb25lbnRzL2RhdGUtcGlja2VyXCI7XHJcblxyXG5jb25zdCBjaGFydENvbmZpZyA9IHtcclxuICAgIHR5cGU6ICdjb2x1bW4nLFxyXG4gICAgcGFkZGluZzogWzIwLCAyMCwgNzAsIDcwXSxcclxuICAgIHRpY2tzOiA1LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHBvaW50czogQ2hhcnRJdGVtLm1vY2tEYXRhKCksXHJcbiAgICAgICAgbWFyZ2luOiAwLjFcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHRyZW5kZXJDb25maWcgPSB7XHJcbiAgICBwYWRkaW5nOiBbMjAsIDIwLCA3MCwgNzBdLFxyXG4gICAgdGlja3M6IDIwLFxyXG4gICAgbWFqb3JUaWNrc0ludGVydmFsOiA0LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIG5hbWU6ICdzaW4oeCknLFxyXG4gICAgICAgIHBvaW50czogVHJlbmRlci5tb2NrRGF0YSgpXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBtZW51SXRlbXMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdPbmUnLFxyXG4gICAgICAgIHZhbHVlOiAxLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogJ1R3bycsXHJcbiAgICAgICAgdmFsdWU6IDIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiAnVGhyZWUnLFxyXG4gICAgICAgIHZhbHVlOiAzLFxyXG4gICAgfVxyXG5dO1xyXG5cclxuY29uc3QgYnV0dG9uQ2FsbGJhY2sgPSAoKSA9PiAoXHJcbiAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCdyYW5kb21pemVDaGFydERhdGEnKSlcclxuKTtcclxuXHJcbnNldEludGVydmFsKFRyZW5kZXIubW9ja05leHREYXRhLCAxMDAwKTtcclxuXHJcbkFwcC5pbnN0YW5jZS5jb21wb25lbnRzID0gW1xyXG4gICAgLi4uW1xyXG4gICAgICAgIG5ldyBDbG9jayh7eTogMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pXHJcbiAgICBdLFxyXG4gICAgLi4uQ29sbGVjdGlvbkl0ZW0uY29tcG9zZSh7eDogMCwgeTogMzAsIGNvbHM6IDI1LCByb3dzOiAxMiwgZ2FwOiAyMCwgY3RvcjogVmFsdWVJdGVtfSksXHJcbiAgICAuLi5bXHJcbiAgICAgICAgbmV3IEVkaXRCb3goe3g6IDAsIHk6IDYwMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBFZGl0Qm94KHt4OiAxMDAsIHk6IDYwMCwgd2lkdGg6IDEwMCwgekluZGV4OiAxLCBpc0NhbGVuZGFyOiB0cnVlLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDb21ib0JveCh7eDogMjUwLCB5OiA2MDAsIHpJbmRleDogMSwgdmFyaWFibGVOYW1lOiAnQ29tYm9ib3gxJywgbWVudUl0ZW1zLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDaGFydEl0ZW0oey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiAzMCwgd2lkdGg6IDYwMCwgaGVpZ2h0OiA0MDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9LCAuLi5jaGFydENvbmZpZ30pLFxyXG4gICAgICAgIG5ldyBCdXR0b24oe3g6IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSBCdXR0b24uZ2VvbWV0cmljLndpZHRoLCB5OiA0NTAsIHpJbmRleDogMSwgdmFsdWU6ICdSYW5kb21pemUnLCBjYWxsYmFjazogYnV0dG9uQ2FsbGJhY2ssIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IFRyZW5kZXIoey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiA0OTAsIHdpZHRoOiA2MDAsIGhlaWdodDogNDAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSwgLi4udHJlbmRlckNvbmZpZ30pLFxyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UsXHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UsXHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2UsXHJcbiAgICAgICAgRGF0ZVBpY2tlci5pbnN0YW5jZVxyXG4gICAgXVxyXG5dO1xyXG5cclxuQXBwLmluc3RhbmNlLnJlbmRlcigpO1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2UodGhyZXNob2xkID0gMTAwKSB7XHJcbiAgICBsZXQgdGltZW91dCA9IDA7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIHRocmVzaG9sZCwgYXJnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKHRocmVzaG9sZCA9IDEwMCkge1xyXG4gICAgbGV0IHRpbWVvdXQgPSB0cnVlO1xyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGltZW91dCA9IHRydWUsIHRocmVzaG9sZCk7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICB0aW1lb3V0ICYmIGZuKGFyZyk7XHJcbiAgICAgICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3Qgc2ludXNvaWRHZW4gPSAoZnVuY3Rpb24qICgpIHtcclxuICAgIGNvbnN0IHBlcmlvZCA9IE1hdGguUEkgKiAyO1xyXG4gICAgY29uc3QgcSA9IDAuNTtcclxuICAgIGxldCBfaSA9IDA7XHJcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgTWF0aC5yb3VuZChNYXRoLnNpbihfaSsrICogcSAlIHBlcmlvZCkgKiAxMDAwMCkgLyAxMDA7XHJcbn0pKCk7XHJcblxyXG5jb25zdCB0aW1lRm9ybWF0ID0gKHRpbWVGb3JtYXR0ZXIgPT4ge1xyXG4gICAgcmV0dXJuIHRpbWUgPT4gdGltZUZvcm1hdHRlci5mb3JtYXQodGltZSk7XHJcbn0pKG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydScsIHtob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnLCBzZWNvbmQ6ICcyLWRpZ2l0J30pKTtcclxuXHJcbmNvbnN0IGRhdGVGb3JtYXQgPSAoZGF0ZUZvcm1hdHRlciA9PiB7XHJcbiAgICByZXR1cm4gZGF0ZSA9PiBkYXRlRm9ybWF0dGVyLmZvcm1hdChkYXRlKTtcclxufSkobmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2VuJywge2RheTogJzItZGlnaXQnLCBtb250aDogJzItZGlnaXQnLCB5ZWFyOiAnbnVtZXJpYyd9KSk7XHJcblxyXG5leHBvcnQgeyBzaW51c29pZEdlbiwgdGltZUZvcm1hdCwgZGF0ZUZvcm1hdCB9XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9