/* Rotary Toggle Example
* 
* An example to show how to listen for Socket.io messages
* and update a simple Figma Sketch.  
*  
* Figma file is located in ../rotary_toggle_fig 
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

// Saving nodes with the same name(in Figma) to arrays allows us to keep track of multiple 
// instances and update them simultaneosly 
const rotatorNodes: FrameNode[] = frameNodes.filter(el => el.name === "Rotator");
const tglBtnNodes: EllipseNode[] = ellipseNodes.filter(el => el.name === "ToggleBtn_switch");

// let tgl_btn: EllipseNode;
let tgl_btn_state: boolean;

// Variable to keep track of the rotation angle
let rotationAngle: number = 0;
// Variable to keep track of the button state
let selector: number = 0;

//------------- Init -------------
// Reset initial values, in this case position and state of toggle button
function init() {
  tglBtnNodes.forEach((el) => {
    el.x = 372;
  });

  tgl_btn_state = false;
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

  // Check the type of the message and update the Figma file.
  // If the message is rotate clockwise
  if (msg.type === "ROTARY_CW") {
    // Update the rotation angle and loop (min=-180, max=180)
    rotationAngle = rotationAngle > -180 ? rotationAngle - 10 : 180;
    // Loop over the rotator nodes
    rotatorNodes.forEach((el) => {
      // Set the rotation of the element to the rotation angle
      el.rotation = rotationAngle;
    });

  }

  // If the message is rotate counterclockwise
  if (msg.type === "ROTARY_CCW") {
    rotationAngle = rotationAngle < 180 ? rotationAngle + 10 : -180;
    rotatorNodes.forEach((el) => {
      el.rotation = rotationAngle;
    });


  }

  // If the message is select
  if (msg.type === "SELECT") {
    console.log("Button SELECT msg: " + msg.msg)

    // Check the button state and update the x-position of the switch
    if (tgl_btn_state === false) {
      tglBtnNodes.forEach((el) => {
        el.x = 436;
      });
      tgl_btn_state = true;
    } else {
      tglBtnNodes.forEach((el) => {
        el.x = 372;
      });
      tgl_btn_state = false;
    }
  }

};

//------------- Helpers -------------

// In order to do set certain properties of nodes (ie fill/stroke color) the values need to be cloned first,
// see https://www.figma.com/plugin-docs/editing-properties/ 
function clone(val: number) {
  return JSON.parse(JSON.stringify(val))
}