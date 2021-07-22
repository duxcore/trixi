var trixi;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 659:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createClient = void 0;
var eventra_1 = __webpack_require__(825);
var uuid = __importStar(__webpack_require__(614));
var collection_1 = __importDefault(__webpack_require__(436));
var websocket_1 = __webpack_require__(840);
function createClient(options) {
    var _a;
    var isOpen = false;
    var url = options.url;
    var origin = options.origin;
    var headers = (_a = options.headers) !== null && _a !== void 0 ? _a : {};
    var wse = new eventra_1.Eventra();
    var ws = new websocket_1.w3cwebsocket(url, 'echo-protocol', origin);
    ws.onopen = function open() {
        isOpen = true;
        wse.emit('open');
        return;
    };
    ws.onclose = function close() {
        isOpen = false;
        wse.emit('close');
        return;
    };
    ws.onerror = function error(error) {
        throw error;
    };
    ws.onmessage = function incomming(event) {
        var interaction = JSON.parse(event.data.toString());
        wse.emit('interaction', interaction);
    };
    function assebleHeaders() {
        var headers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            headers[_i] = arguments[_i];
        }
        var finalHeaders = {};
        headers.forEach(function (header) {
            finalHeaders = Object.assign(finalHeaders, header);
        });
        return finalHeaders;
    }
    var _responseListeners = new collection_1.default();
    wse.on('interaction', function (interaction) {
        _responseListeners.map(function (callback, reference) {
            var _a;
            if (reference === interaction.reference) {
                _responseListeners.delete(reference);
                if ((_a = interaction.operator) === null || _a === void 0 ? void 0 : _a.startsWith('ERROR')) {
                    var error = new Error("(" + interaction.data.error.code + "): " + interaction.data.error.message);
                    return callback(interaction, error);
                }
                return callback(interaction, null);
            }
        });
    });
    function awaitResponse(reference, callback) {
        _responseListeners.set(reference, callback);
    }
    return {
        ws: ws,
        on: wse.on,
        once: wse.once,
        addListener: wse.addListener,
        listeners: wse.listeners,
        prependListener: wse.prependListener,
        prependOnceListener: wse.prependOnceListener,
        send: function (dispatch, callback) {
            var _a, _b;
            var data = dispatch.data;
            var uri = dispatch.uri;
            var method = dispatch.method;
            var reference = (_a = dispatch.reference) !== null && _a !== void 0 ? _a : uuid.v4();
            var payloadData = {
                uri: uri,
                data: data,
                headers: assebleHeaders(headers, ((_b = dispatch.headers) !== null && _b !== void 0 ? _b : {})),
                method: method,
                reference: reference
            };
            var dataString = JSON.stringify(payloadData);
            if (!isOpen)
                wse.on('open', function () { return ws.send(dataString); });
            else
                ws.send(dataString);
            awaitResponse(reference, callback);
        }
    };
}
exports.createClient = createClient;


/***/ }),

/***/ 436:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Collection = void 0;
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 * @property {number} size - The amount of elements in this collection.
 */
