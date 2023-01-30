// Simple template that shows how to get going receiving Socket.io events
// in Figma plugins

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // Check the type of the message and update the Figma file.
  if (msg.type === "EVENT_TITLE") {
    let data = msg.msg;
    // Update Figma scene and change layer properties here
  }

};


