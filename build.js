const rollup = require('rollup');
const babel  = require('rollup-plugin-babel');
const nodeResolve  = require('rollup-plugin-node-resolve');
const commonjs  = require('rollup-plugin-commonjs');

rollup.rollup({
    entry: './public/javascripts/client.js',
    plugins: [ nodeResolve(), commonjs(), babel() ]
}).then(bundle => {
    bundle.write({
        dest: './public/javascripts/client.min.js',
        sourceMap: true
    });
}).catch(error => console.log(error));