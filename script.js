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
            ctx.save();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMvLi9hcHAuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jaGFydC1pdGVtLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvY2xvY2suanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21iby1ib3guanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL2VkaXQtYm94LmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvaG92ZXIuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy90b29sdGlwLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvdHJlbmRlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBv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LDJEQUF5Qix1REFBdUQsbUVBQWdCLENBQUMsaUJBQWlCO0FBQ2hKLFlBQVksc0RBQU0sRUFBRSxHQUFHLDJEQUF5QixHQUFHLHNFQUFzQix1RUFBdUUsbUVBQWdCLENBQUM7QUFDakssWUFBWSx5REFBTyxFQUFFLElBQUksR0FBRywyREFBeUIsd0RBQXdELG1FQUFnQixDQUFDLG1CQUFtQjtBQUNqSixRQUFRLGlFQUFnQjtBQUN4QixRQUFRLDhEQUFjO0FBQ3RCLFFBQVEsMEVBQW9CO0FBQzVCLFFBQVEseUVBQW1CO0FBQzNCO0FBQ0E7O0FBRUEscURBQW1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0VaO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUMsaUNBQWlDLHNEQUFzRDs7QUFFeEY7QUFDQTtBQUNBLENBQUMsaUNBQWlDLGtEQUFrRDs7QUFFdEM7Ozs7Ozs7VUNoQzlDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanM/YzUzMTM3ZWE4MDdkYTM0ZTQ3MTciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIHtDb21wb25lbnRbXX0gKi9cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjMjIyMjIyJztcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnIzdhZmZkMSc7XHJcbiAgICAgICAgdGhpcy5jdHguZm9udCA9ICcxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgIHRoaXMubGFzdEhvdmVyZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgQXBwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvbkNvbnRleHRNZW51KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge0NvbXBvbmVudFtdfSBjb21wb25lbnRzICovXHJcbiAgICBzZXQgY29tcG9uZW50cyhjb21wb25lbnRzKSB7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIGdldCBjb21wb25lbnRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRocm90dGxlKCkuYmluZCh1bmRlZmluZWQsIHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSkpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgQXBwLm9uQ29udGV4dE1lbnUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoKGUpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5kaXNwYXRjaEV2ZW50KGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxpc3RlbihldmVudFR5cGUsIGhhbmRsZXIpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgdW5saXN0ZW4oZXZlbnRUeXBlLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgJiYgdGhpcy5sYXN0QWN0aXZhdGVkLm9uTW91c2VVcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3Qge29mZnNldFg6IHgsIG9mZnNldFk6IHksIGJ1dHRvbn0gPSBlO1xyXG4gICAgICAgIGxldCB0b3BNb3N0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCB6SW5kZXggPSAtMSwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS56SW5kZXggPiB6SW5kZXggJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueCArIGl0ZW1zW2ldLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueSArIGl0ZW1zW2ldLmhlaWdodCkgPiB5XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdCA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgekluZGV4ID0gdG9wTW9zdC56SW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgIU9iamVjdC5pcyh0b3BNb3N0LCB0aGlzLmxhc3RBY3RpdmF0ZWQpICYmXHJcbiAgICAgICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkLm9uQmx1cigpO1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCA9IHRvcE1vc3Q7XHJcbiAgICAgICAgdG9wTW9zdCAmJiAoXHJcbiAgICAgICAgICAgIGJ1dHRvbiA9PT0gMiA/XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0Lm9uQ29udGV4dE1lbnUoe3gsIHl9KSA6IHRvcE1vc3Qub25Nb3VzZURvd24oe3gsIHl9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU1vdmUoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgbGV0IHRvcE1vc3Q7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIHpJbmRleCA9IC0xLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnpJbmRleCA+IHpJbmRleCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS55ICsgaXRlbXNbaV0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0ID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICB6SW5kZXggPSB0b3BNb3N0LnpJbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAhT2JqZWN0LmlzKHRvcE1vc3QsIHRoaXMubGFzdEhvdmVyZWQpICYmXHJcbiAgICAgICAgICAgIHRoaXMubGFzdEhvdmVyZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhvdmVyZWQub25Nb3VzZU91dCgpO1xyXG4gICAgICAgIHRoaXMubGFzdEhvdmVyZWQgPSB0b3BNb3N0O1xyXG4gICAgICAgIHRvcE1vc3QgJiYgdG9wTW9zdC5vbk1vdXNlT3Zlcih7eCwgeX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbkxhc3RBY3RpdmF0ZWQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwYWludEFmZmVjdGVkKHtpZCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4fSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLmlkICE9PSBpZCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPj0geSAmJiBpdGVtc1tpXS55IDw9ICh5ICsgaGVpZ2h0KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDw9IHkgJiYgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID49IHlcclxuICAgICAgICAgICAgICAgICAgICApICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA+PSB4ICYmIGl0ZW1zW2ldLnggPD0gKHggKyB3aWR0aCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8PSB4ICYmIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID49IHhcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt2YWx1ZT0gJ0FwcGx5JywgY2FsbGJhY2sgPSAoKSA9PiB7fSwgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0J1dHRvbic7XHJcbiAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSAxMjtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBCdXR0b24uZ2VvbWV0cmljLCB7d2lkdGg6IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggKyAyMH0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgdGhpcy54ICs9IEJ1dHRvbi5nZW9tZXRyaWMud2lkdGggLSB0aGlzLndpZHRoIC0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgZm9udFNpemUsIHByZXNzZWQsIHJhZGl1cyA9IDN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDMsIHkgLSAzLCB3aWR0aCArIDksIGhlaWdodCArIDkpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2EyYTJhMic7XHJcbiAgICAgICAgICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjYjFiMWIxJztcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDEyNywxMjcsMTI3LDAuNyknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0LCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cywgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHgsIHksIHggKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgMiwgeSArIDIgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMiwgeSArIDIgKyByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyY1RvKHggKyAyLCB5ICsgMiwgeCArIDIgKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyAyICsgd2lkdGggLSByYWRpdXMsIHkgKyAyKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzUzNTM1JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAxMCwgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bigpO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEJ1dHRvbi5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDaGFydEl0ZW0nO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuZGF0YURyYXdBcmVhTWFwID0gW107XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zZXRTY2FsZS5iaW5kKHRoaXMsIDEuMSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIE91dCcsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnNldFNjYWxlLmJpbmQodGhpcywgMC45KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNldFNjYWxlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKGNvbmZpZywgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgY2hhcnRNYXJnaW4gPSAyMDtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgZGF0YToge3BvaW50c319ID0gY29uZmlnO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0QXJlYSA9IHtcclxuICAgICAgICAgICAgeDogeCArIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIHk6IHkgKyBwYWRkaW5nWzBdLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggLSBwYWRkaW5nWzFdIC0gcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSBwYWRkaW5nWzBdIC0gcGFkZGluZ1syXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qge21pbiwgbWF4fSA9IENoYXJ0SXRlbS5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhjaGFydEFyZWEpKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIENoYXJ0SXRlbS5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBDaGFydEl0ZW0uZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIHJldHVybiBDaGFydEl0ZW0uZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3RGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgc2NhbGUsIGRhdGE6IHtwb2ludHMgPSBbXSwgbWFyZ2luID0gMC4yfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgZGF0YURyYXdBcmVhTWFwID0gWy4uLnBvaW50c107XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBiYXJXaWR0aCA9IHN0ZXAgKiAoMSAtIG1hcmdpbiksXHJcbiAgICAgICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSBzdGVwIC8gMiAtIGJhcldpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3R5bGUgPSBwb2ludHNbaV0udmFsdWUgPiAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHBvaW50c1tpXS5oaWdobGlnaHRlZCA/ICcjODEwMDAwJyA6ICcjZmYwMDAwJyk7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCkge1xyXG4gICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gcG9pbnRzW2ldLnZhbHVlID4gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAocG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyM4MTAwMDAnIDogJyNmZjAwMDAnKTtcclxuICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGU7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHhQb3MsIDAsIGJhcldpZHRoLCAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlKTtcclxuICAgICAgICAgICAgICAgIGRhdGFEcmF3QXJlYU1hcFtpXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi5kYXRhRHJhd0FyZWFNYXBbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4UG9zICsgeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5taW4oemVyb0xldmVsLCB6ZXJvTGV2ZWwgKyBiYXJIZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFyV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhRHJhd0FyZWFNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WEF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSArIGhlaWdodCArIDUpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoICAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSB4ICsgc3RlcCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKTtcclxuICAgICAgICAgICAgICAgICBpIDwgcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCwgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHJvdW5kZWRYUG9zLCB5ICsgaGVpZ2h0ICsgNSk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHJvdW5kZWRYUG9zLCB5KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHJvdW5kZWRYUG9zICsgNSwgeSArIGhlaWdodCArIGN0eC5tZWFzdXJlVGV4dChwb2ludHNbaV0uY2F0ZWdvcnkpLndpZHRoICsgNSlcclxuICAgICAgICAgICAgICAgICAgICBjdHgucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHBvaW50c1tpXS5jYXRlZ29yeSwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdZQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgdGlja3MgPSA1LCB6ZXJvTGV2ZWwsIHNjYWxlLCByYW5nZVNjYWxlLCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxYTFhMWEnO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5mbG9vcihoZWlnaHQgLyB0aWNrcyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICB5UG9zID0geSArIGhlaWdodCAtIE1hdGguYWJzKHplcm9MZXZlbCAtIHkgLSBoZWlnaHQpICUgaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zKSAvIHJhbmdlU2NhbGUgLyBzY2FsZSkudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICAgICBpIDwgdGlja3M7XHJcbiAgICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICBpKyssIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zICkgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCAtIDUsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxhYmVsLCB4IC0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aCAtIDEwLCB5UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG5vcm1hbGl6ZVJhbmdlKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoKHttaW4sIG1heCwgbWF4TmVnYXRpdmUsIG1pblBvc2l0aXZlfSwge3ZhbHVlfSkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtaW46IE1hdGgubWluKHZhbHVlLCBtaW4pLFxyXG4gICAgICAgICAgICAgICAgbWF4OiBNYXRoLm1heCh2YWx1ZSwgbWF4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKSwge1xyXG4gICAgICAgICAgICBtaW46IEluZmluaXR5LFxyXG4gICAgICAgICAgICBtYXg6IC1JbmZpbml0eVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtb2NrRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKS5maWxsKFsxLCAtMV0pLm1hcCgoYmksIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogYENhdGVnb3J5JHtpZHggKyAxfWAsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAqIGJpW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSldKSAvIDEwMCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigncmFuZG9taXplQ2hhcnREYXRhJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEucG9pbnRzID0gQ2hhcnRJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldFNjYWxlKCkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlKHNjYWxlID0gMSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgKj0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7eCwgeX0pIHtcclxuICAgICAgICBsZXQgaGlnaGxpZ2h0ZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICBzdXBlci5vbk1vdXNlT3V0KCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7eDogaXRlbVgsIHk6IGl0ZW1ZLCB3aWR0aCwgaGVpZ2h0fSA9IGk7XHJcbiAgICAgICAgICAgIGkuaGlnaGxpZ2h0ZWQgPSBpdGVtWCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtWSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1YICsgd2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgICAgIGlmIChpLmhpZ2hsaWdodGVkKSBoaWdobGlnaHRlZCA9IGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBpZiAoaGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9IGhpZ2hsaWdodGVkLnZhbHVlO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ue3gsIHl9fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHt0eXBlLCBvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEl0ZW1zLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmFuZG9taXplQ2hhcnREYXRhJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wb2ludHMgPSBDaGFydEl0ZW0ubW9ja0RhdGEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge3RpbWVGb3JtYXR9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbG9jayBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDbG9jayc7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gMjA7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBDbG9jay5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZhbHVlLCBmb250U2l6ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJyMxNjE2MTYnO1xyXG5cdFx0XHRjdHguZm9udCA9IGBib2xkICR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcblx0XHRcdGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQodmFsdWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMCk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IE1hdGguY2VpbChjdHgubWVhc3VyZVRleHQodGhpcy52YWx1ZSkud2lkdGgpICsgMTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMueCA9IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnBvc30pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVmFsdWVDaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgQ2xvY2sucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL3ZhbHVlLWl0ZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uSXRlbSB7XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIHN0YXRpYyBjb21wb3NlKHt4LCB5LCBjb2xzLCByb3dzLCBnYXAgPSAyMCwgY3Rvcn0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjdG9yLmdlb21ldHJpYztcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KHJvd3MpLmZpbGwoQXBwLmluc3RhbmNlLmN0eCkucmVkdWNlKChyZXN1bHQsIGN0eCwgcm93KSA9PiAoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcclxuICAgICAgICAgICAgICAgIC4uLm5ldyBBcnJheShjb2xzKS5maWxsKGN0b3IpLm1hcCgoY3RvciwgY29sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2lkLCB4UG9zLCB5UG9zLCB6SW5kZXhdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQubmV4dElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4ICsgY29sICogKHdpZHRoICsgZ2FwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSArIHJvdyAqIChoZWlnaHQgKyBnYXApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocm93ICsgMSkgKiAoY29sICsgMSlcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IGN0b3Ioe2lkLCB4OiB4UG9zLCB5OiB5UG9zLCB2YWx1ZTogVmFsdWVJdGVtLnJhbmRvbVZhbHVlLCB6SW5kZXgsIGN0eH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRSYW5kb21DaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgKSwgW10pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21ib0JveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7d2lkdGggPSBDb21ib0JveC5nZW9tZXRyaWMud2lkdGgsIG1lbnVJdGVtcyA9IFtdLCB2YXJpYWJsZU5hbWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDb21ib0JveCc7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIENvbWJvQm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogdmFyaWFibGVOYW1lLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QuLi4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1lbnVJdGVtcyA9IG1lbnVJdGVtcy5tYXAoKGksIGlkeCkgPT4gKHtcclxuICAgICAgICAgICAgLi4uaSxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgeTogdGhpcy55ICsgdGhpcy5oZWlnaHQgKyBpZHggKiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZDogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB3aWR0aCAtIDIwLFxyXG4gICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZ1bGxIZWlnaHQgPSB0aGlzLmhlaWdodCArIG1lbnVJdGVtcy5sZW5ndGggKiAyMDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGZ1bGxIZWlnaHQsIG9wZW5lZCwgdmFyaWFibGU6IHt0aXRsZX0sIG1lbnVJdGVtc30sIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGJvcmRlckNvbG9yID0gJyM4MDgwODAnO1xyXG4gICAgICAgIGNvbnN0IGZvbnRDb2xvciA9ICcjMjQyNDI0JztcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2M4YzhjOCc7XHJcbiAgICAgICAgY29uc3QgaGlnaGxpZ2h0Q29sb3IgPSAnIzhkOGQ4ZCc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyAzLCBmdWxsSGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB4ICsgd2lkdGggLSBoZWlnaHQsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRpdGxlLCB4ICsgMywgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4ICsgd2lkdGggLSBoZWlnaHQsIHksIGhlaWdodCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG9wZW5lZCA/ICdcXHUyNUIyJyA6ICdcXHUyNUJDJywgeCArIHdpZHRoIC0gaGVpZ2h0IC8gMiAtIDUsIHkgKyBoZWlnaHQgLSA2KTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gbWVudUl0ZW1zLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgeVBvcyA9IHkgKyBoZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgIHRleHRZUG9zID0gKGhlaWdodCAtIGZvbnRIZWlnaHQpIC8gMiArIGZvbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDsgaSsrLCB5UG9zID0geSArIGhlaWdodCArIDEgKyBoZWlnaHQgKiBpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbWVudUl0ZW1zW2ldLmhpZ2hsaWdodGVkID8gaGlnaGxpZ2h0Q29sb3IgOiBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeVBvcywgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSwgeCArIDMsIHlQb3MgKyB0ZXh0WVBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHt4LCB5fSkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gKFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnggPiB4IHx8XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueSA+IHkgfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueCArIHRoaXMudHJpZ2dlckFyZWEud2lkdGgpIDwgeCB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS55ICsgdGhpcy50cmlnZ2VyQXJlYS5oZWlnaHQpIDwgeVxyXG4gICAgICAgICkgPyAnaW5pdGlhbCcgOiAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3gsIHl9KSB7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZURvd24oe3gsIHl9KTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA+IHggfHxcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55ID4geSB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPCB4IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPCB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLm9wZW5lZCA/IChcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcykgfHxcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApIDogKFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpIHx8XHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTWVudVNlbGVjdCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA8IHggJiZcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55IDwgeSAmJlxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPiB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5tZW51SXRlbXMuZmluZCgoe3k6IG1lbnVZLCBoZWlnaHR9KSA9PiAoXHJcbiAgICAgICAgICAgIHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgbWVudVkgPCB5ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnggKyB0aGlzLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgKG1lbnVZICsgaGVpZ2h0KSA+IHlcclxuICAgICAgICApKTtcclxuICAgICAgICB0aGlzLmhpZGVNZW51KCk7XHJcbiAgICAgICAgc2VsZWN0ZWRJdGVtICYmICh0aGlzLnNldFZhbHVlKHNlbGVjdGVkSXRlbSkgfHwgdGhpcy5yZW5kZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZU1lbnUoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBDb21ib0JveC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKHsuLi50aGlzLCAuLi57aGVpZ2h0OiB0aGlzLmZ1bGxIZWlnaHR9fSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0SXRlbXMoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgdGhpcy5tZW51SXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge3k6IGl0ZW1ZLCBoZWlnaHR9ID0gaTtcclxuICAgICAgICAgICAgaS5oaWdobGlnaHRlZCA9IHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgICAgIGl0ZW1ZIDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMueCArIHRoaXMud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh7dGl0bGUsIHZhbHVlfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy52YXJpYWJsZSwge3RpdGxlLCB2YWx1ZX0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3VwZGF0ZUxvY2FsVmFyaWFibGUnLCB7ZGV0YWlsOiB0aGlzLnZhcmlhYmxlfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KGUpIHtcclxuICAgICAgICBzd2l0Y2ggKGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1lbnVTZWxlY3QoZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCBlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb250ZXh0LW1lbnVcIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi90b29sdGlwXCI7XHJcbmltcG9ydCB7SG92ZXJ9IGZyb20gXCIuL2hvdmVyXCI7XHJcblxyXG5sZXQgX2lkID0gMDtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICB0aGlzLndpZHRoID0gMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW107XHJcbiAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9ICcnO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICcnO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgcGFyYW1zKTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gMDtcclxuICAgICAgICB0aGlzLmZpcnN0UmVuZGVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IG5leHRJZCgpIHtcclxuICAgICAgICByZXR1cm4gKF9pZCsrKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUocG9zKSB7XHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2Uuc2hvdyh7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIEhvdmVyLmluc3RhbmNlLnNob3codGhpcyk7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb25maWcgPSB0aGlzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHJldHVybiB0aGlzLmZpcnN0UmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCA9IDAsIHkgPSAwfSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB4LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKHt3aWR0aCA9IDAsIGhlaWdodCA9IDB9KSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoey4uLnRoaXMsIC4uLnt2aXNpYmxlOiBmYWxzZX19KTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArIGhlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKGNvbmZpZykge1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2Uuc2hvdyhjb25maWcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoID0gdGhpcy5pbml0aWFsSGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoNTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29udGV4dE1lbnV9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IENvbnRleHRNZW51KHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoOiBmdWxsV2lkdGgsIGhlaWdodDogZnVsbEhlaWdodCwgaW5pdGlhbFdpZHRoOiB3aWR0aCwgaW5pdGlhbEhlaWdodDogaGVpZ2h0LCBjdHhNZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgZnVsbFdpZHRoLCBmdWxsSGVpZ2h0KTtcclxuICAgICAgICBpZiAoIWN0eE1lbnVJdGVtcy5sZW5ndGgpIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweC8xIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBhcnJvd0hlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoJ1xcdTI1YjYnKTtcclxuICAgICAgICAgICAgY29uc3Qge2NvbGxlY3Rpb259ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt4LCB5LCB3aWR0aCwgdmlzaWJsZSwgY29sbGVjdGlvbn0sIHt0eXBlLCB0aXRsZSwgaGlnaGxpZ2h0ZWQsIGRpc2FibGVkID0gZmFsc2UsIGNoaWxkcmVuID0gW119LCBpZHgpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHgvbm9ybWFsIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0ge3gsIHk6IHkgKyAoZm9udEhlaWdodCArIDEwKSAqIGlkeCwgd2lkdGgsIGhlaWdodDogZm9udEhlaWdodCArIDEwfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge3gsIHksIHdpZHRoLCB2aXNpYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFyZWEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSwgdGl0bGUsIGhpZ2hsaWdodGVkLCBkaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJlYS54ICsgYXJlYS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJlYS55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2hpbGRyZW4ucmVkdWNlKENvbnRleHRNZW51LmNhbGN1bGF0ZU1heFdpZHRoLCB7Y3R4LCBtYXhXaWR0aDogMH0pLm1heFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGhpZ2hsaWdodGVkID8gJyM5MWI1YzgnIDogJyNkMGQwZDAnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhhcmVhKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZGlzYWJsZWQgPyAnIzlkOWQ5ZCcgOiAnIzE4MTgxOCc7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4L25vcm1hbCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgYXJlYS54ICsgMTAsIGFyZWEueSArIGFyZWEuaGVpZ2h0IC0gNSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHgvMSBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjViNicsIGFyZWEueCArIGFyZWEud2lkdGggLSBhcnJvd1dpZHRoIC0gMiwgYXJlYS55ICsgYXJlYS5oZWlnaHQgLyAyICsgYXJyb3dIZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICAgICAgfSwge3gsIHksIHdpZHRoLCB2aXNpYmxlOiB0cnVlLCBjb2xsZWN0aW9uOiBbXX0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4LCB5LCByaWdodCA9IDAsIGJvdHRvbSA9IDAsIGhpZ2hsaWdodGVkfSwgaXRlbSkge1xyXG4gICAgICAgIGxldCBoYXNIaWdobGlnaHRlZENoaWxkO1xyXG4gICAgICAgIGlmIChpdGVtLmhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgICh7aGlnaGxpZ2h0ZWQ6IGhhc0hpZ2hsaWdodGVkQ2hpbGQsIHJpZ2h0LCBib3R0b219ID0gaXRlbS5jaGlsZHJlbi5yZWR1Y2UoQ29udGV4dE1lbnUuZmluZEl0ZW1VbmRlclBvaW50ZXIsIHt4LCB5LCByaWdodCwgYm90dG9tfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLmhpZ2hsaWdodGVkID0gIWl0ZW0uZGlzYWJsZWQgJiYgKFxyXG4gICAgICAgICAgICBoYXNIaWdobGlnaHRlZENoaWxkIHx8IChcclxuICAgICAgICAgICAgICAgIGl0ZW0ueCA8PSB4ICYmXHJcbiAgICAgICAgICAgICAgICBpdGVtLnkgPD0geSAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW0ueCArIGl0ZW0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgcmlnaHQ6IE1hdGgubWF4KHJpZ2h0LCBpdGVtLnggKyBpdGVtLndpZHRoKSxcclxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLm1heChib3R0b20sIGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGl0ZW0uaGlnaGxpZ2h0ZWQgfHwgaGlnaGxpZ2h0ZWRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjYWxjdWxhdGVNYXhXaWR0aCh7Y3R4LCBtYXhXaWR0aH0sIHt0aXRsZX0pIHtcclxuICAgICAgICByZXR1cm4ge2N0eCwgbWF4V2lkdGg6IE1hdGguZmxvb3IoTWF0aC5tYXgobWF4V2lkdGgsIGN0eC5tZWFzdXJlVGV4dCh0aXRsZSkud2lkdGggKyAzMCkpfTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eDogY2xpY2tYLCB5OiBjbGlja1l9KSB7XHJcbiAgICAgICAgY29uc3Qge2ZvdW5kfSA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt6SW5kZXg6IGhpZ2hlc3RaSW5kZXgsIGZvdW5kfSwgaXRlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4ID0gMSwgaGlnaGxpZ2h0ZWQsIGNoaWxkcmVuID0gW119ID0gaXRlbTtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIHpJbmRleCA+IGhpZ2hlc3RaSW5kZXggJiZcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkICYmXHJcbiAgICAgICAgICAgICAgICB4IDwgY2xpY2tYICYmXHJcbiAgICAgICAgICAgICAgICB5IDwgY2xpY2tZICYmXHJcbiAgICAgICAgICAgICAgICAoeCArIHdpZHRoKSA+IGNsaWNrWCAmJlxyXG4gICAgICAgICAgICAgICAgKHkgKyBoZWlnaHQpID4gY2xpY2tZICYmIHt6SW5kZXgsIGZvdW5kOiBpdGVtfVxyXG4gICAgICAgICAgICApIHx8IGNoaWxkcmVuLnJlZHVjZShyZWN1cnNlLCB7ekluZGV4OiBoaWdoZXN0WkluZGV4LCBmb3VuZH0pO1xyXG4gICAgICAgIH0sIHt6SW5kZXg6IC0xLCBmb3VuZDogbnVsbH0pO1xyXG4gICAgICAgIGZvdW5kICYmIGZvdW5kLnR5cGUgJiYgZm91bmQudHlwZSgpO1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KHt4LCB5LCBjdHhNZW51Q29uZmlnOiBjdHhNZW51SXRlbXN9KSB7XHJcbiAgICAgICAgaWYgKCFjdHhNZW51SXRlbXMpIHJldHVybjtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4LCB5LCB6SW5kZXg6IEluZmluaXR5LCBjdHhNZW51SXRlbXN9KTtcclxuICAgICAgICAoe21heFdpZHRoOiB0aGlzLmluaXRpYWxXaWR0aCwgbWF4V2lkdGg6IHRoaXMud2lkdGh9ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShDb250ZXh0TWVudS5jYWxjdWxhdGVNYXhXaWR0aCwge2N0eDogQXBwLmluc3RhbmNlLmN0eCwgbWF4V2lkdGg6IDB9KSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaW5pdGlhbEhlaWdodCA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZSgodG90YWxIZWlnaHQsIHtoZWlnaHR9KSA9PiB0b3RhbEhlaWdodCArPSBoZWlnaHQsIDApO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5hc3NpZ25MYXN0QWN0aXZhdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7ekluZGV4OiAtMSwgY3R4TWVudUl0ZW1zOiBbXX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgd2lkdGg6IDAsIGhlaWdodDogMH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUl0ZW1zID0gQ29udGV4dE1lbnUucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEl0ZW1zKHt4LCB5fSkge1xyXG4gICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qge3JpZ2h0LCBib3R0b219ID0gdGhpcy5jdHhNZW51SXRlbXMucmVkdWNlKENvbnRleHRNZW51LmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7eCwgeSwgcmlnaHQ6IDAsIGJvdHRvbTogMH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHJpZ2h0IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gYm90dG9tIC0gdGhpcy55O1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQoey4uLnRoaXMsIC4uLnt3aWR0aCwgaGVpZ2h0LCB6SW5kZXg6IC0xfX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHt0aHJvdHRsZX0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcyA9IHtkYXRlczogW10sIHJlc3Q6IFtdfTtcclxuICAgICAgICB0aGlzLmluaXRpYXRvciA9IG51bGw7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBEYXRlUGlja2VyLmdlb21ldHJpYyk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7RGF0ZVBpY2tlcn0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgRGF0ZVBpY2tlcih7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyNDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMge3t5ZWFyOiBzdHJpbmcsIG1vbnRoOiBzdHJpbmcsIG9ic2VydmFibGVBcmVhcz86IE9iamVjdFtdLCBkYXRlczogT2JqZWN0W119fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcGVuZWQsIGNhbGVuZGFyRGF0YToge3llYXIsIG1vbnRoLCBkYXRlcyA9IFtdfSwgY3VycmVudERhdGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiB7eWVhciwgbW9udGgsIGRhdGVzfTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDZkOTknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE2cHgvMSBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgbGV0IHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQobW9udGgpO1xyXG4gICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGh9ID0gY3R4Lm1lYXN1cmVUZXh0KCdcXHUyNUIyJyk7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKDEwLCA4KTtcclxuICAgICAgICAgICAgICAgIGxldCB7ZTogbGVmdEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoJ1xcdTI1QzAnLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKGFycm93V2lkdGggKyAxMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQobW9udGgsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoZm9udFdpZHRoICsgMTAsIDApO1xyXG4gICAgICAgICAgICAgICAgbGV0IHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoJ1xcdTI1QjYnLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZUFyZWFzID0gW3tcclxuICAgICAgICAgICAgICAgICAgICB4OiBsZWZ0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGFycm93V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudE1vbnRoJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiByaWdodEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBhcnJvd1dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmNyZWFzZUN1cnJlbnRNb250aCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgKHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoeWVhcikpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHggKyB3aWR0aCAtIGZvbnRXaWR0aCAtIGFycm93V2lkdGggKiAyIC0gMzAsIHkgKyA4KTtcclxuICAgICAgICAgICAgKHtlOiBsZWZ0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjVDMCcsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShhcnJvd1dpZHRoICsgMTAsIDApO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoeWVhciwgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGZvbnRXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgKHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCkpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJ1xcdTI1QjYnLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgIG9ic2VydmFibGVBcmVhcyA9IFtcclxuICAgICAgICAgICAgICAgIC4uLm9ic2VydmFibGVBcmVhcyxcclxuICAgICAgICAgICAgICAgIC4uLlt7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogbGVmdEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmb250V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudFllYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHJpZ2h0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGZvbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5jcmVhc2VDdXJyZW50WWVhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgIHllYXIsXHJcbiAgICAgICAgICAgICAgICBtb250aCxcclxuICAgICAgICAgICAgICAgIG9ic2VydmFibGVBcmVhcyxcclxuICAgICAgICAgICAgICAgIGRhdGVzOiBEYXRlUGlja2VyLnJlbmRlckNhbGVuZGFyRGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogeCArIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSArIDQwICsgNCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggLSA4LFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gNDAgLSA4LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnREYXRlXHJcbiAgICAgICAgICAgICAgICB9LCBjdHgpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMgT2JqZWN0W11cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlckNhbGVuZGFyRGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YSwgY3VycmVudERhdGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxOHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBsZXQgeFBvcyA9IDAsIHJvdW5kZWRYUG9zID0gMCwgeVBvcyA9IDAsIHJvdW5kZWRZUG9zID0gMCwgY29udGVudFdpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHtcclxuICAgICAgICAgICAgICAgIGhvcml6b250YWw6IHdpZHRoIC8gNyxcclxuICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBoZWlnaHQgLyBNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyA3KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBmb250WVBvcyA9IE1hdGgucm91bmQoaW50ZXJ2YWwudmVydGljYWwgLyAyICsgY3R4Lm1lYXN1cmVUZXh0KCcwJykuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQgLyAyKSAtIDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnREYXRlRGF0ZSA9IGN1cnJlbnREYXRlLmdldERhdGUoKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YUFyZWEgPSBkYXRhLnJlZHVjZSgoY29sbGVjdGlvbiwgaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gWy4uLmNvbGxlY3Rpb24sIC4uLltpdGVtXV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7ZGF0ZSwgaGlnaGxpZ2h0ZWR9ID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ3VycmVudFNlbGVjdGVkRGF0ZSA9IGN1cnJlbnREYXRlRGF0ZSA9PT0gZGF0ZTtcclxuICAgICAgICAgICAgICAgIHhQb3MgPSBpICUgNyAqIGludGVydmFsLmhvcml6b250YWw7XHJcbiAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyk7XHJcbiAgICAgICAgICAgICAgICB5UG9zID0geFBvcyA/IHlQb3MgOiAoaSA/IHlQb3MgKyBpbnRlcnZhbC52ZXJ0aWNhbCA6IHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgcm91bmRlZFlQb3MgPSBNYXRoLnJvdW5kKHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gaXNDdXJyZW50U2VsZWN0ZWREYXRlID8gJ3JlZCcgOiAnIzAwM2I2ZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3Qocm91bmRlZFhQb3MsIHJvdW5kZWRZUG9zLCBNYXRoLnJvdW5kKGludGVydmFsLmhvcml6b250YWwpIC0gNCwgTWF0aC5yb3VuZChpbnRlcnZhbC52ZXJ0aWNhbCkgLSA0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgICAgICh7d2lkdGg6IGNvbnRlbnRXaWR0aH0gPSBjdHgubWVhc3VyZVRleHQoZGF0ZSkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGRhdGUsIHJvdW5kZWRYUG9zICsgTWF0aC5yb3VuZCgoaW50ZXJ2YWwuaG9yaXpvbnRhbCAtIDQpIC8gMiAtIGNvbnRlbnRXaWR0aCAvIDIpLCByb3VuZGVkWVBvcyArIGZvbnRZUG9zKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAuLi5be1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogeCArIHJvdW5kZWRYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB5ICsgcm91bmRlZFlQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKGludGVydmFsLmhvcml6b250YWwpIC0gNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGludGVydmFsLnZlcnRpY2FsKSAtIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpY2tEYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIH0sIFtdKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhQXJlYTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHRoaXMge0RhdGVQaWNrZXIucHJvdG90eXBlfSAqL1xyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4OiBwb2ludGVyWCwgeTogcG9pbnRlclksIGN1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fSwgYXJlYSkge1xyXG4gICAgICAgIGlmICghYXJlYSkgcmV0dXJuIHt4OiBwb2ludGVyWCwgeTogcG9pbnRlclksIGN1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fTtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4fSA9IGFyZWE7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB6SW5kZXggPiBoaWdoZXN0WkluZGV4ICYmXHJcbiAgICAgICAgICAgIHggPCBwb2ludGVyWCAmJlxyXG4gICAgICAgICAgICB5IDwgcG9pbnRlclkgJiZcclxuICAgICAgICAgICAgKHggKyB3aWR0aCkgPiBwb2ludGVyWCAmJlxyXG4gICAgICAgICAgICAoeSArIGhlaWdodCkgPiBwb2ludGVyWTtcclxuICAgICAgICBhcmVhLmhpZ2hsaWdodGVkID0gbWF0Y2g7XHJcbiAgICAgICAgcmV0dXJuIHsuLi57eDogcG9pbnRlclgsIHk6IHBvaW50ZXJZfSwgLi4uKChtYXRjaCAmJiBhcmVhKSB8fCB7Y3Vyc29yVHlwZTogbGF0ZXN0S25vd25DdXJzb3JUeXBlLCB6SW5kZXg6IGhpZ2hlc3RaSW5kZXh9KX07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNhbGVuZGFyQnVpbGRlcihkYXRlKSB7XHJcbiAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZSgxKTtcclxuICAgICAgICBjb25zdCBkYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgICAgIGxldCBpZHggPSAoZGF0ZS5nZXREYXkoKSArIDYpICUgNztcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIHllYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSxcclxuICAgICAgICAgICAgbW9udGg6IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydScsIHttb250aDogJ2xvbmcnfSlcclxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZGF0ZSlcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eW9CwLdGPXS8sIG1hdGNoID0+IG1hdGNoLnRvVXBwZXJDYXNlKCkpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBkYXRhID0gW107XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBkYXRhW2lkeCsrXSA9IHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IGRhdGUuZ2V0RGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgrZGF0ZSArIGRheSk7XHJcbiAgICAgICAgfSB3aGlsZSAoZGF0ZS5nZXREYXRlKCkgPiAxKTtcclxuICAgICAgICByZXR1cm4gey4uLnJlc3VsdCwgLi4ue2RhdGVzOiBbLi4uZGF0YV19fTtcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIuY2FsZW5kYXJCdWlsZGVyKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnaW5pdGlhbCc7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eDogY2xpY2tYLCB5OiBjbGlja1l9KSB7XHJcbiAgICAgICAgY29uc3QgX2ZpbmQgPSBhcmVhID0+IChcclxuICAgICAgICAgICAgYXJlYSAmJiBhcmVhLnggPCBjbGlja1ggJiYgYXJlYS55IDwgY2xpY2tZICYmIChhcmVhLnggKyBhcmVhLndpZHRoKSA+IGNsaWNrWCAmJiAoYXJlYS55ICsgYXJlYS5oZWlnaHQpID4gY2xpY2tZXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5jYWxlbmRhckRhdGEub2JzZXJ2YWJsZUFyZWFzLmZpbmQoX2ZpbmQpIHx8IHRoaXMuY2FsZW5kYXJEYXRhLmRhdGVzLmZpbmQoX2ZpbmQpIHx8IHt0eXBlOiAnJ307XHJcbiAgICAgICAgc3dpdGNoIChhcmVhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAncGlja0RhdGUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXREYXRlKGFyZWEuZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaW5jcmVhc2VDdXJyZW50TW9udGgnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRNb250aCh0aGlzLmN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZWNyZWFzZUN1cnJlbnRNb250aCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldE1vbnRoKHRoaXMuY3VycmVudERhdGUuZ2V0TW9udGgoKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2luY3JlYXNlQ3VycmVudFllYXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRGdWxsWWVhcih0aGlzLmN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCkgKyAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZWNyZWFzZUN1cnJlbnRZZWFyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RnVsbFllYXIodGhpcy5jdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLmNhbGVuZGFyQnVpbGRlcih0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhdG9yLnNldERhdGUodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyh7eCA9IHRoaXMueCwgeSA9IHRoaXMueSwgaW5pdGlhdG9yfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3gsIHksIHpJbmRleDogSW5maW5pdHksIGluaXRpYXRvciwgb3BlbmVkOiB0cnVlfSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50RGF0ZSA9IGluaXRpYXRvci5kYXRlIHx8IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLmNhbGVuZGFyQnVpbGRlcih0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5hc3NpZ25MYXN0QWN0aXZhdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7b3BlbmVkOiBmYWxzZSwgekluZGV4OiAtMX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgaW5pdGlhdG9yOiBudWxsfSk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRBcmVhcyhwb3MpIHtcclxuICAgICAgICAoe2N1cnNvclR5cGU6IEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yfSA9IFtcclxuICAgICAgICAgICAgLi4udGhpcy5jYWxlbmRhckRhdGEuZGF0ZXMsXHJcbiAgICAgICAgICAgIC4uLnRoaXMuY2FsZW5kYXJEYXRhLm9ic2VydmFibGVBcmVhc1xyXG4gICAgICAgIF0ucmVkdWNlKERhdGVQaWNrZXIuZmluZEl0ZW1VbmRlclBvaW50ZXIsIHsuLi5wb3MsIC4uLntjdXJzb3JUeXBlOiAnaW5pdGlhbCcsIHpJbmRleDogLTF9fSkpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEFyZWFzLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge2RhdGVGb3JtYXQsIHRocm90dGxlfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtEYXRlUGlja2VyfSBmcm9tIFwiLi9kYXRlLXBpY2tlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVkaXRCb3ggZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3Ioe3dpZHRoID0gRWRpdEJveC5nZW9tZXRyaWMud2lkdGgsIGlzQ2FsZW5kYXIgPSBmYWxzZSwgZGF0ZSA9IGlzQ2FsZW5kYXIgPyBuZXcgRGF0ZSgpIDogbnVsbCwgdmFsdWUgPSBpc0NhbGVuZGFyID8gZGF0ZUZvcm1hdChkYXRlKSA6ICcnLCAuLi5wYXJhbXN9KSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnRWRpdEJveCc7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy5pc0NhbGVuZGFyID0gaXNDYWxlbmRhcjtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dCA9IG51bGw7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFZGl0Qm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMgPSBbXHJcbiAgICAgICAgICAgIC4uLihcclxuICAgICAgICAgICAgICAgIGlzQ2FsZW5kYXIgPyBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ZvY3VzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3RleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Nob3dDYWxlbmRhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0gOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmb2N1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICd0ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDkwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgaXNDYWxlbmRhcn0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4IC0gMiwgeSAtIDIsIHdpZHRoICsgMywgaGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTRweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyM2NjY2NjYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNkZGRkZGQnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMWQxZDFkJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAzLCB5ICsgaGVpZ2h0IC0gNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGlmICghaXNDYWxlbmRhcikgcmV0dXJuIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxOHB4LzEgZW1vamknO1xyXG4gICAgICAgICAgICBjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KCfwn5OGJykuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzY2NjY2Nic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgn8J+ThicsIHggKyB3aWR0aCAtIGhlaWdodCwgeSArIGZvbnRIZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEB0aGlzIHtFZGl0Qm94LnByb3RvdHlwZX0gKi9cclxuICAgIHN0YXRpYyBkZWZpbmVDdXJzb3JUeXBlKHt4LCB5fSkge1xyXG4gICAgICAgICh7Y3Vyc29yVHlwZTogQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3J9ID0gKFxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcy5maW5kKGZ1bmN0aW9uKHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggPCB0aGlzLnggJiYgeSA8IHRoaXMueSAmJiAoeCArIHdpZHRoKSA+IHRoaXMueCAmJiAoeSArIGhlaWdodCkgPiB0aGlzLnk7XHJcbiAgICAgICAgICAgIH0sIHt4LCB5fSkgfHwge2N1cnNvclR5cGU6ICdpbml0aWFsJ31cclxuICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNDYWxlbmRhciA/XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0ZShuZXcgRGF0ZSh0aGlzLmh0bWxJbnB1dD8udmFsdWUgfHwgdGhpcy5kYXRlKSkgOlxyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuaHRtbElucHV0Py52YWx1ZSB8fCB0aGlzLnZhbHVlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0ICYmICh0aGlzLmh0bWxJbnB1dC5yZW1vdmUoKSB8fCB0aGlzLmh0bWxJbnB1dC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKHt4LCB5fSkge1xyXG4gICAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLm9ic2VydmFibGVBcmVhcy5maW5kKGZ1bmN0aW9uKHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICByZXR1cm4geCA8IHRoaXMueCAmJiB5IDwgdGhpcy55ICYmICh4ICsgd2lkdGgpID4gdGhpcy54ICYmICh5ICsgaGVpZ2h0KSA+IHRoaXMueTtcclxuICAgICAgICB9LCB7eCwgeX0pO1xyXG4gICAgICAgIGlmICghYXJlYSkgcmV0dXJuO1xyXG4gICAgICAgIHN3aXRjaCAoYXJlYS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdzaG93Q2FsZW5kYXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93Q2FsZW5kYXIoe3gsIHl9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93Q2FsZW5kYXIoe3gsIHl9KSB7XHJcbiAgICAgICAgRGF0ZVBpY2tlci5pbnN0YW5jZS5zaG93KHtpbml0aWF0b3I6IHRoaXMsIHgsIHl9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb2N1cygpIHtcclxuICAgICAgICBjb25zdCBvZmZzZXQgPSB7XHJcbiAgICAgICAgICAgIHRvcDogQXBwLmluc3RhbmNlLmNhbnZhcy5vZmZzZXRUb3AsXHJcbiAgICAgICAgICAgIGxlZnQ6IEFwcC5pbnN0YW5jZS5jYW52YXMub2Zmc2V0TGVmdFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgT2JqZWN0LmVudHJpZXMoe1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgdG9wOiBgJHt0aGlzLnkgKyBvZmZzZXQudG9wfXB4YCxcclxuICAgICAgICAgICAgbGVmdDogYCR7dGhpcy54ICsgb2Zmc2V0LmxlZnR9cHhgLFxyXG4gICAgICAgICAgICB3aWR0aDogYCR7dGhpcy5pc0NhbGVuZGFyID8gdGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0IDogdGhpcy53aWR0aH1weGAsXHJcbiAgICAgICAgICAgIGZvbnQ6ICcxNHB4IHNhbnMtc2VyaWYnLFxyXG4gICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZGRkZGRkJyxcclxuICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXHJcbiAgICAgICAgICAgIHBhZGRpbmc6ICcycHggMCdcclxuICAgICAgICB9KS5tYXAoZSA9PiBlLmpvaW4oJzonKSkuam9pbignOycpKTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5pZCA9ICdodG1sLWlucHV0LWVsZW1lbnQnO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LnZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaHRtbElucHV0KTtcclxuICAgICAgICB0aGlzLmh0bWxJbnB1dC5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRlKGRhdGUgPSB0aGlzLmRhdGUpIHtcclxuICAgICAgICBpZiAoIWRhdGUpIHJldHVybjtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRlRm9ybWF0KGRhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWUodmFsdWUgPSB0aGlzLnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEVkaXRCb3gucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHt0eXBlLCBrZXksIG9mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2tleWRvd24nOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdFbnRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25CbHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgKz0ga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50aHJvdHRsZShFZGl0Qm94LmRlZmluZUN1cnNvclR5cGUuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhvdmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtpZH0pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0hvdmVyfSAqL1xyXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gX2luc3RhbmNlIHx8IChpID0+IF9pbnN0YW5jZSA9IGkpKG5ldyBIb3Zlcih7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGFjdGl2ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4IC0gMiwgeSAtIDIsIHdpZHRoICsgNCwgaGVpZ2h0ICsgNCk7XHJcbiAgICAgICAgaWYgKCFhY3RpdmUpIHJldHVybjtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnI2ZkMjkyOSc7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db250ZXh0TWVudSgpIHt9XHJcblxyXG4gICAgb25CbHVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgc2hvdyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4ID0gMX0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeDogeCAtIDEsXHJcbiAgICAgICAgICAgIHk6IHkgLSAxLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggKyAyLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCArIDIsXHJcbiAgICAgICAgICAgIHpJbmRleDogekluZGV4IC0gMSxcclxuICAgICAgICAgICAgYWN0aXZlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIHk6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBIb3Zlci5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRvb2x0aXAge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLnRleHQgPSAnJztcclxuICAgICAgICB0aGlzLmRlYm91bmNlID0gZGVib3VuY2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge1Rvb2x0aXB9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IFRvb2x0aXAoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0ZXh0fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGlmICghdGV4dCkgcmV0dXJuO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgNTAwLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxMHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNmZmVhOWYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzMyMzIzMic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCB4ICsgMTAsIHkgKyBoZWlnaHQgLSAxMCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNvbnRleHRNZW51KCkge31cclxuXHJcbiAgICBvbkJsdXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHt9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBzaG93KHt4LCB5LCB0b29sdGlwQ29udGVudH0pIHtcclxuICAgICAgICBjb25zdCB7Y3R4LCBjYW52YXM6IHt3aWR0aDogY2FudmFzV2lkdGh9fSA9IEFwcC5pbnN0YW5jZTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxMHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCB7YWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGNvbnRlbnRIZWlnaHQsIHdpZHRoOiBjb250ZW50V2lkdGh9ID0gY3R4Lm1lYXN1cmVUZXh0KHRvb2x0aXBDb250ZW50KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB4ID4gKGNhbnZhc1dpZHRoIC0gY29udGVudFdpZHRoIC0gMjApID8geCAtIGNvbnRlbnRXaWR0aCAtIDIwIDogeCxcclxuICAgICAgICAgICAgeTogeSA+IGNvbnRlbnRIZWlnaHQgKyAyMCA/IHkgLSBjb250ZW50SGVpZ2h0IC0gMjAgOiB5LFxyXG4gICAgICAgICAgICB3aWR0aDogY29udGVudFdpZHRoICsgMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogY29udGVudEhlaWdodCArIDIwLFxyXG4gICAgICAgICAgICB0ZXh0OiB0b29sdGlwQ29udGVudCxcclxuICAgICAgICAgICAgekluZGV4OiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMudGV4dCA9ICcnO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgeTogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGUoe3gsIHl9KSB7XHJcbiAgICAgICAgY29uc3Qge3RleHQsIHpJbmRleH0gPSB0aGlzO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3RleHQ6ICcnLCB6SW5kZXg6IC0xfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsuLi57eCwgeTogeSAtIHRoaXMuaGVpZ2h0LCB0ZXh0LCB6SW5kZXh9fSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVG9vbHRpcC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLmRlYm91bmNlKHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge3NpbnVzb2lkR2VufSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVuZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ1RyZW5kZXInO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUNvbmZpZyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIEluJyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlICo9IDEuMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gT3V0JyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlICo9IDAuOTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLm1hcCgoe2NhbGxiYWNrLCAuLi5yZXN0fSkgPT4gKHtcclxuICAgICAgICAgICAgLi4ucmVzdCxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmRlYm91bmNlID0gZGVib3VuY2UoKTtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoY29uZmlnLCBjdHgpIHtcclxuICAgICAgICBjb25zdCBjaGFydE1hcmdpbiA9IDIwO1xyXG4gICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBkYXRhOiB7cG9pbnRzfX0gPSBjb25maWc7XHJcbiAgICAgICAgY29uc3QgY2hhcnRBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB4ICsgcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgeTogeSArIHBhZGRpbmdbMF0sXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIHBhZGRpbmdbMV0gLSBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCAtIHBhZGRpbmdbMF0gLSBwYWRkaW5nWzJdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB7bWluLCBtYXh9ID0gVHJlbmRlci5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICBjdHguZmlsbFJlY3QuYXBwbHkoY3R4LCBPYmplY3QudmFsdWVzKGNoYXJ0QXJlYSkpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdZQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWEsIC4uLnt6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9fSwgY3R4KTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdEYXRhKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd0xlZ2VuZCh7Li4uY29uZmlnLCAuLi57XHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHk6IHkgKyBoZWlnaHQgLSA0MCxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9fSwgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdEYXRhKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBzY2FsZSwgZGF0YToge3BvaW50cyA9IFtdfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMwMDAwZmYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgKC1wb2ludHNbMF0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAvIGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc2NhbGVkVmFsdWUgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0gMDtcclxuICAgICAgICAgICAgICAgICBpIDwgbGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgIHhQb3MgKz0gc3RlcCwgc2NhbGVkVmFsdWUgPSAoLXBvaW50c1srK2ldPy52YWx1ZSB8fCAwKSAqIHNjYWxlICogcmFuZ2VTY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4UG9zLCBzY2FsZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzY2FsZWRWYWx1ZSA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgeFBvcyArPSBzdGVwLCBzY2FsZWRWYWx1ZSA9ICgtcG9pbnRzWysraV0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeFBvcyAtIDQsIHNjYWxlZFZhbHVlIC0gNCwgOCwgOCk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4UG9zIC0gNCwgc2NhbGVkVmFsdWUgLSA0LCA4LCA4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WEF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSArIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCwgeSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHhQb3MgPSB4LFxyXG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gd2lkdGggLyBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKSxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHBvaW50c1swXS50aW1lKS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbE9mZnNldCA9IE1hdGgucm91bmQobGFiZWxXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsc0ludGVydmFsID0gTWF0aC5jZWlsKChsYWJlbFdpZHRoICsgMjApIC8gaW50ZXJ2YWwpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHRMYWJlbFBvcyA9IHhQb3MgKyBsYWJlbHNJbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBwb2ludHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgIGkrKyxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyArPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpLFxyXG4gICAgICAgICAgICAgICAgICAgICBpc01ham9yVGljayA9ICEoaSAlIGxhYmVsc0ludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gaXNNYWpvclRpY2sgPyAnIzNjM2MzYycgOiAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocm91bmRlZFhQb3MsIGlzTWFqb3JUaWNrID8geSArIGhlaWdodCArIDUgOiB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocm91bmRlZFhQb3MsIHkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc01ham9yVGljaykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQocG9pbnRzW2ldLnRpbWUsIHJvdW5kZWRYUG9zIC0gbGFiZWxPZmZzZXQsIHkgKyBoZWlnaHQgKyAyMCk7XHJcbiAgICAgICAgICAgICAgICBuZXh0TGFiZWxQb3MgKz0gbGFiZWxzSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd1lBeGlzKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0aWNrcyA9IDIwLCBtYWpvclRpY2tzSW50ZXJ2YWwsIHplcm9MZXZlbCwgc2NhbGUsIHJhbmdlU2NhbGUsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxYTFhMWEnO1xyXG4gICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTRweCBzYW5zLXNlcmlmJztcclxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IGhlaWdodCAvIHRpY2tzO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgucmVjdCh4IC0xMDAsIHksIHdpZHRoICsgMTAwLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgeVBvcyA9IHplcm9MZXZlbCArIE1hdGguY2VpbCgoeSArIGhlaWdodCAtIHplcm9MZXZlbCkgLyBpbnRlcnZhbCkgKiBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyksXHJcbiAgICAgICAgICAgICAgICAgbGFiZWwgPSAoKHplcm9MZXZlbCAtIHlQb3MpIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgICAgICAgICAgaXNNYWpvclRpY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgIGkgPCB0aWNrcztcclxuICAgICAgICAgICAgIGkrKyxcclxuICAgICAgICAgICAgICAgIHlQb3MgLT0gaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgcm91bmRlZFlQb3MgPSBNYXRoLnJvdW5kKHlQb3MpLFxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSAoKHplcm9MZXZlbCAtIHlQb3MgKSAvIHJhbmdlU2NhbGUgLyBzY2FsZSkudG9GaXhlZCgyKSxcclxuICAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IE1hdGguYWJzKHlQb3MgLSB6ZXJvTGV2ZWwpICUgKGludGVydmFsICogbWFqb3JUaWNrc0ludGVydmFsKSA8IGludGVydmFsIC8gMikge1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBpc01ham9yVGljayA/ICcjNDM0MzQzJyA6ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oaXNNYWpvclRpY2sgPyB4IC0gNSA6IHgsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWlzTWFqb3JUaWNrKSBjb250aW51ZTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxhYmVsLCB4IC0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aCAtIDEwLCByb3VuZGVkWVBvcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3TGVnZW5kKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhOiB7bmFtZX19LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDAsMCwyNTUpJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KG5hbWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKC0xLCAwLCAwLCAxLCB4ICsgd2lkdGggLyAyIC0gNSwgeSArIGhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgNCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oMjAsIDQpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoNiwgMCwgOCwgOCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KDYsIDAsIDgsIDgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHggKyB3aWR0aCAvIDIgKyA1LCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzE1MTUxNSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChuYW1lLCAwLCBmb250SGVpZ2h0IC0gMik7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplUmFuZ2UoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBkYXRhLnJlZHVjZSgoe21pbiwgbWF4LCBtYXhOZWdhdGl2ZSwgbWluUG9zaXRpdmV9LCB7dmFsdWV9KSA9PiAoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1pbjogTWF0aC5taW4odmFsdWUsIG1pbiksXHJcbiAgICAgICAgICAgICAgICBtYXg6IE1hdGgubWF4KHZhbHVlLCBtYXgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLCB7XHJcbiAgICAgICAgICAgIG1pbjogSW5maW5pdHksXHJcbiAgICAgICAgICAgIG1heDogLUluZmluaXR5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1vY2tEYXRhKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KCkgLSAxMDAwICogMjk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheSgzMClcclxuICAgICAgICAgICAgLmZpbGwoc3RhcnRUaW1lKVxyXG4gICAgICAgICAgICAubWFwKCh0aW1lLCBpZHgpID0+IChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSh0aW1lICsgMTAwMCAqIGlkeCkudG9Mb2NhbGVUaW1lU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNpbnVzb2lkR2VuLm5leHQoKS52YWx1ZSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1vY2tOZXh0RGF0YSgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCd0cmVuZGVyTmV4dFRpY2snLCB7ZGV0YWlsOiB7XHJcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHZhbHVlOiBzaW51c29pZEdlbi5uZXh0KCkudmFsdWUsXHJcbiAgICAgICAgfX0pKVxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ3RyZW5kZXJOZXh0VGljaycsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBUcmVuZGVyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7ZGV0YWlsfSkge1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMuc2hpZnQoKTtcclxuICAgICAgICB0aGlzLmRhdGEucG9pbnRzLnB1c2goZGV0YWlsKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWYWx1ZUl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3Ioe3ZhbHVlLCAuLi5wYXJhbXN9KSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnVmFsdWVJdGVtJztcclxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy50b29sdGlwQ29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50cmVuZCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ01vdmUnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSG9yaXpvbnRhbGx5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0xlZnQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcywge3g6IC0yMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUmlnaHQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcywge3g6IDIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1ZlcnRpY2FsbHknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVXAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcywge3k6IC0yMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRG93bicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eTogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1Jlc2l6ZScsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdYJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0dyb3cnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMucmVzaXplLmJpbmQodGhpcywge3g6IDIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaHJpbmsnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMucmVzaXplLmJpbmQodGhpcywge3g6IC0yMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdZJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0dyb3cnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMucmVzaXplLmJpbmQodGhpcywge3k6IDIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaHJpbmsnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMucmVzaXplLmJpbmQodGhpcywge3g6IC0yMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdIaWRlJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuaGlkZS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgVmFsdWVJdGVtLmdlb21ldHJpYyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgcmFuZG9tVmFsdWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogMTAwKS50b0ZpeGVkKDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2aXNpYmxlLCB2YWx1ZSwgdHJlbmQsIGFjdGl2ZX0sIGN0eCkge1xyXG4gICAgICAgIGxldCBzdGFjayA9IDA7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGlmICghdmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcblx0XHRcdGN0eC5maWxsU3R5bGUgPSAnIzE2MTYxNic7XHJcblx0XHRcdGN0eC5mb250ID0gJ2JvbGQgMTJweCBzZXJpZic7XHJcblx0XHRcdGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQodmFsdWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG5cdFx0XHRpZiAoYWN0aXZlKSB7XHJcblx0XHRcdFx0Y3R4LnNhdmUoKTtcclxuXHRcdFx0XHRzdGFjaysrO1xyXG5cdFx0XHRcdGlmICh0cmVuZCA+IDApIHtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnIzAwRkYwMCc7XHJcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHJlbmQgPCAwKSB7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJyNlNTAwMDAnO1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRjdHgucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcdFx0Y3R4LmNsaXAoKTtcclxuXHRcdFx0Y3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMSwgeSArIGZvbnRIZWlnaHQgKyA1KTtcclxuXHRcdFx0c3RhY2sgJiYgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRSYW5kb21DaGFuZ2UoKSB7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwodGhpcy5vblZhbHVlQ2hhbmdlLmJpbmQodGhpcyksIDEwMDAwICsgTWF0aC5yYW5kb20oKSAqIDYwMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bigpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRleHQodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy50cmVuZCA9IHZhbHVlID4gdGhpcy52YWx1ZSA/IDEgOiAodmFsdWUgPCB0aGlzLnZhbHVlID8gLTEgOiAwKTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy50b29sdGlwQ29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLmJsaW5rLmJpbmQodGhpcyksIDIwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgYmxpbmsoKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVmFsdWVDaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRUZXh0KFZhbHVlSXRlbS5yYW5kb21WYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIFZhbHVlSXRlbS5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudHMvY29tcG9uZW50XCI7XHJcbmltcG9ydCB7Q29sbGVjdGlvbkl0ZW19IGZyb20gXCIuL2NvbXBvbmVudHMvY29sbGVjdGlvbi1pdGVtXCI7XHJcbmltcG9ydCB7VG9vbHRpcH0gZnJvbSBcIi4vY29tcG9uZW50cy90b29sdGlwXCI7XHJcbmltcG9ydCB7VmFsdWVJdGVtfSBmcm9tIFwiLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW1cIjtcclxuaW1wb3J0IHtDaGFydEl0ZW19IGZyb20gXCIuL2NvbXBvbmVudHMvY2hhcnQtaXRlbVwiO1xyXG5pbXBvcnQge0VkaXRCb3h9IGZyb20gXCIuL2NvbXBvbmVudHMvZWRpdC1ib3hcIjtcclxuaW1wb3J0IHtDb250ZXh0TWVudX0gZnJvbSBcIi4vY29tcG9uZW50cy9jb250ZXh0LW1lbnVcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuL2FwcFwiO1xyXG5pbXBvcnQge0J1dHRvbn0gZnJvbSBcIi4vY29tcG9uZW50cy9idXR0b25cIjtcclxuaW1wb3J0IHtDb21ib0JveH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb21iby1ib3hcIjtcclxuaW1wb3J0IHtUcmVuZGVyfSBmcm9tIFwiLi9jb21wb25lbnRzL3RyZW5kZXJcIjtcclxuaW1wb3J0IHtIb3Zlcn0gZnJvbSBcIi4vY29tcG9uZW50cy9ob3ZlclwiO1xyXG5pbXBvcnQge0Nsb2NrfSBmcm9tIFwiLi9jb21wb25lbnRzL2Nsb2NrXCI7XHJcbmltcG9ydCB7RGF0ZVBpY2tlcn0gZnJvbSBcIi4vY29tcG9uZW50cy9kYXRlLXBpY2tlclwiO1xyXG5cclxuY29uc3QgY2hhcnRDb25maWcgPSB7XHJcbiAgICB0eXBlOiAnY29sdW1uJyxcclxuICAgIHBhZGRpbmc6IFsyMCwgMjAsIDcwLCA3MF0sXHJcbiAgICB0aWNrczogNSxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBwb2ludHM6IENoYXJ0SXRlbS5tb2NrRGF0YSgpLFxyXG4gICAgICAgIG1hcmdpbjogMC4xXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCB0cmVuZGVyQ29uZmlnID0ge1xyXG4gICAgcGFkZGluZzogWzIwLCAyMCwgNzAsIDcwXSxcclxuICAgIHRpY2tzOiAyMCxcclxuICAgIG1ham9yVGlja3NJbnRlcnZhbDogNCxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBuYW1lOiAnc2luKHgpJyxcclxuICAgICAgICBwb2ludHM6IFRyZW5kZXIubW9ja0RhdGEoKVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgbWVudUl0ZW1zID0gW1xyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiAnT25lJyxcclxuICAgICAgICB2YWx1ZTogMSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdUd28nLFxyXG4gICAgICAgIHZhbHVlOiAyLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogJ1RocmVlJyxcclxuICAgICAgICB2YWx1ZTogMyxcclxuICAgIH1cclxuXTtcclxuXHJcbmNvbnN0IGJ1dHRvbkNhbGxiYWNrID0gKCkgPT4gKFxyXG4gICAgQXBwLmluc3RhbmNlLmRpc3BhdGNoKG5ldyBDdXN0b21FdmVudCgncmFuZG9taXplQ2hhcnREYXRhJykpXHJcbik7XHJcblxyXG5zZXRJbnRlcnZhbChUcmVuZGVyLm1vY2tOZXh0RGF0YSwgMTAwMCk7XHJcblxyXG5BcHAuaW5zdGFuY2UuY29tcG9uZW50cyA9IFtcclxuICAgIC4uLltcclxuICAgICAgICBuZXcgQ2xvY2soe3k6IDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9KVxyXG4gICAgXSxcclxuICAgIC4uLkNvbGxlY3Rpb25JdGVtLmNvbXBvc2Uoe3g6IDAsIHk6IDMwLCBjb2xzOiAyNSwgcm93czogMTIsIGdhcDogMjAsIGN0b3I6IFZhbHVlSXRlbX0pLFxyXG4gICAgLi4uW1xyXG4gICAgICAgIG5ldyBFZGl0Qm94KHt4OiAwLCB5OiA2MDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9KSxcclxuICAgICAgICBuZXcgRWRpdEJveCh7eDogMTAwLCB5OiA2MDAsIHdpZHRoOiAxMDAsIHpJbmRleDogMSwgaXNDYWxlbmRhcjogdHJ1ZSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9KSxcclxuICAgICAgICBuZXcgQ29tYm9Cb3goe3g6IDI1MCwgeTogNjAwLCB6SW5kZXg6IDEsIHZhcmlhYmxlTmFtZTogJ0NvbWJvYm94MScsIG1lbnVJdGVtcywgaWQ6IENvbXBvbmVudC5uZXh0SWR9KSxcclxuICAgICAgICBuZXcgQ2hhcnRJdGVtKHsuLi57eDogQXBwLmluc3RhbmNlLmNhbnZhcy53aWR0aCAtIDYwMCwgeTogMzAsIHdpZHRoOiA2MDAsIGhlaWdodDogNDAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSwgLi4uY2hhcnRDb25maWd9KSxcclxuICAgICAgICBuZXcgQnV0dG9uKHt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gQnV0dG9uLmdlb21ldHJpYy53aWR0aCwgeTogNDUwLCB6SW5kZXg6IDEsIHZhbHVlOiAnUmFuZG9taXplJywgY2FsbGJhY2s6IGJ1dHRvbkNhbGxiYWNrLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBUcmVuZGVyKHsuLi57eDogQXBwLmluc3RhbmNlLmNhbnZhcy53aWR0aCAtIDYwMCwgeTogNDkwLCB3aWR0aDogNjAwLCBoZWlnaHQ6IDQwMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0sIC4uLnRyZW5kZXJDb25maWd9KSxcclxuICAgICAgICBUb29sdGlwLmluc3RhbmNlLFxyXG4gICAgICAgIEhvdmVyLmluc3RhbmNlLFxyXG4gICAgICAgIENvbnRleHRNZW51Lmluc3RhbmNlLFxyXG4gICAgICAgIERhdGVQaWNrZXIuaW5zdGFuY2VcclxuICAgIF1cclxuXTtcclxuXHJcbkFwcC5pbnN0YW5jZS5yZW5kZXIoKTtcclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKHRocmVzaG9sZCA9IDEwMCkge1xyXG4gICAgbGV0IHRpbWVvdXQgPSAwO1xyXG4gICAgcmV0dXJuIChmbiwgYXJnKSA9PiB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZuLCB0aHJlc2hvbGQsIGFyZyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZSh0aHJlc2hvbGQgPSAxMDApIHtcclxuICAgIGxldCB0aW1lb3V0ID0gdHJ1ZTtcclxuICAgIHNldEludGVydmFsKCgpID0+IHRpbWVvdXQgPSB0cnVlLCB0aHJlc2hvbGQpO1xyXG4gICAgcmV0dXJuIChmbiwgYXJnKSA9PiB7XHJcbiAgICAgICAgdGltZW91dCAmJiBmbihhcmcpO1xyXG4gICAgICAgIHRpbWVvdXQgPSBmYWxzZTtcclxuICAgIH07XHJcbn1cclxuXHJcbmNvbnN0IHNpbnVzb2lkR2VuID0gKGZ1bmN0aW9uKiAoKSB7XHJcbiAgICBjb25zdCBwZXJpb2QgPSBNYXRoLlBJICogMjtcclxuICAgIGNvbnN0IHEgPSAwLjU7XHJcbiAgICBsZXQgX2kgPSAwO1xyXG4gICAgd2hpbGUgKHRydWUpIHlpZWxkIE1hdGgucm91bmQoTWF0aC5zaW4oX2krKyAqIHEgJSBwZXJpb2QpICogMTAwMDApIC8gMTAwO1xyXG59KSgpO1xyXG5cclxuY29uc3QgdGltZUZvcm1hdCA9ICh0aW1lRm9ybWF0dGVyID0+IHtcclxuICAgIHJldHVybiB0aW1lID0+IHRpbWVGb3JtYXR0ZXIuZm9ybWF0KHRpbWUpO1xyXG59KShuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgncnUnLCB7aG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0Jywgc2Vjb25kOiAnMi1kaWdpdCd9KSk7XHJcblxyXG5jb25zdCBkYXRlRm9ybWF0ID0gKGRhdGVGb3JtYXR0ZXIgPT4ge1xyXG4gICAgcmV0dXJuIGRhdGUgPT4gZGF0ZUZvcm1hdHRlci5mb3JtYXQoZGF0ZSk7XHJcbn0pKG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdlbicsIHtkYXk6ICcyLWRpZ2l0JywgbW9udGg6ICcyLWRpZ2l0JywgeWVhcjogJ251bWVyaWMnfSkpO1xyXG5cclxuZXhwb3J0IHsgc2ludXNvaWRHZW4sIHRpbWVGb3JtYXQsIGRhdGVGb3JtYXQgfVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL2luZGV4LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==