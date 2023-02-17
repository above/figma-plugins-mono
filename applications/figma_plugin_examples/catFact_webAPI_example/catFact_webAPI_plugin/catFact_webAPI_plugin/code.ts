/* A simple example plugin that shows how to 
* fetch json and image data fom Web APIs
* and creat a card with a frame, image, 
* title and generated text
*/

// This shows the HTML page in "ui.html".
figma.showUI(__html__);


// some arbitrary parameters
const width: number = 200;
const height: number = 300;
const offset: number = 50;
const textPaddingW: number = 10;
const textPaddingH: number = 40;

let originX: number = 0;

// Add all fonts used
const loadFonts = async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
}

// Load fonts
loadFonts();


// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {

  // Receice messages by type
  if (msg.type === 'CAT_FACT') {
    // Create an array for Scene nodes
    const nodes: SceneNode[] = [];

    // Create Frame and set properties
    const frame = figma.createFrame();
    frame.x = originX;
    frame.resize(width, height);
    frame.clipsContent = true;

    // Fetch image from API and create rectangle with image as fill
    fetch('https://cataas.com/cat?width=200')
      .then(response => response.arrayBuffer())
      .then(data => {
        // get Uint8Array form bufferArray
        const buffer = new Uint8Array(data);

        // Create Rectangle
        const rect = figma.createRectangle();
        // Create Image
        const img = figma.createImage(buffer);

        rect.resize(width, height / 2);
        // Set fill from image
        rect.fills = [{ type: 'IMAGE', scaleMode: "FILL", imageHash: img.hash }];
        // Append Image to frame
        frame.appendChild(rect);
      })
      .catch(err => {
        // handle the error
        console.log(err);
      });

    // Create title text node and adjust properties
    const titleText = figma.createText();
    titleText.x = textPaddingW;
    titleText.y = (height / 2) + textPaddingW;
    titleText.fontSize = 18;
    setText(titleText, "Random Cat Fact");
    titleText.fontName = { family: "Inter", style: "Bold" };
    frame.appendChild(titleText);


    // Fetch a cat fact from API
    fetch('https://catfact.ninja/fact')
      .then(response => response.json())
      .then(data => {
        // Create fact text node
        const factText = figma.createText();
        factText.x = textPaddingW;
        factText.y = (height / 2) + textPaddingH;
        factText.fontName = { family: "Inter", style: "Regular" };
        factText.resize(width - (textPaddingW * 2), height - (textPaddingH * 2));
        factText.textAutoResize = 'NONE';

        // Set text of node
        setText(factText, data.fact);

    
        frame.appendChild(factText);
      })
      .catch(err => {
        // handle the error
        console.log(err);
      });


    // Add frame to node array
    nodes.push(frame);

    // Append frame the Figma Document 
    figma.currentPage.appendChild(frame);

    // Select and set viewport to focus on our frame
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);


    // update origin, ie where the next frame will be generated
    originX += (width + offset);

  }
}

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