# Title
## Real-time experiments with Figma

![VR/UI split screen](./assets/vr_kay.png?raw=true)

Applications like Figma are great for real-time collaborative design. They allow for quick iterative sketching of visual elements alongside building interactive prototypes and trying out UI/UX flows. While Figma is focused on screen-based prototyping, we found a few good ways to expand its real-time capabilities beyond phones and laptops. The Figma Plugin API allows us to integrate hardware interactions and live communication with other software. Embedding a Figma browser instance in Unity enables us to explore UI designs in a 3D environment.

In this article, we are going to introduce some of the ways we’ve worked with the Figma Plugin API. We will be looking at some basics of writing custom plugins for Figma, reading data from different kinds of inputs, and bringing our designs into VR. Finally, we will walk through a demo use case where we are building an interactive UI for a VR planetarium made in Unity. We have created a small GitHub repository with a few examples and templates.

| ![VR Planetarium](./assets/vr_planetarium_gif.gif?raw=true) |
|:--:|
| <b>Integrating hardware input in Figma and bringing our UI prototype into VR.</b>|

## Building Figma plugins

Figma provides an API we can use to interact with our prototypes through custom plugins that are written in Javascript/Typescript and HTML. When developing we need to run our plugins locally in the Figma Desktop app.

A more comprehensive guide of how plugins are set up and written can be found in the [docs](https://www.figma.com/plugin-docs/), but as a quick introduction, we’ll walk you through how to get it up and running.

### Setup

The quickest way to start writing your own plugins is to use Figmas own plugin template generator. It can be found under the tab **Menu > Plugins > Development > New Plugin…**

In the pop-up window, name the plugin, choose whether it is a Figma “Design+Figjam” or “Figma Design” plugin, and select “With UI & browser APIs”.

The next step is to set up the development environment which requires NodeJS and Npm:

1. Install [NodeJS and NPM]([Visual Studio Code](https://code.visualstudio.com/))
2. Install Typescript globally: 

    `$ npm install -g typescript`

3. Install Typescript type declarations

    Navigate to the plugin folder in the terminal and run: 
    
        `$ npm install — save-dev @figma/plugin-typings`

4. Setup typescript compilation while editing the plugin **(Option 1)**
    * Install [Visual Studio Code](https://code.visualstudio.com/)
    * Open the plugin folder in  VS Code and start compiling with ⌘⇧B or Ctrl-Shift-B and select tsc: watch — tsconfig.json.
5. Setup typescript compilation while editing the plugin **(Option 2)**
    * Navigate to /figma-node-demo/figma_demo_plugin in terminal
    * Run: 
        `$ tsc -watch`

Now you should be able to run the plugin from the Figma desktop application from **Menu > Plugins > Development > NameOfPlugin**.

### Updating the scene

Figma keeps things separated. The main thread of the plugin is running in a sandboxed JS environment which only has access to the Figma scene or document, while an HTML page has access to the Web and the DOM. The main part of the plugin is written in the file “Code.ts” while the “ui.html” file contains the iframe content.

| ![Figma Plugin Structure](./assets/figma_plugin_structure.png?raw=true) |
|:--:|
| <b>How plugins run, source [Figma.com](https://www.figma.com/plugin-docs/how-plugins-run)</b>|

In order to change the properties of layers (or “nodes” as they are called) in the Figma scene we need to access them in our “code.ts” file. Nodes have different types such as `“TEXT”`, `“FRAME”`, `“RECTANGLE”` etc which we can use to find elements we have already created in the scene. The allegedly fastest way is to use the `node.findAllWithCriteria()` method to get all the text nodes:

```
const textNodes = node.findAllWithCriteria({
 types: [TEXT]
})
```

To get a specific node in the page we can for example use its layer name in the scene, which we can get with node.name. If you have multiple instances of an object with the same name and want to update them simultaneously you can filter or loop through them and store all instances of a node in an array.

```
const myTextArray: TextNode[] = textNodes.filter(el => el.name === "My Text");
```

Depending on the type of a node we have access to different properties, i.e. text nodes have a `.character` property but no `.cornerRadius` and vice versa for say a rectangle node. To change a property we can set, for example, the opacity and position of a node with:

```
node.opacity = 1
node.x = 500
```

Certain properties have some quirks (see the [docs](https://www.figma.com/plugin-docs/editing-properties)). For example, to set the characters of a text node we need to first load the fonts present in our Figma scene:

```
const loadFonts = async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
}
```

When we’ve loaded the fonts, we can set it.

```
textNode.characters = "Example Text";
```

Setting fill and stroke color is another property that needs to be handled in a more considerate way, you can find a good explanation [here](https://www.figma.com/plugin-docs/editing-properties) or see some of our examples in this repo.

This is, of course, only scratching the surface of what Figma plugins are capable of. As easily as we can update nodes, we can create new ones, or delete and manipulate them in numerous ways. We can gather data from Web APIS or create interactive UIs in the HTML page, and of course, interact with external hardware and software.


### Opening up to the outside world

| ![Figma plugin HW input](./assets/figma_hw_colorwheel.gif?raw=true) |
|:--:|
| <b>Using hardware inputs to update a Figma scene</b>|

Writing plugins for Figma gives us the tools to connect our scene to web APIs, microcontrollers such as Arduino or external software and tools. We can use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) directly in the plugin to request resources, or we can use the network access of the UI iframe to receive data.

There are some really inspiring examples of combining Figma with external tools.
| ![Figma plugin HW input](./assets/charli_gerard_figma_ctrl-reduce.gif?raw=true) | ![Figma plugin HW input](./assets/siddharth_ahuja_figma_ctrl.gif?raw=true) |
|:--:|:--:|
[ **Charlie Gerard is controlling Figma with hand movements [source](https://charliegerard.dev/blog/hand-control-ui-figma-plugin/)** | **Sidddharth Ahuja is using facial expressions [source](https://twitter.com/sidahuj/status/1437443359224655874).** |



We’ve been following [Charlie Gerard’s](https://charliegerard.dev/blog/hand-control-ui-figma-plugin/) lead on using [Socket.io](https://socket.io/) to communicate with our plugin. Our way of going about it has been to create minimal bridge apps that take in whatever data we need and relay it as Sockets.io events. In this way, we can quickly switch things around and hook up new hardware without having to rewrite our plugins or modify the source. These bridges are built as NodeJS/Express servers listening to for example Serial, MQTT, Open Sound Control, or any particular protocol that our external hard/software is using.

As mentioned above, we need to pass the data via the “ui.html” file, where we can access the Web or listen to events.

Start by adding Socket.io within script tags to our HTML page…

```
<!-- Load Socket.io -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js"></script>

<!-- Create Connection -->
<script>
  // Set PORT to the same port as server/bridge app is using
  const PORT = 3000

  // Connect to server
  let socket = io(`ws://localhost:${PORT}`, { transports: ["websocket"] });
</script>
```

…and listen for the event and relay the data to the plugin with the `window.postMessage()` method.

```
<!-- Listen to Events-->
<script> 
socket.on("EVENT_TITLE", (msg) => {
    parent.postMessage({ pluginMessage: { type: "EVENT_TITLE", msg } }, "*");
  });
</script>
```

The event messages can then be received and handled in the main ‘code.ts’ plugin file.

```
figma.ui.onmessage = (msg) => {  
if (msg.type === "EVENT_TITLE") {
 let data = msg.msg;
  // Update the Figma scene and change node properties
  // with the data 
  }
});
```

## Figma in VR

When designing for AR, or other types of spatial interfaces, VR can be a useful exploration tool. Game engines like Unity make it possible to immerse oneself in a different environment and experience a concept in a specific context. However, building these applications tends to be slow and a development-heavy process. Especially when adding UI layers, hardware inputs, and interactions to the 3D environment.

Integrating Figma into our VR prototypes gives us a tool for quick, iterative, and collaborative sketching. Making any change to the Figma scene will immediately update in the VR application.

| ![Figma VR live edit](./assets/figma_live_edit.gif?raw=true) |
|:--:|
| **Editing the Figma scene updates all prototype instances and enables real-time collaborative sketching in VR.** |

To render Figma prototypes in a VR environment, we simply need a browser window opening a prototype’s URL. And if we want to use it as an overlay, we need to find a way to achieve a transparent background.

We have been building our VR applications in Unity for the Oculus Quest 2 headset. As a browser, we are using the [Vuplex Unity plugin](https://assetstore.unity.com/packages/tools/gui/3d-webview-for-android-with-gecko-engine-web-browser-158778) which runs on the Gecko engine for android. There are many other plugins and custom solutions for implementing a browser for this and other platforms.

The workflow looks something like this:

1. Set up the VR scene for your appropriate headset
2. Create a canvas that displays a browser window
3. Set the browser URL to the Figma prototype
4. Scale the browser window to cover the view and, if you want the overlay to be static, parent it to the camera
5. Since the GeckoEngine doesn’t support transparency, we need to work around it by making all black pixels transparent in order for the background to become transparent
6. With the Vuplex plugin for Android Gecko Engine, we can use the `SetCutoutRect()` method:
    
     `_webViewPrefab.SetCutoutRect(new Rect(0, 0, 1, 1));`

    * Alternatively, a custom shader could achieve the same result.


## Putting it all together

When the capabilities of Unity are combined with the flexibility of Figma, we can create a workflow that allows us to collaborate across the team on UI design concepts in VR. To show what such a workflow can look like, we put together a small demo application in the form of a VR planetarium for the Oculus Quest 2 headset with a UI overlay that can be navigated by a scroll wheel and a push button. The following video shows a VR application using Figma and Arduino to create a customizable real-time UI.

<p style="text-align:center;">
<video width="640" height="380" controls>
  <source src="./assets/planetarium_full_reduce.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
</p>

### Building out the prototype

First, we created a UI scene in Figma consisting of a menu and multiple frames containing the “modes” of some possible tools to explore the night sky. We set up a Figma plugin and connected the physical inputs to navigate the menu, update objects and toggle overlays. For wireless communication with our plugin, we used an ESP32 board to be able to send OSC data over Wifi to a bridge app.

| ![Figma VR HW navigation](./assets/vr_planetarium_nav.gif?raw=true) |
|:--:|
| **Navigating a menu and selecting "mode" in a Figma prototype with hardware** |

We then built a Unity app with a starry sky we could explore in the VR headset. We wanted to send data from the headset to our Figma plugin and since we were already using OSC, we could use it in Unity as well. This way, we can let Figma know in which direction we are looking, and where we are in the world and use raycasting to identify what we are looking at (and any other data we would need).

Here we are reading the tilt angle and compass direction as well as identifying if we are looking at a specific constellation and tracking the International Space Station.

| ![Figma VR Constellation Finder](./assets/vr_planetarium_constellation.gif?raw=true) |
|:--:|
| ![Figma VR ISS Finder](./assets/vr_planetarium_iss.gif?raw=true) |
| **Detecting what we are looking at in Unity and sending the data to Figma to update the UI.** |


Finally, we put everything together and now have an interactive VR application with external input and a flexible UI built in Figma. We can collaborate on the design across the team and run it in real-time in a 3D environment, and we can try out different hardware input configurations and interactions.

| ![VR Planetarium](./assets/vr_planetarium_gif.gif?raw=true) |
|:--:|
| <b>Integrating hardware input in Figma and bringing our UI prototype into VR.</b>|
