(() => {
  // node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js
  var resizeObservers = [];

  // node_modules/@juggle/resize-observer/lib/algorithms/hasActiveObservations.js
  var hasActiveObservations = function() {
    return resizeObservers.some(function(ro) {
      return ro.activeTargets.length > 0;
    });
  };

  // node_modules/@juggle/resize-observer/lib/algorithms/hasSkippedObservations.js
  var hasSkippedObservations = function() {
    return resizeObservers.some(function(ro) {
      return ro.skippedTargets.length > 0;
    });
  };

  // node_modules/@juggle/resize-observer/lib/algorithms/deliverResizeLoopError.js
  var msg = "ResizeObserver loop completed with undelivered notifications.";
  var deliverResizeLoopError = function() {
    var event;
    if (typeof ErrorEvent === "function") {
      event = new ErrorEvent("error", {
        message: msg
      });
    } else {
      event = document.createEvent("Event");
      event.initEvent("error", false, false);
      event.message = msg;
    }
    window.dispatchEvent(event);
  };

  // node_modules/@juggle/resize-observer/lib/ResizeObserverBoxOptions.js
  var ResizeObserverBoxOptions;
  (function(ResizeObserverBoxOptions2) {
    ResizeObserverBoxOptions2["BORDER_BOX"] = "border-box";
    ResizeObserverBoxOptions2["CONTENT_BOX"] = "content-box";
    ResizeObserverBoxOptions2["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
  })(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));

  // node_modules/@juggle/resize-observer/lib/utils/freeze.js
  var freeze = function(obj) {
    return Object.freeze(obj);
  };

  // node_modules/@juggle/resize-observer/lib/ResizeObserverSize.js
  var ResizeObserverSize = /* @__PURE__ */ function() {
    function ResizeObserverSize2(inlineSize, blockSize) {
      this.inlineSize = inlineSize;
      this.blockSize = blockSize;
      freeze(this);
    }
    return ResizeObserverSize2;
  }();

  // node_modules/@juggle/resize-observer/lib/DOMRectReadOnly.js
  var DOMRectReadOnly = function() {
    function DOMRectReadOnly2(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = this.y;
      this.left = this.x;
      this.bottom = this.top + this.height;
      this.right = this.left + this.width;
      return freeze(this);
    }
    DOMRectReadOnly2.prototype.toJSON = function() {
      var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
      return { x, y, top, right, bottom, left, width, height };
    };
    DOMRectReadOnly2.fromRect = function(rectangle) {
      return new DOMRectReadOnly2(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    };
    return DOMRectReadOnly2;
  }();

  // node_modules/@juggle/resize-observer/lib/utils/element.js
  var isSVG = function(target) {
    return target instanceof SVGElement && "getBBox" in target;
  };
  var isHidden = function(target) {
    if (isSVG(target)) {
      var _a = target.getBBox(), width = _a.width, height = _a.height;
      return !width && !height;
    }
    var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
    return !(offsetWidth || offsetHeight || target.getClientRects().length);
  };
  var isElement = function(obj) {
    var _a;
    if (obj instanceof Element) {
      return true;
    }
    var scope = (_a = obj === null || obj === void 0 ? void 0 : obj.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
    return !!(scope && obj instanceof scope.Element);
  };
  var isReplacedElement = function(target) {
    switch (target.tagName) {
      case "INPUT":
        if (target.type !== "image") {
          break;
        }
      case "VIDEO":
      case "AUDIO":
      case "EMBED":
      case "OBJECT":
      case "CANVAS":
      case "IFRAME":
      case "IMG":
        return true;
    }
    return false;
  };

  // node_modules/@juggle/resize-observer/lib/utils/global.js
  var global = typeof window !== "undefined" ? window : {};

  // node_modules/@juggle/resize-observer/lib/algorithms/calculateBoxSize.js
  var cache = /* @__PURE__ */ new WeakMap();
  var scrollRegexp = /auto|scroll/;
  var verticalRegexp = /^tb|vertical/;
  var IE = /msie|trident/i.test(global.navigator && global.navigator.userAgent);
  var parseDimension = function(pixel) {
    return parseFloat(pixel || "0");
  };
  var size = function(inlineSize, blockSize, switchSizes) {
    if (inlineSize === void 0) {
      inlineSize = 0;
    }
    if (blockSize === void 0) {
      blockSize = 0;
    }
    if (switchSizes === void 0) {
      switchSizes = false;
    }
    return new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
  };
  var zeroBoxes = freeze({
    devicePixelContentBoxSize: size(),
    borderBoxSize: size(),
    contentBoxSize: size(),
    contentRect: new DOMRectReadOnly(0, 0, 0, 0)
  });
  var calculateBoxSizes = function(target, forceRecalculation) {
    if (forceRecalculation === void 0) {
      forceRecalculation = false;
    }
    if (cache.has(target) && !forceRecalculation) {
      return cache.get(target);
    }
    if (isHidden(target)) {
      cache.set(target, zeroBoxes);
      return zeroBoxes;
    }
    var cs = getComputedStyle(target);
    var svg = isSVG(target) && target.ownerSVGElement && target.getBBox();
    var removePadding = !IE && cs.boxSizing === "border-box";
    var switchSizes = verticalRegexp.test(cs.writingMode || "");
    var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || "");
    var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || "");
    var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
    var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
    var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
    var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
    var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
    var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
    var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
    var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
    var horizontalPadding = paddingLeft + paddingRight;
    var verticalPadding = paddingTop + paddingBottom;
    var horizontalBorderArea = borderLeft + borderRight;
    var verticalBorderArea = borderTop + borderBottom;
    var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
    var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
    var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
    var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
    var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
    var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
    var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
    var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
    var boxes = freeze({
      devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
      borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
      contentBoxSize: size(contentWidth, contentHeight, switchSizes),
      contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
    });
    cache.set(target, boxes);
    return boxes;
  };
  var calculateBoxSize = function(target, observedBox, forceRecalculation) {
    var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
    switch (observedBox) {
      case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
        return devicePixelContentBoxSize;
      case ResizeObserverBoxOptions.BORDER_BOX:
        return borderBoxSize;
      default:
        return contentBoxSize;
    }
  };

  // node_modules/@juggle/resize-observer/lib/ResizeObserverEntry.js
  var ResizeObserverEntry = /* @__PURE__ */ function() {
    function ResizeObserverEntry2(target) {
      var boxes = calculateBoxSizes(target);
      this.target = target;
      this.contentRect = boxes.contentRect;
      this.borderBoxSize = freeze([boxes.borderBoxSize]);
      this.contentBoxSize = freeze([boxes.contentBoxSize]);
      this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
    }
    return ResizeObserverEntry2;
  }();

  // node_modules/@juggle/resize-observer/lib/algorithms/calculateDepthForNode.js
  var calculateDepthForNode = function(node) {
    if (isHidden(node)) {
      return Infinity;
    }
    var depth = 0;
    var parent = node.parentNode;
    while (parent) {
      depth += 1;
      parent = parent.parentNode;
    }
    return depth;
  };

  // node_modules/@juggle/resize-observer/lib/algorithms/broadcastActiveObservations.js
  var broadcastActiveObservations = function() {
    var shallowestDepth = Infinity;
    var callbacks2 = [];
    resizeObservers.forEach(function processObserver(ro) {
      if (ro.activeTargets.length === 0) {
        return;
      }
      var entries = [];
      ro.activeTargets.forEach(function processTarget(ot) {
        var entry = new ResizeObserverEntry(ot.target);
        var targetDepth = calculateDepthForNode(ot.target);
        entries.push(entry);
        ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
        if (targetDepth < shallowestDepth) {
          shallowestDepth = targetDepth;
        }
      });
      callbacks2.push(function resizeObserverCallback() {
        ro.callback.call(ro.observer, entries, ro.observer);
      });
      ro.activeTargets.splice(0, ro.activeTargets.length);
    });
    for (var _i = 0, callbacks_1 = callbacks2; _i < callbacks_1.length; _i++) {
      var callback = callbacks_1[_i];
      callback();
    }
    return shallowestDepth;
  };

  // node_modules/@juggle/resize-observer/lib/algorithms/gatherActiveObservationsAtDepth.js
  var gatherActiveObservationsAtDepth = function(depth) {
    resizeObservers.forEach(function processObserver(ro) {
      ro.activeTargets.splice(0, ro.activeTargets.length);
      ro.skippedTargets.splice(0, ro.skippedTargets.length);
      ro.observationTargets.forEach(function processTarget(ot) {
        if (ot.isActive()) {
          if (calculateDepthForNode(ot.target) > depth) {
            ro.activeTargets.push(ot);
          } else {
            ro.skippedTargets.push(ot);
          }
        }
      });
    });
  };

  // node_modules/@juggle/resize-observer/lib/utils/process.js
  var process = function() {
    var depth = 0;
    gatherActiveObservationsAtDepth(depth);
    while (hasActiveObservations()) {
      depth = broadcastActiveObservations();
      gatherActiveObservationsAtDepth(depth);
    }
    if (hasSkippedObservations()) {
      deliverResizeLoopError();
    }
    return depth > 0;
  };

  // node_modules/@juggle/resize-observer/lib/utils/queueMicroTask.js
  var trigger;
  var callbacks = [];
  var notify = function() {
    return callbacks.splice(0).forEach(function(cb) {
      return cb();
    });
  };
  var queueMicroTask = function(callback) {
    if (!trigger) {
      var toggle_1 = 0;
      var el_1 = document.createTextNode("");
      var config = { characterData: true };
      new MutationObserver(function() {
        return notify();
      }).observe(el_1, config);
      trigger = function() {
        el_1.textContent = "".concat(toggle_1 ? toggle_1-- : toggle_1++);
      };
    }
    callbacks.push(callback);
    trigger();
  };

  // node_modules/@juggle/resize-observer/lib/utils/queueResizeObserver.js
  var queueResizeObserver = function(cb) {
    queueMicroTask(function ResizeObserver2() {
      requestAnimationFrame(cb);
    });
  };

  // node_modules/@juggle/resize-observer/lib/utils/scheduler.js
  var watching = 0;
  var isWatching = function() {
    return !!watching;
  };
  var CATCH_PERIOD = 250;
  var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
  var events = [
    "resize",
    "load",
    "transitionend",
    "animationend",
    "animationstart",
    "animationiteration",
    "keyup",
    "keydown",
    "mouseup",
    "mousedown",
    "mouseover",
    "mouseout",
    "blur",
    "focus"
  ];
  var time = function(timeout) {
    if (timeout === void 0) {
      timeout = 0;
    }
    return Date.now() + timeout;
  };
  var scheduled = false;
  var Scheduler = function() {
    function Scheduler2() {
      var _this = this;
      this.stopped = true;
      this.listener = function() {
        return _this.schedule();
      };
    }
    Scheduler2.prototype.run = function(timeout) {
      var _this = this;
      if (timeout === void 0) {
        timeout = CATCH_PERIOD;
      }
      if (scheduled) {
        return;
      }
      scheduled = true;
      var until = time(timeout);
      queueResizeObserver(function() {
        var elementsHaveResized = false;
        try {
          elementsHaveResized = process();
        } finally {
          scheduled = false;
          timeout = until - time();
          if (!isWatching()) {
            return;
          }
          if (elementsHaveResized) {
            _this.run(1e3);
          } else if (timeout > 0) {
            _this.run(timeout);
          } else {
            _this.start();
          }
        }
      });
    };
    Scheduler2.prototype.schedule = function() {
      this.stop();
      this.run();
    };
    Scheduler2.prototype.observe = function() {
      var _this = this;
      var cb = function() {
        return _this.observer && _this.observer.observe(document.body, observerConfig);
      };
      document.body ? cb() : global.addEventListener("DOMContentLoaded", cb);
    };
    Scheduler2.prototype.start = function() {
      var _this = this;
      if (this.stopped) {
        this.stopped = false;
        this.observer = new MutationObserver(this.listener);
        this.observe();
        events.forEach(function(name) {
          return global.addEventListener(name, _this.listener, true);
        });
      }
    };
    Scheduler2.prototype.stop = function() {
      var _this = this;
      if (!this.stopped) {
        this.observer && this.observer.disconnect();
        events.forEach(function(name) {
          return global.removeEventListener(name, _this.listener, true);
        });
        this.stopped = true;
      }
    };
    return Scheduler2;
  }();
  var scheduler = new Scheduler();
  var updateCount = function(n) {
    !watching && n > 0 && scheduler.start();
    watching += n;
    !watching && scheduler.stop();
  };

  // node_modules/@juggle/resize-observer/lib/ResizeObservation.js
  var skipNotifyOnElement = function(target) {
    return !isSVG(target) && !isReplacedElement(target) && getComputedStyle(target).display === "inline";
  };
  var ResizeObservation = function() {
    function ResizeObservation2(target, observedBox) {
      this.target = target;
      this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
      this.lastReportedSize = {
        inlineSize: 0,
        blockSize: 0
      };
    }
    ResizeObservation2.prototype.isActive = function() {
      var size2 = calculateBoxSize(this.target, this.observedBox, true);
      if (skipNotifyOnElement(this.target)) {
        this.lastReportedSize = size2;
      }
      if (this.lastReportedSize.inlineSize !== size2.inlineSize || this.lastReportedSize.blockSize !== size2.blockSize) {
        return true;
      }
      return false;
    };
    return ResizeObservation2;
  }();

  // node_modules/@juggle/resize-observer/lib/ResizeObserverDetail.js
  var ResizeObserverDetail = /* @__PURE__ */ function() {
    function ResizeObserverDetail2(resizeObserver2, callback) {
      this.activeTargets = [];
      this.skippedTargets = [];
      this.observationTargets = [];
      this.observer = resizeObserver2;
      this.callback = callback;
    }
    return ResizeObserverDetail2;
  }();

  // node_modules/@juggle/resize-observer/lib/ResizeObserverController.js
  var observerMap = /* @__PURE__ */ new WeakMap();
  var getObservationIndex = function(observationTargets, target) {
    for (var i = 0; i < observationTargets.length; i += 1) {
      if (observationTargets[i].target === target) {
        return i;
      }
    }
    return -1;
  };
  var ResizeObserverController = function() {
    function ResizeObserverController2() {
    }
    ResizeObserverController2.connect = function(resizeObserver2, callback) {
      var detail = new ResizeObserverDetail(resizeObserver2, callback);
      observerMap.set(resizeObserver2, detail);
    };
    ResizeObserverController2.observe = function(resizeObserver2, target, options) {
      var detail = observerMap.get(resizeObserver2);
      var firstObservation = detail.observationTargets.length === 0;
      if (getObservationIndex(detail.observationTargets, target) < 0) {
        firstObservation && resizeObservers.push(detail);
        detail.observationTargets.push(new ResizeObservation(target, options && options.box));
        updateCount(1);
        scheduler.schedule();
      }
    };
    ResizeObserverController2.unobserve = function(resizeObserver2, target) {
      var detail = observerMap.get(resizeObserver2);
      var index = getObservationIndex(detail.observationTargets, target);
      var lastObservation = detail.observationTargets.length === 1;
      if (index >= 0) {
        lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1);
        detail.observationTargets.splice(index, 1);
        updateCount(-1);
      }
    };
    ResizeObserverController2.disconnect = function(resizeObserver2) {
      var _this = this;
      var detail = observerMap.get(resizeObserver2);
      detail.observationTargets.slice().forEach(function(ot) {
        return _this.unobserve(resizeObserver2, ot.target);
      });
      detail.activeTargets.splice(0, detail.activeTargets.length);
    };
    return ResizeObserverController2;
  }();

  // node_modules/@juggle/resize-observer/lib/ResizeObserver.js
  var ResizeObserver = function() {
    function ResizeObserver2(callback) {
      if (arguments.length === 0) {
        throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
      }
      if (typeof callback !== "function") {
        throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
      }
      ResizeObserverController.connect(this, callback);
    }
    ResizeObserver2.prototype.observe = function(target, options) {
      if (arguments.length === 0) {
        throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
      }
      if (!isElement(target)) {
        throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
      }
      ResizeObserverController.observe(this, target, options);
    };
    ResizeObserver2.prototype.unobserve = function(target) {
      if (arguments.length === 0) {
        throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
      }
      if (!isElement(target)) {
        throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
      }
      ResizeObserverController.unobserve(this, target);
    };
    ResizeObserver2.prototype.disconnect = function() {
      ResizeObserverController.disconnect(this);
    };
    ResizeObserver2.toString = function() {
      return "function ResizeObserver () { [polyfill code] }";
    };
    return ResizeObserver2;
  }();

  // <stdin>
  var ARTICLE_CONTENT_SELECTOR = "div.article-content";
  var FOOTNOTE_SECTION_SELECTOR = "div.footnotes[role=doc-endnotes] > ol";
  var INDIVIDUAL_FOOTNOTE_SELECTOR = "li[id^='fn:']";
  var FLOATING_FOOTNOTE_MIN_WIDTH = 1260;
  function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
  function windowLoaded(fn) {
    if (document.readyState === "complete") {
      setTimeout(fn, 1);
    } else {
      window.addEventListener("load", fn);
    }
  }
  function onWindowResize(fn) {
    windowLoaded(function() {
      window.addEventListener("resize", fn);
      setTimeout(fn, 1);
    });
  }
  function anchorForId(id) {
    const anchor = document.createElement("a");
    anchor.className = "header-link";
    anchor.title = "Link to this section";
    anchor.href = "#" + id;
    anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z" /></svg>';
    return anchor;
  }
  function anchorizeHeadings() {
    const articles = document.querySelectorAll("article#main");
    if (articles.length != 1) {
      return;
    }
    const headers = articles[0].querySelectorAll("h2, h3, h4");
    Array.prototype.forEach.call(headers, function(el, i) {
      var link = anchorForId(el.id);
      el.appendChild(link);
    });
  }
  function computeOffsetForAlignment(elemToAlign, targetAlignment) {
    const offsetParentTop = elemToAlign.offsetParent.getBoundingClientRect().top;
    return targetAlignment.getBoundingClientRect().top - offsetParentTop;
  }
  function setFootnoteOffsets(footnotes) {
    let bottomOfLastElem = 0;
    Array.prototype.forEach.call(footnotes, function(footnote, i) {
      const intextLink = document.querySelector("a.footnote-ref[href='#" + footnote.id + "']");
      const verticalAlignmentTarget = intextLink.closest("p,li") || intextLink;
      let offset = computeOffsetForAlignment(footnote, verticalAlignmentTarget);
      if (offset < bottomOfLastElem) {
        offset = bottomOfLastElem;
      }
      bottomOfLastElem = offset + footnote.offsetHeight + parseInt(window.getComputedStyle(footnote).marginBottom) + parseInt(window.getComputedStyle(footnote).marginTop);
      footnote.style.top = offset + "px";
      footnote.style.position = "absolute";
    });
  }
  function clearFootnoteOffsets(footnotes) {
    Array.prototype.forEach.call(footnotes, function(fn, i) {
      fn.style.top = null;
      fn.style.position = null;
    });
  }
  function updateFootnoteFloat(shouldFloat) {
    const footnoteSection = document.querySelector(FOOTNOTE_SECTION_SELECTOR);
    const footnotes = footnoteSection.querySelectorAll(INDIVIDUAL_FOOTNOTE_SELECTOR);
    console.log(footnotes);
    if (shouldFloat) {
      footnoteSection.classList.add("floating-footnotes");
      setFootnoteOffsets(footnotes);
      subscribeToUpdates();
    } else {
      unsubscribeFromUpdates();
      clearFootnoteOffsets(footnotes);
      footnoteSection.classList.remove("floating-footnotes");
    }
  }
  function subscribeToUpdates() {
    const article = document.querySelector(ARTICLE_CONTENT_SELECTOR);
    resizeObserver.observe(article);
  }
  function unsubscribeFromUpdates() {
    resizeObserver.disconnect();
  }
  var notifySizeChange = /* @__PURE__ */ function() {
    let bigEnough = false;
    return function() {
      let nowBigEnough = window.innerWidth >= FLOATING_FOOTNOTE_MIN_WIDTH;
      if (nowBigEnough !== bigEnough) {
        updateFootnoteFloat(nowBigEnough);
        bigEnough = nowBigEnough;
      }
    };
  }();
  var resizeObserver = new ResizeObserver((_entries, observer) => {
    updateFootnoteFloat(true);
  });
  function enableFloatingFootnotes() {
    docReady(() => {
      const footnoteSection = document.querySelector(FOOTNOTE_SECTION_SELECTOR);
      console.log(footnoteSection);
      const article = document.querySelector(ARTICLE_CONTENT_SELECTOR);
      console.log(article);
      const allowFloatingFootnotes = article && !article.classList.contains("no-floating-footnotes");
      if (footnoteSection && allowFloatingFootnotes) {
        onWindowResize(notifySizeChange);
      }
    });
  }
  enableFloatingFootnotes();
  anchorizeHeadings();
})();
