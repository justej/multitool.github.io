/**
 * UI Manager
 *
 * DOM manipulation helpers for tool switching and display updates.
 * Takes explicit parameters — never imports from registry.js or app.js.
 *
 * Dependency direction: app.js → ui.js (never reversed)
 */

/**
 * Update the UI to reflect the active tool's metadata.
 * Does NOT clear textarea values — content is preserved on tool switch (D-08).
 *
 * @param {object} tool - Tool definition from registry
 */
export function updateToolUI(tool) {
  // Update header
  document.getElementById('tool-name').textContent = tool.label;
  document.getElementById('tool-description').textContent = tool.description;

  // Update textarea placeholders (NOT clearing content — D-08)
  const leftField = document.getElementById('field-left');
  const rightField = document.getElementById('field-right');
  leftField.placeholder = tool.leftPlaceholder;
  rightField.placeholder = tool.rightPlaceholder;
  leftField.setAttribute('aria-label', tool.leftAriaLabel);
  rightField.setAttribute('aria-label', tool.rightAriaLabel);

  // Update action button labels
  const buttons = document.querySelectorAll('.action-btn');
  tool.actions.forEach((action, i) => {
    if (buttons[i]) buttons[i].textContent = action.label;
  });

  // Show/hide layout variant toggle
  const toggle = document.querySelector('.layout-toggle');
  if (toggle) toggle.style.display = tool.hasVariantToggle ? '' : 'none';
}

/**
 * Update the active state on tool selector links.
 *
 * @param {string} toolId - ID of the active tool
 */
export function setActiveToolLink(toolId) {
  document.querySelectorAll('.tool-link').forEach(link => {
    if (link.dataset.tool === toolId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Update the ASCII radio display to reflect the selected value.
 *
 * @param {string} selectedValue - The value of the selected radio ('windows' or 'macos')
 */
export function updateRadioDisplay(selectedValue) {
  document.querySelectorAll('input[name="layout-variant"]').forEach(radio => {
    const display = radio.parentElement.querySelector('.radio-display');
    if (display) {
      display.textContent = radio.value === selectedValue ? '(*)' : '( )';
    }
  });
}

/**
 * Show an error message in the error display element.
 * @param {string} message - Error text to display
 */
export function showError(message) {
  const el = document.getElementById('error-msg');
  if (el) {
    el.textContent = message;
    el.classList.add('visible');
  }
}

/**
 * Clear and hide the error message.
 */
export function clearError() {
  const el = document.getElementById('error-msg');
  if (el) {
    el.textContent = '';
    el.classList.remove('visible');
  }
}
