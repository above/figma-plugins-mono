# Figma Plugins Mono

This repository contains a [collection of Figma plugins and examples](applications/) as well as [guides](guides/) and documentation of our experiments.

# Guides 

## Real-time experiments with Figma

https://user-images.githubusercontent.com/76996973/219697069-3973d9da-1db9-4071-a5a5-ae45ac8e44e9.mp4

In [this guide](guides/real-time_experiments/README.md) we introduce some of the ways we’ve worked with the Figma Plugin API to expand its real-time capabilities beyond phones and laptops. We will be looking at some basics of writing custom plugins for Figma, reading data from different kinds of inputs, and bringing our designs into VR. Finally, we will walk through a demo use case where we are building an interactive UI for a VR planetarium made in Unity.

| ![Rotary Gif](/guides/real-time_experiments/assets/vr_planetarium_nav.gif?raw=true) | ![Hue Select Gif](/guides/real-time_experiments/assets/figma_live_edit.gif?raw=true) |
|:--:|:--:|
|  **Navigating a figma UI using hardware input** | **Collaborative live sketching in VR** |





## Applications

We have created a section with a few examples and templates of Figma plugins that demonstrate how to get going with real-time hardware interactivity in Figma prototypes with Socket.io.

| ![Rotary Gif](/applications/assets/rotary_toggle.gif?raw=true) | ![Hue Select Gif](/applications/assets/hue_select.gif?raw=true) |
|:--:|:--:|
|  **[Rotary Toggle Example](/applications/figma_plugin_examples/rotary_toggle_example/)** | **[Hue Select Example](/applications/figma_plugin_examples/)** |

Here you can also find a few [bridge apps](/applications/bridge_apps/) to communicate with your plugins with MQTT, OSC and Serial.
