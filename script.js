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
        for (let i = 0, zIndex = -1, items = this._components, length = items.length; i < length; i++) {
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
            this.lastActivated &&
                this.lastActivated.onBlur();
        this.lastActivated = topMost;
        topMost && (
            button === 2 ?
                topMost.onContextMenu({x, y}) : topMost.onMouseDown({x, y})
        );
    }

    onMouseMove({offsetX: x, offsetY: y}) {
        let topMost;
        for (let i = 0, zIndex = -1, items = this._components, length = items.length; i < length; i++) {
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

    assignLastActivated(component) {
        this.lastActivated && this.lastActivated.onBlur();
        this.lastActivated = component;
    }

    repaintAffected({id, x, y, width, height, zIndex}) {
        for (let i = 0, items = this._components, length = items.length; i < length; i++) {
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
        for (let i = 0, items = this._components, length = items.length; i < length; i++) {
            items[i].render();
        }
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
                     length = points.length,
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
                     length = menuItems.length,
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
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.dispatch(new CustomEvent('updateLocalVariable', {detail: this.variable}));
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
        let hasHighlightedChild;
        if (item.highlighted) {
            ({highlighted: hasHighlightedChild, right, bottom} = item.children.reduce(ContextMenu.findItemUnderPointer, {x, y, right, bottom}));
        }
        item.highlighted = !item.disabled && (
            hasHighlightedChild || (
                item.x <= x &&
                item.y <= y &&
                (item.x + item.width) > x &&
                (item.y + item.height) > y
            )
        );
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
        found && found.type && found.type();
        this.hide();
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
            height: 200
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
            ctx.font = 'bold 16px sans-serif';
            ctx.save();
                const {width: monthWidth, actualBoundingBoxAscent: monthHeight} = ctx.measureText(month);
                ctx.font = '20px Webdings';
                const {width: arrowWidth, actualBoundingBoxAscent: arrowHeight} = ctx.measureText('3');
                ctx.translate(Math.round(width / 2 - monthWidth - arrowWidth * 2 - 20), 0);
                const {e: leftArrowXPos} = ctx.getTransform();
                ctx.fillText('3', 0, arrowHeight + 8);
                ctx.translate(arrowWidth + 10, 0);
                ctx.font = 'bold 16px sans-serif';
                ctx.fillText(month, 0, monthHeight + 8);
                ctx.translate(monthWidth + 10, 0);
                const {e: rightArrowXPos} = ctx.getTransform();
                ctx.font = '20px Webdings';
                ctx.fillText('4', 0, arrowHeight + 8);
                let observableAreas = [{
                    x: leftArrowXPos,
                    y: y,
                    width: arrowWidth,
                    height: 30,
                    zIndex: 2,
                    type: 'decreaseCurrentMonth',
                    cursorType: 'pointer'
                }, {
                    x: rightArrowXPos,
                    y: y,
                    width: arrowWidth,
                    height: 30,
                    zIndex: 2,
                    type: 'increaseCurrentMonth',
                    cursorType: 'pointer'
                }];
            ctx.restore();
            let {width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText(year);
            ctx.translate(Math.round(width / 2 + 10), 0);
            ctx.fillText(year, 0, fontHeight + 8);
            ctx.translate(fontWidth + 5, 0);
            const {e: yearSpinnerXPos} = ctx.getTransform();
            ctx.font = '14px Webdings';
            ({width: fontWidth, actualBoundingBoxAscent: fontHeight} = ctx.measureText('6'));
            ctx.fillText('5', 0, 15 - 3);
            ctx.fillText('6', 0, 15 + fontHeight + 3);
            observableAreas = [
                ...observableAreas,
                ...[{
                    x: yearSpinnerXPos,
                    y: y,
                    width: fontWidth,
                    height: 15,
                    zIndex: 2,
                    type: 'increaseCurrentYear',
                    cursorType: 'pointer'
                }, {
                    x: yearSpinnerXPos,
                    y: y + 15,
                    width: fontWidth,
                    height: 15,
                    zIndex: 2,
                    type: 'decreaseCurrentYear',
                    cursorType: 'pointer'
                }]
            ];
            const returnValue = {
                year,
                month,
                observableAreas,
                dates: DatePicker.renderCalendarData({
                    x: x + 4,
                    y: y + 30 + 4,
                    width: width - 8,
                    height: height - 30 - 8,
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
        const day = 1000 * 60 * 60 * 24;
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
            date = new Date(+date + day);
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
        this.isCalendar ?
            this.setDate(new Date(this.htmlInput?.value || this.date)) :
            this.setValue(this.htmlInput?.value || this.value);
        this.render();
        this.htmlInput && this.htmlInput.remove();
        this.htmlInput.removeEventListener('keydown', this);
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
                        this.value += key;
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
                     length = points.length,
                     step = width / length,
                     scaledValue = -points[i].value * scale * rangeScale,
                     xPos = 0;
                 i < length;
                 xPos += step, scaledValue = (-points[++i]?.value || 0) * scale * rangeScale) {
                ctx.lineTo(xPos, scaledValue);
            }
            ctx.stroke();
            for (let i = 0,
                     length = points.length,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMvLi9hcHAuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jaGFydC1pdGVtLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvY2xvY2suanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21iby1ib3guanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL2VkaXQtYm94LmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvaG92ZXIuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy90b29sdGlwLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvdHJlbmRlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBv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QUFZLDZEQUFTLEVBQUUsSUFBSSxHQUFHLDJEQUF5Qix1REFBdUQsbUVBQWdCLENBQUMsaUJBQWlCO0FBQ2hKLFlBQVksc0RBQU0sRUFBRSxHQUFHLDJEQUF5QixHQUFHLHNFQUFzQix1RUFBdUUsbUVBQWdCLENBQUM7QUFDakssWUFBWSx5REFBTyxFQUFFLElBQUksR0FBRywyREFBeUIsd0RBQXdELG1FQUFnQixDQUFDLG1CQUFtQjtBQUNqSixRQUFRLGlFQUFnQjtBQUN4QixRQUFRLDhEQUFjO0FBQ3RCLFFBQVEsMEVBQW9CO0FBQzVCLFFBQVEseUVBQW1CO0FBQzNCO0FBQ0E7O0FBRUEscURBQW1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0VaO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUMsaUNBQWlDLHNEQUFzRDs7QUFFeEY7QUFDQTtBQUNBLENBQUMsaUNBQWlDLGtEQUFrRDs7QUFFdEM7Ozs7Ozs7VUNoQzlDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIHtDb21wb25lbnRbXX0gKi9cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjMjIyMjIyJztcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnIzdhZmZkMSc7XHJcbiAgICAgICAgdGhpcy5jdHguZm9udCA9ICcxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgIHRoaXMubGFzdEhvdmVyZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgQXBwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvbkNvbnRleHRNZW51KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0NvbXBvbmVudFtdfSBjb21wb25lbnRzICovXHJcbiAgICBzZXQgY29tcG9uZW50cyhjb21wb25lbnRzKSB7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIGdldCBjb21wb25lbnRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRocm90dGxlKCkuYmluZCh1bmRlZmluZWQsIHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSkpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgQXBwLm9uQ29udGV4dE1lbnUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoKGUpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5kaXNwYXRjaEV2ZW50KGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxpc3RlbihldmVudFR5cGUsIGhhbmRsZXIpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgdW5saXN0ZW4oZXZlbnRUeXBlLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgJiYgdGhpcy5sYXN0QWN0aXZhdGVkLm9uTW91c2VVcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3Qge29mZnNldFg6IHgsIG9mZnNldFk6IHksIGJ1dHRvbn0gPSBlO1xyXG4gICAgICAgIGxldCB0b3BNb3N0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCB6SW5kZXggPSAtMSwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS56SW5kZXggPiB6SW5kZXggJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueCArIGl0ZW1zW2ldLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueSArIGl0ZW1zW2ldLmhlaWdodCkgPiB5XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdCA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgekluZGV4ID0gdG9wTW9zdC56SW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgIU9iamVjdC5pcyh0b3BNb3N0LCB0aGlzLmxhc3RBY3RpdmF0ZWQpICYmXHJcbiAgICAgICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkLm9uQmx1cigpO1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCA9IHRvcE1vc3Q7XHJcbiAgICAgICAgdG9wTW9zdCAmJiAoXHJcbiAgICAgICAgICAgIGJ1dHRvbiA9PT0gMiA/XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0Lm9uQ29udGV4dE1lbnUoe3gsIHl9KSA6IHRvcE1vc3Qub25Nb3VzZURvd24oe3gsIHl9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU1vdmUoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgbGV0IHRvcE1vc3Q7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIHpJbmRleCA9IC0xLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnpJbmRleCA+IHpJbmRleCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS55ICsgaXRlbXNbaV0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0ID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICB6SW5kZXggPSB0b3BNb3N0LnpJbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAhT2JqZWN0LmlzKHRvcE1vc3QsIHRoaXMubGFzdEhvdmVyZWQpICYmXHJcbiAgICAgICAgICAgIHRoaXMubGFzdEhvdmVyZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhvdmVyZWQub25Nb3VzZU91dCgpO1xyXG4gICAgICAgIHRoaXMubGFzdEhvdmVyZWQgPSB0b3BNb3N0O1xyXG4gICAgICAgIHRvcE1vc3QgJiYgdG9wTW9zdC5vbk1vdXNlT3Zlcih7eCwgeX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbkxhc3RBY3RpdmF0ZWQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwYWludEFmZmVjdGVkKHtpZCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4fSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLmlkICE9PSBpZCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPj0geSAmJiBpdGVtc1tpXS55IDw9ICh5ICsgaGVpZ2h0KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDw9IHkgJiYgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID49IHlcclxuICAgICAgICAgICAgICAgICAgICApICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA+PSB4ICYmIGl0ZW1zW2ldLnggPD0gKHggKyB3aWR0aCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8PSB4ICYmIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID49IHhcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt2YWx1ZT0gJ0FwcGx5JywgY2FsbGJhY2sgPSAoKSA9PiB7fSwgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0J1dHRvbic7XHJcbiAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSAxMjtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBCdXR0b24uZ2VvbWV0cmljLCB7d2lkdGg6IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggKyAyMH0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgdGhpcy54ICs9IEJ1dHRvbi5nZW9tZXRyaWMud2lkdGggLSB0aGlzLndpZHRoIC0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgZm9udFNpemUsIHByZXNzZWQsIHJhZGl1cyA9IDN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDMsIHkgLSAzLCB3aWR0aCArIDksIGhlaWdodCArIDkpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2EyYTJhMic7XHJcbiAgICAgICAgICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjYjFiMWIxJztcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDEyNywxMjcsMTI3LDAuNyknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0LCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cywgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHgsIHksIHggKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgMiwgeSArIDIgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMiwgeSArIDIgKyByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyY1RvKHggKyAyLCB5ICsgMiwgeCArIDIgKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyAyICsgd2lkdGggLSByYWRpdXMsIHkgKyAyKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzUzNTM1JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAxMCwgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bigpO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEJ1dHRvbi5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDaGFydEl0ZW0nO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuZGF0YURyYXdBcmVhTWFwID0gW107XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zZXRTY2FsZS5iaW5kKHRoaXMsIDEuMSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIE91dCcsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnNldFNjYWxlLmJpbmQodGhpcywgMC45KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNldFNjYWxlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKGNvbmZpZywgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgY2hhcnRNYXJnaW4gPSAyMDtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgZGF0YToge3BvaW50c319ID0gY29uZmlnO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0QXJlYSA9IHtcclxuICAgICAgICAgICAgeDogeCArIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIHk6IHkgKyBwYWRkaW5nWzBdLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggLSBwYWRkaW5nWzFdIC0gcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSBwYWRkaW5nWzBdIC0gcGFkZGluZ1syXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qge21pbiwgbWF4fSA9IENoYXJ0SXRlbS5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhjaGFydEFyZWEpKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIENoYXJ0SXRlbS5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBDaGFydEl0ZW0uZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIHJldHVybiBDaGFydEl0ZW0uZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3RGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgc2NhbGUsIGRhdGE6IHtwb2ludHMgPSBbXSwgbWFyZ2luID0gMC4yfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgZGF0YURyYXdBcmVhTWFwID0gWy4uLnBvaW50c107XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBiYXJXaWR0aCA9IHN0ZXAgKiAoMSAtIG1hcmdpbiksXHJcbiAgICAgICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSBzdGVwIC8gMiAtIGJhcldpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3R5bGUgPSBwb2ludHNbaV0udmFsdWUgPiAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHBvaW50c1tpXS5oaWdobGlnaHRlZCA/ICcjODEwMDAwJyA6ICcjZmYwMDAwJyk7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCkge1xyXG4gICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gcG9pbnRzW2ldLnZhbHVlID4gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAocG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyM4MTAwMDAnIDogJyNmZjAwMDAnKTtcclxuICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGU7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHhQb3MsIDAsIGJhcldpZHRoLCAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlKTtcclxuICAgICAgICAgICAgICAgIGRhdGFEcmF3QXJlYU1hcFtpXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi5kYXRhRHJhd0FyZWFNYXBbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4UG9zICsgeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5taW4oemVyb0xldmVsLCB6ZXJvTGV2ZWwgKyBiYXJIZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFyV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhRHJhd0FyZWFNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WEF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSArIGhlaWdodCArIDUpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoICAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSB4ICsgc3RlcCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKTtcclxuICAgICAgICAgICAgICAgICBpIDwgcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCwgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHJvdW5kZWRYUG9zLCB5ICsgaGVpZ2h0ICsgNSk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHJvdW5kZWRYUG9zLCB5KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHJvdW5kZWRYUG9zICsgNSwgeSArIGhlaWdodCArIGN0eC5tZWFzdXJlVGV4dChwb2ludHNbaV0uY2F0ZWdvcnkpLndpZHRoICsgNSlcclxuICAgICAgICAgICAgICAgICAgICBjdHgucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHBvaW50c1tpXS5jYXRlZ29yeSwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdZQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgdGlja3MgPSA1LCB6ZXJvTGV2ZWwsIHNjYWxlLCByYW5nZVNjYWxlLCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxYTFhMWEnO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5mbG9vcihoZWlnaHQgLyB0aWNrcyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICB5UG9zID0geSArIGhlaWdodCAtIE1hdGguYWJzKHplcm9MZXZlbCAtIHkgLSBoZWlnaHQpICUgaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zKSAvIHJhbmdlU2NhbGUgLyBzY2FsZSkudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICAgICBpIDwgdGlja3M7XHJcbiAgICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICBpKyssIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zICkgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCAtIDUsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxhYmVsLCB4IC0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aCAtIDEwLCB5UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG5vcm1hbGl6ZVJhbmdlKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoKHttaW4sIG1heCwgbWF4TmVnYXRpdmUsIG1pblBvc2l0aXZlfSwge3ZhbHVlfSkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtaW46IE1hdGgubWluKHZhbHVlLCBtaW4pLFxyXG4gICAgICAgICAgICAgICAgbWF4OiBNYXRoLm1heCh2YWx1ZSwgbWF4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKSwge1xyXG4gICAgICAgICAgICBtaW46IEluZmluaXR5LFxyXG4gICAgICAgICAgICBtYXg6IC1JbmZpbml0eVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtb2NrRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKS5maWxsKFsxLCAtMV0pLm1hcCgoYmksIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogYENhdGVnb3J5JHtpZHggKyAxfWAsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAqIGJpW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSldKSAvIDEwMCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigncmFuZG9taXplQ2hhcnREYXRhJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEucG9pbnRzID0gQ2hhcnRJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldFNjYWxlKCkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlKHNjYWxlID0gMSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgKj0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7eCwgeX0pIHtcclxuICAgICAgICBsZXQgaGlnaGxpZ2h0ZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICBzdXBlci5vbk1vdXNlT3V0KCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7eDogaXRlbVgsIHk6IGl0ZW1ZLCB3aWR0aCwgaGVpZ2h0fSA9IGk7XHJcbiAgICAgICAgICAgIGkuaGlnaGxpZ2h0ZWQgPSBpdGVtWCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtWSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1YICsgd2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgICAgIGlmIChpLmhpZ2hsaWdodGVkKSBoaWdobGlnaHRlZCA9IGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBpZiAoaGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9IGhpZ2hsaWdodGVkLnZhbHVlO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ue3gsIHl9fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHt0eXBlLCBvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEl0ZW1zLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmFuZG9taXplQ2hhcnREYXRhJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wb2ludHMgPSBDaGFydEl0ZW0ubW9ja0RhdGEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge3RpbWVGb3JtYXR9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbG9jayBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDbG9jayc7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gMjA7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBDbG9jay5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZhbHVlLCBmb250U2l6ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJyMxNjE2MTYnO1xyXG5cdFx0XHRjdHguZm9udCA9IGBib2xkICR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcblx0XHRcdGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQodmFsdWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMCk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IE1hdGguY2VpbChjdHgubWVhc3VyZVRleHQodGhpcy52YWx1ZSkud2lkdGgpICsgMTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMueCA9IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnBvc30pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVmFsdWVDaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgQ2xvY2sucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL3ZhbHVlLWl0ZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uSXRlbSB7XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIHN0YXRpYyBjb21wb3NlKHt4LCB5LCBjb2xzLCByb3dzLCBnYXAgPSAyMCwgY3Rvcn0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjdG9yLmdlb21ldHJpYztcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KHJvd3MpLmZpbGwoQXBwLmluc3RhbmNlLmN0eCkucmVkdWNlKChyZXN1bHQsIGN0eCwgcm93KSA9PiAoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcclxuICAgICAgICAgICAgICAgIC4uLm5ldyBBcnJheShjb2xzKS5maWxsKGN0b3IpLm1hcCgoY3RvciwgY29sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2lkLCB4UG9zLCB5UG9zLCB6SW5kZXhdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQubmV4dElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4ICsgY29sICogKHdpZHRoICsgZ2FwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSArIHJvdyAqIChoZWlnaHQgKyBnYXApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocm93ICsgMSkgKiAoY29sICsgMSlcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IGN0b3Ioe2lkLCB4OiB4UG9zLCB5OiB5UG9zLCB2YWx1ZTogVmFsdWVJdGVtLnJhbmRvbVZhbHVlLCB6SW5kZXgsIGN0eH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRSYW5kb21DaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgKSwgW10pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21ib0JveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7d2lkdGggPSBDb21ib0JveC5nZW9tZXRyaWMud2lkdGgsIG1lbnVJdGVtcyA9IFtdLCB2YXJpYWJsZU5hbWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDb21ib0JveCc7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIENvbWJvQm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogdmFyaWFibGVOYW1lLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QuLi4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1lbnVJdGVtcyA9IG1lbnVJdGVtcy5tYXAoKGksIGlkeCkgPT4gKHtcclxuICAgICAgICAgICAgLi4uaSxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgeTogdGhpcy55ICsgdGhpcy5oZWlnaHQgKyBpZHggKiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZDogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB3aWR0aCAtIDIwLFxyXG4gICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZ1bGxIZWlnaHQgPSB0aGlzLmhlaWdodCArIG1lbnVJdGVtcy5sZW5ndGggKiAyMDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGZ1bGxIZWlnaHQsIG9wZW5lZCwgdmFyaWFibGU6IHt0aXRsZX0sIG1lbnVJdGVtc30sIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGJvcmRlckNvbG9yID0gJyM4MDgwODAnO1xyXG4gICAgICAgIGNvbnN0IGZvbnRDb2xvciA9ICcjMjQyNDI0JztcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2M4YzhjOCc7XHJcbiAgICAgICAgY29uc3QgaGlnaGxpZ2h0Q29sb3IgPSAnIzhkOGQ4ZCc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyAzLCBmdWxsSGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB4ICsgd2lkdGggLSBoZWlnaHQsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRpdGxlLCB4ICsgMywgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4ICsgd2lkdGggLSBoZWlnaHQsIHksIGhlaWdodCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG9wZW5lZCA/ICdcXHUyNUIyJyA6ICdcXHUyNUJDJywgeCArIHdpZHRoIC0gaGVpZ2h0IC8gMiAtIDUsIHkgKyBoZWlnaHQgLSA2KTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gbWVudUl0ZW1zLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgeVBvcyA9IHkgKyBoZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgIHRleHRZUG9zID0gKGhlaWdodCAtIGZvbnRIZWlnaHQpIC8gMiArIGZvbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDsgaSsrLCB5UG9zID0geSArIGhlaWdodCArIDEgKyBoZWlnaHQgKiBpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbWVudUl0ZW1zW2ldLmhpZ2hsaWdodGVkID8gaGlnaGxpZ2h0Q29sb3IgOiBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeVBvcywgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSwgeCArIDMsIHlQb3MgKyB0ZXh0WVBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHt4LCB5fSkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gKFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnggPiB4IHx8XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueSA+IHkgfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueCArIHRoaXMudHJpZ2dlckFyZWEud2lkdGgpIDwgeCB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS55ICsgdGhpcy50cmlnZ2VyQXJlYS5oZWlnaHQpIDwgeVxyXG4gICAgICAgICkgPyAnaW5pdGlhbCcgOiAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3gsIHl9KSB7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZURvd24oe3gsIHl9KTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA+IHggfHxcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55ID4geSB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPCB4IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPCB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLm9wZW5lZCA/IChcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcykgfHxcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApIDogKFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpIHx8XHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTWVudVNlbGVjdCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA8IHggJiZcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55IDwgeSAmJlxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPiB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5tZW51SXRlbXMuZmluZCgoe3k6IG1lbnVZLCBoZWlnaHR9KSA9PiAoXHJcbiAgICAgICAgICAgIHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgbWVudVkgPCB5ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnggKyB0aGlzLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgKG1lbnVZICsgaGVpZ2h0KSA+IHlcclxuICAgICAgICApKTtcclxuICAgICAgICB0aGlzLmhpZGVNZW51KCk7XHJcbiAgICAgICAgc2VsZWN0ZWRJdGVtICYmICh0aGlzLnNldFZhbHVlKHNlbGVjdGVkSXRlbSkgfHwgdGhpcy5yZW5kZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZU1lbnUoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBDb21ib0JveC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKHsuLi50aGlzLCAuLi57aGVpZ2h0OiB0aGlzLmZ1bGxIZWlnaHR9fSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0SXRlbXMoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgdGhpcy5tZW51SXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge3k6IGl0ZW1ZLCBoZWlnaHR9ID0gaTtcclxuICAgICAgICAgICAgaS5oaWdobGlnaHRlZCA9IHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgICAgIGl0ZW1ZIDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMueCArIHRoaXMud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh7dGl0bGUsIHZhbHVlfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy52YXJpYWJsZSwge3RpdGxlLCB2YWx1ZX0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3VwZGF0ZUxvY2FsVmFyaWFibGUnLCB7ZGV0YWlsOiB0aGlzLnZhcmlhYmxlfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KGUpIHtcclxuICAgICAgICBzd2l0Y2ggKGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1lbnVTZWxlY3QoZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCBlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb250ZXh0LW1lbnVcIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi90b29sdGlwXCI7XHJcbmltcG9ydCB7SG92ZXJ9IGZyb20gXCIuL2hvdmVyXCI7XHJcblxyXG5sZXQgX2lkID0gMDtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICB0aGlzLndpZHRoID0gMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW107XHJcbiAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9ICcnO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICcnO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgcGFyYW1zKTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gMDtcclxuICAgICAgICB0aGlzLmZpcnN0UmVuZGVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IG5leHRJZCgpIHtcclxuICAgICAgICByZXR1cm4gKF9pZCsrKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUocG9zKSB7XHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2Uuc2hvdyh7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIEhvdmVyLmluc3RhbmNlLnNob3codGhpcyk7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb25maWcgPSB0aGlzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHJldHVybiB0aGlzLmZpcnN0UmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCA9IDAsIHkgPSAwfSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB4LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKHt3aWR0aCA9IDAsIGhlaWdodCA9IDB9KSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoey4uLnRoaXMsIC4uLnt2aXNpYmxlOiBmYWxzZX19KTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArIGhlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKGNvbmZpZykge1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2Uuc2hvdyhjb25maWcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoID0gdGhpcy5pbml0aWFsSGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoNTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29udGV4dE1lbnV9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IENvbnRleHRNZW51KHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoOiBmdWxsV2lkdGgsIGhlaWdodDogZnVsbEhlaWdodCwgaW5pdGlhbFdpZHRoOiB3aWR0aCwgaW5pdGlhbEhlaWdodDogaGVpZ2h0LCBjdHhNZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgZnVsbFdpZHRoLCBmdWxsSGVpZ2h0KTtcclxuICAgICAgICBpZiAoIWN0eE1lbnVJdGVtcy5sZW5ndGgpIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweC8xIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBhcnJvd0hlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoJ1xcdTI1YjYnKTtcclxuICAgICAgICAgICAgY29uc3Qge2NvbGxlY3Rpb259ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt4LCB5LCB3aWR0aCwgdmlzaWJsZSwgY29sbGVjdGlvbn0sIHt0eXBlLCB0aXRsZSwgaGlnaGxpZ2h0ZWQsIGRpc2FibGVkID0gZmFsc2UsIGNoaWxkcmVuID0gW119LCBpZHgpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHgvbm9ybWFsIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0ge3gsIHk6IHkgKyAoZm9udEhlaWdodCArIDEwKSAqIGlkeCwgd2lkdGgsIGhlaWdodDogZm9udEhlaWdodCArIDEwfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge3gsIHksIHdpZHRoLCB2aXNpYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFyZWEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSwgdGl0bGUsIGhpZ2hsaWdodGVkLCBkaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJlYS54ICsgYXJlYS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJlYS55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2hpbGRyZW4ucmVkdWNlKENvbnRleHRNZW51LmNhbGN1bGF0ZU1heFdpZHRoLCB7Y3R4LCBtYXhXaWR0aDogMH0pLm1heFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGhpZ2hsaWdodGVkID8gJyM5MWI1YzgnIDogJyNkMGQwZDAnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhhcmVhKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZGlzYWJsZWQgPyAnIzlkOWQ5ZCcgOiAnIzE4MTgxOCc7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4L25vcm1hbCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgYXJlYS54ICsgMTAsIGFyZWEueSArIGFyZWEuaGVpZ2h0IC0gNSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHgvMSBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjViNicsIGFyZWEueCArIGFyZWEud2lkdGggLSBhcnJvd1dpZHRoIC0gMiwgYXJlYS55ICsgYXJlYS5oZWlnaHQgLyAyICsgYXJyb3dIZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICAgICAgfSwge3gsIHksIHdpZHRoLCB2aXNpYmxlOiB0cnVlLCBjb2xsZWN0aW9uOiBbXX0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4LCB5LCByaWdodCA9IDAsIGJvdHRvbSA9IDAsIGhpZ2hsaWdodGVkfSwgaXRlbSkge1xyXG4gICAgICAgIGxldCBoYXNIaWdobGlnaHRlZENoaWxkO1xyXG4gICAgICAgIGlmIChpdGVtLmhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgICh7aGlnaGxpZ2h0ZWQ6IGhhc0hpZ2hsaWdodGVkQ2hpbGQsIHJpZ2h0LCBib3R0b219ID0gaXRlbS5jaGlsZHJlbi5yZWR1Y2UoQ29udGV4dE1lbnUuZmluZEl0ZW1VbmRlclBvaW50ZXIsIHt4LCB5LCByaWdodCwgYm90dG9tfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLmhpZ2hsaWdodGVkID0gIWl0ZW0uZGlzYWJsZWQgJiYgKFxyXG4gICAgICAgICAgICBoYXNIaWdobGlnaHRlZENoaWxkIHx8IChcclxuICAgICAgICAgICAgICAgIGl0ZW0ueCA8PSB4ICYmXHJcbiAgICAgICAgICAgICAgICBpdGVtLnkgPD0geSAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW0ueCArIGl0ZW0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgcmlnaHQ6IE1hdGgubWF4KHJpZ2h0LCBpdGVtLnggKyBpdGVtLndpZHRoKSxcclxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLm1heChib3R0b20sIGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGl0ZW0uaGlnaGxpZ2h0ZWQgfHwgaGlnaGxpZ2h0ZWRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjYWxjdWxhdGVNYXhXaWR0aCh7Y3R4LCBtYXhXaWR0aH0sIHt0aXRsZX0pIHtcclxuICAgICAgICByZXR1cm4ge2N0eCwgbWF4V2lkdGg6IE1hdGguZmxvb3IoTWF0aC5tYXgobWF4V2lkdGgsIGN0eC5tZWFzdXJlVGV4dCh0aXRsZSkud2lkdGggKyAzMCkpfTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eDogY2xpY2tYLCB5OiBjbGlja1l9KSB7XHJcbiAgICAgICAgY29uc3Qge2ZvdW5kfSA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt6SW5kZXg6IGhpZ2hlc3RaSW5kZXgsIGZvdW5kfSwgaXRlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4ID0gMSwgaGlnaGxpZ2h0ZWQsIGNoaWxkcmVuID0gW119ID0gaXRlbTtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIHpJbmRleCA+IGhpZ2hlc3RaSW5kZXggJiZcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkICYmXHJcbiAgICAgICAgICAgICAgICB4IDwgY2xpY2tYICYmXHJcbiAgICAgICAgICAgICAgICB5IDwgY2xpY2tZICYmXHJcbiAgICAgICAgICAgICAgICAoeCArIHdpZHRoKSA+IGNsaWNrWCAmJlxyXG4gICAgICAgICAgICAgICAgKHkgKyBoZWlnaHQpID4gY2xpY2tZICYmIHt6SW5kZXgsIGZvdW5kOiBpdGVtfVxyXG4gICAgICAgICAgICApIHx8IGNoaWxkcmVuLnJlZHVjZShyZWN1cnNlLCB7ekluZGV4OiBoaWdoZXN0WkluZGV4LCBmb3VuZH0pO1xyXG4gICAgICAgIH0sIHt6SW5kZXg6IC0xLCBmb3VuZDogbnVsbH0pO1xyXG4gICAgICAgIGZvdW5kICYmIGZvdW5kLnR5cGUgJiYgZm91bmQudHlwZSgpO1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KHt4LCB5LCBjdHhNZW51Q29uZmlnOiBjdHhNZW51SXRlbXN9KSB7XHJcbiAgICAgICAgaWYgKCFjdHhNZW51SXRlbXMpIHJldHVybjtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4LCB5LCB6SW5kZXg6IEluZmluaXR5LCBjdHhNZW51SXRlbXN9KTtcclxuICAgICAgICAoe21heFdpZHRoOiB0aGlzLmluaXRpYWxXaWR0aCwgbWF4V2lkdGg6IHRoaXMud2lkdGh9ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShDb250ZXh0TWVudS5jYWxjdWxhdGVNYXhXaWR0aCwge2N0eDogQXBwLmluc3RhbmNlLmN0eCwgbWF4V2lkdGg6IDB9KSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaW5pdGlhbEhlaWdodCA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZSgodG90YWxIZWlnaHQsIHtoZWlnaHR9KSA9PiB0b3RhbEhlaWdodCArPSBoZWlnaHQsIDApO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5hc3NpZ25MYXN0QWN0aXZhdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7ekluZGV4OiAtMSwgY3R4TWVudUl0ZW1zOiBbXX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgd2lkdGg6IDAsIGhlaWdodDogMH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUl0ZW1zID0gQ29udGV4dE1lbnUucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEl0ZW1zKHt4LCB5fSkge1xyXG4gICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qge3JpZ2h0LCBib3R0b219ID0gdGhpcy5jdHhNZW51SXRlbXMucmVkdWNlKENvbnRleHRNZW51LmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7eCwgeSwgcmlnaHQ6IDAsIGJvdHRvbTogMH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHJpZ2h0IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gYm90dG9tIC0gdGhpcy55O1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQoey4uLnRoaXMsIC4uLnt3aWR0aCwgaGVpZ2h0LCB6SW5kZXg6IC0xfX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHt0aHJvdHRsZX0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcyA9IHtkYXRlczogW10sIHJlc3Q6IFtdfTtcclxuICAgICAgICB0aGlzLmluaXRpYXRvciA9IG51bGw7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBEYXRlUGlja2VyLmdlb21ldHJpYyk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7RGF0ZVBpY2tlcn0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgRGF0ZVBpY2tlcih7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyMDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMge3t5ZWFyOiBzdHJpbmcsIG1vbnRoOiBzdHJpbmcsIG9ic2VydmFibGVBcmVhcz86IE9iamVjdFtdLCBkYXRlczogT2JqZWN0W119fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcGVuZWQsIGNhbGVuZGFyRGF0YToge3llYXIsIG1vbnRoLCBkYXRlcyA9IFtdfSwgY3VycmVudERhdGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiB7eWVhciwgbW9udGgsIGRhdGVzfTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDZkOTknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE2cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7d2lkdGg6IG1vbnRoV2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBtb250aEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQobW9udGgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMjBweCBXZWJkaW5ncyc7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBhcnJvd0hlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoJzMnKTtcclxuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoTWF0aC5yb3VuZCh3aWR0aCAvIDIgLSBtb250aFdpZHRoIC0gYXJyb3dXaWR0aCAqIDIgLSAyMCksIDApO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge2U6IGxlZnRBcnJvd1hQb3N9ID0gY3R4LmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCczJywgMCwgYXJyb3dIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoYXJyb3dXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTZweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChtb250aCwgMCwgbW9udGhIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUobW9udGhXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcyMHB4IFdlYmRpbmdzJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnNCcsIDAsIGFycm93SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZUFyZWFzID0gW3tcclxuICAgICAgICAgICAgICAgICAgICB4OiBsZWZ0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGFycm93V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudE1vbnRoJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiByaWdodEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBhcnJvd1dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmNyZWFzZUN1cnJlbnRNb250aCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgbGV0IHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoeWVhcik7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoTWF0aC5yb3VuZCh3aWR0aCAvIDIgKyAxMCksIDApO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoeWVhciwgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGZvbnRXaWR0aCArIDUsIDApO1xyXG4gICAgICAgICAgICBjb25zdCB7ZTogeWVhclNwaW5uZXJYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTRweCBXZWJkaW5ncyc7XHJcbiAgICAgICAgICAgICh7d2lkdGg6IGZvbnRXaWR0aCwgYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGZvbnRIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KCc2JykpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJzUnLCAwLCAxNSAtIDMpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJzYnLCAwLCAxNSArIGZvbnRIZWlnaHQgKyAzKTtcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZUFyZWFzID0gW1xyXG4gICAgICAgICAgICAgICAgLi4ub2JzZXJ2YWJsZUFyZWFzLFxyXG4gICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICB4OiB5ZWFyU3Bpbm5lclhQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogZm9udFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmNyZWFzZUN1cnJlbnRZZWFyJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB5ZWFyU3Bpbm5lclhQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSArIDE1LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmb250V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNSxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudFllYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICB5ZWFyLFxyXG4gICAgICAgICAgICAgICAgbW9udGgsXHJcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlQXJlYXMsXHJcbiAgICAgICAgICAgICAgICBkYXRlczogRGF0ZVBpY2tlci5yZW5kZXJDYWxlbmRhckRhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHggKyA0LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHkgKyAzMCArIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gOCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCAtIDMwIC0gOCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRlcyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZVxyXG4gICAgICAgICAgICAgICAgfSwgY3R4KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9cclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDYWxlbmRhckRhdGEoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGEsIGN1cnJlbnREYXRlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB5KTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMThweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgbGV0IHhQb3MgPSAwLCByb3VuZGVkWFBvcyA9IDAsIHlQb3MgPSAwLCByb3VuZGVkWVBvcyA9IDAsIGNvbnRlbnRXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB7XHJcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsOiB3aWR0aCAvIDcsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogaGVpZ2h0IC8gTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8gNylcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZm9udFlQb3MgPSBNYXRoLnJvdW5kKGludGVydmFsLnZlcnRpY2FsIC8gMiArIGN0eC5tZWFzdXJlVGV4dCgnMCcpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50IC8gMikgLSAyO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZURhdGUgPSBjdXJyZW50RGF0ZS5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBcmVhID0gZGF0YS5yZWR1Y2UoKGNvbGxlY3Rpb24sIGl0ZW0sIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbSkgcmV0dXJuIFsuLi5jb2xsZWN0aW9uLCAuLi5baXRlbV1dO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge2RhdGUsIGhpZ2hsaWdodGVkfSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0N1cnJlbnRTZWxlY3RlZERhdGUgPSBjdXJyZW50RGF0ZURhdGUgPT09IGRhdGU7XHJcbiAgICAgICAgICAgICAgICB4UG9zID0gaSAlIDcgKiBpbnRlcnZhbC5ob3Jpem9udGFsO1xyXG4gICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpO1xyXG4gICAgICAgICAgICAgICAgeVBvcyA9IHhQb3MgPyB5UG9zIDogKGkgPyB5UG9zICsgaW50ZXJ2YWwudmVydGljYWwgOiB5UG9zKTtcclxuICAgICAgICAgICAgICAgIHJvdW5kZWRZUG9zID0gTWF0aC5yb3VuZCh5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGlzQ3VycmVudFNlbGVjdGVkRGF0ZSA/ICdyZWQnIDogJyMwMDNiNmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHJvdW5kZWRYUG9zLCByb3VuZGVkWVBvcywgTWF0aC5yb3VuZChpbnRlcnZhbC5ob3Jpem9udGFsKSAtIDQsIE1hdGgucm91bmQoaW50ZXJ2YWwudmVydGljYWwpIC0gNCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgICAgICAoe3dpZHRoOiBjb250ZW50V2lkdGh9ID0gY3R4Lm1lYXN1cmVUZXh0KGRhdGUpKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChkYXRlLCByb3VuZGVkWFBvcyArIE1hdGgucm91bmQoKGludGVydmFsLmhvcml6b250YWwgLSA0KSAvIDIgLSBjb250ZW50V2lkdGggLyAyKSwgcm91bmRlZFlQb3MgKyBmb250WVBvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmNvbGxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHggKyByb3VuZGVkWFBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogeSArIHJvdW5kZWRZUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogTWF0aC5yb3VuZChpbnRlcnZhbC5ob3Jpem9udGFsKSAtIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChpbnRlcnZhbC52ZXJ0aWNhbCkgLSA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWNrRGF0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB9LCBbXSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZGF0YUFyZWE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEB0aGlzIHtEYXRlUGlja2VyLnByb3RvdHlwZX0gKi9cclxuICAgIHN0YXRpYyBmaW5kSXRlbVVuZGVyUG9pbnRlcih7eDogcG9pbnRlclgsIHk6IHBvaW50ZXJZLCBjdXJzb3JUeXBlOiBsYXRlc3RLbm93bkN1cnNvclR5cGUsIHpJbmRleDogaGlnaGVzdFpJbmRleH0sIGFyZWEpIHtcclxuICAgICAgICBpZiAoIWFyZWEpIHJldHVybiB7eDogcG9pbnRlclgsIHk6IHBvaW50ZXJZLCBjdXJzb3JUeXBlOiBsYXRlc3RLbm93bkN1cnNvclR5cGUsIHpJbmRleDogaGlnaGVzdFpJbmRleH07XHJcbiAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHpJbmRleH0gPSBhcmVhO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gekluZGV4ID4gaGlnaGVzdFpJbmRleCAmJlxyXG4gICAgICAgICAgICB4IDwgcG9pbnRlclggJiZcclxuICAgICAgICAgICAgeSA8IHBvaW50ZXJZICYmXHJcbiAgICAgICAgICAgICh4ICsgd2lkdGgpID4gcG9pbnRlclggJiZcclxuICAgICAgICAgICAgKHkgKyBoZWlnaHQpID4gcG9pbnRlclk7XHJcbiAgICAgICAgYXJlYS5oaWdobGlnaHRlZCA9IG1hdGNoO1xyXG4gICAgICAgIHJldHVybiB7Li4ue3g6IHBvaW50ZXJYLCB5OiBwb2ludGVyWX0sIC4uLigobWF0Y2ggJiYgYXJlYSkgfHwge2N1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fSl9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjYWxlbmRhckJ1aWxkZXIoZGF0ZSkge1xyXG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgICBkYXRlLnNldERhdGUoMSk7XHJcbiAgICAgICAgY29uc3QgZGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgICAgICBsZXQgaWR4ID0gKGRhdGUuZ2V0RGF5KCkgKyA2KSAlIDc7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICB5ZWFyOiBkYXRlLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgICAgICAgIG1vbnRoOiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgncnUnLCB7bW9udGg6ICdsb25nJ30pXHJcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGRhdGUpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlvQsC3Rj10vLCBtYXRjaCA9PiBtYXRjaC50b1VwcGVyQ2FzZSgpKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IFtdO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgZGF0YVtpZHgrK10gPSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLmdldERhdGUoKSxcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoK2RhdGUgKyBkYXkpO1xyXG4gICAgICAgIH0gd2hpbGUgKGRhdGUuZ2V0RGF0ZSgpID4gMSk7XHJcbiAgICAgICAgcmV0dXJuIHsuLi5yZXN1bHQsIC4uLntkYXRlczogWy4uLmRhdGFdfX07XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLmNhbGVuZGFyQnVpbGRlcih0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3g6IGNsaWNrWCwgeTogY2xpY2tZfSkge1xyXG4gICAgICAgIGNvbnN0IF9maW5kID0gYXJlYSA9PiAoXHJcbiAgICAgICAgICAgIGFyZWEgJiYgYXJlYS54IDwgY2xpY2tYICYmIGFyZWEueSA8IGNsaWNrWSAmJiAoYXJlYS54ICsgYXJlYS53aWR0aCkgPiBjbGlja1ggJiYgKGFyZWEueSArIGFyZWEuaGVpZ2h0KSA+IGNsaWNrWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgYXJlYSA9IHRoaXMuY2FsZW5kYXJEYXRhLm9ic2VydmFibGVBcmVhcy5maW5kKF9maW5kKSB8fCB0aGlzLmNhbGVuZGFyRGF0YS5kYXRlcy5maW5kKF9maW5kKSB8fCB7dHlwZTogJyd9O1xyXG4gICAgICAgIHN3aXRjaCAoYXJlYS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3BpY2tEYXRlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RGF0ZShhcmVhLmRhdGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2luY3JlYXNlQ3VycmVudE1vbnRoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0TW9udGgodGhpcy5jdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVjcmVhc2VDdXJyZW50TW9udGgnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRNb250aCh0aGlzLmN1cnJlbnREYXRlLmdldE1vbnRoKCkgLSAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdpbmNyZWFzZUN1cnJlbnRZZWFyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RnVsbFllYXIodGhpcy5jdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVjcmVhc2VDdXJyZW50WWVhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldEZ1bGxZZWFyKHRoaXMuY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYXRvci5zZXREYXRlKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coe3ggPSB0aGlzLngsIHkgPSB0aGlzLnksIGluaXRpYXRvcn0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4LCB5LCB6SW5kZXg6IEluZmluaXR5LCBpbml0aWF0b3IsIG9wZW5lZDogdHJ1ZX0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudERhdGUgPSBpbml0aWF0b3IuZGF0ZSB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuYXNzaWduTGFzdEFjdGl2YXRlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge29wZW5lZDogZmFsc2UsIHpJbmRleDogLTF9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIGluaXRpYXRvcjogbnVsbH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0QXJlYXMocG9zKSB7XHJcbiAgICAgICAgKHtjdXJzb3JUeXBlOiBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvcn0gPSBbXHJcbiAgICAgICAgICAgIC4uLnRoaXMuY2FsZW5kYXJEYXRhLmRhdGVzLFxyXG4gICAgICAgICAgICAuLi50aGlzLmNhbGVuZGFyRGF0YS5vYnNlcnZhYmxlQXJlYXNcclxuICAgICAgICBdLnJlZHVjZShEYXRlUGlja2VyLmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7Li4ucG9zLCAuLi57Y3Vyc29yVHlwZTogJ2luaXRpYWwnLCB6SW5kZXg6IC0xfX0pKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRBcmVhcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtkYXRlRm9ybWF0LCB0aHJvdHRsZX0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7RGF0ZVBpY2tlcn0gZnJvbSBcIi4vZGF0ZS1waWNrZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFZGl0Qm94IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt3aWR0aCA9IEVkaXRCb3guZ2VvbWV0cmljLndpZHRoLCBpc0NhbGVuZGFyID0gZmFsc2UsIGRhdGUgPSBpc0NhbGVuZGFyID8gbmV3IERhdGUoKSA6IG51bGwsIHZhbHVlID0gaXNDYWxlbmRhciA/IGRhdGVGb3JtYXQoZGF0ZSkgOiAnJywgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0VkaXRCb3gnO1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICAgIHRoaXMuaXNDYWxlbmRhciA9IGlzQ2FsZW5kYXI7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQgPSBudWxsO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgRWRpdEJveC5nZW9tZXRyaWMsIHt3aWR0aH0pO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2YWJsZUFyZWFzID0gW1xyXG4gICAgICAgICAgICAuLi4oXHJcbiAgICAgICAgICAgICAgICBpc0NhbGVuZGFyID8gW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmb2N1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICd0ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLnggKyB0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaG93Q2FsZW5kYXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdIDogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZm9jdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAndGV4dCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZ2VvbWV0cmljKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiA5MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgdmFsdWUsIGlzQ2FsZW5kYXJ9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDIsIHkgLSAyLCB3aWR0aCArIDMsIGhlaWdodCArIDMpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjNjY2NjY2JztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZGRkZGRkJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzFkMWQxZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMywgeSArIGhlaWdodCAtIDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWlzQ2FsZW5kYXIpIHJldHVybiBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMThweC8xIGVtb2ppJztcclxuICAgICAgICAgICAgY29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCgn8J+ThicpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyM2NjY2NjYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJ/Cfk4YnLCB4ICsgd2lkdGggLSBoZWlnaHQsIHkgKyBmb250SGVpZ2h0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAdGhpcyB7RWRpdEJveC5wcm90b3R5cGV9ICovXHJcbiAgICBzdGF0aWMgZGVmaW5lQ3Vyc29yVHlwZSh7eCwgeX0pIHtcclxuICAgICAgICAoe2N1cnNvclR5cGU6IEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yfSA9IChcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMuZmluZChmdW5jdGlvbih7eCwgeSwgd2lkdGgsIGhlaWdodH0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4IDwgdGhpcy54ICYmIHkgPCB0aGlzLnkgJiYgKHggKyB3aWR0aCkgPiB0aGlzLnggJiYgKHkgKyBoZWlnaHQpID4gdGhpcy55O1xyXG4gICAgICAgICAgICB9LCB7eCwgeX0pIHx8IHtjdXJzb3JUeXBlOiAnaW5pdGlhbCd9XHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzQ2FsZW5kYXIgP1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGUobmV3IERhdGUodGhpcy5odG1sSW5wdXQ/LnZhbHVlIHx8IHRoaXMuZGF0ZSkpIDpcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmh0bWxJbnB1dD8udmFsdWUgfHwgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dCAmJiB0aGlzLmh0bWxJbnB1dC5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3gsIHl9KSB7XHJcbiAgICAgICAgY29uc3QgYXJlYSA9IHRoaXMub2JzZXJ2YWJsZUFyZWFzLmZpbmQoZnVuY3Rpb24oe3gsIHksIHdpZHRoLCBoZWlnaHR9KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4IDwgdGhpcy54ICYmIHkgPCB0aGlzLnkgJiYgKHggKyB3aWR0aCkgPiB0aGlzLnggJiYgKHkgKyBoZWlnaHQpID4gdGhpcy55O1xyXG4gICAgICAgIH0sIHt4LCB5fSk7XHJcbiAgICAgICAgaWYgKCFhcmVhKSByZXR1cm47XHJcbiAgICAgICAgc3dpdGNoIChhcmVhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnZm9jdXMnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3dDYWxlbmRhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dDYWxlbmRhcih7eCwgeX0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dDYWxlbmRhcih7eCwgeX0pIHtcclxuICAgICAgICBEYXRlUGlja2VyLmluc3RhbmNlLnNob3coe2luaXRpYXRvcjogdGhpcywgeCwgeX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvY3VzKCkge1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHtcclxuICAgICAgICAgICAgdG9wOiBBcHAuaW5zdGFuY2UuY2FudmFzLm9mZnNldFRvcCxcclxuICAgICAgICAgICAgbGVmdDogQXBwLmluc3RhbmNlLmNhbnZhcy5vZmZzZXRMZWZ0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBPYmplY3QuZW50cmllcyh7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICB0b3A6IGAke3RoaXMueSArIG9mZnNldC50b3B9cHhgLFxyXG4gICAgICAgICAgICBsZWZ0OiBgJHt0aGlzLnggKyBvZmZzZXQubGVmdH1weGAsXHJcbiAgICAgICAgICAgIHdpZHRoOiBgJHt0aGlzLmlzQ2FsZW5kYXIgPyB0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQgOiB0aGlzLndpZHRofXB4YCxcclxuICAgICAgICAgICAgZm9udDogJzE0cHggc2Fucy1zZXJpZicsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNkZGRkZGQnLFxyXG4gICAgICAgICAgICBib3JkZXI6ICdub25lJyxcclxuICAgICAgICAgICAgcGFkZGluZzogJzJweCAwJ1xyXG4gICAgICAgIH0pLm1hcChlID0+IGUuam9pbignOicpKS5qb2luKCc7JykpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LmlkID0gJ2h0bWwtaW5wdXQtZWxlbWVudCc7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQudmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5odG1sSW5wdXQpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGUoZGF0ZSA9IHRoaXMuZGF0ZSkge1xyXG4gICAgICAgIGlmICghZGF0ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IGRhdGVGb3JtYXQoZGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSA9IHRoaXMudmFsdWUpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgRWRpdEJveC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoe3R5cGUsIGtleSwgb2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAna2V5ZG93bic6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSArPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRocm90dGxlKEVkaXRCb3guZGVmaW5lQ3Vyc29yVHlwZS5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgSG92ZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SG92ZXJ9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IEhvdmVyKHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyA0LCBoZWlnaHQgKyA0KTtcclxuICAgICAgICBpZiAoIWFjdGl2ZSkgcmV0dXJuO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjZmQyOTI5JztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNvbnRleHRNZW51KCkge31cclxuXHJcbiAgICBvbkJsdXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHt9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBzaG93KHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXggPSAxfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB4IC0gMSxcclxuICAgICAgICAgICAgeTogeSAtIDEsXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCArIDIsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICsgMixcclxuICAgICAgICAgICAgekluZGV4OiB6SW5kZXggLSAxLFxyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgeTogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEhvdmVyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7aWR9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMudGV4dCA9ICcnO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UgPSBkZWJvdW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7VG9vbHRpcH0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgVG9vbHRpcCh7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRleHR9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCA1MDAsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZWE5Zic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzIzMjMyJztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHggKyAxMCwgeSArIGhlaWdodCAtIDEwKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUoKSB7fVxyXG5cclxuICAgIG9uQmx1cigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7fVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge31cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIHNob3coe3gsIHksIHRvb2x0aXBDb250ZW50fSkge1xyXG4gICAgICAgIGNvbnN0IHtjdHgsIGNhbnZhczoge3dpZHRoOiBjYW52YXNXaWR0aH19ID0gQXBwLmluc3RhbmNlO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IHthY3R1YWxCb3VuZGluZ0JveEFzY2VudDogY29udGVudEhlaWdodCwgd2lkdGg6IGNvbnRlbnRXaWR0aH0gPSBjdHgubWVhc3VyZVRleHQodG9vbHRpcENvbnRlbnQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IHggPiAoY2FudmFzV2lkdGggLSBjb250ZW50V2lkdGggLSAyMCkgPyB4IC0gY29udGVudFdpZHRoIC0gMjAgOiB4LFxyXG4gICAgICAgICAgICB5OiB5ID4gY29udGVudEhlaWdodCArIDIwID8geSAtIGNvbnRlbnRIZWlnaHQgLSAyMCA6IHksXHJcbiAgICAgICAgICAgIHdpZHRoOiBjb250ZW50V2lkdGggKyAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjb250ZW50SGVpZ2h0ICsgMjAsXHJcbiAgICAgICAgICAgIHRleHQ6IHRvb2x0aXBDb250ZW50LFxyXG4gICAgICAgICAgICB6SW5kZXg6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeDogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB5OiAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCB7dGV4dCwgekluZGV4fSA9IHRoaXM7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7dGV4dDogJycsIHpJbmRleDogLTF9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgey4uLnt4LCB5OiB5IC0gdGhpcy5oZWlnaHQsIHRleHQsIHpJbmRleH19KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBUb29sdGlwLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UodGhpcy50cmFuc2xhdGUuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7c2ludXNvaWRHZW59IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyZW5kZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnVHJlbmRlcic7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IDE7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgKj0gMS4xO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBPdXQnLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgKj0gMC45O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBSZXNldCcsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0ubWFwKCh7Y2FsbGJhY2ssIC4uLnJlc3R9KSA9PiAoe1xyXG4gICAgICAgICAgICAuLi5yZXN0LFxyXG4gICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UgPSBkZWJvdW5jZSgpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcihjb25maWcsIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0TWFyZ2luID0gMjA7XHJcbiAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIGRhdGE6IHtwb2ludHN9fSA9IGNvbmZpZztcclxuICAgICAgICBjb25zdCBjaGFydEFyZWEgPSB7XHJcbiAgICAgICAgICAgIHg6IHggKyBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICB5OiB5ICsgcGFkZGluZ1swXSxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gcGFkZGluZ1sxXSAtIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gcGFkZGluZ1swXSAtIHBhZGRpbmdbMl1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHttaW4sIG1heH0gPSBUcmVuZGVyLm5vcm1hbGl6ZVJhbmdlKHBvaW50cyk7XHJcbiAgICAgICAgY29uc3QgcmFuZ2VTY2FsZSA9IChjaGFydEFyZWEuaGVpZ2h0IC0gY2hhcnRNYXJnaW4pIC8gKG1heCAtIG1pbik7XHJcbiAgICAgICAgY29uc3QgemVyb0xldmVsID0gTWF0aC5mbG9vcigoY2hhcnRBcmVhLnkgKyBjaGFydE1hcmdpbiAvIDIpICsgbWF4ICogcmFuZ2VTY2FsZSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDEyNywgMTI3LCAxMjcsIDAuMiknO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdC5hcHBseShjdHgsIE9iamVjdC52YWx1ZXMoY2hhcnRBcmVhKSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdYQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWF9LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3TGVnZW5kKHsuLi5jb25maWcsIC4uLntcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeTogeSArIGhlaWdodCAtIDQwLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH19LCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd0RhdGEoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIHNjYWxlLCBkYXRhOiB7cG9pbnRzID0gW119LCB6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMDBmZic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHplcm9MZXZlbCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCAoLXBvaW50c1swXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzY2FsZWRWYWx1ZSA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgeFBvcyArPSBzdGVwLCBzY2FsZWRWYWx1ZSA9ICgtcG9pbnRzWysraV0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHhQb3MsIHNjYWxlZFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzdGVwID0gd2lkdGggLyBsZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFZhbHVlID0gLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICB4UG9zICs9IHN0ZXAsIHNjYWxlZFZhbHVlID0gKC1wb2ludHNbKytpXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4UG9zIC0gNCwgc2NhbGVkVmFsdWUgLSA0LCA4LCA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHhQb3MgLSA0LCBzY2FsZWRWYWx1ZSAtIDQsIDgsIDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdYQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4LCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgeFBvcyA9IHgsXHJcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSB3aWR0aCAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsV2lkdGggPSBjdHgubWVhc3VyZVRleHQocG9pbnRzWzBdLnRpbWUpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsT2Zmc2V0ID0gTWF0aC5yb3VuZChsYWJlbFdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzSW50ZXJ2YWwgPSBNYXRoLmNlaWwoKGxhYmVsV2lkdGggKyAyMCkgLyBpbnRlcnZhbCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dExhYmVsUG9zID0geFBvcyArIGxhYmVsc0ludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zICs9IGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyksXHJcbiAgICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gIShpICUgbGFiZWxzSW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBpc01ham9yVGljayA/ICcjM2MzYzNjJyA6ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhyb3VuZGVkWFBvcywgaXNNYWpvclRpY2sgPyB5ICsgaGVpZ2h0ICsgNSA6IHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhyb3VuZGVkWFBvcywgeSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTWFqb3JUaWNrKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChwb2ludHNbaV0udGltZSwgcm91bmRlZFhQb3MgLSBsYWJlbE9mZnNldCwgeSArIGhlaWdodCArIDIwKTtcclxuICAgICAgICAgICAgICAgIG5leHRMYWJlbFBvcyArPSBsYWJlbHNJbnRlcnZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WUF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRpY2tzID0gMjAsIG1ham9yVGlja3NJbnRlcnZhbCwgemVyb0xldmVsLCBzY2FsZSwgcmFuZ2VTY2FsZSwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzFhMWExYSc7XHJcbiAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gaGVpZ2h0IC8gdGlja3M7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZWN0KHggLTEwMCwgeSwgd2lkdGggKyAxMDAsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICB5UG9zID0gemVyb0xldmVsICsgTWF0aC5jZWlsKCh5ICsgaGVpZ2h0IC0gemVyb0xldmVsKSAvIGludGVydmFsKSAqIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgIHJvdW5kZWRZUG9zID0gTWF0aC5yb3VuZCh5UG9zKSxcclxuICAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcykgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMiksXHJcbiAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgaSA8IHRpY2tzO1xyXG4gICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyksXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcyApIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gTWF0aC5hYnMoeVBvcyAtIHplcm9MZXZlbCkgJSAoaW50ZXJ2YWwgKiBtYWpvclRpY2tzSW50ZXJ2YWwpIDwgaW50ZXJ2YWwgLyAyKSB7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGlzTWFqb3JUaWNrID8gJyM0MzQzNDMnIDogJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhpc01ham9yVGljayA/IHggLSA1IDogeCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGlmICghaXNNYWpvclRpY2spIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobGFiZWwsIHggLSBjdHgubWVhc3VyZVRleHQobGFiZWwpLndpZHRoIC0gMTAsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdMZWdlbmQoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtuYW1lfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMCwwLDI1NSknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQobmFtZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oLTEsIDAsIDAsIDEsIHggKyB3aWR0aCAvIDIgLSA1LCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCA0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbygyMCwgNCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCg2LCAwLCA4LCA4KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoNiwgMCwgOCwgOCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCArIHdpZHRoIC8gMiArIDUsIHkgKyBoZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMTUxNTE1JztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG5hbWUsIDAsIGZvbnRIZWlnaHQgLSAyKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVSYW5nZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKCh7bWluLCBtYXgsIG1heE5lZ2F0aXZlLCBtaW5Qb3NpdGl2ZX0sIHt2YWx1ZX0pID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWluOiBNYXRoLm1pbih2YWx1ZSwgbWluKSxcclxuICAgICAgICAgICAgICAgIG1heDogTWF0aC5tYXgodmFsdWUsIG1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICksIHtcclxuICAgICAgICAgICAgbWluOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgbWF4OiAtSW5maW5pdHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja0RhdGEoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKSAtIDEwMDAgKiAyOTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKVxyXG4gICAgICAgICAgICAuZmlsbChzdGFydFRpbWUpXHJcbiAgICAgICAgICAgIC5tYXAoKHRpbWUsIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKHRpbWUgKyAxMDAwICogaWR4KS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc2ludXNvaWRHZW4ubmV4dCgpLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja05leHREYXRhKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3RyZW5kZXJOZXh0VGljaycsIHtkZXRhaWw6IHtcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgdmFsdWU6IHNpbnVzb2lkR2VuLm5leHQoKS52YWx1ZSxcclxuICAgICAgICB9fSkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigndHJlbmRlck5leHRUaWNrJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIFRyZW5kZXIucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtkZXRhaWx9KSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMucHVzaChkZXRhaWwpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbHVlSXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7dmFsdWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdWYWx1ZUl0ZW0nO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gMDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVDb25maWcgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92ZScsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdIb3Jpem9udGFsbHknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVydGljYWxseScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eTogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEb3duJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt5OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVzaXplJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eTogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hpZGUnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5oaWRlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBWYWx1ZUl0ZW0uZ2VvbWV0cmljKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCByYW5kb21WYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAxMDApLnRvRml4ZWQoMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZpc2libGUsIHZhbHVlLCB0cmVuZCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgbGV0IHN0YWNrID0gMDtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF2aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTYxNjE2JztcclxuXHRcdFx0Y3R4LmZvbnQgPSAnYm9sZCAxMnB4IHNlcmlmJztcclxuXHRcdFx0Y29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcblx0XHRcdGlmIChhY3RpdmUpIHtcclxuXHRcdFx0XHRjdHguc2F2ZSgpO1xyXG5cdFx0XHRcdHN0YWNrKys7XHJcblx0XHRcdFx0aWYgKHRyZW5kID4gMCkge1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMDBGRjAwJztcclxuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0cmVuZCA8IDApIHtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnI2U1MDAwMCc7XHJcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFx0XHRjdHguY2xpcCgpO1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG5cdFx0XHRzdGFjayAmJiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJhbmRvbUNoYW5nZSgpIHtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMDAgKyBNYXRoLnJhbmRvbSgpICogNjAwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTW91c2VEb3duKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGV4dCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gdmFsdWUgPiB0aGlzLnZhbHVlID8gMSA6ICh2YWx1ZSA8IHRoaXMudmFsdWUgPyAtMSA6IDApO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYmxpbmsuYmluZCh0aGlzKSwgMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBibGluaygpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25WYWx1ZUNoYW5nZSgpIHtcclxuICAgICAgICB0aGlzLnNldFRleHQoVmFsdWVJdGVtLnJhbmRvbVZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVmFsdWVJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtDb2xsZWN0aW9uSXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW1cIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi9jb21wb25lbnRzL3Rvb2x0aXBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL2NvbXBvbmVudHMvdmFsdWUtaXRlbVwiO1xyXG5pbXBvcnQge0NoYXJ0SXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jaGFydC1pdGVtXCI7XHJcbmltcG9ydCB7RWRpdEJveH0gZnJvbSBcIi4vY29tcG9uZW50cy9lZGl0LWJveFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRleHQtbWVudVwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4vYXBwXCI7XHJcbmltcG9ydCB7QnV0dG9ufSBmcm9tIFwiLi9jb21wb25lbnRzL2J1dHRvblwiO1xyXG5pbXBvcnQge0NvbWJvQm94fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbWJvLWJveFwiO1xyXG5pbXBvcnQge1RyZW5kZXJ9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJlbmRlclwiO1xyXG5pbXBvcnQge0hvdmVyfSBmcm9tIFwiLi9jb21wb25lbnRzL2hvdmVyXCI7XHJcbmltcG9ydCB7Q2xvY2t9IGZyb20gXCIuL2NvbXBvbmVudHMvY2xvY2tcIjtcclxuaW1wb3J0IHtEYXRlUGlja2VyfSBmcm9tIFwiLi9jb21wb25lbnRzL2RhdGUtcGlja2VyXCI7XHJcblxyXG5jb25zdCBjaGFydENvbmZpZyA9IHtcclxuICAgIHR5cGU6ICdjb2x1bW4nLFxyXG4gICAgcGFkZGluZzogWzIwLCAyMCwgNzAsIDcwXSxcclxuICAgIHRpY2tzOiA1LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHBvaW50czogQ2hhcnRJdGVtLm1vY2tEYXRhKCksXHJcbiAgICAgICAgbWFyZ2luOiAwLjFcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHRyZW5kZXJDb25maWcgPSB7XHJcbiAgICBwYWRkaW5nOiBbMjAsIDIwLCA3MCwgNzBdLFxyXG4gICAgdGlja3M6IDIwLFxyXG4gICAgbWFqb3JUaWNrc0ludGVydmFsOiA0LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIG5hbWU6ICdzaW4oeCknLFxyXG4gICAgICAgIHBvaW50czogVHJlbmRlci5tb2NrRGF0YSgpXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBtZW51SXRlbXMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdPbmUnLFxyXG4gICAgICAgIHZhbHVlOiAxLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogJ1R3bycsXHJcbiAgICAgICAgdmFsdWU6IDIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiAnVGhyZWUnLFxyXG4gICAgICAgIHZhbHVlOiAzLFxyXG4gICAgfVxyXG5dO1xyXG5cclxuY29uc3QgYnV0dG9uQ2FsbGJhY2sgPSAoKSA9PiAoXHJcbiAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCdyYW5kb21pemVDaGFydERhdGEnKSlcclxuKTtcclxuXHJcbnNldEludGVydmFsKFRyZW5kZXIubW9ja05leHREYXRhLCAxMDAwKTtcclxuXHJcbkFwcC5pbnN0YW5jZS5jb21wb25lbnRzID0gW1xyXG4gICAgLi4uW1xyXG4gICAgICAgIG5ldyBDbG9jayh7eTogMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pXHJcbiAgICBdLFxyXG4gICAgLi4uQ29sbGVjdGlvbkl0ZW0uY29tcG9zZSh7eDogMCwgeTogMzAsIGNvbHM6IDI1LCByb3dzOiAxMiwgZ2FwOiAyMCwgY3RvcjogVmFsdWVJdGVtfSksXHJcbiAgICAuLi5bXHJcbiAgICAgICAgbmV3IEVkaXRCb3goe3g6IDAsIHk6IDYwMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBFZGl0Qm94KHt4OiAxMDAsIHk6IDYwMCwgd2lkdGg6IDEwMCwgekluZGV4OiAxLCBpc0NhbGVuZGFyOiB0cnVlLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDb21ib0JveCh7eDogMjUwLCB5OiA2MDAsIHpJbmRleDogMSwgdmFyaWFibGVOYW1lOiAnQ29tYm9ib3gxJywgbWVudUl0ZW1zLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDaGFydEl0ZW0oey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiAzMCwgd2lkdGg6IDYwMCwgaGVpZ2h0OiA0MDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9LCAuLi5jaGFydENvbmZpZ30pLFxyXG4gICAgICAgIG5ldyBCdXR0b24oe3g6IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSBCdXR0b24uZ2VvbWV0cmljLndpZHRoLCB5OiA0NTAsIHpJbmRleDogMSwgdmFsdWU6ICdSYW5kb21pemUnLCBjYWxsYmFjazogYnV0dG9uQ2FsbGJhY2ssIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IFRyZW5kZXIoey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiA0OTAsIHdpZHRoOiA2MDAsIGhlaWdodDogNDAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSwgLi4udHJlbmRlckNvbmZpZ30pLFxyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UsXHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UsXHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2UsXHJcbiAgICAgICAgRGF0ZVBpY2tlci5pbnN0YW5jZVxyXG4gICAgXVxyXG5dO1xyXG5cclxuQXBwLmluc3RhbmNlLnJlbmRlcigpO1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2UodGhyZXNob2xkID0gMTAwKSB7XHJcbiAgICBsZXQgdGltZW91dCA9IDA7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIHRocmVzaG9sZCwgYXJnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKHRocmVzaG9sZCA9IDEwMCkge1xyXG4gICAgbGV0IHRpbWVvdXQgPSB0cnVlO1xyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGltZW91dCA9IHRydWUsIHRocmVzaG9sZCk7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICB0aW1lb3V0ICYmIGZuKGFyZyk7XHJcbiAgICAgICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3Qgc2ludXNvaWRHZW4gPSAoZnVuY3Rpb24qICgpIHtcclxuICAgIGNvbnN0IHBlcmlvZCA9IE1hdGguUEkgKiAyO1xyXG4gICAgY29uc3QgcSA9IDAuNTtcclxuICAgIGxldCBfaSA9IDA7XHJcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgTWF0aC5yb3VuZChNYXRoLnNpbihfaSsrICogcSAlIHBlcmlvZCkgKiAxMDAwMCkgLyAxMDA7XHJcbn0pKCk7XHJcblxyXG5jb25zdCB0aW1lRm9ybWF0ID0gKHRpbWVGb3JtYXR0ZXIgPT4ge1xyXG4gICAgcmV0dXJuIHRpbWUgPT4gdGltZUZvcm1hdHRlci5mb3JtYXQodGltZSk7XHJcbn0pKG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydScsIHtob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnLCBzZWNvbmQ6ICcyLWRpZ2l0J30pKTtcclxuXHJcbmNvbnN0IGRhdGVGb3JtYXQgPSAoZGF0ZUZvcm1hdHRlciA9PiB7XHJcbiAgICByZXR1cm4gZGF0ZSA9PiBkYXRlRm9ybWF0dGVyLmZvcm1hdChkYXRlKTtcclxufSkobmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2VuJywge2RheTogJzItZGlnaXQnLCBtb250aDogJzItZGlnaXQnLCB5ZWFyOiAnbnVtZXJpYyd9KSk7XHJcblxyXG5leHBvcnQgeyBzaW51c29pZEdlbiwgdGltZUZvcm1hdCwgZGF0ZUZvcm1hdCB9XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9