# figma-node-demo
A mono repository containing Figma plugins, examples and templates

Along with the examples are a few NodeJs bridge apps made to 
relay data and mesasges to the plugins. 

## Figma Plugins

The Figma plugins can be found under  "/figma_plugin_examples"
and contains both a plugin and an example .fig file.

### Current examples

| Example            | Description                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hue Select         | Example showing how to receive Socket.io events from a scroll wheel and momentary switch in Figma, rotate frames, set fill color and text                              |
| Rotary Toggle      | Example showing how to receive Socket.io events from a scroll wheel and momentary switch in Figma to rotate a frame and set the position of a toggle switch            |
| CatFact WebAPI     | Example showing how to fetch json/image data from Web APIs to set text and display images. It also shows how to create layers and objects in the scene from user input |
| Socket.io Template | Template for getting started with Socket.io connections in Figma plugins                                                                                               |

#### CatFact Web API

### Running the examples

To try out the examples:
- clone the repo 
- Download the [Figma Desktop App](https://www.figma.com/downloads/) (Windows/MacOS only...)
- Import the plugin:
  - Run the app and click on "Plugins->Development->Import plugin from manifest... "
  - In the popup dialog navigate to /figma-node-demo/figma_demo_plugin and select "manifest.json"
- Edit the Plugin as needed (find description below)
- Run the plugin from the tab Menu>Plugins>Development 

Note that most of the plugins are listening to Socket.io events.
You can generate them in any number of ways, for example with an Arduino 
one of the bridge apps in the repo.

### Customizing plugins


#### Set up typescript development

To start editing the plugin we must first setup a Typescript development environment.
This requires [NodeJS and NPM](https://nodejs.org/en/download/) installed.

- Install Typescript globaly `$ npm install -g typescript`
- Install Typescript type declarations:
  - Navigate to plugin folder in terminal
  - Run `npm install --save-dev @figma/plugin-typings`
- Setup typescript compilation while editing the plugin
  - Option 1 
    - Install [VSCODE](https://code.visualstudio.com/)
    - If using VSCODE open plugin folder and hit ⌘⇧B (Ctrl-Shift-B for Windows), select tsc: watch - tsconfig.json.
  - Option 2 
    - Navigate to plugin folder in terminal
    - Run `$ tsc -w`  
  - Edit the 'code.ts' and 'ui.html' files as needed
  - Restart plugin (cmd-shift-p/ctrl-shift-p in Figma desktop app)

## Bridge Apps

The so called bridge apps in this repo are simple applications that relays
messages as Socket.io events that can be listened to in the Figma plugins.

### Current apps

| Application        | Language | Description                                                     |
| ------------------ |----------| --------------------------------------------------------------- |
| demo_server_serial | NodeJS   | Bridge app reading serial data and relays it as Socket.io events.   |
| demo_server_osc    | NodeJS   | Bridge app reading OSC messages and relays it as Socket.io events.  |
| demo_server_mqtt   | NodeJS   | Bridge app reading MQTT messages and relays it as Socket.io events. |

## Todo

- Build more plugin examples and templates
- Add real plugins
- Extend/generalize demo_server_mqtt
- Extend demo_server_osc to read multiple values+bundles
- Create more bridge apps