class Collection extends Map {
    /**
     * Identical to [Map.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get).
     * Gets an element with the specified key, and returns its value, or `undefined` if the element does not exist.
     * @param {*} key - The key to get from this collection
     * @returns {* | undefined}
     */
    get(key) {
        return super.get(key);
    }
    /**
     * Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set).
     * Sets a new element in the collection with the specified key and value.
     * @param {*} key - The key of the element to add
     * @param {*} value - The value of the element to add
     * @returns {Collection}
     */
    set(key, value) {
        return super.set(key, value);
    }
    /**
     * Identical to [Map.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has).
     * Checks if an element exists in the collection.
     * @param {*} key - The key of the element to check for
     * @returns {boolean} `true` if the element exists, `false` if it does not exist.
     */
    has(key) {
        return super.has(key);
    }
    /**
     * Identical to [Map.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete).
     * Deletes an element from the collection.
     * @param {*} key - The key to delete from the collection
     * @returns {boolean} `true` if the element was removed, `false` if the element does not exist.
     */
    delete(key) {
        return super.delete(key);
    }
    /**
     * Identical to [Map.clear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear).
     * Removes all elements from the collection.
     * @returns {undefined}
     */
    clear() {
        return super.clear();
    }
    /**
     * Checks if all of the elements exist in the collection.
     * @param {...*} keys - The keys of the elements to check for
     * @returns {boolean} `true` if all of the elements exist, `false` if at least one does not exist.
     */
    hasAll(...keys) {
        return keys.every((k) => super.has(k));
    }
    /**
     * Checks if any of the elements exist in the collection.
     * @param {...*} keys - The keys of the elements to check for
     * @returns {boolean} `true` if any of the elements exist, `false` if none exist.
     */
    hasAny(...keys) {
        return keys.some((k) => super.has(k));
    }
    first(amount) {
        if (typeof amount === 'undefined')
            return this.values().next().value;
        if (amount < 0)
            return this.last(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.values();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    firstKey(amount) {
        if (typeof amount === 'undefined')
            return this.keys().next().value;
        if (amount < 0)
            return this.lastKey(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.keys();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    last(amount) {
        const arr = [...this.values()];
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.first(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    lastKey(amount) {
        const arr = [...this.keys()];
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.firstKey(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    random(amount) {
        const arr = [...this.values()];
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    randomKey(amount) {
        const arr = [...this.keys()];
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    find(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return val;
        }
        return undefined;
    }
    findKey(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return key;
        }
        return undefined;
    }
    sweep(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const previousSize = this.size;
        for (const [key, val] of this) {
            if (fn(val, key, this))
                this.delete(key);
        }
        return previousSize - this.size;
    }
    filter(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (fn(val, key, this))
                results.set(key, val);
        }
        return results;
    }
    partition(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = [
            new this.constructor[Symbol.species](),
            new this.constructor[Symbol.species](),
        ];
        for (const [key, val] of this) {
            if (fn(val, key, this)) {
                results[0].set(key, val);
            }
            else {
                results[1].set(key, val);
            }
        }
        return results;
    }
    flatMap(fn, thisArg) {
        const collections = this.map(fn, thisArg);
        return new this.constructor[Symbol.species]().concat(...collections);
    }
    map(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }
    mapValues(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const coll = new this.constructor[Symbol.species]();
        for (const [key, val] of this)
            coll.set(key, fn(val, key, this));
        return coll;
    }
    some(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return true;
        }
        return false;
    }
    every(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (!fn(val, key, this))
                return false;
        }
        return true;
    }
    /**
     * Applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param {*} [initialValue] Starting value for the accumulator
     * @returns {*}
     * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
     */
    reduce(fn, initialValue) {
        let accumulator;
        if (typeof initialValue !== 'undefined') {
            accumulator = initialValue;
            for (const [key, val] of this)
                accumulator = fn(accumulator, val, key, this);
            return accumulator;
        }
        let first = true;
        for (const [key, val] of this) {
            if (first) {
                accumulator = val;
                first = false;
                continue;
            }
            accumulator = fn(accumulator, val, key, this);
        }
        // No items iterated.
        if (first) {
            throw new TypeError('Reduce of empty collection with no initial value');
        }
        return accumulator;
    }
    each(fn, thisArg) {
        this.forEach(fn, thisArg);
        return this;
    }
    tap(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        fn(this);
        return this;
    }
    /**
     * Creates an identical shallow copy of this collection.
     * @returns {Collection}
     * @example const newColl = someColl.clone();
     */
    clone() {
        return new this.constructor[Symbol.species](this);
    }
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     * @param {...Collection} collections Collections to merge
     * @returns {Collection}
     * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     */
    concat(...collections) {
        const newColl = this.clone();
        for (const coll of collections) {
            for (const [key, val] of coll)
                newColl.set(key, val);
        }
        return newColl;
    }
    /**
     * Checks if this collection shares identical items with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     * @param {Collection} collection Collection to compare with
     * @returns {boolean} Whether the collections have identical contents
     */
    equals(collection) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!collection)
            return false; // runtime check
        if (this === collection)
            return true;
        if (this.size !== collection.size)
            return false;
        for (const [key, value] of this) {
            if (!collection.has(key) || value !== collection.get(key)) {
                return false;
            }
        }
        return true;
    }
    /**
     * The sort method sorts the items of a collection in place and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sort(compareFunction = Collection.defaultSort) {
        const entries = [...this.entries()];
        entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
        // Perform clean-up
        super.clear();
        // Set the new entries
        for (const [k, v] of entries) {
            super.set(k, v);
        }
        return this;
    }
    /**
     * The intersect method returns a new structure containing items where the keys are present in both original structures.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    intersect(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [k, v] of other) {
            if (this.has(k))
                coll.set(k, v);
        }
        return coll;
    }
    /**
     * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    difference(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [k, v] of other) {
            if (!this.has(k))
                coll.set(k, v);
        }
        for (const [k, v] of this) {
            if (!other.has(k))
                coll.set(k, v);
        }
        return coll;
    }
    /**
     * The sorted method sorts the items of a collection and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sorted(compareFunction = Collection.defaultSort) {
        return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
    }
    static defaultSort(firstValue, secondValue) {
        return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
    }
}
exports.Collection = Collection;
Collection.default = Collection;
exports.default = Collection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBUUE7Ozs7O0dBS0c7QUFDSCxNQUFhLFVBQWlCLFNBQVEsR0FBUztJQUk5Qzs7Ozs7T0FLRztJQUNJLEdBQUcsQ0FBQyxHQUFNO1FBQ2hCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksR0FBRyxDQUFDLEdBQU0sRUFBRSxLQUFRO1FBQzFCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksR0FBRyxDQUFDLEdBQU07UUFDaEIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxHQUFNO1FBQ25CLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUs7UUFDWCxPQUFPLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxHQUFHLElBQVM7UUFDekIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsR0FBRyxJQUFTO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFVTSxLQUFLLENBQUMsTUFB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Q0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxrQkFBb0MsVUFBVSxDQUFDLFdBQVc7UUFDdkUsT0FBTyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0csQ0FBQztJQUVPLE1BQU0sQ0FBQyxXQUFXLENBQUksVUFBYSxFQUFFLFdBQWM7UUFDMUQsT0FBTyxNQUFNLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25GLENBQUM7O0FBdmxCRixnQ0F3bEJDO0FBdmxCdUIsa0JBQU8sR0FBc0IsVUFBVSxDQUFDO0FBMmxCaEUsa0JBQWUsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDb2xsZWN0aW9uQ29uc3RydWN0b3Ige1xuXHRuZXcgKCk6IENvbGxlY3Rpb248dW5rbm93biwgdW5rbm93bj47XG5cdG5ldyA8SywgVj4oZW50cmllcz86IFJlYWRvbmx5QXJyYXk8cmVhZG9ubHkgW0ssIFZdPiB8IG51bGwpOiBDb2xsZWN0aW9uPEssIFY+O1xuXHRuZXcgPEssIFY+KGl0ZXJhYmxlOiBJdGVyYWJsZTxyZWFkb25seSBbSywgVl0+KTogQ29sbGVjdGlvbjxLLCBWPjtcblx0cmVhZG9ubHkgcHJvdG90eXBlOiBDb2xsZWN0aW9uPHVua25vd24sIHVua25vd24+O1xuXHRyZWFkb25seSBbU3ltYm9sLnNwZWNpZXNdOiBDb2xsZWN0aW9uQ29uc3RydWN0b3I7XG59XG5cbi8qKlxuICogQSBNYXAgd2l0aCBhZGRpdGlvbmFsIHV0aWxpdHkgbWV0aG9kcy4gVGhpcyBpcyB1c2VkIHRocm91Z2hvdXQgZGlzY29yZC5qcyByYXRoZXIgdGhhbiBBcnJheXMgZm9yIGFueXRoaW5nIHRoYXQgaGFzXG4gKiBhbiBJRCwgZm9yIHNpZ25pZmljYW50bHkgaW1wcm92ZWQgcGVyZm9ybWFuY2UgYW5kIGVhc2Utb2YtdXNlLlxuICogQGV4dGVuZHMge01hcH1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaXplIC0gVGhlIGFtb3VudCBvZiBlbGVtZW50cyBpbiB0aGlzIGNvbGxlY3Rpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uPEssIFY+IGV4dGVuZHMgTWFwPEssIFY+IHtcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBkZWZhdWx0OiB0eXBlb2YgQ29sbGVjdGlvbiA9IENvbGxlY3Rpb247XG5cdHB1YmxpYyBbJ2NvbnN0cnVjdG9yJ106IENvbGxlY3Rpb25Db25zdHJ1Y3RvcjtcblxuXHQvKipcblx0ICogSWRlbnRpY2FsIHRvIFtNYXAuZ2V0KCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcC9nZXQpLlxuXHQgKiBHZXRzIGFuIGVsZW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSwgYW5kIHJldHVybnMgaXRzIHZhbHVlLCBvciBgdW5kZWZpbmVkYCBpZiB0aGUgZWxlbWVudCBkb2VzIG5vdCBleGlzdC5cblx0ICogQHBhcmFtIHsqfSBrZXkgLSBUaGUga2V5IHRvIGdldCBmcm9tIHRoaXMgY29sbGVjdGlvblxuXHQgKiBAcmV0dXJucyB7KiB8IHVuZGVmaW5lZH1cblx0ICovXG5cdHB1YmxpYyBnZXQoa2V5OiBLKTogViB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHN1cGVyLmdldChrZXkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIElkZW50aWNhbCB0byBbTWFwLnNldCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAvc2V0KS5cblx0ICogU2V0cyBhIG5ldyBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uIHdpdGggdGhlIHNwZWNpZmllZCBrZXkgYW5kIHZhbHVlLlxuXHQgKiBAcGFyYW0geyp9IGtleSAtIFRoZSBrZXkgb2YgdGhlIGVsZW1lbnQgdG8gYWRkXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBUaGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQgdG8gYWRkXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKi9cblx0cHVibGljIHNldChrZXk6IEssIHZhbHVlOiBWKTogdGhpcyB7XG5cdFx0cmV0dXJuIHN1cGVyLnNldChrZXksIHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZGVudGljYWwgdG8gW01hcC5oYXMoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWFwL2hhcykuXG5cdCAqIENoZWNrcyBpZiBhbiBlbGVtZW50IGV4aXN0cyBpbiB0aGUgY29sbGVjdGlvbi5cblx0ICogQHBhcmFtIHsqfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBlbGVtZW50IHRvIGNoZWNrIGZvclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSBlbGVtZW50IGV4aXN0cywgYGZhbHNlYCBpZiBpdCBkb2VzIG5vdCBleGlzdC5cblx0ICovXG5cdHB1YmxpYyBoYXMoa2V5OiBLKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHN1cGVyLmhhcyhrZXkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIElkZW50aWNhbCB0byBbTWFwLmRlbGV0ZSgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAvZGVsZXRlKS5cblx0ICogRGVsZXRlcyBhbiBlbGVtZW50IGZyb20gdGhlIGNvbGxlY3Rpb24uXG5cdCAqIEBwYXJhbSB7Kn0ga2V5IC0gVGhlIGtleSB0byBkZWxldGUgZnJvbSB0aGUgY29sbGVjdGlvblxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSBlbGVtZW50IHdhcyByZW1vdmVkLCBgZmFsc2VgIGlmIHRoZSBlbGVtZW50IGRvZXMgbm90IGV4aXN0LlxuXHQgKi9cblx0cHVibGljIGRlbGV0ZShrZXk6IEspOiBib29sZWFuIHtcblx0XHRyZXR1cm4gc3VwZXIuZGVsZXRlKGtleSk7XG5cdH1cblxuXHQvKipcblx0ICogSWRlbnRpY2FsIHRvIFtNYXAuY2xlYXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWFwL2NsZWFyKS5cblx0ICogUmVtb3ZlcyBhbGwgZWxlbWVudHMgZnJvbSB0aGUgY29sbGVjdGlvbi5cblx0ICogQHJldHVybnMge3VuZGVmaW5lZH1cblx0ICovXG5cdHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblx0XHRyZXR1cm4gc3VwZXIuY2xlYXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYWxsIG9mIHRoZSBlbGVtZW50cyBleGlzdCBpbiB0aGUgY29sbGVjdGlvbi5cblx0ICogQHBhcmFtIHsuLi4qfSBrZXlzIC0gVGhlIGtleXMgb2YgdGhlIGVsZW1lbnRzIHRvIGNoZWNrIGZvclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIGFsbCBvZiB0aGUgZWxlbWVudHMgZXhpc3QsIGBmYWxzZWAgaWYgYXQgbGVhc3Qgb25lIGRvZXMgbm90IGV4aXN0LlxuXHQgKi9cblx0cHVibGljIGhhc0FsbCguLi5rZXlzOiBLW10pOiBib29sZWFuIHtcblx0XHRyZXR1cm4ga2V5cy5ldmVyeSgoaykgPT4gc3VwZXIuaGFzKGspKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYW55IG9mIHRoZSBlbGVtZW50cyBleGlzdCBpbiB0aGUgY29sbGVjdGlvbi5cblx0ICogQHBhcmFtIHsuLi4qfSBrZXlzIC0gVGhlIGtleXMgb2YgdGhlIGVsZW1lbnRzIHRvIGNoZWNrIGZvclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIGFueSBvZiB0aGUgZWxlbWVudHMgZXhpc3QsIGBmYWxzZWAgaWYgbm9uZSBleGlzdC5cblx0ICovXG5cdHB1YmxpYyBoYXNBbnkoLi4ua2V5czogS1tdKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGtleXMuc29tZSgoaykgPT4gc3VwZXIuaGFzKGspKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPYnRhaW5zIHRoZSBmaXJzdCB2YWx1ZShzKSBpbiB0aGlzIGNvbGxlY3Rpb24uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50XSBBbW91bnQgb2YgdmFsdWVzIHRvIG9idGFpbiBmcm9tIHRoZSBiZWdpbm5pbmdcblx0ICogQHJldHVybnMgeyp8QXJyYXk8Kj59IEEgc2luZ2xlIHZhbHVlIGlmIG5vIGFtb3VudCBpcyBwcm92aWRlZCBvciBhbiBhcnJheSBvZiB2YWx1ZXMsIHN0YXJ0aW5nIGZyb20gdGhlIGVuZCBpZlxuXHQgKiBhbW91bnQgaXMgbmVnYXRpdmVcblx0ICovXG5cdHB1YmxpYyBmaXJzdCgpOiBWIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgZmlyc3QoYW1vdW50OiBudW1iZXIpOiBWW107XG5cdHB1YmxpYyBmaXJzdChhbW91bnQ/OiBudW1iZXIpOiBWIHwgVltdIHwgdW5kZWZpbmVkIHtcblx0XHRpZiAodHlwZW9mIGFtb3VudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiB0aGlzLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcblx0XHRpZiAoYW1vdW50IDwgMCkgcmV0dXJuIHRoaXMubGFzdChhbW91bnQgKiAtMSk7XG5cdFx0YW1vdW50ID0gTWF0aC5taW4odGhpcy5zaXplLCBhbW91bnQpO1xuXHRcdGNvbnN0IGl0ZXIgPSB0aGlzLnZhbHVlcygpO1xuXHRcdHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBhbW91bnQgfSwgKCk6IFYgPT4gaXRlci5uZXh0KCkudmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9idGFpbnMgdGhlIGZpcnN0IGtleShzKSBpbiB0aGlzIGNvbGxlY3Rpb24uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50XSBBbW91bnQgb2Yga2V5cyB0byBvYnRhaW4gZnJvbSB0aGUgYmVnaW5uaW5nXG5cdCAqIEByZXR1cm5zIHsqfEFycmF5PCo+fSBBIHNpbmdsZSBrZXkgaWYgbm8gYW1vdW50IGlzIHByb3ZpZGVkIG9yIGFuIGFycmF5IG9mIGtleXMsIHN0YXJ0aW5nIGZyb20gdGhlIGVuZCBpZlxuXHQgKiBhbW91bnQgaXMgbmVnYXRpdmVcblx0ICovXG5cdHB1YmxpYyBmaXJzdEtleSgpOiBLIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgZmlyc3RLZXkoYW1vdW50OiBudW1iZXIpOiBLW107XG5cdHB1YmxpYyBmaXJzdEtleShhbW91bnQ/OiBudW1iZXIpOiBLIHwgS1tdIHwgdW5kZWZpbmVkIHtcblx0XHRpZiAodHlwZW9mIGFtb3VudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiB0aGlzLmtleXMoKS5uZXh0KCkudmFsdWU7XG5cdFx0aWYgKGFtb3VudCA8IDApIHJldHVybiB0aGlzLmxhc3RLZXkoYW1vdW50ICogLTEpO1xuXHRcdGFtb3VudCA9IE1hdGgubWluKHRoaXMuc2l6ZSwgYW1vdW50KTtcblx0XHRjb25zdCBpdGVyID0gdGhpcy5rZXlzKCk7XG5cdFx0cmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGFtb3VudCB9LCAoKTogSyA9PiBpdGVyLm5leHQoKS52YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogT2J0YWlucyB0aGUgbGFzdCB2YWx1ZShzKSBpbiB0aGlzIGNvbGxlY3Rpb24uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50XSBBbW91bnQgb2YgdmFsdWVzIHRvIG9idGFpbiBmcm9tIHRoZSBlbmRcblx0ICogQHJldHVybnMgeyp8QXJyYXk8Kj59IEEgc2luZ2xlIHZhbHVlIGlmIG5vIGFtb3VudCBpcyBwcm92aWRlZCBvciBhbiBhcnJheSBvZiB2YWx1ZXMsIHN0YXJ0aW5nIGZyb20gdGhlIHN0YXJ0IGlmXG5cdCAqIGFtb3VudCBpcyBuZWdhdGl2ZVxuXHQgKi9cblx0cHVibGljIGxhc3QoKTogViB8IHVuZGVmaW5lZDtcblx0cHVibGljIGxhc3QoYW1vdW50OiBudW1iZXIpOiBWW107XG5cdHB1YmxpYyBsYXN0KGFtb3VudD86IG51bWJlcik6IFYgfCBWW10gfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IGFyciA9IFsuLi50aGlzLnZhbHVlcygpXTtcblx0XHRpZiAodHlwZW9mIGFtb3VudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdGlmIChhbW91bnQgPCAwKSByZXR1cm4gdGhpcy5maXJzdChhbW91bnQgKiAtMSk7XG5cdFx0aWYgKCFhbW91bnQpIHJldHVybiBbXTtcblx0XHRyZXR1cm4gYXJyLnNsaWNlKC1hbW91bnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9idGFpbnMgdGhlIGxhc3Qga2V5KHMpIGluIHRoaXMgY29sbGVjdGlvbi5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRdIEFtb3VudCBvZiBrZXlzIHRvIG9idGFpbiBmcm9tIHRoZSBlbmRcblx0ICogQHJldHVybnMgeyp8QXJyYXk8Kj59IEEgc2luZ2xlIGtleSBpZiBubyBhbW91bnQgaXMgcHJvdmlkZWQgb3IgYW4gYXJyYXkgb2Yga2V5cywgc3RhcnRpbmcgZnJvbSB0aGUgc3RhcnQgaWZcblx0ICogYW1vdW50IGlzIG5lZ2F0aXZlXG5cdCAqL1xuXHRwdWJsaWMgbGFzdEtleSgpOiBLIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgbGFzdEtleShhbW91bnQ6IG51bWJlcik6IEtbXTtcblx0cHVibGljIGxhc3RLZXkoYW1vdW50PzogbnVtYmVyKTogSyB8IEtbXSB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgYXJyID0gWy4uLnRoaXMua2V5cygpXTtcblx0XHRpZiAodHlwZW9mIGFtb3VudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBhcnJbYXJyLmxlbmd0aCAtIDFdO1xuXHRcdGlmIChhbW91bnQgPCAwKSByZXR1cm4gdGhpcy5maXJzdEtleShhbW91bnQgKiAtMSk7XG5cdFx0aWYgKCFhbW91bnQpIHJldHVybiBbXTtcblx0XHRyZXR1cm4gYXJyLnNsaWNlKC1hbW91bnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9idGFpbnMgdW5pcXVlIHJhbmRvbSB2YWx1ZShzKSBmcm9tIHRoaXMgY29sbGVjdGlvbi5cblx0ICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRdIEFtb3VudCBvZiB2YWx1ZXMgdG8gb2J0YWluIHJhbmRvbWx5XG5cdCAqIEByZXR1cm5zIHsqfEFycmF5PCo+fSBBIHNpbmdsZSB2YWx1ZSBpZiBubyBhbW91bnQgaXMgcHJvdmlkZWQgb3IgYW4gYXJyYXkgb2YgdmFsdWVzXG5cdCAqL1xuXHRwdWJsaWMgcmFuZG9tKCk6IFY7XG5cdHB1YmxpYyByYW5kb20oYW1vdW50OiBudW1iZXIpOiBWW107XG5cdHB1YmxpYyByYW5kb20oYW1vdW50PzogbnVtYmVyKTogViB8IFZbXSB7XG5cdFx0Y29uc3QgYXJyID0gWy4uLnRoaXMudmFsdWVzKCldO1xuXHRcdGlmICh0eXBlb2YgYW1vdW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG5cdFx0aWYgKCFhcnIubGVuZ3RoIHx8ICFhbW91bnQpIHJldHVybiBbXTtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShcblx0XHRcdHsgbGVuZ3RoOiBNYXRoLm1pbihhbW91bnQsIGFyci5sZW5ndGgpIH0sXG5cdFx0XHQoKTogViA9PiBhcnIuc3BsaWNlKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpLCAxKVswXSxcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9idGFpbnMgdW5pcXVlIHJhbmRvbSBrZXkocykgZnJvbSB0aGlzIGNvbGxlY3Rpb24uXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50XSBBbW91bnQgb2Yga2V5cyB0byBvYnRhaW4gcmFuZG9tbHlcblx0ICogQHJldHVybnMgeyp8QXJyYXk8Kj59IEEgc2luZ2xlIGtleSBpZiBubyBhbW91bnQgaXMgcHJvdmlkZWQgb3IgYW4gYXJyYXlcblx0ICovXG5cdHB1YmxpYyByYW5kb21LZXkoKTogSztcblx0cHVibGljIHJhbmRvbUtleShhbW91bnQ6IG51bWJlcik6IEtbXTtcblx0cHVibGljIHJhbmRvbUtleShhbW91bnQ/OiBudW1iZXIpOiBLIHwgS1tdIHtcblx0XHRjb25zdCBhcnIgPSBbLi4udGhpcy5rZXlzKCldO1xuXHRcdGlmICh0eXBlb2YgYW1vdW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG5cdFx0aWYgKCFhcnIubGVuZ3RoIHx8ICFhbW91bnQpIHJldHVybiBbXTtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShcblx0XHRcdHsgbGVuZ3RoOiBNYXRoLm1pbihhbW91bnQsIGFyci5sZW5ndGgpIH0sXG5cdFx0XHQoKTogSyA9PiBhcnIuc3BsaWNlKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpLCAxKVswXSxcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlYXJjaGVzIGZvciBhIHNpbmdsZSBpdGVtIHdoZXJlIHRoZSBnaXZlbiBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLiBUaGlzIGJlaGF2ZXMgbGlrZVxuXHQgKiBbQXJyYXkuZmluZCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9maW5kKS5cblx0ICogPHdhcm4+QWxsIGNvbGxlY3Rpb25zIHVzZWQgaW4gRGlzY29yZC5qcyBhcmUgbWFwcGVkIHVzaW5nIHRoZWlyIGBpZGAgcHJvcGVydHksIGFuZCBpZiB5b3Ugd2FudCB0byBmaW5kIGJ5IGlkIHlvdVxuXHQgKiBzaG91bGQgdXNlIHRoZSBgZ2V0YCBtZXRob2QuIFNlZVxuXHQgKiBbTUROXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAvZ2V0KSBmb3IgZGV0YWlscy48L3dhcm4+XG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB0ZXN0IHdpdGggKHNob3VsZCByZXR1cm4gYm9vbGVhbilcblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Kn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5maW5kKHVzZXIgPT4gdXNlci51c2VybmFtZSA9PT0gJ0JvYicpO1xuXHQgKi9cblx0cHVibGljIGZpbmQ8VjIgZXh0ZW5kcyBWPihmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZhbHVlIGlzIFYyKTogVjIgfCB1bmRlZmluZWQ7XG5cdHB1YmxpYyBmaW5kKGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gYm9vbGVhbik6IFYgfCB1bmRlZmluZWQ7XG5cdHB1YmxpYyBmaW5kPFRoaXMsIFYyIGV4dGVuZHMgVj4oXG5cdFx0Zm46ICh0aGlzOiBUaGlzLCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiB2YWx1ZSBpcyBWMixcblx0XHR0aGlzQXJnOiBUaGlzLFxuXHQpOiBWMiB8IHVuZGVmaW5lZDtcblx0cHVibGljIGZpbmQ8VGhpcz4oZm46ICh0aGlzOiBUaGlzLCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnOiBUaGlzKTogViB8IHVuZGVmaW5lZDtcblx0cHVibGljIGZpbmQoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnPzogdW5rbm93bik6IFYgfCB1bmRlZmluZWQge1xuXHRcdGlmICh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcpIGZuID0gZm4uYmluZCh0aGlzQXJnKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKGZuKHZhbCwga2V5LCB0aGlzKSkgcmV0dXJuIHZhbDtcblx0XHR9XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZWFyY2hlcyBmb3IgdGhlIGtleSBvZiBhIHNpbmdsZSBpdGVtIHdoZXJlIHRoZSBnaXZlbiBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLiBUaGlzIGJlaGF2ZXMgbGlrZVxuXHQgKiBbQXJyYXkuZmluZEluZGV4KCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZpbmRJbmRleCksXG5cdCAqIGJ1dCByZXR1cm5zIHRoZSBrZXkgcmF0aGVyIHRoYW4gdGhlIHBvc2l0aW9uYWwgaW5kZXguXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB0ZXN0IHdpdGggKHNob3VsZCByZXR1cm4gYm9vbGVhbilcblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Kn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5maW5kS2V5KHVzZXIgPT4gdXNlci51c2VybmFtZSA9PT0gJ0JvYicpO1xuXHQgKi9cblx0cHVibGljIGZpbmRLZXk8SzIgZXh0ZW5kcyBLPihmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGtleSBpcyBLMik6IEsyIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgZmluZEtleShmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4pOiBLIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgZmluZEtleTxUaGlzLCBLMiBleHRlbmRzIEs+KFxuXHRcdGZuOiAodGhpczogVGhpcywgdmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4ga2V5IGlzIEsyLFxuXHRcdHRoaXNBcmc6IFRoaXMsXG5cdCk6IEsyIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgZmluZEtleTxUaGlzPihmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc6IFRoaXMpOiBLIHwgdW5kZWZpbmVkO1xuXHRwdWJsaWMgZmluZEtleShmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc/OiB1bmtub3duKTogSyB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiB0aGlzKSB7XG5cdFx0XHRpZiAoZm4odmFsLCBrZXksIHRoaXMpKSByZXR1cm4ga2V5O1xuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgaXRlbXMgdGhhdCBzYXRpc2Z5IHRoZSBwcm92aWRlZCBmaWx0ZXIgZnVuY3Rpb24uXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHVzZWQgdG8gdGVzdCAoc2hvdWxkIHJldHVybiBhIGJvb2xlYW4pXG5cdCAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFZhbHVlIHRvIHVzZSBhcyBgdGhpc2Agd2hlbiBleGVjdXRpbmcgZnVuY3Rpb25cblx0ICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiByZW1vdmVkIGVudHJpZXNcblx0ICovXG5cdHB1YmxpYyBzd2VlcChmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4pOiBudW1iZXI7XG5cdHB1YmxpYyBzd2VlcDxUPihmbjogKHRoaXM6IFQsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc6IFQpOiBudW1iZXI7XG5cdHB1YmxpYyBzd2VlcChmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc/OiB1bmtub3duKTogbnVtYmVyIHtcblx0XHRpZiAodHlwZW9mIHRoaXNBcmcgIT09ICd1bmRlZmluZWQnKSBmbiA9IGZuLmJpbmQodGhpc0FyZyk7XG5cdFx0Y29uc3QgcHJldmlvdXNTaXplID0gdGhpcy5zaXplO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiB0aGlzKSB7XG5cdFx0XHRpZiAoZm4odmFsLCBrZXksIHRoaXMpKSB0aGlzLmRlbGV0ZShrZXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gcHJldmlvdXNTaXplIC0gdGhpcy5zaXplO1xuXHR9XG5cblx0LyoqXG5cdCAqIElkZW50aWNhbCB0b1xuXHQgKiBbQXJyYXkuZmlsdGVyKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZpbHRlciksXG5cdCAqIGJ1dCByZXR1cm5zIGEgQ29sbGVjdGlvbiBpbnN0ZWFkIG9mIGFuIEFycmF5LlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gdGVzdCB3aXRoIChzaG91bGQgcmV0dXJuIGJvb2xlYW4pXG5cdCAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFZhbHVlIHRvIHVzZSBhcyBgdGhpc2Agd2hlbiBleGVjdXRpbmcgZnVuY3Rpb25cblx0ICogQHJldHVybnMge0NvbGxlY3Rpb259XG5cdCAqIEBleGFtcGxlIGNvbGxlY3Rpb24uZmlsdGVyKHVzZXIgPT4gdXNlci51c2VybmFtZSA9PT0gJ0JvYicpO1xuXHQgKi9cblx0cHVibGljIGZpbHRlcjxLMiBleHRlbmRzIEs+KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4ga2V5IGlzIEsyKTogQ29sbGVjdGlvbjxLMiwgVj47XG5cdHB1YmxpYyBmaWx0ZXI8VjIgZXh0ZW5kcyBWPihmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZhbHVlIGlzIFYyKTogQ29sbGVjdGlvbjxLLCBWMj47XG5cdHB1YmxpYyBmaWx0ZXIoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogQ29sbGVjdGlvbjxLLCBWPjtcblx0cHVibGljIGZpbHRlcjxUaGlzLCBLMiBleHRlbmRzIEs+KFxuXHRcdGZuOiAodGhpczogVGhpcywgdmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4ga2V5IGlzIEsyLFxuXHRcdHRoaXNBcmc6IFRoaXMsXG5cdCk6IENvbGxlY3Rpb248SzIsIFY+O1xuXHRwdWJsaWMgZmlsdGVyPFRoaXMsIFYyIGV4dGVuZHMgVj4oXG5cdFx0Zm46ICh0aGlzOiBUaGlzLCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiB2YWx1ZSBpcyBWMixcblx0XHR0aGlzQXJnOiBUaGlzLFxuXHQpOiBDb2xsZWN0aW9uPEssIFYyPjtcblx0cHVibGljIGZpbHRlcjxUaGlzPihmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc6IFRoaXMpOiBDb2xsZWN0aW9uPEssIFY+O1xuXHRwdWJsaWMgZmlsdGVyKGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gYm9vbGVhbiwgdGhpc0FyZz86IHVua25vd24pOiBDb2xsZWN0aW9uPEssIFY+IHtcblx0XHRpZiAodHlwZW9mIHRoaXNBcmcgIT09ICd1bmRlZmluZWQnKSBmbiA9IGZuLmJpbmQodGhpc0FyZyk7XG5cdFx0Y29uc3QgcmVzdWx0cyA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXTxLLCBWPigpO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiB0aGlzKSB7XG5cdFx0XHRpZiAoZm4odmFsLCBrZXksIHRoaXMpKSByZXN1bHRzLnNldChrZXksIHZhbCk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhcnRpdGlvbnMgdGhlIGNvbGxlY3Rpb24gaW50byB0d28gY29sbGVjdGlvbnMgd2hlcmUgdGhlIGZpcnN0IGNvbGxlY3Rpb25cblx0ICogY29udGFpbnMgdGhlIGl0ZW1zIHRoYXQgcGFzc2VkIGFuZCB0aGUgc2Vjb25kIGNvbnRhaW5zIHRoZSBpdGVtcyB0aGF0IGZhaWxlZC5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdXNlZCB0byB0ZXN0IChzaG91bGQgcmV0dXJuIGEgYm9vbGVhbilcblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Q29sbGVjdGlvbltdfVxuXHQgKiBAZXhhbXBsZSBjb25zdCBbYmlnLCBzbWFsbF0gPSBjb2xsZWN0aW9uLnBhcnRpdGlvbihndWlsZCA9PiBndWlsZC5tZW1iZXJDb3VudCA+IDI1MCk7XG5cdCAqL1xuXHRwdWJsaWMgcGFydGl0aW9uPEsyIGV4dGVuZHMgSz4oXG5cdFx0Zm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBrZXkgaXMgSzIsXG5cdCk6IFtDb2xsZWN0aW9uPEsyLCBWPiwgQ29sbGVjdGlvbjxFeGNsdWRlPEssIEsyPiwgVj5dO1xuXHRwdWJsaWMgcGFydGl0aW9uPFYyIGV4dGVuZHMgVj4oXG5cdFx0Zm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiB2YWx1ZSBpcyBWMixcblx0KTogW0NvbGxlY3Rpb248SywgVjI+LCBDb2xsZWN0aW9uPEssIEV4Y2x1ZGU8ViwgVjI+Pl07XG5cdHB1YmxpYyBwYXJ0aXRpb24oZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogW0NvbGxlY3Rpb248SywgVj4sIENvbGxlY3Rpb248SywgVj5dO1xuXHRwdWJsaWMgcGFydGl0aW9uPFRoaXMsIEsyIGV4dGVuZHMgSz4oXG5cdFx0Zm46ICh0aGlzOiBUaGlzLCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBrZXkgaXMgSzIsXG5cdFx0dGhpc0FyZzogVGhpcyxcblx0KTogW0NvbGxlY3Rpb248SzIsIFY+LCBDb2xsZWN0aW9uPEV4Y2x1ZGU8SywgSzI+LCBWPl07XG5cdHB1YmxpYyBwYXJ0aXRpb248VGhpcywgVjIgZXh0ZW5kcyBWPihcblx0XHRmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZhbHVlIGlzIFYyLFxuXHRcdHRoaXNBcmc6IFRoaXMsXG5cdCk6IFtDb2xsZWN0aW9uPEssIFYyPiwgQ29sbGVjdGlvbjxLLCBFeGNsdWRlPFYsIFYyPj5dO1xuXHRwdWJsaWMgcGFydGl0aW9uPFRoaXM+KFxuXHRcdGZuOiAodGhpczogVGhpcywgdmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gYm9vbGVhbixcblx0XHR0aGlzQXJnOiBUaGlzLFxuXHQpOiBbQ29sbGVjdGlvbjxLLCBWPiwgQ29sbGVjdGlvbjxLLCBWPl07XG5cdHB1YmxpYyBwYXJ0aXRpb24oXG5cdFx0Zm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLFxuXHRcdHRoaXNBcmc/OiB1bmtub3duLFxuXHQpOiBbQ29sbGVjdGlvbjxLLCBWPiwgQ29sbGVjdGlvbjxLLCBWPl0ge1xuXHRcdGlmICh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcpIGZuID0gZm4uYmluZCh0aGlzQXJnKTtcblx0XHRjb25zdCByZXN1bHRzOiBbQ29sbGVjdGlvbjxLLCBWPiwgQ29sbGVjdGlvbjxLLCBWPl0gPSBbXG5cdFx0XHRuZXcgdGhpcy5jb25zdHJ1Y3RvcltTeW1ib2wuc3BlY2llc108SywgVj4oKSxcblx0XHRcdG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXTxLLCBWPigpLFxuXHRcdF07XG5cdFx0Zm9yIChjb25zdCBba2V5LCB2YWxdIG9mIHRoaXMpIHtcblx0XHRcdGlmIChmbih2YWwsIGtleSwgdGhpcykpIHtcblx0XHRcdFx0cmVzdWx0c1swXS5zZXQoa2V5LCB2YWwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0c1sxXS5zZXQoa2V5LCB2YWwpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8qKlxuXHQgKiBNYXBzIGVhY2ggaXRlbSBpbnRvIGEgQ29sbGVjdGlvbiwgdGhlbiBqb2lucyB0aGUgcmVzdWx0cyBpbnRvIGEgc2luZ2xlIENvbGxlY3Rpb24uIElkZW50aWNhbCBpbiBiZWhhdmlvciB0b1xuXHQgKiBbQXJyYXkuZmxhdE1hcCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mbGF0TWFwKS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhIG5ldyBDb2xsZWN0aW9uXG5cdCAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFZhbHVlIHRvIHVzZSBhcyBgdGhpc2Agd2hlbiBleGVjdXRpbmcgZnVuY3Rpb25cblx0ICogQHJldHVybnMge0NvbGxlY3Rpb259XG5cdCAqIEBleGFtcGxlIGNvbGxlY3Rpb24uZmxhdE1hcChndWlsZCA9PiBndWlsZC5tZW1iZXJzLmNhY2hlKTtcblx0ICovXG5cdHB1YmxpYyBmbGF0TWFwPFQ+KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gQ29sbGVjdGlvbjxLLCBUPik6IENvbGxlY3Rpb248SywgVD47XG5cdHB1YmxpYyBmbGF0TWFwPFQsIFRoaXM+KFxuXHRcdGZuOiAodGhpczogVGhpcywgdmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gQ29sbGVjdGlvbjxLLCBUPixcblx0XHR0aGlzQXJnOiBUaGlzLFxuXHQpOiBDb2xsZWN0aW9uPEssIFQ+O1xuXHRwdWJsaWMgZmxhdE1hcDxUPihmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IENvbGxlY3Rpb248SywgVD4sIHRoaXNBcmc/OiB1bmtub3duKTogQ29sbGVjdGlvbjxLLCBUPiB7XG5cdFx0Y29uc3QgY29sbGVjdGlvbnMgPSB0aGlzLm1hcChmbiwgdGhpc0FyZyk7XG5cdFx0cmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXTxLLCBUPigpLmNvbmNhdCguLi5jb2xsZWN0aW9ucyk7XG5cdH1cblxuXHQvKipcblx0ICogTWFwcyBlYWNoIGl0ZW0gdG8gYW5vdGhlciB2YWx1ZSBpbnRvIGFuIGFycmF5LiBJZGVudGljYWwgaW4gYmVoYXZpb3IgdG9cblx0ICogW0FycmF5Lm1hcCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9tYXApLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0aGF0IHByb2R1Y2VzIGFuIGVsZW1lbnQgb2YgdGhlIG5ldyBhcnJheSwgdGFraW5nIHRocmVlIGFyZ3VtZW50c1xuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtBcnJheX1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5tYXAodXNlciA9PiB1c2VyLnRhZyk7XG5cdCAqL1xuXHRwdWJsaWMgbWFwPFQ+KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gVCk6IFRbXTtcblx0cHVibGljIG1hcDxUaGlzLCBUPihmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IFQsIHRoaXNBcmc6IFRoaXMpOiBUW107XG5cdHB1YmxpYyBtYXA8VD4oZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBULCB0aGlzQXJnPzogdW5rbm93bik6IFRbXSB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGNvbnN0IGl0ZXIgPSB0aGlzLmVudHJpZXMoKTtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogdGhpcy5zaXplIH0sICgpOiBUID0+IHtcblx0XHRcdGNvbnN0IFtrZXksIHZhbHVlXSA9IGl0ZXIubmV4dCgpLnZhbHVlO1xuXHRcdFx0cmV0dXJuIGZuKHZhbHVlLCBrZXksIHRoaXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hcHMgZWFjaCBpdGVtIHRvIGFub3RoZXIgdmFsdWUgaW50byBhIGNvbGxlY3Rpb24uIElkZW50aWNhbCBpbiBiZWhhdmlvciB0b1xuXHQgKiBbQXJyYXkubWFwKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L21hcCkuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gZWxlbWVudCBvZiB0aGUgbmV3IGNvbGxlY3Rpb24sIHRha2luZyB0aHJlZSBhcmd1bWVudHNcblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Q29sbGVjdGlvbn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5tYXBWYWx1ZXModXNlciA9PiB1c2VyLnRhZyk7XG5cdCAqL1xuXHRwdWJsaWMgbWFwVmFsdWVzPFQ+KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4gVCk6IENvbGxlY3Rpb248SywgVD47XG5cdHB1YmxpYyBtYXBWYWx1ZXM8VGhpcywgVD4oZm46ICh0aGlzOiBUaGlzLCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBULCB0aGlzQXJnOiBUaGlzKTogQ29sbGVjdGlvbjxLLCBUPjtcblx0cHVibGljIG1hcFZhbHVlczxUPihmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IFQsIHRoaXNBcmc/OiB1bmtub3duKTogQ29sbGVjdGlvbjxLLCBUPiB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGNvbnN0IGNvbGwgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcltTeW1ib2wuc3BlY2llc108SywgVD4oKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykgY29sbC5zZXQoa2V5LCBmbih2YWwsIGtleSwgdGhpcykpO1xuXHRcdHJldHVybiBjb2xsO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGVyZSBleGlzdHMgYW4gaXRlbSB0aGF0IHBhc3NlcyBhIHRlc3QuIElkZW50aWNhbCBpbiBiZWhhdmlvciB0b1xuXHQgKiBbQXJyYXkuc29tZSgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9zb21lKS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdXNlZCB0byB0ZXN0IChzaG91bGQgcmV0dXJuIGEgYm9vbGVhbilcblx0ICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVmFsdWUgdG8gdXNlIGFzIGB0aGlzYCB3aGVuIGV4ZWN1dGluZyBmdW5jdGlvblxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5zb21lKHVzZXIgPT4gdXNlci5kaXNjcmltaW5hdG9yID09PSAnMDAwMCcpO1xuXHQgKi9cblx0cHVibGljIHNvbWUoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuKTogYm9vbGVhbjtcblx0cHVibGljIHNvbWU8VD4oZm46ICh0aGlzOiBULCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnOiBUKTogYm9vbGVhbjtcblx0cHVibGljIHNvbWUoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnPzogdW5rbm93bik6IGJvb2xlYW4ge1xuXHRcdGlmICh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcpIGZuID0gZm4uYmluZCh0aGlzQXJnKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKGZuKHZhbCwga2V5LCB0aGlzKSkgcmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYWxsIGl0ZW1zIHBhc3NlcyBhIHRlc3QuIElkZW50aWNhbCBpbiBiZWhhdmlvciB0b1xuXHQgKiBbQXJyYXkuZXZlcnkoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZXZlcnkpLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB1c2VkIHRvIHRlc3QgKHNob3VsZCByZXR1cm4gYSBib29sZWFuKVxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLmV2ZXJ5KHVzZXIgPT4gIXVzZXIuYm90KTtcblx0ICovXG5cdHB1YmxpYyBldmVyeTxLMiBleHRlbmRzIEs+KGZuOiAodmFsdWU6IFYsIGtleTogSywgY29sbGVjdGlvbjogdGhpcykgPT4ga2V5IGlzIEsyKTogdGhpcyBpcyBDb2xsZWN0aW9uPEsyLCBWPjtcblx0cHVibGljIGV2ZXJ5PFYyIGV4dGVuZHMgVj4oZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiB2YWx1ZSBpcyBWMik6IHRoaXMgaXMgQ29sbGVjdGlvbjxLLCBWMj47XG5cdHB1YmxpYyBldmVyeShmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4pOiBib29sZWFuO1xuXHRwdWJsaWMgZXZlcnk8VGhpcywgSzIgZXh0ZW5kcyBLPihcblx0XHRmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGtleSBpcyBLMixcblx0XHR0aGlzQXJnOiBUaGlzLFxuXHQpOiB0aGlzIGlzIENvbGxlY3Rpb248SzIsIFY+O1xuXHRwdWJsaWMgZXZlcnk8VGhpcywgVjIgZXh0ZW5kcyBWPihcblx0XHRmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZhbHVlIGlzIFYyLFxuXHRcdHRoaXNBcmc6IFRoaXMsXG5cdCk6IHRoaXMgaXMgQ29sbGVjdGlvbjxLLCBWMj47XG5cdHB1YmxpYyBldmVyeTxUaGlzPihmbjogKHRoaXM6IFRoaXMsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IGJvb2xlYW4sIHRoaXNBcmc6IFRoaXMpOiBib29sZWFuO1xuXHRwdWJsaWMgZXZlcnkoZm46ICh2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBib29sZWFuLCB0aGlzQXJnPzogdW5rbm93bik6IGJvb2xlYW4ge1xuXHRcdGlmICh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcpIGZuID0gZm4uYmluZCh0aGlzQXJnKTtcblx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykge1xuXHRcdFx0aWYgKCFmbih2YWwsIGtleSwgdGhpcykpIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBhIGZ1bmN0aW9uIHRvIHByb2R1Y2UgYSBzaW5nbGUgdmFsdWUuIElkZW50aWNhbCBpbiBiZWhhdmlvciB0b1xuXHQgKiBbQXJyYXkucmVkdWNlKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3JlZHVjZSkuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHVzZWQgdG8gcmVkdWNlLCB0YWtpbmcgZm91ciBhcmd1bWVudHM7IGBhY2N1bXVsYXRvcmAsIGBjdXJyZW50VmFsdWVgLCBgY3VycmVudEtleWAsXG5cdCAqIGFuZCBgY29sbGVjdGlvbmBcblx0ICogQHBhcmFtIHsqfSBbaW5pdGlhbFZhbHVlXSBTdGFydGluZyB2YWx1ZSBmb3IgdGhlIGFjY3VtdWxhdG9yXG5cdCAqIEByZXR1cm5zIHsqfVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLnJlZHVjZSgoYWNjLCBndWlsZCkgPT4gYWNjICsgZ3VpbGQubWVtYmVyQ291bnQsIDApO1xuXHQgKi9cblx0cHVibGljIHJlZHVjZTxUPihmbjogKGFjY3VtdWxhdG9yOiBULCB2YWx1ZTogViwga2V5OiBLLCBjb2xsZWN0aW9uOiB0aGlzKSA9PiBULCBpbml0aWFsVmFsdWU/OiBUKTogVCB7XG5cdFx0bGV0IGFjY3VtdWxhdG9yITogVDtcblxuXHRcdGlmICh0eXBlb2YgaW5pdGlhbFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0YWNjdW11bGF0b3IgPSBpbml0aWFsVmFsdWU7XG5cdFx0XHRmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgdGhpcykgYWNjdW11bGF0b3IgPSBmbihhY2N1bXVsYXRvciwgdmFsLCBrZXksIHRoaXMpO1xuXHRcdFx0cmV0dXJuIGFjY3VtdWxhdG9yO1xuXHRcdH1cblx0XHRsZXQgZmlyc3QgPSB0cnVlO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiB0aGlzKSB7XG5cdFx0XHRpZiAoZmlyc3QpIHtcblx0XHRcdFx0YWNjdW11bGF0b3IgPSB2YWwgYXMgdW5rbm93biBhcyBUO1xuXHRcdFx0XHRmaXJzdCA9IGZhbHNlO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGFjY3VtdWxhdG9yID0gZm4oYWNjdW11bGF0b3IsIHZhbCwga2V5LCB0aGlzKTtcblx0XHR9XG5cblx0XHQvLyBObyBpdGVtcyBpdGVyYXRlZC5cblx0XHRpZiAoZmlyc3QpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBjb2xsZWN0aW9uIHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhY2N1bXVsYXRvcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZGVudGljYWwgdG9cblx0ICogW01hcC5mb3JFYWNoKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcC9mb3JFYWNoKSxcblx0ICogYnV0IHJldHVybnMgdGhlIGNvbGxlY3Rpb24gaW5zdGVhZCBvZiB1bmRlZmluZWQuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgZm9yIGVhY2ggZWxlbWVudFxuXHQgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBWYWx1ZSB0byB1c2UgYXMgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIGZ1bmN0aW9uXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZVxuXHQgKiBjb2xsZWN0aW9uXG5cdCAqICAuZWFjaCh1c2VyID0+IGNvbnNvbGUubG9nKHVzZXIudXNlcm5hbWUpKVxuXHQgKiAgLmZpbHRlcih1c2VyID0+IHVzZXIuYm90KVxuXHQgKiAgLmVhY2godXNlciA9PiBjb25zb2xlLmxvZyh1c2VyLnVzZXJuYW1lKSk7XG5cdCAqL1xuXHRwdWJsaWMgZWFjaChmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQpOiB0aGlzO1xuXHRwdWJsaWMgZWFjaDxUPihmbjogKHRoaXM6IFQsIHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQsIHRoaXNBcmc6IFQpOiB0aGlzO1xuXHRwdWJsaWMgZWFjaChmbjogKHZhbHVlOiBWLCBrZXk6IEssIGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQsIHRoaXNBcmc/OiB1bmtub3duKTogdGhpcyB7XG5cdFx0dGhpcy5mb3JFYWNoKGZuIGFzICh2YWx1ZTogViwga2V5OiBLLCBtYXA6IE1hcDxLLCBWPikgPT4gdm9pZCwgdGhpc0FyZyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUnVucyBhIGZ1bmN0aW9uIG9uIHRoZSBjb2xsZWN0aW9uIGFuZCByZXR1cm5zIHRoZSBjb2xsZWN0aW9uLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBleGVjdXRlXG5cdCAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFZhbHVlIHRvIHVzZSBhcyBgdGhpc2Agd2hlbiBleGVjdXRpbmcgZnVuY3Rpb25cblx0ICogQHJldHVybnMge0NvbGxlY3Rpb259XG5cdCAqIEBleGFtcGxlXG5cdCAqIGNvbGxlY3Rpb25cblx0ICogIC50YXAoY29sbCA9PiBjb25zb2xlLmxvZyhjb2xsLnNpemUpKVxuXHQgKiAgLmZpbHRlcih1c2VyID0+IHVzZXIuYm90KVxuXHQgKiAgLnRhcChjb2xsID0+IGNvbnNvbGUubG9nKGNvbGwuc2l6ZSkpXG5cdCAqL1xuXHRwdWJsaWMgdGFwKGZuOiAoY29sbGVjdGlvbjogdGhpcykgPT4gdm9pZCk6IHRoaXM7XG5cdHB1YmxpYyB0YXA8VD4oZm46ICh0aGlzOiBULCBjb2xsZWN0aW9uOiB0aGlzKSA9PiB2b2lkLCB0aGlzQXJnOiBUKTogdGhpcztcblx0cHVibGljIHRhcChmbjogKGNvbGxlY3Rpb246IHRoaXMpID0+IHZvaWQsIHRoaXNBcmc/OiB1bmtub3duKTogdGhpcyB7XG5cdFx0aWYgKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJykgZm4gPSBmbi5iaW5kKHRoaXNBcmcpO1xuXHRcdGZuKHRoaXMpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gaWRlbnRpY2FsIHNoYWxsb3cgY29weSBvZiB0aGlzIGNvbGxlY3Rpb24uXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZSBjb25zdCBuZXdDb2xsID0gc29tZUNvbGwuY2xvbmUoKTtcblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOiBDb2xsZWN0aW9uPEssIFY+IHtcblx0XHRyZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3JbU3ltYm9sLnNwZWNpZXNdKHRoaXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbWJpbmVzIHRoaXMgY29sbGVjdGlvbiB3aXRoIG90aGVycyBpbnRvIGEgbmV3IGNvbGxlY3Rpb24uIE5vbmUgb2YgdGhlIHNvdXJjZSBjb2xsZWN0aW9ucyBhcmUgbW9kaWZpZWQuXG5cdCAqIEBwYXJhbSB7Li4uQ29sbGVjdGlvbn0gY29sbGVjdGlvbnMgQ29sbGVjdGlvbnMgdG8gbWVyZ2Vcblx0ICogQHJldHVybnMge0NvbGxlY3Rpb259XG5cdCAqIEBleGFtcGxlIGNvbnN0IG5ld0NvbGwgPSBzb21lQ29sbC5jb25jYXQoc29tZU90aGVyQ29sbCwgYW5vdGhlckNvbGwsIG9oQm95QUNvbGwpO1xuXHQgKi9cblx0cHVibGljIGNvbmNhdCguLi5jb2xsZWN0aW9uczogQ29sbGVjdGlvbjxLLCBWPltdKTogQ29sbGVjdGlvbjxLLCBWPiB7XG5cdFx0Y29uc3QgbmV3Q29sbCA9IHRoaXMuY2xvbmUoKTtcblx0XHRmb3IgKGNvbnN0IGNvbGwgb2YgY29sbGVjdGlvbnMpIHtcblx0XHRcdGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBjb2xsKSBuZXdDb2xsLnNldChrZXksIHZhbCk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXdDb2xsO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGlzIGNvbGxlY3Rpb24gc2hhcmVzIGlkZW50aWNhbCBpdGVtcyB3aXRoIGFub3RoZXIuXG5cdCAqIFRoaXMgaXMgZGlmZmVyZW50IHRvIGNoZWNraW5nIGZvciBlcXVhbGl0eSB1c2luZyBlcXVhbC1zaWducywgYmVjYXVzZVxuXHQgKiB0aGUgY29sbGVjdGlvbnMgbWF5IGJlIGRpZmZlcmVudCBvYmplY3RzLCBidXQgY29udGFpbiB0aGUgc2FtZSBkYXRhLlxuXHQgKiBAcGFyYW0ge0NvbGxlY3Rpb259IGNvbGxlY3Rpb24gQ29sbGVjdGlvbiB0byBjb21wYXJlIHdpdGhcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGNvbGxlY3Rpb25zIGhhdmUgaWRlbnRpY2FsIGNvbnRlbnRzXG5cdCAqL1xuXHRwdWJsaWMgZXF1YWxzKGNvbGxlY3Rpb246IENvbGxlY3Rpb248SywgVj4pOiBib29sZWFuIHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LWNvbmRpdGlvblxuXHRcdGlmICghY29sbGVjdGlvbikgcmV0dXJuIGZhbHNlOyAvLyBydW50aW1lIGNoZWNrXG5cdFx0aWYgKHRoaXMgPT09IGNvbGxlY3Rpb24pIHJldHVybiB0cnVlO1xuXHRcdGlmICh0aGlzLnNpemUgIT09IGNvbGxlY3Rpb24uc2l6ZSkgcmV0dXJuIGZhbHNlO1xuXHRcdGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHRoaXMpIHtcblx0XHRcdGlmICghY29sbGVjdGlvbi5oYXMoa2V5KSB8fCB2YWx1ZSAhPT0gY29sbGVjdGlvbi5nZXQoa2V5KSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBzb3J0IG1ldGhvZCBzb3J0cyB0aGUgaXRlbXMgb2YgYSBjb2xsZWN0aW9uIGluIHBsYWNlIGFuZCByZXR1cm5zIGl0LlxuXHQgKiBUaGUgc29ydCBpcyBub3QgbmVjZXNzYXJpbHkgc3RhYmxlIGluIE5vZGUgMTAgb3Igb2xkZXIuXG5cdCAqIFRoZSBkZWZhdWx0IHNvcnQgb3JkZXIgaXMgYWNjb3JkaW5nIHRvIHN0cmluZyBVbmljb2RlIGNvZGUgcG9pbnRzLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyZUZ1bmN0aW9uXSBTcGVjaWZpZXMgYSBmdW5jdGlvbiB0aGF0IGRlZmluZXMgdGhlIHNvcnQgb3JkZXIuXG5cdCAqIElmIG9taXR0ZWQsIHRoZSBjb2xsZWN0aW9uIGlzIHNvcnRlZCBhY2NvcmRpbmcgdG8gZWFjaCBjaGFyYWN0ZXIncyBVbmljb2RlIGNvZGUgcG9pbnQgdmFsdWUsXG5cdCAqIGFjY29yZGluZyB0byB0aGUgc3RyaW5nIGNvbnZlcnNpb24gb2YgZWFjaCBlbGVtZW50LlxuXHQgKiBAcmV0dXJucyB7Q29sbGVjdGlvbn1cblx0ICogQGV4YW1wbGUgY29sbGVjdGlvbi5zb3J0KCh1c2VyQSwgdXNlckIpID0+IHVzZXJBLmNyZWF0ZWRUaW1lc3RhbXAgLSB1c2VyQi5jcmVhdGVkVGltZXN0YW1wKTtcblx0ICovXG5cdHB1YmxpYyBzb3J0KGNvbXBhcmVGdW5jdGlvbjogQ29tcGFyYXRvcjxLLCBWPiA9IENvbGxlY3Rpb24uZGVmYXVsdFNvcnQpOiB0aGlzIHtcblx0XHRjb25zdCBlbnRyaWVzID0gWy4uLnRoaXMuZW50cmllcygpXTtcblx0XHRlbnRyaWVzLnNvcnQoKGEsIGIpOiBudW1iZXIgPT4gY29tcGFyZUZ1bmN0aW9uKGFbMV0sIGJbMV0sIGFbMF0sIGJbMF0pKTtcblxuXHRcdC8vIFBlcmZvcm0gY2xlYW4tdXBcblx0XHRzdXBlci5jbGVhcigpO1xuXG5cdFx0Ly8gU2V0IHRoZSBuZXcgZW50cmllc1xuXHRcdGZvciAoY29uc3QgW2ssIHZdIG9mIGVudHJpZXMpIHtcblx0XHRcdHN1cGVyLnNldChrLCB2KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGludGVyc2VjdCBtZXRob2QgcmV0dXJucyBhIG5ldyBzdHJ1Y3R1cmUgY29udGFpbmluZyBpdGVtcyB3aGVyZSB0aGUga2V5cyBhcmUgcHJlc2VudCBpbiBib3RoIG9yaWdpbmFsIHN0cnVjdHVyZXMuXG5cdCAqIEBwYXJhbSB7Q29sbGVjdGlvbn0gb3RoZXIgVGhlIG90aGVyIENvbGxlY3Rpb24gdG8gZmlsdGVyIGFnYWluc3Rcblx0ICogQHJldHVybnMge0NvbGxlY3Rpb259XG5cdCAqL1xuXHRwdWJsaWMgaW50ZXJzZWN0KG90aGVyOiBDb2xsZWN0aW9uPEssIFY+KTogQ29sbGVjdGlvbjxLLCBWPiB7XG5cdFx0Y29uc3QgY29sbCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yW1N5bWJvbC5zcGVjaWVzXTxLLCBWPigpO1xuXHRcdGZvciAoY29uc3QgW2ssIHZdIG9mIG90aGVyKSB7XG5cdFx0XHRpZiAodGhpcy5oYXMoaykpIGNvbGwuc2V0KGssIHYpO1xuXHRcdH1cblx0XHRyZXR1cm4gY29sbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgZGlmZmVyZW5jZSBtZXRob2QgcmV0dXJucyBhIG5ldyBzdHJ1Y3R1cmUgY29udGFpbmluZyBpdGVtcyB3aGVyZSB0aGUga2V5IGlzIHByZXNlbnQgaW4gb25lIG9mIHRoZSBvcmlnaW5hbCBzdHJ1Y3R1cmVzIGJ1dCBub3QgdGhlIG90aGVyLlxuXHQgKiBAcGFyYW0ge0NvbGxlY3Rpb259IG90aGVyIFRoZSBvdGhlciBDb2xsZWN0aW9uIHRvIGZpbHRlciBhZ2FpbnN0XG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKi9cblx0cHVibGljIGRpZmZlcmVuY2Uob3RoZXI6IENvbGxlY3Rpb248SywgVj4pOiBDb2xsZWN0aW9uPEssIFY+IHtcblx0XHRjb25zdCBjb2xsID0gbmV3IHRoaXMuY29uc3RydWN0b3JbU3ltYm9sLnNwZWNpZXNdPEssIFY+KCk7XG5cdFx0Zm9yIChjb25zdCBbaywgdl0gb2Ygb3RoZXIpIHtcblx0XHRcdGlmICghdGhpcy5oYXMoaykpIGNvbGwuc2V0KGssIHYpO1xuXHRcdH1cblx0XHRmb3IgKGNvbnN0IFtrLCB2XSBvZiB0aGlzKSB7XG5cdFx0XHRpZiAoIW90aGVyLmhhcyhrKSkgY29sbC5zZXQoaywgdik7XG5cdFx0fVxuXHRcdHJldHVybiBjb2xsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBzb3J0ZWQgbWV0aG9kIHNvcnRzIHRoZSBpdGVtcyBvZiBhIGNvbGxlY3Rpb24gYW5kIHJldHVybnMgaXQuXG5cdCAqIFRoZSBzb3J0IGlzIG5vdCBuZWNlc3NhcmlseSBzdGFibGUgaW4gTm9kZSAxMCBvciBvbGRlci5cblx0ICogVGhlIGRlZmF1bHQgc29ydCBvcmRlciBpcyBhY2NvcmRpbmcgdG8gc3RyaW5nIFVuaWNvZGUgY29kZSBwb2ludHMuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJlRnVuY3Rpb25dIFNwZWNpZmllcyBhIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyB0aGUgc29ydCBvcmRlci5cblx0ICogSWYgb21pdHRlZCwgdGhlIGNvbGxlY3Rpb24gaXMgc29ydGVkIGFjY29yZGluZyB0byBlYWNoIGNoYXJhY3RlcidzIFVuaWNvZGUgY29kZSBwb2ludCB2YWx1ZSxcblx0ICogYWNjb3JkaW5nIHRvIHRoZSBzdHJpbmcgY29udmVyc2lvbiBvZiBlYWNoIGVsZW1lbnQuXG5cdCAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufVxuXHQgKiBAZXhhbXBsZSBjb2xsZWN0aW9uLnNvcnRlZCgodXNlckEsIHVzZXJCKSA9PiB1c2VyQS5jcmVhdGVkVGltZXN0YW1wIC0gdXNlckIuY3JlYXRlZFRpbWVzdGFtcCk7XG5cdCAqL1xuXHRwdWJsaWMgc29ydGVkKGNvbXBhcmVGdW5jdGlvbjogQ29tcGFyYXRvcjxLLCBWPiA9IENvbGxlY3Rpb24uZGVmYXVsdFNvcnQpOiBDb2xsZWN0aW9uPEssIFY+IHtcblx0XHRyZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3JbU3ltYm9sLnNwZWNpZXNdKHRoaXMpLnNvcnQoKGF2LCBidiwgYWssIGJrKSA9PiBjb21wYXJlRnVuY3Rpb24oYXYsIGJ2LCBhaywgYmspKTtcblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIGRlZmF1bHRTb3J0PFY+KGZpcnN0VmFsdWU6IFYsIHNlY29uZFZhbHVlOiBWKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gTnVtYmVyKGZpcnN0VmFsdWUgPiBzZWNvbmRWYWx1ZSkgfHwgTnVtYmVyKGZpcnN0VmFsdWUgPT09IHNlY29uZFZhbHVlKSAtIDE7XG5cdH1cbn1cblxuZXhwb3J0IHR5cGUgQ29tcGFyYXRvcjxLLCBWPiA9IChmaXJzdFZhbHVlOiBWLCBzZWNvbmRWYWx1ZTogViwgZmlyc3RLZXk6IEssIHNlY29uZEtleTogSykgPT4gbnVtYmVyO1xuXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uO1xuIl19

/***/ }),

/***/ 825:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Eventra = void 0;
const ListenerArray_1 = __importDefault(__webpack_require__(400));
class Eventra {
    constructor() {
        this._listeners = new ListenerArray_1.default({ mode: "recurring" });
        this._singularListeners = new ListenerArray_1.default({ mode: "once" });
        this.addListener = this.on;
        this.off = this.removeListener;
    }
    emit(event, ...args) {
        this._listeners.executeEvent(event, ...args);
        this._singularListeners.executeEvent(event, ...args);
    }
    eventNames() {
        let finalNamesArray = [];
        this._listeners.storage.map((val, key) => {
            if (!finalNamesArray.includes(key))
                finalNamesArray.push(key);
        });
        this._singularListeners.storage.map((val, key) => {
            if (!finalNamesArray.includes(key))
                finalNamesArray.push(key);
        });
        return finalNamesArray;
    }
    listenerCount(eventName) {
        const recurring = this._listeners.countListeners(eventName);
        const singular = this._singularListeners.countListeners(eventName);
        return (recurring + singular);
    }
    listeners(eventName) {
        let recurring = this._listeners.fetchListeners(eventName);
        let singular = this._singularListeners.fetchListeners(eventName);
        return {
            recurring,
            singular
        };
    }
    on(eventName, listener) {
        this._listeners.add(eventName, listener);
        return;
    }
    once(eventName, listener) {
        this._singularListeners.add(eventName, listener);
        return;
    }
    prependListener(eventName, listener) {
        this._listeners.prepend(eventName, listener);
        return;
    }
    prependOnceListener(eventName, listener) {
        this._singularListeners.prepend(eventName, listener);
        return;
    }
    removeAllListeners(...eventName) {
        const listeners = [...eventName];
        listeners.map(en => {
            this._listeners.removeEvent(en);
            this._singularListeners.removeEvent(en);
        });
        return this;
    }
    removeListener(eventName, listener) {
        this._listeners.removeListener(eventName, listener);
        this._singularListeners.removeListener(eventName, listener);
        return this;
    }
}
exports.Eventra = Eventra;


/***/ }),

