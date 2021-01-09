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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMvLi9hcHAuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jaGFydC1pdGVtLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvY2xvY2suanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21iby1ib3guanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL2VkaXQtYm94LmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvaG92ZXIuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy90b29sdGlwLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvdHJlbmRlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBbUM7O0FBRW5DOztBQUVPO0FBQ1A7QUFDQTs7QUFFQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0RBQWtELGdEQUFRO0FBQzFEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSwrQkFBK0I7QUFDOUM7QUFDQSxxRkFBcUYsWUFBWTtBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxLQUFLLHlCQUF5QixLQUFLO0FBQzFFO0FBQ0E7O0FBRUEsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBLHFGQUFxRixZQUFZO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLEtBQUs7QUFDN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLGdDQUFnQztBQUNyRCx3RUFBd0UsWUFBWTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0VBQXdFLFlBQVk7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0lzQztBQUNYOztBQUVwQixxQkFBcUIsaURBQVM7QUFDckMsaUJBQWlCLG1DQUFtQyxZQUFZO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixrREFBZ0I7QUFDcEM7QUFDQSwrQkFBK0IsY0FBYztBQUM3QyxtREFBbUQseUNBQXlDO0FBQzVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQSxtQkFBbUIsMERBQTBEO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSxrRUFBZ0M7QUFDeEM7O0FBRUE7QUFDQSxRQUFRLGtFQUFnQztBQUN4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsa0RBQWdCO0FBQzVDO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUZzQztBQUNYO0FBQ1M7O0FBRTdCLHdCQUF3QixpREFBUztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnREFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLHlCQUF5QjtBQUN4QztBQUNBO0FBQ0E7QUFDQSxlQUFlLHFDQUFxQyxRQUFRO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHdCQUF3QjtBQUNyRCw2QkFBNkIsNkJBQTZCLHVCQUF1QjtBQUNqRixtQ0FBbUMsNkJBQTZCLHVCQUF1QjtBQUN2Rjs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLHlCQUF5QjtBQUN4QztBQUNBLHFCQUFxQiw0Q0FBNEMsMEJBQTBCLHdCQUF3QjtBQUNuSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQSxzQkFBc0IsNEJBQTRCLFFBQVE7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUseUJBQXlCO0FBQ3hDO0FBQ0Esc0JBQXNCLHFFQUFxRSxRQUFRO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLG1DQUFtQyxHQUFHLE1BQU07QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLFFBQVE7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHFEQUFtQjtBQUMzQjs7QUFFQTtBQUNBLFFBQVEscURBQW1CO0FBQzNCOztBQUVBO0FBQ0EsUUFBUSx1REFBcUI7QUFDN0I7O0FBRUE7QUFDQSxrREFBa0Qsa0RBQWdCO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixLQUFLO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGtDQUFrQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGLGFBQWEsTUFBTTtBQUNuRztBQUNBOztBQUVBLGlCQUFpQiw2QkFBNkI7QUFDOUM7QUFDQTtBQUNBLCtEQUErRCxLQUFLO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdPc0M7QUFDWDtBQUNTO0FBQ0Y7O0FBRTNCLG9CQUFvQixpREFBUztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLHlCQUF5QjtBQUN4QztBQUNBLG1CQUFtQixxQ0FBcUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0Isa0RBQWdCO0FBQ3BDO0FBQ0Esc0JBQXNCLGtEQUFVO0FBQ2hDO0FBQ0EsK0JBQStCLGNBQWM7QUFDN0M7QUFDQTtBQUNBLGlCQUFpQiwyREFBeUI7QUFDMUM7O0FBRUE7QUFDQTtBQUNBLDRFQUE0RSxnQkFBZ0I7QUFDNUY7O0FBRUE7QUFDQTtBQUNBLFFBQVEsMkRBQXFCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLGtEQUFVO0FBQ2hDOztBQUVBO0FBQ0EsMkJBQTJCLGtEQUFnQjtBQUMzQztBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RFc0M7QUFDWDtBQUNZOztBQUVoQzs7QUFFUCxrQkFBa0IsWUFBWTtBQUM5QixvQkFBb0IsaUNBQWlDO0FBQ3JELGVBQWUsY0FBYztBQUM3QixvQ0FBb0Msa0RBQWdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHdEQUFnQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyw2QkFBNkIsOERBQXFCLGNBQWM7QUFDL0c7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUJzQztBQUNYO0FBQ1M7O0FBRTdCLHVCQUF1QixpREFBUztBQUN2QyxpQkFBaUIsMEVBQTBFO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxNQUFNO0FBQ3ZELHdCQUF3QixnREFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQSxtQkFBbUIsb0RBQW9ELE1BQU0sWUFBWTtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixLQUFLO0FBQ3RCLFFBQVEsa0VBQWdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsa0VBQWdDO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdURBQXFCO0FBQzdCOztBQUVBLGlCQUFpQixLQUFLO0FBQ3RCLDJCQUEyQixLQUFLO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVkscURBQW1CO0FBQy9CLFlBQVkscURBQW1CO0FBQy9CO0FBQ0EsWUFBWSx1REFBcUI7QUFDakMsWUFBWSx1REFBcUI7QUFDakM7QUFDQTs7QUFFQSxrQkFBa0IsdUJBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxpQkFBaUI7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixrREFBZ0I7QUFDOUMsc0JBQXNCLGFBQWEseUJBQXlCO0FBQzVEOztBQUVBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEsY0FBYyxhQUFhO0FBQzNCLHNDQUFzQyxhQUFhO0FBQ25ELHlFQUF5RSxzQkFBc0I7QUFDL0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0syQjtBQUNnQjtBQUNUO0FBQ0o7O0FBRTlCOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLG9FQUF5QixFQUFFLGdCQUFnQjtBQUNuRDs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsUUFBUSx1REFBbUI7QUFDM0I7QUFDQSw0RUFBNEUsZ0JBQWdCO0FBQzVGOztBQUVBO0FBQ0E7QUFDQSxRQUFRLDJEQUFxQjtBQUM3QixRQUFRLHVEQUFtQjtBQUMzQjs7QUFFQTtBQUNBO0FBQ0EsUUFBUSw4REFBNEI7QUFDcEM7O0FBRUEsZUFBZSxhQUFhO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEsWUFBWSxzQkFBc0I7QUFDbEMscUJBQXFCLGFBQWEsZ0JBQWdCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSwyREFBcUI7QUFDN0I7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEZzQztBQUNGO0FBQ1Q7O0FBRTNCOztBQUVPO0FBQ1AsaUJBQWlCLEdBQUc7QUFDcEI7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdEQUFRO0FBQ2hDOztBQUVBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0Esa0VBQWtFLElBQUksd0RBQWdCLENBQUM7QUFDdkY7O0FBRUE7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQTtBQUNBLG1CQUFtQixxR0FBcUc7QUFDeEg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLHdEQUF3RDtBQUMzRSxtQkFBbUIsV0FBVyx5Q0FBeUMsaUNBQWlDLEdBQUcsMERBQTBEO0FBQ3JLO0FBQ0EsdUJBQXVCLHNEQUFzRDtBQUM3RSw4QkFBOEI7QUFDOUIscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJGQUEyRixpQkFBaUI7QUFDNUc7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxHQUFHLDJDQUEyQztBQUMzRDtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLHlDQUF5QztBQUMxRTtBQUNBO0FBQ0EsY0FBYyxnREFBZ0QsMkRBQTJELG9CQUFvQjtBQUM3STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsY0FBYyxHQUFHLE1BQU07QUFDckQsZ0JBQWdCO0FBQ2hCOztBQUVBOztBQUVBO0FBQ0EsUUFBUSxxREFBbUI7QUFDM0I7O0FBRUE7QUFDQSxRQUFRLHVEQUFxQjtBQUM3Qjs7QUFFQSxpQkFBaUIscUJBQXFCO0FBQ3RDLGVBQWUsTUFBTSw4Q0FBOEMsNkJBQTZCO0FBQ2hHLG1CQUFtQiw0REFBNEQ7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLDJDQUEyQyw2QkFBNkI7QUFDeEUsU0FBUyxHQUFHLHdCQUF3QjtBQUNwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFVBQVUsa0NBQWtDO0FBQzVDO0FBQ0EsNkJBQTZCLHFDQUFxQztBQUNsRSxVQUFVLGtEQUFrRCx1REFBdUQsS0FBSyxrREFBZ0IsY0FBYztBQUN0SjtBQUNBLG1GQUFtRixPQUFPO0FBQzFGLFFBQVEsa0VBQWdDO0FBQ3hDOztBQUVBO0FBQ0EsNkJBQTZCLDZCQUE2QjtBQUMxRDtBQUNBLFFBQVEsOERBQTRCO0FBQ3BDLDZCQUE2QixnREFBZ0Q7QUFDN0UsUUFBUSx1REFBcUI7QUFDN0I7O0FBRUE7QUFDQSxxREFBcUQsa0RBQWdCO0FBQ3JFOztBQUVBLG9CQUFvQixLQUFLO0FBQ3pCLGVBQWUsY0FBYztBQUM3QixlQUFlLGNBQWMsK0RBQStELDBCQUEwQjtBQUN0SDtBQUNBO0FBQ0E7QUFDQSxRQUFRLDhEQUE0QixFQUFFLGFBQWEsMkJBQTJCO0FBQzlFOztBQUVBLGlCQUFpQix1QkFBdUI7QUFDeEMsdURBQXVELEtBQUs7QUFDNUQ7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0pzQztBQUNYO0FBQ087O0FBRWxDOztBQUVPO0FBQ1AsaUJBQWlCLEdBQUc7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBLHdCQUF3QixnREFBUTtBQUNoQztBQUNBOztBQUVBLGtCQUFrQixXQUFXO0FBQzdCO0FBQ0EsaUVBQWlFLElBQUksd0RBQWdCLENBQUM7QUFDdEY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUseUJBQXlCO0FBQ3hDLGtCQUFrQjtBQUNsQjtBQUNBLG1CQUFtQiw0Q0FBNEMsd0JBQXdCLGNBQWM7QUFDckc7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHNEQUFzRDtBQUN2RSxtQkFBbUIsa0JBQWtCO0FBQ3JDO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGNBQWMsc0RBQXNEO0FBQ3BFO0FBQ0EsY0FBYyxpQkFBaUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGtCQUFrQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLHlCQUF5QjtBQUN4QztBQUNBO0FBQ0EsK0JBQStCLHVDQUF1QztBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxxQkFBcUI7QUFDcEMsaUNBQWlDLG1GQUFtRjtBQUNwSCwyQkFBMkI7QUFDM0IsZUFBZSw0QkFBNEI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLElBQUkseUJBQXlCLDBCQUEwQix5REFBeUQ7QUFDaEk7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsY0FBYztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxnQkFBZ0IsZUFBZTtBQUMvQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHFEQUFtQjtBQUMzQjs7QUFFQTtBQUNBLFFBQVEsa0VBQWdDO0FBQ3hDLFFBQVEsdURBQXFCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpQkFBaUIscUJBQXFCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLDhHQUE4RztBQUM5RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVUsa0NBQWtDO0FBQzVDLDZCQUE2QixnREFBZ0Q7QUFDN0U7QUFDQTtBQUNBO0FBQ0EsUUFBUSxrRUFBZ0M7QUFDeEM7O0FBRUE7QUFDQSw2QkFBNkIsMEJBQTBCO0FBQ3ZEO0FBQ0EsUUFBUSw4REFBNEI7QUFDcEMsNkJBQTZCLDRDQUE0QztBQUN6RSxRQUFRLHVEQUFxQjtBQUM3Qjs7QUFFQTtBQUNBLG9EQUFvRCxrREFBZ0I7QUFDcEU7O0FBRUE7QUFDQSxVQUFVLFlBQVksa0VBQWdDLENBQUM7QUFDdkQ7QUFDQTtBQUNBLG1EQUFtRCxZQUFZLG1DQUFtQztBQUNsRztBQUNBOztBQUVBLGlCQUFpQix1QkFBdUI7QUFDeEMsdURBQXVELEtBQUs7QUFDNUQ7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hTc0M7QUFDWDtBQUNtQjtBQUNMOztBQUVsQyxzQkFBc0IsaURBQVM7QUFDdEMsaUJBQWlCLGlIQUFpSCxrREFBVSx1QkFBdUI7QUFDbks7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsTUFBTTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0RBQVE7QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUseUJBQXlCO0FBQ3hDO0FBQ0EsbUJBQW1CLHVDQUF1QztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlLGtCQUFrQjtBQUNqQyw2QkFBNkIsS0FBSztBQUNsQyxVQUFVLFlBQVksa0VBQWdDLENBQUM7QUFDdkQsZ0RBQWdELG9CQUFvQjtBQUNwRTtBQUNBLGFBQWEsR0FBRyxLQUFLLE1BQU07QUFDM0I7QUFDQTs7QUFFQTtBQUNBLFFBQVEscURBQW1CO0FBQzNCOztBQUVBO0FBQ0EsUUFBUSxrRUFBZ0M7QUFDeEMsUUFBUSx1REFBcUI7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixLQUFLO0FBQ3RCLHlEQUF5RCxvQkFBb0I7QUFDN0U7QUFDQSxTQUFTLEdBQUcsS0FBSztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsS0FBSztBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsS0FBSztBQUN2QixRQUFRLGtFQUF3QixFQUFFLHNCQUFzQjtBQUN4RDs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLCtEQUE2QjtBQUM5QyxrQkFBa0IsZ0VBQThCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixvQkFBb0I7QUFDeEMscUJBQXFCLHFCQUFxQjtBQUMxQyxzQkFBc0Isd0RBQXdEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUywrQkFBK0I7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixrREFBVTtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLGtEQUFnQjtBQUM3QztBQUNBOztBQUVBLGlCQUFpQixrQ0FBa0M7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsS0FBSztBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pNc0M7QUFDWDs7QUFFM0I7O0FBRU87QUFDUCxpQkFBaUIsR0FBRztBQUNwQjtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLE1BQU07QUFDeEI7QUFDQSw0REFBNEQsSUFBSSx3REFBZ0IsQ0FBQztBQUNqRjs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLHlCQUF5QjtBQUN4QztBQUNBLG1CQUFtQiw0QkFBNEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsVUFBVSxnQ0FBZ0M7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQSwyQkFBMkIsa0RBQWdCO0FBQzNDLFFBQVEsOERBQTRCO0FBQ3BDO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JFc0M7QUFDRjtBQUNUOztBQUUzQjs7QUFFTztBQUNQLGlCQUFpQixHQUFHO0FBQ3BCO0FBQ0E7QUFDQSx3QkFBd0IsZ0RBQVE7QUFDaEM7O0FBRUEsa0JBQWtCLFFBQVE7QUFDMUI7QUFDQSw4REFBOEQsSUFBSSx3REFBZ0IsQ0FBQztBQUNuRjs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLHlCQUF5QjtBQUN4QztBQUNBLG1CQUFtQiwwQkFBMEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsVUFBVSxxQkFBcUI7QUFDL0IsZUFBZSxjQUFjLG9CQUFvQixHQUFHLDhDQUFZO0FBQ2hFO0FBQ0E7QUFDQSxtQkFBbUIsNERBQTREO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLHFEQUFtQjtBQUMzQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUSx1REFBcUI7QUFDN0I7O0FBRUEsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsYUFBYTtBQUM1Qiw2QkFBNkIscUJBQXFCO0FBQ2xEO0FBQ0EsNkJBQTZCLElBQUkscUNBQXFDO0FBQ3RFO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsa0RBQWdCO0FBQzdDLFFBQVEsOERBQTRCO0FBQ3BDOztBQUVBLGlCQUFpQix1QkFBdUI7QUFDeEMsa0RBQWtELEtBQUs7QUFDdkQ7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEdzQztBQUNYO0FBQ1M7QUFDQzs7QUFFOUIsc0JBQXNCLGlEQUFTO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCx3QkFBd0IsZ0RBQVE7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLHlCQUF5QjtBQUN4QztBQUNBO0FBQ0E7QUFDQSxlQUFlLHFDQUFxQyxRQUFRO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHdCQUF3QjtBQUNuRCwyQkFBMkIsNkJBQTZCLHVCQUF1QjtBQUMvRSwwQkFBMEIsNkJBQTZCLHVCQUF1QjtBQUM5RSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQSxxQkFBcUIsNENBQTRDLFlBQVksd0JBQXdCO0FBQ3JHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUseUJBQXlCO0FBQ3hDO0FBQ0Esc0JBQXNCLDRCQUE0QixRQUFRO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUseUJBQXlCO0FBQ3hDO0FBQ0Esc0JBQXNCLDBGQUEwRixRQUFRO0FBQ3hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQSx1QkFBdUIsNEJBQTRCLE1BQU07QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QixtQ0FBbUMsR0FBRyxNQUFNO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLG9EQUFnQjtBQUMzQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHVEQUFxQixxQ0FBcUM7QUFDbEU7QUFDQSxtQkFBbUIsb0RBQWdCO0FBQ25DLFVBQVU7QUFDVjs7QUFFQTtBQUNBLFFBQVEscURBQW1CO0FBQzNCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsa0RBQWdCO0FBQzdDO0FBQ0E7O0FBRUEsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvUHNDO0FBQ1g7O0FBRXBCLHdCQUF3QixpREFBUztBQUN4QyxpQkFBaUIsaUJBQWlCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsT0FBTztBQUN4RSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBLGlFQUFpRSxNQUFNO0FBQ3ZFO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRSxPQUFPO0FBQ3hFLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsaUVBQWlFLE1BQU07QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RCxNQUFNO0FBQ3BFLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsOERBQThELE9BQU87QUFDckU7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThELE1BQU07QUFDcEUsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQSw4REFBOEQsT0FBTztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQSxtQkFBbUIsbURBQW1EO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUErQixrREFBZ0I7QUFDL0M7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdKaUQ7QUFDVztBQUNmO0FBQ0s7QUFDQTtBQUNKO0FBQ1E7QUFDNUI7QUFDaUI7QUFDSztBQUNIO0FBQ0o7QUFDQTtBQUNXOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHNFQUFrQjtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtFQUFnQjtBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSx1REFBcUI7QUFDekI7O0FBRUEsWUFBWSxzRUFBb0I7O0FBRWhDLHlEQUF1QjtBQUN2QjtBQUNBLFlBQVkscURBQUssRUFBRSxxQkFBcUIsbUVBQWdCLENBQUM7QUFDekQ7QUFDQSxPQUFPLCtFQUFzQixFQUFFLGdEQUFnRCw2REFBUyxDQUFDO0FBQ3pGO0FBQ0EsWUFBWSx5REFBTyxFQUFFLDZCQUE2QixtRUFBZ0IsQ0FBQztBQUNuRSxZQUFZLHlEQUFPLEVBQUUsNkRBQTZELG1FQUFnQixDQUFDO0FBQ25HLFlBQVksMkRBQVEsRUFBRSxxRUFBcUUsbUVBQWdCLENBQUM7QUFDNUcsWUFBWSw2REFBUyxFQUFFLElBQUksR0FBRywyREFBeUIsdURBQXVELG1FQUFnQixDQUFDLGlCQUFpQjtBQUNoSixZQUFZLHNEQUFNLEVBQUUsR0FBRywyREFBeUIsR0FBRyxzRUFBc0IsdUVBQXVFLG1FQUFnQixDQUFDO0FBQ2pLLFlBQVkseURBQU8sRUFBRSxJQUFJLEdBQUcsMkRBQXlCLHdEQUF3RCxtRUFBZ0IsQ0FBQyxtQkFBbUI7QUFDakosUUFBUSxpRUFBZ0I7QUFDeEIsUUFBUSw4REFBYztBQUN0QixRQUFRLDBFQUFvQjtBQUM1QixRQUFRLHlFQUFtQjtBQUMzQjtBQUNBOztBQUVBLHFEQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzNFWjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDLGlDQUFpQyxzREFBc0Q7O0FBRXhGO0FBQ0E7QUFDQSxDQUFDLGlDQUFpQyxrREFBa0Q7O0FBRXRDOzs7Ozs7O1VDaEM5QztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzPzkzOTJjYTFjNGYxZThiMGFjYmZhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi91dGlsc1wiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG4gICAgY29uc3RydWN0b3IoY2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSB7Q29tcG9uZW50W119ICovXHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnIzIyMjIyMic7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyM3YWZmZDEnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSAnMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IEFwcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgb25Db250ZXh0TWVudShlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtDb21wb25lbnRbXX0gY29tcG9uZW50cyAqL1xyXG4gICAgc2V0IGNvbXBvbmVudHMoY29tcG9uZW50cykge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMgPSBjb21wb25lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29tcG9uZW50W119ICovXHJcbiAgICBnZXQgY29tcG9uZW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50cztcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aHJvdHRsZSgpLmJpbmQodW5kZWZpbmVkLCB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcykpKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIEFwcC5vbkNvbnRleHRNZW51KTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaChlKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuZGlzcGF0Y2hFdmVudChlKTtcclxuICAgIH1cclxuXHJcbiAgICBsaXN0ZW4oZXZlbnRUeXBlLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubGlzdGVuKGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIHRoaXMubGFzdEFjdGl2YXRlZC5vbk1vdXNlVXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5LCBidXR0b259ID0gZTtcclxuICAgICAgICBsZXQgdG9wTW9zdDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgekluZGV4ID0gLTEsIGl0ZW1zID0gdGhpcy5fY29tcG9uZW50cywgbGVuZ3RoID0gaXRlbXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS54IDwgeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnggKyBpdGVtc1tpXS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID4geVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRvcE1vc3QgPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIHpJbmRleCA9IHRvcE1vc3QuekluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICFPYmplY3QuaXModG9wTW9zdCwgdGhpcy5sYXN0QWN0aXZhdGVkKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgJiYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkLm9uQmx1cigpIHx8IHRoaXMubGFzdEFjdGl2YXRlZC5vbk1vdXNlT3V0KClcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCA9IHRvcE1vc3Q7XHJcbiAgICAgICAgdG9wTW9zdCAmJiAoXHJcbiAgICAgICAgICAgIGJ1dHRvbiA9PT0gMiA/XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0Lm9uQ29udGV4dE1lbnUoe3gsIHl9KSA6IHRvcE1vc3Qub25Nb3VzZURvd24oe3gsIHl9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU1vdmUoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgbGV0IHRvcE1vc3Q7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIHpJbmRleCA9IC0xLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnpJbmRleCA+IHpJbmRleCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChpdGVtc1tpXS55ICsgaXRlbXNbaV0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0b3BNb3N0ID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICB6SW5kZXggPSB0b3BNb3N0LnpJbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAhT2JqZWN0LmlzKHRvcE1vc3QsIHRoaXMubGFzdEhvdmVyZWQpICYmXHJcbiAgICAgICAgICAgIHRoaXMubGFzdEhvdmVyZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEhvdmVyZWQub25Nb3VzZU91dCgpO1xyXG4gICAgICAgIHRoaXMubGFzdEhvdmVyZWQgPSB0b3BNb3N0O1xyXG4gICAgICAgIHRvcE1vc3QgJiYgdG9wTW9zdC5vbk1vdXNlT3Zlcih7eCwgeX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2lnbkxhc3RBY3RpdmF0ZWQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkICYmIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVwYWludEFmZmVjdGVkKHtpZCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4fSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLmlkICE9PSBpZCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPj0geSAmJiBpdGVtc1tpXS55IDw9ICh5ICsgaGVpZ2h0KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55IDw9IHkgJiYgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID49IHlcclxuICAgICAgICAgICAgICAgICAgICApICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA+PSB4ICYmIGl0ZW1zW2ldLnggPD0gKHggKyB3aWR0aCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueCA8PSB4ICYmIChpdGVtc1tpXS54ICsgaXRlbXNbaV0ud2lkdGgpID49IHhcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0ucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpdGVtcyA9IHRoaXMuX2NvbXBvbmVudHMsIGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt2YWx1ZT0gJ0FwcGx5JywgY2FsbGJhY2sgPSAoKSA9PiB7fSwgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ0J1dHRvbic7XHJcbiAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSAxMjtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBCdXR0b24uZ2VvbWV0cmljLCB7d2lkdGg6IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggKyAyMH0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgdGhpcy54ICs9IEJ1dHRvbi5nZW9tZXRyaWMud2lkdGggLSB0aGlzLndpZHRoIC0gMjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgZm9udFNpemUsIHByZXNzZWQsIHJhZGl1cyA9IDN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDMsIHkgLSAzLCB3aWR0aCArIDksIGhlaWdodCArIDkpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2EyYTJhMic7XHJcbiAgICAgICAgICAgIGlmICghcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjYjFiMWIxJztcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDEyNywxMjcsMTI3LDAuNyknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCArIHdpZHRoLCB5LCB4ICsgd2lkdGgsIHkgKyByYWRpdXMsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSArIGhlaWdodCwgeCArIHdpZHRoIC0gcmFkaXVzLCB5ICsgaGVpZ2h0LCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cywgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHgsIHksIHggKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChwcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4ICsgMiwgeSArIDIgKyBoZWlnaHQgLSByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMiwgeSArIDIgKyByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyY1RvKHggKyAyLCB5ICsgMiwgeCArIDIgKyByYWRpdXMsIHksIHJhZGl1cyk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyAyICsgd2lkdGggLSByYWRpdXMsIHkgKyAyKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzUzNTM1JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQodmFsdWUsIHggKyAxMCwgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bigpO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEJ1dHRvbi5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYXJ0SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDaGFydEl0ZW0nO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuZGF0YURyYXdBcmVhTWFwID0gW107XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zZXRTY2FsZS5iaW5kKHRoaXMsIDEuMSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIE91dCcsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnNldFNjYWxlLmJpbmQodGhpcywgMC45KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gUmVzZXQnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNldFNjYWxlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKGNvbmZpZywgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgY2hhcnRNYXJnaW4gPSAyMDtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgZGF0YToge3BvaW50c319ID0gY29uZmlnO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0QXJlYSA9IHtcclxuICAgICAgICAgICAgeDogeCArIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIHk6IHkgKyBwYWRkaW5nWzBdLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggLSBwYWRkaW5nWzFdIC0gcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSBwYWRkaW5nWzBdIC0gcGFkZGluZ1syXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qge21pbiwgbWF4fSA9IENoYXJ0SXRlbS5ub3JtYWxpemVSYW5nZShwb2ludHMpO1xyXG4gICAgICAgIGNvbnN0IHJhbmdlU2NhbGUgPSAoY2hhcnRBcmVhLmhlaWdodCAtIGNoYXJ0TWFyZ2luKSAvIChtYXggLSBtaW4pO1xyXG4gICAgICAgIGNvbnN0IHplcm9MZXZlbCA9IE1hdGguZmxvb3IoKGNoYXJ0QXJlYS55ICsgY2hhcnRNYXJnaW4gLyAyKSArIG1heCAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxMjcsIDEyNywgMTI3LCAwLjIpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhjaGFydEFyZWEpKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIENoYXJ0SXRlbS5kcmF3WEF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhfSwgY3R4KTtcclxuICAgICAgICBDaGFydEl0ZW0uZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIHJldHVybiBDaGFydEl0ZW0uZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3RGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgc2NhbGUsIGRhdGE6IHtwb2ludHMgPSBbXSwgbWFyZ2luID0gMC4yfSwgemVyb0xldmVsLCByYW5nZVNjYWxlfSwgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgZGF0YURyYXdBcmVhTWFwID0gWy4uLnBvaW50c107XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB6ZXJvTGV2ZWwpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBiYXJXaWR0aCA9IHN0ZXAgKiAoMSAtIG1hcmdpbiksXHJcbiAgICAgICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSBzdGVwIC8gMiAtIGJhcldpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3R5bGUgPSBwb2ludHNbaV0udmFsdWUgPiAwID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHBvaW50c1tpXS5oaWdobGlnaHRlZCA/ICcjODEwMDAwJyA6ICcjZmYwMDAwJyk7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCkge1xyXG4gICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gcG9pbnRzW2ldLnZhbHVlID4gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzAwNmIwMCcgOiAnIzAwZmYwMCcpIDpcclxuICAgICAgICAgICAgICAgICAgICAocG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyM4MTAwMDAnIDogJyNmZjAwMDAnKTtcclxuICAgICAgICAgICAgICAgIGJhckhlaWdodCA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGU7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHhQb3MsIDAsIGJhcldpZHRoLCAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlKTtcclxuICAgICAgICAgICAgICAgIGRhdGFEcmF3QXJlYU1hcFtpXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi5kYXRhRHJhd0FyZWFNYXBbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4UG9zICsgeCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogTWF0aC5taW4oemVyb0xldmVsLCB6ZXJvTGV2ZWwgKyBiYXJIZWlnaHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFyV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogTWF0aC5hYnMoYmFySGVpZ2h0KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBkYXRhRHJhd0FyZWFNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WEF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtwb2ludHN9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMzYzNjM2MnO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSArIGhlaWdodCArIDUpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoICAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSB4ICsgc3RlcCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKTtcclxuICAgICAgICAgICAgICAgICBpIDwgcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssIHhQb3MgKz0gc3RlcCwgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHJvdW5kZWRYUG9zLCB5ICsgaGVpZ2h0ICsgNSk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHJvdW5kZWRYUG9zLCB5KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHJvdW5kZWRYUG9zICsgNSwgeSArIGhlaWdodCArIGN0eC5tZWFzdXJlVGV4dChwb2ludHNbaV0uY2F0ZWdvcnkpLndpZHRoICsgNSlcclxuICAgICAgICAgICAgICAgICAgICBjdHgucm90YXRlKC1NYXRoLlBJIC8gMik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHBvaW50c1tpXS5jYXRlZ29yeSwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdZQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgdGlja3MgPSA1LCB6ZXJvTGV2ZWwsIHNjYWxlLCByYW5nZVNjYWxlLCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxYTFhMWEnO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gTWF0aC5mbG9vcihoZWlnaHQgLyB0aWNrcyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICB5UG9zID0geSArIGhlaWdodCAtIE1hdGguYWJzKHplcm9MZXZlbCAtIHkgLSBoZWlnaHQpICUgaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zKSAvIHJhbmdlU2NhbGUgLyBzY2FsZSkudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICAgICBpIDwgdGlja3M7XHJcbiAgICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICBpKyssIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zICkgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCAtIDUsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGgsIHlQb3MpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGxhYmVsLCB4IC0gY3R4Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aCAtIDEwLCB5UG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG5vcm1hbGl6ZVJhbmdlKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoKHttaW4sIG1heCwgbWF4TmVnYXRpdmUsIG1pblBvc2l0aXZlfSwge3ZhbHVlfSkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtaW46IE1hdGgubWluKHZhbHVlLCBtaW4pLFxyXG4gICAgICAgICAgICAgICAgbWF4OiBNYXRoLm1heCh2YWx1ZSwgbWF4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKSwge1xyXG4gICAgICAgICAgICBtaW46IEluZmluaXR5LFxyXG4gICAgICAgICAgICBtYXg6IC1JbmZpbml0eVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtb2NrRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKS5maWxsKFsxLCAtMV0pLm1hcCgoYmksIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogYENhdGVnb3J5JHtpZHggKyAxfWAsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAqIGJpW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSldKSAvIDEwMCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigncmFuZG9taXplQ2hhcnREYXRhJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEucG9pbnRzID0gQ2hhcnRJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldFNjYWxlKCkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlKHNjYWxlID0gMSkge1xyXG4gICAgICAgIHRoaXMuc2NhbGUgKj0gc2NhbGU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7eCwgeX0pIHtcclxuICAgICAgICBsZXQgaGlnaGxpZ2h0ZWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICBzdXBlci5vbk1vdXNlT3V0KCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7eDogaXRlbVgsIHk6IGl0ZW1ZLCB3aWR0aCwgaGVpZ2h0fSA9IGk7XHJcbiAgICAgICAgICAgIGkuaGlnaGxpZ2h0ZWQgPSBpdGVtWCA8IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtWSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1YICsgd2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgICAgIGlmIChpLmhpZ2hsaWdodGVkKSBoaWdobGlnaHRlZCA9IGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBpZiAoaGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9IGhpZ2hsaWdodGVkLnZhbHVlO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ue3gsIHl9fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHt0eXBlLCBvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEl0ZW1zLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmFuZG9taXplQ2hhcnREYXRhJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wb2ludHMgPSBDaGFydEl0ZW0ubW9ja0RhdGEoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge3RpbWVGb3JtYXR9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbG9jayBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDbG9jayc7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSAnJztcclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gMjA7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBDbG9jay5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZhbHVlLCBmb250U2l6ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJyMxNjE2MTYnO1xyXG5cdFx0XHRjdHguZm9udCA9IGBib2xkICR7Zm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcblx0XHRcdGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQodmFsdWUpLmFjdHVhbEJvdW5kaW5nQm94QXNjZW50O1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gQXBwLmluc3RhbmNlLmN0eDtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMCk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9IGBib2xkICR7dGhpcy5mb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IE1hdGguY2VpbChjdHgubWVhc3VyZVRleHQodGhpcy52YWx1ZSkud2lkdGgpICsgMTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMueCA9IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnBvc30pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVmFsdWVDaGFuZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aW1lRm9ybWF0KERhdGUubm93KCkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgQ2xvY2sucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL3ZhbHVlLWl0ZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uSXRlbSB7XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb21wb25lbnRbXX0gKi9cclxuICAgIHN0YXRpYyBjb21wb3NlKHt4LCB5LCBjb2xzLCByb3dzLCBnYXAgPSAyMCwgY3Rvcn0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjdG9yLmdlb21ldHJpYztcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KHJvd3MpLmZpbGwoQXBwLmluc3RhbmNlLmN0eCkucmVkdWNlKChyZXN1bHQsIGN0eCwgcm93KSA9PiAoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcclxuICAgICAgICAgICAgICAgIC4uLm5ldyBBcnJheShjb2xzKS5maWxsKGN0b3IpLm1hcCgoY3RvciwgY29sKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2lkLCB4UG9zLCB5UG9zLCB6SW5kZXhdID0gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQubmV4dElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4ICsgY29sICogKHdpZHRoICsgZ2FwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeSArIHJvdyAqIChoZWlnaHQgKyBnYXApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocm93ICsgMSkgKiAoY29sICsgMSlcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IGN0b3Ioe2lkLCB4OiB4UG9zLCB5OiB5UG9zLCB2YWx1ZTogVmFsdWVJdGVtLnJhbmRvbVZhbHVlLCB6SW5kZXgsIGN0eH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXRSYW5kb21DaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgKSwgW10pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21ib0JveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7d2lkdGggPSBDb21ib0JveC5nZW9tZXRyaWMud2lkdGgsIG1lbnVJdGVtcyA9IFtdLCB2YXJpYWJsZU5hbWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdDb21ib0JveCc7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIENvbWJvQm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZSA9IHtcclxuICAgICAgICAgICAgbmFtZTogdmFyaWFibGVOYW1lLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QuLi4nXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm1lbnVJdGVtcyA9IG1lbnVJdGVtcy5tYXAoKGksIGlkeCkgPT4gKHtcclxuICAgICAgICAgICAgLi4uaSxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgeTogdGhpcy55ICsgdGhpcy5oZWlnaHQgKyBpZHggKiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZDogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJBcmVhID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB3aWR0aCAtIDIwLFxyXG4gICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgIHdpZHRoOiAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZ1bGxIZWlnaHQgPSB0aGlzLmhlaWdodCArIG1lbnVJdGVtcy5sZW5ndGggKiAyMDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogNzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGZ1bGxIZWlnaHQsIG9wZW5lZCwgdmFyaWFibGU6IHt0aXRsZX0sIG1lbnVJdGVtc30sIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGJvcmRlckNvbG9yID0gJyM4MDgwODAnO1xyXG4gICAgICAgIGNvbnN0IGZvbnRDb2xvciA9ICcjMjQyNDI0JztcclxuICAgICAgICBjb25zdCBiYWNrZ3JvdW5kQ29sb3IgPSAnI2M4YzhjOCc7XHJcbiAgICAgICAgY29uc3QgaGlnaGxpZ2h0Q29sb3IgPSAnIzhkOGQ4ZCc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyAzLCBmdWxsSGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZvbnRDb2xvcjtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB4ICsgd2lkdGggLSBoZWlnaHQsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRpdGxlLCB4ICsgMywgeSArIGhlaWdodCAtIDUpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4ICsgd2lkdGggLSBoZWlnaHQsIHksIGhlaWdodCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG9wZW5lZCA/ICdcXHUyNUIyJyA6ICdcXHUyNUJDJywgeCArIHdpZHRoIC0gaGVpZ2h0IC8gMiAtIDUsIHkgKyBoZWlnaHQgLSA2KTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gbWVudUl0ZW1zLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgeVBvcyA9IHkgKyBoZWlnaHQgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgIHRleHRZUG9zID0gKGhlaWdodCAtIGZvbnRIZWlnaHQpIC8gMiArIGZvbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDsgaSsrLCB5UG9zID0geSArIGhlaWdodCArIDEgKyBoZWlnaHQgKiBpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbWVudUl0ZW1zW2ldLmhpZ2hsaWdodGVkID8gaGlnaGxpZ2h0Q29sb3IgOiBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeVBvcywgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG1lbnVJdGVtc1tpXS50aXRsZSwgeCArIDMsIHlQb3MgKyB0ZXh0WVBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHt4LCB5fSkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gKFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnggPiB4IHx8XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueSA+IHkgfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueCArIHRoaXMudHJpZ2dlckFyZWEud2lkdGgpIDwgeCB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS55ICsgdGhpcy50cmlnZ2VyQXJlYS5oZWlnaHQpIDwgeVxyXG4gICAgICAgICkgPyAnaW5pdGlhbCcgOiAncG9pbnRlcic7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3gsIHl9KSB7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZURvd24oe3gsIHl9KTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA+IHggfHxcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55ID4geSB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPCB4IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPCB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLm9wZW5lZCA/IChcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcykgfHxcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApIDogKFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpIHx8XHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vkb3duJywgdGhpcylcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTWVudVNlbGVjdCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA8IHggJiZcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55IDwgeSAmJlxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPiB5XHJcbiAgICAgICAgKSByZXR1cm47XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gdGhpcy5tZW51SXRlbXMuZmluZCgoe3k6IG1lbnVZLCBoZWlnaHR9KSA9PiAoXHJcbiAgICAgICAgICAgIHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgbWVudVkgPCB5ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnggKyB0aGlzLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgKG1lbnVZICsgaGVpZ2h0KSA+IHlcclxuICAgICAgICApKTtcclxuICAgICAgICB0aGlzLmhpZGVNZW51KCk7XHJcbiAgICAgICAgc2VsZWN0ZWRJdGVtICYmICh0aGlzLnNldFZhbHVlKHNlbGVjdGVkSXRlbSkgfHwgdGhpcy5yZW5kZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZU1lbnUoKSB7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBDb21ib0JveC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKHsuLi50aGlzLCAuLi57aGVpZ2h0OiB0aGlzLmZ1bGxIZWlnaHR9fSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0SXRlbXMoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgdGhpcy5tZW51SXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge3k6IGl0ZW1ZLCBoZWlnaHR9ID0gaTtcclxuICAgICAgICAgICAgaS5oaWdobGlnaHRlZCA9IHRoaXMueCA8IHggJiZcclxuICAgICAgICAgICAgICAgIGl0ZW1ZIDwgeSAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMueCArIHRoaXMud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW1ZICsgaGVpZ2h0KSA+IHk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh7dGl0bGUsIHZhbHVlfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy52YXJpYWJsZSwge3RpdGxlLCB2YWx1ZX0pO1xyXG4gICAgICAgIC8vIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3VwZGF0ZUxvY2FsVmFyaWFibGUnLCB7ZGV0YWlsOiB0aGlzLnZhcmlhYmxlfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KGUpIHtcclxuICAgICAgICBzd2l0Y2ggKGUudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1lbnVTZWxlY3QoZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCBlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb250ZXh0LW1lbnVcIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi90b29sdGlwXCI7XHJcbmltcG9ydCB7SG92ZXJ9IGZyb20gXCIuL2hvdmVyXCI7XHJcblxyXG5sZXQgX2lkID0gMDtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMueCA9IDA7XHJcbiAgICAgICAgdGhpcy55ID0gMDtcclxuICAgICAgICB0aGlzLndpZHRoID0gMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW107XHJcbiAgICAgICAgdGhpcy50b29sdGlwQ29udGVudCA9ICcnO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICcnO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgcGFyYW1zKTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gMDtcclxuICAgICAgICB0aGlzLmZpcnN0UmVuZGVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IG5leHRJZCgpIHtcclxuICAgICAgICByZXR1cm4gKF9pZCsrKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUocG9zKSB7XHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2Uuc2hvdyh7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25CbHVyKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKHBvcykge1xyXG4gICAgICAgIEhvdmVyLmluc3RhbmNlLnNob3codGhpcyk7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdFRvb2x0aXAuYmluZCh0aGlzKSwgNTAwLCB7Li4udGhpcywgLi4ucG9zfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb25maWcgPSB0aGlzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHJldHVybiB0aGlzLmZpcnN0UmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZChjb25maWcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCA9IDAsIHkgPSAwfSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB0aGlzLnggKyB4LFxyXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKHt3aWR0aCA9IDAsIGhlaWdodCA9IDB9KSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoey4uLnRoaXMsIC4uLnt2aXNpYmxlOiBmYWxzZX19KTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggKyB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCArIGhlaWdodFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRUb29sdGlwKGNvbmZpZykge1xyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2Uuc2hvdyhjb25maWcpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFdpZHRoID0gdGhpcy5pbml0aWFsSGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoNTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29udGV4dE1lbnV9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IENvbnRleHRNZW51KHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIE9iamVjdFtdXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoOiBmdWxsV2lkdGgsIGhlaWdodDogZnVsbEhlaWdodCwgaW5pdGlhbFdpZHRoOiB3aWR0aCwgaW5pdGlhbEhlaWdodDogaGVpZ2h0LCBjdHhNZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgZnVsbFdpZHRoLCBmdWxsSGVpZ2h0KTtcclxuICAgICAgICBpZiAoIWN0eE1lbnVJdGVtcy5sZW5ndGgpIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweC8xIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBhcnJvd0hlaWdodH0gPSBjdHgubWVhc3VyZVRleHQoJ1xcdTI1YjYnKTtcclxuICAgICAgICAgICAgY29uc3Qge2NvbGxlY3Rpb259ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt4LCB5LCB3aWR0aCwgdmlzaWJsZSwgY29sbGVjdGlvbn0sIHt0eXBlLCB0aXRsZSwgaGlnaGxpZ2h0ZWQsIGRpc2FibGVkID0gZmFsc2UsIGNoaWxkcmVuID0gW119LCBpZHgpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEycHgvbm9ybWFsIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0ge3gsIHk6IHkgKyAoZm9udEhlaWdodCArIDEwKSAqIGlkeCwgd2lkdGgsIGhlaWdodDogZm9udEhlaWdodCArIDEwfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge3gsIHksIHdpZHRoLCB2aXNpYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFyZWEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSwgdGl0bGUsIGhpZ2hsaWdodGVkLCBkaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJlYS54ICsgYXJlYS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJlYS55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2hpbGRyZW4ucmVkdWNlKENvbnRleHRNZW51LmNhbGN1bGF0ZU1heFdpZHRoLCB7Y3R4LCBtYXhXaWR0aDogMH0pLm1heFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGhpZ2hsaWdodGVkID8gJyM5MWI1YzgnIDogJyNkMGQwZDAnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhhcmVhKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZGlzYWJsZWQgPyAnIzlkOWQ5ZCcgOiAnIzE4MTgxOCc7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4L25vcm1hbCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgYXJlYS54ICsgMTAsIGFyZWEueSArIGFyZWEuaGVpZ2h0IC0gNSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHgvMSBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjViNicsIGFyZWEueCArIGFyZWEud2lkdGggLSBhcnJvd1dpZHRoIC0gMiwgYXJlYS55ICsgYXJlYS5oZWlnaHQgLyAyICsgYXJyb3dIZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgICAgICAgICAgfSwge3gsIHksIHdpZHRoLCB2aXNpYmxlOiB0cnVlLCBjb2xsZWN0aW9uOiBbXX0pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRJdGVtVW5kZXJQb2ludGVyKHt4LCB5LCByaWdodCA9IDAsIGJvdHRvbSA9IDAsIGhpZ2hsaWdodGVkfSwgaXRlbSkge1xyXG4gICAgICAgIGxldCBoYXNIaWdobGlnaHRlZENoaWxkO1xyXG4gICAgICAgIGlmIChpdGVtLmhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgICh7aGlnaGxpZ2h0ZWQ6IGhhc0hpZ2hsaWdodGVkQ2hpbGQsIHJpZ2h0LCBib3R0b219ID0gaXRlbS5jaGlsZHJlbi5yZWR1Y2UoQ29udGV4dE1lbnUuZmluZEl0ZW1VbmRlclBvaW50ZXIsIHt4LCB5LCByaWdodCwgYm90dG9tfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLmhpZ2hsaWdodGVkID0gIWl0ZW0uZGlzYWJsZWQgJiYgKFxyXG4gICAgICAgICAgICBoYXNIaWdobGlnaHRlZENoaWxkIHx8IChcclxuICAgICAgICAgICAgICAgIGl0ZW0ueCA8PSB4ICYmXHJcbiAgICAgICAgICAgICAgICBpdGVtLnkgPD0geSAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW0ueCArIGl0ZW0ud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAgICAgKGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSA+IHlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeCwgeSxcclxuICAgICAgICAgICAgcmlnaHQ6IE1hdGgubWF4KHJpZ2h0LCBpdGVtLnggKyBpdGVtLndpZHRoKSxcclxuICAgICAgICAgICAgYm90dG9tOiBNYXRoLm1heChib3R0b20sIGl0ZW0ueSArIGl0ZW0uaGVpZ2h0KSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGl0ZW0uaGlnaGxpZ2h0ZWQgfHwgaGlnaGxpZ2h0ZWRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjYWxjdWxhdGVNYXhXaWR0aCh7Y3R4LCBtYXhXaWR0aH0sIHt0aXRsZX0pIHtcclxuICAgICAgICByZXR1cm4ge2N0eCwgbWF4V2lkdGg6IE1hdGguZmxvb3IoTWF0aC5tYXgobWF4V2lkdGgsIGN0eC5tZWFzdXJlVGV4dCh0aXRsZSkud2lkdGggKyAzMCkpfTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eDogY2xpY2tYLCB5OiBjbGlja1l9KSB7XHJcbiAgICAgICAgY29uc3Qge2ZvdW5kfSA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZShmdW5jdGlvbiByZWN1cnNlKHt6SW5kZXg6IGhpZ2hlc3RaSW5kZXgsIGZvdW5kfSwgaXRlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgekluZGV4ID0gMSwgaGlnaGxpZ2h0ZWQsIGNoaWxkcmVuID0gW119ID0gaXRlbTtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIHpJbmRleCA+IGhpZ2hlc3RaSW5kZXggJiZcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkICYmXHJcbiAgICAgICAgICAgICAgICB4IDwgY2xpY2tYICYmXHJcbiAgICAgICAgICAgICAgICB5IDwgY2xpY2tZICYmXHJcbiAgICAgICAgICAgICAgICAoeCArIHdpZHRoKSA+IGNsaWNrWCAmJlxyXG4gICAgICAgICAgICAgICAgKHkgKyBoZWlnaHQpID4gY2xpY2tZICYmIHt6SW5kZXgsIGZvdW5kOiBpdGVtfVxyXG4gICAgICAgICAgICApIHx8IGNoaWxkcmVuLnJlZHVjZShyZWN1cnNlLCB7ekluZGV4OiBoaWdoZXN0WkluZGV4LCBmb3VuZH0pO1xyXG4gICAgICAgIH0sIHt6SW5kZXg6IC0xLCBmb3VuZDogbnVsbH0pO1xyXG4gICAgICAgIGZvdW5kICYmIGZvdW5kLnR5cGUgJiYgZm91bmQudHlwZSgpO1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KHt4LCB5LCBjdHhNZW51Q29uZmlnOiBjdHhNZW51SXRlbXN9KSB7XHJcbiAgICAgICAgaWYgKCFjdHhNZW51SXRlbXMpIHJldHVybjtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4LCB5LCB6SW5kZXg6IEluZmluaXR5LCBjdHhNZW51SXRlbXN9KTtcclxuICAgICAgICAoe21heFdpZHRoOiB0aGlzLmluaXRpYWxXaWR0aCwgbWF4V2lkdGg6IHRoaXMud2lkdGh9ID0gY3R4TWVudUl0ZW1zLnJlZHVjZShDb250ZXh0TWVudS5jYWxjdWxhdGVNYXhXaWR0aCwge2N0eDogQXBwLmluc3RhbmNlLmN0eCwgbWF4V2lkdGg6IDB9KSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaW5pdGlhbEhlaWdodCA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZSgodG90YWxIZWlnaHQsIHtoZWlnaHR9KSA9PiB0b3RhbEhlaWdodCArPSBoZWlnaHQsIDApO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5hc3NpZ25MYXN0QWN0aXZhdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7ekluZGV4OiAtMSwgY3R4TWVudUl0ZW1zOiBbXX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnJlcGFpbnRBZmZlY3RlZCh0aGlzKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgd2lkdGg6IDAsIGhlaWdodDogMH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUl0ZW1zID0gQ29udGV4dE1lbnUucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEl0ZW1zKHt4LCB5fSkge1xyXG4gICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qge3JpZ2h0LCBib3R0b219ID0gdGhpcy5jdHhNZW51SXRlbXMucmVkdWNlKENvbnRleHRNZW51LmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7eCwgeSwgcmlnaHQ6IDAsIGJvdHRvbTogMH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHJpZ2h0IC0gdGhpcy54O1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gYm90dG9tIC0gdGhpcy55O1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQoey4uLnRoaXMsIC4uLnt3aWR0aCwgaGVpZ2h0LCB6SW5kZXg6IC0xfX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHt0aHJvdHRsZX0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5sZXQgX2luc3RhbmNlO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGVQaWNrZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcyA9IHtkYXRlczogW10sIHJlc3Q6IFtdfTtcclxuICAgICAgICB0aGlzLmluaXRpYXRvciA9IG51bGw7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBEYXRlUGlja2VyLmdlb21ldHJpYyk7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7RGF0ZVBpY2tlcn0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgRGF0ZVBpY2tlcih7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyNDBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMge3t5ZWFyOiBzdHJpbmcsIG1vbnRoOiBzdHJpbmcsIG9ic2VydmFibGVBcmVhcz86IE9iamVjdFtdLCBkYXRlczogT2JqZWN0W119fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBvcGVuZWQsIGNhbGVuZGFyRGF0YToge3llYXIsIG1vbnRoLCBkYXRlcyA9IFtdfSwgY3VycmVudERhdGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCFvcGVuZWQpIHJldHVybiB7eWVhciwgbW9udGgsIGRhdGVzfTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMwMDZkOTknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE2cHgvMSBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgbGV0IHt3aWR0aDogZm9udFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogZm9udEhlaWdodH0gPSBjdHgubWVhc3VyZVRleHQobW9udGgpO1xyXG4gICAgICAgICAgICBjb25zdCB7d2lkdGg6IGFycm93V2lkdGh9ID0gY3R4Lm1lYXN1cmVUZXh0KCdcXHUyNUIyJyk7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoMTAsIDgpO1xyXG4gICAgICAgICAgICBsZXQge2U6IGxlZnRBcnJvd1hQb3N9ID0gY3R4LmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQoJ1xcdTI1QzAnLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoYXJyb3dXaWR0aCArIDEwLCAwKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG1vbnRoLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoZm9udFdpZHRoICsgMTAsIDApO1xyXG4gICAgICAgICAgICBsZXQge2U6IHJpZ2h0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCdcXHUyNUI2JywgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBsZXQgb2JzZXJ2YWJsZUFyZWFzID0gW3tcclxuICAgICAgICAgICAgICAgIHg6IGxlZnRBcnJvd1hQb3MsXHJcbiAgICAgICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGFycm93V2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RlY3JlYXNlQ3VycmVudE1vbnRoJyxcclxuICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB4OiByaWdodEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogYXJyb3dXaWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5jcmVhc2VDdXJyZW50TW9udGgnLFxyXG4gICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgIH1dO1xyXG4gICAgICAgICAgICAoe3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCh5ZWFyKSk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCArIHdpZHRoIC0gZm9udFdpZHRoIC0gYXJyb3dXaWR0aCAqIDIgLSAzMCwgeSArIDgpO1xyXG4gICAgICAgICAgICAoe2U6IGxlZnRBcnJvd1hQb3N9ID0gY3R4LmdldFRyYW5zZm9ybSgpKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCdcXHUyNUMwJywgMCwgZm9udEhlaWdodCArIDgpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKGFycm93V2lkdGggKyAxMCwgMCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh5ZWFyLCAwLCBmb250SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoZm9udFdpZHRoICsgMTAsIDApO1xyXG4gICAgICAgICAgICAoe2U6IHJpZ2h0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnXFx1MjVCNicsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgb2JzZXJ2YWJsZUFyZWFzID0gW1xyXG4gICAgICAgICAgICAgICAgLi4ub2JzZXJ2YWJsZUFyZWFzLFxyXG4gICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICB4OiBsZWZ0QXJyb3dYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGZvbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGVjcmVhc2VDdXJyZW50WWVhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogcmlnaHRBcnJvd1hQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogZm9udFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmNyZWFzZUN1cnJlbnRZZWFyJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgeWVhcixcclxuICAgICAgICAgICAgICAgIG1vbnRoLFxyXG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZUFyZWFzLFxyXG4gICAgICAgICAgICAgICAgZGF0ZXM6IERhdGVQaWNrZXIucmVuZGVyQ2FsZW5kYXJEYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB4ICsgNCxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5ICsgNDAgKyA0LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIDgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSA0MCAtIDgsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0ZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERhdGVcclxuICAgICAgICAgICAgICAgIH0sIGN0eClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKiBAcmV0dXJucyBPYmplY3RbXVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyQ2FsZW5kYXJEYXRhKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhLCBjdXJyZW50RGF0ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCwgeSk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE4cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGxldCB4UG9zID0gMCwgcm91bmRlZFhQb3MgPSAwLCB5UG9zID0gMCwgcm91bmRlZFlQb3MgPSAwLCBjb250ZW50V2lkdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0ge1xyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbDogd2lkdGggLyA3LFxyXG4gICAgICAgICAgICAgICAgdmVydGljYWw6IGhlaWdodCAvIE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIDcpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRZUG9zID0gTWF0aC5yb3VuZChpbnRlcnZhbC52ZXJ0aWNhbCAvIDIgKyBjdHgubWVhc3VyZVRleHQoJzAnKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudCAvIDIpIC0gMjtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGVEYXRlID0gY3VycmVudERhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhQXJlYSA9IGRhdGEucmVkdWNlKChjb2xsZWN0aW9uLCBpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pIHJldHVybiBbLi4uY29sbGVjdGlvbiwgLi4uW2l0ZW1dXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtkYXRlLCBoaWdobGlnaHRlZH0gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNDdXJyZW50U2VsZWN0ZWREYXRlID0gY3VycmVudERhdGVEYXRlID09PSBkYXRlO1xyXG4gICAgICAgICAgICAgICAgeFBvcyA9IGkgJSA3ICogaW50ZXJ2YWwuaG9yaXpvbnRhbDtcclxuICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKTtcclxuICAgICAgICAgICAgICAgIHlQb3MgPSB4UG9zID8geVBvcyA6IChpID8geVBvcyArIGludGVydmFsLnZlcnRpY2FsIDogeVBvcyk7XHJcbiAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyk7XHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBpc0N1cnJlbnRTZWxlY3RlZERhdGUgPyAncmVkJyA6ICcjMDAzYjZlJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMC43KSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdChyb3VuZGVkWFBvcywgcm91bmRlZFlQb3MsIE1hdGgucm91bmQoaW50ZXJ2YWwuaG9yaXpvbnRhbCkgLSA0LCBNYXRoLnJvdW5kKGludGVydmFsLnZlcnRpY2FsKSAtIDQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICAgICAgKHt3aWR0aDogY29udGVudFdpZHRofSA9IGN0eC5tZWFzdXJlVGV4dChkYXRlKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoZGF0ZSwgcm91bmRlZFhQb3MgKyBNYXRoLnJvdW5kKChpbnRlcnZhbC5ob3Jpem9udGFsIC0gNCkgLyAyIC0gY29udGVudFdpZHRoIC8gMiksIHJvdW5kZWRZUG9zICsgZm9udFlQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi5jb2xsZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLlt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4ICsgcm91bmRlZFhQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHkgKyByb3VuZGVkWVBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoaW50ZXJ2YWwuaG9yaXpvbnRhbCkgLSA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoaW50ZXJ2YWwudmVydGljYWwpIC0gNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGlja0RhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgfSwgW10pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGFBcmVhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAdGhpcyB7RGF0ZVBpY2tlci5wcm90b3R5cGV9ICovXHJcbiAgICBzdGF0aWMgZmluZEl0ZW1VbmRlclBvaW50ZXIoe3g6IHBvaW50ZXJYLCB5OiBwb2ludGVyWSwgY3Vyc29yVHlwZTogbGF0ZXN0S25vd25DdXJzb3JUeXBlLCB6SW5kZXg6IGhpZ2hlc3RaSW5kZXh9LCBhcmVhKSB7XHJcbiAgICAgICAgaWYgKCFhcmVhKSByZXR1cm4ge3g6IHBvaW50ZXJYLCB5OiBwb2ludGVyWSwgY3Vyc29yVHlwZTogbGF0ZXN0S25vd25DdXJzb3JUeXBlLCB6SW5kZXg6IGhpZ2hlc3RaSW5kZXh9O1xyXG4gICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXh9ID0gYXJlYTtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IHpJbmRleCA+IGhpZ2hlc3RaSW5kZXggJiZcclxuICAgICAgICAgICAgeCA8IHBvaW50ZXJYICYmXHJcbiAgICAgICAgICAgIHkgPCBwb2ludGVyWSAmJlxyXG4gICAgICAgICAgICAoeCArIHdpZHRoKSA+IHBvaW50ZXJYICYmXHJcbiAgICAgICAgICAgICh5ICsgaGVpZ2h0KSA+IHBvaW50ZXJZO1xyXG4gICAgICAgIGFyZWEuaGlnaGxpZ2h0ZWQgPSBtYXRjaDtcclxuICAgICAgICByZXR1cm4gey4uLnt4OiBwb2ludGVyWCwgeTogcG9pbnRlcll9LCAuLi4oKG1hdGNoICYmIGFyZWEpIHx8IHtjdXJzb3JUeXBlOiBsYXRlc3RLbm93bkN1cnNvclR5cGUsIHpJbmRleDogaGlnaGVzdFpJbmRleH0pfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2FsZW5kYXJCdWlsZGVyKGRhdGUpIHtcclxuICAgICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKDEpO1xyXG4gICAgICAgIGNvbnN0IGRheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICAgICAgbGV0IGlkeCA9IChkYXRlLmdldERheSgpICsgNikgJSA3O1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgeWVhcjogZGF0ZS5nZXRGdWxsWWVhcigpLFxyXG4gICAgICAgICAgICBtb250aDogbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ3J1Jywge21vbnRoOiAnbG9uZyd9KVxyXG4gICAgICAgICAgICAgICAgLmZvcm1hdChkYXRlKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL15b0LAt0Y9dLywgbWF0Y2ggPT4gbWF0Y2gudG9VcHBlckNhc2UoKSlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBbXTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGRhdGFbaWR4KytdID0ge1xyXG4gICAgICAgICAgICAgICAgZGF0ZTogZGF0ZS5nZXREYXRlKCksXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZDogZmFsc2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKCtkYXRlICsgZGF5KTtcclxuICAgICAgICB9IHdoaWxlIChkYXRlLmdldERhdGUoKSA+IDEpO1xyXG4gICAgICAgIHJldHVybiB7Li4ucmVzdWx0LCAuLi57ZGF0ZXM6IFsuLi5kYXRhXX19O1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIG9uTW91c2VEb3duKHt4OiBjbGlja1gsIHk6IGNsaWNrWX0pIHtcclxuICAgICAgICBjb25zdCBfZmluZCA9IGFyZWEgPT4gKFxyXG4gICAgICAgICAgICBhcmVhICYmIGFyZWEueCA8IGNsaWNrWCAmJiBhcmVhLnkgPCBjbGlja1kgJiYgKGFyZWEueCArIGFyZWEud2lkdGgpID4gY2xpY2tYICYmIChhcmVhLnkgKyBhcmVhLmhlaWdodCkgPiBjbGlja1lcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLmNhbGVuZGFyRGF0YS5vYnNlcnZhYmxlQXJlYXMuZmluZChfZmluZCkgfHwgdGhpcy5jYWxlbmRhckRhdGEuZGF0ZXMuZmluZChfZmluZCkgfHwge3R5cGU6ICcnfTtcclxuICAgICAgICBzd2l0Y2ggKGFyZWEudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwaWNrRGF0ZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldERhdGUoYXJlYS5kYXRlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdpbmNyZWFzZUN1cnJlbnRNb250aCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldE1vbnRoKHRoaXMuY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2RlY3JlYXNlQ3VycmVudE1vbnRoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0TW9udGgodGhpcy5jdXJyZW50RGF0ZS5nZXRNb250aCgpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaW5jcmVhc2VDdXJyZW50WWVhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldEZ1bGxZZWFyKHRoaXMuY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2RlY3JlYXNlQ3VycmVudFllYXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRGdWxsWWVhcih0aGlzLmN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCkgLSAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIuY2FsZW5kYXJCdWlsZGVyKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWF0b3Iuc2V0RGF0ZSh0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KHt4ID0gdGhpcy54LCB5ID0gdGhpcy55LCBpbml0aWF0b3J9KSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eCwgeSwgekluZGV4OiBJbmZpbml0eSwgaW5pdGlhdG9yLCBvcGVuZWQ6IHRydWV9KTtcclxuICAgICAgICB0aGlzLmN1cnJlbnREYXRlID0gaW5pdGlhdG9yLmRhdGUgfHwgbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIuY2FsZW5kYXJCdWlsZGVyKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmFzc2lnbkxhc3RBY3RpdmF0ZWQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtvcGVuZWQ6IGZhbHNlLCB6SW5kZXg6IC0xfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3g6IC1JbmZpbml0eSwgeTogLUluZmluaXR5LCBpbml0aWF0b3I6IG51bGx9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEFyZWFzKHBvcykge1xyXG4gICAgICAgICh7Y3Vyc29yVHlwZTogQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3J9ID0gW1xyXG4gICAgICAgICAgICAuLi50aGlzLmNhbGVuZGFyRGF0YS5kYXRlcyxcclxuICAgICAgICAgICAgLi4udGhpcy5jYWxlbmRhckRhdGEub2JzZXJ2YWJsZUFyZWFzXHJcbiAgICAgICAgXS5yZWR1Y2UoRGF0ZVBpY2tlci5maW5kSXRlbVVuZGVyUG9pbnRlciwgey4uLnBvcywgLi4ue2N1cnNvclR5cGU6ICdpbml0aWFsJywgekluZGV4OiAtMX19KSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlKHRoaXMuaGlnaGxpZ2h0QXJlYXMuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7ZGF0ZUZvcm1hdCwgdGhyb3R0bGV9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge0RhdGVQaWNrZXJ9IGZyb20gXCIuL2RhdGUtcGlja2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRWRpdEJveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7d2lkdGggPSBFZGl0Qm94Lmdlb21ldHJpYy53aWR0aCwgaXNDYWxlbmRhciA9IGZhbHNlLCBkYXRlID0gaXNDYWxlbmRhciA/IG5ldyBEYXRlKCkgOiBudWxsLCB2YWx1ZSA9IGlzQ2FsZW5kYXIgPyBkYXRlRm9ybWF0KGRhdGUpIDogJycsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdFZGl0Qm94JztcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgICAgICB0aGlzLmlzQ2FsZW5kYXIgPSBpc0NhbGVuZGFyO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0ID0gbnVsbDtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIEVkaXRCb3guZ2VvbWV0cmljLCB7d2lkdGh9KTtcclxuICAgICAgICB0aGlzLm9ic2VydmFibGVBcmVhcyA9IFtcclxuICAgICAgICAgICAgLi4uKFxyXG4gICAgICAgICAgICAgICAgaXNDYWxlbmRhciA/IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZm9jdXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAndGV4dCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54ICsgdGhpcy53aWR0aCAtIHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc2hvd0NhbGVuZGFyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSA6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ZvY3VzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3RleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogOTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZhbHVlLCBpc0NhbGVuZGFyfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyAzLCBoZWlnaHQgKyAzKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzY2NjY2Nic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2RkZGRkZCc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxZDFkMWQnO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh2YWx1ZSwgeCArIDMsIHkgKyBoZWlnaHQgLSA0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgaWYgKCFpc0NhbGVuZGFyKSByZXR1cm4gY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE4cHgvMSBlbW9qaSc7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQoJ/Cfk4YnKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudDtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjNjY2NjY2JztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCfwn5OGJywgeCArIHdpZHRoIC0gaGVpZ2h0LCB5ICsgZm9udEhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHRoaXMge0VkaXRCb3gucHJvdG90eXBlfSAqL1xyXG4gICAgc3RhdGljIGRlZmluZUN1cnNvclR5cGUoe3gsIHl9KSB7XHJcbiAgICAgICAgKHtjdXJzb3JUeXBlOiBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvcn0gPSAoXHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2YWJsZUFyZWFzLmZpbmQoZnVuY3Rpb24oe3gsIHksIHdpZHRoLCBoZWlnaHR9KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geCA8IHRoaXMueCAmJiB5IDwgdGhpcy55ICYmICh4ICsgd2lkdGgpID4gdGhpcy54ICYmICh5ICsgaGVpZ2h0KSA+IHRoaXMueTtcclxuICAgICAgICAgICAgfSwge3gsIHl9KSB8fCB7Y3Vyc29yVHlwZTogJ2luaXRpYWwnfVxyXG4gICAgICAgICkpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnaW5pdGlhbCc7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgdW5zYWZlVmFsdWUgPSB0aGlzLmh0bWxJbnB1dD8udmFsdWUgPz8gdGhpcy52YWx1ZTtcclxuICAgICAgICB0aGlzLmlzQ2FsZW5kYXIgP1xyXG4gICAgICAgICAgICAvXlxcZHsxLDJ9XFwvXFxkezEsMn1cXC9cXGR7NH0kLy50ZXN0KHVuc2FmZVZhbHVlKSAmJiB0aGlzLnNldERhdGUobmV3IERhdGUodW5zYWZlVmFsdWUpKSA6XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodW5zYWZlVmFsdWUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQgJiYgKHRoaXMuaHRtbElucHV0LnJlbW92ZSgpIHx8IHRoaXMuaHRtbElucHV0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3gsIHl9KSB7XHJcbiAgICAgICAgY29uc3QgYXJlYSA9IHRoaXMub2JzZXJ2YWJsZUFyZWFzLmZpbmQoZnVuY3Rpb24oe3gsIHksIHdpZHRoLCBoZWlnaHR9KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4IDwgdGhpcy54ICYmIHkgPCB0aGlzLnkgJiYgKHggKyB3aWR0aCkgPiB0aGlzLnggJiYgKHkgKyBoZWlnaHQpID4gdGhpcy55O1xyXG4gICAgICAgIH0sIHt4LCB5fSk7XHJcbiAgICAgICAgaWYgKCFhcmVhKSByZXR1cm47XHJcbiAgICAgICAgc3dpdGNoIChhcmVhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnZm9jdXMnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3dDYWxlbmRhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dDYWxlbmRhcih7eCwgeX0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dDYWxlbmRhcih7eCwgeX0pIHtcclxuICAgICAgICBEYXRlUGlja2VyLmluc3RhbmNlLnNob3coe2luaXRpYXRvcjogdGhpcywgeCwgeX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvY3VzKCkge1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHtcclxuICAgICAgICAgICAgdG9wOiBBcHAuaW5zdGFuY2UuY2FudmFzLm9mZnNldFRvcCxcclxuICAgICAgICAgICAgbGVmdDogQXBwLmluc3RhbmNlLmNhbnZhcy5vZmZzZXRMZWZ0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBPYmplY3QuZW50cmllcyh7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICB0b3A6IGAke3RoaXMueSArIG9mZnNldC50b3B9cHhgLFxyXG4gICAgICAgICAgICBsZWZ0OiBgJHt0aGlzLnggKyBvZmZzZXQubGVmdH1weGAsXHJcbiAgICAgICAgICAgIHdpZHRoOiBgJHt0aGlzLmlzQ2FsZW5kYXIgPyB0aGlzLndpZHRoIC0gdGhpcy5oZWlnaHQgOiB0aGlzLndpZHRofXB4YCxcclxuICAgICAgICAgICAgZm9udDogJzE0cHggc2Fucy1zZXJpZicsXHJcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyNkZGRkZGQnLFxyXG4gICAgICAgICAgICBib3JkZXI6ICdub25lJyxcclxuICAgICAgICAgICAgcGFkZGluZzogJzJweCAwJ1xyXG4gICAgICAgIH0pLm1hcChlID0+IGUuam9pbignOicpKS5qb2luKCc7JykpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LmlkID0gJ2h0bWwtaW5wdXQtZWxlbWVudCc7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQudmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5odG1sSW5wdXQpO1xyXG4gICAgICAgIHRoaXMuaHRtbElucHV0LmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5odG1sSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGUoZGF0ZSA9IHRoaXMuZGF0ZSkge1xyXG4gICAgICAgIGlmICghZGF0ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IGRhdGVGb3JtYXQoZGF0ZSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSA9IHRoaXMudmFsdWUpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgRWRpdEJveC5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoe3R5cGUsIGtleSwgb2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAna2V5ZG93bic6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkJsdXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGhyb3R0bGUoRWRpdEJveC5kZWZpbmVDdXJzb3JUeXBlLmJpbmQodGhpcyksIHt4LCB5fSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBIb3ZlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7aWR9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtIb3Zlcn0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgSG92ZXIoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBhY3RpdmV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDIsIHkgLSAyLCB3aWR0aCArIDQsIGhlaWdodCArIDQpO1xyXG4gICAgICAgIGlmICghYWN0aXZlKSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyNmZDI5MjknO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUoKSB7fVxyXG5cclxuICAgIG9uQmx1cigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7fVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge31cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIHNob3coe3gsIHksIHdpZHRoLCBoZWlnaHQsIHpJbmRleCA9IDF9KSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IHggLSAxLFxyXG4gICAgICAgICAgICB5OiB5IC0gMSxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoICsgMixcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgKyAyLFxyXG4gICAgICAgICAgICB6SW5kZXg6IHpJbmRleCAtIDEsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeDogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB5OiAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgSG92ZXIucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUb29sdGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKHtpZH0pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5kZWJvdW5jZSA9IGRlYm91bmNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtUb29sdGlwfSAqL1xyXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gX2luc3RhbmNlIHx8IChpID0+IF9pbnN0YW5jZSA9IGkpKG5ldyBUb29sdGlwKHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgdGV4dH0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBpZiAoIXRleHQpIHJldHVybjtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5yZWN0KHgsIHksIDUwMCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmZlYTlmJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMzMjMyMzInO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQodGV4dCwgeCArIDEwLCB5ICsgaGVpZ2h0IC0gMTApO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db250ZXh0TWVudSgpIHt9XHJcblxyXG4gICAgb25CbHVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHt9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7fVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHt9XHJcblxyXG4gICAgc2hvdyh7eCwgeSwgdG9vbHRpcENvbnRlbnR9KSB7XHJcbiAgICAgICAgY29uc3Qge2N0eCwgY2FudmFzOiB7d2lkdGg6IGNhbnZhc1dpZHRofX0gPSBBcHAuaW5zdGFuY2U7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY29uc3Qge2FjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBjb250ZW50SGVpZ2h0LCB3aWR0aDogY29udGVudFdpZHRofSA9IGN0eC5tZWFzdXJlVGV4dCh0b29sdGlwQ29udGVudCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeDogeCA+IChjYW52YXNXaWR0aCAtIGNvbnRlbnRXaWR0aCAtIDIwKSA/IHggLSBjb250ZW50V2lkdGggLSAyMCA6IHgsXHJcbiAgICAgICAgICAgIHk6IHkgPiBjb250ZW50SGVpZ2h0ICsgMjAgPyB5IC0gY29udGVudEhlaWdodCAtIDIwIDogeSxcclxuICAgICAgICAgICAgd2lkdGg6IGNvbnRlbnRXaWR0aCArIDIwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGNvbnRlbnRIZWlnaHQgKyAyMCxcclxuICAgICAgICAgICAgdGV4dDogdG9vbHRpcENvbnRlbnQsXHJcbiAgICAgICAgICAgIHpJbmRleDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLnRleHQgPSAnJztcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIHk6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlKHt4LCB5fSkge1xyXG4gICAgICAgIGNvbnN0IHt0ZXh0LCB6SW5kZXh9ID0gdGhpcztcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHt0ZXh0OiAnJywgekluZGV4OiAtMX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7Li4ue3gsIHk6IHkgLSB0aGlzLmhlaWdodCwgdGV4dCwgekluZGV4fX0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIFRvb2x0aXAucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoe29mZnNldFg6IHgsIG9mZnNldFk6IHl9KSB7XHJcbiAgICAgICAgdGhpcy5kZWJvdW5jZSh0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtzaW51c29pZEdlbn0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJlbmRlciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdUcmVuZGVyJztcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgICAgICB0aGlzLmN0eE1lbnVDb25maWcgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBJbicsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSAqPSAxLjE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIE91dCcsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSAqPSAwLjk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIFJlc2V0JyxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXS5tYXAoKHtjYWxsYmFjaywgLi4ucmVzdH0pID0+ICh7XHJcbiAgICAgICAgICAgIC4uLnJlc3QsXHJcbiAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjay5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5kZWJvdW5jZSA9IGRlYm91bmNlKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKGNvbmZpZywgY3R4KSB7XHJcbiAgICAgICAgY29uc3QgY2hhcnRNYXJnaW4gPSAyMDtcclxuICAgICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgZGF0YToge3BvaW50c319ID0gY29uZmlnO1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0QXJlYSA9IHtcclxuICAgICAgICAgICAgeDogeCArIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIHk6IHkgKyBwYWRkaW5nWzBdLFxyXG4gICAgICAgICAgICB3aWR0aDogd2lkdGggLSBwYWRkaW5nWzFdIC0gcGFkZGluZ1szXSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSBwYWRkaW5nWzBdIC0gcGFkZGluZ1syXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3Qge21pbiwgbWF4fSA9IFRyZW5kZXIubm9ybWFsaXplUmFuZ2UocG9pbnRzKTtcclxuICAgICAgICBjb25zdCByYW5nZVNjYWxlID0gKGNoYXJ0QXJlYS5oZWlnaHQgLSBjaGFydE1hcmdpbikgLyAobWF4IC0gbWluKTtcclxuICAgICAgICBjb25zdCB6ZXJvTGV2ZWwgPSBNYXRoLmZsb29yKChjaGFydEFyZWEueSArIGNoYXJ0TWFyZ2luIC8gMikgKyBtYXggKiByYW5nZVNjYWxlKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMTI3LCAxMjcsIDEyNywgMC4yKSc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhjaGFydEFyZWEpKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd1hBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYX0sIGN0eCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3WUF4aXMoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3RGF0YSh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWEsIC4uLnt6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9fSwgY3R4KTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdMZWdlbmQoey4uLmNvbmZpZywgLi4ue1xyXG4gICAgICAgICAgICB4LFxyXG4gICAgICAgICAgICB5OiB5ICsgaGVpZ2h0IC0gNDAsXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfX0sIGN0eCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3RGF0YSh7eCwgeSwgd2lkdGgsIGhlaWdodCwgcGFkZGluZywgc2NhbGUsIGRhdGE6IHtwb2ludHMgPSBbXX0sIHplcm9MZXZlbCwgcmFuZ2VTY2FsZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjMDAwMGZmJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCwgemVyb0xldmVsKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKDAsICgtcG9pbnRzWzBdPy52YWx1ZSB8fCAwKSAqIHNjYWxlICogcmFuZ2VTY2FsZSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzdGVwID0gd2lkdGggLyBsZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFZhbHVlID0gLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICB4UG9zICs9IHN0ZXAsIHNjYWxlZFZhbHVlID0gKC1wb2ludHNbKytpXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeFBvcywgc2NhbGVkVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAvIGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc2NhbGVkVmFsdWUgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0gMDtcclxuICAgICAgICAgICAgICAgICBpIDwgbGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgIHhQb3MgKz0gc3RlcCwgc2NhbGVkVmFsdWUgPSAoLXBvaW50c1srK2ldPy52YWx1ZSB8fCAwKSAqIHNjYWxlICogcmFuZ2VTY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHhQb3MgLSA0LCBzY2FsZWRWYWx1ZSAtIDQsIDgsIDgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeFBvcyAtIDQsIHNjYWxlZFZhbHVlIC0gNCwgOCwgOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd1hBeGlzKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHgsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxMHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICB4UG9zID0geCxcclxuICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHdpZHRoIC8gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyksXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChwb2ludHNbMF0udGltZSkud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxPZmZzZXQgPSBNYXRoLnJvdW5kKGxhYmVsV2lkdGggLyAyKSxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbHNJbnRlcnZhbCA9IE1hdGguY2VpbCgobGFiZWxXaWR0aCArIDIwKSAvIGludGVydmFsKSxcclxuICAgICAgICAgICAgICAgICAgICBuZXh0TGFiZWxQb3MgPSB4UG9zICsgbGFiZWxzSW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNNYWpvclRpY2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICBpIDwgcG9pbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICBpKyssXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgKz0gaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKSxcclxuICAgICAgICAgICAgICAgICAgICAgaXNNYWpvclRpY2sgPSAhKGkgJSBsYWJlbHNJbnRlcnZhbCkpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGlzTWFqb3JUaWNrID8gJyMzYzNjM2MnIDogJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHJvdW5kZWRYUG9zLCBpc01ham9yVGljayA/IHkgKyBoZWlnaHQgKyA1IDogeSArIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHJvdW5kZWRYUG9zLCB5KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNNYWpvclRpY2spIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHBvaW50c1tpXS50aW1lLCByb3VuZGVkWFBvcyAtIGxhYmVsT2Zmc2V0LCB5ICsgaGVpZ2h0ICsgMjApO1xyXG4gICAgICAgICAgICAgICAgbmV4dExhYmVsUG9zICs9IGxhYmVsc0ludGVydmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdZQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgdGlja3MgPSAyMCwgbWFqb3JUaWNrc0ludGVydmFsLCB6ZXJvTGV2ZWwsIHNjYWxlLCByYW5nZVNjYWxlLCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMWExYTFhJztcclxuICAgICAgICBjdHguZm9udCA9ICdib2xkIDE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBoZWlnaHQgLyB0aWNrcztcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LnJlY3QoeCAtMTAwLCB5LCB3aWR0aCArIDEwMCwgaGVpZ2h0KTtcclxuICAgICAgICBjdHguY2xpcCgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgIHlQb3MgPSB6ZXJvTGV2ZWwgKyBNYXRoLmNlaWwoKHkgKyBoZWlnaHQgLSB6ZXJvTGV2ZWwpIC8gaW50ZXJ2YWwpICogaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgcm91bmRlZFlQb3MgPSBNYXRoLnJvdW5kKHlQb3MpLFxyXG4gICAgICAgICAgICAgICAgIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zKSAvIHJhbmdlU2NhbGUgLyBzY2FsZSkudG9GaXhlZCgyKSxcclxuICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICBpIDwgdGlja3M7XHJcbiAgICAgICAgICAgICBpKyssXHJcbiAgICAgICAgICAgICAgICB5UG9zIC09IGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgIHJvdW5kZWRZUG9zID0gTWF0aC5yb3VuZCh5UG9zKSxcclxuICAgICAgICAgICAgICAgIGxhYmVsID0gKCh6ZXJvTGV2ZWwgLSB5UG9zICkgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMiksXHJcbiAgICAgICAgICAgICAgICAgaXNNYWpvclRpY2sgPSBNYXRoLmFicyh5UG9zIC0gemVyb0xldmVsKSAlIChpbnRlcnZhbCAqIG1ham9yVGlja3NJbnRlcnZhbCkgPCBpbnRlcnZhbCAvIDIpIHtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gaXNNYWpvclRpY2sgPyAnIzQzNDM0MycgOiAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKGlzTWFqb3JUaWNrID8geCAtIDUgOiB4LCByb3VuZGVkWVBvcyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCByb3VuZGVkWVBvcyk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgaWYgKCFpc01ham9yVGljaykgY29udGludWU7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChsYWJlbCwgeCAtIGN0eC5tZWFzdXJlVGV4dChsYWJlbCkud2lkdGggLSAxMCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd0xlZ2VuZCh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YToge25hbWV9fSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYigwLDAsMjU1KSc7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJ2JvbGQgMTJweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgY29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dChuYW1lKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudDtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgtMSwgMCwgMCwgMSwgeCArIHdpZHRoIC8gMiAtIDUsIHkgKyBoZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKDAsIDQpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKDIwLCA0KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDYsIDAsIDgsIDgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCg2LCAwLCA4LCA4KTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4ICsgd2lkdGggLyAyICsgNSwgeSArIGhlaWdodCAvIDIpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMxNTE1MTUnO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobmFtZSwgMCwgZm9udEhlaWdodCAtIDIpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG5vcm1hbGl6ZVJhbmdlKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5yZWR1Y2UoKHttaW4sIG1heCwgbWF4TmVnYXRpdmUsIG1pblBvc2l0aXZlfSwge3ZhbHVlfSkgPT4gKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtaW46IE1hdGgubWluKHZhbHVlLCBtaW4pLFxyXG4gICAgICAgICAgICAgICAgbWF4OiBNYXRoLm1heCh2YWx1ZSwgbWF4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKSwge1xyXG4gICAgICAgICAgICBtaW46IEluZmluaXR5LFxyXG4gICAgICAgICAgICBtYXg6IC1JbmZpbml0eVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtb2NrRGF0YSgpIHtcclxuICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpIC0gMTAwMCAqIDI5O1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkoMzApXHJcbiAgICAgICAgICAgIC5maWxsKHN0YXJ0VGltZSlcclxuICAgICAgICAgICAgLm1hcCgodGltZSwgaWR4KSA9PiAoXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogbmV3IERhdGUodGltZSArIDEwMDAgKiBpZHgpLnRvTG9jYWxlVGltZVN0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzaW51c29pZEdlbi5uZXh0KCkudmFsdWUsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBtb2NrTmV4dERhdGEoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmRpc3BhdGNoKG5ldyBDdXN0b21FdmVudCgndHJlbmRlck5leHRUaWNrJywge2RldGFpbDoge1xyXG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygpLFxyXG4gICAgICAgICAgICB2YWx1ZTogc2ludXNvaWRHZW4ubmV4dCgpLnZhbHVlLFxyXG4gICAgICAgIH19KSlcclxuICAgIH1cclxuXHJcbiAgICBfaW5pdCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCd0cmVuZGVyTmV4dFRpY2snLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVHJlbmRlci5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoe2RldGFpbH0pIHtcclxuICAgICAgICB0aGlzLmRhdGEucG9pbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5wdXNoKGRldGFpbCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmFsdWVJdGVtIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHt2YWx1ZSwgLi4ucGFyYW1zfSkge1xyXG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJ1ZhbHVlSXRlbSc7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudHJlbmQgPSAwO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUNvbmZpZyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdNb3ZlJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0hvcml6b250YWxseScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdMZWZ0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt4OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1JpZ2h0JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt4OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdWZXJ0aWNhbGx5JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1VwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt5OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0Rvd24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcywge3k6IDIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdSZXNpemUnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnWCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHcm93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt4OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2hyaW5rJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt4OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnWScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHcm93JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt5OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2hyaW5rJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMsIHt4OiAtMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnSGlkZScsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmhpZGUuYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIFZhbHVlSXRlbS5nZW9tZXRyaWMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZ2VvbWV0cmljKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IHJhbmRvbVZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIDEwMCkudG9GaXhlZCgyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgdmlzaWJsZSwgdmFsdWUsIHRyZW5kLCBhY3RpdmV9LCBjdHgpIHtcclxuICAgICAgICBsZXQgc3RhY2sgPSAwO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICBpZiAoIXZpc2libGUpIHJldHVybjtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJyMxNjE2MTYnO1xyXG5cdFx0XHRjdHguZm9udCA9ICdib2xkIDEycHggc2VyaWYnO1xyXG5cdFx0XHRjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KHZhbHVlKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudDtcclxuXHRcdFx0aWYgKGFjdGl2ZSkge1xyXG5cdFx0XHRcdGN0eC5zYXZlKCk7XHJcblx0XHRcdFx0c3RhY2srKztcclxuXHRcdFx0XHRpZiAodHJlbmQgPiAwKSB7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gJyMwMEZGMDAnO1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRyZW5kIDwgMCkge1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjZTUwMDAwJztcclxuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcclxuXHRcdFx0Y3R4LnJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHRcdGN0eC5jbGlwKCk7XHJcblx0XHRcdGN0eC5maWxsVGV4dCh2YWx1ZSwgeCArIDEsIHkgKyBmb250SGVpZ2h0ICsgNSk7XHJcblx0XHRcdHN0YWNrICYmIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0UmFuZG9tQ2hhbmdlKCkge1xyXG4gICAgICAgIHNldEludGVydmFsKHRoaXMub25WYWx1ZUNoYW5nZS5iaW5kKHRoaXMpLCAxMDAwMCArIE1hdGgucmFuZG9tKCkgKiA2MDAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZURvd24oKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUZXh0KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudHJlbmQgPSB2YWx1ZSA+IHRoaXMudmFsdWUgPyAxIDogKHZhbHVlIDwgdGhpcy52YWx1ZSA/IC0xIDogMCk7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudG9vbHRpcENvbnRlbnQgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5ibGluay5iaW5kKHRoaXMpLCAyMDApO1xyXG4gICAgfVxyXG5cclxuICAgIGJsaW5rKCkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblZhbHVlQ2hhbmdlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0VGV4dChWYWx1ZUl0ZW0ucmFuZG9tVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBWYWx1ZUl0ZW0ucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0NvbGxlY3Rpb25JdGVtfSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbGxlY3Rpb24taXRlbVwiO1xyXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL2NvbXBvbmVudHMvdG9vbHRpcFwiO1xyXG5pbXBvcnQge1ZhbHVlSXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy92YWx1ZS1pdGVtXCI7XHJcbmltcG9ydCB7Q2hhcnRJdGVtfSBmcm9tIFwiLi9jb21wb25lbnRzL2NoYXJ0LWl0ZW1cIjtcclxuaW1wb3J0IHtFZGl0Qm94fSBmcm9tIFwiLi9jb21wb25lbnRzL2VkaXQtYm94XCI7XHJcbmltcG9ydCB7Q29udGV4dE1lbnV9IGZyb20gXCIuL2NvbXBvbmVudHMvY29udGV4dC1tZW51XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi9hcHBcIjtcclxuaW1wb3J0IHtCdXR0b259IGZyb20gXCIuL2NvbXBvbmVudHMvYnV0dG9uXCI7XHJcbmltcG9ydCB7Q29tYm9Cb3h9IGZyb20gXCIuL2NvbXBvbmVudHMvY29tYm8tYm94XCI7XHJcbmltcG9ydCB7VHJlbmRlcn0gZnJvbSBcIi4vY29tcG9uZW50cy90cmVuZGVyXCI7XHJcbmltcG9ydCB7SG92ZXJ9IGZyb20gXCIuL2NvbXBvbmVudHMvaG92ZXJcIjtcclxuaW1wb3J0IHtDbG9ja30gZnJvbSBcIi4vY29tcG9uZW50cy9jbG9ja1wiO1xyXG5pbXBvcnQge0RhdGVQaWNrZXJ9IGZyb20gXCIuL2NvbXBvbmVudHMvZGF0ZS1waWNrZXJcIjtcclxuXHJcbmNvbnN0IGNoYXJ0Q29uZmlnID0ge1xyXG4gICAgdHlwZTogJ2NvbHVtbicsXHJcbiAgICBwYWRkaW5nOiBbMjAsIDIwLCA3MCwgNzBdLFxyXG4gICAgdGlja3M6IDUsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgcG9pbnRzOiBDaGFydEl0ZW0ubW9ja0RhdGEoKSxcclxuICAgICAgICBtYXJnaW46IDAuMVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgdHJlbmRlckNvbmZpZyA9IHtcclxuICAgIHBhZGRpbmc6IFsyMCwgMjAsIDcwLCA3MF0sXHJcbiAgICB0aWNrczogMjAsXHJcbiAgICBtYWpvclRpY2tzSW50ZXJ2YWw6IDQsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgbmFtZTogJ3Npbih4KScsXHJcbiAgICAgICAgcG9pbnRzOiBUcmVuZGVyLm1vY2tEYXRhKClcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IG1lbnVJdGVtcyA9IFtcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogJ09uZScsXHJcbiAgICAgICAgdmFsdWU6IDEsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiAnVHdvJyxcclxuICAgICAgICB2YWx1ZTogMixcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdUaHJlZScsXHJcbiAgICAgICAgdmFsdWU6IDMsXHJcbiAgICB9XHJcbl07XHJcblxyXG5jb25zdCBidXR0b25DYWxsYmFjayA9ICgpID0+IChcclxuICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3JhbmRvbWl6ZUNoYXJ0RGF0YScpKVxyXG4pO1xyXG5cclxuc2V0SW50ZXJ2YWwoVHJlbmRlci5tb2NrTmV4dERhdGEsIDEwMDApO1xyXG5cclxuQXBwLmluc3RhbmNlLmNvbXBvbmVudHMgPSBbXHJcbiAgICAuLi5bXHJcbiAgICAgICAgbmV3IENsb2NrKHt5OiAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSlcclxuICAgIF0sXHJcbiAgICAuLi5Db2xsZWN0aW9uSXRlbS5jb21wb3NlKHt4OiAwLCB5OiAzMCwgY29sczogMjUsIHJvd3M6IDEyLCBnYXA6IDIwLCBjdG9yOiBWYWx1ZUl0ZW19KSxcclxuICAgIC4uLltcclxuICAgICAgICBuZXcgRWRpdEJveCh7eDogMCwgeTogNjAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IEVkaXRCb3goe3g6IDEwMCwgeTogNjAwLCB3aWR0aDogMTAwLCB6SW5kZXg6IDEsIGlzQ2FsZW5kYXI6IHRydWUsIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IENvbWJvQm94KHt4OiAyNTAsIHk6IDYwMCwgekluZGV4OiAxLCB2YXJpYWJsZU5hbWU6ICdDb21ib2JveDEnLCBtZW51SXRlbXMsIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IENoYXJ0SXRlbSh7Li4ue3g6IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSA2MDAsIHk6IDMwLCB3aWR0aDogNjAwLCBoZWlnaHQ6IDQwMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0sIC4uLmNoYXJ0Q29uZmlnfSksXHJcbiAgICAgICAgbmV3IEJ1dHRvbih7eDogQXBwLmluc3RhbmNlLmNhbnZhcy53aWR0aCAtIEJ1dHRvbi5nZW9tZXRyaWMud2lkdGgsIHk6IDQ1MCwgekluZGV4OiAxLCB2YWx1ZTogJ1JhbmRvbWl6ZScsIGNhbGxiYWNrOiBidXR0b25DYWxsYmFjaywgaWQ6IENvbXBvbmVudC5uZXh0SWR9KSxcclxuICAgICAgICBuZXcgVHJlbmRlcih7Li4ue3g6IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSA2MDAsIHk6IDQ5MCwgd2lkdGg6IDYwMCwgaGVpZ2h0OiA0MDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9LCAuLi50cmVuZGVyQ29uZmlnfSksXHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZSxcclxuICAgICAgICBIb3Zlci5pbnN0YW5jZSxcclxuICAgICAgICBDb250ZXh0TWVudS5pbnN0YW5jZSxcclxuICAgICAgICBEYXRlUGlja2VyLmluc3RhbmNlXHJcbiAgICBdXHJcbl07XHJcblxyXG5BcHAuaW5zdGFuY2UucmVuZGVyKCk7XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZSh0aHJlc2hvbGQgPSAxMDApIHtcclxuICAgIGxldCB0aW1lb3V0ID0gMDtcclxuICAgIHJldHVybiAoZm4sIGFyZykgPT4ge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmbiwgdGhyZXNob2xkLCBhcmcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGhyb3R0bGUodGhyZXNob2xkID0gMTAwKSB7XHJcbiAgICBsZXQgdGltZW91dCA9IHRydWU7XHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB0aW1lb3V0ID0gdHJ1ZSwgdGhyZXNob2xkKTtcclxuICAgIHJldHVybiAoZm4sIGFyZykgPT4ge1xyXG4gICAgICAgIHRpbWVvdXQgJiYgZm4oYXJnKTtcclxuICAgICAgICB0aW1lb3V0ID0gZmFsc2U7XHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCBzaW51c29pZEdlbiA9IChmdW5jdGlvbiogKCkge1xyXG4gICAgY29uc3QgcGVyaW9kID0gTWF0aC5QSSAqIDI7XHJcbiAgICBjb25zdCBxID0gMC41O1xyXG4gICAgbGV0IF9pID0gMDtcclxuICAgIHdoaWxlICh0cnVlKSB5aWVsZCBNYXRoLnJvdW5kKE1hdGguc2luKF9pKysgKiBxICUgcGVyaW9kKSAqIDEwMDAwKSAvIDEwMDtcclxufSkoKTtcclxuXHJcbmNvbnN0IHRpbWVGb3JtYXQgPSAodGltZUZvcm1hdHRlciA9PiB7XHJcbiAgICByZXR1cm4gdGltZSA9PiB0aW1lRm9ybWF0dGVyLmZvcm1hdCh0aW1lKTtcclxufSkobmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ3J1Jywge2hvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCcsIHNlY29uZDogJzItZGlnaXQnfSkpO1xyXG5cclxuY29uc3QgZGF0ZUZvcm1hdCA9IChkYXRlRm9ybWF0dGVyID0+IHtcclxuICAgIHJldHVybiBkYXRlID0+IGRhdGVGb3JtYXR0ZXIuZm9ybWF0KGRhdGUpO1xyXG59KShuZXcgSW50bC5EYXRlVGltZUZvcm1hdCgnZW4nLCB7ZGF5OiAnMi1kaWdpdCcsIG1vbnRoOiAnMi1kaWdpdCcsIHllYXI6ICdudW1lcmljJ30pKTtcclxuXHJcbmV4cG9ydCB7IHNpbnVzb2lkR2VuLCB0aW1lRm9ybWF0LCBkYXRlRm9ybWF0IH1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=