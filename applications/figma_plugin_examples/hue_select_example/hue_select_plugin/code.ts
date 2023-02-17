/* Hue Select Example
* 
* An example to show how to listen for Socket.io messages
* and update a simple Figma Sketch.  
*  
* Figma file is located in ../hue_select_fig 
* 
* Above, 2022 
*/


// This shows the HTML page in "ui.html".
figma.showUI(__html__);

//------------- Load fonts -------------

// It is important load all fonts used in the figma sketch
// Add all fonts used
const loadFonts = async () => {
  await figma.loadFontAsync({ family: "Arial", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
}

loadFonts();

//------------- Get all nodes from the figma page -------------
// find nodes of specific types
const frameNodes = figma.currentPage.findAllWithCriteria({
  types: ['FRAME']
});

const ellipseNodes = figma.currentPage.findAllWithCriteria({
  types: ['ELLIPSE']
});

const rectNodes = figma.currentPage.findAllWithCriteria({
  types: ['RECTANGLE']
});

const textNodes = figma.currentPage.findAllWithCriteria({
  types: ['TEXT']
});

// Saving nodes with the same name(in Figma) to arrays allows us to keep track of multiple 
// instances and update them simultaneosly.
// Check for a specific node name and store them
const rotatorNodes: FrameNode[] = frameNodes.filter(el => el.name === "Rotator");
const colorSelectNodes: EllipseNode[] = ellipseNodes.filter(el => el.name === "ColorSelect");
const rgbSelectLableNodes: TextNode[] = textNodes.filter(el => el.name === "RGB_select_label");
const hexSelectLableNodes: TextNode[] = textNodes.filter(el => el.name === "HEX_select_label");
const colorRect: RectangleNode[] = rectNodes.filter(el => el.name === "ColorRect");

let rotationAngle: number = 0;
let selector: number = 0;

//------------- Init -------------
// Set Rotator angle and color on load rectangle

function init() {
    rotatorNodes.forEach((el) => {
      el.rotation = rotationAngle;
    });

    colorRect.forEach((el) => {
      setFillColorHue(el, rotationAngle);
    })
} 

init();

//------------- Receive messages and update Figma -------------
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.ui.onmessage = (msg) => {
  console.log(String(msg.msg));

  // Send current message back to be displayed in the UI window
  const monitor_msg = msg.msg !== null ? String(msg.type) + " | " + String(msg.msg) : String(msg.type);
  figma.ui.postMessage(monitor_msg);

  if (msg.type === "ROTARY_CW") {
    rotationAngle = rotationAngle > -180 ? rotationAngle - 10 : 180;
    rotatorNodes.forEach((el) => {
      el.rotation = rotationAngle;
    });


    colorRect.forEach((el) => {
      setFillColorHue(el, rotationAngle);
    })

  }

  if (msg.type === "ROTARY_CCW") {
    rotationAngle = rotationAngle < 180 ? rotationAngle + 10 : -180;
    rotatorNodes.forEach((el) => {
      el.rotation = rotationAngle;
    });

    colorRect.forEach((el) => {
      setFillColorHue(el, rotationAngle);
    })

  }

  if (msg.type === "SELECT") {
    console.log("Button SELECT msg: " + msg.msg)

    colorSelectNodes.forEach((el) => {
      setFillColorHue(el, rotationAngle);
    });


    rgbSelectLableNodes.forEach((el) => {
      let angl = 360 - (rotationAngle + 180);
      let rgb = HSVtoRGB(angl, 1, 1);
      let rgbStr = `RGB: ${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)}`;
      setText(el, rgbStr);
    });

    hexSelectLableNodes.forEach((el) => {
      let angl = 360 - (rotationAngle + 180);
      let rgb = HSVtoRGB(angl, 1, 1);
      let hexStr = `HEX: ${RGBToHex(Math.round(rgb[0]*255),Math.round(rgb[1]*255),Math.round(rgb[2]*255))}`;
      setText(el, hexStr);
    });

  }
};

//------------- Helper Functions -------------

//Helper to check if sceneNode is textNode
function isText(node: SceneNode): node is TextNode {
  return node.type === "TEXT"
}

//Helper to set text of textNode
function setText(textNode: SceneNode, inputText: string) {

  if (isText(textNode)) {
    textNode.characters = inputText;
  }
}

// In order to do set certain properties of nodes (ie fill/stroke color) the values need to be cloned first,
// see https://www.figma.com/plugin-docs/editing-properties/ 
function clone(val: number) {
  return JSON.parse(JSON.stringify(val))
}

function setStrokeColorRGB(node: any, r: number, g: number, b: number) {
      const strokes = clone(node.strokes)
      strokes[0].color.r = r;
      strokes[0].color.g = g;
      strokes[0].color.b = b;
      node.strokes = strokes;
}

function setFillColorRGB(node: any, r: number, g: number, b: number) {
      const fills = clone(node.fills)
      fills[0].color.r = r;
      fills[0].color.g = g;
      fills[0].color.b = b;
      node.fills = fills;
}

function setStrokeColorHue(node: any, angle: number) {
      let angleNorm = (angle + 180) / 360;
      let angl = 360 - (rotationAngle + 180);
      let rgb = HSVtoRGB(angl, 1, 1);

      console.log( "angle: " + angl + " | " + rgb[0] + " : " + rgb[1] + " : " + rgb[2] );
      const strokes = clone(node.strokes)
      strokes[0].color.r = rgb[0];
      strokes[0].color.g = rgb[1];
      strokes[0].color.b = rgb[2];
      node.strokes = strokes;
}

function setFillColorHue(node: any, angle: number) {
      let angleNorm = (angle + 180) / 360;
      let angl = 360 - (rotationAngle + 180);
      let rgb = HSVtoRGB(angl, 1, 1);

      console.log( "angle: " + angl + " | " + rgb[0] + " : " + rgb[1] + " : " + rgb[2] );
      const fills = clone(node.fills)
      fills[0].color.r = rgb[0];
      fills[0].color.g = rgb[1];
      fills[0].color.b = rgb[2];
      node.fills = fills;
}


// HSV to RGB 
// See user Sigalor in
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653
function mix(a: number, b: number, v: number)
{
    return (1-v)*a + v*b;
}

function HSVtoRGB(H: number, S: number, V: number) {
  var V2 = V * (1 - S);
  var r = ((H >= 0 && H <= 60) || (H >= 300 && H <= 360)) ? V : ((H >= 120 && H <= 240) ? V2 : ((H >= 60 && H <= 120) ? mix(V, V2, (H - 60) / 60) : ((H >= 240 && H <= 300) ? mix(V2, V, (H - 240) / 60) : 0)));
  var g = (H >= 60 && H <= 180) ? V : ((H >= 240 && H <= 360) ? V2 : ((H >= 0 && H <= 60) ? mix(V2, V, H / 60) : ((H >= 180 && H <= 240) ? mix(V, V2, (H - 180) / 60) : 0)));
  var b = (H >= 0 && H <= 120) ? V2 : ((H >= 180 && H <= 300) ? V : ((H >= 120 && H <= 180) ? mix(V2, V, (H - 120) / 60) : ((H >= 300 && H <= 360) ? mix(V, V2, (H - 300) / 60) : 0)));

  return [
    r,
    g,
    b
  ]
}

// RGB to HEX values 
function RGBToHex(r_: number,g_: number,b_: number): string {
  let r = r_.toString(16);
  let g = g_.toString(16);
  let b = b_.toString(16);

  r = r.length === 1 ? "0" + r : r;
  g = g.length === 1 ? "0" + g : g;
  b = b.length === 1 ? "0" + b : b;

  return "#" + r + g + b;
}