// ==UserScript==
// @name         Watermark Layer Detector Toggle
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  Detects potential watermark overlay layers and lets you enable/disable them with a warning panel.
// @author       crazybee
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Script overview:
// 1) Detect likely watermark overlay elements (div/canvas/svg) using style and naming heuristics.
// 2) Show a floating warning panel when overlays are found.
// 3) Let user choose whether to disable or restore the detected layers via checkbox.
(function() {
    'use strict';

    function isPotentialWatermark(el) {
        const style = window.getComputedStyle(el);
        const isFixed = style.position === 'fixed' || style.position === 'absolute';
        const isPointerEventsNone = style.pointerEvents === 'none';
        const isFullSize = el.clientWidth >= window.innerWidth * 0.8 && el.clientHeight >= window.innerHeight * 0.8;
        const isWatermarkClass = (String(el.className) + String(el.id)).toLowerCase().includes('watermark');

        return (isFixed && isPointerEventsNone && isFullSize) || isWatermarkClass;
    }

    function getDetectedLayers() {
        const elements = document.querySelectorAll('div, canvas, svg');
        return Array.from(elements).filter(isPotentialWatermark);
    }

    // Hide layer directly
    function hideDetectedLayer(layers) {
        layers.forEach(el => {
            el.dataset.wmOriginalDisplay = el.style.display || '';
            el.style.setProperty('display', 'none', 'important');
        });
    }

    // Disable layer behavior (without removing node)
    function disableDetectedLayer(layers) {
        layers.forEach(el => {
            el.dataset.wmOriginalPointerEvents = el.style.pointerEvents || '';
            el.dataset.wmOriginalOpacity = el.style.opacity || '';

            el.style.setProperty('pointer-events', 'none', 'important');
            el.style.setProperty('opacity', '0', 'important');
        });
    }

    function restoreDetectedLayer(layers) {
        layers.forEach(el => {
            const originalPointerEvents = el.dataset.wmOriginalPointerEvents;
            const originalOpacity = el.dataset.wmOriginalOpacity;

            if (originalPointerEvents !== undefined) {
                if (originalPointerEvents) {
                    el.style.pointerEvents = originalPointerEvents;
                } else {
                    el.style.removeProperty('pointer-events');
                }
            }

            if (originalOpacity !== undefined) {
                if (originalOpacity) {
                    el.style.opacity = originalOpacity;
                } else {
                    el.style.removeProperty('opacity');
                }
            }
        });
    }

    function createWarningUI(layers) {
        const oldWarning = document.getElementById('wm-warning-panel');
        if (oldWarning) {
            oldWarning.remove();
        }

        const warning = document.createElement('div');
        warning.id = 'wm-warning-panel';
        warning.style.cssText = 'position:fixed;top:10px;left:10px;z-index:9999999;background:#b91c1c;color:white;padding:10px 12px;border-radius:6px;font-weight:bold;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.25);';

        const text = document.createElement('div');
        text.innerText = `⚠️ Detected ${layers.length} screen watermark layer(s)`;
        text.style.marginBottom = '8px';

        const controls = document.createElement('div');
        controls.style.cssText = 'display:flex;align-items:center;gap:8px;font-weight:normal;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'wm-disable-checkbox';

        const label = document.createElement('label');
        label.setAttribute('for', 'wm-disable-checkbox');
        label.innerText = 'Disable detected watermark layers';
        label.style.cursor = 'pointer';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.innerText = 'Close';
        closeBtn.style.cssText = 'margin-left:8px;border:0;border-radius:4px;padding:3px 8px;cursor:pointer;background:white;color:#b91c1c;';

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                disableDetectedLayer(layers);
            } else {
                restoreDetectedLayer(layers);
            }
        });

        closeBtn.addEventListener('click', () => {
            warning.remove();
        });

        controls.appendChild(checkbox);
        controls.appendChild(label);
        controls.appendChild(closeBtn);

        warning.appendChild(text);
        warning.appendChild(controls);
        document.body.appendChild(warning);
    }

    function detectWatermark() {
        const layers = getDetectedLayers();
        const detected = layers.length > 0;

        if (detected) {
            createWarningUI(layers);
        }
    }

    setTimeout(detectWatermark, 1000);
})();