/***/ 400:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Collection_1 = __importDefault(__webpack_require__(580));
class ListenerArray {
    constructor(options) {
        this._internalStorage = new Collection_1.default();
        if (!options)
            this._options = { mode: "recurring" };
        else
            this._options = options;
    }
    get mode() { return this._options.mode; }
    get storage() { return this._internalStorage; }
    _updateInternalStorage(collection) {
        if (!collection)
            return;
        this._internalStorage = collection;
        return;
    }
    _cloneInternalStorage() {
        const internal = this._internalStorage.clone();
        return internal;
    }
    add(eventName, listener) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event) {
            carbonCopy.set(eventName, [listener]);
            this._updateInternalStorage(carbonCopy);
            return this;
        }
        event.push(listener);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    prepend(eventName, listener) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event) {
            carbonCopy.set(eventName, [listener]);
            this._updateInternalStorage(carbonCopy);
            return this;
        }
        event.unshift(listener);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    removeListener(eventName, listener) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event)
            return this;
        if (!event.includes(listener))
            return this;
        if (event.length == 1) {
            carbonCopy.delete(eventName);
            this._updateInternalStorage(carbonCopy);
            return this;
        }
        ;
        const index = event.indexOf(listener);
        if (index > -1)
            event.splice(index, 1);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    removeEvent(eventName) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event)
            return this;
        carbonCopy.delete(eventName);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
    countListeners(eventName) {
        const event = this._internalStorage.get(eventName);
        if (!event)
            return 0;
        return event.length;
    }
    fetchListeners(eventName) {
        const event = this._internalStorage.get(eventName);
        if (!event)
            return [];
        return event;
    }
    executeEvent(eventName, ...args) {
        let carbonCopy = this._cloneInternalStorage();
        let event = carbonCopy.get(eventName);
        if (!event)
            return this;
        event.map((method, index) => {
            method(...args);
            return;
        });
        if (this.mode == 'once')
            carbonCopy.delete(eventName);
        this._updateInternalStorage(carbonCopy);
        return this;
    }
}
exports.default = ListenerArray;


