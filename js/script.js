
const DATA_URL = "./data/data.json";

let appData = null;
let currentLang = "en";
let activeSceneId = "market-courtyard";

let vrLocationMenu = null;
let vrLocationPanel = null;
let vrLocationButtons = [];

const $ = (selector) => document.querySelector(selector);


// LOAD PROJECT DATA
async function loadProjectData() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Could not load data.json (${response.status})`);
    }

    appData = await response.json();

    buildSitePlanButtons();
    buildVRLocationMenu();
    updateLanguage(currentLang);
    switchScene(activeSceneId, false);

  } catch (error) {
    console.error("Project data loading failed:", error);

    $("#info-title").textContent = "Unable to load tour data";

    $("#info-text").textContent =
      "Check that the project is being served through a local web server and that data/data.json exists.";
  }
}


// GET SCENE
function getScene(sceneId) {
  return appData?.scenes.find((scene) => scene.id === sceneId);
}


// GET LANGUAGE TEXT
function getLocalized(value) {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value[currentLang] || value.en || "";
}


// BUILD SITE PLAN BUTTONS
function buildSitePlanButtons() {
  const container = $("#plan-nav-bar");

  container.replaceChildren();

  appData.scenes.forEach((scene) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "plan-nav-btn";
    button.dataset.sceneId = scene.id;
    button.textContent = getLocalized(scene.name);

    button.addEventListener("click", () => {
      $("#siteplan-modal").classList.add("hidden");
      switchScene(scene.id);
    });

    container.appendChild(button);
  });
}


// BUILD VR LOCATION MENU
function buildVRLocationMenu() {

  const camera = $("#camera");

  if (!camera || vrLocationMenu) return;


  // CAMERA-ANCHORED MENU
  vrLocationMenu = document.createElement("a-entity");

  vrLocationMenu.setAttribute("id", "vr-location-menu");

 vrLocationMenu.setAttribute(
  "position",
  "-2.2 0 -1.8"
);

  vrLocationMenu.setAttribute("visible", "false");

  camera.appendChild(vrLocationMenu);


// STYLIZED CIRCULAR ARROW BUTTON
const arrowButton = document.createElement("a-entity");

arrowButton.setAttribute("class", "clickable");


// GREEN OUTER RING
const arrowRing = document.createElement("a-torus");

arrowRing.setAttribute("radius", "0.15");
arrowRing.setAttribute("radius-tubular", "0.012");

arrowRing.setAttribute(
  "material",
  "shader: flat; color: #2ecc71; side: double"
);

arrowButton.appendChild(arrowRing);


// DARK CIRCLE BACKGROUND
const arrowBackground = document.createElement("a-circle");

arrowBackground.setAttribute("radius", "0.14");
arrowBackground.setAttribute("class", "clickable");

arrowBackground.setAttribute(
  "material",
  "shader: flat; color: #0f172a; opacity: 0.88; transparent: true; side: double"
);

arrowBackground.setAttribute("position", "0 0 0.005");

arrowButton.appendChild(arrowBackground);


// ARROW SYMBOL
const arrowText = document.createElement("a-text");

arrowText.setAttribute("value", ">");

arrowText.setAttribute("position", "0 0 0.025");

arrowText.setAttribute("align", "center");
arrowText.setAttribute("anchor", "center");
arrowText.setAttribute("color", "#2ecc71");
arrowText.setAttribute("width", "1.5");
arrowText.setAttribute("scale", "1.4 1.4 1.4");

arrowButton.appendChild(arrowText);


// HOVER EFFECT
arrowButton.addEventListener("mouseenter", () => {
  arrowBackground.setAttribute(
    "material",
    "shader: flat; color: #145c32; opacity: 1; side: double"
  );
});

arrowButton.addEventListener("mouseleave", () => {
  arrowBackground.setAttribute(
    "material",
    "shader: flat; color: #0f172a; opacity: 0.88; transparent: true; side: double"
  );
});

vrLocationMenu.appendChild(arrowButton);


// LOCATION PANEL
  vrLocationPanel = document.createElement("a-entity");

  vrLocationPanel.setAttribute(
    "position",
    "0.68 0 0"
  );

  vrLocationPanel.setAttribute("visible", "false");


  // PANEL BACKGROUND
  const panelBackground = document.createElement("a-plane");

  panelBackground.setAttribute("width", "1.12");
  panelBackground.setAttribute("height", "1.25");

  panelBackground.setAttribute(
    "material",
    "shader: flat; color: #0f172a; opacity: 0.94; side: double"
  );

  vrLocationPanel.appendChild(panelBackground);


  // LOCATION BUTTONS
  vrLocationButtons = [];

  appData.scenes.forEach((scene, index) => {

    const button = document.createElement("a-plane");

    const yPosition = 0.42 - (index * 0.21);

    button.setAttribute(
      "position",
      `0 ${yPosition} 0.02`
    );

    button.setAttribute("width", "0.98");
    button.setAttribute("height", "0.17");

    button.setAttribute(
      "material",
      "shader: flat; color: #263449; side: double"
    );

    button.setAttribute("class", "clickable");


    // LOCATION LABEL
    const label = document.createElement("a-text");

    label.setAttribute(
      "value",
      getLocalized(scene.name)
    );

    label.setAttribute("position", "0 0 0.02");

    label.setAttribute("align", "center");
    label.setAttribute("anchor", "center");
    label.setAttribute("color", "#ffffff");
    label.setAttribute("width", "0.95");
    label.setAttribute("wrap-count", "20");

    button.appendChild(label);


    // SWITCH LOCATION
    button.addEventListener("click", () => {

      switchScene(scene.id);

      vrLocationPanel.setAttribute("visible", "false");

      arrowText.setAttribute("value", ">");

    });


    // HOVER EFFECT
    button.addEventListener("mouseenter", () => {

      button.setAttribute(
        "material",
        "shader: flat; color: #2ecc71; side: double"
      );

    });


    button.addEventListener("mouseleave", () => {

      button.setAttribute(
        "material",
        scene.id === activeSceneId
          ? "shader: flat; color: #145c32; side: double"
          : "shader: flat; color: #263449; side: double"
      );

    });


    vrLocationButtons.push({
      element: button,
      label: label,
      sceneId: scene.id
    });

    vrLocationPanel.appendChild(button);

  });


  vrLocationMenu.appendChild(vrLocationPanel);


  // OPEN AND CLOSE LOCATION PANEL
  arrowBackground.addEventListener("click", () => {

    const isOpen =
      vrLocationPanel.getAttribute("visible") === true;

    const shouldOpen = !isOpen;

    vrLocationPanel.setAttribute(
      "visible",
      shouldOpen
    );

    arrowText.setAttribute(
      "value",
      shouldOpen ? "<" : ">"
    );

  });

}


// UPDATE VR LOCATION LABELS
function updateVRLocationLabels() {

  vrLocationButtons.forEach((item) => {

    const scene = getScene(item.sceneId);

    if (scene) {
      item.label.setAttribute(
        "value",
        getLocalized(scene.name)
      );
    }

  });

}


// UPDATE ACTIVE LOCATION BUTTON
function updateVRLocationActiveState() {

  vrLocationButtons.forEach((item) => {

    const isActive = item.sceneId === activeSceneId;

    item.element.setAttribute(
      "material",
      isActive
        ? "shader: flat; color: #145c32; side: double"
        : "shader: flat; color: #263449; side: double"
    );

  });

}


// VR MODE EVENTS
function bindVRModeEvents() {

  const scene = $("#vr-scene");

  scene.addEventListener("enter-vr", () => {

    if (vrLocationMenu) {
      vrLocationMenu.setAttribute("visible", "true");
    }

    if (vrLocationPanel) {
      vrLocationPanel.setAttribute("visible", "false");
    }

  });


  scene.addEventListener("exit-vr", () => {

    if (vrLocationMenu) {
      vrLocationMenu.setAttribute("visible", "false");
    }

    if (vrLocationPanel) {
      vrLocationPanel.setAttribute("visible", "false");
    }

  });

}


// UPDATE SITE PLAN LABELS
function updateSitePlanLabels() {

  document.querySelectorAll(".plan-nav-btn").forEach((button) => {

    const scene = getScene(button.dataset.sceneId);

    if (scene) {
      button.textContent = getLocalized(scene.name);
    }

  });

}


// UPDATE LANGUAGE
function updateLanguage(language) {

  if (!appData?.translations?.[language]) return;

  currentLang = language;

  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {

    const key = element.dataset.i18n;
    const value = appData.translations[language][key];

    if (value) {
      element.textContent = value;
    }

  });

  $("#lang-label").textContent =
    language === "en" ? "EN / TE" : "TE / EN";

  updateSitePlanLabels();
  updateVRLocationLabels();

  const scene = getScene(activeSceneId);

  if (scene) {
    renderInfo(scene);
  }

  renderWaypoints(scene);

}


// RENDER INFORMATION PANEL
function renderInfo(scene) {

  if (!scene) return;

  $("#info-title").textContent = getLocalized(scene.name);

  const info = getLocalized(scene.info);

  $("#info-text").textContent =
    info || appData.translations[currentLang].no_info;

}


// REGISTER HOTSPOT EVENTS
function registerHotspotEvents() {

  if (AFRAME.components.hotspot) return;

  AFRAME.registerComponent("hotspot", {

    schema: {
      target: { type: "string" },
      label: { type: "string" }
    },

    init: function () {

      this.el.addEventListener("mouseenter", () => {

        $("#info-panel").classList.add("open");
        $("#info-btn").classList.add("open");

        $("#info-title").textContent = this.data.label;

        $("#info-text").textContent =
          appData.translations[currentLang].waypoint_hint;

      });


      this.el.addEventListener("mouseleave", () => {

        const scene = getScene(activeSceneId);

        if (scene) {
          renderInfo(scene);
        }

      });


      this.el.addEventListener("click", () => {

        if (this.data.target) {
          switchScene(this.data.target);
        }

      });

    }

  });

}


// RENDER WAYPOINTS AND LABELS
function renderWaypoints(scene) {

  const layer = $("#hotspot-layer");

  layer.replaceChildren();

  if (!scene?.waypoints?.length) return;


  scene.waypoints.forEach((waypoint) => {

    const targetScene = getScene(waypoint.target);

    if (!targetScene) return;


    const labelText =
      getLocalized(waypoint.label) ||
      getLocalized(targetScene.name);


    // GET WAYPOINT POSITION
    const position = waypoint.position
      .trim()
      .split(/\s+/)
      .map(Number);

    if (position.length !== 3 || position.some(Number.isNaN)) {
      console.warn("Invalid waypoint position:", waypoint);
      return;
    }


    // CREATE SEPARATE LABEL
    const label = document.createElement("a-text");

    label.setAttribute("value", labelText);

    label.setAttribute(
      "position",
      `${position[0]} ${position[1] + 0.55} ${position[2]}`
    );

    label.setAttribute("align", "center");

    label.setAttribute("anchor", "center");

    label.setAttribute("color", "#ffffff");

    label.setAttribute("width", "4");

    label.setAttribute("look-at", "#camera");

    label.setAttribute(
      "material",
      "shader: flat; transparent: true"
    );

    layer.appendChild(label);

  });

}


// SWITCH SCENES
function switchScene(sceneId, animate = true) {

  const scene = getScene(sceneId);

  if (!scene) {
    console.warn(`Scene not found: ${sceneId}`);
    return;
  }

  activeSceneId = sceneId;

  const sky = $("#skybox");


  const applyScene = () => {

    sky.setAttribute("src", scene.image);

    sky.setAttribute("rotation", scene.rotation || "0 0 0");

    renderInfo(scene);

    renderWaypoints(scene);

    document.querySelectorAll(".plan-nav-btn").forEach((button) => {
  button.classList.remove("active");
});

    updateVRLocationActiveState();

  };


  if (!animate) {
    applyScene();
    return;
  }


  sky.setAttribute("animation__fadeout", {
    property: "material.opacity",
    to: 0,
    dur: 250,
    easing: "easeInOutQuad"
  });


  window.setTimeout(() => {

    applyScene();

    sky.setAttribute("animation__fadein", {
      property: "material.opacity",
      to: 1,
      dur: 300,
      easing: "easeInOutQuad"
    });

  }, 260);

}


// BIND BUTTON CONTROLS
function bindControls() {


  // START TOUR
  $("#btn-start").addEventListener("click", () => {

    $("#welcome-screen").classList.add("hidden");

    $("#sidebar-menu").classList.add("visible");

    $("#info-btn").classList.add("visible");

    switchScene(activeSceneId);

  });


  // HOME BUTTON
  $("#btn-home").addEventListener("click", () => {

    $("#siteplan-modal").classList.add("hidden");

    $("#info-panel").classList.remove("open");

    $("#info-btn").classList.remove("open", "visible");

    $("#sidebar-menu").classList.remove("visible");

    activeSceneId = "market-courtyard";

    $("#welcome-screen").classList.remove("hidden");

  });


  // INFORMATION BUTTON
  $("#info-btn").addEventListener("click", () => {

    const isOpen = $("#info-panel").classList.toggle("open");

    $("#info-btn").classList.toggle("open", isOpen);

    const scene = getScene(activeSceneId);

    if (isOpen && scene) {
      renderInfo(scene);
    }

  });


  // SITE PLAN BUTTON
  $("#btn-siteplan").addEventListener("click", () => {

    $("#siteplan-modal").classList.remove("hidden");

  });


  // CLOSE SITE PLAN
  $("#btn-close-plan").addEventListener("click", () => {

    $("#siteplan-modal").classList.add("hidden");

  });


  // VR MODE BUTTON
  $("#btn-vr").addEventListener("click", () => {

    const scene = $("#vr-scene");

    if (scene?.enterVR) {
      scene.enterVR();
    }

  });


  // LANGUAGE BUTTON
  $("#btn-lang").addEventListener("click", () => {

    updateLanguage(currentLang === "en" ? "te" : "en");

  });


  // CLOSE SITE PLAN BY CLICKING OUTSIDE
  $("#siteplan-modal").addEventListener("click", (event) => {

    if (event.target.id === "siteplan-modal") {
      $("#siteplan-modal").classList.add("hidden");
    }

  });

}


// INITIALIZE WEBSITE
document.addEventListener("DOMContentLoaded", () => {

  bindControls();
  bindVRModeEvents();

  if (window.AFRAME) {
    registerHotspotEvents();
  } else {
    window.addEventListener(
      "load",
      registerHotspotEvents,
      { once: true }
    );
  }

  loadProjectData();

});
