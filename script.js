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

    onMouseDown({offsetX: x, offsetY: y, button}) {
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
        _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.dispatch(new CustomEvent('hideTooltip'));
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
                ctx.font = '12px Webdings';
                ctx.fillStyle = fontColor;
                ctx.fillText(opened ? '5' : '6', x + width - height / 2 - 5, y + height - 6);
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
        _app__WEBPACK_IMPORTED_MODULE_0__.App.instance.dispatch(new CustomEvent('hideHover'));
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
            ctx.font = '12px Webdings';
            const {width: arrowWidth, actualBoundingBoxAscent: arrowHeight} = ctx.measureText('4');
            const {collection} = ctxMenuItems.reduce(function recurse({x, y, width, visible, collection}, {type, title, highlighted, disabled = false, children = []}, idx) {
                ctx.font = '12px sans-serif';
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
                ctx.font = '12px sans-serif';
                ctx.fillText(title, area.x + 10, area.y + area.height - 5);
                if (!children.length) return returnValue;

                ctx.font = '12px Webdings';
                ctx.fillText('4', area.x + area.width - arrowWidth - 2, area.y + area.height / 2 + arrowHeight / 2);
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
        this.x = x;
        this.y = y;
        this.zIndex = Infinity;
        this.ctxMenuItems = ctxMenuItems;
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
        this.blinkTimeout = 0;
        this.caret = false;
        this.value = value;
        this.date = date;
        this.isCalendar = isCalendar;
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
    static render({x, y, width, height, caret, focused, value, isCalendar}, ctx) {
        ctx.fillRect(x - 2, y - 2, width + 3, height + 3);
        ctx.save();
            ctx.font = '14px sans-serif';
            const textWidth = Math.floor(ctx.measureText(value).width);
            ctx.strokeStyle = focused ? 'black' : '#666666';
            ctx.strokeRect(x, y, width, height);
            ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                ctx.clip();
                if (caret) {
                    ctx.beginPath();
                    ctx.moveTo(x + 3 + textWidth, y + 2);
                    ctx.lineTo(x + 3 + textWidth, y + height - 2);
                    ctx.stroke();
                }
                if (value) {
                    ctx.fillStyle = '#1d1d1d';
                    ctx.fillText(value, x + 3, y + height - 4);
                }
            ctx.restore();
            if (!isCalendar) return ctx.restore();

            ctx.font = '20px/0 Webdings';
            const fontHeight = ctx.measureText('¦').actualBoundingBoxAscent;
            ctx.fillStyle = '#666666';
            ctx.fillText('¦', x + width - height, y + fontHeight + 1);
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
        document.removeEventListener('keydown', this);
        clearInterval(this.blinkTimeout);
        this.focused = false;
        this.caret = false;
        this.isCalendar && this.setDate(new Date(Date.parse(this.value)));
        this.render();
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
        document.addEventListener('keydown', this);
        clearInterval(this.blinkTimeout);
        this.blinkTimeout = setInterval(this.blink.bind(this), 500);
        this.focused = true;
        this.caret = true;
        this.render();
    }

    blink() {
        this.caret = !this.caret;
        this.render();
    }

    setDate(date = this.date) {
        if (!date) return;
        this.date = date;
        this.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.dateFormat)(date);
        this.render();
    }

    render() {
        EditBox.render(this, _app__WEBPACK_IMPORTED_MODULE_1__.App.instance.ctx);
        super.render();
    }

    handleEvent(e) {
        e.preventDefault();
        const {type, key, offsetX: x, offsetY: y} = e;
        switch (type) {
            case 'keydown':
                switch (key) {
                    case 'Backspace':
                        this.value = this.value.substr(0, this.value.length - 1);
                        break;
                    case 'Enter':
                        this.onBlur();
                        break;
                    case 'Alt':
                    case 'Control':
                    case 'Shift':
                    case 'ArrowRight':
                    case 'ArrowLeft':
                    case 'ArrowUp':
                    case 'ArrowDown':
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

    onMouseOver() {}

    onMouseOut() {}

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
        const ctx = _app__WEBPACK_IMPORTED_MODULE_2__.App.instance.ctx;
        ctx.save();
            ctx.font = '10px sans-serif';
            const {actualBoundingBoxAscent: contentHeight, width: contentWidth} = ctx.measureText(tooltipContent);
        ctx.restore();
        Object.assign(this, {
            x,
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
})(new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit', second: '2-digit'}));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMvLi9hcHAuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jaGFydC1pdGVtLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvY2xvY2suanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21iby1ib3guanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL2VkaXQtYm94LmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvaG92ZXIuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy90b29sdGlwLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvdHJlbmRlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBv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QUNqSyxZQUFZLHlEQUFPLEVBQUUsSUFBSSxHQUFHLDJEQUF5Qix3REFBd0QsbUVBQWdCLENBQUMsbUJBQW1CO0FBQ2pKLFFBQVEsaUVBQWdCO0FBQ3hCLFFBQVEsOERBQWM7QUFDdEIsUUFBUSwwRUFBb0I7QUFDNUIsUUFBUSx5RUFBbUI7QUFDM0I7QUFDQTs7QUFFQSxxREFBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRVo7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQyxpQ0FBaUMsc0RBQXNEOztBQUV4RjtBQUNBO0FBQ0EsQ0FBQyxpQ0FBaUMsa0RBQWtEOztBQUV0Qzs7Ozs7OztVQ2hDOUM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRocm90dGxlIH0gZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUge0NvbXBvbmVudFtdfSAqL1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHsgYWxwaGE6IGZhbHNlIH0pO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJyMyMjIyMjInO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjN2FmZmQxJztcclxuICAgICAgICB0aGlzLmN0eC5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgdGhpcy5sYXN0SG92ZXJlZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gX2luc3RhbmNlIHx8IChpID0+IF9pbnN0YW5jZSA9IGkpKG5ldyBBcHAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG9uQ29udGV4dE1lbnUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7Q29tcG9uZW50W119IGNvbXBvbmVudHMgKi9cclxuICAgIHNldCBjb21wb25lbnRzKGNvbXBvbmVudHMpIHtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzID0gY29tcG9uZW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0NvbXBvbmVudFtdfSAqL1xyXG4gICAgZ2V0IGNvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhyb3R0bGUoKS5iaW5kKHVuZGVmaW5lZCwgdGhpcy5vbk1vdXNlTW92ZS5iaW5kKHRoaXMpKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBBcHAub25Db250ZXh0TWVudSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2goZSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmRpc3BhdGNoRXZlbnQoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGlzdGVuKGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICB1bmxpc3RlbihldmVudFR5cGUsIGhhbmRsZXIpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJiB0aGlzLmxhc3RBY3RpdmF0ZWQub25Nb3VzZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe29mZnNldFg6IHgsIG9mZnNldFk6IHksIGJ1dHRvbn0pIHtcclxuICAgICAgICBsZXQgdG9wTW9zdDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgekluZGV4ID0gLTEsIGl0ZW1zID0gdGhpcy5fY29tcG9uZW50cywgbGVuZ3RoID0gaXRlbXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS54IDwgeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnggKyBpdGVtc1tpXS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID4geVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRvcE1vc3QgPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIHpJbmRleCA9IHRvcE1vc3QuekluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICFPYmplY3QuaXModG9wTW9zdCwgdGhpcy5sYXN0QWN0aXZhdGVkKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSB0b3BNb3N0O1xyXG4gICAgICAgIHRvcE1vc3QgJiYgKFxyXG4gICAgICAgICAgICBidXR0b24gPT09IDIgP1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdC5vbkNvbnRleHRNZW51KHt4LCB5fSkgOiB0b3BNb3N0Lm9uTW91c2VEb3duKHt4LCB5fSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlKHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIGxldCB0b3BNb3N0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCB6SW5kZXggPSAtMSwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS56SW5kZXggPiB6SW5kZXggJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueCArIGl0ZW1zW2ldLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueSArIGl0ZW1zW2ldLmhlaWdodCkgPiB5XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdCA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgekluZGV4ID0gdG9wTW9zdC56SW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgIU9iamVjdC5pcyh0b3BNb3N0LCB0aGlzLmxhc3RIb3ZlcmVkKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkLm9uTW91c2VPdXQoKTtcclxuICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkID0gdG9wTW9zdDtcclxuICAgICAgICB0b3BNb3N0ICYmIHRvcE1vc3Qub25Nb3VzZU92ZXIoe3gsIHl9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25MYXN0QWN0aXZhdGVkKGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJiB0aGlzLmxhc3RBY3RpdmF0ZWQub25CbHVyKCk7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkID0gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGFpbnRBZmZlY3RlZCh7aWQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHpJbmRleH0pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5pZCAhPT0gaWQgJiZcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnpJbmRleCA+IHpJbmRleCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55ID49IHkgJiYgaXRlbXNbaV0ueSA8PSAoeSArIGhlaWdodCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA8PSB5ICYmIChpdGVtc1tpXS55ICsgaXRlbXNbaV0uaGVpZ2h0KSA+PSB5XHJcbiAgICAgICAgICAgICAgICAgICAgKSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPj0geCAmJiBpdGVtc1tpXS54IDw9ICh4ICsgd2lkdGgpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPD0geCAmJiAoaXRlbXNbaV0ueCArIGl0ZW1zW2ldLndpZHRoKSA+PSB4XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpdGVtc1tpXS5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7dmFsdWU9ICdBcHBseScsIGNhbGxiYWNrID0gKCkgPT4ge30sIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdCdXR0b24nO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gMTI7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IEFwcC5pbnN0YW5jZS5jdHg7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3RoaXMuZm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgQnV0dG9uLmdlb21ldHJpYywge3dpZHRoOiBjdHgubWVhc3VyZVRleHQodmFsdWUpLndpZHRoICsgMjB9KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMueCArPSBCdXR0b24uZ2VvbWV0cmljLndpZHRoIC0gdGhpcy53aWR0aCAtIDI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDUwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9cclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgdmFsdWUsIGZvbnRTaXplLCBwcmVzc2VkLCByYWRpdXMgPSAzfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAzLCB5IC0gMywgd2lkdGggKyA5LCBoZWlnaHQgKyA5KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNhMmEyYTInO1xyXG4gICAgICAgICAgICBpZiAoIXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2IxYjFiMSc7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDI7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDI7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDI7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAncmdiYSgxMjcsMTI3LDEyNywwLjcpJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzLCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5hcmNUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCwgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5hcmNUbyh4LCB5LCB4ICsgcmFkaXVzLCB5LCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBpZiAocHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC41KSc7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCArIDIsIHkgKyAyICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIDIsIHkgKyAyICsgcmFkaXVzKTtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmNUbyh4ICsgMiwgeSArIDIsIHggKyAyICsgcmFkaXVzLCB5LCByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMiArIHdpZHRoIC0gcmFkaXVzLCB5ICsgMik7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzM1MzUzNSc7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gYGJvbGQgJHtmb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMTAsIHkgKyBoZWlnaHQgLSA1KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnaW5pdGlhbCc7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZURvd24oKTtcclxuICAgICAgICB0aGlzLnByZXNzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHtcclxuICAgICAgICB0aGlzLnByZXNzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBCdXR0b24ucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnQ2hhcnRJdGVtJztcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoKTtcclxuICAgICAgICB0aGlzLmRhdGFEcmF3QXJlYU1hcCA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUNvbmZpZyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIEluJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuc2V0U2NhbGUuYmluZCh0aGlzLCAxLjEpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBPdXQnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zZXRTY2FsZS5iaW5kKHRoaXMsIDAuOSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIFJlc2V0JyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMucmVzZXRTY2FsZS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcihjb25maWcsIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0TWFyZ2luID0gMjA7XHJcbiAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIGRhdGE6IHtwb2ludHN9fSA9IGNvbmZpZztcclxuICAgICAgICBjb25zdCBjaGFydEFyZWEgPSB7XHJcbiAgICAgICAgICAgIHg6IHggKyBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICB5OiB5ICsgcGFkZGluZ1swXSxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gcGFkZGluZ1sxXSAtIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gcGFkZGluZ1swXSAtIHBhZGRpbmdbMl1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHttaW4sIG1heH0gPSBDaGFydEl0ZW0ubm9ybWFsaXplUmFuZ2UocG9pbnRzKTtcclxuICAgICAgICBjb25zdCByYW5nZVNjYWxlID0gKGNoYXJ0QXJlYS5oZWlnaHQgLSBjaGFydE1hcmdpbikgLyAobWF4IC0gbWluKTtcclxuICAgICAgICBjb25zdCB6ZXJvTGV2ZWwgPSBNYXRoLmZsb29yKChjaGFydEFyZWEueSArIGNoYXJ0TWFyZ2luIC8gMikgKyBtYXggKiByYW5nZVNjYWxlKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMTI3LCAxMjcsIDEyNywgMC4yKSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdC5hcHBseShjdHgsIE9iamVjdC52YWx1ZXMoY2hhcnRBcmVhKSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBDaGFydEl0ZW0uZHJhd1hBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYX0sIGN0eCk7XHJcbiAgICAgICAgQ2hhcnRJdGVtLmRyYXdZQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWEsIC4uLnt6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9fSwgY3R4KTtcclxuICAgICAgICByZXR1cm4gQ2hhcnRJdGVtLmRyYXdEYXRhKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd0RhdGEoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIHNjYWxlLCBkYXRhOiB7cG9pbnRzID0gW10sIG1hcmdpbiA9IDAuMn0sIHplcm9MZXZlbCwgcmFuZ2VTY2FsZX0sIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGFEcmF3QXJlYU1hcCA9IFsuLi5wb2ludHNdO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCwgemVyb0xldmVsKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAvIGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgYmFyV2lkdGggPSBzdGVwICogKDEgLSBtYXJnaW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICBiYXJIZWlnaHQgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0gc3RlcCAvIDIgLSBiYXJXaWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gcG9pbnRzW2ldLnZhbHVlID4gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyMwMDZiMDAnIDogJyMwMGZmMDAnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzgxMDAwMCcgOiAnI2ZmMDAwMCcpO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLCB4UG9zICs9IHN0ZXApIHtcclxuICAgICAgICAgICAgICAgIGZpbGxTdHlsZSA9IHBvaW50c1tpXS52YWx1ZSA+IDAgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyMwMDZiMDAnIDogJyMwMGZmMDAnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgKHBvaW50c1tpXS5oaWdobGlnaHRlZCA/ICcjODEwMDAwJyA6ICcjZmYwMDAwJyk7XHJcbiAgICAgICAgICAgICAgICBiYXJIZWlnaHQgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4UG9zLCAwLCBiYXJXaWR0aCwgLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBkYXRhRHJhd0FyZWFNYXBbaV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uZGF0YURyYXdBcmVhTWFwW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogeFBvcyArIHgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGgubWluKHplcm9MZXZlbCwgemVyb0xldmVsICsgYmFySGVpZ2h0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGJhckhlaWdodClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZGF0YURyYXdBcmVhTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd1hBeGlzKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHgsIHkgKyBoZWlnaHQgKyA1KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAgLyBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0geCArIHN0ZXAgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLCB4UG9zICs9IHN0ZXAsIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhyb3VuZGVkWFBvcywgeSArIGhlaWdodCArIDUpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhyb3VuZGVkWFBvcywgeSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCByb3VuZGVkWFBvcyArIDUsIHkgKyBoZWlnaHQgKyBjdHgubWVhc3VyZVRleHQocG9pbnRzW2ldLmNhdGVnb3J5KS53aWR0aCArIDUpXHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChwb2ludHNbaV0uY2F0ZWdvcnksIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WUF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRpY2tzID0gNSwgemVyb0xldmVsLCBzY2FsZSwgcmFuZ2VTY2FsZSwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMWExYTFhJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gdGlja3MpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgeVBvcyA9IHkgKyBoZWlnaHQgLSBNYXRoLmFicyh6ZXJvTGV2ZWwgLSB5IC0gaGVpZ2h0KSAlIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcykgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHRpY2tzO1xyXG4gICAgICAgICAgICAgICAgIHlQb3MgLT0gaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgaSsrLCBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcyApIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHggLSA1LCB5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChsYWJlbCwgeCAtIGN0eC5tZWFzdXJlVGV4dChsYWJlbCkud2lkdGggLSAxMCwgeVBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVSYW5nZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKCh7bWluLCBtYXgsIG1heE5lZ2F0aXZlLCBtaW5Qb3NpdGl2ZX0sIHt2YWx1ZX0pID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWluOiBNYXRoLm1pbih2YWx1ZSwgbWluKSxcclxuICAgICAgICAgICAgICAgIG1heDogTWF0aC5tYXgodmFsdWUsIG1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICksIHtcclxuICAgICAgICAgICAgbWluOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgbWF4OiAtSW5maW5pdHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja0RhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheSgzMCkuZmlsbChbMSwgLTFdKS5tYXAoKGJpLCBpZHgpID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGBDYXRlZ29yeSR7aWR4ICsgMX1gLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKiBiaVtNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpXSkgLyAxMDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApKVxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ3JhbmRvbWl6ZUNoYXJ0RGF0YScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cyA9IENoYXJ0SXRlbS5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRTY2FsZSgpIHtcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZShzY2FsZSA9IDEpIHtcclxuICAgICAgICB0aGlzLnNjYWxlICo9IHNjYWxlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0SXRlbXMoe3gsIHl9KSB7XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodGVkID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZU91dCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge3g6IGl0ZW1YLCB5OiBpdGVtWSwgd2lkdGgsIGhlaWdodH0gPSBpO1xyXG4gICAgICAgICAgICBpLmhpZ2hsaWdodGVkID0gaXRlbVggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtWCArIHdpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtWSArIGhlaWdodCkgPiB5O1xyXG4gICAgICAgICAgICBpZiAoaS5oaWdobGlnaHRlZCkgaGlnaGxpZ2h0ZWQgPSBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSBoaWdobGlnaHRlZC52YWx1ZTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnt4LCB5fX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7dHlwZSwgb2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JhbmRvbWl6ZUNoYXJ0RGF0YSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucG9pbnRzID0gQ2hhcnRJdGVtLm1vY2tEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHt0aW1lRm9ybWF0fSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbG9jayBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDbG9jayc7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gMjA7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBDbG9jay5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZhbHVlLCBmb250U2l6ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJyMxNjE2MTYnO1xyXG5cdFx0XHRjdHguZm9udCA9IGBib2xkICR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcblx0XHRcdGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQodmFsdWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMCk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IE1hdGguY2VpbChjdHgubWVhc3VyZVRleHQodGhpcy52YWx1ZSkud2lkdGgpICsgMTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMueCA9IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnBvc30pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ2hpZGVUb29sdGlwJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVmFsdWVDaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgQ2xvY2sucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL3ZhbHVlLWl0ZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uSXRlbSB7XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIHN0YXRpYyBjb21wb3NlKHt4LCB5LCBjb2xzLCByb3dzLCBnYXAgPSAyMCwgY3Rvcn0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjdG9yLmdlb21ldHJpYztcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KHJvd3MpLmZpbGwoQXBwLmluc3RhbmNlLmN0eCkucmVkdWNlKChyZXN1bHQsIGN0eCwgcm93KSA9PiAoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcclxuICAgICAgICAgICAgICAgIC4uLm5ldyBBcnJheShjb2xzKS5maWxsKGN0b3IpLm1hcCgoY3RvciwgY29sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2lkLCB4UG9zLCB5UG9zLCB6SW5kZXhdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQubmV4dElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4ICsgY29sICogKHdpZHRoICsgZ2FwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSArIHJvdyAqIChoZWlnaHQgKyBnYXApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocm93ICsgMSkgKiAoY29sICsgMSlcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IGN0b3Ioe2lkLCB4OiB4UG9zLCB5OiB5UG9zLCB2YWx1ZTogVmFsdWVJdGVtLnJhbmRvbVZhbHVlLCB6SW5kZXgsIGN0eH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRSYW5kb21DaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgKSwgW10pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21ib0JveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7d2lkdGggPSBDb21ib0JveC5nZW9tZXRyaWMud2lkdGgsIG1lbnVJdGVtcyA9IFtdLCB2YXJpYWJsZU5hbWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDb21ib0JveCc7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIENvbWJvQm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogdmFyaWFibGVOYW1lLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QuLi4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1lbnVJdGVtcyA9IG1lbnVJdGVtcy5tYXAoKGksIGlkeCkgPT4gKHtcclxuICAgICAgICAgICAgLi4uaSxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgeTogdGhpcy55ICsgdGhpcy5oZWlnaHQgKyBpZHggKiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZDogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB3aWR0aCAtIDIwLFxyXG4gICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZ1bGxIZWlnaHQgPSB0aGlzLmhlaWdodCArIG1lbnVJdGVtcy5sZW5ndGggKiAyMDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGZ1bGxIZWlnaHQsIG9wZW5lZCwgdmFyaWFibGU6IHt0aXRsZX0sIG1lbnVJdGVtc30sIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGJvcmRlckNvbG9yID0gJyM4MDgwODAnO1xyXG4gICAgICAgIGNvbnN0IGZvbnRDb2xvciA9ICcjMjQyNDI0JztcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2M4YzhjOCc7XHJcbiAgICAgICAgY29uc3QgaGlnaGxpZ2h0Q29sb3IgPSAnIzhkOGQ4ZCc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyAzLCBmdWxsSGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB4ICsgd2lkdGggLSBoZWlnaHQsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRpdGxlLCB4ICsgMywgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4ICsgd2lkdGggLSBoZWlnaHQsIHksIGhlaWdodCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHggV2ViZGluZ3MnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChvcGVuZWQgPyAnNScgOiAnNicsIHggKyB3aWR0aCAtIGhlaWdodCAvIDIgLSA1LCB5ICsgaGVpZ2h0IC0gNik7XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGlmICghb3BlbmVkKSByZXR1cm4gY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IG1lbnVJdGVtcy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHlQb3MgPSB5ICsgaGVpZ2h0ICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dChtZW51SXRlbXNbaV0udGl0bGUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICB0ZXh0WVBvcyA9IChoZWlnaHQgLSBmb250SGVpZ2h0KSAvIDIgKyBmb250SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7IGkrKywgeVBvcyA9IHkgKyBoZWlnaHQgKyAxICsgaGVpZ2h0ICogaSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IG1lbnVJdGVtc1tpXS5oaWdobGlnaHRlZCA/IGhpZ2hsaWdodENvbG9yIDogYmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHlQb3MsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChtZW51SXRlbXNbaV0udGl0bGUsIHggKyAzLCB5UG9zICsgdGV4dFlQb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3Zlcih7eCwgeX0pIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9IChcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS54ID4geCB8fFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnkgPiB5IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnggKyB0aGlzLnRyaWdnZXJBcmVhLndpZHRoKSA8IHggfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueSArIHRoaXMudHJpZ2dlckFyZWEuaGVpZ2h0KSA8IHlcclxuICAgICAgICApID8gJ2luaXRpYWwnIDogJ3BvaW50ZXInO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnaW5pdGlhbCc7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKHt4LCB5fSkge1xyXG4gICAgICAgIHN1cGVyLm9uTW91c2VEb3duKHt4LCB5fSk7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnggPiB4IHx8XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueSA+IHkgfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueCArIHRoaXMudHJpZ2dlckFyZWEud2lkdGgpIDwgeCB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS55ICsgdGhpcy50cmlnZ2VyQXJlYS5oZWlnaHQpIDwgeVxyXG4gICAgICAgICkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gIXRoaXMub3BlbmVkO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPyAoXHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpIHx8XHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlZG93bicsIHRoaXMpXHJcbiAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKSB8fFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlZG93bicsIHRoaXMpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1lbnVTZWxlY3Qoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnggPCB4ICYmXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueSA8IHkgJiZcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueCArIHRoaXMudHJpZ2dlckFyZWEud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS55ICsgdGhpcy50cmlnZ2VyQXJlYS5oZWlnaHQpID4geVxyXG4gICAgICAgICkgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHRoaXMubWVudUl0ZW1zLmZpbmQoKHt5OiBtZW51WSwgaGVpZ2h0fSkgPT4gKFxyXG4gICAgICAgICAgICB0aGlzLnggPCB4ICYmXHJcbiAgICAgICAgICAgIG1lbnVZIDwgeSAmJlxyXG4gICAgICAgICAgICAodGhpcy54ICsgdGhpcy53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgIChtZW51WSArIGhlaWdodCkgPiB5XHJcbiAgICAgICAgKSk7XHJcbiAgICAgICAgdGhpcy5oaWRlTWVudSgpO1xyXG4gICAgICAgIHNlbGVjdGVkSXRlbSAmJiAodGhpcy5zZXRWYWx1ZShzZWxlY3RlZEl0ZW0pIHx8IHRoaXMucmVuZGVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVNZW51KCkge1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgQ29tYm9Cb3gucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcih7Li4udGhpcywgLi4ue2hlaWdodDogdGhpcy5mdWxsSGVpZ2h0fX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEl0ZW1zKHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMubWVudUl0ZW1zLmZvckVhY2goaSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHt5OiBpdGVtWSwgaGVpZ2h0fSA9IGk7XHJcbiAgICAgICAgICAgIGkuaGlnaGxpZ2h0ZWQgPSB0aGlzLnggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICBpdGVtWSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICh0aGlzLnggKyB0aGlzLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgIChpdGVtWSArIGhlaWdodCkgPiB5O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWUoe3RpdGxlLCB2YWx1ZX0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMudmFyaWFibGUsIHt0aXRsZSwgdmFsdWV9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCd1cGRhdGVMb2NhbFZhcmlhYmxlJywge2RldGFpbDogdGhpcy52YXJpYWJsZX0pKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudChlKSB7XHJcbiAgICAgICAgc3dpdGNoIChlLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzpcclxuICAgICAgICAgICAgICAgIHRoaXMub25NZW51U2VsZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRocm90dGxlKHRoaXMuaGlnaGxpZ2h0SXRlbXMuYmluZCh0aGlzKSwgZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtDb250ZXh0TWVudX0gZnJvbSBcIi4vY29udGV4dC1tZW51XCI7XHJcbmltcG9ydCB7VG9vbHRpcH0gZnJvbSBcIi4vdG9vbHRpcFwiO1xyXG5pbXBvcnQge0hvdmVyfSBmcm9tIFwiLi9ob3ZlclwiO1xyXG5cclxubGV0IF9pZCA9IDA7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLnggPSAwO1xyXG4gICAgICAgIHRoaXMueSA9IDA7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUNvbmZpZyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdNb3ZlJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0hvcml6b250YWxseScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMZWZ0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt4OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JpZ2h0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt4OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdWZXJ0aWNhbGx5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1VwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt5OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Rvd24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcywge3k6IDIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZXNpemUnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnWCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHcm93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt4OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2hyaW5rJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt4OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnWScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHcm93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt5OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2hyaW5rJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt4OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnSGlkZScsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmhpZGUuYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJyc7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSAwO1xyXG4gICAgICAgIHRoaXMuZmlyc3RSZW5kZXIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgbmV4dElkKCkge1xyXG4gICAgICAgIHJldHVybiAoX2lkKyspLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db250ZXh0TWVudShwb3MpIHtcclxuICAgICAgICBDb250ZXh0TWVudS5pbnN0YW5jZS5zaG93KHsuLi50aGlzLCAuLi5wb3N9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIocG9zKSB7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2Uuc2hvdyh0aGlzKTtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgdGhpcy50b29sdGlwVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5pbml0VG9vbHRpcC5iaW5kKHRoaXMpLCA1MDAsIHsuLi50aGlzLCAuLi5wb3N9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ2hpZGVIb3ZlcicpKTtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb25maWcgPSB0aGlzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHJldHVybiB0aGlzLmZpcnN0UmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCA9IDAsIHkgPSAwfSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB4LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKHt3aWR0aCA9IDAsIGhlaWdodCA9IDB9KSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoey4uLnRoaXMsIC4uLnt2aXNpYmxlOiBmYWxzZX19KTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArIGhlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKGNvbmZpZykge1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2Uuc2hvdyhjb25maWcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoID0gdGhpcy5pbml0aWFsSGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoNTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29udGV4dE1lbnV9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IENvbnRleHRNZW51KHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoOiBmdWxsV2lkdGgsIGhlaWdodDogZnVsbEhlaWdodCwgaW5pdGlhbFdpZHRoOiB3aWR0aCwgaW5pdGlhbEhlaWdodDogaGVpZ2h0LCBjdHhNZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgZnVsbFdpZHRoLCBmdWxsSGVpZ2h0KTtcclxuICAgICAgICBpZiAoIWN0eE1lbnVJdGVtcy5sZW5ndGgpIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTJweCBXZWJkaW5ncyc7XHJcbiAgICAgICAgICAgIGNvbnN0IHt3aWR0aDogYXJyb3dXaWR0aCwgYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGFycm93SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCgnNCcpO1xyXG4gICAgICAgICAgICBjb25zdCB7Y29sbGVjdGlvbn0gPSBjdHhNZW51SXRlbXMucmVkdWNlKGZ1bmN0aW9uIHJlY3Vyc2Uoe3gsIHksIHdpZHRoLCB2aXNpYmxlLCBjb2xsZWN0aW9ufSwge3R5cGUsIHRpdGxlLCBoaWdobGlnaHRlZCwgZGlzYWJsZWQgPSBmYWxzZSwgY2hpbGRyZW4gPSBbXX0sIGlkeCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQodGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXJlYSA9IHt4LCB5OiB5ICsgKGZvbnRIZWlnaHQgKyAxMCkgKiBpZHgsIHdpZHRoLCBoZWlnaHQ6IGZvbnRIZWlnaHQgKyAxMH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHt4LCB5LCB3aWR0aCwgdmlzaWJsZSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNvbGxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLlt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5hcmVhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUsIHRpdGxlLCBoaWdobGlnaHRlZCwgZGlzYWJsZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLnJlZHVjZShyZWN1cnNlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGFyZWEueCArIGFyZWEud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGFyZWEueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGNoaWxkcmVuLnJlZHVjZShDb250ZXh0TWVudS5jYWxjdWxhdGVNYXhXaWR0aCwge2N0eCwgbWF4V2lkdGg6IDB9KS5tYXhXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogaGlnaGxpZ2h0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZpc2libGUpIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBoaWdobGlnaHRlZCA/ICcjOTFiNWM4JyA6ICcjZDBkMGQwJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdC5hcHBseShjdHgsIE9iamVjdC52YWx1ZXMoYXJlYSkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGRpc2FibGVkID8gJyM5ZDlkOWQnIDogJyMxODE4MTgnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgYXJlYS54ICsgMTAsIGFyZWEueSArIGFyZWEuaGVpZ2h0IC0gNSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHggV2ViZGluZ3MnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCc0JywgYXJlYS54ICsgYXJlYS53aWR0aCAtIGFycm93V2lkdGggLSAyLCBhcmVhLnkgKyBhcmVhLmhlaWdodCAvIDIgKyBhcnJvd0hlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICB9LCB7eCwgeSwgd2lkdGgsIHZpc2libGU6IHRydWUsIGNvbGxlY3Rpb246IFtdfSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZmluZEl0ZW1VbmRlclBvaW50ZXIoe3gsIHksIHJpZ2h0ID0gMCwgYm90dG9tID0gMCwgaGlnaGxpZ2h0ZWR9LCBpdGVtKSB7XHJcbiAgICAgICAgbGV0IGhhc0hpZ2hsaWdodGVkQ2hpbGQ7XHJcbiAgICAgICAgaWYgKGl0ZW0uaGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgKHtoaWdobGlnaHRlZDogaGFzSGlnaGxpZ2h0ZWRDaGlsZCwgcmlnaHQsIGJvdHRvbX0gPSBpdGVtLmNoaWxkcmVuLnJlZHVjZShDb250ZXh0TWVudS5maW5kSXRlbVVuZGVyUG9pbnRlciwge3gsIHksIHJpZ2h0LCBib3R0b219KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW0uaGlnaGxpZ2h0ZWQgPSAhaXRlbS5kaXNhYmxlZCAmJiAoXHJcbiAgICAgICAgICAgIGhhc0hpZ2hsaWdodGVkQ2hpbGQgfHwgKFxyXG4gICAgICAgICAgICAgICAgaXRlbS54IDw9IHggJiZcclxuICAgICAgICAgICAgICAgIGl0ZW0ueSA8PSB5ICYmXHJcbiAgICAgICAgICAgICAgICAoaXRlbS54ICsgaXRlbS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICAgICAoaXRlbS55ICsgaXRlbS5oZWlnaHQpID4geVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4LCB5LFxyXG4gICAgICAgICAgICByaWdodDogTWF0aC5tYXgocmlnaHQsIGl0ZW0ueCArIGl0ZW0ud2lkdGgpLFxyXG4gICAgICAgICAgICBib3R0b206IE1hdGgubWF4KGJvdHRvbSwgaXRlbS55ICsgaXRlbS5oZWlnaHQpLFxyXG4gICAgICAgICAgICBoaWdobGlnaHRlZDogaXRlbS5oaWdobGlnaHRlZCB8fCBoaWdobGlnaHRlZFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNhbGN1bGF0ZU1heFdpZHRoKHtjdHgsIG1heFdpZHRofSwge3RpdGxlfSkge1xyXG4gICAgICAgIHJldHVybiB7Y3R4LCBtYXhXaWR0aDogTWF0aC5mbG9vcihNYXRoLm1heChtYXhXaWR0aCwgY3R4Lm1lYXN1cmVUZXh0KHRpdGxlKS53aWR0aCArIDMwKSl9O1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKHt4OiBjbGlja1gsIHk6IGNsaWNrWX0pIHtcclxuICAgICAgICBjb25zdCB7Zm91bmR9ID0gdGhpcy5jdHhNZW51SXRlbXMucmVkdWNlKGZ1bmN0aW9uIHJlY3Vyc2Uoe3pJbmRleDogaGlnaGVzdFpJbmRleCwgZm91bmR9LCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXggPSAxLCBoaWdobGlnaHRlZCwgY2hpbGRyZW4gPSBbXX0gPSBpdGVtO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgekluZGV4ID4gaGlnaGVzdFpJbmRleCAmJlxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHggPCBjbGlja1ggJiZcclxuICAgICAgICAgICAgICAgIHkgPCBjbGlja1kgJiZcclxuICAgICAgICAgICAgICAgICh4ICsgd2lkdGgpID4gY2xpY2tYICYmXHJcbiAgICAgICAgICAgICAgICAoeSArIGhlaWdodCkgPiBjbGlja1kgJiYge3pJbmRleCwgZm91bmQ6IGl0ZW19XHJcbiAgICAgICAgICAgICkgfHwgY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHt6SW5kZXg6IGhpZ2hlc3RaSW5kZXgsIGZvdW5kfSk7XHJcbiAgICAgICAgfSwge3pJbmRleDogLTEsIGZvdW5kOiBudWxsfSk7XHJcbiAgICAgICAgZm91bmQgJiYgZm91bmQudHlwZSAmJiBmb3VuZC50eXBlKCk7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coe3gsIHksIGN0eE1lbnVDb25maWc6IGN0eE1lbnVJdGVtc30pIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSBJbmZpbml0eTtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IGN0eE1lbnVJdGVtcztcclxuICAgICAgICAoe21heFdpZHRoOiB0aGlzLmluaXRpYWxXaWR0aCwgbWF4V2lkdGg6IHRoaXMud2lkdGh9ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShDb250ZXh0TWVudS5jYWxjdWxhdGVNYXhXaWR0aCwge2N0eDogQXBwLmluc3RhbmNlLmN0eCwgbWF4V2lkdGg6IDB9KSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaW5pdGlhbEhlaWdodCA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZSgodG90YWxIZWlnaHQsIHtoZWlnaHR9KSA9PiB0b3RhbEhlaWdodCArPSBoZWlnaHQsIDApO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5hc3NpZ25MYXN0QWN0aXZhdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7ekluZGV4OiAtMSwgY3R4TWVudUl0ZW1zOiBbXX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgd2lkdGg6IDAsIGhlaWdodDogMH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUl0ZW1zID0gQ29udGV4dE1lbnUucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEl0ZW1zKHt4LCB5fSkge1xyXG4gICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qge3JpZ2h0LCBib3R0b219ID0gdGhpcy5jdHhNZW51SXRlbXMucmVkdWNlKENvbnRleHRNZW51LmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7eCwgeSwgcmlnaHQ6IDAsIGJvdHRvbTogMH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHJpZ2h0IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gYm90dG9tIC0gdGhpcy55O1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQoey4uLnRoaXMsIC4uLnt3aWR0aCwgaGVpZ2h0LCB6SW5kZXg6IC0xfX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHt0aHJvdHRsZX0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcyA9IHtkYXRlczogW10sIHJlc3Q6IFtdfTtcclxuICAgICAgICB0aGlzLmluaXRpYXRvciA9IG51bGw7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBEYXRlUGlja2VyLmdlb21ldHJpYyk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7RGF0ZVBpY2tlcn0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgRGF0ZVBpY2tlcih7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyMDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMge3t5ZWFyOiBzdHJpbmcsIG1vbnRoOiBzdHJpbmcsIG9ic2VydmFibGVBcmVhcz86IE9iamVjdFtdLCBkYXRlczogT2JqZWN0W119fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcGVuZWQsIGNhbGVuZGFyRGF0YToge3llYXIsIG1vbnRoLCBkYXRlcyA9IFtdfSwgY3VycmVudERhdGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiB7eWVhciwgbW9udGgsIGRhdGVzfTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDZkOTknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE2cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7d2lkdGg6IG1vbnRoV2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBtb250aEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQobW9udGgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMjBweCBXZWJkaW5ncyc7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBhcnJvd0hlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoJzMnKTtcclxuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoTWF0aC5yb3VuZCh3aWR0aCAvIDIgLSBtb250aFdpZHRoIC0gYXJyb3dXaWR0aCAqIDIgLSAyMCksIDApO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge2U6IGxlZnRBcnJvd1hQb3N9ID0gY3R4LmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCczJywgMCwgYXJyb3dIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoYXJyb3dXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTZweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChtb250aCwgMCwgbW9udGhIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC50cmFuc2xhdGUobW9udGhXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtlOiByaWdodEFycm93WFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcyMHB4IFdlYmRpbmdzJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnNCcsIDAsIGFycm93SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZUFyZWFzID0gW3tcclxuICAgICAgICAgICAgICAgICAgICB4OiBsZWZ0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGFycm93V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudE1vbnRoJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiByaWdodEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBhcnJvd1dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmNyZWFzZUN1cnJlbnRNb250aCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgbGV0IHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoeWVhcik7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoTWF0aC5yb3VuZCh3aWR0aCAvIDIgKyAxMCksIDApO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoeWVhciwgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGZvbnRXaWR0aCArIDUsIDApO1xyXG4gICAgICAgICAgICBjb25zdCB7ZTogeWVhclNwaW5uZXJYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTRweCBXZWJkaW5ncyc7XHJcbiAgICAgICAgICAgICh7d2lkdGg6IGZvbnRXaWR0aCwgYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGZvbnRIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KCc2JykpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJzUnLCAwLCAxNSAtIDMpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJzYnLCAwLCAxNSArIGZvbnRIZWlnaHQgKyAzKTtcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZUFyZWFzID0gW1xyXG4gICAgICAgICAgICAgICAgLi4ub2JzZXJ2YWJsZUFyZWFzLFxyXG4gICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICB4OiB5ZWFyU3Bpbm5lclhQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogZm9udFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmNyZWFzZUN1cnJlbnRZZWFyJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB5ZWFyU3Bpbm5lclhQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSArIDE1LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBmb250V2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNSxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudFllYXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICB5ZWFyLFxyXG4gICAgICAgICAgICAgICAgbW9udGgsXHJcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlQXJlYXMsXHJcbiAgICAgICAgICAgICAgICBkYXRlczogRGF0ZVBpY2tlci5yZW5kZXJDYWxlbmRhckRhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHggKyA0LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHkgKyAzMCArIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gOCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCAtIDMwIC0gOCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRlcyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZVxyXG4gICAgICAgICAgICAgICAgfSwgY3R4KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9cclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXJDYWxlbmRhckRhdGEoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGEsIGN1cnJlbnREYXRlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB5KTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMThweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgbGV0IHhQb3MgPSAwLCByb3VuZGVkWFBvcyA9IDAsIHlQb3MgPSAwLCByb3VuZGVkWVBvcyA9IDAsIGNvbnRlbnRXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSB7XHJcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsOiB3aWR0aCAvIDcsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogaGVpZ2h0IC8gTWF0aC5jZWlsKGRhdGEubGVuZ3RoIC8gNylcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgZm9udFlQb3MgPSBNYXRoLnJvdW5kKGludGVydmFsLnZlcnRpY2FsIC8gMiArIGN0eC5tZWFzdXJlVGV4dCgnMCcpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50IC8gMikgLSAyO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RGF0ZURhdGUgPSBjdXJyZW50RGF0ZS5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBcmVhID0gZGF0YS5yZWR1Y2UoKGNvbGxlY3Rpb24sIGl0ZW0sIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbSkgcmV0dXJuIFsuLi5jb2xsZWN0aW9uLCAuLi5baXRlbV1dO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge2RhdGUsIGhpZ2hsaWdodGVkfSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0N1cnJlbnRTZWxlY3RlZERhdGUgPSBjdXJyZW50RGF0ZURhdGUgPT09IGRhdGU7XHJcbiAgICAgICAgICAgICAgICB4UG9zID0gaSAlIDcgKiBpbnRlcnZhbC5ob3Jpem9udGFsO1xyXG4gICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpO1xyXG4gICAgICAgICAgICAgICAgeVBvcyA9IHhQb3MgPyB5UG9zIDogKGkgPyB5UG9zICsgaW50ZXJ2YWwudmVydGljYWwgOiB5UG9zKTtcclxuICAgICAgICAgICAgICAgIHJvdW5kZWRZUG9zID0gTWF0aC5yb3VuZCh5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGlzQ3VycmVudFNlbGVjdGVkRGF0ZSA/ICdyZWQnIDogJyMwMDNiNmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoaWdobGlnaHRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHJvdW5kZWRYUG9zLCByb3VuZGVkWVBvcywgTWF0aC5yb3VuZChpbnRlcnZhbC5ob3Jpem9udGFsKSAtIDQsIE1hdGgucm91bmQoaW50ZXJ2YWwudmVydGljYWwpIC0gNCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgICAgICAoe3dpZHRoOiBjb250ZW50V2lkdGh9ID0gY3R4Lm1lYXN1cmVUZXh0KGRhdGUpKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChkYXRlLCByb3VuZGVkWFBvcyArIE1hdGgucm91bmQoKGludGVydmFsLmhvcml6b250YWwgLSA0KSAvIDIgLSBjb250ZW50V2lkdGggLyAyKSwgcm91bmRlZFlQb3MgKyBmb250WVBvcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLmNvbGxlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHggKyByb3VuZGVkWFBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogeSArIHJvdW5kZWRZUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogTWF0aC5yb3VuZChpbnRlcnZhbC5ob3Jpem9udGFsKSAtIDQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChpbnRlcnZhbC52ZXJ0aWNhbCkgLSA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWNrRGF0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB9LCBbXSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZGF0YUFyZWE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEB0aGlzIHtEYXRlUGlja2VyLnByb3RvdHlwZX0gKi9cclxuICAgIHN0YXRpYyBmaW5kSXRlbVVuZGVyUG9pbnRlcih7eDogcG9pbnRlclgsIHk6IHBvaW50ZXJZLCBjdXJzb3JUeXBlOiBsYXRlc3RLbm93bkN1cnNvclR5cGUsIHpJbmRleDogaGlnaGVzdFpJbmRleH0sIGFyZWEpIHtcclxuICAgICAgICBpZiAoIWFyZWEpIHJldHVybiB7eDogcG9pbnRlclgsIHk6IHBvaW50ZXJZLCBjdXJzb3JUeXBlOiBsYXRlc3RLbm93bkN1cnNvclR5cGUsIHpJbmRleDogaGlnaGVzdFpJbmRleH07XHJcbiAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHpJbmRleH0gPSBhcmVhO1xyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gekluZGV4ID4gaGlnaGVzdFpJbmRleCAmJlxyXG4gICAgICAgICAgICB4IDwgcG9pbnRlclggJiZcclxuICAgICAgICAgICAgeSA8IHBvaW50ZXJZICYmXHJcbiAgICAgICAgICAgICh4ICsgd2lkdGgpID4gcG9pbnRlclggJiZcclxuICAgICAgICAgICAgKHkgKyBoZWlnaHQpID4gcG9pbnRlclk7XHJcbiAgICAgICAgYXJlYS5oaWdobGlnaHRlZCA9IG1hdGNoO1xyXG4gICAgICAgIHJldHVybiB7Li4ue3g6IHBvaW50ZXJYLCB5OiBwb2ludGVyWX0sIC4uLigobWF0Y2ggJiYgYXJlYSkgfHwge2N1cnNvclR5cGU6IGxhdGVzdEtub3duQ3Vyc29yVHlwZSwgekluZGV4OiBoaWdoZXN0WkluZGV4fSl9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjYWxlbmRhckJ1aWxkZXIoZGF0ZSkge1xyXG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgICAgICBkYXRlLnNldERhdGUoMSk7XHJcbiAgICAgICAgY29uc3QgZGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgICAgICBsZXQgaWR4ID0gKGRhdGUuZ2V0RGF5KCkgKyA2KSAlIDc7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge1xyXG4gICAgICAgICAgICB5ZWFyOiBkYXRlLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgICAgICAgIG1vbnRoOiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgncnUnLCB7bW9udGg6ICdsb25nJ30pXHJcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGRhdGUpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlvQsC3Rj10vLCBtYXRjaCA9PiBtYXRjaC50b1VwcGVyQ2FzZSgpKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IFtdO1xyXG4gICAgICAgIGRvIHtcclxuICAgICAgICAgICAgZGF0YVtpZHgrK10gPSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLmdldERhdGUoKSxcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoK2RhdGUgKyBkYXkpO1xyXG4gICAgICAgIH0gd2hpbGUgKGRhdGUuZ2V0RGF0ZSgpID4gMSk7XHJcbiAgICAgICAgcmV0dXJuIHsuLi5yZXN1bHQsIC4uLntkYXRlczogWy4uLmRhdGFdfX07XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhckRhdGEgPSBEYXRlUGlja2VyLmNhbGVuZGFyQnVpbGRlcih0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3g6IGNsaWNrWCwgeTogY2xpY2tZfSkge1xyXG4gICAgICAgIGNvbnN0IF9maW5kID0gYXJlYSA9PiAoXHJcbiAgICAgICAgICAgIGFyZWEgJiYgYXJlYS54IDwgY2xpY2tYICYmIGFyZWEueSA8IGNsaWNrWSAmJiAoYXJlYS54ICsgYXJlYS53aWR0aCkgPiBjbGlja1ggJiYgKGFyZWEueSArIGFyZWEuaGVpZ2h0KSA+IGNsaWNrWVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3QgYXJlYSA9IHRoaXMuY2FsZW5kYXJEYXRhLm9ic2VydmFibGVBcmVhcy5maW5kKF9maW5kKSB8fCB0aGlzLmNhbGVuZGFyRGF0YS5kYXRlcy5maW5kKF9maW5kKSB8fCB7dHlwZTogJyd9O1xyXG4gICAgICAgIHN3aXRjaCAoYXJlYS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3BpY2tEYXRlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RGF0ZShhcmVhLmRhdGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2luY3JlYXNlQ3VycmVudE1vbnRoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0TW9udGgodGhpcy5jdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVjcmVhc2VDdXJyZW50TW9udGgnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRNb250aCh0aGlzLmN1cnJlbnREYXRlLmdldE1vbnRoKCkgLSAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdpbmNyZWFzZUN1cnJlbnRZZWFyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0RnVsbFllYXIodGhpcy5jdXJyZW50RGF0ZS5nZXRGdWxsWWVhcigpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVjcmVhc2VDdXJyZW50WWVhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldEZ1bGxZZWFyKHRoaXMuY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmluaXRpYXRvci5zZXREYXRlKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coe3ggPSB0aGlzLngsIHkgPSB0aGlzLnksIGluaXRpYXRvcn0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4LCB5LCB6SW5kZXg6IEluZmluaXR5LCBpbml0aWF0b3IsIG9wZW5lZDogdHJ1ZX0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudERhdGUgPSBpbml0aWF0b3IuZGF0ZSB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuYXNzaWduTGFzdEFjdGl2YXRlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge29wZW5lZDogZmFsc2UsIHpJbmRleDogLTF9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIGluaXRpYXRvcjogbnVsbH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0QXJlYXMocG9zKSB7XHJcbiAgICAgICAgKHtjdXJzb3JUeXBlOiBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvcn0gPSBbXHJcbiAgICAgICAgICAgIC4uLnRoaXMuY2FsZW5kYXJEYXRhLmRhdGVzLFxyXG4gICAgICAgICAgICAuLi50aGlzLmNhbGVuZGFyRGF0YS5vYnNlcnZhYmxlQXJlYXNcclxuICAgICAgICBdLnJlZHVjZShEYXRlUGlja2VyLmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7Li4ucG9zLCAuLi57Y3Vyc29yVHlwZTogJ2luaXRpYWwnLCB6SW5kZXg6IC0xfX0pKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRBcmVhcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtkYXRlRm9ybWF0LCB0aHJvdHRsZX0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7RGF0ZVBpY2tlcn0gZnJvbSBcIi4vZGF0ZS1waWNrZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFZGl0Qm94IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt3aWR0aCA9IEVkaXRCb3guZ2VvbWV0cmljLndpZHRoLCBpc0NhbGVuZGFyID0gZmFsc2UsIGRhdGUgPSBpc0NhbGVuZGFyID8gbmV3IERhdGUoKSA6IG51bGwsIHZhbHVlID0gaXNDYWxlbmRhciA/IGRhdGVGb3JtYXQoZGF0ZSkgOiAnJywgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0VkaXRCb3gnO1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYmxpbmtUaW1lb3V0ID0gMDtcclxuICAgICAgICB0aGlzLmNhcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy5pc0NhbGVuZGFyID0gaXNDYWxlbmRhcjtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIEVkaXRCb3guZ2VvbWV0cmljLCB7d2lkdGh9KTtcclxuICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcyA9IFtcclxuICAgICAgICAgICAgLi4uKFxyXG4gICAgICAgICAgICAgICAgaXNDYWxlbmRhciA/IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZm9jdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAndGV4dCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54ICsgdGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc2hvd0NhbGVuZGFyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSA6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ZvY3VzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3RleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogOTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGNhcmV0LCBmb2N1c2VkLCB2YWx1ZSwgaXNDYWxlbmRhcn0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4IC0gMiwgeSAtIDIsIHdpZHRoICsgMywgaGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTRweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY29uc3QgdGV4dFdpZHRoID0gTWF0aC5mbG9vcihjdHgubWVhc3VyZVRleHQodmFsdWUpLndpZHRoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gZm9jdXNlZCA/ICdibGFjaycgOiAnIzY2NjY2Nic7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhcmV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCArIDMgKyB0ZXh0V2lkdGgsIHkgKyAyKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyAzICsgdGV4dFdpZHRoLCB5ICsgaGVpZ2h0IC0gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMWQxZDFkJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAzLCB5ICsgaGVpZ2h0IC0gNCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGlmICghaXNDYWxlbmRhcikgcmV0dXJuIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcyMHB4LzAgV2ViZGluZ3MnO1xyXG4gICAgICAgICAgICBjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KCfCpicpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyM2NjY2NjYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJ8KmJywgeCArIHdpZHRoIC0gaGVpZ2h0LCB5ICsgZm9udEhlaWdodCArIDEpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEB0aGlzIHtFZGl0Qm94LnByb3RvdHlwZX0gKi9cclxuICAgIHN0YXRpYyBkZWZpbmVDdXJzb3JUeXBlKHt4LCB5fSkge1xyXG4gICAgICAgICh7Y3Vyc29yVHlwZTogQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3J9ID0gKFxyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcy5maW5kKGZ1bmN0aW9uKHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHggPCB0aGlzLnggJiYgeSA8IHRoaXMueSAmJiAoeCArIHdpZHRoKSA+IHRoaXMueCAmJiAoeSArIGhlaWdodCkgPiB0aGlzLnk7XHJcbiAgICAgICAgICAgIH0sIHt4LCB5fSkgfHwge2N1cnNvclR5cGU6ICdpbml0aWFsJ31cclxuICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKTtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuYmxpbmtUaW1lb3V0KTtcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNhcmV0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc0NhbGVuZGFyICYmIHRoaXMuc2V0RGF0ZShuZXcgRGF0ZShEYXRlLnBhcnNlKHRoaXMudmFsdWUpKSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5vYnNlcnZhYmxlQXJlYXMuZmluZChmdW5jdGlvbih7eCwgeSwgd2lkdGgsIGhlaWdodH0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHggPCB0aGlzLnggJiYgeSA8IHRoaXMueSAmJiAoeCArIHdpZHRoKSA+IHRoaXMueCAmJiAoeSArIGhlaWdodCkgPiB0aGlzLnk7XHJcbiAgICAgICAgfSwge3gsIHl9KTtcclxuICAgICAgICBpZiAoIWFyZWEpIHJldHVybjtcclxuICAgICAgICBzd2l0Y2ggKGFyZWEudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdmb2N1cyc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnc2hvd0NhbGVuZGFyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0NhbGVuZGFyKHt4LCB5fSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0NhbGVuZGFyKHt4LCB5fSkge1xyXG4gICAgICAgIERhdGVQaWNrZXIuaW5zdGFuY2Uuc2hvdyh7aW5pdGlhdG9yOiB0aGlzLCB4LCB5fSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9jdXMoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMpO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5ibGlua1RpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMuYmxpbmtUaW1lb3V0ID0gc2V0SW50ZXJ2YWwodGhpcy5ibGluay5iaW5kKHRoaXMpLCA1MDApO1xyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jYXJldCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBibGluaygpIHtcclxuICAgICAgICB0aGlzLmNhcmV0ID0gIXRoaXMuY2FyZXQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXREYXRlKGRhdGUgPSB0aGlzLmRhdGUpIHtcclxuICAgICAgICBpZiAoIWRhdGUpIHJldHVybjtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBkYXRlRm9ybWF0KGRhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEVkaXRCb3gucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3Qge3R5cGUsIGtleSwgb2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0gPSBlO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdrZXlkb3duJzpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQmFja3NwYWNlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuc3Vic3RyKDAsIHRoaXMudmFsdWUubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQWx0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdDb250cm9sJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdTaGlmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlICs9IGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGhyb3R0bGUoRWRpdEJveC5kZWZpbmVDdXJzb3JUeXBlLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIb3ZlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7aWR9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtIb3Zlcn0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgSG92ZXIoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBhY3RpdmV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDIsIHkgLSAyLCB3aWR0aCArIDQsIGhlaWdodCArIDQpO1xyXG4gICAgICAgIGlmICghYWN0aXZlKSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZDI5MjknO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge31cclxuXHJcbiAgICBzaG93KHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXggPSAxfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB4IC0gMSxcclxuICAgICAgICAgICAgeTogeSAtIDEsXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCArIDIsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICsgMixcclxuICAgICAgICAgICAgekluZGV4OiB6SW5kZXggLSAxLFxyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgeTogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEhvdmVyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7aWR9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMudGV4dCA9ICcnO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UgPSBkZWJvdW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7VG9vbHRpcH0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgVG9vbHRpcCh7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRleHR9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCA1MDAsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZWE5Zic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzIzMjMyJztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHggKyAxMCwgeSArIGhlaWdodCAtIDEwKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUoKSB7fVxyXG5cclxuICAgIG9uQmx1cigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7fVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge31cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIHNob3coe3gsIHksIHRvb2x0aXBDb250ZW50fSkge1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IEFwcC5pbnN0YW5jZS5jdHg7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY29uc3Qge2FjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBjb250ZW50SGVpZ2h0LCB3aWR0aDogY29udGVudFdpZHRofSA9IGN0eC5tZWFzdXJlVGV4dCh0b29sdGlwQ29udGVudCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeTogeSA+IGNvbnRlbnRIZWlnaHQgKyAyMCA/IHkgLSBjb250ZW50SGVpZ2h0IC0gMjAgOiB5LFxyXG4gICAgICAgICAgICB3aWR0aDogY29udGVudFdpZHRoICsgMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogY29udGVudEhlaWdodCArIDIwLFxyXG4gICAgICAgICAgICB0ZXh0OiB0b29sdGlwQ29udGVudCxcclxuICAgICAgICAgICAgekluZGV4OiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMudGV4dCA9ICcnO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgeTogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGUoe3gsIHl9KSB7XHJcbiAgICAgICAgY29uc3Qge3RleHQsIHpJbmRleH0gPSB0aGlzO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3RleHQ6ICcnLCB6SW5kZXg6IC0xfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHsuLi57eCwgeTogeSAtIHRoaXMuaGVpZ2h0LCB0ZXh0LCB6SW5kZXh9fSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVG9vbHRpcC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLmRlYm91bmNlKHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge3NpbnVzb2lkR2VufSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVuZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ1RyZW5kZXInO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUNvbmZpZyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIEluJyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlICo9IDEuMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gT3V0JyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlICo9IDAuOTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLm1hcCgoe2NhbGxiYWNrLCAuLi5yZXN0fSkgPT4gKHtcclxuICAgICAgICAgICAgLi4ucmVzdCxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmRlYm91bmNlID0gZGVib3VuY2UoKTtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoY29uZmlnLCBjdHgpIHtcclxuICAgICAgICBjb25zdCBjaGFydE1hcmdpbiA9IDIwO1xyXG4gICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBkYXRhOiB7cG9pbnRzfX0gPSBjb25maWc7XHJcbiAgICAgICAgY29uc3QgY2hhcnRBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB4ICsgcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgeTogeSArIHBhZGRpbmdbMF0sXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIHBhZGRpbmdbMV0gLSBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCAtIHBhZGRpbmdbMF0gLSBwYWRkaW5nWzJdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB7bWluLCBtYXh9ID0gVHJlbmRlci5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICBjdHguZmlsbFJlY3QuYXBwbHkoY3R4LCBPYmplY3QudmFsdWVzKGNoYXJ0QXJlYSkpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdZQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWEsIC4uLnt6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9fSwgY3R4KTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdEYXRhKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd0xlZ2VuZCh7Li4uY29uZmlnLCAuLi57XHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHk6IHkgKyBoZWlnaHQgLSA0MCxcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9fSwgY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdEYXRhKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nLCBzY2FsZSwgZGF0YToge3BvaW50cyA9IFtdfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMwMDAwZmYnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgKC1wb2ludHNbMF0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAvIGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc2NhbGVkVmFsdWUgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0gMDtcclxuICAgICAgICAgICAgICAgICBpIDwgbGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgIHhQb3MgKz0gc3RlcCwgc2NhbGVkVmFsdWUgPSAoLXBvaW50c1srK2ldPy52YWx1ZSB8fCAwKSAqIHNjYWxlICogcmFuZ2VTY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4UG9zLCBzY2FsZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzY2FsZWRWYWx1ZSA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgeFBvcyArPSBzdGVwLCBzY2FsZWRWYWx1ZSA9ICgtcG9pbnRzWysraV0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeFBvcyAtIDQsIHNjYWxlZFZhbHVlIC0gNCwgOCwgOCk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4UG9zIC0gNCwgc2NhbGVkVmFsdWUgLSA0LCA4LCA4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WEF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSArIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCwgeSk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHhQb3MgPSB4LFxyXG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gd2lkdGggLyBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKSxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KHBvaW50c1swXS50aW1lKS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbE9mZnNldCA9IE1hdGgucm91bmQobGFiZWxXaWR0aCAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsc0ludGVydmFsID0gTWF0aC5jZWlsKChsYWJlbFdpZHRoICsgMjApIC8gaW50ZXJ2YWwpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5leHRMYWJlbFBvcyA9IHhQb3MgKyBsYWJlbHNJbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBwb2ludHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgIGkrKyxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyArPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpLFxyXG4gICAgICAgICAgICAgICAgICAgICBpc01ham9yVGljayA9ICEoaSAlIGxhYmVsc0ludGVydmFsKSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gaXNNYWpvclRpY2sgPyAnIzNjM2MzYycgOiAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocm91bmRlZFhQb3MsIGlzTWFqb3JUaWNrID8geSArIGhlaWdodCArIDUgOiB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocm91bmRlZFhQb3MsIHkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc01ham9yVGljaykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQocG9pbnRzW2ldLnRpbWUsIHJvdW5kZWRYUG9zIC0gbGFiZWxPZmZzZXQsIHkgKyBoZWlnaHQgKyAyMCk7XHJcbiAgICAgICAgICAgICAgICBuZXh0TGFiZWxQb3MgKz0gbGFiZWxzSW50ZXJ2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd1lBeGlzKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0aWNrcyA9IDIwLCBtYWpvclRpY2tzSW50ZXJ2YWwsIHplcm9MZXZlbCwgc2NhbGUsIHJhbmdlU2NhbGUsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxYTFhMWEnO1xyXG4gICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTRweCBzYW5zLXNlcmlmJztcclxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IGhlaWdodCAvIHRpY2tzO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgucmVjdCh4IC0xMDAsIHksIHdpZHRoICsgMTAwLCBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgeVBvcyA9IHplcm9MZXZlbCArIE1hdGguY2VpbCgoeSArIGhlaWdodCAtIHplcm9MZXZlbCkgLyBpbnRlcnZhbCkgKiBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyksXHJcbiAgICAgICAgICAgICAgICAgbGFiZWwgPSAoKHplcm9MZXZlbCAtIHlQb3MpIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgICAgICAgICAgaXNNYWpvclRpY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgIGkgPCB0aWNrcztcclxuICAgICAgICAgICAgIGkrKyxcclxuICAgICAgICAgICAgICAgIHlQb3MgLT0gaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgcm91bmRlZFlQb3MgPSBNYXRoLnJvdW5kKHlQb3MpLFxyXG4gICAgICAgICAgICAgICAgbGFiZWwgPSAoKHplcm9MZXZlbCAtIHlQb3MgKSAvIHJhbmdlU2NhbGUgLyBzY2FsZSkudG9GaXhlZCgyKSxcclxuICAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IE1hdGguYWJzKHlQb3MgLSB6ZXJvTGV2ZWwpICUgKGludGVydmFsICogbWFqb3JUaWNrc0ludGVydmFsKSA8IGludGVydmFsIC8gMikge1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBpc01ham9yVGljayA/ICcjNDM0MzQzJyA6ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oaXNNYWpvclRpY2sgPyB4IC0gNSA6IHgsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWlzTWFqb3JUaWNrKSBjb250aW51ZTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxhYmVsLCB4IC0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aCAtIDEwLCByb3VuZGVkWVBvcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3TGVnZW5kKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhOiB7bmFtZX19LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiKDAsMCwyNTUpJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KG5hbWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKC0xLCAwLCAwLCAxLCB4ICsgd2lkdGggLyAyIC0gNSwgeSArIGhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCwgNCk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oMjAsIDQpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoNiwgMCwgOCwgOCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KDYsIDAsIDgsIDgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHggKyB3aWR0aCAvIDIgKyA1LCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzE1MTUxNSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChuYW1lLCAwLCBmb250SGVpZ2h0IC0gMik7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplUmFuZ2UoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBkYXRhLnJlZHVjZSgoe21pbiwgbWF4LCBtYXhOZWdhdGl2ZSwgbWluUG9zaXRpdmV9LCB7dmFsdWV9KSA9PiAoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1pbjogTWF0aC5taW4odmFsdWUsIG1pbiksXHJcbiAgICAgICAgICAgICAgICBtYXg6IE1hdGgubWF4KHZhbHVlLCBtYXgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApLCB7XHJcbiAgICAgICAgICAgIG1pbjogSW5maW5pdHksXHJcbiAgICAgICAgICAgIG1heDogLUluZmluaXR5XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1vY2tEYXRhKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KCkgLSAxMDAwICogMjk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheSgzMClcclxuICAgICAgICAgICAgLmZpbGwoc3RhcnRUaW1lKVxyXG4gICAgICAgICAgICAubWFwKCh0aW1lLCBpZHgpID0+IChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSh0aW1lICsgMTAwMCAqIGlkeCkudG9Mb2NhbGVUaW1lU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNpbnVzb2lkR2VuLm5leHQoKS52YWx1ZSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG1vY2tOZXh0RGF0YSgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCd0cmVuZGVyTmV4dFRpY2snLCB7ZGV0YWlsOiB7XHJcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCksXHJcbiAgICAgICAgICAgIHZhbHVlOiBzaW51c29pZEdlbi5uZXh0KCkudmFsdWUsXHJcbiAgICAgICAgfX0pKVxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ3RyZW5kZXJOZXh0VGljaycsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBUcmVuZGVyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7ZGV0YWlsfSkge1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMuc2hpZnQoKTtcclxuICAgICAgICB0aGlzLmRhdGEucG9pbnRzLnB1c2goZGV0YWlsKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWYWx1ZUl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3Ioe3ZhbHVlLCAuLi5wYXJhbXN9KSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnVmFsdWVJdGVtJztcclxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy50b29sdGlwQ29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50cmVuZCA9IDA7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBWYWx1ZUl0ZW0uZ2VvbWV0cmljKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCByYW5kb21WYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAxMDApLnRvRml4ZWQoMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZpc2libGUsIHZhbHVlLCB0cmVuZCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgbGV0IHN0YWNrID0gMDtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF2aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTYxNjE2JztcclxuXHRcdFx0Y3R4LmZvbnQgPSAnYm9sZCAxMnB4IHNlcmlmJztcclxuXHRcdFx0Y29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcblx0XHRcdGlmIChhY3RpdmUpIHtcclxuXHRcdFx0XHRjdHguc2F2ZSgpO1xyXG5cdFx0XHRcdHN0YWNrKys7XHJcblx0XHRcdFx0aWYgKHRyZW5kID4gMCkge1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMDBGRjAwJztcclxuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0cmVuZCA8IDApIHtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnI2U1MDAwMCc7XHJcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFx0XHRjdHguY2xpcCgpO1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG5cdFx0XHRzdGFjayAmJiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJhbmRvbUNoYW5nZSgpIHtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMDAgKyBNYXRoLnJhbmRvbSgpICogNjAwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTW91c2VEb3duKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGV4dCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gdmFsdWUgPiB0aGlzLnZhbHVlID8gMSA6ICh2YWx1ZSA8IHRoaXMudmFsdWUgPyAtMSA6IDApO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYmxpbmsuYmluZCh0aGlzKSwgMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBibGluaygpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25WYWx1ZUNoYW5nZSgpIHtcclxuICAgICAgICB0aGlzLnNldFRleHQoVmFsdWVJdGVtLnJhbmRvbVZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVmFsdWVJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtDb2xsZWN0aW9uSXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW1cIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi9jb21wb25lbnRzL3Rvb2x0aXBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL2NvbXBvbmVudHMvdmFsdWUtaXRlbVwiO1xyXG5pbXBvcnQge0NoYXJ0SXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jaGFydC1pdGVtXCI7XHJcbmltcG9ydCB7RWRpdEJveH0gZnJvbSBcIi4vY29tcG9uZW50cy9lZGl0LWJveFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRleHQtbWVudVwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4vYXBwXCI7XHJcbmltcG9ydCB7QnV0dG9ufSBmcm9tIFwiLi9jb21wb25lbnRzL2J1dHRvblwiO1xyXG5pbXBvcnQge0NvbWJvQm94fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbWJvLWJveFwiO1xyXG5pbXBvcnQge1RyZW5kZXJ9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJlbmRlclwiO1xyXG5pbXBvcnQge0hvdmVyfSBmcm9tIFwiLi9jb21wb25lbnRzL2hvdmVyXCI7XHJcbmltcG9ydCB7Q2xvY2t9IGZyb20gXCIuL2NvbXBvbmVudHMvY2xvY2tcIjtcclxuaW1wb3J0IHtEYXRlUGlja2VyfSBmcm9tIFwiLi9jb21wb25lbnRzL2RhdGUtcGlja2VyXCI7XHJcblxyXG5jb25zdCBjaGFydENvbmZpZyA9IHtcclxuICAgIHR5cGU6ICdjb2x1bW4nLFxyXG4gICAgcGFkZGluZzogWzIwLCAyMCwgNzAsIDcwXSxcclxuICAgIHRpY2tzOiA1LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHBvaW50czogQ2hhcnRJdGVtLm1vY2tEYXRhKCksXHJcbiAgICAgICAgbWFyZ2luOiAwLjFcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHRyZW5kZXJDb25maWcgPSB7XHJcbiAgICBwYWRkaW5nOiBbMjAsIDIwLCA3MCwgNzBdLFxyXG4gICAgdGlja3M6IDIwLFxyXG4gICAgbWFqb3JUaWNrc0ludGVydmFsOiA0LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIG5hbWU6ICdzaW4oeCknLFxyXG4gICAgICAgIHBvaW50czogVHJlbmRlci5tb2NrRGF0YSgpXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBtZW51SXRlbXMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdPbmUnLFxyXG4gICAgICAgIHZhbHVlOiAxLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogJ1R3bycsXHJcbiAgICAgICAgdmFsdWU6IDIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiAnVGhyZWUnLFxyXG4gICAgICAgIHZhbHVlOiAzLFxyXG4gICAgfVxyXG5dO1xyXG5cclxuY29uc3QgYnV0dG9uQ2FsbGJhY2sgPSAoKSA9PiAoXHJcbiAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCdyYW5kb21pemVDaGFydERhdGEnKSlcclxuKTtcclxuXHJcbnNldEludGVydmFsKFRyZW5kZXIubW9ja05leHREYXRhLCAxMDAwKTtcclxuXHJcbkFwcC5pbnN0YW5jZS5jb21wb25lbnRzID0gW1xyXG4gICAgLi4uW1xyXG4gICAgICAgIG5ldyBDbG9jayh7eTogMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pXHJcbiAgICBdLFxyXG4gICAgLi4uQ29sbGVjdGlvbkl0ZW0uY29tcG9zZSh7eDogMCwgeTogMzAsIGNvbHM6IDI1LCByb3dzOiAxMiwgZ2FwOiAyMCwgY3RvcjogVmFsdWVJdGVtfSksXHJcbiAgICAuLi5bXHJcbiAgICAgICAgbmV3IEVkaXRCb3goe3g6IDAsIHk6IDYwMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBFZGl0Qm94KHt4OiAxMDAsIHk6IDYwMCwgd2lkdGg6IDEwMCwgekluZGV4OiAxLCBpc0NhbGVuZGFyOiB0cnVlLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDb21ib0JveCh7eDogMjUwLCB5OiA2MDAsIHpJbmRleDogMSwgdmFyaWFibGVOYW1lOiAnQ29tYm9ib3gxJywgbWVudUl0ZW1zLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDaGFydEl0ZW0oey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiAzMCwgd2lkdGg6IDYwMCwgaGVpZ2h0OiA0MDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9LCAuLi5jaGFydENvbmZpZ30pLFxyXG4gICAgICAgIG5ldyBCdXR0b24oe3g6IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSBCdXR0b24uZ2VvbWV0cmljLndpZHRoLCB5OiA0NTAsIHpJbmRleDogMSwgdmFsdWU6ICdSYW5kb21pemUnLCBjYWxsYmFjazogYnV0dG9uQ2FsbGJhY2ssIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IFRyZW5kZXIoey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiA0OTAsIHdpZHRoOiA2MDAsIGhlaWdodDogNDAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSwgLi4udHJlbmRlckNvbmZpZ30pLFxyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UsXHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UsXHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2UsXHJcbiAgICAgICAgRGF0ZVBpY2tlci5pbnN0YW5jZVxyXG4gICAgXVxyXG5dO1xyXG5cclxuQXBwLmluc3RhbmNlLnJlbmRlcigpO1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2UodGhyZXNob2xkID0gMTAwKSB7XHJcbiAgICBsZXQgdGltZW91dCA9IDA7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIHRocmVzaG9sZCwgYXJnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKHRocmVzaG9sZCA9IDEwMCkge1xyXG4gICAgbGV0IHRpbWVvdXQgPSB0cnVlO1xyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGltZW91dCA9IHRydWUsIHRocmVzaG9sZCk7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICB0aW1lb3V0ICYmIGZuKGFyZyk7XHJcbiAgICAgICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3Qgc2ludXNvaWRHZW4gPSAoZnVuY3Rpb24qICgpIHtcclxuICAgIGNvbnN0IHBlcmlvZCA9IE1hdGguUEkgKiAyO1xyXG4gICAgY29uc3QgcSA9IDAuNTtcclxuICAgIGxldCBfaSA9IDA7XHJcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgTWF0aC5yb3VuZChNYXRoLnNpbihfaSsrICogcSAlIHBlcmlvZCkgKiAxMDAwMCkgLyAxMDA7XHJcbn0pKCk7XHJcblxyXG5jb25zdCB0aW1lRm9ybWF0ID0gKHRpbWVGb3JtYXR0ZXIgPT4ge1xyXG4gICAgcmV0dXJuIHRpbWUgPT4gdGltZUZvcm1hdHRlci5mb3JtYXQodGltZSk7XHJcbn0pKG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdlbicsIHtob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnLCBzZWNvbmQ6ICcyLWRpZ2l0J30pKTtcclxuXHJcbmNvbnN0IGRhdGVGb3JtYXQgPSAoZGF0ZUZvcm1hdHRlciA9PiB7XHJcbiAgICByZXR1cm4gZGF0ZSA9PiBkYXRlRm9ybWF0dGVyLmZvcm1hdChkYXRlKTtcclxufSkobmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2VuJywge2RheTogJzItZGlnaXQnLCBtb250aDogJzItZGlnaXQnLCB5ZWFyOiAnbnVtZXJpYyd9KSk7XHJcblxyXG5leHBvcnQgeyBzaW51c29pZEdlbiwgdGltZUZvcm1hdCwgZGF0ZUZvcm1hdCB9XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9