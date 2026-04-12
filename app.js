/**
 * Multitool — App Entry Point
 *
 * Wires the tool registry to the DOM via UI helpers.
 * Handles event delegation, tool switching, layout variant toggle,
 * and cookie persistence for last-used tool.
 *
 * Dependency direction:
 *   app.js → registry.js → tools/*.js
 *   app.js → ui.js
 *   (app.js never imports tools directly)
 */

import { tools, getToolById } from './registry.js';
import { updateToolUI, setActiveToolLink, updateRadioDisplay, showError, clearError } from './ui.js';

// --- State ---
let currentTool = null;
let currentVariant = 'windows';

// --- Cookie helpers (D-10: persist last-used tool) ---

function setToolCookie(toolId) {
  document.cookie = `multitool_last_tool=${toolId};max-age=${60 * 60 * 24 * 365};path=/;SameSite=Lax`;
}

function getToolCookie() {
  const match = document.cookie.match(/multitool_last_tool=([^;]+)/);
  return match ? match[1] : null;
}

// --- Tool switching ---

function switchTool(toolId) {
  const tool = getToolById(toolId);
  if (!tool) return;
  currentTool = tool;
  updateToolUI(tool);
  setActiveToolLink(toolId);
  setToolCookie(toolId);
}

// --- Event handlers ---

// Conversion: event delegation on the actions column
document.querySelector('.actions').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn || !currentTool) return;

  const direction = btn.dataset.action;
  const action = currentTool.actions.find(a => a.direction === direction);
  if (!action) return;

  const leftField = document.getElementById('field-left');
  const rightField = document.getElementById('field-right');

  clearError();

  if (direction === 'left-to-right') {
    const result = action.fn(leftField.value, currentVariant);
    if (typeof result === 'object' && result.error) {
      showError(result.error);
    } else {
      rightField.value = result;
    }
  } else {
    const result = action.fn(rightField.value, currentVariant);
    if (typeof result === 'object' && result.error) {
      showError(result.error);
    } else {
      leftField.value = result;
    }
  }
});

// Layout variant toggle (D-12)
document.querySelectorAll('input[name="layout-variant"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentVariant = e.target.value;
    updateRadioDisplay(currentVariant);
  });
});

// Tool selector click handler (UI-05, UI-06)
document.querySelector('.tool-selector').addEventListener('click', (e) => {
  e.preventDefault();
  const link = e.target.closest('.tool-link:not(.disabled)');
  if (!link) return;
  switchTool(link.dataset.tool);
});

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  // Restore last tool from cookie, or default to first tool
  const lastTool = getToolCookie();
  const initialToolId = (lastTool && getToolById(lastTool)) ? lastTool : tools[0].id;
  switchTool(initialToolId);
  updateRadioDisplay(currentVariant);
});
