(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsonata = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _is = require('babel-runtime/core-js/object/is');

var _is2 = _interopRequireDefault(_is);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _iterator = require('babel-runtime/core-js/symbol/iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _isIterable2 = require('babel-runtime/core-js/is-iterable');

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

/**
 * @module JSONata
 * @description JSON query and transformation language
 */

/**
 * jsonata
 * @function
 * @param {Object} expr - JSONata expression
 * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
 */
var jsonata = function () {
    'use strict';

    var _marked = /*#__PURE__*/_regenerator2.default.mark(_evaluate),
        _marked2 = /*#__PURE__*/_regenerator2.default.mark(evaluatePath),
        _marked3 = /*#__PURE__*/_regenerator2.default.mark(evaluateStep),
        _marked4 = /*#__PURE__*/_regenerator2.default.mark(applyPredicates),
        _marked5 = /*#__PURE__*/_regenerator2.default.mark(evaluateFilter),
        _marked6 = /*#__PURE__*/_regenerator2.default.mark(evaluateBinary),
        _marked7 = /*#__PURE__*/_regenerator2.default.mark(evaluateUnary),
        _marked8 = /*#__PURE__*/_regenerator2.default.mark(evaluateGroupExpression),
        _marked9 = /*#__PURE__*/_regenerator2.default.mark(evaluateBindExpression),
        _marked10 = /*#__PURE__*/_regenerator2.default.mark(evaluateCondition),
        _marked11 = /*#__PURE__*/_regenerator2.default.mark(evaluateBlock),
        _marked12 = /*#__PURE__*/_regenerator2.default.mark(evaluateMatcher),
        _marked13 = /*#__PURE__*/_regenerator2.default.mark(evaluateSortExpression),
        _marked14 = /*#__PURE__*/_regenerator2.default.mark(evaluateApplyExpression),
        _marked15 = /*#__PURE__*/_regenerator2.default.mark(evaluateFunction),
        _marked16 = /*#__PURE__*/_regenerator2.default.mark(apply),
        _marked17 = /*#__PURE__*/_regenerator2.default.mark(applyInner),
        _marked18 = /*#__PURE__*/_regenerator2.default.mark(evaluatePartialApplication),
        _marked19 = /*#__PURE__*/_regenerator2.default.mark(applyProcedure),
        _marked20 = /*#__PURE__*/_regenerator2.default.mark(applyNativeFunction),
        _marked21 = /*#__PURE__*/_regenerator2.default.mark(functionContains),
        _marked22 = /*#__PURE__*/_regenerator2.default.mark(functionMatch),
        _marked23 = /*#__PURE__*/_regenerator2.default.mark(functionReplace),
        _marked24 = /*#__PURE__*/_regenerator2.default.mark(functionSplit),
        _marked25 = /*#__PURE__*/_regenerator2.default.mark(functionMap),
        _marked26 = /*#__PURE__*/_regenerator2.default.mark(functionFilter),
        _marked27 = /*#__PURE__*/_regenerator2.default.mark(functionFoldLeft),
        _marked28 = /*#__PURE__*/_regenerator2.default.mark(functionEach),
        _marked29 = /*#__PURE__*/_regenerator2.default.mark(functionSort),
        _marked30 = /*#__PURE__*/_regenerator2.default.mark(functionSift);

    var operators = {
        '.': 75,
        '[': 80,
        ']': 0,
        '{': 70,
        '}': 0,
        '(': 80,
        ')': 0,
        ',': 0,
        '@': 75,
        '#': 70,
        ';': 80,
        ':': 80,
        '?': 20,
        '+': 50,
        '-': 50,
        '*': 60,
        '/': 60,
        '%': 60,
        '|': 20,
        '=': 40,
        '<': 40,
        '>': 40,
        '^': 40,
        '**': 60,
        '..': 20,
        ':=': 10,
        '!=': 40,
        '<=': 40,
        '>=': 40,
        '~>': 40,
        'and': 30,
        'or': 25,
        'in': 40,
        '&': 50,
        '!': 0, // not an operator, but needed as a stop character for name tokens
        '~': 0 // not an operator, but needed as a stop character for name tokens
    };

    var escapes = { // JSON string escape sequences - see json.org
        '"': '"',
        '\\': '\\',
        '/': '/',
        'b': '\b',
        'f': '\f',
        'n': '\n',
        'r': '\r',
        't': '\t'
    };

    // Tokenizer (lexer) - invoked by the parser to return one token at a time
    var tokenizer = function tokenizer(path) {
        var position = 0;
        var length = path.length;

        var create = function create(type, value) {
            var obj = { type: type, value: value, position: position };
            return obj;
        };

        var scanRegex = function scanRegex() {
            // the prefix '/' will have been previously scanned. Find the end of the regex.
            // search for closing '/' ignoring any that are escaped, or within brackets
            var start = position;
            var depth = 0;
            var pattern;
            var flags;
            while (position < length) {
                var currentChar = path.charAt(position);
                if (currentChar === '/' && path.charAt(position - 1) !== '\\' && depth === 0) {
                    // end of regex found
                    pattern = path.substring(start, position);
                    if (pattern === '') {
                        throw {
                            code: "S0301",
                            stack: new Error().stack,
                            position: position
                        };
                    }
                    position++;
                    currentChar = path.charAt(position);
                    // flags
                    start = position;
                    while (currentChar === 'i' || currentChar === 'm') {
                        position++;
                        currentChar = path.charAt(position);
                    }
                    flags = path.substring(start, position) + 'g';
                    return new RegExp(pattern, flags);
                }
                if ((currentChar === '(' || currentChar === '[' || currentChar === '{') && path.charAt(position - 1) !== '\\') {
                    depth++;
                }
                if ((currentChar === ')' || currentChar === ']' || currentChar === '}') && path.charAt(position - 1) !== '\\') {
                    depth--;
                }

                position++;
            }
            throw {
                code: "S0302",
                stack: new Error().stack,
                position: position
            };
        };

        var next = function next(prefix) {
            if (position >= length) return null;
            var currentChar = path.charAt(position);
            // skip whitespace
            while (position < length && ' \t\n\r\v'.indexOf(currentChar) > -1) {
                position++;
                currentChar = path.charAt(position);
            }
            // test for regex
            if (prefix !== true && currentChar === '/') {
                position++;
                return create('regex', scanRegex());
            }
            // handle double-char operators
            if (currentChar === '.' && path.charAt(position + 1) === '.') {
                // double-dot .. range operator
                position += 2;
                return create('operator', '..');
            }
            if (currentChar === ':' && path.charAt(position + 1) === '=') {
                // := assignment
                position += 2;
                return create('operator', ':=');
            }
            if (currentChar === '!' && path.charAt(position + 1) === '=') {
                // !=
                position += 2;
                return create('operator', '!=');
            }
            if (currentChar === '>' && path.charAt(position + 1) === '=') {
                // >=
                position += 2;
                return create('operator', '>=');
            }
            if (currentChar === '<' && path.charAt(position + 1) === '=') {
                // <=
                position += 2;
                return create('operator', '<=');
            }
            if (currentChar === '*' && path.charAt(position + 1) === '*') {
                // **  descendant wildcard
                position += 2;
                return create('operator', '**');
            }
            if (currentChar === '~' && path.charAt(position + 1) === '>') {
                // ~>  chain function
                position += 2;
                return create('operator', '~>');
            }
            // test for single char operators
            if (operators.hasOwnProperty(currentChar)) {
                position++;
                return create('operator', currentChar);
            }
            // test for string literals
            if (currentChar === '"' || currentChar === "'") {
                var quoteType = currentChar;
                // double quoted string literal - find end of string
                position++;
                var qstr = "";
                while (position < length) {
                    currentChar = path.charAt(position);
                    if (currentChar === '\\') {
                        // escape sequence
                        position++;
                        currentChar = path.charAt(position);
                        if (escapes.hasOwnProperty(currentChar)) {
                            qstr += escapes[currentChar];
                        } else if (currentChar === 'u') {
                            // \u should be followed by 4 hex digits
                            var octets = path.substr(position + 1, 4);
                            if (/^[0-9a-fA-F]+$/.test(octets)) {
                                var codepoint = parseInt(octets, 16);
                                qstr += String.fromCharCode(codepoint);
                                position += 4;
                            } else {
                                throw {
                                    code: "S0104",
                                    stack: new Error().stack,
                                    position: position
                                };
                            }
                        } else {
                            // illegal escape sequence
                            throw {
                                code: "S0103",
                                stack: new Error().stack,
                                position: position,
                                token: currentChar
                            };
                        }
                    } else if (currentChar === quoteType) {
                        position++;
                        return create('string', qstr);
                    } else {
                        qstr += currentChar;
                    }
                    position++;
                }
                throw {
                    code: "S0101",
                    stack: new Error().stack,
                    position: position
                };
            }
            // test for numbers
            var numregex = /^-?(0|([1-9][0-9]*))(\.[0-9]+)?([Ee][-+]?[0-9]+)?/;
            var match = numregex.exec(path.substring(position));
            if (match !== null) {
                var num = parseFloat(match[0]);
                if (!isNaN(num) && isFinite(num)) {
                    position += match[0].length;
                    return create('number', num);
                } else {
                    throw {
                        code: "S0102",
                        stack: new Error().stack,
                        position: position,
                        token: match[0]
                    };
                }
            }
            // test for quoted names (backticks)
            var name;
            if (currentChar === '`') {
                // scan for closing quote
                position++;
                var end = path.indexOf('`', position);
                if (end !== -1) {
                    name = path.substring(position, end);
                    position = end + 1;
                    return create('name', name);
                }
                position = length;
                throw {
                    code: "S0105",
                    stack: new Error().stack,
                    position: position
                };
            }
            // test for names
            var i = position;
            var ch;
            for (;;) {
                ch = path.charAt(i);
                if (i === length || ' \t\n\r\v'.indexOf(ch) > -1 || operators.hasOwnProperty(ch)) {
                    if (path.charAt(position) === '$') {
                        // variable reference
                        name = path.substring(position + 1, i);
                        position = i;
                        return create('variable', name);
                    } else {
                        name = path.substring(position, i);
                        position = i;
                        switch (name) {
                            case 'or':
                            case 'in':
                            case 'and':
                                return create('operator', name);
                            case 'true':
                                return create('value', true);
                            case 'false':
                                return create('value', false);
                            case 'null':
                                return create('value', null);
                            default:
                                if (position === length && name === '') {
                                    // whitespace at end of input
                                    return null;
                                }
                                return create('name', name);
                        }
                    }
                } else {
                    i++;
                }
            }
        };

        return next;
    };

    /**
     * Parses a function signature definition and returns a validation function
     * @param {string} signature - the signature between the <angle brackets>
     * @returns {Function} validation function
     */
    function parseSignature(signature) {
        // create a Regex that represents this signature and return a function that when invoked,
        // returns the validated (possibly fixed-up) arguments, or throws a validation error
        // step through the signature, one symbol at a time
        var position = 1;
        var params = [];
        var param = {};
        var prevParam = param;
        while (position < signature.length) {
            var symbol = signature.charAt(position);
            if (symbol === ':') {
                // TODO figure out what to do with the return type
                // ignore it for now
                break;
            }

            var next = function next() {
                params.push(param);
                prevParam = param;
                param = {};
            };

            var findClosingBracket = function findClosingBracket(str, start, openSymbol, closeSymbol) {
                // returns the position of the closing symbol (e.g. bracket) in a string
                // that balances the opening symbol at position start
                var depth = 1;
                var position = start;
                while (position < str.length) {
                    position++;
                    symbol = str.charAt(position);
                    if (symbol === closeSymbol) {
                        depth--;
                        if (depth === 0) {
                            // we're done
                            break; // out of while loop
                        }
                    } else if (symbol === openSymbol) {
                        depth++;
                    }
                }
                return position;
            };

            switch (symbol) {
                case 's': // string
                case 'n': // number
                case 'b': // boolean
                case 'l': // not so sure about expecting null?
                case 'o':
                    // object
                    param.regex = '[' + symbol + 'm]';
                    param.type = symbol;
                    next();
                    break;
                case 'a':
                    // array
                    //  normally treat any value as singleton array
                    param.regex = '[asnblfom]';
                    param.type = symbol;
                    param.array = true;
                    next();
                    break;
                case 'f':
                    // function
                    param.regex = 'f';
                    param.type = symbol;
                    next();
                    break;
                case 'j':
                    // any JSON type
                    param.regex = '[asnblom]';
                    param.type = symbol;
                    next();
                    break;
                case 'x':
                    // any type
                    param.regex = '[asnblfom]';
                    param.type = symbol;
                    next();
                    break;
                case '-':
                    // use context if param not supplied
                    prevParam.context = true;
                    prevParam.contextRegex = new RegExp(prevParam.regex); // pre-compiled to test the context type at runtime
                    prevParam.regex += '?';
                    break;
                case '?': // optional param
                case '+':
                    // one or more
                    prevParam.regex += symbol;
                    break;
                case '(':
                    // choice of types
                    // search forward for matching ')'
                    var endParen = findClosingBracket(signature, position, '(', ')');
                    var choice = signature.substring(position + 1, endParen);
                    if (choice.indexOf('<') === -1) {
                        // no parameterized types, simple regex
                        param.regex = '[' + choice + 'm]';
                    } else {
                        // TODO harder
                        throw {
                            code: "S0402",
                            stack: new Error().stack,
                            value: choice,
                            offset: position
                        };
                    }
                    param.type = '(' + choice + ')';
                    position = endParen;
                    next();
                    break;
                case '<':
                    // type parameter - can only be applied to 'a' and 'f'
                    if (prevParam.type === 'a' || prevParam.type === 'f') {
                        // search forward for matching '>'
                        var endPos = findClosingBracket(signature, position, '<', '>');
                        prevParam.subtype = signature.substring(position + 1, endPos);
                        position = endPos;
                    } else {
                        throw {
                            code: "S0401",
                            stack: new Error().stack,
                            value: prevParam.type,
                            offset: position
                        };
                    }
                    break;
            }
            position++;
        }
        var regexStr = '^' + params.map(function (param) {
            return '(' + param.regex + ')';
        }).join('') + '$';
        var regex = new RegExp(regexStr);
        var getSymbol = function getSymbol(value) {
            var symbol;
            if (isFunction(value)) {
                symbol = 'f';
            } else {
                var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
                switch (type) {
                    case 'string':
                        symbol = 's';
                        break;
                    case 'number':
                        symbol = 'n';
                        break;
                    case 'boolean':
                        symbol = 'b';
                        break;
                    case 'object':
                        if (value === null) {
                            symbol = 'l';
                        } else if (Array.isArray(value)) {
                            symbol = 'a';
                        } else {
                            symbol = 'o';
                        }
                        break;
                    case 'undefined':
                    default:
                        // any value can be undefined, but should be allowed to match
                        symbol = 'm'; // m for missing
                }
            }
            return symbol;
        };

        var throwValidationError = function throwValidationError(badArgs, badSig) {
            // to figure out where this went wrong we need apply each component of the
            // regex to each argument until we get to the one that fails to match
            var partialPattern = '^';
            var goodTo = 0;
            for (var index = 0; index < params.length; index++) {
                partialPattern += params[index].regex;
                var match = badSig.match(partialPattern);
                if (match === null) {
                    // failed here
                    throw {
                        code: "T0410",
                        stack: new Error().stack,
                        value: badArgs[goodTo],
                        index: goodTo + 1
                    };
                }
                goodTo = match[0].length;
            }
            // if it got this far, it's probably because of extraneous arguments (we
            // haven't added the trailing '$' in the regex yet.
            throw {
                code: "T0410",
                stack: new Error().stack,
                value: badArgs[goodTo],
                index: goodTo + 1
            };
        };

        return {
            definition: signature,
            validate: function validate(args, context) {
                var suppliedSig = '';
                args.forEach(function (arg) {
                    suppliedSig += getSymbol(arg);
                });
                var isValid = regex.exec(suppliedSig);
                if (isValid) {
                    var validatedArgs = [];
                    var argIndex = 0;
                    params.forEach(function (param, index) {
                        var arg = args[argIndex];
                        var match = isValid[index + 1];
                        if (match === '') {
                            if (param.context && param.contextRegex) {
                                // substitute context value for missing arg
                                // first check that the context value is the right type
                                var contextType = getSymbol(context);
                                // test contextType against the regex for this arg (without the trailing ?)
                                if (param.contextRegex.test(contextType)) {
                                    validatedArgs.push(context);
                                } else {
                                    // context value not compatible with this argument
                                    throw {
                                        code: "T0411",
                                        stack: new Error().stack,
                                        value: context,
                                        index: argIndex + 1
                                    };
                                }
                            } else {
                                validatedArgs.push(arg);
                                argIndex++;
                            }
                        } else {
                            // may have matched multiple args (if the regex ends with a '+'
                            // split into single tokens
                            match.split('').forEach(function (single) {
                                if (param.type === 'a') {
                                    if (single === 'm') {
                                        // missing (undefined)
                                        arg = undefined;
                                    } else {
                                        arg = args[argIndex];
                                        var arrayOK = true;
                                        // is there type information on the contents of the array?
                                        if (typeof param.subtype !== 'undefined') {
                                            if (single !== 'a' && match !== param.subtype) {
                                                arrayOK = false;
                                            } else if (single === 'a') {
                                                if (arg.length > 0) {
                                                    var itemType = getSymbol(arg[0]);
                                                    if (itemType !== param.subtype.charAt(0)) {
                                                        // TODO recurse further
                                                        arrayOK = false;
                                                    } else {
                                                        // make sure every item in the array is this type
                                                        var differentItems = arg.filter(function (val) {
                                                            return getSymbol(val) !== itemType;
                                                        });
                                                        arrayOK = differentItems.length === 0;
                                                    }
                                                }
                                            }
                                        }
                                        if (!arrayOK) {
                                            throw {
                                                code: "T0412",
                                                stack: new Error().stack,
                                                value: arg,
                                                index: argIndex + 1,
                                                type: param.subtype // TODO translate symbol to type name
                                            };
                                        }
                                        // the function expects an array. If it's not one, make it so
                                        if (single !== 'a') {
                                            arg = [arg];
                                        }
                                    }
                                    validatedArgs.push(arg);
                                    argIndex++;
                                } else {
                                    validatedArgs.push(arg);
                                    argIndex++;
                                }
                            });
                        }
                    });
                    return validatedArgs;
                }
                throwValidationError(args, suppliedSig);
            }
        };
    }

    // This parser implements the 'Top down operator precedence' algorithm developed by Vaughan R Pratt; http://dl.acm.org/citation.cfm?id=512931.
    // and builds on the Javascript framework described by Douglas Crockford at http://javascript.crockford.com/tdop/tdop.html
    // and in 'Beautiful Code', edited by Andy Oram and Greg Wilson, Copyright 2007 O'Reilly Media, Inc. 798-0-596-51004-6

    var parser = function parser(source, recover) {
        var node;
        var lexer;

        var symbol_table = {};
        var errors = [];

        var remainingTokens = function remainingTokens() {
            var remaining = [];
            if (node.id !== '(end)') {
                remaining.push({ type: node.type, value: node.value, position: node.position });
            }
            var nxt = lexer();
            while (nxt !== null) {
                remaining.push(nxt);
                nxt = lexer();
            }
            return remaining;
        };

        var base_symbol = {
            nud: function nud() {
                // error - symbol has been invoked as a unary operator
                var err = {
                    code: 'S0211',
                    token: this.value,
                    position: this.position
                };

                if (recover) {
                    err.remaining = remainingTokens();
                    err.type = 'error';
                    errors.push(err);
                    return err;
                } else {
                    err.stack = new Error().stack;
                    throw err;
                }
            }
        };

        var symbol = function symbol(id, bp) {
            var s = symbol_table[id];
            bp = bp || 0;
            if (s) {
                if (bp >= s.lbp) {
                    s.lbp = bp;
                }
            } else {
                s = (0, _create2.default)(base_symbol);
                s.id = s.value = id;
                s.lbp = bp;
                symbol_table[id] = s;
            }
            return s;
        };

        var handleError = function handleError(err) {
            if (recover) {
                // tokenize the rest of the buffer and add it to an error token
                err.remaining = remainingTokens();
                errors.push(err);
                var symbol = symbol_table["(error)"];
                node = (0, _create2.default)(symbol);
                node.error = err;
                node.type = "(error)";
                return node;
            } else {
                err.stack = new Error().stack;
                throw err;
            }
        };

        var advance = function advance(id, infix) {
            if (id && node.id !== id) {
                var code;
                if (node.id === '(end)') {
                    // unexpected end of buffer
                    code = "S0203";
                } else {
                    code = "S0202";
                }
                var err = {
                    code: code,
                    position: node.position,
                    token: node.value,
                    value: id
                };
                return handleError(err);
            }
            var next_token = lexer(infix);
            if (next_token === null) {
                node = symbol_table["(end)"];
                node.position = source.length;
                return node;
            }
            var value = next_token.value;
            var type = next_token.type;
            var symbol;
            switch (type) {
                case 'name':
                case 'variable':
                    symbol = symbol_table["(name)"];
                    break;
                case 'operator':
                    symbol = symbol_table[value];
                    if (!symbol) {
                        return handleError({
                            code: "S0204",
                            stack: new Error().stack,
                            position: next_token.position,
                            token: value
                        });
                    }
                    break;
                case 'string':
                case 'number':
                case 'value':
                    symbol = symbol_table["(literal)"];
                    break;
                case 'regex':
                    type = "regex";
                    symbol = symbol_table["(regex)"];
                    break;
                /* istanbul ignore next */
                default:
                    return handleError({
                        code: "S0205",
                        stack: new Error().stack,
                        position: next_token.position,
                        token: value
                    });
            }

            node = (0, _create2.default)(symbol);
            node.value = value;
            node.type = type;
            node.position = next_token.position;
            return node;
        };

        // Pratt's algorithm
        var expression = function expression(rbp) {
            var left;
            var t = node;
            advance(null, true);
            left = t.nud();
            while (rbp < node.lbp) {
                t = node;
                advance();
                left = t.led(left);
            }
            return left;
        };

        var terminal = function terminal(id) {
            var s = symbol(id, 0);
            s.nud = function () {
                return this;
            };
        };

        // match infix operators
        // <expression> <operator> <expression>
        // left associative
        var infix = function infix(id, bp, led) {
            var bindingPower = bp || operators[id];
            var s = symbol(id, bindingPower);
            s.led = led || function (left) {
                this.lhs = left;
                this.rhs = expression(bindingPower);
                this.type = "binary";
                return this;
            };
            return s;
        };

        // match infix operators
        // <expression> <operator> <expression>
        // right associative
        var infixr = function infixr(id, bp, led) {
            var s = symbol(id, bp);
            s.led = led;
            return s;
        };

        // match prefix operators
        // <operator> <expression>
        var prefix = function prefix(id, nud) {
            var s = symbol(id);
            s.nud = nud || function () {
                this.expression = expression(70);
                this.type = "unary";
                return this;
            };
            return s;
        };

        terminal("(end)");
        terminal("(name)");
        terminal("(literal)");
        terminal("(regex)");
        symbol(":");
        symbol(";");
        symbol(",");
        symbol(")");
        symbol("]");
        symbol("}");
        symbol(".."); // range operator
        infix("."); // field reference
        infix("+"); // numeric addition
        infix("-"); // numeric subtraction
        infix("*"); // numeric multiplication
        infix("/"); // numeric division
        infix("%"); // numeric modulus
        infix("="); // equality
        infix("<"); // less than
        infix(">"); // greater than
        infix("!="); // not equal to
        infix("<="); // less than or equal
        infix(">="); // greater than or equal
        infix("&"); // string concatenation
        infix("and"); // Boolean AND
        infix("or"); // Boolean OR
        infix("in"); // is member of array
        terminal("and"); // the 'keywords' can also be used as terminals (field names)
        terminal("or"); //
        terminal("in"); //
        prefix("-"); // unary numeric negation
        infix("~>"); // function application

        infixr("(error)", 10, function (left) {
            this.lhs = left;

            this.error = node.error;
            this.remaining = remainingTokens();
            this.type = 'error';
            return this;
        });

        // field wildcard (single level)
        prefix('*', function () {
            this.type = "wildcard";
            return this;
        });

        // descendant wildcard (multi-level)
        prefix('**', function () {
            this.type = "descendant";
            return this;
        });

        // function invocation
        infix("(", operators['('], function (left) {
            // left is is what we are trying to invoke
            this.procedure = left;
            this.type = 'function';
            this.arguments = [];
            if (node.id !== ')') {
                for (;;) {
                    if (node.type === 'operator' && node.id === '?') {
                        // partial function application
                        this.type = 'partial';
                        this.arguments.push(node);
                        advance('?');
                    } else {
                        this.arguments.push(expression(0));
                    }
                    if (node.id !== ',') break;
                    advance(',');
                }
            }
            advance(")", true);
            // if the name of the function is 'function' or λ, then this is function definition (lambda function)
            if (left.type === 'name' && (left.value === 'function' || left.value === '\u03BB')) {
                // all of the args must be VARIABLE tokens
                this.arguments.forEach(function (arg, index) {
                    if (arg.type !== 'variable') {
                        return handleError({
                            code: "S0208",
                            stack: new Error().stack,
                            position: arg.position,
                            token: arg.value,
                            value: index + 1
                        });
                    }
                });
                this.type = 'lambda';
                // is the next token a '<' - if so, parse the function signature
                if (node.id === '<') {
                    var sigPos = node.position;
                    var depth = 1;
                    var sig = '<';
                    while (depth > 0 && node.id !== '{' && node.id !== '(end)') {
                        var tok = advance();
                        if (tok.id === '>') {
                            depth--;
                        } else if (tok.id === '<') {
                            depth++;
                        }
                        sig += tok.value;
                    }
                    advance('>');
                    try {
                        this.signature = parseSignature(sig);
                    } catch (err) {
                        // insert the position into this error
                        err.position = sigPos + err.offset;
                        return handleError(err);
                    }
                }
                // parse the function body
                advance('{');
                this.body = expression(0);
                advance('}');
            }
            return this;
        });

        // parenthesis - block expression
        prefix("(", function () {
            var expressions = [];
            while (node.id !== ")") {
                expressions.push(expression(0));
                if (node.id !== ";") {
                    break;
                }
                advance(";");
            }
            advance(")", true);
            this.type = 'block';
            this.expressions = expressions;
            return this;
        });

        // array constructor
        prefix("[", function () {
            var a = [];
            if (node.id !== "]") {
                for (;;) {
                    var item = expression(0);
                    if (node.id === "..") {
                        // range operator
                        var range = { type: "binary", value: "..", position: node.position, lhs: item };
                        advance("..");
                        range.rhs = expression(0);
                        item = range;
                    }
                    a.push(item);
                    if (node.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("]", true);
            this.expressions = a;
            this.type = "unary";
            return this;
        });

        // filter - predicate or array index
        infix("[", operators['['], function (left) {
            if (node.id === "]") {
                // empty predicate means maintain singleton arrays in the output
                var step = left;
                while (step && step.type === 'binary' && step.value === '[') {
                    step = step.lhs;
                }
                step.keepArray = true;
                advance("]");
                return left;
            } else {
                this.lhs = left;
                this.rhs = expression(operators[']']);
                this.type = 'binary';
                advance("]", true);
                return this;
            }
        });

        // order-by
        infix("^", operators['^'], function (left) {
            advance("(");
            var terms = [];
            for (;;) {
                var term = {
                    descending: false
                };
                if (node.id === "<") {
                    // ascending sort
                    advance("<");
                } else if (node.id === ">") {
                    // descending sort
                    term.descending = true;
                    advance(">");
                } else {
                    //unspecified - default to ascending
                }
                term.expression = expression(0);
                terms.push(term);
                if (node.id !== ",") {
                    break;
                }
                advance(",");
            }
            advance(")");
            this.lhs = left;
            this.rhs = terms;
            this.type = 'binary';
            return this;
        });

        var objectParser = function objectParser(left) {
            var a = [];
            if (node.id !== "}") {
                for (;;) {
                    var n = expression(0);
                    advance(":");
                    var v = expression(0);
                    a.push([n, v]); // holds an array of name/value expression pairs
                    if (node.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("}", true);
            if (typeof left === 'undefined') {
                // NUD - unary prefix form
                this.lhs = a;
                this.type = "unary";
            } else {
                // LED - binary infix form
                this.lhs = left;
                this.rhs = a;
                this.type = 'binary';
            }
            return this;
        };

        // object constructor
        prefix("{", objectParser);

        // object grouping
        infix("{", operators['{'], objectParser);

        // bind variable
        infixr(":=", operators[':='], function (left) {
            if (left.type !== 'variable') {
                return handleError({
                    code: "S0212",
                    stack: new Error().stack,
                    position: left.position,
                    token: left.value
                });
            }
            this.lhs = left;
            this.rhs = expression(operators[':='] - 1); // subtract 1 from bindingPower for right associative operators
            this.type = "binary";
            return this;
        });

        // if/then/else ternary operator ?:
        infix("?", operators['?'], function (left) {
            this.type = 'condition';
            this.condition = left;
            this.then = expression(0);
            if (node.id === ':') {
                // else condition
                advance(":");
                this.else = expression(0);
            }
            return this;
        });

        // object transformer
        prefix("|", function () {
            this.type = 'transform';
            this.pattern = expression(0);
            advance('|');
            this.update = expression(0);
            if (node.id === ',') {
                advance(',');
                this.delete = expression(0);
            }
            advance('|');
            return this;
        });

        // tail call optimization
        // this is invoked by the post parser to analyse lambda functions to see
        // if they make a tail call.  If so, it is replaced by a thunk which will
        // be invoked by the trampoline loop during function application.
        // This enables tail-recursive functions to be written without growing the stack
        var tail_call_optimize = function tail_call_optimize(expr) {
            var result;
            if (expr.type === 'function' && !expr.predicate) {
                var thunk = { type: 'lambda', thunk: true, arguments: [], position: expr.position };
                thunk.body = expr;
                result = thunk;
            } else if (expr.type === 'condition') {
                // analyse both branches
                expr.then = tail_call_optimize(expr.then);
                if (typeof expr.else !== 'undefined') {
                    expr.else = tail_call_optimize(expr.else);
                }
                result = expr;
            } else if (expr.type === 'block') {
                // only the last expression in the block
                var length = expr.expressions.length;
                if (length > 0) {
                    expr.expressions[length - 1] = tail_call_optimize(expr.expressions[length - 1]);
                }
                result = expr;
            } else {
                result = expr;
            }
            return result;
        };

        // post-parse stage
        // the purpose of this is flatten the parts of the AST representing location paths,
        // converting them to arrays of steps which in turn may contain arrays of predicates.
        // following this, nodes containing '.' and '[' should be eliminated from the AST.
        var ast_optimize = function ast_optimize(expr) {
            var result;
            switch (expr.type) {
                case 'binary':
                    switch (expr.value) {
                        case '.':
                            var lstep = ast_optimize(expr.lhs);
                            result = { type: 'path', steps: [] };
                            if (lstep.type === 'path') {
                                Array.prototype.push.apply(result.steps, lstep.steps);
                            } else {
                                result.steps = [lstep];
                            }
                            var rest = ast_optimize(expr.rhs);
                            if (rest.type === 'function' && rest.procedure.type === 'path' && rest.procedure.steps.length === 1 && rest.procedure.steps[0].type === 'name' && result.steps[result.steps.length - 1].type === 'function') {
                                // next function in chain of functions - will override a thenable
                                result.steps[result.steps.length - 1].nextFunction = rest.procedure.steps[0].value;
                            }
                            if (rest.type !== 'path') {
                                rest = { type: 'path', steps: [rest] };
                            }
                            Array.prototype.push.apply(result.steps, rest.steps);
                            // any steps within a path that are string literals, should be changed to 'name'
                            result.steps.filter(function (step) {
                                if (step.type === 'number' || step.type === 'value') {
                                    // don't allow steps to be numbers or the values true/false/null
                                    throw {
                                        code: "S0213",
                                        stack: new Error().stack,
                                        position: step.position,
                                        value: step.value
                                    };
                                }
                                return step.type === 'string';
                            }).forEach(function (lit) {
                                lit.type = 'name';
                            });
                            // any step that signals keeping a singleton array, should be flagged on the path
                            if (result.steps.filter(function (step) {
                                return step.keepArray === true;
                            }).length > 0) {
                                result.keepSingletonArray = true;
                            }
                            // if first step is a path constructor, flag it for special handling
                            var firststep = result.steps[0];
                            if (firststep.type === 'unary' && firststep.value === '[') {
                                firststep.consarray = true;
                            }
                            // if the last step is an array constructor, flag it so it doesn't flatten
                            var laststep = result.steps[result.steps.length - 1];
                            if (laststep.type === 'unary' && laststep.value === '[') {
                                laststep.consarray = true;
                            }
                            break;
                        case '[':
                            // predicated step
                            // LHS is a step or a predicated step
                            // RHS is the predicate expr
                            result = ast_optimize(expr.lhs);
                            var step = result;
                            if (result.type === 'path') {
                                step = result.steps[result.steps.length - 1];
                            }
                            if (typeof step.group !== 'undefined') {
                                throw {
                                    code: "S0209",
                                    stack: new Error().stack,
                                    position: expr.position
                                };
                            }
                            if (typeof step.predicate === 'undefined') {
                                step.predicate = [];
                            }
                            step.predicate.push(ast_optimize(expr.rhs));
                            break;
                        case '{':
                            // group-by
                            // LHS is a step or a predicated step
                            // RHS is the object constructor expr
                            result = ast_optimize(expr.lhs);
                            if (typeof result.group !== 'undefined') {
                                throw {
                                    code: "S0210",
                                    stack: new Error().stack,
                                    position: expr.position
                                };
                            }
                            // object constructor - process each pair
                            result.group = {
                                lhs: expr.rhs.map(function (pair) {
                                    return [ast_optimize(pair[0]), ast_optimize(pair[1])];
                                }),
                                position: expr.position
                            };
                            break;
                        case '^':
                            // order-by
                            // LHS is the array to be ordered
                            // RHS defines the terms
                            result = { type: 'sort', value: expr.value, position: expr.position, consarray: true };
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = expr.rhs.map(function (terms) {
                                return {
                                    descending: terms.descending,
                                    expression: ast_optimize(terms.expression)
                                };
                            });
                            break;
                        case ':=':
                            result = { type: 'bind', value: expr.value, position: expr.position };
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = ast_optimize(expr.rhs);
                            break;
                        case '~>':
                            result = { type: 'apply', value: expr.value, position: expr.position };
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = ast_optimize(expr.rhs);
                            break;
                        default:
                            result = { type: expr.type, value: expr.value, position: expr.position };
                            result.lhs = ast_optimize(expr.lhs);
                            result.rhs = ast_optimize(expr.rhs);
                    }
                    break;
                case 'unary':
                    result = { type: expr.type, value: expr.value, position: expr.position };
                    if (expr.value === '[') {
                        // array constructor - process each item
                        result.expressions = expr.expressions.map(function (item) {
                            return ast_optimize(item);
                        });
                    } else if (expr.value === '{') {
                        // object constructor - process each pair
                        result.lhs = expr.lhs.map(function (pair) {
                            return [ast_optimize(pair[0]), ast_optimize(pair[1])];
                        });
                    } else {
                        // all other unary expressions - just process the expression
                        result.expression = ast_optimize(expr.expression);
                        // if unary minus on a number, then pre-process
                        if (expr.value === '-' && result.expression.type === 'number') {
                            result = result.expression;
                            result.value = -result.value;
                        }
                    }
                    break;
                case 'function':
                case 'partial':
                    result = { type: expr.type, name: expr.name, value: expr.value, position: expr.position };
                    result.arguments = expr.arguments.map(function (arg) {
                        return ast_optimize(arg);
                    });
                    result.procedure = ast_optimize(expr.procedure);
                    break;
                case 'lambda':
                    result = { type: expr.type, arguments: expr.arguments, signature: expr.signature, position: expr.position };
                    var body = ast_optimize(expr.body);
                    result.body = tail_call_optimize(body);
                    break;
                case 'condition':
                    result = { type: expr.type, position: expr.position };
                    result.condition = ast_optimize(expr.condition);
                    result.then = ast_optimize(expr.then);
                    if (typeof expr.else !== 'undefined') {
                        result.else = ast_optimize(expr.else);
                    }
                    break;
                case 'transform':
                    result = { type: expr.type, position: expr.position };
                    result.pattern = ast_optimize(expr.pattern);
                    result.update = ast_optimize(expr.update);
                    if (typeof expr.delete !== 'undefined') {
                        result.delete = ast_optimize(expr.delete);
                    }
                    break;
                case 'block':
                    result = { type: expr.type, position: expr.position };
                    // array of expressions - process each one
                    result.expressions = expr.expressions.map(function (item) {
                        var part = ast_optimize(item);
                        if (part.consarray || part.type === 'path' && part.steps[0].consarray) {
                            result.consarray = true;
                        }
                        return part;
                    });
                    // TODO scan the array of expressions to see if any of them assign variables
                    // if so, need to mark the block as one that needs to create a new frame
                    break;
                case 'name':
                    result = { type: 'path', steps: [expr] };
                    if (expr.keepArray) {
                        result.keepSingletonArray = true;
                    }
                    break;
                case 'string':
                case 'number':
                case 'value':
                case 'wildcard':
                case 'descendant':
                case 'variable':
                case 'regex':
                    result = expr;
                    break;
                case 'operator':
                    // the tokens 'and' and 'or' might have been used as a name rather than an operator
                    if (expr.value === 'and' || expr.value === 'or' || expr.value === 'in') {
                        expr.type = 'name';
                        result = ast_optimize(expr);
                    } else /* istanbul ignore else */if (expr.value === '?') {
                            // partial application
                            result = expr;
                        } else {
                            throw {
                                code: "S0201",
                                stack: new Error().stack,
                                position: expr.position,
                                token: expr.value
                            };
                        }
                    break;
                case 'error':
                    result = expr;
                    if (expr.lhs) {
                        result = ast_optimize(expr.lhs);
                    }
                    break;
                default:
                    var code = "S0206";
                    /* istanbul ignore else */
                    if (expr.id === '(end)') {
                        code = "S0207";
                    }
                    var err = {
                        code: code,
                        position: expr.position,
                        token: expr.value
                    };
                    if (recover) {
                        errors.push(err);
                        return { type: 'error', error: err };
                    } else {
                        err.stack = new Error().stack;
                        throw err;
                    }
            }
            return result;
        };

        // now invoke the tokenizer and the parser and return the syntax tree
        lexer = tokenizer(source);
        advance();
        // parse the tokens
        var expr = expression(0);
        if (node.id !== '(end)') {
            var err = {
                code: "S0201",
                position: node.position,
                token: node.value
            };
            handleError(err);
        }
        expr = ast_optimize(expr);

        if (errors.length > 0) {
            expr.errors = errors;
        }

        return expr;
    };

    // Start of Evaluator code

    var staticFrame = createFrame(null);

    /**
     * Check if value is a finite number
     * @param {float} n - number to evaluate
     * @returns {boolean} True if n is a finite number
     */
    function isNumeric(n) {
        var isNum = false;
        if (typeof n === 'number') {
            isNum = !isNaN(n);
            if (isNum && !isFinite(n)) {
                throw {
                    code: "D1001",
                    value: n,
                    stack: new Error().stack
                };
            }
        }
        return isNum;
    }

    /**
     * Returns true if the arg is an array of strings
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of strings
     */
    function isArrayOfStrings(arg) {
        var result = false;
        /* istanbul ignore else */
        if (Array.isArray(arg)) {
            result = arg.filter(function (item) {
                return typeof item !== 'string';
            }).length === 0;
        }
        return result;
    }

    /**
     * Returns true if the arg is an array of numbers
     * @param {*} arg - the item to test
     * @returns {boolean} True if arg is an array of numbers
     */
    function isArrayOfNumbers(arg) {
        var result = false;
        if (Array.isArray(arg)) {
            result = arg.filter(function (item) {
                return !isNumeric(item);
            }).length === 0;
        }
        return result;
    }

    // Polyfill
    /* istanbul ignore next */
    Number.isInteger = _isInteger2.default || function (value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };

    /**
     * Evaluate expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function _evaluate(expr, input, environment) {
        var result, entryCallback, exitCallback;
        return _regenerator2.default.wrap(function evaluate$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        entryCallback = environment.lookup('__evaluate_entry');

                        if (entryCallback) {
                            entryCallback(expr, input, environment);
                        }

                        _context.t0 = expr.type;
                        _context.next = _context.t0 === 'path' ? 5 : _context.t0 === 'binary' ? 8 : _context.t0 === 'unary' ? 11 : _context.t0 === 'name' ? 14 : _context.t0 === 'string' ? 16 : _context.t0 === 'number' ? 16 : _context.t0 === 'value' ? 16 : _context.t0 === 'wildcard' ? 18 : _context.t0 === 'descendant' ? 20 : _context.t0 === 'condition' ? 22 : _context.t0 === 'block' ? 25 : _context.t0 === 'bind' ? 28 : _context.t0 === 'regex' ? 31 : _context.t0 === 'function' ? 33 : _context.t0 === 'variable' ? 36 : _context.t0 === 'lambda' ? 38 : _context.t0 === 'partial' ? 40 : _context.t0 === 'apply' ? 43 : _context.t0 === 'sort' ? 46 : _context.t0 === 'transform' ? 49 : 51;
                        break;

                    case 5:
                        return _context.delegateYield(evaluatePath(expr, input, environment), 't1', 6);

                    case 6:
                        result = _context.t1;
                        return _context.abrupt('break', 51);

                    case 8:
                        return _context.delegateYield(evaluateBinary(expr, input, environment), 't2', 9);

                    case 9:
                        result = _context.t2;
                        return _context.abrupt('break', 51);

                    case 11:
                        return _context.delegateYield(evaluateUnary(expr, input, environment), 't3', 12);

                    case 12:
                        result = _context.t3;
                        return _context.abrupt('break', 51);

                    case 14:
                        result = evaluateName(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 16:
                        result = evaluateLiteral(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 18:
                        result = evaluateWildcard(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 20:
                        result = evaluateDescendants(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 22:
                        return _context.delegateYield(evaluateCondition(expr, input, environment), 't4', 23);

                    case 23:
                        result = _context.t4;
                        return _context.abrupt('break', 51);

                    case 25:
                        return _context.delegateYield(evaluateBlock(expr, input, environment), 't5', 26);

                    case 26:
                        result = _context.t5;
                        return _context.abrupt('break', 51);

                    case 28:
                        return _context.delegateYield(evaluateBindExpression(expr, input, environment), 't6', 29);

                    case 29:
                        result = _context.t6;
                        return _context.abrupt('break', 51);

                    case 31:
                        result = evaluateRegex(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 33:
                        return _context.delegateYield(evaluateFunction(expr, input, environment), 't7', 34);

                    case 34:
                        result = _context.t7;
                        return _context.abrupt('break', 51);

                    case 36:
                        result = evaluateVariable(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 38:
                        result = evaluateLambda(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 40:
                        return _context.delegateYield(evaluatePartialApplication(expr, input, environment), 't8', 41);

                    case 41:
                        result = _context.t8;
                        return _context.abrupt('break', 51);

                    case 43:
                        return _context.delegateYield(evaluateApplyExpression(expr, input, environment), 't9', 44);

                    case 44:
                        result = _context.t9;
                        return _context.abrupt('break', 51);

                    case 46:
                        return _context.delegateYield(evaluateSortExpression(expr, input, environment), 't10', 47);

                    case 47:
                        result = _context.t10;
                        return _context.abrupt('break', 51);

                    case 49:
                        result = evaluateTransformExpression(expr, input, environment);
                        return _context.abrupt('break', 51);

                    case 51:

                        if (environment.lookup('__jsonata_async') && (typeof result === 'undefined' || result === null || typeof result.then !== 'function')) {
                            result = _promise2.default.resolve(result);
                        }

                        if (!(environment.lookup('__jsonata_async') && typeof result.then === 'function' && expr.nextFunction && typeof result[expr.nextFunction] === 'function')) {
                            _context.next = 55;
                            break;
                        }

                        _context.next = 58;
                        break;

                    case 55:
                        _context.next = 57;
                        return result;

                    case 57:
                        result = _context.sent;

                    case 58:
                        if (!expr.hasOwnProperty('predicate')) {
                            _context.next = 61;
                            break;
                        }

                        return _context.delegateYield(applyPredicates(expr.predicate, result, environment), 't11', 60);

                    case 60:
                        result = _context.t11;

                    case 61:
                        if (!expr.hasOwnProperty('group')) {
                            _context.next = 64;
                            break;
                        }

                        return _context.delegateYield(evaluateGroupExpression(expr.group, result, environment), 't12', 63);

                    case 63:
                        result = _context.t12;

                    case 64:
                        exitCallback = environment.lookup('__evaluate_exit');

                        if (exitCallback) {
                            exitCallback(expr, input, environment, result);
                        }

                        if (result && result.sequence) {
                            result = result.value();
                        }

                        return _context.abrupt('return', result);

                    case 68:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _marked, this);
    }

    /**
     * Create an empty sequence to contain query results
     * @returns {Array} - empty sequence
     */
    function createSequence() {
        var sequence = toSequence([]);
        if (arguments.length === 1) {
            sequence.push(arguments[0]);
        }
        return sequence;
    }

    /**
     * Converts an array to a result sequence (by adding special properties)
     * @param {Array} arr - the array to convert
     * @returns {*} - the sequence
     */
    function toSequence(arr) {
        Object.defineProperty(arr, 'sequence', {
            enumerable: false,
            configurable: false,
            get: function get() {
                return true;
            }
        });
        Object.defineProperty(arr, 'keepSingleton', {
            enumerable: false,
            configurable: false,
            writable: true,
            value: false
        });
        Object.defineProperty(arr, 'value', {
            enumerable: false,
            configurable: false,
            get: function get() {
                return function () {
                    switch (this.length) {
                        case 0:
                            return undefined;
                        case 1:
                            return this.keepSingleton ? this : this[0];
                        default:
                            return this;
                    }
                };
            }
        });
        return arr;
    }

    /**
     * Evaluate path expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluatePath(expr, input, environment) {
        var inputSequence, resultSequence, ii, step;
        return _regenerator2.default.wrap(function evaluatePath$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // expr is an array of steps
                        // if the first step is a variable reference ($...), including root reference ($$),
                        //   then the path is absolute rather than relative
                        if (expr.steps[0].type === 'variable') {
                            inputSequence = createSequence(input); // dummy singleton sequence for first (absolute) step
                        } else if (Array.isArray(input)) {
                            inputSequence = input;
                        } else {
                            // if input is not an array, make it so
                            inputSequence = createSequence(input);
                        }

                        ii = 0;

                    case 2:
                        if (!(ii < expr.steps.length)) {
                            _context2.next = 18;
                            break;
                        }

                        step = expr.steps[ii];

                        // if the first step is an explicit array constructor, then just evaluate that (i.e. don't iterate over a context array)

                        if (!(ii === 0 && step.consarray)) {
                            _context2.next = 10;
                            break;
                        }

                        return _context2.delegateYield(_evaluate(step, inputSequence, environment), 't0', 6);

                    case 6:
                        resultSequence = _context2.t0;

                        if (!Array.isArray(resultSequence)) {
                            resultSequence = createSequence(resultSequence);
                        }
                        _context2.next = 12;
                        break;

                    case 10:
                        return _context2.delegateYield(evaluateStep(step, inputSequence, environment, ii === expr.steps.length - 1), 't1', 11);

                    case 11:
                        resultSequence = _context2.t1;

                    case 12:
                        if (!(typeof resultSequence === 'undefined' || resultSequence.length === 0)) {
                            _context2.next = 14;
                            break;
                        }

                        return _context2.abrupt('break', 18);

                    case 14:
                        inputSequence = resultSequence;

                    case 15:
                        ii++;
                        _context2.next = 2;
                        break;

                    case 18:

                        if (expr.keepSingletonArray) {
                            resultSequence.keepSingleton = true;
                        }

                        return _context2.abrupt('return', resultSequence);

                    case 20:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _marked2, this);
    }

    /**
     * Evaluate a step within a path
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @param {boolean} lastStep - flag the last step in a path
     * @returns {*} Evaluated input data
     */
    function evaluateStep(expr, input, environment, lastStep) {
        var result, ii, res, resultSequence;
        return _regenerator2.default.wrap(function evaluateStep$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        result = createSequence();
                        ii = 0;

                    case 2:
                        if (!(ii < input.length)) {
                            _context3.next = 9;
                            break;
                        }

                        return _context3.delegateYield(_evaluate(expr, input[ii], environment), 't0', 4);

                    case 4:
                        res = _context3.t0;

                        if (typeof res !== 'undefined') {
                            result.push(res);
                        }

                    case 6:
                        ii++;
                        _context3.next = 2;
                        break;

                    case 9:
                        resultSequence = createSequence();

                        if (lastStep && result.length === 1 && Array.isArray(result[0]) && !result[0].sequence) {
                            resultSequence = result[0];
                        } else {
                            // flatten the sequence
                            result.forEach(function (res) {
                                if (!Array.isArray(res) || res.cons || res.keepSingleton) {
                                    // it's not an array - just push into the result sequence
                                    resultSequence.push(res);
                                } else {
                                    // res is a sequence - flatten it into the parent sequence
                                    Array.prototype.push.apply(resultSequence, res);
                                }
                            });
                        }

                        return _context3.abrupt('return', resultSequence);

                    case 12:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _marked3, this);
    }

    /**
     * Apply predicates to input data
     * @param {Object} predicates - Predicates
     * @param {Object} input - Input data to apply predicates against
     * @param {Object} environment - Environment
     * @returns {*} Result after applying predicates
     */
    function applyPredicates(predicates, input, environment) {
        var inputSequence, results, ii, predicate, index;
        return _regenerator2.default.wrap(function applyPredicates$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        inputSequence = input;
                        // lhs potentially holds an array
                        // we want to iterate over the array, and only keep the items that are
                        // truthy when applied to the predicate.
                        // if the predicate evaluates to an integer, then select that index

                        results = createSequence();
                        ii = 0;

                    case 3:
                        if (!(ii < predicates.length)) {
                            _context4.next = 19;
                            break;
                        }

                        predicate = predicates[ii];
                        // if it's not an array, turn it into one
                        // since in XPath >= 2.0 an item is equivalent to a singleton sequence of that item
                        // if input is not an array, make it so

                        if (!Array.isArray(inputSequence)) {
                            inputSequence = createSequence(inputSequence);
                        }
                        results = createSequence();

                        if (!(predicate.type === 'number')) {
                            _context4.next = 13;
                            break;
                        }

                        index = Math.floor(predicate.value); // round it down

                        if (index < 0) {
                            // count in from end of array
                            index = inputSequence.length + index;
                        }
                        results = inputSequence[index];
                        _context4.next = 15;
                        break;

                    case 13:
                        return _context4.delegateYield(evaluateFilter(predicate, inputSequence, environment), 't0', 14);

                    case 14:
                        results = _context4.t0;

                    case 15:
                        inputSequence = results;

                    case 16:
                        ii++;
                        _context4.next = 3;
                        break;

                    case 19:
                        return _context4.abrupt('return', results);

                    case 20:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _marked4, this);
    }

    /**
     * Apply filter predicate to input data
     * @param {Object} predicate - filter expression
     * @param {Object} input - Input data to apply predicates against
     * @param {Object} environment - Environment
     * @returns {*} Result after applying predicates
     */
    function evaluateFilter(predicate, input, environment) {
        var results, index, item, res;
        return _regenerator2.default.wrap(function evaluateFilter$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        results = createSequence();
                        index = 0;

                    case 2:
                        if (!(index < input.length)) {
                            _context5.next = 11;
                            break;
                        }

                        item = input[index];
                        return _context5.delegateYield(_evaluate(predicate, item, environment), 't0', 5);

                    case 5:
                        res = _context5.t0;

                        if (isNumeric(res)) {
                            res = [res];
                        }
                        if (isArrayOfNumbers(res)) {
                            res.forEach(function (ires) {
                                // round it down
                                var ii = Math.floor(ires);
                                if (ii < 0) {
                                    // count in from end of array
                                    ii = input.length + ii;
                                }
                                if (ii === index) {
                                    results.push(item);
                                }
                            });
                        } else if (functionBoolean(res)) {
                            // truthy
                            results.push(item);
                        }

                    case 8:
                        index++;
                        _context5.next = 2;
                        break;

                    case 11:
                        return _context5.abrupt('return', results);

                    case 12:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _marked5, this);
    }

    /**
     * Evaluate binary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateBinary(expr, input, environment) {
        var result, lhs, rhs, op;
        return _regenerator2.default.wrap(function evaluateBinary$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        return _context6.delegateYield(_evaluate(expr.lhs, input, environment), 't0', 1);

                    case 1:
                        lhs = _context6.t0;
                        return _context6.delegateYield(_evaluate(expr.rhs, input, environment), 't1', 3);

                    case 3:
                        rhs = _context6.t1;
                        op = expr.value;
                        _context6.prev = 5;
                        _context6.t2 = op;
                        _context6.next = _context6.t2 === '+' ? 9 : _context6.t2 === '-' ? 9 : _context6.t2 === '*' ? 9 : _context6.t2 === '/' ? 9 : _context6.t2 === '%' ? 9 : _context6.t2 === '=' ? 11 : _context6.t2 === '!=' ? 11 : _context6.t2 === '<' ? 11 : _context6.t2 === '<=' ? 11 : _context6.t2 === '>' ? 11 : _context6.t2 === '>=' ? 11 : _context6.t2 === '&' ? 13 : _context6.t2 === 'and' ? 15 : _context6.t2 === 'or' ? 15 : _context6.t2 === '..' ? 17 : _context6.t2 === 'in' ? 19 : 21;
                        break;

                    case 9:
                        result = evaluateNumericExpression(lhs, rhs, op);
                        return _context6.abrupt('break', 21);

                    case 11:
                        result = evaluateComparisonExpression(lhs, rhs, op);
                        return _context6.abrupt('break', 21);

                    case 13:
                        result = evaluateStringConcat(lhs, rhs);
                        return _context6.abrupt('break', 21);

                    case 15:
                        result = evaluateBooleanExpression(lhs, rhs, op);
                        return _context6.abrupt('break', 21);

                    case 17:
                        result = evaluateRangeExpression(lhs, rhs);
                        return _context6.abrupt('break', 21);

                    case 19:
                        result = evaluateIncludesExpression(lhs, rhs);
                        return _context6.abrupt('break', 21);

                    case 21:
                        _context6.next = 28;
                        break;

                    case 23:
                        _context6.prev = 23;
                        _context6.t3 = _context6['catch'](5);

                        _context6.t3.position = expr.position;
                        _context6.t3.token = op;
                        throw _context6.t3;

                    case 28:
                        return _context6.abrupt('return', result);

                    case 29:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _marked6, this, [[5, 23]]);
    }

    /**
     * Evaluate unary expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateUnary(expr, input, environment) {
        var result, ii, item, value;
        return _regenerator2.default.wrap(function evaluateUnary$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.t0 = expr.value;
                        _context7.next = _context7.t0 === '-' ? 3 : _context7.t0 === '[' ? 15 : _context7.t0 === '{' ? 27 : 30;
                        break;

                    case 3:
                        return _context7.delegateYield(_evaluate(expr.expression, input, environment), 't1', 4);

                    case 4:
                        result = _context7.t1;

                        if (!(typeof result === 'undefined')) {
                            _context7.next = 9;
                            break;
                        }

                        result = undefined;
                        _context7.next = 14;
                        break;

                    case 9:
                        if (!isNumeric(result)) {
                            _context7.next = 13;
                            break;
                        }

                        result = -result;
                        _context7.next = 14;
                        break;

                    case 13:
                        throw {
                            code: "D1002",
                            stack: new Error().stack,
                            position: expr.position,
                            token: expr.value,
                            value: result
                        };

                    case 14:
                        return _context7.abrupt('break', 30);

                    case 15:
                        // array constructor - evaluate each item
                        result = [];
                        ii = 0;

                    case 17:
                        if (!(ii < expr.expressions.length)) {
                            _context7.next = 25;
                            break;
                        }

                        item = expr.expressions[ii];
                        return _context7.delegateYield(_evaluate(item, input, environment), 't2', 20);

                    case 20:
                        value = _context7.t2;

                        if (typeof value !== 'undefined') {
                            if (item.value === '[') {
                                result.push(value);
                            } else {
                                result = functionAppend(result, value);
                            }
                        }

                    case 22:
                        ii++;
                        _context7.next = 17;
                        break;

                    case 25:
                        if (expr.consarray) {
                            Object.defineProperty(result, 'cons', {
                                enumerable: false,
                                configurable: false,
                                value: true
                            });
                        }
                        return _context7.abrupt('break', 30);

                    case 27:
                        return _context7.delegateYield(evaluateGroupExpression(expr, input, environment), 't3', 28);

                    case 28:
                        result = _context7.t3;
                        return _context7.abrupt('break', 30);

                    case 30:
                        return _context7.abrupt('return', result);

                    case 31:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _marked7, this);
    }

    /**
     * Evaluate name object against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateName(expr, input, environment) {
        // lookup the 'name' item in the input
        var result;
        if (Array.isArray(input)) {
            result = createSequence();
            for (var ii = 0; ii < input.length; ii++) {
                var res = evaluateName(expr, input[ii], environment);
                if (typeof res !== 'undefined') {
                    result.push(res);
                }
            }
        } else if (input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
            result = input[expr.value];
        }
        return result;
    }

    /**
     * Evaluate literal against input data
     * @param {Object} expr - JSONata expression
     * @returns {*} Evaluated input data
     */
    function evaluateLiteral(expr) {
        return expr.value;
    }

    /**
     * Evaluate wildcard against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateWildcard(expr, input) {
        var results = createSequence();
        if (input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
            (0, _keys2.default)(input).forEach(function (key) {
                var value = input[key];
                if (Array.isArray(value)) {
                    value = flatten(value);
                    results = functionAppend(results, value);
                } else {
                    results.push(value);
                }
            });
        }

        //        result = normalizeSequence(results);
        return results;
    }

    /**
     * Returns a flattened array
     * @param {Array} arg - the array to be flatten
     * @param {Array} flattened - carries the flattened array - if not defined, will initialize to []
     * @returns {Array} - the flattened array
     */
    function flatten(arg, flattened) {
        if (typeof flattened === 'undefined') {
            flattened = [];
        }
        if (Array.isArray(arg)) {
            arg.forEach(function (item) {
                flatten(item, flattened);
            });
        } else {
            flattened.push(arg);
        }
        return flattened;
    }

    /**
     * Evaluate descendants against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @returns {*} Evaluated input data
     */
    function evaluateDescendants(expr, input) {
        var result;
        var resultSequence = createSequence();
        if (typeof input !== 'undefined') {
            // traverse all descendants of this object/array
            recurseDescendants(input, resultSequence);
            if (resultSequence.length === 1) {
                result = resultSequence[0];
            } else {
                result = resultSequence;
            }
        }
        return result;
    }

    /**
     * Recurse through descendants
     * @param {Object} input - Input data
     * @param {Object} results - Results
     */
    function recurseDescendants(input, results) {
        // this is the equivalent of //* in XPath
        if (!Array.isArray(input)) {
            results.push(input);
        }
        if (Array.isArray(input)) {
            input.forEach(function (member) {
                recurseDescendants(member, results);
            });
        } else if (input !== null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
            (0, _keys2.default)(input).forEach(function (key) {
                recurseDescendants(input[key], results);
            });
        }
    }

    /**
     * Evaluate numeric expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateNumericExpression(lhs, rhs, op) {
        var result;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        if (!isNumeric(lhs)) {
            throw {
                code: "T2001",
                stack: new Error().stack,
                value: lhs
            };
        }
        if (!isNumeric(rhs)) {
            throw {
                code: "T2002",
                stack: new Error().stack,
                value: rhs
            };
        }

        switch (op) {
            case '+':
                result = lhs + rhs;
                break;
            case '-':
                result = lhs - rhs;
                break;
            case '*':
                result = lhs * rhs;
                break;
            case '/':
                result = lhs / rhs;
                break;
            case '%':
                result = lhs % rhs;
                break;
        }
        return result;
    }

    /**
     * Evaluate comparison expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateComparisonExpression(lhs, rhs, op) {
        var result;

        // type checks
        var ltype = typeof lhs === 'undefined' ? 'undefined' : _typeof(lhs);
        var rtype = typeof rhs === 'undefined' ? 'undefined' : _typeof(rhs);

        if (ltype === 'undefined' || rtype === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        var validate = function validate() {
            // if aa or bb are not string or numeric values, then throw an error
            if (!(ltype === 'string' || ltype === 'number') || !(rtype === 'string' || rtype === 'number')) {
                throw {
                    code: "T2010",
                    stack: new Error().stack,
                    value: !(ltype === 'string' || ltype === 'number') ? lhs : rhs
                };
            }

            //if aa and bb are not of the same type
            if (ltype !== rtype) {
                throw {
                    code: "T2009",
                    stack: new Error().stack,
                    value: lhs,
                    value2: rhs
                };
            }
        };

        switch (op) {
            case '=':
                result = lhs === rhs;
                break;
            case '!=':
                result = lhs !== rhs;
                break;
            case '<':
                validate();
                result = lhs < rhs;
                break;
            case '<=':
                validate();
                result = lhs <= rhs;
                break;
            case '>':
                validate();
                result = lhs > rhs;
                break;
            case '>=':
                validate();
                result = lhs >= rhs;
                break;
        }
        return result;
    }

    /**
     * Inclusion operator - in
     *
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {boolean} - true if lhs is a member of rhs
     */
    function evaluateIncludesExpression(lhs, rhs) {
        var result = false;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is false
            return false;
        }

        if (!Array.isArray(rhs)) {
            rhs = [rhs];
        }

        for (var i = 0; i < rhs.length; i++) {
            if (rhs[i] === lhs) {
                result = true;
                break;
            }
        }

        return result;
    }

    /**
     * Evaluate boolean expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @param {Object} op - opcode
     * @returns {*} Result
     */
    function evaluateBooleanExpression(lhs, rhs, op) {
        var result;

        switch (op) {
            case 'and':
                result = functionBoolean(lhs) && functionBoolean(rhs);
                break;
            case 'or':
                result = functionBoolean(lhs) || functionBoolean(rhs);
                break;
        }
        return result;
    }

    /**
     * Evaluate string concatenation against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {string|*} Concatenated string
     */
    function evaluateStringConcat(lhs, rhs) {
        var result;

        var lstr = '';
        var rstr = '';
        if (typeof lhs !== 'undefined') {
            lstr = functionString(lhs);
        }
        if (typeof rhs !== 'undefined') {
            rstr = functionString(rhs);
        }

        result = lstr.concat(rstr);
        return result;
    }

    /**
     * Evaluate group expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{}} Evaluated input data
     */
    function evaluateGroupExpression(expr, input, environment) {
        var result, groups, itemIndex, item, pairIndex, pair, key, entry, value;
        return _regenerator2.default.wrap(function evaluateGroupExpression$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        result = {};
                        groups = {};
                        // group the input sequence by 'key' expression

                        if (!Array.isArray(input)) {
                            input = createSequence(input);
                        }

                        itemIndex = 0;

                    case 4:
                        if (!(itemIndex < input.length)) {
                            _context8.next = 27;
                            break;
                        }

                        item = input[itemIndex];
                        pairIndex = 0;

                    case 7:
                        if (!(pairIndex < expr.lhs.length)) {
                            _context8.next = 24;
                            break;
                        }

                        pair = expr.lhs[pairIndex];
                        return _context8.delegateYield(_evaluate(pair[0], item, environment), 't0', 10);

                    case 10:
                        key = _context8.t0;

                        if (!(typeof key !== 'string')) {
                            _context8.next = 13;
                            break;
                        }

                        throw {
                            code: "T1003",
                            stack: new Error().stack,
                            position: expr.position,
                            value: key
                        };

                    case 13:
                        entry = { data: item, exprIndex: pairIndex };

                        if (!groups.hasOwnProperty(key)) {
                            _context8.next = 20;
                            break;
                        }

                        if (!(groups[key].exprIndex !== pairIndex)) {
                            _context8.next = 17;
                            break;
                        }

                        throw {
                            code: "D1009",
                            stack: new Error().stack,
                            position: expr.position,
                            value: key
                        };

                    case 17:

                        // append it as an array
                        groups[key].data = functionAppend(groups[key].data, item);
                        _context8.next = 21;
                        break;

                    case 20:
                        groups[key] = entry;

                    case 21:
                        pairIndex++;
                        _context8.next = 7;
                        break;

                    case 24:
                        itemIndex++;
                        _context8.next = 4;
                        break;

                    case 27:
                        _context8.t1 = _regenerator2.default.keys(groups);

                    case 28:
                        if ((_context8.t2 = _context8.t1()).done) {
                            _context8.next = 36;
                            break;
                        }

                        key = _context8.t2.value;

                        entry = groups[key];
                        return _context8.delegateYield(_evaluate(expr.lhs[entry.exprIndex][1], entry.data, environment), 't3', 32);

                    case 32:
                        value = _context8.t3;

                        if (typeof value !== 'undefined') {
                            result[key] = value;
                        }
                        _context8.next = 28;
                        break;

                    case 36:
                        return _context8.abrupt('return', result);

                    case 37:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _marked8, this);
    }

    /**
     * Evaluate range expression against input data
     * @param {Object} lhs - LHS value
     * @param {Object} rhs - RHS value
     * @returns {Array} Resultant array
     */
    function evaluateRangeExpression(lhs, rhs) {
        var result;

        if (typeof lhs === 'undefined' || typeof rhs === 'undefined') {
            // if either side is undefined, the result is undefined
            return result;
        }

        if (lhs > rhs) {
            // if the lhs is greater than the rhs, return undefined
            return result;
        }

        if (!(0, _isInteger2.default)(lhs)) {
            throw {
                code: "T2003",
                stack: new Error().stack,
                value: lhs
            };
        }
        if (!(0, _isInteger2.default)(rhs)) {
            throw {
                code: "T2004",
                stack: new Error().stack,
                value: rhs
            };
        }

        result = new Array(rhs - lhs + 1);
        for (var item = lhs, index = 0; item <= rhs; item++, index++) {
            result[index] = item;
        }
        return toSequence(result);
    }

    /**
     * Evaluate bind expression against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateBindExpression(expr, input, environment) {
        var value;
        return _regenerator2.default.wrap(function evaluateBindExpression$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        return _context9.delegateYield(_evaluate(expr.rhs, input, environment), 't0', 1);

                    case 1:
                        value = _context9.t0;

                        environment.bind(expr.lhs.value, value);
                        return _context9.abrupt('return', value);

                    case 4:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _marked9, this);
    }

    /**
     * Evaluate condition against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateCondition(expr, input, environment) {
        var result, condition;
        return _regenerator2.default.wrap(function evaluateCondition$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        return _context10.delegateYield(_evaluate(expr.condition, input, environment), 't0', 1);

                    case 1:
                        condition = _context10.t0;

                        if (!functionBoolean(condition)) {
                            _context10.next = 7;
                            break;
                        }

                        return _context10.delegateYield(_evaluate(expr.then, input, environment), 't1', 4);

                    case 4:
                        result = _context10.t1;
                        _context10.next = 10;
                        break;

                    case 7:
                        if (!(typeof expr.else !== 'undefined')) {
                            _context10.next = 10;
                            break;
                        }

                        return _context10.delegateYield(_evaluate(expr.else, input, environment), 't2', 9);

                    case 9:
                        result = _context10.t2;

                    case 10:
                        return _context10.abrupt('return', result);

                    case 11:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _marked10, this);
    }

    /**
     * Evaluate block against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateBlock(expr, input, environment) {
        var result, frame, ii;
        return _regenerator2.default.wrap(function evaluateBlock$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        // create a new frame to limit the scope of variable assignments
                        // TODO, only do this if the post-parse stage has flagged this as required
                        frame = createFrame(environment);
                        // invoke each expression in turn
                        // only return the result of the last one

                        ii = 0;

                    case 2:
                        if (!(ii < expr.expressions.length)) {
                            _context11.next = 8;
                            break;
                        }

                        return _context11.delegateYield(_evaluate(expr.expressions[ii], input, frame), 't0', 4);

                    case 4:
                        result = _context11.t0;

                    case 5:
                        ii++;
                        _context11.next = 2;
                        break;

                    case 8:
                        return _context11.abrupt('return', result);

                    case 9:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _marked11, this);
    }

    /**
     * Prepare a regex
     * @param {Object} expr - expression containing regex
     * @returns {Function} Higher order function representing prepared regex
     */
    function evaluateRegex(expr) {
        var re = new RegExp(expr.value);
        var closure = function closure(str) {
            var result;
            var match = re.exec(str);
            if (match !== null) {
                result = {
                    match: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    groups: []
                };
                if (match.length > 1) {
                    for (var i = 1; i < match.length; i++) {
                        result.groups.push(match[i]);
                    }
                }
                result.next = function () {
                    if (re.lastIndex >= str.length) {
                        return undefined;
                    } else {
                        var next = closure(str);
                        if (next && next.match === '') {
                            // matches zero length string; this will never progress
                            throw {
                                code: "D1004",
                                stack: new Error().stack,
                                position: expr.position,
                                value: expr.value.source
                            };
                        }
                        return next;
                    }
                };
            }

            return result;
        };
        return closure;
    }

    /**
     * Evaluate the matcher function against the str arg
     *
     * @param {*} matcher - matching function (native or lambda)
     * @param {string} str - the string to match against
     * @returns {object} - structure that represents the match(es)
     */
    function evaluateMatcher(matcher, str) {
        var result;
        return _regenerator2.default.wrap(function evaluateMatcher$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        return _context12.delegateYield(apply(matcher, [str], null), 't0', 1);

                    case 1:
                        result = _context12.t0;

                        if (!(result && !(typeof result.start === 'number' || result.end === 'number' || Array.isArray(result.groups) || isFunction(result.next)))) {
                            _context12.next = 4;
                            break;
                        }

                        throw {
                            code: "T1010",
                            stack: new Error().stack
                        };

                    case 4:
                        return _context12.abrupt('return', result);

                    case 5:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _marked12, this);
    }

    /**
     * Evaluate variable against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateVariable(expr, input, environment) {
        // lookup the variable value in the environment
        var result;
        // if the variable name is empty string, then it refers to context value
        if (expr.value === '') {
            result = input;
        } else {
            result = environment.lookup(expr.value);
        }
        return result;
    }

    /**
     * sort / order-by operator
     * @param {Object} expr - AST for operator
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Ordered sequence
     */
    function evaluateSortExpression(expr, input, environment) {
        var result, lhs, comparator;
        return _regenerator2.default.wrap(function evaluateSortExpression$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        return _context14.delegateYield(_evaluate(expr.lhs, input, environment), 't0', 1);

                    case 1:
                        lhs = _context14.t0;


                        // sort the lhs array
                        // use comparator function
                        comparator = /*#__PURE__*/_regenerator2.default.mark(function comparator(a, b) {
                            var comp, index, term, aa, bb, atype, btype;
                            return _regenerator2.default.wrap(function comparator$(_context13) {
                                while (1) {
                                    switch (_context13.prev = _context13.next) {
                                        case 0:
                                            // eslint-disable-line require-yield
                                            // expr.rhs is an array of order-by in priority order
                                            comp = 0;
                                            index = 0;

                                        case 2:
                                            if (!(comp === 0 && index < expr.rhs.length)) {
                                                _context13.next = 29;
                                                break;
                                            }

                                            term = expr.rhs[index];
                                            //evaluate the rhs expression in the context of a

                                            return _context13.delegateYield(_evaluate(term.expression, a, environment), 't0', 5);

                                        case 5:
                                            aa = _context13.t0;
                                            return _context13.delegateYield(_evaluate(term.expression, b, environment), 't1', 7);

                                        case 7:
                                            bb = _context13.t1;


                                            // type checks
                                            atype = typeof aa === 'undefined' ? 'undefined' : _typeof(aa);
                                            btype = typeof bb === 'undefined' ? 'undefined' : _typeof(bb);
                                            // undefined should be last in sort order

                                            if (!(atype === 'undefined')) {
                                                _context13.next = 13;
                                                break;
                                            }

                                            // swap them, unless btype is also undefined
                                            comp = btype === 'undefined' ? 0 : 1;
                                            return _context13.abrupt('continue', 26);

                                        case 13:
                                            if (!(btype === 'undefined')) {
                                                _context13.next = 16;
                                                break;
                                            }

                                            comp = -1;
                                            return _context13.abrupt('continue', 26);

                                        case 16:
                                            if (!(!(atype === 'string' || atype === 'number') || !(btype === 'string' || btype === 'number'))) {
                                                _context13.next = 18;
                                                break;
                                            }

                                            throw {
                                                code: "T2008",
                                                stack: new Error().stack,
                                                position: expr.position,
                                                value: !(atype === 'string' || atype === 'number') ? aa : bb
                                            };

                                        case 18:
                                            if (!(atype !== btype)) {
                                                _context13.next = 20;
                                                break;
                                            }

                                            throw {
                                                code: "T2007",
                                                stack: new Error().stack,
                                                position: expr.position,
                                                value: aa,
                                                value2: bb
                                            };

                                        case 20:
                                            if (!(aa === bb)) {
                                                _context13.next = 24;
                                                break;
                                            }

                                            return _context13.abrupt('continue', 26);

                                        case 24:
                                            if (aa < bb) {
                                                comp = -1;
                                            } else {
                                                comp = 1;
                                            }

                                        case 25:
                                            if (term.descending === true) {
                                                comp = -comp;
                                            }

                                        case 26:
                                            index++;
                                            _context13.next = 2;
                                            break;

                                        case 29:
                                            return _context13.abrupt('return', comp === 1);

                                        case 30:
                                        case 'end':
                                            return _context13.stop();
                                    }
                                }
                            }, comparator, this);
                        });
                        return _context14.delegateYield(functionSort(lhs, comparator), 't1', 4);

                    case 4:
                        result = _context14.t1;
                        return _context14.abrupt('return', result);

                    case 6:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _marked13, this);
    }

    /**
     * create a transformer function
     * @param {Object} expr - AST for operator
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} tranformer function
     */
    function evaluateTransformExpression(expr, input, environment) {
        // create a function to implement the transform definition
        var transformer = /*#__PURE__*/_regenerator2.default.mark(function transformer(obj) {
            var cloneFunction, result, matches, ii, match, update, updateType, prop, deletions, val, jj;
            return _regenerator2.default.wrap(function transformer$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            if (!(typeof obj === 'undefined')) {
                                _context15.next = 2;
                                break;
                            }

                            return _context15.abrupt('return', undefined);

                        case 2:

                            // this function returns a copy of obj with changes specified by the pattern/operation
                            cloneFunction = environment.lookup('clone');

                            if (isFunction(cloneFunction)) {
                                _context15.next = 5;
                                break;
                            }

                            throw {
                                code: "T2013",
                                stack: new Error().stack,
                                position: expr.position
                            };

                        case 5:
                            return _context15.delegateYield(apply(cloneFunction, [obj], null), 't0', 6);

                        case 6:
                            result = _context15.t0;
                            return _context15.delegateYield(_evaluate(expr.pattern, result, environment), 't1', 8);

                        case 8:
                            matches = _context15.t1;

                            if (!(typeof matches !== 'undefined')) {
                                _context15.next = 33;
                                break;
                            }

                            if (!Array.isArray(matches)) {
                                matches = [matches];
                            }
                            ii = 0;

                        case 12:
                            if (!(ii < matches.length)) {
                                _context15.next = 33;
                                break;
                            }

                            match = matches[ii];
                            // evaluate the update value for each match

                            return _context15.delegateYield(_evaluate(expr.update, match, environment), 't2', 15);

                        case 15:
                            update = _context15.t2;

                            // update must be an object
                            updateType = typeof update === 'undefined' ? 'undefined' : _typeof(update);

                            if (!(updateType !== 'undefined')) {
                                _context15.next = 21;
                                break;
                            }

                            if (!(updateType !== 'object' || update === null)) {
                                _context15.next = 20;
                                break;
                            }

                            throw {
                                code: "T2011",
                                stack: new Error().stack,
                                position: expr.update.position,
                                value: update
                            };

                        case 20:
                            // merge the update
                            for (prop in update) {
                                match[prop] = update[prop];
                            }

                        case 21:
                            if (!(typeof expr.delete !== 'undefined')) {
                                _context15.next = 30;
                                break;
                            }

                            return _context15.delegateYield(_evaluate(expr.delete, match, environment), 't3', 23);

                        case 23:
                            deletions = _context15.t3;

                            if (!(typeof deletions !== 'undefined')) {
                                _context15.next = 30;
                                break;
                            }

                            val = deletions;

                            if (!Array.isArray(deletions)) {
                                deletions = [deletions];
                            }

                            if (isArrayOfStrings(deletions)) {
                                _context15.next = 29;
                                break;
                            }

                            throw {
                                code: "T2012",
                                stack: new Error().stack,
                                position: expr.delete.position,
                                value: val
                            };

                        case 29:
                            for (jj = 0; jj < deletions.length; jj++) {
                                delete match[deletions[jj]];
                            }

                        case 30:
                            ii++;
                            _context15.next = 12;
                            break;

                        case 33:
                            return _context15.abrupt('return', result);

                        case 34:
                        case 'end':
                            return _context15.stop();
                    }
                }
            }, transformer, this);
        });

        return defineFunction(transformer, '<(oa):o>');
    }

    var chainAST = parser('function($f, $g) { function($x){ $g($f($x)) } }');

    /**
     * Apply the function on the RHS using the sequence on the LHS as the first argument
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluateApplyExpression(expr, input, environment) {
        var result, lhs, func, chain;
        return _regenerator2.default.wrap(function evaluateApplyExpression$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        if (!(expr.rhs.type === 'function')) {
                            _context16.next = 7;
                            break;
                        }

                        // this is a function _invocation_; invoke it with lhs expression as the first argument
                        expr.rhs.arguments.unshift(expr.lhs);
                        return _context16.delegateYield(evaluateFunction(expr.rhs, input, environment), 't0', 3);

                    case 3:
                        result = _context16.t0;

                        expr.rhs.arguments.shift();
                        _context16.next = 22;
                        break;

                    case 7:
                        return _context16.delegateYield(_evaluate(expr.lhs, input, environment), 't1', 8);

                    case 8:
                        lhs = _context16.t1;
                        return _context16.delegateYield(_evaluate(expr.rhs, input, environment), 't2', 10);

                    case 10:
                        func = _context16.t2;

                        if (isFunction(func)) {
                            _context16.next = 13;
                            break;
                        }

                        throw {
                            code: "T2006",
                            stack: new Error().stack,
                            position: expr.position,
                            value: func
                        };

                    case 13:
                        if (!isFunction(lhs)) {
                            _context16.next = 20;
                            break;
                        }

                        return _context16.delegateYield(_evaluate(chainAST, null, environment), 't3', 15);

                    case 15:
                        chain = _context16.t3;
                        return _context16.delegateYield(apply(chain, [lhs, func], null), 't4', 17);

                    case 17:
                        result = _context16.t4;
                        _context16.next = 22;
                        break;

                    case 20:
                        return _context16.delegateYield(apply(func, [lhs], null), 't5', 21);

                    case 21:
                        result = _context16.t5;

                    case 22:
                        return _context16.abrupt('return', result);

                    case 23:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, _marked14, this);
    }

    /**
     *
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is a function (lambda or built-in)
     */
    function isFunction(arg) {
        return arg && (arg._jsonata_function === true || arg._jsonata_lambda === true) || typeof arg === 'function';
    }

    /**
     * Tests whether arg is a lambda function
     * @param {*} arg - the value to test
     * @returns {boolean} - true if it is a lambda function
     */
    function isLambda(arg) {
        return arg && arg._jsonata_lambda === true;
    }

    /**
     * @param {Object} arg - expression to test
     * @returns {boolean} - true if it is a generator i.e. the result from calling a
     * generator function
     */
    function isGenerator(arg) {
        return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null && (0, _isIterable3.default)(arg) && typeof arg[_iterator2.default] === 'function' && 'next' in arg && typeof arg.next === 'function';
    }

    /**
     * Evaluate function against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @param {Object} [applyto] - LHS of ~> operator
     * @returns {*} Evaluated input data
     */
    function evaluateFunction(expr, input, environment) {
        var result, proc, evaluatedArgs, jj;
        return _regenerator2.default.wrap(function evaluateFunction$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        return _context17.delegateYield(_evaluate(expr.procedure, input, environment), 't0', 1);

                    case 1:
                        proc = _context17.t0;

                        if (!(typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value))) {
                            _context17.next = 4;
                            break;
                        }

                        throw {
                            code: "T1005",
                            stack: new Error().stack,
                            position: expr.position,
                            token: expr.procedure.steps[0].value
                        };

                    case 4:
                        evaluatedArgs = [];
                        // eager evaluation - evaluate the arguments

                        jj = 0;

                    case 6:
                        if (!(jj < expr.arguments.length)) {
                            _context17.next = 14;
                            break;
                        }

                        _context17.t1 = evaluatedArgs;
                        return _context17.delegateYield(_evaluate(expr.arguments[jj], input, environment), 't2', 9);

                    case 9:
                        _context17.t3 = _context17.t2;

                        _context17.t1.push.call(_context17.t1, _context17.t3);

                    case 11:
                        jj++;
                        _context17.next = 6;
                        break;

                    case 14:
                        _context17.prev = 14;
                        return _context17.delegateYield(apply(proc, evaluatedArgs, input), 't4', 16);

                    case 16:
                        result = _context17.t4;
                        _context17.next = 24;
                        break;

                    case 19:
                        _context17.prev = 19;
                        _context17.t5 = _context17['catch'](14);

                        // add the position field to the error
                        _context17.t5.position = expr.position;
                        // and the function identifier
                        _context17.t5.token = expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value;
                        throw _context17.t5;

                    case 24:
                        return _context17.abrupt('return', result);

                    case 25:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _marked15, this, [[14, 19]]);
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} self - Self
     * @returns {*} Result of procedure
     */
    function apply(proc, args, self) {
        var result, next, evaluatedArgs, ii;
        return _regenerator2.default.wrap(function apply$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        return _context18.delegateYield(applyInner(proc, args, self), 't0', 1);

                    case 1:
                        result = _context18.t0;

                    case 2:
                        if (!(isLambda(result) && result.thunk === true)) {
                            _context18.next = 19;
                            break;
                        }

                        return _context18.delegateYield(_evaluate(result.body.procedure, result.input, result.environment), 't1', 4);

                    case 4:
                        next = _context18.t1;
                        evaluatedArgs = [];
                        ii = 0;

                    case 7:
                        if (!(ii < result.body.arguments.length)) {
                            _context18.next = 15;
                            break;
                        }

                        _context18.t2 = evaluatedArgs;
                        return _context18.delegateYield(_evaluate(result.body.arguments[ii], result.input, result.environment), 't3', 10);

                    case 10:
                        _context18.t4 = _context18.t3;

                        _context18.t2.push.call(_context18.t2, _context18.t4);

                    case 12:
                        ii++;
                        _context18.next = 7;
                        break;

                    case 15:
                        return _context18.delegateYield(applyInner(next, evaluatedArgs, self), 't5', 16);

                    case 16:
                        result = _context18.t5;
                        _context18.next = 2;
                        break;

                    case 19:
                        return _context18.abrupt('return', result);

                    case 20:
                    case 'end':
                        return _context18.stop();
                }
            }
        }, _marked16, this);
    }

    /**
     * Apply procedure or function
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @param {Object} self - Self
     * @returns {*} Result of procedure
     */
    function applyInner(proc, args, self) {
        var result, validatedArgs;
        return _regenerator2.default.wrap(function applyInner$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        validatedArgs = args;

                        if (proc) {
                            validatedArgs = validateArguments(proc.signature, args, self);
                        }

                        if (!isLambda(proc)) {
                            _context19.next = 7;
                            break;
                        }

                        return _context19.delegateYield(applyProcedure(proc, validatedArgs), 't0', 4);

                    case 4:
                        result = _context19.t0;
                        _context19.next = 22;
                        break;

                    case 7:
                        if (!(proc && proc._jsonata_function === true)) {
                            _context19.next = 14;
                            break;
                        }

                        result = proc.implementation.apply(self, validatedArgs);
                        // `proc.implementation` might be a generator function
                        // and `result` might be a generator - if so, yield

                        if (!isGenerator(result)) {
                            _context19.next = 12;
                            break;
                        }

                        return _context19.delegateYield(result, 't1', 11);

                    case 11:
                        result = _context19.t1;

                    case 12:
                        _context19.next = 22;
                        break;

                    case 14:
                        if (!(typeof proc === 'function')) {
                            _context19.next = 21;
                            break;
                        }

                        result = proc.apply(self, validatedArgs);
                        /* istanbul ignore next */

                        if (!isGenerator(result)) {
                            _context19.next = 19;
                            break;
                        }

                        return _context19.delegateYield(result, 't2', 18);

                    case 18:
                        result = _context19.t2;

                    case 19:
                        _context19.next = 22;
                        break;

                    case 21:
                        throw {
                            code: "T1006",
                            stack: new Error().stack
                        };

                    case 22:
                        return _context19.abrupt('return', result);

                    case 23:
                    case 'end':
                        return _context19.stop();
                }
            }
        }, _marked17, this);
    }

    /**
     * Evaluate lambda against input data
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {{lambda: boolean, input: *, environment: *, arguments: *, body: *}} Evaluated input data
     */
    function evaluateLambda(expr, input, environment) {
        // make a function (closure)
        var procedure = {
            _jsonata_lambda: true,
            input: input,
            environment: environment,
            arguments: expr.arguments,
            signature: expr.signature,
            body: expr.body
        };
        if (expr.thunk === true) {
            procedure.thunk = true;
        }
        return procedure;
    }

    /**
     * Evaluate partial application
     * @param {Object} expr - JSONata expression
     * @param {Object} input - Input data to evaluate against
     * @param {Object} environment - Environment
     * @returns {*} Evaluated input data
     */
    function evaluatePartialApplication(expr, input, environment) {
        var result, evaluatedArgs, ii, arg, proc;
        return _regenerator2.default.wrap(function evaluatePartialApplication$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        // evaluate the arguments
                        evaluatedArgs = [];
                        // partially apply a function

                        ii = 0;

                    case 2:
                        if (!(ii < expr.arguments.length)) {
                            _context20.next = 15;
                            break;
                        }

                        arg = expr.arguments[ii];

                        if (!(arg.type === 'operator' && arg.value === '?')) {
                            _context20.next = 8;
                            break;
                        }

                        evaluatedArgs.push(arg);
                        _context20.next = 12;
                        break;

                    case 8:
                        _context20.t0 = evaluatedArgs;
                        return _context20.delegateYield(_evaluate(arg, input, environment), 't1', 10);

                    case 10:
                        _context20.t2 = _context20.t1;

                        _context20.t0.push.call(_context20.t0, _context20.t2);

                    case 12:
                        ii++;
                        _context20.next = 2;
                        break;

                    case 15:
                        return _context20.delegateYield(_evaluate(expr.procedure, input, environment), 't3', 16);

                    case 16:
                        proc = _context20.t3;

                        if (!(typeof proc === 'undefined' && expr.procedure.type === 'path' && environment.lookup(expr.procedure.steps[0].value))) {
                            _context20.next = 19;
                            break;
                        }

                        throw {
                            code: "T1007",
                            stack: new Error().stack,
                            position: expr.position,
                            token: expr.procedure.steps[0].value
                        };

                    case 19:
                        if (!isLambda(proc)) {
                            _context20.next = 23;
                            break;
                        }

                        result = partialApplyProcedure(proc, evaluatedArgs);
                        _context20.next = 32;
                        break;

                    case 23:
                        if (!(proc && proc._jsonata_function === true)) {
                            _context20.next = 27;
                            break;
                        }

                        result = partialApplyNativeFunction(proc.implementation, evaluatedArgs);
                        _context20.next = 32;
                        break;

                    case 27:
                        if (!(typeof proc === 'function')) {
                            _context20.next = 31;
                            break;
                        }

                        result = partialApplyNativeFunction(proc, evaluatedArgs);
                        _context20.next = 32;
                        break;

                    case 31:
                        throw {
                            code: "T1008",
                            stack: new Error().stack,
                            position: expr.position,
                            token: expr.procedure.type === 'path' ? expr.procedure.steps[0].value : expr.procedure.value
                        };

                    case 32:
                        return _context20.abrupt('return', result);

                    case 33:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, _marked18, this);
    }

    /**
     * Validate the arguments against the signature validator (if it exists)
     * @param {Function} signature - validator function
     * @param {Array} args - function arguments
     * @param {*} context - context value
     * @returns {Array} - validated arguments
     */
    function validateArguments(signature, args, context) {
        if (typeof signature === 'undefined') {
            // nothing to validate
            return args;
        }
        var validatedArgs = signature.validate(args, context);
        return validatedArgs;
    }

    /**
     * Apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {*} Result of procedure
     */
    function applyProcedure(proc, args) {
        var result, env;
        return _regenerator2.default.wrap(function applyProcedure$(_context21) {
            while (1) {
                switch (_context21.prev = _context21.next) {
                    case 0:
                        env = createFrame(proc.environment);

                        proc.arguments.forEach(function (param, index) {
                            env.bind(param.value, args[index]);
                        });

                        if (!(typeof proc.body === 'function')) {
                            _context21.next = 7;
                            break;
                        }

                        return _context21.delegateYield(applyNativeFunction(proc.body, env), 't0', 4);

                    case 4:
                        result = _context21.t0;
                        _context21.next = 9;
                        break;

                    case 7:
                        return _context21.delegateYield(_evaluate(proc.body, proc.input, env), 't1', 8);

                    case 8:
                        result = _context21.t1;

                    case 9:
                        return _context21.abrupt('return', result);

                    case 10:
                    case 'end':
                        return _context21.stop();
                }
            }
        }, _marked19, this);
    }

    /**
     * Partially apply procedure
     * @param {Object} proc - Procedure
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applied procedure
     */
    function partialApplyProcedure(proc, args) {
        // create a closure, bind the supplied parameters and return a function that takes the remaining (?) parameters
        var env = createFrame(proc.environment);
        var unboundArgs = [];
        proc.arguments.forEach(function (param, index) {
            var arg = args[index];
            if (arg && arg.type === 'operator' && arg.value === '?') {
                unboundArgs.push(param);
            } else {
                env.bind(param.value, arg);
            }
        });
        var procedure = {
            _jsonata_lambda: true,
            input: proc.input,
            environment: env,
            arguments: unboundArgs,
            body: proc.body
        };
        return procedure;
    }

    /**
     * Partially apply native function
     * @param {Function} native - Native function
     * @param {Array} args - Arguments
     * @returns {{lambda: boolean, input: *, environment: {bind, lookup}, arguments: Array, body: *}} Result of partially applying native function
     */
    function partialApplyNativeFunction(native, args) {
        // create a lambda function that wraps and invokes the native function
        // get the list of declared arguments from the native function
        // this has to be picked out from the toString() value
        var sigArgs = getNativeFunctionArguments(native);
        sigArgs = sigArgs.map(function (sigArg) {
            return '$' + sigArg.trim();
        });
        var body = 'function(' + sigArgs.join(', ') + '){ _ }';

        var bodyAST = parser(body);
        bodyAST.body = native;

        var partial = partialApplyProcedure(bodyAST, args);
        return partial;
    }

    /**
     * Apply native function
     * @param {Object} proc - Procedure
     * @param {Object} env - Environment
     * @returns {*} Result of applying native function
     */
    function applyNativeFunction(proc, env) {
        var sigArgs, args, result;
        return _regenerator2.default.wrap(function applyNativeFunction$(_context22) {
            while (1) {
                switch (_context22.prev = _context22.next) {
                    case 0:
                        sigArgs = getNativeFunctionArguments(proc);
                        // generate the array of arguments for invoking the function - look them up in the environment

                        args = sigArgs.map(function (sigArg) {
                            return env.lookup(sigArg.trim());
                        });
                        result = proc.apply(null, args);

                        if (!isGenerator(result)) {
                            _context22.next = 6;
                            break;
                        }

                        return _context22.delegateYield(result, 't0', 5);

                    case 5:
                        result = _context22.t0;

                    case 6:
                        return _context22.abrupt('return', result);

                    case 7:
                    case 'end':
                        return _context22.stop();
                }
            }
        }, _marked20, this);
    }

    /**
     * Get native function arguments
     * @param {Function} func - Function
     * @returns {*|Array} Native function arguments
     */
    function getNativeFunctionArguments(func) {
        var signature = func.toString();
        var sigParens = /\(([^)]*)\)/.exec(signature)[1]; // the contents of the parens
        var sigArgs = sigParens.split(',');
        return sigArgs;
    }

    /**
     * Creates a function definition
     * @param {Function} func - function implementation in Javascript
     * @param {string} signature - JSONata function signature definition
     * @returns {{implementation: *, signature: *}} function definition
     */
    function defineFunction(func, signature) {
        var definition = {
            _jsonata_function: true,
            implementation: func
        };
        if (typeof signature !== 'undefined') {
            definition.signature = parseSignature(signature);
        }
        return definition;
    }

    /**
     * Sum function
     * @param {Object} args - Arguments
     * @returns {number} Total value of arguments
     */
    function functionSum(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined') {
            return undefined;
        }

        var total = 0;
        args.forEach(function (num) {
            total += num;
        });
        return total;
    }

    /**
     * Count function
     * @param {Object} args - Arguments
     * @returns {number} Number of elements in the array
     */
    function functionCount(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined') {
            return 0;
        }

        return args.length;
    }

    /**
     * Max function
     * @param {Object} args - Arguments
     * @returns {number} Max element in the array
     */
    function functionMax(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        return Math.max.apply(Math, args);
    }

    /**
     * Min function
     * @param {Object} args - Arguments
     * @returns {number} Min element in the array
     */
    function functionMin(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        return Math.min.apply(Math, args);
    }

    /**
     * Average function
     * @param {Object} args - Arguments
     * @returns {number} Average element in the array
     */
    function functionAverage(args) {
        // undefined inputs always return undefined
        if (typeof args === 'undefined' || args.length === 0) {
            return undefined;
        }

        var total = 0;
        args.forEach(function (num) {
            total += num;
        });
        return total / args.length;
    }

    /**
     * Stingify arguments
     * @param {Object} arg - Arguments
     * @returns {String} String from arguments
     */
    function functionString(arg) {
        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        var str;

        if (typeof arg === 'string') {
            // already a string
            str = arg;
        } else if (isFunction(arg)) {
            // functions (built-in and lambda convert to empty string
            str = '';
        } else if (typeof arg === 'number' && !isFinite(arg)) {
            throw {
                code: "D3001",
                value: arg,
                stack: new Error().stack
            };
        } else str = (0, _stringify2.default)(arg, function (key, val) {
            return typeof val !== 'undefined' && val !== null && val.toPrecision && isNumeric(val) ? Number(val.toPrecision(15)) : val && isFunction(val) ? '' : val;
        });
        return str;
    }

    /**
     * Create substring based on character number and length
     * @param {String} str - String to evaluate
     * @param {Integer} start - Character number to start substring
     * @param {Integer} [length] - Number of characters in substring
     * @returns {string|*} Substring
     */
    function functionSubstring(str, start, length) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var strArray = (0, _from2.default)(str);
        var strLength = strArray.length;

        if (strLength + start < 0) {
            start = 0;
        }

        if (typeof length !== 'undefined') {
            if (length <= 0) {
                return '';
            }
            var end = start >= 0 ? start + length : strLength + start + length;
            return strArray.slice(start, end).join('');
        }

        return strArray.slice(start).join('');
    }

    /**
     * Create substring up until a character
     * @param {String} str - String to evaluate
     * @param {String} chars - Character to define substring boundary
     * @returns {*} Substring
     */
    function functionSubstringBefore(str, chars) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var pos = str.indexOf(chars);
        if (pos > -1) {
            return str.substr(0, pos);
        } else {
            return str;
        }
    }

    /**
     * Create substring after a character
     * @param {String} str - String to evaluate
     * @param {String} chars - Character to define substring boundary
     * @returns {*} Substring
     */
    function functionSubstringAfter(str, chars) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        var pos = str.indexOf(chars);
        if (pos > -1) {
            return str.substr(pos + chars.length);
        } else {
            return str;
        }
    }

    /**
     * Lowercase a string
     * @param {String} str - String to evaluate
     * @returns {string} Lowercase string
     */
    function functionLowercase(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        return str.toLowerCase();
    }

    /**
     * Uppercase a string
     * @param {String} str - String to evaluate
     * @returns {string} Uppercase string
     */
    function functionUppercase(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        return str.toUpperCase();
    }

    /**
     * length of a string
     * @param {String} str - string
     * @returns {Number} The number of characters in the string
     */
    function functionLength(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        return (0, _from2.default)(str).length;
    }

    /**
     * Normalize and trim whitespace within a string
     * @param {string} str - string to be trimmed
     * @returns {string} - trimmed string
     */
    function functionTrim(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        // normalize whitespace
        var result = str.replace(/[ \t\n\r]+/gm, ' ');
        if (result.charAt(0) === ' ') {
            // strip leading space
            result = result.substring(1);
        }
        if (result.charAt(result.length - 1) === ' ') {
            // strip trailing space
            result = result.substring(0, result.length - 1);
        }
        return result;
    }

    /**
     * Pad a string to a minimum width by adding characters to the start or end
     * @param {string} str - string to be padded
     * @param {number} width - the minimum width; +ve pads to the right, -ve pads to the left
     * @param {string} [char] - the pad character(s); defaults to ' '
     * @returns {string} - padded string
     */
    function functionPad(str, width, char) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }

        if (typeof char === 'undefined' || char.length === 0) {
            char = ' ';
        }

        var result;
        var padLength = Math.abs(width) - functionLength(str);
        if (padLength > 0) {
            var padding = new Array(padLength + 1).join(char);
            if (char.length > 1) {
                padding = functionSubstring(padding, 0, padLength);
            }
            if (width > 0) {
                result = str + padding;
            } else {
                result = padding + str;
            }
        } else {
            result = str;
        }
        return result;
    }

    /**
     * Tests if the str contains the token
     * @param {String} str - string to test
     * @param {String} token - substring or regex to find
     * @returns {Boolean} - true if str contains token
     */
    function functionContains(str, token) {
        var result, matches;
        return _regenerator2.default.wrap(function functionContains$(_context23) {
            while (1) {
                switch (_context23.prev = _context23.next) {
                    case 0:
                        if (!(typeof str === 'undefined')) {
                            _context23.next = 2;
                            break;
                        }

                        return _context23.abrupt('return', undefined);

                    case 2:
                        if (!(typeof token === 'string')) {
                            _context23.next = 6;
                            break;
                        }

                        result = str.indexOf(token) !== -1;
                        _context23.next = 9;
                        break;

                    case 6:
                        return _context23.delegateYield(evaluateMatcher(token, str), 't0', 7);

                    case 7:
                        matches = _context23.t0;

                        result = typeof matches !== 'undefined';

                    case 9:
                        return _context23.abrupt('return', result);

                    case 10:
                    case 'end':
                        return _context23.stop();
                }
            }
        }, _marked21, this);
    }

    /**
     * Match a string with a regex returning an array of object containing details of each match
     * @param {String} str - string
     * @param {String} regex - the regex applied to the string
     * @param {Integer} [limit] - max number of matches to return
     * @returns {Array} The array of match objects
     */
    function functionMatch(str, regex, limit) {
        var result, count, matches;
        return _regenerator2.default.wrap(function functionMatch$(_context24) {
            while (1) {
                switch (_context24.prev = _context24.next) {
                    case 0:
                        if (!(typeof str === 'undefined')) {
                            _context24.next = 2;
                            break;
                        }

                        return _context24.abrupt('return', undefined);

                    case 2:
                        if (!(limit < 0)) {
                            _context24.next = 4;
                            break;
                        }

                        throw {
                            stack: new Error().stack,
                            value: limit,
                            code: 'D3040',
                            index: 3
                        };

                    case 4:
                        result = createSequence();

                        if (!(typeof limit === 'undefined' || limit > 0)) {
                            _context24.next = 17;
                            break;
                        }

                        count = 0;
                        return _context24.delegateYield(evaluateMatcher(regex, str), 't0', 8);

                    case 8:
                        matches = _context24.t0;

                        if (!(typeof matches !== 'undefined')) {
                            _context24.next = 17;
                            break;
                        }

                    case 10:
                        if (!(typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit))) {
                            _context24.next = 17;
                            break;
                        }

                        result.push({
                            match: matches.match,
                            index: matches.start,
                            groups: matches.groups
                        });
                        return _context24.delegateYield(evaluateMatcher(matches.next), 't1', 13);

                    case 13:
                        matches = _context24.t1;

                        count++;
                        _context24.next = 10;
                        break;

                    case 17:
                        return _context24.abrupt('return', result);

                    case 18:
                    case 'end':
                        return _context24.stop();
                }
            }
        }, _marked22, this);
    }

    /**
     * Match a string with a regex returning an array of object containing details of each match
     * @param {String} str - string
     * @param {String} pattern - the substring/regex applied to the string
     * @param {String} replacement - text to replace the matched substrings
     * @param {Integer} [limit] - max number of matches to return
     * @returns {Array} The array of match objects
     */
    function functionReplace(str, pattern, replacement, limit) {
        var replacer, result, position, count, index, matches, replacedWith;
        return _regenerator2.default.wrap(function functionReplace$(_context25) {
            while (1) {
                switch (_context25.prev = _context25.next) {
                    case 0:
                        if (!(typeof str === 'undefined')) {
                            _context25.next = 2;
                            break;
                        }

                        return _context25.abrupt('return', undefined);

                    case 2:
                        if (!(pattern === '')) {
                            _context25.next = 4;
                            break;
                        }

                        throw {
                            code: "D3010",
                            stack: new Error().stack,
                            value: pattern,
                            index: 2
                        };

                    case 4:
                        if (!(limit < 0)) {
                            _context25.next = 6;
                            break;
                        }

                        throw {
                            code: "D3011",
                            stack: new Error().stack,
                            value: limit,
                            index: 4
                        };

                    case 6:
                        if (typeof replacement === 'string') {
                            replacer = function replacer(regexMatch) {
                                var substitute = '';
                                // scan forward, copying the replacement text into the substitute string
                                // and replace any occurrence of $n with the values matched by the regex
                                var position = 0;
                                var index = replacement.indexOf('$', position);
                                while (index !== -1 && position < replacement.length) {
                                    substitute += replacement.substring(position, index);
                                    position = index + 1;
                                    var dollarVal = replacement.charAt(position);
                                    if (dollarVal === '$') {
                                        // literal $
                                        substitute += '$';
                                        position++;
                                    } else if (dollarVal === '0') {
                                        substitute += regexMatch.match;
                                        position++;
                                    } else {
                                        var maxDigits;
                                        if (regexMatch.groups.length === 0) {
                                            // no sub-matches; any $ followed by a digit will be replaced by an empty string
                                            maxDigits = 1;
                                        } else {
                                            // max number of digits to parse following the $
                                            maxDigits = Math.floor(Math.log(regexMatch.groups.length) * Math.LOG10E) + 1;
                                        }
                                        index = parseInt(replacement.substring(position, position + maxDigits), 10);
                                        if (maxDigits > 1 && index > regexMatch.groups.length) {
                                            index = parseInt(replacement.substring(position, position + maxDigits - 1), 10);
                                        }
                                        if (!isNaN(index)) {
                                            if (regexMatch.groups.length > 0) {
                                                var submatch = regexMatch.groups[index - 1];
                                                if (typeof submatch !== 'undefined') {
                                                    substitute += submatch;
                                                }
                                            }
                                            position += index.toString().length;
                                        } else {
                                            // not a capture group, treat the $ as literal
                                            substitute += '$';
                                        }
                                    }
                                    index = replacement.indexOf('$', position);
                                }
                                substitute += replacement.substring(position);
                                return substitute;
                            };
                        } else {
                            replacer = replacement;
                        }

                        result = '';
                        position = 0;

                        if (!(typeof limit === 'undefined' || limit > 0)) {
                            _context25.next = 41;
                            break;
                        }

                        count = 0;

                        if (!(typeof pattern === 'string')) {
                            _context25.next = 17;
                            break;
                        }

                        index = str.indexOf(pattern, position);

                        while (index !== -1 && (typeof limit === 'undefined' || count < limit)) {
                            result += str.substring(position, index);
                            result += replacement;
                            position = index + pattern.length;
                            count++;
                            index = str.indexOf(pattern, position);
                        }
                        result += str.substring(position);
                        _context25.next = 39;
                        break;

                    case 17:
                        return _context25.delegateYield(evaluateMatcher(pattern, str), 't0', 18);

                    case 18:
                        matches = _context25.t0;

                        if (!(typeof matches !== 'undefined')) {
                            _context25.next = 38;
                            break;
                        }

                    case 20:
                        if (!(typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit))) {
                            _context25.next = 35;
                            break;
                        }

                        result += str.substring(position, matches.start);
                        return _context25.delegateYield(apply(replacer, [matches], null), 't1', 23);

                    case 23:
                        replacedWith = _context25.t1;

                        if (!(typeof replacedWith === 'string')) {
                            _context25.next = 28;
                            break;
                        }

                        result += replacedWith;
                        _context25.next = 29;
                        break;

                    case 28:
                        throw {
                            code: "D3012",
                            stack: new Error().stack,
                            value: replacedWith
                        };

                    case 29:
                        position = matches.start + matches.match.length;
                        count++;
                        return _context25.delegateYield(evaluateMatcher(matches.next), 't2', 32);

                    case 32:
                        matches = _context25.t2;
                        _context25.next = 20;
                        break;

                    case 35:
                        result += str.substring(position);
                        _context25.next = 39;
                        break;

                    case 38:
                        result = str;

                    case 39:
                        _context25.next = 42;
                        break;

                    case 41:
                        result = str;

                    case 42:
                        return _context25.abrupt('return', result);

                    case 43:
                    case 'end':
                        return _context25.stop();
                }
            }
        }, _marked23, this);
    }

    /**
     * Base64 encode a string
     * @param {String} str - string
     * @returns {String} Base 64 encoding of the binary data
     */
    function functionBase64encode(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }
        // Use btoa in a browser, or Buffer in Node.js

        var btoa = typeof window !== 'undefined' ?
        /* istanbul ignore next */window.btoa : function (str) {
            // Simply doing `new Buffer` at this point causes Browserify to pull
            // in the entire Buffer browser library, which is large and unnecessary.
            // Using `global.Buffer` defeats this.
            return new global.Buffer(str, 'binary').toString('base64');
        };
        return btoa(str);
    }

    /**
     * Base64 decode a string
     * @param {String} str - string
     * @returns {String} Base 64 encoding of the binary data
     */
    function functionBase64decode(str) {
        // undefined inputs always return undefined
        if (typeof str === 'undefined') {
            return undefined;
        }
        // Use btoa in a browser, or Buffer in Node.js
        var atob = typeof window !== 'undefined' ?
        /* istanbul ignore next */window.atob : function (str) {
            // Simply doing `new Buffer` at this point causes Browserify to pull
            // in the entire Buffer browser library, which is large and unnecessary.
            // Using `global.Buffer` defeats this.
            return new global.Buffer(str, 'base64').toString('binary');
        };
        return atob(str);
    }

    /**
     * Split a string into an array of substrings
     * @param {String} str - string
     * @param {String} separator - the token or regex that splits the string
     * @param {Integer} [limit] - max number of substrings
     * @returns {Array} The array of string
     */
    function functionSplit(str, separator, limit) {
        var result, count, matches, start;
        return _regenerator2.default.wrap(function functionSplit$(_context26) {
            while (1) {
                switch (_context26.prev = _context26.next) {
                    case 0:
                        if (!(typeof str === 'undefined')) {
                            _context26.next = 2;
                            break;
                        }

                        return _context26.abrupt('return', undefined);

                    case 2:
                        if (!(limit < 0)) {
                            _context26.next = 4;
                            break;
                        }

                        throw {
                            code: "D3020",
                            stack: new Error().stack,
                            value: limit,
                            index: 3
                        };

                    case 4:
                        result = [];

                        if (!(typeof limit === 'undefined' || limit > 0)) {
                            _context26.next = 27;
                            break;
                        }

                        if (!(typeof separator === 'string')) {
                            _context26.next = 10;
                            break;
                        }

                        result = str.split(separator, limit);
                        _context26.next = 27;
                        break;

                    case 10:
                        count = 0;
                        return _context26.delegateYield(evaluateMatcher(separator, str), 't0', 12);

                    case 12:
                        matches = _context26.t0;

                        if (!(typeof matches !== 'undefined')) {
                            _context26.next = 26;
                            break;
                        }

                        start = 0;

                    case 15:
                        if (!(typeof matches !== 'undefined' && (typeof limit === 'undefined' || count < limit))) {
                            _context26.next = 23;
                            break;
                        }

                        result.push(str.substring(start, matches.start));
                        start = matches.end;
                        return _context26.delegateYield(evaluateMatcher(matches.next), 't1', 19);

                    case 19:
                        matches = _context26.t1;

                        count++;
                        _context26.next = 15;
                        break;

                    case 23:
                        if (typeof limit === 'undefined' || count < limit) {
                            result.push(str.substring(start));
                        }
                        _context26.next = 27;
                        break;

                    case 26:
                        result.push(str);

                    case 27:
                        return _context26.abrupt('return', result);

                    case 28:
                    case 'end':
                        return _context26.stop();
                }
            }
        }, _marked24, this);
    }

    /**
     * Join an array of strings
     * @param {Array} strs - array of string
     * @param {String} [separator] - the token that splits the string
     * @returns {String} The concatenated string
     */
    function functionJoin(strs, separator) {
        // undefined inputs always return undefined
        if (typeof strs === 'undefined') {
            return undefined;
        }

        // if separator is not specified, default to empty string
        if (typeof separator === 'undefined') {
            separator = "";
        }

        return strs.join(separator);
    }

    /**
     * Formats a number into a decimal string representation using XPath 3.1 F&O fn:format-number spec
     * @param {number} value - number to format
     * @param {String} picture - picture string definition
     * @param {Object} [options] - override locale defaults
     * @returns {String} The formatted string
     */
    function functionFormatNumber(value, picture, options) {
        // undefined inputs always return undefined
        if (typeof value === 'undefined') {
            return undefined;
        }

        var defaults = {
            "decimal-separator": ".",
            "grouping-separator": ",",
            "exponent-separator": "e",
            "infinity": "Infinity",
            "minus-sign": "-",
            "NaN": "NaN",
            "percent": "%",
            "per-mille": '\u2030',
            "zero-digit": "0",
            "digit": "#",
            "pattern-separator": ";"
        };

        // if `options` is specified, then its entries override defaults
        var properties = defaults;
        if (typeof options !== 'undefined') {
            (0, _keys2.default)(options).forEach(function (key) {
                properties[key] = options[key];
            });
        }

        var decimalDigitFamily = [];
        var zeroCharCode = properties['zero-digit'].charCodeAt(0);
        for (var ii = zeroCharCode; ii < zeroCharCode + 10; ii++) {
            decimalDigitFamily.push(String.fromCharCode(ii));
        }

        var activeChars = decimalDigitFamily.concat([properties['decimal-separator'], properties['exponent-separator'], properties['grouping-separator'], properties.digit, properties['pattern-separator']]);

        var subPictures = picture.split(properties['pattern-separator']);

        if (subPictures.length > 2) {
            throw {
                code: 'D3080',
                stack: new Error().stack
            };
        }

        var splitParts = function splitParts(subpicture) {
            var prefix = function () {
                var ch;
                for (var ii = 0; ii < subpicture.length; ii++) {
                    ch = subpicture.charAt(ii);
                    if (activeChars.indexOf(ch) !== -1 && ch !== properties['exponent-separator']) {
                        return subpicture.substring(0, ii);
                    }
                }
            }();
            var suffix = function () {
                var ch;
                for (var ii = subpicture.length - 1; ii >= 0; ii--) {
                    ch = subpicture.charAt(ii);
                    if (activeChars.indexOf(ch) !== -1 && ch !== properties['exponent-separator']) {
                        return subpicture.substring(ii + 1);
                    }
                }
            }();
            var activePart = subpicture.substring(prefix.length, subpicture.length - suffix.length);
            var mantissaPart, exponentPart, integerPart, fractionalPart;
            var exponentPosition = subpicture.indexOf(properties['exponent-separator'], prefix.length);
            if (exponentPosition === -1 || exponentPosition > subpicture.length - suffix.length) {
                mantissaPart = activePart;
                exponentPart = undefined;
            } else {
                mantissaPart = activePart.substring(0, exponentPosition);
                exponentPart = activePart.substring(exponentPosition + 1);
            }
            var decimalPosition = mantissaPart.indexOf(properties['decimal-separator']);
            if (decimalPosition === -1) {
                integerPart = mantissaPart;
                fractionalPart = suffix;
            } else {
                integerPart = mantissaPart.substring(0, decimalPosition);
                fractionalPart = mantissaPart.substring(decimalPosition + 1);
            }
            return {
                prefix: prefix,
                suffix: suffix,
                activePart: activePart,
                mantissaPart: mantissaPart,
                exponentPart: exponentPart,
                integerPart: integerPart,
                fractionalPart: fractionalPart,
                subpicture: subpicture
            };
        };

        // validate the picture string, F&O 4.7.3
        var validate = function validate(parts) {
            var error;
            var ii;
            var subpicture = parts.subpicture;
            var decimalPos = subpicture.indexOf(properties['decimal-separator']);
            if (decimalPos !== subpicture.lastIndexOf(properties['decimal-separator'])) {
                error = 'D3081';
            }
            if (subpicture.indexOf(properties.percent) !== subpicture.lastIndexOf(properties.percent)) {
                error = 'D3082';
            }
            if (subpicture.indexOf(properties['per-mille']) !== subpicture.lastIndexOf(properties['per-mille'])) {
                error = 'D3083';
            }
            if (subpicture.indexOf(properties.percent) !== -1 && subpicture.indexOf(properties['per-mille']) !== -1) {
                error = 'D3084';
            }
            var valid = false;
            for (ii = 0; ii < parts.mantissaPart.length; ii++) {
                var ch = parts.mantissaPart.charAt(ii);
                if (decimalDigitFamily.indexOf(ch) !== -1 || ch === properties.digit) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                error = 'D3085';
            }
            var charTypes = parts.activePart.split('').map(function (char) {
                return activeChars.indexOf(char) === -1 ? 'p' : 'a';
            }).join('');
            if (charTypes.indexOf('p') !== -1) {
                error = 'D3086';
            }
            if (decimalPos !== -1) {
                if (subpicture.charAt(decimalPos - 1) === properties['grouping-separator'] || subpicture.charAt(decimalPos + 1) === properties['grouping-separator']) {
                    error = 'D3087';
                }
            } else if (parts.integerPart.charAt(parts.integerPart.length - 1) === properties['grouping-separator']) {
                error = 'D3088';
            }
            if (subpicture.indexOf(properties['grouping-separator'] + properties['grouping-separator']) !== -1) {
                error = 'D3089';
            }
            var optionalDigitPos = parts.integerPart.indexOf(properties.digit);
            if (optionalDigitPos !== -1 && parts.integerPart.substring(0, optionalDigitPos).split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) > -1;
            }).length > 0) {
                error = 'D3090';
            }
            optionalDigitPos = parts.fractionalPart.lastIndexOf(properties.digit);
            if (optionalDigitPos !== -1 && parts.fractionalPart.substring(optionalDigitPos).split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) > -1;
            }).length > 0) {
                error = 'D3091';
            }
            var exponentExists = typeof parts.exponentPart === 'string';
            if (exponentExists && parts.exponentPart.length > 0 && (subpicture.indexOf(properties.percent) !== -1 || subpicture.indexOf(properties['per-mille']) !== -1)) {
                error = 'D3092';
            }
            if (exponentExists && (parts.exponentPart.length === 0 || parts.exponentPart.split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) === -1;
            }).length > 0)) {
                error = 'D3093';
            }
            if (error) {
                throw {
                    code: error,
                    stack: new Error().stack
                };
            }
        };

        // analyse the picture string, F&O 4.7.4
        var analyse = function analyse(parts) {
            var getGroupingPositions = function getGroupingPositions(part, toLeft) {
                var positions = [];
                var groupingPosition = part.indexOf(properties['grouping-separator']);
                while (groupingPosition !== -1) {
                    var charsToTheRight = (toLeft ? part.substring(0, groupingPosition) : part.substring(groupingPosition)).split('').filter(function (char) {
                        return decimalDigitFamily.indexOf(char) !== -1 || char === properties.digit;
                    }).length;
                    positions.push(charsToTheRight);
                    groupingPosition = parts.integerPart.indexOf(properties['grouping-separator'], groupingPosition + 1);
                }
                return positions;
            };
            var integerPartGroupingPositions = getGroupingPositions(parts.integerPart);
            var regular = function regular(indexes) {
                // are the grouping positions regular? i.e. same interval between each of them
                if (indexes.length === 0) {
                    return 0;
                }
                var gcd = function gcd(a, b) {
                    return b === 0 ? a : gcd(b, a % b);
                };
                // find the greatest common divisor of all the positions
                var factor = indexes.reduce(gcd);
                // is every position separated by this divisor? If so, it's regular
                for (var index = 1; index <= indexes.length; index++) {
                    if (indexes.indexOf(index * factor) === -1) {
                        return 0;
                    }
                }
                return factor;
            };

            var regularGrouping = regular(integerPartGroupingPositions);
            var fractionalPartGroupingPositions = getGroupingPositions(parts.fractionalPart, true);

            var minimumIntegerPartSize = parts.integerPart.split('').filter(function (char) {
                return decimalDigitFamily.indexOf(char) !== -1;
            }).length;
            var scalingFactor = minimumIntegerPartSize;

            var fractionalPartArray = parts.fractionalPart.split('');
            var minimumFactionalPartSize = fractionalPartArray.filter(function (char) {
                return decimalDigitFamily.indexOf(char) !== -1;
            }).length;
            var maximumFactionalPartSize = fractionalPartArray.filter(function (char) {
                return decimalDigitFamily.indexOf(char) !== -1 || char === properties.digit;
            }).length;
            var exponentPresent = typeof parts.exponentPart === 'string';
            if (minimumIntegerPartSize === 0 && maximumFactionalPartSize === 0) {
                if (exponentPresent) {
                    minimumFactionalPartSize = 1;
                    maximumFactionalPartSize = 1;
                } else {
                    minimumIntegerPartSize = 1;
                }
            }
            if (exponentPresent && minimumIntegerPartSize === 0 && parts.integerPart.indexOf(properties.digit) !== -1) {
                minimumIntegerPartSize = 1;
            }
            if (minimumIntegerPartSize === 0 && minimumFactionalPartSize === 0) {
                minimumFactionalPartSize = 1;
            }
            var minimumExponentSize = 0;
            if (exponentPresent) {
                minimumExponentSize = parts.exponentPart.split('').filter(function (char) {
                    return decimalDigitFamily.indexOf(char) !== -1;
                }).length;
            }

            return {
                integerPartGroupingPositions: integerPartGroupingPositions,
                regularGrouping: regularGrouping,
                minimumIntegerPartSize: minimumIntegerPartSize,
                scalingFactor: scalingFactor,
                prefix: parts.prefix,
                fractionalPartGroupingPositions: fractionalPartGroupingPositions,
                minimumFactionalPartSize: minimumFactionalPartSize,
                maximumFactionalPartSize: maximumFactionalPartSize,
                minimumExponentSize: minimumExponentSize,
                suffix: parts.suffix,
                picture: parts.subpicture
            };
        };

        var parts = subPictures.map(splitParts);
        parts.forEach(validate);

        var variables = parts.map(analyse);

        var minus_sign = properties['minus-sign'];
        var zero_digit = properties['zero-digit'];
        var decimal_separator = properties['decimal-separator'];
        var grouping_separator = properties['grouping-separator'];

        if (variables.length === 1) {
            variables.push(JSON.parse((0, _stringify2.default)(variables[0])));
            variables[1].prefix = minus_sign + variables[1].prefix;
        }

        // TODO cache the result of the analysis

        // format the number
        // bullet 1: TODO: NaN - not sure we'd ever get this in JSON
        var pic;
        // bullet 2:
        if (value >= 0) {
            pic = variables[0];
        } else {
            pic = variables[1];
        }
        var adjustedNumber;
        // bullet 3:
        if (pic.picture.indexOf(properties.percent) !== -1) {
            adjustedNumber = value * 100;
        } else if (pic.picture.indexOf(properties['per-mille']) !== -1) {
            adjustedNumber = value * 1000;
        } else {
            adjustedNumber = value;
        }
        // bullet 4:
        // TODO: infinity - not sure we'd ever get this in JSON
        // bullet 5:
        var mantissa, exponent;
        if (pic.minimumExponentSize === 0) {
            mantissa = adjustedNumber;
        } else {
            // mantissa * 10^exponent = adjustedNumber
            var maxMantissa = Math.pow(10, pic.scalingFactor);
            var minMantissa = Math.pow(10, pic.scalingFactor - 1);
            mantissa = adjustedNumber;
            exponent = 0;
            while (mantissa < minMantissa) {
                mantissa *= 10;
                exponent -= 1;
            }
            while (mantissa > maxMantissa) {
                mantissa /= 10;
                exponent += 1;
            }
        }
        // bullet 6:
        var roundedNumber = functionRound(mantissa, pic.maximumFactionalPartSize);
        // bullet 7:
        var makeString = function makeString(value, dp) {
            var str = Math.abs(value).toFixed(dp);
            if (zero_digit !== '0') {
                str = str.split('').map(function (digit) {
                    if (digit >= '0' && digit <= '9') {
                        return decimalDigitFamily[digit.charCodeAt(0) - 48];
                    } else {
                        return digit;
                    }
                }).join('');
            }
            return str;
        };
        var stringValue = makeString(roundedNumber, pic.maximumFactionalPartSize);
        var decimalPos = stringValue.indexOf('.');
        if (decimalPos === -1) {
            stringValue = stringValue + decimal_separator;
        } else {
            stringValue = stringValue.replace('.', decimal_separator);
        }
        while (stringValue.charAt(0) === zero_digit) {
            stringValue = stringValue.substring(1);
        }
        while (stringValue.charAt(stringValue.length - 1) === zero_digit) {
            stringValue = stringValue.substring(0, stringValue.length - 1);
        }
        // bullets 8 & 9:
        decimalPos = stringValue.indexOf(decimal_separator);
        var padLeft = pic.minimumIntegerPartSize - decimalPos;
        var padRight = pic.minimumFactionalPartSize - (stringValue.length - decimalPos - 1);
        stringValue = (padLeft > 0 ? new Array(padLeft + 1).join(zero_digit) : '') + stringValue;
        stringValue = stringValue + (padRight > 0 ? new Array(padRight + 1).join(zero_digit) : '');
        decimalPos = stringValue.indexOf(decimal_separator);
        // bullet 10:
        if (pic.regularGrouping > 0) {
            var groupCount = Math.floor((decimalPos - 1) / pic.regularGrouping);
            for (var group = 1; group <= groupCount; group++) {
                stringValue = [stringValue.slice(0, decimalPos - group * pic.regularGrouping), grouping_separator, stringValue.slice(decimalPos - group * pic.regularGrouping)].join('');
            }
        } else {
            pic.integerPartGroupingPositions.forEach(function (pos) {
                stringValue = [stringValue.slice(0, decimalPos - pos), grouping_separator, stringValue.slice(decimalPos - pos)].join('');
                decimalPos++;
            });
        }
        // bullet 11:
        decimalPos = stringValue.indexOf(decimal_separator);
        pic.fractionalPartGroupingPositions.forEach(function (pos) {
            stringValue = [stringValue.slice(0, pos + decimalPos + 1), grouping_separator, stringValue.slice(pos + decimalPos + 1)].join('');
        });
        // bullet 12:
        decimalPos = stringValue.indexOf(decimal_separator);
        if (pic.picture.indexOf(decimal_separator) === -1 || decimalPos === stringValue.length - 1) {
            stringValue = stringValue.substring(0, stringValue.length - 1);
        }
        // bullet 13:
        if (typeof exponent !== 'undefined') {
            var stringExponent = makeString(exponent, 0);
            padLeft = pic.minimumExponentSize - stringExponent.length;
            if (padLeft > 0) {
                stringExponent = new Array(padLeft + 1).join(zero_digit) + stringExponent;
            }
            stringValue = stringValue + properties['exponent-separator'] + (exponent < 0 ? minus_sign : '') + stringExponent;
        }
        // bullet 14:
        stringValue = pic.prefix + stringValue + pic.suffix;
        return stringValue;
    }

    /**
     * Converts a number to a string using a specified number base
     * @param {string} value - the number to convert
     * @param {number} [radix] - the number base; must be between 2 and 36. Defaults to 10
     * @returns {string} - the converted string
     */
    function functionFormatBase(value, radix) {
        // undefined inputs always return undefined
        if (typeof value === 'undefined') {
            return undefined;
        }

        value = functionRound(value);

        if (typeof radix === 'undefined') {
            radix = 10;
        } else {
            radix = functionRound(radix);
        }

        if (radix < 2 || radix > 36) {
            throw {
                code: 'D3100',
                stack: new Error().stack,
                value: radix
            };
        }

        var result = value.toString(radix);

        return result;
    }

    /**
     * Cast argument to number
     * @param {Object} arg - Argument
     * @returns {Number} numeric value of argument
     */
    function functionNumber(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        if (typeof arg === 'number') {
            // already a number
            result = arg;
        } else if (typeof arg === 'string' && /^-?(0|([1-9][0-9]*))(\.[0-9]+)?([Ee][-+]?[0-9]+)?$/.test(arg) && !isNaN(parseFloat(arg)) && isFinite(arg)) {
            result = parseFloat(arg);
        } else {
            throw {
                code: "D3030",
                value: arg,
                stack: new Error().stack,
                index: 1
            };
        }
        return result;
    }

    /**
     * Absolute value of a number
     * @param {Number} arg - Argument
     * @returns {Number} absolute value of argument
     */
    function functionAbs(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.abs(arg);
        return result;
    }

    /**
     * Rounds a number down to integer
     * @param {Number} arg - Argument
     * @returns {Number} rounded integer
     */
    function functionFloor(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.floor(arg);
        return result;
    }

    /**
     * Rounds a number up to integer
     * @param {Number} arg - Argument
     * @returns {Number} rounded integer
     */
    function functionCeil(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.ceil(arg);
        return result;
    }

    /**
     * Round to half even
     * @param {Number} arg - Argument
     * @param {Number} precision - number of decimal places
     * @returns {Number} rounded integer
     */
    function functionRound(arg, precision) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        if (precision) {
            // shift the decimal place - this needs to be done in a string since multiplying
            // by a power of ten can introduce floating point precision errors which mess up
            // this rounding algorithm - See 'Decimal rounding' in
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
            // Shift
            var value = arg.toString().split('e');
            arg = +(value[0] + 'e' + (value[1] ? +value[1] + precision : precision));
        }

        // round up to nearest int
        result = Math.round(arg);
        var diff = result - arg;
        if (Math.abs(diff) === 0.5 && Math.abs(result % 2) === 1) {
            // rounded the wrong way - adjust to nearest even number
            result = result - 1;
        }
        if (precision) {
            // Shift back
            value = result.toString().split('e');
            /* istanbul ignore next */
            result = +(value[0] + 'e' + (value[1] ? +value[1] - precision : -precision));
        }
        if ((0, _is2.default)(result, -0)) {
            // ESLint rule 'no-compare-neg-zero' suggests this way
            // JSON doesn't do -0
            result = 0;
        }
        return result;
    }

    /**
     * Square root of number
     * @param {Number} arg - Argument
     * @returns {Number} square root
     */
    function functionSqrt(arg) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        if (arg < 0) {
            throw {
                stack: new Error().stack,
                code: "D3060",
                index: 1,
                value: arg
            };
        }

        result = Math.sqrt(arg);

        return result;
    }

    /**
     * Raises number to the power of the second number
     * @param {Number} arg - the base
     * @param {Number} exp - the exponent
     * @returns {Number} rounded integer
     */
    function functionPower(arg, exp) {
        var result;

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        result = Math.pow(arg, exp);

        if (!isFinite(result)) {
            throw {
                stack: new Error().stack,
                code: "D3061",
                index: 1,
                value: arg,
                exp: exp
            };
        }

        return result;
    }

    /**
     * Returns a random number 0 <= n < 1
     * @returns {number} random number
     */
    function functionRandom() {
        return Math.random();
    }

    /**
     * Evaluate an input and return a boolean
     * @param {*} arg - Arguments
     * @returns {boolean} Boolean
     */
    function functionBoolean(arg) {
        // cast arg to its effective boolean value
        // boolean: unchanged
        // string: zero-length -> false; otherwise -> true
        // number: 0 -> false; otherwise -> true
        // null -> false
        // array: empty -> false; length > 1 -> true
        // object: empty -> false; non-empty -> true
        // function -> false

        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        var result = false;
        if (Array.isArray(arg)) {
            if (arg.length === 1) {
                result = functionBoolean(arg[0]);
            } else if (arg.length > 1) {
                var trues = arg.filter(function (val) {
                    return functionBoolean(val);
                });
                result = trues.length > 0;
            }
        } else if (typeof arg === 'string') {
            if (arg.length > 0) {
                result = true;
            }
        } else if (isNumeric(arg)) {
            if (arg !== 0) {
                result = true;
            }
        } else if (arg !== null && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
            if ((0, _keys2.default)(arg).length > 0) {
                // make sure it's not a lambda function
                if (!(isLambda(arg) || arg._jsonata_function)) {
                    result = true;
                }
            }
        } else if (typeof arg === 'boolean' && arg === true) {
            result = true;
        }
        return result;
    }

    /**
     * returns the Boolean NOT of the arg
     * @param {*} arg - argument
     * @returns {boolean} - NOT arg
     */
    function functionNot(arg) {
        return !functionBoolean(arg);
    }

    /**
     * Create a map from an array of arguments
     * @param {Array} [arr] - array to map over
     * @param {Function} func - function to apply
     * @returns {Array} Map array
     */
    function functionMap(arr, func) {
        var result, i, func_args, length, res;
        return _regenerator2.default.wrap(function functionMap$(_context27) {
            while (1) {
                switch (_context27.prev = _context27.next) {
                    case 0:
                        if (!(typeof arr === 'undefined')) {
                            _context27.next = 2;
                            break;
                        }

                        return _context27.abrupt('return', undefined);

                    case 2:
                        result = createSequence();
                        // do the map - iterate over the arrays, and invoke func

                        i = 0;

                    case 4:
                        if (!(i < arr.length)) {
                            _context27.next = 15;
                            break;
                        }

                        func_args = [arr[i]]; // the first arg (value) is required
                        // the other two are optional - only supply it if the function can take it

                        length = typeof func === 'function' ? func.length : func._jsonata_function === true ? func.implementation.length : func.arguments.length;

                        if (length >= 2) {
                            func_args.push(i);
                        }
                        if (length >= 3) {
                            func_args.push(arr);
                        }
                        // invoke func
                        return _context27.delegateYield(apply(func, func_args, null), 't0', 10);

                    case 10:
                        res = _context27.t0;

                        if (typeof res !== 'undefined') {
                            result.push(res);
                        }

                    case 12:
                        i++;
                        _context27.next = 4;
                        break;

                    case 15:
                        return _context27.abrupt('return', result);

                    case 16:
                    case 'end':
                        return _context27.stop();
                }
            }
        }, _marked25, this);
    }

    // This generator function does not have a yield(), presumably to make it
    // consistent with other similar functions.
    /**
     * Create a map from an array of arguments
     * @param {Array} [arr] - array to filter
     * @param {Function} func - predicate function
     * @returns {Array} Map array
     */
    function functionFilter(arr, func) {
        var result, i, entry, res;
        return _regenerator2.default.wrap(function functionFilter$(_context28) {
            while (1) {
                switch (_context28.prev = _context28.next) {
                    case 0:
                        if (!(typeof arr === 'undefined')) {
                            _context28.next = 2;
                            break;
                        }

                        return _context28.abrupt('return', undefined);

                    case 2:
                        result = createSequence();
                        i = 0;

                    case 4:
                        if (!(i < arr.length)) {
                            _context28.next = 12;
                            break;
                        }

                        entry = arr[i];
                        // invoke func

                        return _context28.delegateYield(apply(func, [entry, i, arr], null), 't0', 7);

                    case 7:
                        res = _context28.t0;

                        if (functionBoolean(res)) {
                            result.push(entry);
                        }

                    case 9:
                        i++;
                        _context28.next = 4;
                        break;

                    case 12:
                        return _context28.abrupt('return', result);

                    case 13:
                    case 'end':
                        return _context28.stop();
                }
            }
        }, _marked26, this);
    }

    /**
     * Convolves (zips) each value from a set of arrays
     * @param {Array} [args] - arrays to zip
     * @returns {Array} Zipped array
     */
    function functionZip() {
        // this can take a variable number of arguments
        var result = [];
        var args = Array.prototype.slice.call(arguments);
        // length of the shortest array
        var length = Math.min.apply(Math, args.map(function (arg) {
            if (Array.isArray(arg)) {
                return arg.length;
            }
            return 0;
        }));
        for (var i = 0; i < length; i++) {
            var tuple = args.map(function (arg) {
                return arg[i];
            });
            result.push(tuple);
        }
        return result;
    }

    /**
     * Fold left function
     * @param {Array} sequence - Sequence
     * @param {Function} func - Function
     * @param {Object} init - Initial value
     * @returns {*} Result
     */
    function functionFoldLeft(sequence, func, init) {
        var result, index;
        return _regenerator2.default.wrap(function functionFoldLeft$(_context29) {
            while (1) {
                switch (_context29.prev = _context29.next) {
                    case 0:
                        if (!(typeof sequence === 'undefined')) {
                            _context29.next = 2;
                            break;
                        }

                        return _context29.abrupt('return', undefined);

                    case 2:
                        if (func.length === 2 || func._jsonata_function === true && func.implementation.length === 2 || func.arguments.length === 2) {
                            _context29.next = 4;
                            break;
                        }

                        throw {
                            stack: new Error().stack,
                            code: "D3050",
                            index: 1
                        };

                    case 4:
                        if (typeof init === 'undefined' && sequence.length > 0) {
                            result = sequence[0];
                            index = 1;
                        } else {
                            result = init;
                            index = 0;
                        }

                    case 5:
                        if (!(index < sequence.length)) {
                            _context29.next = 11;
                            break;
                        }

                        return _context29.delegateYield(apply(func, [result, sequence[index]], null), 't0', 7);

                    case 7:
                        result = _context29.t0;

                        index++;
                        _context29.next = 5;
                        break;

                    case 11:
                        return _context29.abrupt('return', result);

                    case 12:
                    case 'end':
                        return _context29.stop();
                }
            }
        }, _marked27, this);
    }

    /**
     * Return keys for an object
     * @param {Object} arg - Object
     * @returns {Array} Array of keys
     */
    function functionKeys(arg) {
        var result = createSequence();

        if (Array.isArray(arg)) {
            // merge the keys of all of the items in the array
            var merge = {};
            arg.forEach(function (item) {
                var keys = functionKeys(item);
                if (Array.isArray(keys)) {
                    keys.forEach(function (key) {
                        merge[key] = true;
                    });
                }
            });
            result = functionKeys(merge);
        } else if (arg !== null && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && !isLambda(arg)) {
            result = (0, _keys2.default)(arg);
            if (result.length === 0) {
                result = undefined;
            }
        } else {
            result = undefined;
        }
        return result;
    }

    /**
     * Return value from an object for a given key
     * @param {Object} object - Object
     * @param {String} key - Key in object
     * @returns {*} Value of key in object
     */
    function functionLookup(object, key) {
        var result = evaluateName({ value: key }, object);
        return result;
    }

    /**
     * Append second argument to first
     * @param {Array|Object} arg1 - First argument
     * @param {Array|Object} arg2 - Second argument
     * @returns {*} Appended arguments
     */
    function functionAppend(arg1, arg2) {
        // disregard undefined args
        if (typeof arg1 === 'undefined') {
            return arg2;
        }
        if (typeof arg2 === 'undefined') {
            return arg1;
        }
        // if either argument is not an array, make it so
        if (!Array.isArray(arg1)) {
            arg1 = createSequence(arg1);
        }
        if (!Array.isArray(arg2)) {
            arg2 = [arg2];
        }
        return arg1.concat(arg2);
    }

    /**
     * Determines if the argument is undefined
     * @param {*} arg - argument
     * @returns {boolean} False if argument undefined, otherwise true
     */
    function functionExists(arg) {
        if (typeof arg === 'undefined') {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Splits an object into an array of object with one property each
     * @param {*} arg - the object to split
     * @returns {*} - the array
     */
    function functionSpread(arg) {
        var result = createSequence();

        if (Array.isArray(arg)) {
            // spread all of the items in the array
            arg.forEach(function (item) {
                result = functionAppend(result, functionSpread(item));
            });
        } else if (arg !== null && (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && !isLambda(arg)) {
            for (var key in arg) {
                var obj = {};
                obj[key] = arg[key];
                result.push(obj);
            }
        } else {
            result = arg;
        }
        return result;
    }

    /**
     * Merges an array of objects into a single object.  Duplicate properties are
     * overridden by entries later in the array
     * @param {*} arg - the objects to merge
     * @returns {*} - the object
     */
    function functionMerge(arg) {
        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        var result = {};

        arg.forEach(function (obj) {
            for (var prop in obj) {
                result[prop] = obj[prop];
            }
        });
        return result;
    }

    /**
     * Reverses the order of items in an array
     * @param {Array} arr - the array to reverse
     * @returns {Array} - the reversed array
     */
    function functionReverse(arr) {
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        if (arr.length <= 1) {
            return arr;
        }

        var length = arr.length;
        var result = new Array(length);
        for (var i = 0; i < length; i++) {
            result[length - i - 1] = arr[i];
        }

        return result;
    }

    /**
     *
     * @param {*} obj - the input object to iterate over
     * @param {*} func - the function to apply to each key/value pair
     * @returns {Array} - the resultant array
     */
    function functionEach(obj, func) {
        var result, key, func_args;
        return _regenerator2.default.wrap(function functionEach$(_context30) {
            while (1) {
                switch (_context30.prev = _context30.next) {
                    case 0:
                        result = createSequence();
                        _context30.t0 = _regenerator2.default.keys(obj);

                    case 2:
                        if ((_context30.t1 = _context30.t0()).done) {
                            _context30.next = 11;
                            break;
                        }

                        key = _context30.t1.value;
                        func_args = [obj[key], key];
                        // invoke func

                        _context30.t2 = result;
                        return _context30.delegateYield(apply(func, func_args, null), 't3', 7);

                    case 7:
                        _context30.t4 = _context30.t3;

                        _context30.t2.push.call(_context30.t2, _context30.t4);

                        _context30.next = 2;
                        break;

                    case 11:
                        return _context30.abrupt('return', result);

                    case 12:
                    case 'end':
                        return _context30.stop();
                }
            }
        }, _marked28, this);
    }

    /**
     * Implements the merge sort (stable) with optional comparator function
     *
     * @param {Array} arr - the array to sort
     * @param {*} comparator - comparator function
     * @returns {Array} - sorted array
     */
    function functionSort(arr, comparator) {
        var comp, merge, sort, result;
        return _regenerator2.default.wrap(function functionSort$(_context36) {
            while (1) {
                switch (_context36.prev = _context36.next) {
                    case 0:
                        if (!(typeof arr === 'undefined')) {
                            _context36.next = 2;
                            break;
                        }

                        return _context36.abrupt('return', undefined);

                    case 2:
                        if (!(arr.length <= 1)) {
                            _context36.next = 4;
                            break;
                        }

                        return _context36.abrupt('return', arr);

                    case 4:
                        if (!(typeof comparator === 'undefined')) {
                            _context36.next = 10;
                            break;
                        }

                        if (!(!isArrayOfNumbers(arr) && !isArrayOfStrings(arr))) {
                            _context36.next = 7;
                            break;
                        }

                        throw {
                            stack: new Error().stack,
                            code: "D3070",
                            index: 1
                        };

                    case 7:

                        comp = /*#__PURE__*/_regenerator2.default.mark(function comp(a, b) {
                            return _regenerator2.default.wrap(function comp$(_context31) {
                                while (1) {
                                    switch (_context31.prev = _context31.next) {
                                        case 0:
                                            return _context31.abrupt('return', a > b);

                                        case 1:
                                        case 'end':
                                            return _context31.stop();
                                    }
                                }
                            }, comp, this);
                        });
                        _context36.next = 11;
                        break;

                    case 10:
                        if (typeof comparator === 'function') {
                            // for internal usage of functionSort (i.e. order-by syntax)
                            comp = comparator;
                        } else {
                            comp = /*#__PURE__*/_regenerator2.default.mark(function comp(a, b) {
                                return _regenerator2.default.wrap(function comp$(_context32) {
                                    while (1) {
                                        switch (_context32.prev = _context32.next) {
                                            case 0:
                                                return _context32.delegateYield(apply(comparator, [a, b], null), 't0', 1);

                                            case 1:
                                                return _context32.abrupt('return', _context32.t0);

                                            case 2:
                                            case 'end':
                                                return _context32.stop();
                                        }
                                    }
                                }, comp, this);
                            });
                        }

                    case 11:
                        merge = /*#__PURE__*/_regenerator2.default.mark(function merge(l, r) {
                            var merge_iter, merged;
                            return _regenerator2.default.wrap(function merge$(_context34) {
                                while (1) {
                                    switch (_context34.prev = _context34.next) {
                                        case 0:
                                            merge_iter = /*#__PURE__*/_regenerator2.default.mark(function merge_iter(result, left, right) {
                                                return _regenerator2.default.wrap(function merge_iter$(_context33) {
                                                    while (1) {
                                                        switch (_context33.prev = _context33.next) {
                                                            case 0:
                                                                if (!(left.length === 0)) {
                                                                    _context33.next = 4;
                                                                    break;
                                                                }

                                                                Array.prototype.push.apply(result, right);
                                                                _context33.next = 16;
                                                                break;

                                                            case 4:
                                                                if (!(right.length === 0)) {
                                                                    _context33.next = 8;
                                                                    break;
                                                                }

                                                                Array.prototype.push.apply(result, left);
                                                                _context33.next = 16;
                                                                break;

                                                            case 8:
                                                                return _context33.delegateYield(comp(left[0], right[0]), 't0', 9);

                                                            case 9:
                                                                if (!_context33.t0) {
                                                                    _context33.next = 14;
                                                                    break;
                                                                }

                                                                // invoke the comparator function
                                                                // if it returns true - swap left and right
                                                                result.push(right[0]);
                                                                return _context33.delegateYield(merge_iter(result, left, right.slice(1)), 't1', 12);

                                                            case 12:
                                                                _context33.next = 16;
                                                                break;

                                                            case 14:
                                                                // otherwise keep the same order
                                                                result.push(left[0]);
                                                                return _context33.delegateYield(merge_iter(result, left.slice(1), right), 't2', 16);

                                                            case 16:
                                                            case 'end':
                                                                return _context33.stop();
                                                        }
                                                    }
                                                }, merge_iter, this);
                                            });
                                            merged = [];
                                            return _context34.delegateYield(merge_iter(merged, l, r), 't0', 3);

                                        case 3:
                                            return _context34.abrupt('return', merged);

                                        case 4:
                                        case 'end':
                                            return _context34.stop();
                                    }
                                }
                            }, merge, this);
                        });
                        sort = /*#__PURE__*/_regenerator2.default.mark(function sort(array) {
                            var middle, left, right;
                            return _regenerator2.default.wrap(function sort$(_context35) {
                                while (1) {
                                    switch (_context35.prev = _context35.next) {
                                        case 0:
                                            if (!(!Array.isArray(array) || array.length <= 1)) {
                                                _context35.next = 4;
                                                break;
                                            }

                                            return _context35.abrupt('return', array);

                                        case 4:
                                            middle = Math.floor(array.length / 2);
                                            left = array.slice(0, middle);
                                            right = array.slice(middle);
                                            return _context35.delegateYield(sort(left), 't0', 8);

                                        case 8:
                                            left = _context35.t0;
                                            return _context35.delegateYield(sort(right), 't1', 10);

                                        case 10:
                                            right = _context35.t1;
                                            return _context35.delegateYield(merge(left, right), 't2', 12);

                                        case 12:
                                            return _context35.abrupt('return', _context35.t2);

                                        case 13:
                                        case 'end':
                                            return _context35.stop();
                                    }
                                }
                            }, sort, this);
                        });
                        return _context36.delegateYield(sort(arr), 't0', 14);

                    case 14:
                        result = _context36.t0;
                        return _context36.abrupt('return', result);

                    case 16:
                    case 'end':
                        return _context36.stop();
                }
            }
        }, _marked29, this);
    }

    /**
     * Randomly shuffles the contents of an array
     * @param {Array} arr - the input array
     * @returns {Array} the shuffled array
     */
    function functionShuffle(arr) {
        // undefined inputs always return undefined
        if (typeof arr === 'undefined') {
            return undefined;
        }

        if (arr.length <= 1) {
            return arr;
        }

        // shuffle using the 'inside-out' variant of the Fisher-Yates algorithm
        var result = new Array(arr.length);
        for (var i = 0; i < arr.length; i++) {
            var j = Math.floor(Math.random() * (i + 1)); // random integer such that 0 ≤ j ≤ i
            if (i !== j) {
                result[i] = result[j];
            }
            result[j] = arr[i];
        }

        return result;
    }

    /**
     * Applies a predicate function to each key/value pair in an object, and returns an object containing
     * only the key/value pairs that passed the predicate
     *
     * @param {object} arg - the object to be sifted
     * @param {object} func - the predicate function (lambda or native)
     * @returns {object} - sifted object
     */
    function functionSift(arg, func) {
        var result, item, entry, res;
        return _regenerator2.default.wrap(function functionSift$(_context37) {
            while (1) {
                switch (_context37.prev = _context37.next) {
                    case 0:
                        result = {};
                        _context37.t0 = _regenerator2.default.keys(arg);

                    case 2:
                        if ((_context37.t1 = _context37.t0()).done) {
                            _context37.next = 10;
                            break;
                        }

                        item = _context37.t1.value;
                        entry = arg[item];
                        // invoke func

                        return _context37.delegateYield(apply(func, [entry, item, arg], null), 't2', 6);

                    case 6:
                        res = _context37.t2;

                        if (functionBoolean(res)) {
                            result[item] = entry;
                        }
                        _context37.next = 2;
                        break;

                    case 10:

                        // empty objects should be changed to undefined
                        if ((0, _keys2.default)(result).length === 0) {
                            result = undefined;
                        }

                        return _context37.abrupt('return', result);

                    case 12:
                    case 'end':
                        return _context37.stop();
                }
            }
        }, _marked30, this);
    }

    // Regular expression to match an ISO 8601 formatted timestamp
    var iso8601regex = new RegExp('^\\d{4}(-[01]\\d)*(-[0-3]\\d)*(T[0-2]\\d:[0-5]\\d:[0-5]\\d)*(\\.\\d+)?([+-][0-2]\\d:?[0-5]\\d|Z)?$');

    /**
     * Converts an ISO 8601 timestamp to milliseconds since the epoch
     *
     * @param {string} timestamp - the ISO 8601 timestamp to be converted
     * @returns {Number} - milliseconds since the epoch
     */
    function functionToMillis(timestamp) {
        // undefined inputs always return undefined
        if (typeof timestamp === 'undefined') {
            return undefined;
        }

        if (!iso8601regex.test(timestamp)) {
            throw {
                stack: new Error().stack,
                code: "D3110",
                value: timestamp
            };
        }

        return Date.parse(timestamp);
    }

    /**
     * Converts milliseconds since the epoch to an ISO 8601 timestamp
     * @param {Number} millis - milliseconds since the epoch to be converted
     * @returns {String} - an ISO 8601 formatted timestamp
     */
    function functionFromMillis(millis) {
        // undefined inputs always return undefined
        if (typeof millis === 'undefined') {
            return undefined;
        }

        return new Date(millis).toISOString();
    }

    /**
     * Clones an object
     * @param {Object} arg - object to clone (deep copy)
     * @returns {*} - the cloned object
     */
    function functionClone(arg) {
        // undefined inputs always return undefined
        if (typeof arg === 'undefined') {
            return undefined;
        }

        return JSON.parse(functionString(arg));
    }

    /**
     * Create frame
     * @param {Object} enclosingEnvironment - Enclosing environment
     * @returns {{bind: bind, lookup: lookup}} Created frame
     */
    function createFrame(enclosingEnvironment) {
        var bindings = {};
        return {
            bind: function bind(name, value) {
                bindings[name] = value;
            },
            lookup: function lookup(name) {
                var value;
                if (bindings.hasOwnProperty(name)) {
                    value = bindings[name];
                } else if (enclosingEnvironment) {
                    value = enclosingEnvironment.lookup(name);
                }
                return value;
            }
        };
    }

    // Function registration
    staticFrame.bind('sum', defineFunction(functionSum, '<a<n>:n>'));
    staticFrame.bind('count', defineFunction(functionCount, '<a:n>'));
    staticFrame.bind('max', defineFunction(functionMax, '<a<n>:n>'));
    staticFrame.bind('min', defineFunction(functionMin, '<a<n>:n>'));
    staticFrame.bind('average', defineFunction(functionAverage, '<a<n>:n>'));
    staticFrame.bind('string', defineFunction(functionString, '<x-:s>'));
    staticFrame.bind('substring', defineFunction(functionSubstring, '<s-nn?:s>'));
    staticFrame.bind('substringBefore', defineFunction(functionSubstringBefore, '<s-s:s>'));
    staticFrame.bind('substringAfter', defineFunction(functionSubstringAfter, '<s-s:s>'));
    staticFrame.bind('lowercase', defineFunction(functionLowercase, '<s-:s>'));
    staticFrame.bind('uppercase', defineFunction(functionUppercase, '<s-:s>'));
    staticFrame.bind('length', defineFunction(functionLength, '<s-:n>'));
    staticFrame.bind('trim', defineFunction(functionTrim, '<s-:s>'));
    staticFrame.bind('pad', defineFunction(functionPad, '<s-ns?:s>'));
    staticFrame.bind('match', defineFunction(functionMatch, '<s-f<s:o>n?:a<o>>'));
    staticFrame.bind('contains', defineFunction(functionContains, '<s-(sf):b>')); // TODO <s-(sf<s:o>):b>
    staticFrame.bind('replace', defineFunction(functionReplace, '<s-(sf)(sf)n?:s>')); // TODO <s-(sf<s:o>)(sf<o:s>)n?:s>
    staticFrame.bind('split', defineFunction(functionSplit, '<s-(sf)n?:a<s>>')); // TODO <s-(sf<s:o>)n?:a<s>>
    staticFrame.bind('join', defineFunction(functionJoin, '<a<s>s?:s>'));
    staticFrame.bind('formatNumber', defineFunction(functionFormatNumber, '<n-so?:s>'));
    staticFrame.bind('formatBase', defineFunction(functionFormatBase, '<n-n?:s>'));
    staticFrame.bind('number', defineFunction(functionNumber, '<(ns)-:n>'));
    staticFrame.bind('floor', defineFunction(functionFloor, '<n-:n>'));
    staticFrame.bind('ceil', defineFunction(functionCeil, '<n-:n>'));
    staticFrame.bind('round', defineFunction(functionRound, '<n-n?:n>'));
    staticFrame.bind('abs', defineFunction(functionAbs, '<n-:n>'));
    staticFrame.bind('sqrt', defineFunction(functionSqrt, '<n-:n>'));
    staticFrame.bind('power', defineFunction(functionPower, '<n-n:n>'));
    staticFrame.bind('random', defineFunction(functionRandom, '<:n>'));
    staticFrame.bind('boolean', defineFunction(functionBoolean, '<x-:b>'));
    staticFrame.bind('not', defineFunction(functionNot, '<x-:b>'));
    staticFrame.bind('map', defineFunction(functionMap, '<af>'));
    staticFrame.bind('zip', defineFunction(functionZip, '<a+>'));
    staticFrame.bind('filter', defineFunction(functionFilter, '<af>'));
    staticFrame.bind('reduce', defineFunction(functionFoldLeft, '<afj?:j>')); // TODO <f<jj:j>a<j>j?:j>
    staticFrame.bind('sift', defineFunction(functionSift, '<o-f?:o>'));
    staticFrame.bind('keys', defineFunction(functionKeys, '<x-:a<s>>'));
    staticFrame.bind('lookup', defineFunction(functionLookup, '<x-s:x>'));
    staticFrame.bind('append', defineFunction(functionAppend, '<xx:a>'));
    staticFrame.bind('exists', defineFunction(functionExists, '<x:b>'));
    staticFrame.bind('spread', defineFunction(functionSpread, '<x-:a<o>>'));
    staticFrame.bind('merge', defineFunction(functionMerge, '<a<o>:o>'));
    staticFrame.bind('reverse', defineFunction(functionReverse, '<a:a>'));
    staticFrame.bind('each', defineFunction(functionEach, '<o-f:a>'));
    staticFrame.bind('sort', defineFunction(functionSort, '<af?:a>'));
    staticFrame.bind('shuffle', defineFunction(functionShuffle, '<a:a>'));
    staticFrame.bind('base64encode', defineFunction(functionBase64encode, '<s-:s>'));
    staticFrame.bind('base64decode', defineFunction(functionBase64decode, '<s-:s>'));
    staticFrame.bind('toMillis', defineFunction(functionToMillis, '<s-:n>'));
    staticFrame.bind('fromMillis', defineFunction(functionFromMillis, '<n-:s>'));
    staticFrame.bind('clone', defineFunction(functionClone, '<(oa)-:o>'));

    /**
     * Error codes
     *
     * Sxxxx    - Static errors (compile time)
     * Txxxx    - Type errors
     * Dxxxx    - Dynamic errors (evaluate time)
     *  01xx    - tokenizer
     *  02xx    - parser
     *  03xx    - regex parser
     *  04xx    - function signature parser/evaluator
     *  10xx    - evaluator
     *  20xx    - operators
     *  3xxx    - functions (blocks of 10 for each function)
     */
    var errorCodes = {
        "S0101": "String literal must be terminated by a matching quote",
        "S0102": "Number out of range: {{token}}",
        "S0103": "Unsupported escape sequence: \\{{token}}",
        "S0104": 'The escape sequence \\u must be followed by 4 hex digits',
        "S0105": "Quoted property name must be terminated with a backquote (`)",
        "S0201": "Syntax error: {{token}}",
        "S0202": "Expected {{value}}, got {{token}}",
        "S0203": "Expected {{value}} before end of expression",
        "S0204": "Unknown operator: {{token}}",
        "S0205": "Unexpected token: {{token}}",
        "S0206": "Unknown expression type: {{token}}",
        "S0207": "Unexpected end of expression",
        "S0208": "Parameter {{value}} of function definition must be a variable name (start with $)",
        "S0209": "A predicate cannot follow a grouping expression in a step",
        "S0210": "Each step can only have one grouping expression",
        "S0211": "The symbol {{token}} cannot be used as a unary operator",
        "S0212": "The left side of := must be a variable name (start with $)",
        "S0213": "The literal value {{value}} cannot be used as a step within a path expression",
        "S0301": "Empty regular expressions are not allowed",
        "S0302": "No terminating / in regular expression",
        "S0402": "Choice groups containing parameterized types are not supported",
        "S0401": "Type parameters can only be applied to functions and arrays",
        "S0500": "Attempted to evaluate an expression containing syntax error(s)",
        "T0410": "Argument {{index}} of function {{token}} does not match function signature",
        "T0411": "Context value is not a compatible type with argument {{index}} of function {{token}}",
        "T0412": "Argument {{index}} of function {{token}} must be an array of {{type}}",
        "D1001": "Number out of range: {{value}}",
        "D1002": "Cannot negate a non-numeric value: {{value}}",
        "T1003": "Key in object structure must evaluate to a string; got: {{value}}",
        "D1004": "Regular expression matches zero length string",
        "T1005": "Attempted to invoke a non-function. Did you mean ${{{token}}}?",
        "T1006": "Attempted to invoke a non-function",
        "T1007": "Attempted to partially apply a non-function. Did you mean ${{{token}}}?",
        "T1008": "Attempted to partially apply a non-function",
        "D1009": "Multiple key definitions evaluate to same key: {{value}}",
        "T1010": "The matcher function argument passed to function {{token}} does not return the correct object structure",
        "T2001": "The left side of the {{token}} operator must evaluate to a number",
        "T2002": "The right side of the {{token}} operator must evaluate to a number",
        "T2003": "The left side of the range operator (..) must evaluate to an integer",
        "T2004": "The right side of the range operator (..) must evaluate to an integer",
        "D2005": "The left side of := must be a variable name (start with $)", // defunct - replaced by S0212 parser error
        "T2006": "The right side of the function application operator ~> must be a function",
        "T2007": "Type mismatch when comparing values {{value}} and {{value2}} in order-by clause",
        "T2008": "The expressions within an order-by clause must evaluate to numeric or string values",
        "T2009": "The values {{value}} and {{value2}} either side of operator {{token}} must be of the same data type",
        "T2010": "The expressions either side of operator {{token}} must evaluate to numeric or string values",
        "T2011": "The insert/update clause of the transform expression must evaluate to an object: {{value}}",
        "T2012": "The delete clause of the transform expression must evaluate to a string or array of strings: {{value}}",
        "T2013": "The transform expression clones the input object using the $clone() function.  This has been overridden in the current scope by a non-function.",
        "D3001": "Attempting to invoke string function on Infinity or NaN",
        "D3010": "Second argument of replace function cannot be an empty string",
        "D3011": "Fourth argument of replace function must evaluate to a positive number",
        "D3012": "Attempted to replace a matched string with a non-string value",
        "D3020": "Third argument of split function must evaluate to a positive number",
        "D3030": "Unable to cast value to a number: {{value}}",
        "D3040": "Third argument of match function must evaluate to a positive number",
        "D3050": "First argument of reduce function must be a function with two arguments",
        "D3060": "The sqrt function cannot be applied to a negative number: {{value}}",
        "D3061": "The power function has resulted in a value that cannot be represented as a JSON number: base={{value}}, exponent={{exp}}",
        "D3070": "The single argument form of the sort function can only be applied to an array of strings or an array of numbers.  Use the second argument to specify a comparison function",
        "D3080": "The picture string must only contain a maximum of two sub-pictures",
        "D3081": "The sub-picture must not contain more than one instance of the 'decimal-separator' character",
        "D3082": "The sub-picture must not contain more than one instance of the 'percent' character",
        "D3083": "The sub-picture must not contain more than one instance of the 'per-mille' character",
        "D3084": "The sub-picture must not contain both a 'percent' and a 'per-mille' character",
        "D3085": "The mantissa part of a sub-picture must contain at least one character that is either an 'optional digit character' or a member of the 'decimal digit family'",
        "D3086": "The sub-picture must not contain a passive character that is preceded by an active character and that is followed by another active character",
        "D3087": "The sub-picture must not contain a 'grouping-separator' character that appears adjacent to a 'decimal-separator' character",
        "D3088": "The sub-picture must not contain a 'grouping-separator' at the end of the integer part",
        "D3089": "The sub-picture must not contain two adjacent instances of the 'grouping-separator' character",
        "D3090": "The integer part of the sub-picture must not contain a member of the 'decimal digit family' that is followed by an instance of the 'optional digit character'",
        "D3091": "The fractional part of the sub-picture must not contain an instance of the 'optional digit character' that is followed by a member of the 'decimal digit family'",
        "D3092": "A sub-picture that contains a 'percent' or 'per-mille' character must not contain a character treated as an 'exponent-separator'",
        "D3093": "The exponent part of the sub-picture must comprise only of one or more characters that are members of the 'decimal digit family'",
        "D3100": "The radix of the formatBase function must be between 2 and 36.  It was given {{value}}",
        "D3110": "The argument of the toMillis function must be an ISO 8601 formatted timestamp. Given {{value}}"
    };

    /**
     * lookup a message template from the catalog and substitute the inserts
     * @param {string} err - error code to lookup
     * @returns {string} message
     */
    function lookupMessage(err) {
        var message = 'Unknown error';
        if (typeof err.message !== 'undefined') {
            message = err.message;
        }
        var template = errorCodes[err.code];
        if (typeof template !== 'undefined') {
            // if there are any handlebars, replace them with the field references
            // triple braces - replace with value
            // double braces - replace with json stringified value
            message = template.replace(/\{\{\{([^}]+)}}}/g, function () {
                return err[arguments[1]];
            });
            message = message.replace(/\{\{([^}]+)}}/g, function () {
                return (0, _stringify2.default)(err[arguments[1]]);
            });
        }
        return message;
    }

    /**
     * JSONata
     * @param {Object} expr - JSONata expression
     * @param {boolean} options - recover: attempt to recover on parse error
     * @returns {{evaluate: evaluate, assign: assign}} Evaluated expression
     */
    function jsonata(expr, options) {
        var _ast;
        var _errors;
        try {
            _ast = parser(expr, options && options.recover);
            _errors = _ast.errors;
            delete _ast.errors;
        } catch (err) {
            // insert error message into structure
            err.message = lookupMessage(err);
            throw err;
        }
        var environment = createFrame(staticFrame);

        var timestamp = new Date(); // will be overridden on each call to evalute()
        environment.bind('now', defineFunction(function () {
            return timestamp.toJSON();
        }, '<:s>'));
        environment.bind('millis', defineFunction(function () {
            return timestamp.getTime();
        }, '<:n>'));

        return {
            evaluate: function evaluate(input, bindings, callback) {
                // throw if the expression compiled with syntax errors
                if (typeof _errors !== 'undefined') {
                    var err = {
                        code: 'S0500',
                        position: 0
                    };
                    err.message = lookupMessage(err);
                    throw err;
                }

                if (typeof bindings !== 'undefined') {
                    var exec_env;
                    // the variable bindings have been passed in - create a frame to hold these
                    exec_env = createFrame(environment);
                    for (var v in bindings) {
                        exec_env.bind(v, bindings[v]);
                    }
                } else {
                    exec_env = environment;
                }
                // put the input document into the environment as the root object
                exec_env.bind('$', input);

                // capture the timestamp and put it in the execution environment
                // the $now() and $millis() functions will return this value - whenever it is called
                timestamp = new Date();

                var result, it;
                // if a callback function is supplied, then drive the generator in a promise chain
                if (typeof callback === 'function') {
                    exec_env.bind('__jsonata_async', true);
                    var catchHandler = function catchHandler(err) {
                        err.message = lookupMessage(err);
                        callback(err, null);
                    };
                    var thenHandler = function thenHandler(response) {
                        result = it.next(response);
                        if (result.done) {
                            callback(null, result.value);
                        } else {
                            result.value.then(thenHandler).catch(catchHandler);
                        }
                    };
                    it = _evaluate(_ast, input, exec_env);
                    result = it.next();
                    result.value.then(thenHandler).catch(catchHandler);
                } else {
                    // no callback function - drive the generator to completion synchronously
                    try {
                        it = _evaluate(_ast, input, exec_env);
                        result = it.next();
                        while (!result.done) {
                            result = it.next(result.value);
                        }
                        return result.value;
                    } catch (err) {
                        // insert error message into structure
                        err.message = lookupMessage(err);
                        throw err;
                    }
                }
            },
            assign: function assign(name, value) {
                environment.bind(name, value);
            },
            registerFunction: function registerFunction(name, implementation, signature) {
                var func = defineFunction(implementation, signature);
                environment.bind(name, func);
            },
            ast: function ast() {
                return _ast;
            },
            errors: function errors() {
                return _errors;
            }
        };
    }

    jsonata.parser = parser; // TODO remove this in a future release - use ast() instead

    return jsonata;
}();