/***/ }),

/***/ 580:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Collection = void 0;
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 * @property {number} size - The amount of elements in this collection.
 */
class Collection extends Map {
    /**
     * Identical to [Map.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get).
     * Gets an element with the specified key, and returns its value, or `undefined` if the element does not exist.
     * @param {*} key - The key to get from this collection
     * @returns {* | undefined}
     */
    get(key) {
        return super.get(key);
    }
    /**
     * Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set).
     * Sets a new element in the collection with the specified key and value.
     * @param {*} key - The key of the element to add
     * @param {*} value - The value of the element to add
     * @returns {Collection}
     */
    set(key, value) {
        return super.set(key, value);
    }
    /**
     * Identical to [Map.has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has).
     * Checks if an element exists in the collection.
     * @param {*} key - The key of the element to check for
     * @returns {boolean} `true` if the element exists, `false` if it does not exist.
     */
    has(key) {
        return super.has(key);
    }
    /**
     * Identical to [Map.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete).
     * Deletes an element from the collection.
     * @param {*} key - The key to delete from the collection
     * @returns {boolean} `true` if the element was removed, `false` if the element does not exist.
     */
    delete(key) {
        return super.delete(key);
    }
    /**
     * Identical to [Map.clear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear).
     * Removes all elements from the collection.
     * @returns {undefined}
     */
    clear() {
        return super.clear();
    }
    /**
     * Checks if all of the elements exist in the collection.
     * @param {...*} keys - The keys of the elements to check for
     * @returns {boolean} `true` if all of the elements exist, `false` if at least one does not exist.
     */
    hasAll(...keys) {
        return keys.every((k) => super.has(k));
    }
    /**
     * Checks if any of the elements exist in the collection.
     * @param {...*} keys - The keys of the elements to check for
     * @returns {boolean} `true` if any of the elements exist, `false` if none exist.
     */
    hasAny(...keys) {
        return keys.some((k) => super.has(k));
    }
    first(amount) {
        if (typeof amount === 'undefined')
            return this.values().next().value;
        if (amount < 0)
            return this.last(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.values();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    firstKey(amount) {
        if (typeof amount === 'undefined')
            return this.keys().next().value;
        if (amount < 0)
            return this.lastKey(amount * -1);
        amount = Math.min(this.size, amount);
        const iter = this.keys();
        return Array.from({ length: amount }, () => iter.next().value);
    }
    last(amount) {
        const arr = [...this.values()];
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.first(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    lastKey(amount) {
        const arr = [...this.keys()];
        if (typeof amount === 'undefined')
            return arr[arr.length - 1];
        if (amount < 0)
            return this.firstKey(amount * -1);
        if (!amount)
            return [];
        return arr.slice(-amount);
    }
    random(amount) {
        const arr = [...this.values()];
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    randomKey(amount) {
        const arr = [...this.keys()];
        if (typeof amount === 'undefined')
            return arr[Math.floor(Math.random() * arr.length)];
        if (!arr.length || !amount)
            return [];
        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
    find(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return val;
        }
        return undefined;
    }
    findKey(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return key;
        }
        return undefined;
    }
    sweep(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const previousSize = this.size;
        for (const [key, val] of this) {
            if (fn(val, key, this))
                this.delete(key);
        }
        return previousSize - this.size;
    }
    filter(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = new this.constructor[Symbol.species]();
        for (const [key, val] of this) {
            if (fn(val, key, this))
                results.set(key, val);
        }
        return results;
    }
    partition(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const results = [
            new this.constructor[Symbol.species](),
            new this.constructor[Symbol.species](),
        ];
        for (const [key, val] of this) {
            if (fn(val, key, this)) {
                results[0].set(key, val);
            }
            else {
                results[1].set(key, val);
            }
        }
        return results;
    }
    flatMap(fn, thisArg) {
        const collections = this.map(fn, thisArg);
        return new this.constructor[Symbol.species]().concat(...collections);
    }
    map(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }
    mapValues(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        const coll = new this.constructor[Symbol.species]();
        for (const [key, val] of this)
            coll.set(key, fn(val, key, this));
        return coll;
    }
    some(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (fn(val, key, this))
                return true;
        }
        return false;
    }
    every(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        for (const [key, val] of this) {
            if (!fn(val, key, this))
                return false;
        }
        return true;
    }
    /**
     * Applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param {*} [initialValue] Starting value for the accumulator
     * @returns {*}
     * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
     */
    reduce(fn, initialValue) {
        let accumulator;
        if (typeof initialValue !== 'undefined') {
            accumulator = initialValue;
            for (const [key, val] of this)
                accumulator = fn(accumulator, val, key, this);
            return accumulator;
        }
        let first = true;
        for (const [key, val] of this) {
            if (first) {
                accumulator = val;
                first = false;
                continue;
            }
            accumulator = fn(accumulator, val, key, this);
        }
        // No items iterated.
        if (first) {
            throw new TypeError('Reduce of empty collection with no initial value');
        }
        return accumulator;
    }
    each(fn, thisArg) {
        this.forEach(fn, thisArg);
        return this;
    }
    tap(fn, thisArg) {
        if (typeof thisArg !== 'undefined')
            fn = fn.bind(thisArg);
        fn(this);
        return this;
    }
    /**
     * Creates an identical shallow copy of this collection.
     * @returns {Collection}
     * @example const newColl = someColl.clone();
     */
    clone() {
        return new this.constructor[Symbol.species](this);
    }
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     * @param {...Collection} collections Collections to merge
     * @returns {Collection}
     * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     */
    concat(...collections) {
        const newColl = this.clone();
        for (const coll of collections) {
            for (const [key, val] of coll)
                newColl.set(key, val);
        }
        return newColl;
    }
    /**
     * Checks if this collection shares identical items with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     * @param {Collection} collection Collection to compare with
     * @returns {boolean} Whether the collections have identical contents
     */
    equals(collection) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!collection)
            return false; // runtime check
        if (this === collection)
            return true;
        if (this.size !== collection.size)
            return false;
        for (const [key, value] of this) {
            if (!collection.has(key) || value !== collection.get(key)) {
                return false;
            }
        }
        return true;
    }
    /**
     * The sort method sorts the items of a collection in place and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sort(compareFunction = Collection.defaultSort) {
        const entries = [...this.entries()];
        entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));
        // Perform clean-up
        super.clear();
        // Set the new entries
        for (const [k, v] of entries) {
            super.set(k, v);
        }
        return this;
    }
    /**
     * The intersect method returns a new structure containing items where the keys are present in both original structures.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    intersect(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [k, v] of other) {
            if (this.has(k))
                coll.set(k, v);
        }
        return coll;
    }
    /**
     * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    difference(other) {
        const coll = new this.constructor[Symbol.species]();
        for (const [k, v] of other) {
            if (!this.has(k))
                coll.set(k, v);
        }
        for (const [k, v] of this) {
            if (!other.has(k))
                coll.set(k, v);
        }
        return coll;
    }
    /**
     * The sorted method sorts the items of a collection and returns it.
     * The sort is not necessarily stable in Node 10 or older.
     * The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    sorted(compareFunction = Collection.defaultSort) {
        return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
    }
    static defaultSort(firstValue, secondValue) {
        return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
    }
}
exports.Collection = Collection;
Collection.default = Collection;
exports.default = Collection;


/***/ }),

