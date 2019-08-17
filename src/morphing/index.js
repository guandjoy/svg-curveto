"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Layers
var index_1 = __importDefault(require("../path/index"));
var getType = function (item) {
    if (Array.isArray(item))
        return "array";
    if (typeof item === "object")
        return "object";
    if (typeof item === "number")
        return "number";
};
var getValueFromRange = function (values, numOfKeyPaths, index) {
    var min = Math.min.apply(Math, values);
    var max = Math.max.apply(Math, values);
    return ((max - min) / numOfKeyPaths) * index + min;
};
function morphingLayer(parameters, keyPathsParameters) {
    /*
     * Generate paths and return string for values option of animate tag.
     * Example:
     *   <animate values={values} ... />
     *
     * Figure out first how pathLayer works.
     */
    if (parameters === void 0) { parameters = defaults.parameters; }
    if (keyPathsParameters === void 0) { keyPathsParameters = defaults.keyPathsParameters; }
    var generateDValues = function () {
        var numOfKeyPaths = parameters.numOfKeyPaths, loop = parameters.loop;
        var inputKeyPathsParameters = keyPathsParameters; // Maybe need to refactor
        var paths = [];
        var dValues = [];
        for (var i = 0; i < numOfKeyPaths; i++) {
            var pathParameters = {};
            for (var key in inputKeyPathsParameters) {
                // Set parameters for 'i' key path
                if (key === "groups") {
                    if (getType(inputKeyPathsParameters[key][0] === "object"))
                        // One setup for all key paths groups
                        pathParameters[key] = inputKeyPathsParameters[key];
                    else
                        pathParameters[key] = inputKeyPathsParameters[key];
                    console.log("group param", pathParameters[key]);
                }
                else if (typeof inputKeyPathsParameters[key] !== "object") {
                    // if one value for all paths
                    pathParameters[key] = inputKeyPathsParameters[key];
                }
                else {
                    if (inputKeyPathsParameters[key].length === numOfKeyPaths)
                        // if individual values for each path
                        pathParameters[key] = inputKeyPathsParameters[key][i];
                    else if (inputKeyPathsParameters[key].length === 2)
                        // calculate value from [min number, max number] range
                        pathParameters[key] = getValueFromRange(inputKeyPathsParameters[key], numOfKeyPaths, i);
                    else
                        throw "Wrong '" + key + "' parameter array at " + i + " key path";
                }
            }
            var path = index_1.default(pathParameters);
            paths[i] = path;
            dValues[i] = path.d;
            if (loop && i !== numOfKeyPaths - 1)
                dValues[(numOfKeyPaths - 1) * 2 - i] = path.d;
        }
        dValues = dValues.join(";");
        return dValues;
    };
    var output = {};
    output.dValues = generateDValues();
    return output;
}
var defaults = {
    parameters: {
        loop: true,
        numOfKeyPaths: 3
    },
    keyPathsParameters: {
        numOfSegments: 3,
        depth: 0,
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        centerX: 100,
        centerY: 100,
        rotate: 0,
        numOfGroups: 2,
        incircle: true,
        groups: [
            [
                {
                    type: "radial",
                    distance: 1,
                    round: 1
                },
                {
                    type: "radial",
                    distance: 1,
                    round: 1
                }
            ],
            [
                {
                    type: "radial",
                    distance: 1,
                    round: 0.4
                },
                {
                    type: "linear",
                    distance: 0.6,
                    round: 3
                }
            ],
            [
                {
                    type: "radial",
                    distance: 1,
                    round: 0.1
                },
                {
                    type: "linear",
                    distance: 1,
                    round: 3
                }
            ]
        ]
    }
};
exports.default = morphingLayer;
