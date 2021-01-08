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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMvLi9hcHAuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9idXR0b24uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jaGFydC1pdGVtLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvY2xvY2suanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21iby1ib3guanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9jb250ZXh0LW1lbnUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL2VkaXQtYm94LmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvaG92ZXIuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vY29tcG9uZW50cy90b29sdGlwLmpzIiwid2VicGFjazovL2NhbnZhcy8uL2NvbXBvbmVudHMvdHJlbmRlci5qcyIsIndlYnBhY2s6Ly9jYW52YXMvLi9jb21wb25lbnRzL3ZhbHVlLWl0ZW0uanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vY2FudmFzLy4vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbnZhcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBv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QXlCLEdBQUcsc0VBQXNCLHVFQUF1RSxtRUFBZ0IsQ0FBQztBQUNqSyxZQUFZLHlEQUFPLEVBQUUsSUFBSSxHQUFHLDJEQUF5Qix3REFBd0QsbUVBQWdCLENBQUMsbUJBQW1CO0FBQ2pKLFFBQVEsaUVBQWdCO0FBQ3hCLFFBQVEsOERBQWM7QUFDdEIsUUFBUSwwRUFBb0I7QUFDNUIsUUFBUSx5RUFBbUI7QUFDM0I7QUFDQTs7QUFFQSxxREFBbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRVo7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQyxpQ0FBaUMsc0RBQXNEOztBQUV4RjtBQUNBO0FBQ0EsQ0FBQyxpQ0FBaUMsa0RBQWtEOztBQUV0Qzs7Ozs7OztVQ2hDOUM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRocm90dGxlIH0gZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUge0NvbXBvbmVudFtdfSAqL1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHsgYWxwaGE6IGZhbHNlIH0pO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJyMyMjIyMjInO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjN2FmZmQxJztcclxuICAgICAgICB0aGlzLmN0eC5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgdGhpcy5sYXN0SG92ZXJlZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gX2luc3RhbmNlIHx8IChpID0+IF9pbnN0YW5jZSA9IGkpKG5ldyBBcHAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG9uQ29udGV4dE1lbnUoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7Q29tcG9uZW50W119IGNvbXBvbmVudHMgKi9cclxuICAgIHNldCBjb21wb25lbnRzKGNvbXBvbmVudHMpIHtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzID0gY29tcG9uZW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0NvbXBvbmVudFtdfSAqL1xyXG4gICAgZ2V0IGNvbXBvbmVudHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhyb3R0bGUoKS5iaW5kKHVuZGVmaW5lZCwgdGhpcy5vbk1vdXNlTW92ZS5iaW5kKHRoaXMpKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBBcHAub25Db250ZXh0TWVudSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2goZSkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmRpc3BhdGNoRXZlbnQoZSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGlzdGVuKGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICB1bmxpc3RlbihldmVudFR5cGUsIGhhbmRsZXIpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJiB0aGlzLmxhc3RBY3RpdmF0ZWQub25Nb3VzZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe29mZnNldFg6IHgsIG9mZnNldFk6IHksIGJ1dHRvbn0pIHtcclxuICAgICAgICBsZXQgdG9wTW9zdDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgekluZGV4ID0gLTEsIGl0ZW1zID0gdGhpcy5fY29tcG9uZW50cywgbGVuZ3RoID0gaXRlbXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgaXRlbXNbaV0uekluZGV4ID4gekluZGV4ICYmIChcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS54IDwgeCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnggKyBpdGVtc1tpXS53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGl0ZW1zW2ldLnkgKyBpdGVtc1tpXS5oZWlnaHQpID4geVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRvcE1vc3QgPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIHpJbmRleCA9IHRvcE1vc3QuekluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICFPYmplY3QuaXModG9wTW9zdCwgdGhpcy5sYXN0QWN0aXZhdGVkKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZC5vbkJsdXIoKTtcclxuICAgICAgICB0aGlzLmxhc3RBY3RpdmF0ZWQgPSB0b3BNb3N0O1xyXG4gICAgICAgIHRvcE1vc3QgJiYgKFxyXG4gICAgICAgICAgICBidXR0b24gPT09IDIgP1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdC5vbkNvbnRleHRNZW51KHt4LCB5fSkgOiB0b3BNb3N0Lm9uTW91c2VEb3duKHt4LCB5fSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VNb3ZlKHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIGxldCB0b3BNb3N0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCB6SW5kZXggPSAtMSwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS56SW5kZXggPiB6SW5kZXggJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA8IHkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueCArIGl0ZW1zW2ldLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXRlbXNbaV0ueSArIGl0ZW1zW2ldLmhlaWdodCkgPiB5XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdG9wTW9zdCA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgekluZGV4ID0gdG9wTW9zdC56SW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgIU9iamVjdC5pcyh0b3BNb3N0LCB0aGlzLmxhc3RIb3ZlcmVkKSAmJlxyXG4gICAgICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkLm9uTW91c2VPdXQoKTtcclxuICAgICAgICB0aGlzLmxhc3RIb3ZlcmVkID0gdG9wTW9zdDtcclxuICAgICAgICB0b3BNb3N0ICYmIHRvcE1vc3Qub25Nb3VzZU92ZXIoe3gsIHl9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3NpZ25MYXN0QWN0aXZhdGVkKGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMubGFzdEFjdGl2YXRlZCAmJiB0aGlzLmxhc3RBY3RpdmF0ZWQub25CbHVyKCk7XHJcbiAgICAgICAgdGhpcy5sYXN0QWN0aXZhdGVkID0gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJlcGFpbnRBZmZlY3RlZCh7aWQsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHpJbmRleH0pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBpdGVtc1tpXS5pZCAhPT0gaWQgJiZcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnpJbmRleCA+IHpJbmRleCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS55ID49IHkgJiYgaXRlbXNbaV0ueSA8PSAoeSArIGhlaWdodCkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0ueSA8PSB5ICYmIChpdGVtc1tpXS55ICsgaXRlbXNbaV0uaGVpZ2h0KSA+PSB5XHJcbiAgICAgICAgICAgICAgICAgICAgKSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPj0geCAmJiBpdGVtc1tpXS54IDw9ICh4ICsgd2lkdGgpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnggPD0geCAmJiAoaXRlbXNbaV0ueCArIGl0ZW1zW2ldLndpZHRoKSA+PSB4XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zW2ldLnJlbmRlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaXRlbXMgPSB0aGlzLl9jb21wb25lbnRzLCBsZW5ndGggPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpdGVtc1tpXS5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7dmFsdWU9ICdBcHBseScsIGNhbGxiYWNrID0gKCkgPT4ge30sIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdCdXR0b24nO1xyXG4gICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZvbnRTaXplID0gMTI7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IEFwcC5pbnN0YW5jZS5jdHg7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3RoaXMuZm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgQnV0dG9uLmdlb21ldHJpYywge3dpZHRoOiBjdHgubWVhc3VyZVRleHQodmFsdWUpLndpZHRoICsgMjB9KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHRoaXMueCArPSBCdXR0b24uZ2VvbWV0cmljLndpZHRoIC0gdGhpcy53aWR0aCAtIDI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDUwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9cclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgdmFsdWUsIGZvbnRTaXplLCBwcmVzc2VkLCByYWRpdXMgPSAzfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAzLCB5IC0gMywgd2lkdGggKyA5LCBoZWlnaHQgKyA5KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJyNhMmEyYTInO1xyXG4gICAgICAgICAgICBpZiAoIXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2IxYjFiMSc7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WCA9IDI7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDI7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDI7XHJcbiAgICAgICAgICAgICAgICBjdHguc2hhZG93Q29sb3IgPSAncmdiYSgxMjcsMTI3LDEyNywwLjcpJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzLCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5hcmNUbyh4ICsgd2lkdGgsIHkgKyBoZWlnaHQsIHggKyB3aWR0aCAtIHJhZGl1cywgeSArIGhlaWdodCwgcmFkaXVzKTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgcmFkaXVzLCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmFyY1RvKHgsIHkgKyBoZWlnaHQsIHgsIHkgKyBoZWlnaHQgLSByYWRpdXMsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5saW5lVG8oeCwgeSArIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIGN0eC5hcmNUbyh4LCB5LCB4ICsgcmFkaXVzLCB5LCByYWRpdXMpO1xyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBpZiAocHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC41KSc7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMjtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCArIDIsIHkgKyAyICsgaGVpZ2h0IC0gcmFkaXVzKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIDIsIHkgKyAyICsgcmFkaXVzKTtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmNUbyh4ICsgMiwgeSArIDIsIHggKyAyICsgcmFkaXVzLCB5LCByYWRpdXMpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMiArIHdpZHRoIC0gcmFkaXVzLCB5ICsgMik7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzM1MzUzNSc7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gYGJvbGQgJHtmb250U2l6ZX1weCBzYW5zLXNlcmlmYDtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMTAsIHkgKyBoZWlnaHQgLSA1KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnaW5pdGlhbCc7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oKSB7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZURvd24oKTtcclxuICAgICAgICB0aGlzLnByZXNzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VVcCgpIHtcclxuICAgICAgICB0aGlzLnByZXNzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBCdXR0b24ucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFydEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnQ2hhcnRJdGVtJztcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgICAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGUoKTtcclxuICAgICAgICB0aGlzLmRhdGFEcmF3QXJlYU1hcCA9IFtdO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUNvbmZpZyA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIEluJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMuc2V0U2NhbGUuYmluZCh0aGlzLCAxLjEpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBPdXQnLFxyXG4gICAgICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5zZXRTY2FsZS5iaW5kKHRoaXMsIDAuOSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdab29tIFJlc2V0JyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMucmVzZXRTY2FsZS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcihjb25maWcsIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0TWFyZ2luID0gMjA7XHJcbiAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIGRhdGE6IHtwb2ludHN9fSA9IGNvbmZpZztcclxuICAgICAgICBjb25zdCBjaGFydEFyZWEgPSB7XHJcbiAgICAgICAgICAgIHg6IHggKyBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICB5OiB5ICsgcGFkZGluZ1swXSxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gcGFkZGluZ1sxXSAtIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gcGFkZGluZ1swXSAtIHBhZGRpbmdbMl1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHttaW4sIG1heH0gPSBDaGFydEl0ZW0ubm9ybWFsaXplUmFuZ2UocG9pbnRzKTtcclxuICAgICAgICBjb25zdCByYW5nZVNjYWxlID0gKGNoYXJ0QXJlYS5oZWlnaHQgLSBjaGFydE1hcmdpbikgLyAobWF4IC0gbWluKTtcclxuICAgICAgICBjb25zdCB6ZXJvTGV2ZWwgPSBNYXRoLmZsb29yKChjaGFydEFyZWEueSArIGNoYXJ0TWFyZ2luIC8gMikgKyBtYXggKiByYW5nZVNjYWxlKTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMTI3LCAxMjcsIDEyNywgMC4yKSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdC5hcHBseShjdHgsIE9iamVjdC52YWx1ZXMoY2hhcnRBcmVhKSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBDaGFydEl0ZW0uZHJhd1hBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYX0sIGN0eCk7XHJcbiAgICAgICAgQ2hhcnRJdGVtLmRyYXdZQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWEsIC4uLnt6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9fSwgY3R4KTtcclxuICAgICAgICByZXR1cm4gQ2hhcnRJdGVtLmRyYXdEYXRhKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd0RhdGEoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIHNjYWxlLCBkYXRhOiB7cG9pbnRzID0gW10sIG1hcmdpbiA9IDAuMn0sIHplcm9MZXZlbCwgcmFuZ2VTY2FsZX0sIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGFEcmF3QXJlYU1hcCA9IFsuLi5wb2ludHNdO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCwgemVyb0xldmVsKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAvIGxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgYmFyV2lkdGggPSBzdGVwICogKDEgLSBtYXJnaW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICBiYXJIZWlnaHQgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0gc3RlcCAvIDIgLSBiYXJXaWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gcG9pbnRzW2ldLnZhbHVlID4gMCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyMwMDZiMDAnIDogJyMwMGZmMDAnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChwb2ludHNbaV0uaGlnaGxpZ2h0ZWQgPyAnIzgxMDAwMCcgOiAnI2ZmMDAwMCcpO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLCB4UG9zICs9IHN0ZXApIHtcclxuICAgICAgICAgICAgICAgIGZpbGxTdHlsZSA9IHBvaW50c1tpXS52YWx1ZSA+IDAgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmhpZ2hsaWdodGVkID8gJyMwMDZiMDAnIDogJyMwMGZmMDAnKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgKHBvaW50c1tpXS5oaWdobGlnaHRlZCA/ICcjODEwMDAwJyA6ICcjZmYwMDAwJyk7XHJcbiAgICAgICAgICAgICAgICBiYXJIZWlnaHQgPSAtcG9pbnRzW2ldLnZhbHVlICogc2NhbGUgKiByYW5nZVNjYWxlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4UG9zLCAwLCBiYXJXaWR0aCwgLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBkYXRhRHJhd0FyZWFNYXBbaV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uZGF0YURyYXdBcmVhTWFwW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgICAgICAgICAgeDogeFBvcyArIHgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IE1hdGgubWluKHplcm9MZXZlbCwgemVyb0xldmVsICsgYmFySGVpZ2h0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGguYWJzKGJhckhlaWdodClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICByZXR1cm4gZGF0YURyYXdBcmVhTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd1hBeGlzKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhOiB7cG9pbnRzfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjM2MzYzNjJztcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHgsIHkgKyBoZWlnaHQgKyA1KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPSB3aWR0aCAgLyBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zID0geCArIHN0ZXAgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLCB4UG9zICs9IHN0ZXAsIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKSkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhyb3VuZGVkWFBvcywgeSArIGhlaWdodCArIDUpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhyb3VuZGVkWFBvcywgeSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCByb3VuZGVkWFBvcyArIDUsIHkgKyBoZWlnaHQgKyBjdHgubWVhc3VyZVRleHQocG9pbnRzW2ldLmNhdGVnb3J5KS53aWR0aCArIDUpXHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnJvdGF0ZSgtTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChwb2ludHNbaV0uY2F0ZWdvcnksIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WUF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRpY2tzID0gNSwgemVyb0xldmVsLCBzY2FsZSwgcmFuZ2VTY2FsZSwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMWExYTFhJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguZmxvb3IoaGVpZ2h0IC8gdGlja3MpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgeVBvcyA9IHkgKyBoZWlnaHQgLSBNYXRoLmFicyh6ZXJvTGV2ZWwgLSB5IC0gaGVpZ2h0KSAlIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcykgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHRpY2tzO1xyXG4gICAgICAgICAgICAgICAgIHlQb3MgLT0gaW50ZXJ2YWwsXHJcbiAgICAgICAgICAgICAgICAgaSsrLCBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcyApIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHggLSA1LCB5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5UG9zKTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChsYWJlbCwgeCAtIGN0eC5tZWFzdXJlVGV4dChsYWJlbCkud2lkdGggLSAxMCwgeVBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVSYW5nZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKCh7bWluLCBtYXgsIG1heE5lZ2F0aXZlLCBtaW5Qb3NpdGl2ZX0sIHt2YWx1ZX0pID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWluOiBNYXRoLm1pbih2YWx1ZSwgbWluKSxcclxuICAgICAgICAgICAgICAgIG1heDogTWF0aC5tYXgodmFsdWUsIG1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICksIHtcclxuICAgICAgICAgICAgbWluOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgbWF4OiAtSW5maW5pdHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja0RhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheSgzMCkuZmlsbChbMSwgLTFdKS5tYXAoKGJpLCBpZHgpID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGBDYXRlZ29yeSR7aWR4ICsgMX1gLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwKiBiaVtNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpXSkgLyAxMDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApKVxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ3JhbmRvbWl6ZUNoYXJ0RGF0YScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cyA9IENoYXJ0SXRlbS5yZW5kZXIodGhpcywgQXBwLmluc3RhbmNlLmN0eCk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRTY2FsZSgpIHtcclxuICAgICAgICB0aGlzLnNjYWxlID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZShzY2FsZSA9IDEpIHtcclxuICAgICAgICB0aGlzLnNjYWxlICo9IHNjYWxlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlnaGxpZ2h0SXRlbXMoe3gsIHl9KSB7XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodGVkID0gbnVsbDtcclxuICAgICAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgc3VwZXIub25Nb3VzZU91dCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qge3g6IGl0ZW1YLCB5OiBpdGVtWSwgd2lkdGgsIGhlaWdodH0gPSBpO1xyXG4gICAgICAgICAgICBpLmhpZ2hsaWdodGVkID0gaXRlbVggPCB4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtWCArIHdpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpdGVtWSArIGhlaWdodCkgPiB5O1xyXG4gICAgICAgICAgICBpZiAoaS5oaWdobGlnaHRlZCkgaGlnaGxpZ2h0ZWQgPSBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcENvbnRlbnQgPSBoaWdobGlnaHRlZC52YWx1ZTtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudG9vbHRpcFRpbWVvdXQpO1xyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmluaXRUb29sdGlwLmJpbmQodGhpcyksIDUwMCwgey4uLnRoaXMsIC4uLnt4LCB5fX0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7dHlwZSwgb2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5oaWdobGlnaHRJdGVtcy5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JhbmRvbWl6ZUNoYXJ0RGF0YSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucG9pbnRzID0gQ2hhcnRJdGVtLm1vY2tEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuaW1wb3J0IHt0aW1lRm9ybWF0fSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi90b29sdGlwXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2xvY2sgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnQ2xvY2snO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgdGhpcy5mb250U2l6ZSA9IDIwO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgQ2xvY2suZ2VvbWV0cmljKTtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB2YWx1ZSwgZm9udFNpemV9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTYxNjE2JztcclxuXHRcdFx0Y3R4LmZvbnQgPSBgYm9sZCAke2ZvbnRTaXplfXB4IHNhbnMtc2VyaWZgO1xyXG5cdFx0XHRjb25zdCBmb250SGVpZ2h0ID0gY3R4Lm1lYXN1cmVUZXh0KHZhbHVlKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudDtcclxuXHRcdFx0Y3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMSwgeSArIGZvbnRIZWlnaHQgKyA1KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IEFwcC5pbnN0YW5jZS5jdHg7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwodGhpcy5vblZhbHVlQ2hhbmdlLmJpbmQodGhpcyksIDEwMDApO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGltZUZvcm1hdChEYXRlLm5vdygpKSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSBgYm9sZCAke3RoaXMuZm9udFNpemV9cHggc2Fucy1zZXJpZmA7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSBNYXRoLmNlaWwoY3R4Lm1lYXN1cmVUZXh0KHRoaXMudmFsdWUpLndpZHRoKSArIDE7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB0aGlzLnggPSBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gdGhpcy53aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3Zlcihwb3MpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgdGhpcy50b29sdGlwVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5pbml0VG9vbHRpcC5iaW5kKHRoaXMpLCA1MDAsIHsuLi50aGlzLCAuLi5wb3N9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICBUb29sdGlwLmluc3RhbmNlLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblZhbHVlQ2hhbmdlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGltZUZvcm1hdChEYXRlLm5vdygpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIENsb2NrLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7VmFsdWVJdGVtfSBmcm9tIFwiLi92YWx1ZS1pdGVtXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sbGVjdGlvbkl0ZW0ge1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7Q29tcG9uZW50W119ICovXHJcbiAgICBzdGF0aWMgY29tcG9zZSh7eCwgeSwgY29scywgcm93cywgZ2FwID0gMjAsIGN0b3J9KSB7XHJcbiAgICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gY3Rvci5nZW9tZXRyaWM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheShyb3dzKS5maWxsKEFwcC5pbnN0YW5jZS5jdHgpLnJlZHVjZSgocmVzdWx0LCBjdHgsIHJvdykgPT4gKFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAuLi5yZXN1bHQsXHJcbiAgICAgICAgICAgICAgICAuLi5uZXcgQXJyYXkoY29scykuZmlsbChjdG9yKS5tYXAoKGN0b3IsIGNvbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtpZCwgeFBvcywgeVBvcywgekluZGV4XSA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcG9uZW50Lm5leHRJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeCArIGNvbCAqICh3aWR0aCArIGdhcCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgKyByb3cgKiAoaGVpZ2h0ICsgZ2FwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJvdyArIDEpICogKGNvbCArIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBjdG9yKHtpZCwgeDogeFBvcywgeTogeVBvcywgdmFsdWU6IFZhbHVlSXRlbS5yYW5kb21WYWx1ZSwgekluZGV4LCBjdHh9KTtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5pbml0UmFuZG9tQ2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICksIFtdKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7IHRocm90dGxlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tYm9Cb3ggZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3Ioe3dpZHRoID0gQ29tYm9Cb3guZ2VvbWV0cmljLndpZHRoLCBtZW51SXRlbXMgPSBbXSwgdmFyaWFibGVOYW1lLCAuLi5wYXJhbXN9KSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnQ29tYm9Cb3gnO1xyXG4gICAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBDb21ib0JveC5nZW9tZXRyaWMsIHt3aWR0aH0pO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGUgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IHZhcmlhYmxlTmFtZSxcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnU2VsZWN0Li4uJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5tZW51SXRlbXMgPSBtZW51SXRlbXMubWFwKChpLCBpZHgpID0+ICh7XHJcbiAgICAgICAgICAgIC4uLmksXHJcbiAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgIHk6IHRoaXMueSArIHRoaXMuaGVpZ2h0ICsgaWR4ICogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyQXJlYSA9IHtcclxuICAgICAgICAgICAgeDogdGhpcy54ICsgd2lkdGggLSAyMCxcclxuICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICB3aWR0aDogMjAsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5mdWxsSGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBtZW51SXRlbXMubGVuZ3RoICogMjA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDcwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBmdWxsSGVpZ2h0LCBvcGVuZWQsIHZhcmlhYmxlOiB7dGl0bGV9LCBtZW51SXRlbXN9LCBjdHgpIHtcclxuICAgICAgICBjb25zdCBib3JkZXJDb2xvciA9ICcjODA4MDgwJztcclxuICAgICAgICBjb25zdCBmb250Q29sb3IgPSAnIzI0MjQyNCc7XHJcbiAgICAgICAgY29uc3QgYmFja2dyb3VuZENvbG9yID0gJyNjOGM4YzgnO1xyXG4gICAgICAgIGNvbnN0IGhpZ2hsaWdodENvbG9yID0gJyM4ZDhkOGQnO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4IC0gMiwgeSAtIDIsIHdpZHRoICsgMywgZnVsbEhlaWdodCArIDMpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmb250Q29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGJvcmRlckNvbG9yO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlY3QoeCwgeSwgeCArIHdpZHRoIC0gaGVpZ2h0LCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aXRsZSwgeCArIDMsIHkgKyBoZWlnaHQgLSA1KTtcclxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBiYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCArIHdpZHRoIC0gaGVpZ2h0LCB5LCBoZWlnaHQsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4IFdlYmRpbmdzJztcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmb250Q29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQob3BlbmVkID8gJzUnIDogJzYnLCB4ICsgd2lkdGggLSBoZWlnaHQgLyAyIC0gNSwgeSArIGhlaWdodCAtIDYpO1xyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBpZiAoIW9wZW5lZCkgcmV0dXJuIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSBtZW51SXRlbXMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICB5UG9zID0geSArIGhlaWdodCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgIGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQobWVudUl0ZW1zW2ldLnRpdGxlKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudCxcclxuICAgICAgICAgICAgICAgICAgICAgdGV4dFlQb3MgPSAoaGVpZ2h0IC0gZm9udEhlaWdodCkgLyAyICsgZm9udEhlaWdodDtcclxuICAgICAgICAgICAgICAgICBpIDwgbGVuZ3RoOyBpKyssIHlQb3MgPSB5ICsgaGVpZ2h0ICsgMSArIGhlaWdodCAqIGkpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBtZW51SXRlbXNbaV0uaGlnaGxpZ2h0ZWQgPyBoaWdobGlnaHRDb2xvciA6IGJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5UG9zLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmb250Q29sb3I7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQobWVudUl0ZW1zW2ldLnRpdGxlLCB4ICsgMywgeVBvcyArIHRleHRZUG9zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoe3gsIHl9KSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAoXHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckFyZWEueCA+IHggfHxcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS55ID4geSB8fFxyXG4gICAgICAgICAgICAodGhpcy50cmlnZ2VyQXJlYS54ICsgdGhpcy50cmlnZ2VyQXJlYS53aWR0aCkgPCB4IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnkgKyB0aGlzLnRyaWdnZXJBcmVhLmhlaWdodCkgPCB5XHJcbiAgICAgICAgKSA/ICdpbml0aWFsJyA6ICdwb2ludGVyJztcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2luaXRpYWwnO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlRG93bih7eCwgeX0pIHtcclxuICAgICAgICBzdXBlci5vbk1vdXNlRG93bih7eCwgeX0pO1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS54ID4geCB8fFxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnkgPiB5IHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnggKyB0aGlzLnRyaWdnZXJBcmVhLndpZHRoKSA8IHggfHxcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueSArIHRoaXMudHJpZ2dlckFyZWEuaGVpZ2h0KSA8IHlcclxuICAgICAgICApIHJldHVybjtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9ICF0aGlzLm9wZW5lZDtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMub3BlbmVkID8gKFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKSB8fFxyXG4gICAgICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZWRvd24nLCB0aGlzKVxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcykgfHxcclxuICAgICAgICAgICAgQXBwLmluc3RhbmNlLnVubGlzdGVuKCdtb3VzZWRvd24nLCB0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgb25NZW51U2VsZWN0KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyQXJlYS54IDwgeCAmJlxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBcmVhLnkgPCB5ICYmXHJcbiAgICAgICAgICAgICh0aGlzLnRyaWdnZXJBcmVhLnggKyB0aGlzLnRyaWdnZXJBcmVhLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgKHRoaXMudHJpZ2dlckFyZWEueSArIHRoaXMudHJpZ2dlckFyZWEuaGVpZ2h0KSA+IHlcclxuICAgICAgICApIHJldHVybjtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLm1lbnVJdGVtcy5maW5kKCh7eTogbWVudVksIGhlaWdodH0pID0+IChcclxuICAgICAgICAgICAgdGhpcy54IDwgeCAmJlxyXG4gICAgICAgICAgICBtZW51WSA8IHkgJiZcclxuICAgICAgICAgICAgKHRoaXMueCArIHRoaXMud2lkdGgpID4geCAmJlxyXG4gICAgICAgICAgICAobWVudVkgKyBoZWlnaHQpID4geVxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIHRoaXMuaGlkZU1lbnUoKTtcclxuICAgICAgICBzZWxlY3RlZEl0ZW0gJiYgKHRoaXMuc2V0VmFsdWUoc2VsZWN0ZWRJdGVtKSB8fCB0aGlzLnJlbmRlcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlTWVudSgpIHtcclxuICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIENvbWJvQm94LnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoey4uLnRoaXMsIC4uLntoZWlnaHQ6IHRoaXMuZnVsbEhlaWdodH19KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLm1lbnVJdGVtcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7eTogaXRlbVksIGhlaWdodH0gPSBpO1xyXG4gICAgICAgICAgICBpLmhpZ2hsaWdodGVkID0gdGhpcy54IDwgeCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbVkgPCB5ICYmXHJcbiAgICAgICAgICAgICAgICAodGhpcy54ICsgdGhpcy53aWR0aCkgPiB4ICYmXHJcbiAgICAgICAgICAgICAgICAoaXRlbVkgKyBoZWlnaHQpID4geTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlKHt0aXRsZSwgdmFsdWV9KSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnZhcmlhYmxlLCB7dGl0bGUsIHZhbHVlfSk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmRpc3BhdGNoKG5ldyBDdXN0b21FdmVudCgndXBkYXRlTG9jYWxWYXJpYWJsZScsIHtkZXRhaWw6IHRoaXMudmFyaWFibGV9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRXZlbnQoZSkge1xyXG4gICAgICAgIHN3aXRjaCAoZS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uTWVudVNlbGVjdChlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLmhpZ2hsaWdodEl0ZW1zLmJpbmQodGhpcyksIGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7Q29udGV4dE1lbnV9IGZyb20gXCIuL2NvbnRleHQtbWVudVwiO1xyXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIjtcclxuaW1wb3J0IHtIb3Zlcn0gZnJvbSBcIi4vaG92ZXJcIjtcclxuXHJcbmxldCBfaWQgPSAwO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy54ID0gMDtcclxuICAgICAgICB0aGlzLnkgPSAwO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSAwO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVDb25maWcgPSBbXTtcclxuICAgICAgICB0aGlzLnRvb2x0aXBDb250ZW50ID0gJyc7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gJyc7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMudG9vbHRpcFRpbWVvdXQgPSAwO1xyXG4gICAgICAgIHRoaXMuZmlyc3RSZW5kZXIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgbmV4dElkKCkge1xyXG4gICAgICAgIHJldHVybiAoX2lkKyspLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db250ZXh0TWVudShwb3MpIHtcclxuICAgICAgICBDb250ZXh0TWVudS5pbnN0YW5jZS5zaG93KHsuLi50aGlzLCAuLi5wb3N9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIocG9zKSB7XHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2Uuc2hvdyh0aGlzKTtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b29sdGlwVGltZW91dCk7XHJcbiAgICAgICAgdGhpcy50b29sdGlwVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5pbml0VG9vbHRpcC5iaW5kKHRoaXMpLCA1MDAsIHsuLi50aGlzLCAuLi5wb3N9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRvb2x0aXBUaW1lb3V0KTtcclxuICAgICAgICBUb29sdGlwLmluc3RhbmNlLmhpZGUoKTtcclxuICAgICAgICBIb3Zlci5pbnN0YW5jZS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGNvbmZpZyA9IHRoaXMpIHtcclxuICAgICAgICBpZiAodGhpcy5maXJzdFJlbmRlcikgcmV0dXJuIHRoaXMuZmlyc3RSZW5kZXIgPSBmYWxzZTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKGNvbmZpZyk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlKHt4ID0gMCwgeSA9IDB9KSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMueCArIHgsXHJcbiAgICAgICAgICAgIHk6IHRoaXMueSArIHlcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemUoe3dpZHRoID0gMCwgaGVpZ2h0ID0gMH0pIHtcclxuICAgICAgICB0aGlzLnJlbmRlcih7Li4udGhpcywgLi4ue3Zpc2libGU6IGZhbHNlfX0pO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCArIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0ICsgaGVpZ2h0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFRvb2x0aXAoY29uZmlnKSB7XHJcbiAgICAgICAgVG9vbHRpcC5pbnN0YW5jZS5zaG93KGNvbmZpZyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7aWR9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuY3R4TWVudUl0ZW1zID0gW107XHJcbiAgICAgICAgdGhpcy5pbml0aWFsV2lkdGggPSB0aGlzLmluaXRpYWxIZWlnaHQgPSAwO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSg1MCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtDb250ZXh0TWVudX0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgQ29udGV4dE1lbnUoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICogQHJldHVybnMgT2JqZWN0W11cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGg6IGZ1bGxXaWR0aCwgaGVpZ2h0OiBmdWxsSGVpZ2h0LCBpbml0aWFsV2lkdGg6IHdpZHRoLCBpbml0aWFsSGVpZ2h0OiBoZWlnaHQsIGN0eE1lbnVJdGVtc30sIGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBmdWxsV2lkdGgsIGZ1bGxIZWlnaHQpO1xyXG4gICAgICAgIGlmICghY3R4TWVudUl0ZW1zLmxlbmd0aCkgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4IFdlYmRpbmdzJztcclxuICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBhcnJvd1dpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogYXJyb3dIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KCc0Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHtjb2xsZWN0aW9ufSA9IGN0eE1lbnVJdGVtcy5yZWR1Y2UoZnVuY3Rpb24gcmVjdXJzZSh7eCwgeSwgd2lkdGgsIHZpc2libGUsIGNvbGxlY3Rpb259LCB7dHlwZSwgdGl0bGUsIGhpZ2hsaWdodGVkLCBkaXNhYmxlZCA9IGZhbHNlLCBjaGlsZHJlbiA9IFtdfSwgaWR4KSB7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCh0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0ge3gsIHk6IHkgKyAoZm9udEhlaWdodCArIDEwKSAqIGlkeCwgd2lkdGgsIGhlaWdodDogZm9udEhlaWdodCArIDEwfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge3gsIHksIHdpZHRoLCB2aXNpYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY29sbGVjdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmFyZWEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSwgdGl0bGUsIGhpZ2hsaWdodGVkLCBkaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4ucmVkdWNlKHJlY3Vyc2UsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogYXJlYS54ICsgYXJlYS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogYXJlYS55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogY2hpbGRyZW4ucmVkdWNlKENvbnRleHRNZW51LmNhbGN1bGF0ZU1heFdpZHRoLCB7Y3R4LCBtYXhXaWR0aDogMH0pLm1heFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiBoaWdobGlnaHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbjogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jb2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHJldHVyblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGhpZ2hsaWdodGVkID8gJyM5MWI1YzgnIDogJyNkMGQwZDAnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0LmFwcGx5KGN0eCwgT2JqZWN0LnZhbHVlcyhhcmVhKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZGlzYWJsZWQgPyAnIzlkOWQ5ZCcgOiAnIzE4MTgxOCc7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICcxMnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRpdGxlLCBhcmVhLnggKyAxMCwgYXJlYS55ICsgYXJlYS5oZWlnaHQgLSA1KTtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm4gcmV0dXJuVmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTJweCBXZWJkaW5ncyc7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoJzQnLCBhcmVhLnggKyBhcmVhLndpZHRoIC0gYXJyb3dXaWR0aCAtIDIsIGFyZWEueSArIGFyZWEuaGVpZ2h0IC8gMiArIGFycm93SGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICAgICAgICAgIH0sIHt4LCB5LCB3aWR0aCwgdmlzaWJsZTogdHJ1ZSwgY29sbGVjdGlvbjogW119KTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmaW5kSXRlbVVuZGVyUG9pbnRlcih7eCwgeSwgcmlnaHQgPSAwLCBib3R0b20gPSAwLCBoaWdobGlnaHRlZH0sIGl0ZW0pIHtcclxuICAgICAgICBsZXQgaGFzSGlnaGxpZ2h0ZWRDaGlsZDtcclxuICAgICAgICBpZiAoaXRlbS5oaWdobGlnaHRlZCkge1xyXG4gICAgICAgICAgICAoe2hpZ2hsaWdodGVkOiBoYXNIaWdobGlnaHRlZENoaWxkLCByaWdodCwgYm90dG9tfSA9IGl0ZW0uY2hpbGRyZW4ucmVkdWNlKENvbnRleHRNZW51LmZpbmRJdGVtVW5kZXJQb2ludGVyLCB7eCwgeSwgcmlnaHQsIGJvdHRvbX0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbS5oaWdobGlnaHRlZCA9ICFpdGVtLmRpc2FibGVkICYmIChcclxuICAgICAgICAgICAgaGFzSGlnaGxpZ2h0ZWRDaGlsZCB8fCAoXHJcbiAgICAgICAgICAgICAgICBpdGVtLnggPD0geCAmJlxyXG4gICAgICAgICAgICAgICAgaXRlbS55IDw9IHkgJiZcclxuICAgICAgICAgICAgICAgIChpdGVtLnggKyBpdGVtLndpZHRoKSA+IHggJiZcclxuICAgICAgICAgICAgICAgIChpdGVtLnkgKyBpdGVtLmhlaWdodCkgPiB5XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHgsIHksXHJcbiAgICAgICAgICAgIHJpZ2h0OiBNYXRoLm1heChyaWdodCwgaXRlbS54ICsgaXRlbS53aWR0aCksXHJcbiAgICAgICAgICAgIGJvdHRvbTogTWF0aC5tYXgoYm90dG9tLCBpdGVtLnkgKyBpdGVtLmhlaWdodCksXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodGVkOiBpdGVtLmhpZ2hsaWdodGVkIHx8IGhpZ2hsaWdodGVkXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2FsY3VsYXRlTWF4V2lkdGgoe2N0eCwgbWF4V2lkdGh9LCB7dGl0bGV9KSB7XHJcbiAgICAgICAgcmV0dXJuIHtjdHgsIG1heFdpZHRoOiBNYXRoLmZsb29yKE1hdGgubWF4KG1heFdpZHRoLCBjdHgubWVhc3VyZVRleHQodGl0bGUpLndpZHRoICsgMzApKX07XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3ZlcigpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS51bmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3g6IGNsaWNrWCwgeTogY2xpY2tZfSkge1xyXG4gICAgICAgIGNvbnN0IHtmb3VuZH0gPSB0aGlzLmN0eE1lbnVJdGVtcy5yZWR1Y2UoZnVuY3Rpb24gcmVjdXJzZSh7ekluZGV4OiBoaWdoZXN0WkluZGV4LCBmb3VuZH0sIGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHpJbmRleCA9IDEsIGhpZ2hsaWdodGVkLCBjaGlsZHJlbiA9IFtdfSA9IGl0ZW07XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICB6SW5kZXggPiBoaWdoZXN0WkluZGV4ICYmXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZCAmJlxyXG4gICAgICAgICAgICAgICAgeCA8IGNsaWNrWCAmJlxyXG4gICAgICAgICAgICAgICAgeSA8IGNsaWNrWSAmJlxyXG4gICAgICAgICAgICAgICAgKHggKyB3aWR0aCkgPiBjbGlja1ggJiZcclxuICAgICAgICAgICAgICAgICh5ICsgaGVpZ2h0KSA+IGNsaWNrWSAmJiB7ekluZGV4LCBmb3VuZDogaXRlbX1cclxuICAgICAgICAgICAgKSB8fCBjaGlsZHJlbi5yZWR1Y2UocmVjdXJzZSwge3pJbmRleDogaGlnaGVzdFpJbmRleCwgZm91bmR9KTtcclxuICAgICAgICB9LCB7ekluZGV4OiAtMSwgZm91bmQ6IG51bGx9KTtcclxuICAgICAgICBmb3VuZCAmJiBmb3VuZC50eXBlICYmIGZvdW5kLnR5cGUoKTtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyh7eCwgeSwgY3R4TWVudUNvbmZpZzogY3R4TWVudUl0ZW1zfSkge1xyXG4gICAgICAgIGlmICghY3R4TWVudUl0ZW1zKSByZXR1cm47XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eCwgeSwgekluZGV4OiBJbmZpbml0eSwgY3R4TWVudUl0ZW1zfSk7XHJcbiAgICAgICAgKHttYXhXaWR0aDogdGhpcy5pbml0aWFsV2lkdGgsIG1heFdpZHRoOiB0aGlzLndpZHRofSA9IGN0eE1lbnVJdGVtcy5yZWR1Y2UoQ29udGV4dE1lbnUuY2FsY3VsYXRlTWF4V2lkdGgsIHtjdHg6IEFwcC5pbnN0YW5jZS5jdHgsIG1heFdpZHRoOiAwfSkpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmluaXRpYWxIZWlnaHQgPSB0aGlzLmN0eE1lbnVJdGVtcy5yZWR1Y2UoKHRvdGFsSGVpZ2h0LCB7aGVpZ2h0fSkgPT4gdG90YWxIZWlnaHQgKz0gaGVpZ2h0LCAwKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuYXNzaWduTGFzdEFjdGl2YXRlZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3pJbmRleDogLTEsIGN0eE1lbnVJdGVtczogW119KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5yZXBhaW50QWZmZWN0ZWQodGhpcyk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eDogLUluZmluaXR5LCB5OiAtSW5maW5pdHksIHdpZHRoOiAwLCBoZWlnaHQ6IDB9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmN0eE1lbnVJdGVtcyA9IENvbnRleHRNZW51LnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWdobGlnaHRJdGVtcyh7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHtyaWdodCwgYm90dG9tfSA9IHRoaXMuY3R4TWVudUl0ZW1zLnJlZHVjZShDb250ZXh0TWVudS5maW5kSXRlbVVuZGVyUG9pbnRlciwge3gsIHksIHJpZ2h0OiAwLCBib3R0b206IDB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSByaWdodCAtIHRoaXMueDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGJvdHRvbSAtIHRoaXMueTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHsuLi50aGlzLCAuLi57d2lkdGgsIGhlaWdodCwgekluZGV4OiAtMX19KTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlKHRoaXMuaGlnaGxpZ2h0SXRlbXMuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7dGhyb3R0bGV9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxubGV0IF9pbnN0YW5jZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRlUGlja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHtpZH0pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMgPSB7ZGF0ZXM6IFtdLCByZXN0OiBbXX07XHJcbiAgICAgICAgdGhpcy5pbml0aWF0b3IgPSBudWxsO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgRGF0ZVBpY2tlci5nZW9tZXRyaWMpO1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZSgpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0RhdGVQaWNrZXJ9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IERhdGVQaWNrZXIoe2lkOiBDb21wb25lbnQubmV4dElkfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZ2VvbWV0cmljKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjAwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9cclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqIEByZXR1cm5zIHt7eWVhcjogc3RyaW5nLCBtb250aDogc3RyaW5nLCBvYnNlcnZhYmxlQXJlYXM/OiBPYmplY3RbXSwgZGF0ZXM6IE9iamVjdFtdfX1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgb3BlbmVkLCBjYWxlbmRhckRhdGE6IHt5ZWFyLCBtb250aCwgZGF0ZXMgPSBbXX0sIGN1cnJlbnREYXRlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGlmICghb3BlbmVkKSByZXR1cm4ge3llYXIsIG1vbnRoLCBkYXRlc307XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCB4LCB5KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMDA2ZDk5JztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNnB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBtb250aFdpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogbW9udGhIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KG1vbnRoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzIwcHggV2ViZGluZ3MnO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qge3dpZHRoOiBhcnJvd1dpZHRoLCBhY3R1YWxCb3VuZGluZ0JveEFzY2VudDogYXJyb3dIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KCczJyk7XHJcbiAgICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKE1hdGgucm91bmQod2lkdGggLyAyIC0gbW9udGhXaWR0aCAtIGFycm93V2lkdGggKiAyIC0gMjApLCAwKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtlOiBsZWZ0QXJyb3dYUG9zfSA9IGN0eC5nZXRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dCgnMycsIDAsIGFycm93SGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKGFycm93V2lkdGggKyAxMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDE2cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQobW9udGgsIDAsIG1vbnRoSGVpZ2h0ICsgOCk7XHJcbiAgICAgICAgICAgICAgICBjdHgudHJhbnNsYXRlKG1vbnRoV2lkdGggKyAxMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7ZTogcmlnaHRBcnJvd1hQb3N9ID0gY3R4LmdldFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMjBweCBXZWJkaW5ncyc7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoJzQnLCAwLCBhcnJvd0hlaWdodCArIDgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG9ic2VydmFibGVBcmVhcyA9IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogbGVmdEFycm93WFBvcyxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBhcnJvd1dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWNyZWFzZUN1cnJlbnRNb250aCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogcmlnaHRBcnJvd1hQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogYXJyb3dXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5jcmVhc2VDdXJyZW50TW9udGgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgfV07XHJcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIGxldCB7d2lkdGg6IGZvbnRXaWR0aCwgYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ6IGZvbnRIZWlnaHR9ID0gY3R4Lm1lYXN1cmVUZXh0KHllYXIpO1xyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKE1hdGgucm91bmQod2lkdGggLyAyICsgMTApLCAwKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHllYXIsIDAsIGZvbnRIZWlnaHQgKyA4KTtcclxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShmb250V2lkdGggKyA1LCAwKTtcclxuICAgICAgICAgICAgY29uc3Qge2U6IHllYXJTcGlubmVyWFBvc30gPSBjdHguZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE0cHggV2ViZGluZ3MnO1xyXG4gICAgICAgICAgICAoe3dpZHRoOiBmb250V2lkdGgsIGFjdHVhbEJvdW5kaW5nQm94QXNjZW50OiBmb250SGVpZ2h0fSA9IGN0eC5tZWFzdXJlVGV4dCgnNicpKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCc1JywgMCwgMTUgLSAzKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCc2JywgMCwgMTUgKyBmb250SGVpZ2h0ICsgMyk7XHJcbiAgICAgICAgICAgIG9ic2VydmFibGVBcmVhcyA9IFtcclxuICAgICAgICAgICAgICAgIC4uLm9ic2VydmFibGVBcmVhcyxcclxuICAgICAgICAgICAgICAgIC4uLlt7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogeWVhclNwaW5uZXJYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHksXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGZvbnRXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDE1LFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogMixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW5jcmVhc2VDdXJyZW50WWVhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogeWVhclNwaW5uZXJYUG9zLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHkgKyAxNSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogZm9udFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkZWNyZWFzZUN1cnJlbnRZZWFyJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgeWVhcixcclxuICAgICAgICAgICAgICAgIG1vbnRoLFxyXG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZUFyZWFzLFxyXG4gICAgICAgICAgICAgICAgZGF0ZXM6IERhdGVQaWNrZXIucmVuZGVyQ2FsZW5kYXJEYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICB4OiB4ICsgNCxcclxuICAgICAgICAgICAgICAgICAgICB5OiB5ICsgMzAgKyA0LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIDgsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgLSAzMCAtIDgsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0ZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERhdGVcclxuICAgICAgICAgICAgICAgIH0sIGN0eClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKiBAcmV0dXJucyBPYmplY3RbXVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyQ2FsZW5kYXJEYXRhKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkYXRhLCBjdXJyZW50RGF0ZX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCwgeSk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE4cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGxldCB4UG9zID0gMCwgcm91bmRlZFhQb3MgPSAwLCB5UG9zID0gMCwgcm91bmRlZFlQb3MgPSAwLCBjb250ZW50V2lkdGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0ge1xyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbDogd2lkdGggLyA3LFxyXG4gICAgICAgICAgICAgICAgdmVydGljYWw6IGhlaWdodCAvIE1hdGguY2VpbChkYXRhLmxlbmd0aCAvIDcpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRZUG9zID0gTWF0aC5yb3VuZChpbnRlcnZhbC52ZXJ0aWNhbCAvIDIgKyBjdHgubWVhc3VyZVRleHQoJzAnKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudCAvIDIpIC0gMjtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudERhdGVEYXRlID0gY3VycmVudERhdGUuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhQXJlYSA9IGRhdGEucmVkdWNlKChjb2xsZWN0aW9uLCBpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0pIHJldHVybiBbLi4uY29sbGVjdGlvbiwgLi4uW2l0ZW1dXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHtkYXRlLCBoaWdobGlnaHRlZH0gPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNDdXJyZW50U2VsZWN0ZWREYXRlID0gY3VycmVudERhdGVEYXRlID09PSBkYXRlO1xyXG4gICAgICAgICAgICAgICAgeFBvcyA9IGkgJSA3ICogaW50ZXJ2YWwuaG9yaXpvbnRhbDtcclxuICAgICAgICAgICAgICAgIHJvdW5kZWRYUG9zID0gTWF0aC5yb3VuZCh4UG9zKTtcclxuICAgICAgICAgICAgICAgIHlQb3MgPSB4UG9zID8geVBvcyA6IChpID8geVBvcyArIGludGVydmFsLnZlcnRpY2FsIDogeVBvcyk7XHJcbiAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyk7XHJcbiAgICAgICAgICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBpc0N1cnJlbnRTZWxlY3RlZERhdGUgPyAncmVkJyA6ICcjMDAzYjZlJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMC43KSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdChyb3VuZGVkWFBvcywgcm91bmRlZFlQb3MsIE1hdGgucm91bmQoaW50ZXJ2YWwuaG9yaXpvbnRhbCkgLSA0LCBNYXRoLnJvdW5kKGludGVydmFsLnZlcnRpY2FsKSAtIDQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICAgICAgKHt3aWR0aDogY29udGVudFdpZHRofSA9IGN0eC5tZWFzdXJlVGV4dChkYXRlKSk7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoZGF0ZSwgcm91bmRlZFhQb3MgKyBNYXRoLnJvdW5kKChpbnRlcnZhbC5ob3Jpem9udGFsIC0gNCkgLyAyIC0gY29udGVudFdpZHRoIC8gMiksIHJvdW5kZWRZUG9zICsgZm9udFlQb3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi5jb2xsZWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLlt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB4ICsgcm91bmRlZFhQb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHkgKyByb3VuZGVkWVBvcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoaW50ZXJ2YWwuaG9yaXpvbnRhbCkgLSA0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQoaW50ZXJ2YWwudmVydGljYWwpIC0gNCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGlja0RhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3JUeXBlOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgfSwgW10pO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGFBcmVhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAdGhpcyB7RGF0ZVBpY2tlci5wcm90b3R5cGV9ICovXHJcbiAgICBzdGF0aWMgZmluZEl0ZW1VbmRlclBvaW50ZXIoe3g6IHBvaW50ZXJYLCB5OiBwb2ludGVyWSwgY3Vyc29yVHlwZTogbGF0ZXN0S25vd25DdXJzb3JUeXBlLCB6SW5kZXg6IGhpZ2hlc3RaSW5kZXh9LCBhcmVhKSB7XHJcbiAgICAgICAgaWYgKCFhcmVhKSByZXR1cm4ge3g6IHBvaW50ZXJYLCB5OiBwb2ludGVyWSwgY3Vyc29yVHlwZTogbGF0ZXN0S25vd25DdXJzb3JUeXBlLCB6SW5kZXg6IGhpZ2hlc3RaSW5kZXh9O1xyXG4gICAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXh9ID0gYXJlYTtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IHpJbmRleCA+IGhpZ2hlc3RaSW5kZXggJiZcclxuICAgICAgICAgICAgeCA8IHBvaW50ZXJYICYmXHJcbiAgICAgICAgICAgIHkgPCBwb2ludGVyWSAmJlxyXG4gICAgICAgICAgICAoeCArIHdpZHRoKSA+IHBvaW50ZXJYICYmXHJcbiAgICAgICAgICAgICh5ICsgaGVpZ2h0KSA+IHBvaW50ZXJZO1xyXG4gICAgICAgIGFyZWEuaGlnaGxpZ2h0ZWQgPSBtYXRjaDtcclxuICAgICAgICByZXR1cm4gey4uLnt4OiBwb2ludGVyWCwgeTogcG9pbnRlcll9LCAuLi4oKG1hdGNoICYmIGFyZWEpIHx8IHtjdXJzb3JUeXBlOiBsYXRlc3RLbm93bkN1cnNvclR5cGUsIHpJbmRleDogaGlnaGVzdFpJbmRleH0pfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2FsZW5kYXJCdWlsZGVyKGRhdGUpIHtcclxuICAgICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKDEpO1xyXG4gICAgICAgIGNvbnN0IGRheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICAgICAgbGV0IGlkeCA9IChkYXRlLmdldERheSgpICsgNikgJSA3O1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgeWVhcjogZGF0ZS5nZXRGdWxsWWVhcigpLFxyXG4gICAgICAgICAgICBtb250aDogbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ3J1Jywge21vbnRoOiAnbG9uZyd9KVxyXG4gICAgICAgICAgICAgICAgLmZvcm1hdChkYXRlKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL15b0LAt0Y9dLywgbWF0Y2ggPT4gbWF0Y2gudG9VcHBlckNhc2UoKSlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBbXTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGRhdGFbaWR4KytdID0ge1xyXG4gICAgICAgICAgICAgICAgZGF0ZTogZGF0ZS5nZXREYXRlKCksXHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRlZDogZmFsc2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKCtkYXRlICsgZGF5KTtcclxuICAgICAgICB9IHdoaWxlIChkYXRlLmdldERhdGUoKSA+IDEpO1xyXG4gICAgICAgIHJldHVybiB7Li4ucmVzdWx0LCAuLi57ZGF0ZXM6IFsuLi5kYXRhXX19O1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0KCkge1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJEYXRhID0gRGF0ZVBpY2tlci5jYWxlbmRhckJ1aWxkZXIodGhpcy5jdXJyZW50RGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIG9uTW91c2VEb3duKHt4OiBjbGlja1gsIHk6IGNsaWNrWX0pIHtcclxuICAgICAgICBjb25zdCBfZmluZCA9IGFyZWEgPT4gKFxyXG4gICAgICAgICAgICBhcmVhICYmIGFyZWEueCA8IGNsaWNrWCAmJiBhcmVhLnkgPCBjbGlja1kgJiYgKGFyZWEueCArIGFyZWEud2lkdGgpID4gY2xpY2tYICYmIChhcmVhLnkgKyBhcmVhLmhlaWdodCkgPiBjbGlja1lcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLmNhbGVuZGFyRGF0YS5vYnNlcnZhYmxlQXJlYXMuZmluZChfZmluZCkgfHwgdGhpcy5jYWxlbmRhckRhdGEuZGF0ZXMuZmluZChfZmluZCkgfHwge3R5cGU6ICcnfTtcclxuICAgICAgICBzd2l0Y2ggKGFyZWEudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdwaWNrRGF0ZSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldERhdGUoYXJlYS5kYXRlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdpbmNyZWFzZUN1cnJlbnRNb250aCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldE1vbnRoKHRoaXMuY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2RlY3JlYXNlQ3VycmVudE1vbnRoJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGUuc2V0TW9udGgodGhpcy5jdXJyZW50RGF0ZS5nZXRNb250aCgpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaW5jcmVhc2VDdXJyZW50WWVhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlLnNldEZ1bGxZZWFyKHRoaXMuY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2RlY3JlYXNlQ3VycmVudFllYXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZS5zZXRGdWxsWWVhcih0aGlzLmN1cnJlbnREYXRlLmdldEZ1bGxZZWFyKCkgLSAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIuY2FsZW5kYXJCdWlsZGVyKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbml0aWF0b3Iuc2V0RGF0ZSh0aGlzLmN1cnJlbnREYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KHt4ID0gdGhpcy54LCB5ID0gdGhpcy55LCBpbml0aWF0b3J9KSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7eCwgeSwgekluZGV4OiBJbmZpbml0eSwgaW5pdGlhdG9yLCBvcGVuZWQ6IHRydWV9KTtcclxuICAgICAgICB0aGlzLmN1cnJlbnREYXRlID0gaW5pdGlhdG9yLmRhdGUgfHwgbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIuY2FsZW5kYXJCdWlsZGVyKHRoaXMuY3VycmVudERhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmFzc2lnbkxhc3RBY3RpdmF0ZWQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtvcGVuZWQ6IGZhbHNlLCB6SW5kZXg6IC0xfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge3g6IC1JbmZpbml0eSwgeTogLUluZmluaXR5LCBpbml0aWF0b3I6IG51bGx9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmNhbGVuZGFyRGF0YSA9IERhdGVQaWNrZXIucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodEFyZWFzKHBvcykge1xyXG4gICAgICAgICh7Y3Vyc29yVHlwZTogQXBwLmluc3RhbmNlLmNhbnZhcy5zdHlsZS5jdXJzb3J9ID0gW1xyXG4gICAgICAgICAgICAuLi50aGlzLmNhbGVuZGFyRGF0YS5kYXRlcyxcclxuICAgICAgICAgICAgLi4udGhpcy5jYWxlbmRhckRhdGEub2JzZXJ2YWJsZUFyZWFzXHJcbiAgICAgICAgXS5yZWR1Y2UoRGF0ZVBpY2tlci5maW5kSXRlbVVuZGVyUG9pbnRlciwgey4uLnBvcywgLi4ue2N1cnNvclR5cGU6ICdpbml0aWFsJywgekluZGV4OiAtMX19KSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudCh7b2Zmc2V0WDogeCwgb2Zmc2V0WTogeX0pIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlKHRoaXMuaGlnaGxpZ2h0QXJlYXMuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7ZGF0ZUZvcm1hdCwgdGhyb3R0bGV9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQge0RhdGVQaWNrZXJ9IGZyb20gXCIuL2RhdGUtcGlja2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRWRpdEJveCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7d2lkdGggPSBFZGl0Qm94Lmdlb21ldHJpYy53aWR0aCwgaXNDYWxlbmRhciA9IGZhbHNlLCBkYXRlID0gaXNDYWxlbmRhciA/IG5ldyBEYXRlKCkgOiBudWxsLCB2YWx1ZSA9IGlzQ2FsZW5kYXIgPyBkYXRlRm9ybWF0KGRhdGUpIDogJycsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdFZGl0Qm94JztcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJsaW5rVGltZW91dCA9IDA7XHJcbiAgICAgICAgdGhpcy5jYXJldCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICAgIHRoaXMuaXNDYWxlbmRhciA9IGlzQ2FsZW5kYXI7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBFZGl0Qm94Lmdlb21ldHJpYywge3dpZHRofSk7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMgPSBbXHJcbiAgICAgICAgICAgIC4uLihcclxuICAgICAgICAgICAgICAgIGlzQ2FsZW5kYXIgPyBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ZvY3VzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yVHlwZTogJ3RleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCArIHRoaXMud2lkdGggLSB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Nob3dDYWxlbmRhcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0gOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IHRoaXMueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmb2N1cycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvclR5cGU6ICd0ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBnZW9tZXRyaWMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgd2lkdGg6IDkwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVuZGVyKHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCBjYXJldCwgZm9jdXNlZCwgdmFsdWUsIGlzQ2FsZW5kYXJ9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCAtIDIsIHkgLSAyLCB3aWR0aCArIDMsIGhlaWdodCArIDMpO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzE0cHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHRXaWR0aCA9IE1hdGguZmxvb3IoY3R4Lm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGZvY3VzZWQgPyAnYmxhY2snIDogJyM2NjY2NjYnO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICAgICAgICAgIGlmIChjYXJldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHggKyAzICsgdGV4dFdpZHRoLCB5ICsgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgMyArIHRleHRXaWR0aCwgeSArIGhlaWdodCAtIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzFkMWQxZCc7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHZhbHVlLCB4ICsgMywgeSArIGhlaWdodCAtIDQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWlzQ2FsZW5kYXIpIHJldHVybiBjdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMjBweC8wIFdlYmRpbmdzJztcclxuICAgICAgICAgICAgY29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCgnwqYnKS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudDtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjNjY2NjY2JztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCfCpicsIHggKyB3aWR0aCAtIGhlaWdodCwgeSArIGZvbnRIZWlnaHQgKyAxKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAdGhpcyB7RWRpdEJveC5wcm90b3R5cGV9ICovXHJcbiAgICBzdGF0aWMgZGVmaW5lQ3Vyc29yVHlwZSh7eCwgeX0pIHtcclxuICAgICAgICAoe2N1cnNvclR5cGU6IEFwcC5pbnN0YW5jZS5jYW52YXMuc3R5bGUuY3Vyc29yfSA9IChcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZhYmxlQXJlYXMuZmluZChmdW5jdGlvbih7eCwgeSwgd2lkdGgsIGhlaWdodH0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB4IDwgdGhpcy54ICYmIHkgPCB0aGlzLnkgJiYgKHggKyB3aWR0aCkgPiB0aGlzLnggJiYgKHkgKyBoZWlnaHQpID4gdGhpcy55O1xyXG4gICAgICAgICAgICB9LCB7eCwgeX0pIHx8IHtjdXJzb3JUeXBlOiAnaW5pdGlhbCd9XHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbignbW91c2Vtb3ZlJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU91dCgpIHtcclxuICAgICAgICBBcHAuaW5zdGFuY2UuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdpbml0aWFsJztcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcyk7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmJsaW5rVGltZW91dCk7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYXJldCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNDYWxlbmRhciAmJiB0aGlzLnNldERhdGUobmV3IERhdGUoRGF0ZS5wYXJzZSh0aGlzLnZhbHVlKSkpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZURvd24oe3gsIHl9KSB7XHJcbiAgICAgICAgY29uc3QgYXJlYSA9IHRoaXMub2JzZXJ2YWJsZUFyZWFzLmZpbmQoZnVuY3Rpb24oe3gsIHksIHdpZHRoLCBoZWlnaHR9KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4IDwgdGhpcy54ICYmIHkgPCB0aGlzLnkgJiYgKHggKyB3aWR0aCkgPiB0aGlzLnggJiYgKHkgKyBoZWlnaHQpID4gdGhpcy55O1xyXG4gICAgICAgIH0sIHt4LCB5fSk7XHJcbiAgICAgICAgaWYgKCFhcmVhKSByZXR1cm47XHJcbiAgICAgICAgc3dpdGNoIChhcmVhLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnZm9jdXMnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3dDYWxlbmRhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dDYWxlbmRhcih7eCwgeX0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dDYWxlbmRhcih7eCwgeX0pIHtcclxuICAgICAgICBEYXRlUGlja2VyLmluc3RhbmNlLnNob3coe2luaXRpYXRvcjogdGhpcywgeCwgeX0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvY3VzKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKTtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuYmxpbmtUaW1lb3V0KTtcclxuICAgICAgICB0aGlzLmJsaW5rVGltZW91dCA9IHNldEludGVydmFsKHRoaXMuYmxpbmsuYmluZCh0aGlzKSwgNTAwKTtcclxuICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY2FyZXQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYmxpbmsoKSB7XHJcbiAgICAgICAgdGhpcy5jYXJldCA9ICF0aGlzLmNhcmV0O1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGF0ZShkYXRlID0gdGhpcy5kYXRlKSB7XHJcbiAgICAgICAgaWYgKCFkYXRlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5kYXRlID0gZGF0ZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gZGF0ZUZvcm1hdChkYXRlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBFZGl0Qm94LnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVFdmVudChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGNvbnN0IHt0eXBlLCBrZXksIG9mZnNldFg6IHgsIG9mZnNldFk6IHl9ID0gZTtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAna2V5ZG93bic6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0JhY2tzcGFjZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnN1YnN0cigwLCB0aGlzLnZhbHVlLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdFbnRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25CbHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0FsdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQ29udHJvbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnU2hpZnQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSArPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRocm90dGxlKEVkaXRCb3guZGVmaW5lQ3Vyc29yVHlwZS5iaW5kKHRoaXMpLCB7eCwgeX0pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgSG92ZXIge1xyXG4gICAgY29uc3RydWN0b3Ioe2lkfSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SG92ZXJ9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xyXG4gICAgICAgIHJldHVybiBfaW5zdGFuY2UgfHwgKGkgPT4gX2luc3RhbmNlID0gaSkobmV3IEhvdmVyKHtpZDogQ29tcG9uZW50Lm5leHRJZH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcih7eCwgeSwgd2lkdGgsIGhlaWdodCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHggLSAyLCB5IC0gMiwgd2lkdGggKyA0LCBoZWlnaHQgKyA0KTtcclxuICAgICAgICBpZiAoIWFjdGl2ZSkgcmV0dXJuO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjZmQyOTI5JztcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNvbnRleHRNZW51KCkge31cclxuXHJcbiAgICBvbkJsdXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdmVyKCkge31cclxuXHJcbiAgICBvbk1vdXNlT3V0KCkge31cclxuXHJcbiAgICBvbk1vdXNlRG93bigpIHt9XHJcblxyXG4gICAgb25Nb3VzZVVwKCkge31cclxuXHJcbiAgICBzaG93KHt4LCB5LCB3aWR0aCwgaGVpZ2h0LCB6SW5kZXggPSAxfSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywge1xyXG4gICAgICAgICAgICB4OiB4IC0gMSxcclxuICAgICAgICAgICAgeTogeSAtIDEsXHJcbiAgICAgICAgICAgIHdpZHRoOiB3aWR0aCArIDIsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ICsgMixcclxuICAgICAgICAgICAgekluZGV4OiB6SW5kZXggLSAxLFxyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IC1JbmZpbml0eSxcclxuICAgICAgICAgICAgeTogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIEhvdmVyLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50fSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9hcHBcIjtcclxuXHJcbmxldCBfaW5zdGFuY2U7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7aWR9KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMudGV4dCA9ICcnO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UgPSBkZWJvdW5jZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7VG9vbHRpcH0gKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9pbnN0YW5jZSB8fCAoaSA9PiBfaW5zdGFuY2UgPSBpKShuZXcgVG9vbHRpcCh7aWQ6IENvbXBvbmVudC5uZXh0SWR9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRleHR9LCBjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHgucmVjdCh4LCB5LCA1MDAsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmZWE5Zic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMzIzMjMyJztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRleHQsIHggKyAxMCwgeSArIGhlaWdodCAtIDEwKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29udGV4dE1lbnUoKSB7fVxyXG5cclxuICAgIG9uQmx1cigpIHt9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7fVxyXG5cclxuICAgIG9uTW91c2VPdXQoKSB7fVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge31cclxuXHJcbiAgICBvbk1vdXNlVXAoKSB7fVxyXG5cclxuICAgIHNob3coe3gsIHksIHRvb2x0aXBDb250ZW50fSkge1xyXG4gICAgICAgIGNvbnN0IHtjdHgsIGNhbnZhczoge3dpZHRoOiBjYW52YXNXaWR0aH19ID0gQXBwLmluc3RhbmNlO1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwcHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IHthY3R1YWxCb3VuZGluZ0JveEFzY2VudDogY29udGVudEhlaWdodCwgd2lkdGg6IGNvbnRlbnRXaWR0aH0gPSBjdHgubWVhc3VyZVRleHQodG9vbHRpcENvbnRlbnQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XHJcbiAgICAgICAgICAgIHg6IHggPiAoY2FudmFzV2lkdGggLSBjb250ZW50V2lkdGggLSAyMCkgPyB4IC0gY29udGVudFdpZHRoIC0gMjAgOiB4LFxyXG4gICAgICAgICAgICB5OiB5ID4gY29udGVudEhlaWdodCArIDIwID8geSAtIGNvbnRlbnRIZWlnaHQgLSAyMCA6IHksXHJcbiAgICAgICAgICAgIHdpZHRoOiBjb250ZW50V2lkdGggKyAyMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiBjb250ZW50SGVpZ2h0ICsgMjAsXHJcbiAgICAgICAgICAgIHRleHQ6IHRvb2x0aXBDb250ZW50LFxyXG4gICAgICAgICAgICB6SW5kZXg6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UubGlzdGVuKCdtb3VzZW1vdmUnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gJyc7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHtcclxuICAgICAgICAgICAgeDogLUluZmluaXR5LFxyXG4gICAgICAgICAgICB5OiAtSW5maW5pdHksXHJcbiAgICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDBcclxuICAgICAgICB9KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UudW5saXN0ZW4oJ21vdXNlbW92ZScsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZSh7eCwgeX0pIHtcclxuICAgICAgICBjb25zdCB7dGV4dCwgekluZGV4fSA9IHRoaXM7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7dGV4dDogJycsIHpJbmRleDogLTF9KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgey4uLnt4LCB5OiB5IC0gdGhpcy5oZWlnaHQsIHRleHQsIHpJbmRleH19KTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBUb29sdGlwLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBBcHAuaW5zdGFuY2UucmVwYWludEFmZmVjdGVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtvZmZzZXRYOiB4LCBvZmZzZXRZOiB5fSkge1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UodGhpcy50cmFuc2xhdGUuYmluZCh0aGlzKSwge3gsIHl9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcbmltcG9ydCB7QXBwfSBmcm9tIFwiLi4vYXBwXCI7XHJcbmltcG9ydCB7IGRlYm91bmNlIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCB7c2ludXNvaWRHZW59IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyZW5kZXIgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnVHJlbmRlcic7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IDE7XHJcbiAgICAgICAgdGhpcy5jdHhNZW51Q29uZmlnID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1pvb20gSW4nLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgKj0gMS4xO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBPdXQnLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgKj0gMC45O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnWm9vbSBSZXNldCcsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0ubWFwKCh7Y2FsbGJhY2ssIC4uLnJlc3R9KSA9PiAoe1xyXG4gICAgICAgICAgICAuLi5yZXN0LFxyXG4gICAgICAgICAgICAuLi57XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuZGVib3VuY2UgPSBkZWJvdW5jZSgpO1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlbmRlcihjb25maWcsIGN0eCkge1xyXG4gICAgICAgIGNvbnN0IGNoYXJ0TWFyZ2luID0gMjA7XHJcbiAgICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIGRhdGE6IHtwb2ludHN9fSA9IGNvbmZpZztcclxuICAgICAgICBjb25zdCBjaGFydEFyZWEgPSB7XHJcbiAgICAgICAgICAgIHg6IHggKyBwYWRkaW5nWzNdLFxyXG4gICAgICAgICAgICB5OiB5ICsgcGFkZGluZ1swXSxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoIC0gcGFkZGluZ1sxXSAtIHBhZGRpbmdbM10sXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC0gcGFkZGluZ1swXSAtIHBhZGRpbmdbMl1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHttaW4sIG1heH0gPSBUcmVuZGVyLm5vcm1hbGl6ZVJhbmdlKHBvaW50cyk7XHJcbiAgICAgICAgY29uc3QgcmFuZ2VTY2FsZSA9IChjaGFydEFyZWEuaGVpZ2h0IC0gY2hhcnRNYXJnaW4pIC8gKG1heCAtIG1pbik7XHJcbiAgICAgICAgY29uc3QgemVyb0xldmVsID0gTWF0aC5mbG9vcigoY2hhcnRBcmVhLnkgKyBjaGFydE1hcmdpbiAvIDIpICsgbWF4ICogcmFuZ2VTY2FsZSk7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDEyNywgMTI3LCAxMjcsIDAuMiknO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdC5hcHBseShjdHgsIE9iamVjdC52YWx1ZXMoY2hhcnRBcmVhKSk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICBUcmVuZGVyLmRyYXdYQXhpcyh7Li4uY29uZmlnLCAuLi5jaGFydEFyZWF9LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd1lBeGlzKHsuLi5jb25maWcsIC4uLmNoYXJ0QXJlYSwgLi4ue3plcm9MZXZlbCwgcmFuZ2VTY2FsZX19LCBjdHgpO1xyXG4gICAgICAgIFRyZW5kZXIuZHJhd0RhdGEoey4uLmNvbmZpZywgLi4uY2hhcnRBcmVhLCAuLi57emVyb0xldmVsLCByYW5nZVNjYWxlfX0sIGN0eCk7XHJcbiAgICAgICAgVHJlbmRlci5kcmF3TGVnZW5kKHsuLi5jb25maWcsIC4uLntcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeTogeSArIGhlaWdodCAtIDQwLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH19LCBjdHgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gICAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZHJhd0RhdGEoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcsIHNjYWxlLCBkYXRhOiB7cG9pbnRzID0gW119LCB6ZXJvTGV2ZWwsIHJhbmdlU2NhbGV9LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzAwMDBmZic7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBjdHguc2V0VHJhbnNmb3JtKDEsIDAsIDAsIDEsIHgsIHplcm9MZXZlbCk7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCAoLXBvaW50c1swXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcG9pbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgc3RlcCA9IHdpZHRoIC8gbGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzY2FsZWRWYWx1ZSA9IC1wb2ludHNbaV0udmFsdWUgKiBzY2FsZSAqIHJhbmdlU2NhbGUsXHJcbiAgICAgICAgICAgICAgICAgICAgIHhQb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgIGkgPCBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgeFBvcyArPSBzdGVwLCBzY2FsZWRWYWx1ZSA9ICgtcG9pbnRzWysraV0/LnZhbHVlIHx8IDApICogc2NhbGUgKiByYW5nZVNjYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKHhQb3MsIHNjYWxlZFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSBwb2ludHMubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICBzdGVwID0gd2lkdGggLyBsZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFZhbHVlID0gLXBvaW50c1tpXS52YWx1ZSAqIHNjYWxlICogcmFuZ2VTY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICAgeFBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgaSA8IGxlbmd0aDtcclxuICAgICAgICAgICAgICAgICB4UG9zICs9IHN0ZXAsIHNjYWxlZFZhbHVlID0gKC1wb2ludHNbKytpXT8udmFsdWUgfHwgMCkgKiBzY2FsZSAqIHJhbmdlU2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4UG9zIC0gNCwgc2NhbGVkVmFsdWUgLSA0LCA4LCA4KTtcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KHhQb3MgLSA0LCBzY2FsZWRWYWx1ZSAtIDQsIDgsIDgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdYQXhpcyh7eCwgeSwgd2lkdGgsIGhlaWdodCwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzNjM2MzYyc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyh4LCB5ICsgaGVpZ2h0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNjAsIDE2MCwgMTYwLCAwLjUpJztcclxuICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTBweCBzYW5zLXNlcmlmJztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgeFBvcyA9IHgsXHJcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSB3aWR0aCAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgcm91bmRlZFhQb3MgPSBNYXRoLnJvdW5kKHhQb3MpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsV2lkdGggPSBjdHgubWVhc3VyZVRleHQocG9pbnRzWzBdLnRpbWUpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsT2Zmc2V0ID0gTWF0aC5yb3VuZChsYWJlbFdpZHRoIC8gMiksXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzSW50ZXJ2YWwgPSBNYXRoLmNlaWwoKGxhYmVsV2lkdGggKyAyMCkgLyBpbnRlcnZhbCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dExhYmVsUG9zID0geFBvcyArIGxhYmVsc0ludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgaSA8IHBvaW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgICAgICB4UG9zICs9IGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgICAgICByb3VuZGVkWFBvcyA9IE1hdGgucm91bmQoeFBvcyksXHJcbiAgICAgICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gIShpICUgbGFiZWxzSW50ZXJ2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBpc01ham9yVGljayA/ICcjM2MzYzNjJyA6ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhyb3VuZGVkWFBvcywgaXNNYWpvclRpY2sgPyB5ICsgaGVpZ2h0ICsgNSA6IHkgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhyb3VuZGVkWFBvcywgeSk7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTWFqb3JUaWNrKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChwb2ludHNbaV0udGltZSwgcm91bmRlZFhQb3MgLSBsYWJlbE9mZnNldCwgeSArIGhlaWdodCArIDIwKTtcclxuICAgICAgICAgICAgICAgIG5leHRMYWJlbFBvcyArPSBsYWJlbHNJbnRlcnZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBkcmF3WUF4aXMoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHRpY2tzID0gMjAsIG1ham9yVGlja3NJbnRlcnZhbCwgemVyb0xldmVsLCBzY2FsZSwgcmFuZ2VTY2FsZSwgZGF0YToge3BvaW50c319LCBjdHgpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKDE2MCwgMTYwLCAxNjAsIDAuNSknO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnIzFhMWExYSc7XHJcbiAgICAgICAgY3R4LmZvbnQgPSAnYm9sZCAxNHB4IHNhbnMtc2VyaWYnO1xyXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gaGVpZ2h0IC8gdGlja3M7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5yZWN0KHggLTEwMCwgeSwgd2lkdGggKyAxMDAsIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsaXAoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCxcclxuICAgICAgICAgICAgICAgICB5UG9zID0gemVyb0xldmVsICsgTWF0aC5jZWlsKCh5ICsgaGVpZ2h0IC0gemVyb0xldmVsKSAvIGludGVydmFsKSAqIGludGVydmFsLFxyXG4gICAgICAgICAgICAgICAgIHJvdW5kZWRZUG9zID0gTWF0aC5yb3VuZCh5UG9zKSxcclxuICAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcykgLyByYW5nZVNjYWxlIC8gc2NhbGUpLnRvRml4ZWQoMiksXHJcbiAgICAgICAgICAgICAgICBpc01ham9yVGljayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgaSA8IHRpY2tzO1xyXG4gICAgICAgICAgICAgaSsrLFxyXG4gICAgICAgICAgICAgICAgeVBvcyAtPSBpbnRlcnZhbCxcclxuICAgICAgICAgICAgICAgICByb3VuZGVkWVBvcyA9IE1hdGgucm91bmQoeVBvcyksXHJcbiAgICAgICAgICAgICAgICBsYWJlbCA9ICgoemVyb0xldmVsIC0geVBvcyApIC8gcmFuZ2VTY2FsZSAvIHNjYWxlKS50b0ZpeGVkKDIpLFxyXG4gICAgICAgICAgICAgICAgIGlzTWFqb3JUaWNrID0gTWF0aC5hYnMoeVBvcyAtIHplcm9MZXZlbCkgJSAoaW50ZXJ2YWwgKiBtYWpvclRpY2tzSW50ZXJ2YWwpIDwgaW50ZXJ2YWwgLyAyKSB7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGlzTWFqb3JUaWNrID8gJyM0MzQzNDMnIDogJ3JnYmEoMTYwLCAxNjAsIDE2MCwgMC41KSc7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhpc01ham9yVGljayA/IHggLSA1IDogeCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgcm91bmRlZFlQb3MpO1xyXG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGlmICghaXNNYWpvclRpY2spIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQobGFiZWwsIHggLSBjdHgubWVhc3VyZVRleHQobGFiZWwpLndpZHRoIC0gMTAsIHJvdW5kZWRZUG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICAgICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRyYXdMZWdlbmQoe3gsIHksIHdpZHRoLCBoZWlnaHQsIGRhdGE6IHtuYW1lfX0sIGN0eCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2IoMCwwLDI1NSknO1xyXG4gICAgICAgICAgICBjdHguZm9udCA9ICdib2xkIDEycHggc2Fucy1zZXJpZic7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRIZWlnaHQgPSBjdHgubWVhc3VyZVRleHQobmFtZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oLTEsIDAsIDAsIDEsIHggKyB3aWR0aCAvIDIgLSA1LCB5ICsgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbygwLCA0KTtcclxuICAgICAgICAgICAgY3R4LmxpbmVUbygyMCwgNCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCg2LCAwLCA4LCA4KTtcclxuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoNiwgMCwgOCwgOCk7XHJcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgeCArIHdpZHRoIC8gMiArIDUsIHkgKyBoZWlnaHQgLyAyKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMTUxNTE1JztcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KG5hbWUsIDAsIGZvbnRIZWlnaHQgLSAyKTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBub3JtYWxpemVSYW5nZShkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVkdWNlKCh7bWluLCBtYXgsIG1heE5lZ2F0aXZlLCBtaW5Qb3NpdGl2ZX0sIHt2YWx1ZX0pID0+IChcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWluOiBNYXRoLm1pbih2YWx1ZSwgbWluKSxcclxuICAgICAgICAgICAgICAgIG1heDogTWF0aC5tYXgodmFsdWUsIG1heClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICksIHtcclxuICAgICAgICAgICAgbWluOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgbWF4OiAtSW5maW5pdHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja0RhdGEoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKSAtIDEwMDAgKiAyOTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5KDMwKVxyXG4gICAgICAgICAgICAuZmlsbChzdGFydFRpbWUpXHJcbiAgICAgICAgICAgIC5tYXAoKHRpbWUsIGlkeCkgPT4gKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKHRpbWUgKyAxMDAwICogaWR4KS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc2ludXNvaWRHZW4ubmV4dCgpLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbW9ja05leHREYXRhKCkge1xyXG4gICAgICAgIEFwcC5pbnN0YW5jZS5kaXNwYXRjaChuZXcgQ3VzdG9tRXZlbnQoJ3RyZW5kZXJOZXh0VGljaycsIHtkZXRhaWw6IHtcclxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKSxcclxuICAgICAgICAgICAgdmFsdWU6IHNpbnVzb2lkR2VuLm5leHQoKS52YWx1ZSxcclxuICAgICAgICB9fSkpXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXQoKSB7XHJcbiAgICAgICAgQXBwLmluc3RhbmNlLmxpc3RlbigndHJlbmRlck5leHRUaWNrJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Nb3VzZU92ZXIoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIFRyZW5kZXIucmVuZGVyKHRoaXMsIEFwcC5pbnN0YW5jZS5jdHgpO1xyXG4gICAgICAgIHN1cGVyLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUV2ZW50KHtkZXRhaWx9KSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnBvaW50cy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMuZGF0YS5wb2ludHMucHVzaChkZXRhaWwpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4uL2FwcFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbHVlSXRlbSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih7dmFsdWUsIC4uLnBhcmFtc30pIHtcclxuICAgICAgICBzdXBlcihwYXJhbXMpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICdWYWx1ZUl0ZW0nO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gMDtcclxuICAgICAgICB0aGlzLmN0eE1lbnVDb25maWcgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTW92ZScsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdIb3Jpem9udGFsbHknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTGVmdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVydGljYWxseScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzLCB7eTogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEb3duJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMsIHt5OiAyMH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVzaXplJyxcclxuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1knLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnR3JvdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eTogMjB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NocmluaycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5yZXNpemUuYmluZCh0aGlzLCB7eDogLTIwfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hpZGUnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5oaWRlLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBWYWx1ZUl0ZW0uZ2VvbWV0cmljKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGdlb21ldHJpYygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCByYW5kb21WYWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAxMDApLnRvRml4ZWQoMik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAgICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZW5kZXIoe3gsIHksIHdpZHRoLCBoZWlnaHQsIHZpc2libGUsIHZhbHVlLCB0cmVuZCwgYWN0aXZlfSwgY3R4KSB7XHJcbiAgICAgICAgbGV0IHN0YWNrID0gMDtcclxuICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgaWYgKCF2aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMTYxNjE2JztcclxuXHRcdFx0Y3R4LmZvbnQgPSAnYm9sZCAxMnB4IHNlcmlmJztcclxuXHRcdFx0Y29uc3QgZm9udEhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dCh2YWx1ZSkuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQ7XHJcblx0XHRcdGlmIChhY3RpdmUpIHtcclxuXHRcdFx0XHRjdHguc2F2ZSgpO1xyXG5cdFx0XHRcdHN0YWNrKys7XHJcblx0XHRcdFx0aWYgKHRyZW5kID4gMCkge1xyXG5cdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9ICcjMDBGRjAwJztcclxuXHRcdFx0XHRcdGN0eC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0cmVuZCA8IDApIHtcclxuXHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSAnI2U1MDAwMCc7XHJcblx0XHRcdFx0XHRjdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcblx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XHJcblx0XHRcdGN0eC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG5cdFx0XHRjdHguY2xpcCgpO1xyXG5cdFx0XHRjdHguZmlsbFRleHQodmFsdWUsIHggKyAxLCB5ICsgZm9udEhlaWdodCArIDUpO1xyXG5cdFx0XHRzdGFjayAmJiBjdHgucmVzdG9yZSgpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFJhbmRvbUNoYW5nZSgpIHtcclxuICAgICAgICBzZXRJbnRlcnZhbCh0aGlzLm9uVmFsdWVDaGFuZ2UuYmluZCh0aGlzKSwgMTAwMDAgKyBNYXRoLnJhbmRvbSgpICogNjAwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTW91c2VEb3duKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTW91c2VEb3duKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGV4dCh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnRyZW5kID0gdmFsdWUgPiB0aGlzLnZhbHVlID8gMSA6ICh2YWx1ZSA8IHRoaXMudmFsdWUgPyAtMSA6IDApO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRvb2x0aXBDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuYmxpbmsuYmluZCh0aGlzKSwgMjAwKTtcclxuICAgIH1cclxuXHJcbiAgICBibGluaygpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25WYWx1ZUNoYW5nZSgpIHtcclxuICAgICAgICB0aGlzLnNldFRleHQoVmFsdWVJdGVtLnJhbmRvbVZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgVmFsdWVJdGVtLnJlbmRlcih0aGlzLCBBcHAuaW5zdGFuY2UuY3R4KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb21wb25lbnRcIjtcclxuaW1wb3J0IHtDb2xsZWN0aW9uSXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jb2xsZWN0aW9uLWl0ZW1cIjtcclxuaW1wb3J0IHtUb29sdGlwfSBmcm9tIFwiLi9jb21wb25lbnRzL3Rvb2x0aXBcIjtcclxuaW1wb3J0IHtWYWx1ZUl0ZW19IGZyb20gXCIuL2NvbXBvbmVudHMvdmFsdWUtaXRlbVwiO1xyXG5pbXBvcnQge0NoYXJ0SXRlbX0gZnJvbSBcIi4vY29tcG9uZW50cy9jaGFydC1pdGVtXCI7XHJcbmltcG9ydCB7RWRpdEJveH0gZnJvbSBcIi4vY29tcG9uZW50cy9lZGl0LWJveFwiO1xyXG5pbXBvcnQge0NvbnRleHRNZW51fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbnRleHQtbWVudVwiO1xyXG5pbXBvcnQge0FwcH0gZnJvbSBcIi4vYXBwXCI7XHJcbmltcG9ydCB7QnV0dG9ufSBmcm9tIFwiLi9jb21wb25lbnRzL2J1dHRvblwiO1xyXG5pbXBvcnQge0NvbWJvQm94fSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbWJvLWJveFwiO1xyXG5pbXBvcnQge1RyZW5kZXJ9IGZyb20gXCIuL2NvbXBvbmVudHMvdHJlbmRlclwiO1xyXG5pbXBvcnQge0hvdmVyfSBmcm9tIFwiLi9jb21wb25lbnRzL2hvdmVyXCI7XHJcbmltcG9ydCB7Q2xvY2t9IGZyb20gXCIuL2NvbXBvbmVudHMvY2xvY2tcIjtcclxuaW1wb3J0IHtEYXRlUGlja2VyfSBmcm9tIFwiLi9jb21wb25lbnRzL2RhdGUtcGlja2VyXCI7XHJcblxyXG5jb25zdCBjaGFydENvbmZpZyA9IHtcclxuICAgIHR5cGU6ICdjb2x1bW4nLFxyXG4gICAgcGFkZGluZzogWzIwLCAyMCwgNzAsIDcwXSxcclxuICAgIHRpY2tzOiA1LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHBvaW50czogQ2hhcnRJdGVtLm1vY2tEYXRhKCksXHJcbiAgICAgICAgbWFyZ2luOiAwLjFcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHRyZW5kZXJDb25maWcgPSB7XHJcbiAgICBwYWRkaW5nOiBbMjAsIDIwLCA3MCwgNzBdLFxyXG4gICAgdGlja3M6IDIwLFxyXG4gICAgbWFqb3JUaWNrc0ludGVydmFsOiA0LFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIG5hbWU6ICdzaW4oeCknLFxyXG4gICAgICAgIHBvaW50czogVHJlbmRlci5tb2NrRGF0YSgpXHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBtZW51SXRlbXMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6ICdPbmUnLFxyXG4gICAgICAgIHZhbHVlOiAxLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogJ1R3bycsXHJcbiAgICAgICAgdmFsdWU6IDIsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiAnVGhyZWUnLFxyXG4gICAgICAgIHZhbHVlOiAzLFxyXG4gICAgfVxyXG5dO1xyXG5cclxuY29uc3QgYnV0dG9uQ2FsbGJhY2sgPSAoKSA9PiAoXHJcbiAgICBBcHAuaW5zdGFuY2UuZGlzcGF0Y2gobmV3IEN1c3RvbUV2ZW50KCdyYW5kb21pemVDaGFydERhdGEnKSlcclxuKTtcclxuXHJcbnNldEludGVydmFsKFRyZW5kZXIubW9ja05leHREYXRhLCAxMDAwKTtcclxuXHJcbkFwcC5pbnN0YW5jZS5jb21wb25lbnRzID0gW1xyXG4gICAgLi4uW1xyXG4gICAgICAgIG5ldyBDbG9jayh7eTogMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pXHJcbiAgICBdLFxyXG4gICAgLi4uQ29sbGVjdGlvbkl0ZW0uY29tcG9zZSh7eDogMCwgeTogMzAsIGNvbHM6IDI1LCByb3dzOiAxMiwgZ2FwOiAyMCwgY3RvcjogVmFsdWVJdGVtfSksXHJcbiAgICAuLi5bXHJcbiAgICAgICAgbmV3IEVkaXRCb3goe3g6IDAsIHk6IDYwMCwgekluZGV4OiAxLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBFZGl0Qm94KHt4OiAxMDAsIHk6IDYwMCwgd2lkdGg6IDEwMCwgekluZGV4OiAxLCBpc0NhbGVuZGFyOiB0cnVlLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDb21ib0JveCh7eDogMjUwLCB5OiA2MDAsIHpJbmRleDogMSwgdmFyaWFibGVOYW1lOiAnQ29tYm9ib3gxJywgbWVudUl0ZW1zLCBpZDogQ29tcG9uZW50Lm5leHRJZH0pLFxyXG4gICAgICAgIG5ldyBDaGFydEl0ZW0oey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiAzMCwgd2lkdGg6IDYwMCwgaGVpZ2h0OiA0MDAsIHpJbmRleDogMSwgaWQ6IENvbXBvbmVudC5uZXh0SWR9LCAuLi5jaGFydENvbmZpZ30pLFxyXG4gICAgICAgIG5ldyBCdXR0b24oe3g6IEFwcC5pbnN0YW5jZS5jYW52YXMud2lkdGggLSBCdXR0b24uZ2VvbWV0cmljLndpZHRoLCB5OiA0NTAsIHpJbmRleDogMSwgdmFsdWU6ICdSYW5kb21pemUnLCBjYWxsYmFjazogYnV0dG9uQ2FsbGJhY2ssIGlkOiBDb21wb25lbnQubmV4dElkfSksXHJcbiAgICAgICAgbmV3IFRyZW5kZXIoey4uLnt4OiBBcHAuaW5zdGFuY2UuY2FudmFzLndpZHRoIC0gNjAwLCB5OiA0OTAsIHdpZHRoOiA2MDAsIGhlaWdodDogNDAwLCB6SW5kZXg6IDEsIGlkOiBDb21wb25lbnQubmV4dElkfSwgLi4udHJlbmRlckNvbmZpZ30pLFxyXG4gICAgICAgIFRvb2x0aXAuaW5zdGFuY2UsXHJcbiAgICAgICAgSG92ZXIuaW5zdGFuY2UsXHJcbiAgICAgICAgQ29udGV4dE1lbnUuaW5zdGFuY2UsXHJcbiAgICAgICAgRGF0ZVBpY2tlci5pbnN0YW5jZVxyXG4gICAgXVxyXG5dO1xyXG5cclxuQXBwLmluc3RhbmNlLnJlbmRlcigpO1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZGVib3VuY2UodGhyZXNob2xkID0gMTAwKSB7XHJcbiAgICBsZXQgdGltZW91dCA9IDA7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIHRocmVzaG9sZCwgYXJnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKHRocmVzaG9sZCA9IDEwMCkge1xyXG4gICAgbGV0IHRpbWVvdXQgPSB0cnVlO1xyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4gdGltZW91dCA9IHRydWUsIHRocmVzaG9sZCk7XHJcbiAgICByZXR1cm4gKGZuLCBhcmcpID0+IHtcclxuICAgICAgICB0aW1lb3V0ICYmIGZuKGFyZyk7XHJcbiAgICAgICAgdGltZW91dCA9IGZhbHNlO1xyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3Qgc2ludXNvaWRHZW4gPSAoZnVuY3Rpb24qICgpIHtcclxuICAgIGNvbnN0IHBlcmlvZCA9IE1hdGguUEkgKiAyO1xyXG4gICAgY29uc3QgcSA9IDAuNTtcclxuICAgIGxldCBfaSA9IDA7XHJcbiAgICB3aGlsZSAodHJ1ZSkgeWllbGQgTWF0aC5yb3VuZChNYXRoLnNpbihfaSsrICogcSAlIHBlcmlvZCkgKiAxMDAwMCkgLyAxMDA7XHJcbn0pKCk7XHJcblxyXG5jb25zdCB0aW1lRm9ybWF0ID0gKHRpbWVGb3JtYXR0ZXIgPT4ge1xyXG4gICAgcmV0dXJuIHRpbWUgPT4gdGltZUZvcm1hdHRlci5mb3JtYXQodGltZSk7XHJcbn0pKG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydScsIHtob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnLCBzZWNvbmQ6ICcyLWRpZ2l0J30pKTtcclxuXHJcbmNvbnN0IGRhdGVGb3JtYXQgPSAoZGF0ZUZvcm1hdHRlciA9PiB7XHJcbiAgICByZXR1cm4gZGF0ZSA9PiBkYXRlRm9ybWF0dGVyLmZvcm1hdChkYXRlKTtcclxufSkobmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2VuJywge2RheTogJzItZGlnaXQnLCBtb250aDogJzItZGlnaXQnLCB5ZWFyOiAnbnVtZXJpYyd9KSk7XHJcblxyXG5leHBvcnQgeyBzaW51c29pZEdlbiwgdGltZUZvcm1hdCwgZGF0ZUZvcm1hdCB9XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9