/***/ 284:
/***/ ((module) => {

var naiveFallback = function () {
	if (typeof self === "object" && self) return self;
	if (typeof window === "object" && window) return window;
	throw new Error("Unable to resolve global `this`");
};

module.exports = (function () {
	if (this) return this;

	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

	// Fallback to standard globalThis if available
	if (typeof globalThis === "object" && globalThis) return globalThis;

	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
	// In all ES5+ engines global object inherits from Object.prototype
	// (if you approached one that doesn't please report)
	try {
		Object.defineProperty(Object.prototype, "__global__", {
			get: function () { return this; },
			configurable: true
		});
	} catch (error) {
		// Unfortunate case of updates to Object.prototype being restricted
		// via preventExtensions, seal or freeze
		return naiveFallback();
	}
	try {
		// Safari case (window.__global__ works, but __global__ does not)
		if (!__global__) return naiveFallback();
		return __global__;
	} finally {
		delete Object.prototype.__global__;
	}
})();


/***/ }),

/***/ 614:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "NIL": () => (/* reexport */ nil),
  "parse": () => (/* reexport */ esm_browser_parse),
  "stringify": () => (/* reexport */ esm_browser_stringify),
  "v1": () => (/* reexport */ esm_browser_v1),
  "v3": () => (/* reexport */ esm_browser_v3),
  "v4": () => (/* reexport */ esm_browser_v4),
  "v5": () => (/* reexport */ esm_browser_v5),
  "validate": () => (/* reexport */ esm_browser_validate),
  "version": () => (/* reexport */ esm_browser_version)
});

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/rng.js
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/regex.js
/* harmony default export */ const regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/validate.js


