(function () {
  const fallbackKeys = [
    "VK_MENU",
    "RAlt",
    "VK_CONTROL",
    "RControl",
    "VK_SHIFT",
    "RShift",
    "Meta",
    "RWin",
    "VK_TAB",
  ];
  const pressedKeys = new Set();

  function mapKey(event) {
    switch (event.code) {
      case "AltLeft":
        return "VK_MENU";
      case "AltRight":
      case "AltGraph":
        return "RAlt";
      case "ControlLeft":
        return "VK_CONTROL";
      case "ControlRight":
        return "RControl";
      case "ShiftLeft":
        return "VK_SHIFT";
      case "ShiftRight":
        return "RShift";
      case "MetaLeft":
        return "Meta";
      case "MetaRight":
        return "RWin";
      case "Tab":
        return "VK_TAB";
      default:
        return "";
    }
  }

  function sendKeyUp(name) {
    if (!name || typeof window.setByName !== "function") {
      return;
    }
    window.setByName("input_key", JSON.stringify({ name }));
  }

  function releaseTrackedKeys() {
    const keys = new Set([...fallbackKeys, ...pressedKeys]);
    pressedKeys.clear();
    keys.forEach(sendKeyUp);
  }

  window.addEventListener(
    "keydown",
    function (event) {
      const name = mapKey(event);
      if (name) {
        pressedKeys.add(name);
      }
    },
    true,
  );

  window.addEventListener(
    "keyup",
    function (event) {
      const name = mapKey(event);
      if (name) {
        pressedKeys.delete(name);
      }
    },
    true,
  );

  window.addEventListener("blur", releaseTrackedKeys, true);
  window.addEventListener("pagehide", releaseTrackedKeys, true);
  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.visibilityState === "hidden") {
        releaseTrackedKeys();
      }
    },
    true,
  );
})();
