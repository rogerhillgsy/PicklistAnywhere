# Overview

This is the Microsoft PCF control tutorial from [here](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/implementing-controls-using-typescript)

Commands to try

|command|Description|
|--|--|
|npm update|Run this if you have just cloned the project - it will restore all npm dependencies for you.|
|jest --watch|Will start the jest unit test watcher (it will also auto-start when you open the project in vs code.)|
|npm run build|Build the pcf control|
|npm start watch|Run the PCF control locally in a browser.|
|dotnet build||
|pac auth create|Use to log in to the network and create a connection|
|pac org list|List available orgs|
|pac org select|Select a specific org for deployment.|
|pac org who|Show current connection details.|
| **Set up the solution packaging**||
| mkdir PicklistAnywhere||
| cd PicklistAnywhere||
| pac solution init --publisher-name rbhc --publisher-prefix rbhc||
| pac solution add-reference --path ../||
| **These steps below should be** | **sufficient to build and deploy to the "pcf org who" environment**|
|dotnet build|Use in solution directory to build the solution ready for deployment|
|pac solution import|Use in Solution subdirectory. Update the control in CRM. |
|pac solution publish| Publish the unmanaged solution |
|Changes to ControlManifest.Input.xml|Make sure to increase the control version number so that changes appear in CRM|

# Debugging with Fiddler.

The following resources describe how to set up the fiddler autoresponder, and to set up the webpack process to generate source maps.

[Debugging using Fiddler Autoresponder](https://dianabirkelbach.wordpress.com/2020/11/27/pcf-debugging/)

[Configure Webpack to generate source maps](https://dynamicsninja.blog/2020/11/23/debugging-pcf-in-typescript/)

## Process overview

This describes what will be happening during debugging once set up.
- Navigate in the web browser to the form containing the PCF control. (For example the company form, Geographies tab)
- The form loads the bundle file....https://rbhcuk.crm11.dynamics.com/%7b000000005876549%7d/webresources/cc_RBH.PicklistAnywhere/bundle.js
- Fiddler sees this request and replaces the response from the server with a local copy of the bundle file (from .\out\controls\PicklistAnywhere\bundle.js )
- The browser sees the bundle.js file references a source map file.
- The browser tries to load bundle.js.map from the server
- This request is also intercepted by Fiddler and responds with the local bundle.js.map file
- The result of all this is that you can now see (and debug) the original typescript source files in the browser debugger window.

## Setup steps - quick reference

### Fiddler

Use fiddler classic.
Configure two rules (for the bundle.js file itself and to disable caching of the file)
|||
|--|--|
|Rule 1 match|`REGEX:(.*?)(\/css)?(\/|cc_)RBH.PicklistAnywhere.(?'path')`|
|Rule 1 response|`C:\Work\Medium\PicklistAnywhere\out\controls\PicklistAnywhere$2\${path}`|
|Rule 2 match| identical to Rule 1|
|Rule 2 response|`*header:Cache-Control=no-cache, no-store, must-revalidate`|

Set the filter tab/Show only if URL contains to "webresources/cc_"
(Note that the rules do not always display correctly in Markdown viewers - the source **is** correct)

Start Fiddler.

### Webpack.

We need to make sure that the typescript compiler generates a sourcemap, and that webpack includes it in its output.

*tsconfig.json*

Should include `"sourceMap": true` in the compiler options. E.g.: 
``` json
{
    "extends": "./node_modules/pcf-scripts/tsconfig_base.json",
    "compilerOptions": {
        "target" : "ES6",
        "typeRoots": ["node_modules/@types"],
        "sourceMap": true
    }
}
```

*webpackConfig.js*

This is hidden deep in the node_modules folder here: node_modules/pcf-scripts/webpackConfig.js.

In my case I added a line 37: - `        devtool: 'source-map',`

This should look like this: -
``` js
        mode: buildMode,
        watch: watchFlag,
        devtool: 'source-map',
        watchOptions: {
            aggregateTimeout: 500
        },
```

# Put it all together.

Run npm start watch (or npm run build) and you should see it build the bundle.js and bundle.js.map files.

In the browser navigate to the control, and you should then be able to find index.ts and debug from within the browser (and it will refer to the local copy on your machine.)

Any changes to the source should be rebuilt as soon as you save them and will be reflected in the browser following a refresh.