// node.js only - export the jsonata and parser functions
// istanbul ignore else
if (typeof module !== 'undefined') {
    module.exports = jsonata;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"babel-runtime/core-js/array/from":2,"babel-runtime/core-js/is-iterable":3,"babel-runtime/core-js/json/stringify":4,"babel-runtime/core-js/number/is-integer":5,"babel-runtime/core-js/object/create":6,"babel-runtime/core-js/object/is":7,"babel-runtime/core-js/object/keys":8,"babel-runtime/core-js/promise":9,"babel-runtime/core-js/symbol":10,"babel-runtime/core-js/symbol/iterator":11,"babel-runtime/regenerator":12}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":13}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":14}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/json/stringify"), __esModule: true };
},{"core-js/library/fn/json/stringify":15}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/is-integer"), __esModule: true };
},{"core-js/library/fn/number/is-integer":16}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":17}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/is"), __esModule: true };
},{"core-js/library/fn/object/is":18}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":19}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":20}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":21}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":22}],12:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":115}],13:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":30,"../../modules/es6.array.from":100,"../../modules/es6.string.iterator":108}],14:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');

},{"../modules/core.is-iterable":99,"../modules/es6.string.iterator":108,"../modules/web.dom.iterable":114}],15:[function(require,module,exports){
var core = require('../../modules/_core');
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};

},{"../../modules/_core":30}],16:[function(require,module,exports){
require('../../modules/es6.number.is-integer');
module.exports = require('../../modules/_core').Number.isInteger;

},{"../../modules/_core":30,"../../modules/es6.number.is-integer":102}],17:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};

},{"../../modules/_core":30,"../../modules/es6.object.create":103}],18:[function(require,module,exports){
require('../../modules/es6.object.is');
module.exports = require('../../modules/_core').Object.is;

},{"../../modules/_core":30,"../../modules/es6.object.is":104}],19:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/_core":30,"../../modules/es6.object.keys":105}],20:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
require('../modules/es7.promise.finally');
require('../modules/es7.promise.try');
module.exports = require('../modules/_core').Promise;

},{"../modules/_core":30,"../modules/es6.object.to-string":106,"../modules/es6.promise":107,"../modules/es6.string.iterator":108,"../modules/es7.promise.finally":110,"../modules/es7.promise.try":111,"../modules/web.dom.iterable":114}],21:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/_core":30,"../../modules/es6.object.to-string":106,"../../modules/es6.symbol":109,"../../modules/es7.symbol.async-iterator":112,"../../modules/es7.symbol.observable":113}],22:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/_wks-ext":96,"../../modules/es6.string.iterator":108,"../../modules/web.dom.iterable":114}],23:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],24:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],25:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],26:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":51}],27:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":87,"./_to-iobject":89,"./_to-length":90}],28:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":29,"./_wks":97}],29:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],30:[function(require,module,exports){
var core = module.exports = { version: '2.5.6' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],31:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":63,"./_property-desc":76}],32:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":23}],33:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],34:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":39}],35:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":41,"./_is-object":51}],36:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],37:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":68,"./_object-keys":71,"./_object-pie":72}],38:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":30,"./_ctx":32,"./_global":41,"./_has":42,"./_hide":43}],39:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],40:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":26,"./_ctx":32,"./_is-array-iter":48,"./_iter-call":52,"./_to-length":90,"./core.get-iterator-method":98}],41:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],42:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],43:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":34,"./_object-dp":63,"./_property-desc":76}],44:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":41}],45:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":34,"./_dom-create":35,"./_fails":39}],46:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],47:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":29}],48:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":57,"./_wks":97}],49:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":29}],50:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":51}],51:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],52:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":26}],53:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":43,"./_object-create":62,"./_property-desc":76,"./_set-to-string-tag":81,"./_wks":97}],54:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":38,"./_hide":43,"./_iter-create":53,"./_iterators":57,"./_library":58,"./_object-gpo":69,"./_redefine":78,"./_set-to-string-tag":81,"./_wks":97}],55:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":97}],56:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],57:[function(require,module,exports){
module.exports = {};

},{}],58:[function(require,module,exports){
module.exports = true;

},{}],59:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":39,"./_has":42,"./_is-object":51,"./_object-dp":63,"./_uid":93}],60:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":29,"./_global":41,"./_task":86}],61:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":23}],62:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":26,"./_dom-create":35,"./_enum-bug-keys":36,"./_html":44,"./_object-dps":64,"./_shared-key":82}],63:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":26,"./_descriptors":34,"./_ie8-dom-define":45,"./_to-primitive":92}],64:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":26,"./_descriptors":34,"./_object-dp":63,"./_object-keys":71}],65:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":34,"./_has":42,"./_ie8-dom-define":45,"./_object-pie":72,"./_property-desc":76,"./_to-iobject":89,"./_to-primitive":92}],66:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":67,"./_to-iobject":89}],67:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":36,"./_object-keys-internal":70}],68:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],69:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":42,"./_shared-key":82,"./_to-object":91}],70:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":27,"./_has":42,"./_shared-key":82,"./_to-iobject":89}],71:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":36,"./_object-keys-internal":70}],72:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],73:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":30,"./_export":38,"./_fails":39}],74:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],75:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":26,"./_is-object":51,"./_new-promise-capability":61}],76:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],77:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":43}],78:[function(require,module,exports){
module.exports = require('./_hide');

},{"./_hide":43}],79:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],80:[function(require,module,exports){
'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":30,"./_descriptors":34,"./_global":41,"./_object-dp":63,"./_wks":97}],81:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":42,"./_object-dp":63,"./_wks":97}],82:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":83,"./_uid":93}],83:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":30,"./_global":41,"./_library":58}],84:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":23,"./_an-object":26,"./_wks":97}],85:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":33,"./_to-integer":88}],86:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":29,"./_ctx":32,"./_dom-create":35,"./_global":41,"./_html":44,"./_invoke":46}],87:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":88}],88:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],89:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":33,"./_iobject":47}],90:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":88}],91:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":33}],92:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":51}],93:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],94:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":41}],95:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":30,"./_global":41,"./_library":58,"./_object-dp":63,"./_wks-ext":96}],96:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":97}],97:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":41,"./_shared":83,"./_uid":93}],98:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":28,"./_core":30,"./_iterators":57,"./_wks":97}],99:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};

},{"./_classof":28,"./_core":30,"./_iterators":57,"./_wks":97}],100:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":31,"./_ctx":32,"./_export":38,"./_is-array-iter":48,"./_iter-call":52,"./_iter-detect":55,"./_to-length":90,"./_to-object":91,"./core.get-iterator-method":98}],101:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":24,"./_iter-define":54,"./_iter-step":56,"./_iterators":57,"./_to-iobject":89}],102:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":38,"./_is-integer":50}],103:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":38,"./_object-create":62}],104:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":38,"./_same-value":79}],105:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":71,"./_object-sap":73,"./_to-object":91}],106:[function(require,module,exports){

},{}],107:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":23,"./_an-instance":25,"./_classof":28,"./_core":30,"./_ctx":32,"./_export":38,"./_for-of":40,"./_global":41,"./_is-object":51,"./_iter-detect":55,"./_library":58,"./_microtask":60,"./_new-promise-capability":61,"./_perform":74,"./_promise-resolve":75,"./_redefine-all":77,"./_set-species":80,"./_set-to-string-tag":81,"./_species-constructor":84,"./_task":86,"./_user-agent":94,"./_wks":97}],108:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":54,"./_string-at":85}],109:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":26,"./_descriptors":34,"./_enum-keys":37,"./_export":38,"./_fails":39,"./_global":41,"./_has":42,"./_hide":43,"./_is-array":49,"./_is-object":51,"./_library":58,"./_meta":59,"./_object-create":62,"./_object-dp":63,"./_object-gopd":65,"./_object-gopn":67,"./_object-gopn-ext":66,"./_object-gops":68,"./_object-keys":71,"./_object-pie":72,"./_property-desc":76,"./_redefine":78,"./_set-to-string-tag":81,"./_shared":83,"./_to-iobject":89,"./_to-primitive":92,"./_uid":93,"./_wks":97,"./_wks-define":95,"./_wks-ext":96}],110:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":30,"./_export":38,"./_global":41,"./_promise-resolve":75,"./_species-constructor":84}],111:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":38,"./_new-promise-capability":61,"./_perform":74}],112:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":95}],113:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":95}],114:[function(require,module,exports){
require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":41,"./_hide":43,"./_iterators":57,"./_wks":97,"./es6.array.iterator":101}],115:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":116}],116:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}]},{},[1])(1)
});