function validate(uuid) {
  return typeof uuid === 'string' && regex.test(uuid);
}

/* harmony default export */ const esm_browser_validate = (validate);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!esm_browser_validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const esm_browser_stringify = (stringify);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v1.js

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || new Array(16);
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || esm_browser_stringify(b);
}

/* harmony default export */ const esm_browser_v1 = (v1);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/parse.js


function parse(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  var v;
  var arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const esm_browser_parse = (parse);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v35.js



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = [];

  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = esm_browser_parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    var bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return esm_browser_stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/md5.js
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Uint8Array(msg.length);

    for (var i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';

  for (var i = 0; i < length32; i += 8) {
    var x = input[i >> 5] >>> i % 32 & 0xff;
    var hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/**
 * Calculate output length with padding and bit length
 */


function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[getOutputLength(len) - 1] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }

  var length8 = input.length * 8;
  var output = new Uint32Array(getOutputLength(length8));

  for (var i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ const esm_browser_md5 = (md5);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v3.js


var v3 = v35('v3', 0x30, esm_browser_md5);
/* harmony default export */ const esm_browser_v3 = (v3);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v4.js



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return esm_browser_stringify(rnds);
}

/* harmony default export */ const esm_browser_v4 = (v4);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/sha1.js
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes === 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = [];

    for (var i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    // Convert Array-like to Array
    bytes = Array.prototype.slice.call(bytes);
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var _i = 0; _i < N; ++_i) {
    var arr = new Uint32Array(16);

    for (var j = 0; j < 16; ++j) {
      arr[j] = bytes[_i * 64 + j * 4] << 24 | bytes[_i * 64 + j * 4 + 1] << 16 | bytes[_i * 64 + j * 4 + 2] << 8 | bytes[_i * 64 + j * 4 + 3];
    }

    M[_i] = arr;
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var _i2 = 0; _i2 < N; ++_i2) {
    var W = new Uint32Array(80);

    for (var t = 0; t < 16; ++t) {
      W[t] = M[_i2][t];
    }

    for (var _t = 16; _t < 80; ++_t) {
      W[_t] = ROTL(W[_t - 3] ^ W[_t - 8] ^ W[_t - 14] ^ W[_t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var _t2 = 0; _t2 < 80; ++_t2) {
      var s = Math.floor(_t2 / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[_t2] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ const esm_browser_sha1 = (sha1);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/v5.js


var v5 = v35('v5', 0x50, esm_browser_sha1);
/* harmony default export */ const esm_browser_v5 = (v5);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/nil.js
/* harmony default export */ const nil = ('00000000-0000-0000-0000-000000000000');
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/version.js


function version(uuid) {
  if (!esm_browser_validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const esm_browser_version = (version);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-browser/index.js










/***/ }),

/***/ 840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _globalThis;
if (typeof globalThis === 'object') {
	_globalThis = globalThis;
} else {
	try {
		_globalThis = __webpack_require__(284);
	} catch (error) {
	} finally {
		if (!_globalThis && typeof window !== 'undefined') { _globalThis = window; }
		if (!_globalThis) { throw new Error('Could not determine global this'); }
	}
}

var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;
var websocket_version = __webpack_require__(387);


/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new NativeWebSocket(uri, protocols);
	}
	else {
		native_instance = new NativeWebSocket(uri);
	}

	/**
	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
	 * class). Since it is an Object it will be returned as it is when creating an
	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
	 *
	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
	 */
	return native_instance;
}
if (NativeWebSocket) {
	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function(prop) {
		Object.defineProperty(W3CWebSocket, prop, {
			get: function() { return NativeWebSocket[prop]; }
		});
	});
}

/**
 * Module exports.
 */
module.exports = {
    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
    'version'      : websocket_version
};


/***/ }),

/***/ 387:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(847).version;


/***/ }),

/***/ 847:
/***/ ((module) => {

"use strict";
module.exports = {"version":"1.0.34"};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(659);
/******/ 	trixi = __webpack_exports__;
/******/ 	
/******/ })()
;