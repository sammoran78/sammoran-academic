(() => {
  "use strict";

  const STORAGE_KEY = "sam_cookie_preferences";
  const CONSENT_VERSION = 1;
  const DEFAULT_PREFERENCES = Object.freeze({
    essential: true,
    analytics: false,
    marketing: false
  });

  const categories = [
    {
      id: "essential",
      name: "Essential storage",
      description: "Remembers your privacy choice and supports secure, reliable site operation.",
      required: true
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Would help measure site use. No analytics provider is currently active."
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Would support advertising or campaign measurement. No marketing provider is currently active."
    }
  ];

  const cloneDefaults = () => ({ ...DEFAULT_PREFERENCES });

  const readConsent = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (
        parsed &&
        parsed.version === CONSENT_VERSION &&
        parsed.preferences &&
        typeof parsed.preferences.analytics === "boolean" &&
        typeof parsed.preferences.marketing === "boolean"
      ) {
        return {
          essential: true,
          analytics: parsed.preferences.analytics,
          marketing: parsed.preferences.marketing
        };
      }
    } catch {
      // A fresh choice will be requested when storage is unavailable or invalid.
    }
    return null;
  };

  const publishConsent = (preferences) => {
    const detail = Object.freeze({ ...preferences });
    window.samCookieConsent = {
      version: CONSENT_VERSION,
      preferences: detail,
      permits: (category) => Boolean(detail[category]),
      openSettings: () => openSettings()
    };
    window.dispatchEvent(new CustomEvent("sam:consentchange", { detail }));
  };

  const shell = document.createElement("div");
  shell.className = "cookie-consent";
  shell.innerHTML = `
    <section class="cookie-banner" role="region" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-description" hidden>
      <div class="cookie-banner-heading">
        <span class="cookie-marker" aria-hidden="true"></span>
        <p>Privacy preferences</p>
      </div>
      <h2 id="cookie-banner-title">Your choice, clearly made.</h2>
      <p id="cookie-banner-description">
        This site uses essential browser storage to remember your choice. Optional analytics and
        marketing technologies stay off unless you allow them.
      </p>
      <a class="cookie-policy-link" href="/privacy-policy/#cookies">Read the privacy and cookie policy <span aria-hidden="true">→</span></a>
      <div class="cookie-banner-actions">
        <button type="button" class="cookie-button cookie-button-primary" data-consent-accept>Accept all</button>
        <button type="button" class="cookie-button" data-consent-reject>Reject optional</button>
        <button type="button" class="cookie-button cookie-button-dark" data-consent-manage>Manage</button>
      </div>
    </section>

    <dialog class="cookie-dialog" aria-labelledby="cookie-dialog-title" aria-describedby="cookie-dialog-description">
      <form method="dialog" class="cookie-dialog-frame">
        <div class="cookie-dialog-header">
          <div>
            <p class="cookie-dialog-kicker">Privacy control</p>
            <h2 id="cookie-dialog-title">Manage preferences</h2>
          </div>
          <button type="submit" class="cookie-dialog-close" value="cancel" aria-label="Close cookie settings">×</button>
        </div>
        <p id="cookie-dialog-description" class="cookie-dialog-description">
          Choose which optional technologies may run. Essential storage cannot be switched off.
        </p>
        <div class="cookie-category-list">
          ${categories.map((category) => `
            <label class="cookie-category" for="cookie-${category.id}">
              <span>
                <strong>${category.name}</strong>
                ${category.required ? '<small>Required</small>' : ""}
                <span>${category.description}</span>
              </span>
              <input
                id="cookie-${category.id}"
                type="checkbox"
                name="${category.id}"
                ${category.required ? "checked disabled" : ""}
              >
              <span class="cookie-switch" aria-hidden="true"></span>
            </label>
          `).join("")}
        </div>
        <div class="cookie-dialog-actions">
          <button type="button" class="cookie-button" data-dialog-reject>Reject optional</button>
          <button type="button" class="cookie-button cookie-button-primary" data-dialog-save>Save selection</button>
        </div>
      </form>
    </dialog>
  `;
  document.body.append(shell);

  const banner = shell.querySelector(".cookie-banner");
  const dialog = shell.querySelector(".cookie-dialog");
  const analyticsInput = shell.querySelector("#cookie-analytics");
  const marketingInput = shell.querySelector("#cookie-marketing");

  const showBanner = () => {
    banner.hidden = false;
  };

  const hideBanner = () => {
    banner.hidden = true;
  };

  const setDialogValues = (preferences) => {
    analyticsInput.checked = Boolean(preferences.analytics);
    marketingInput.checked = Boolean(preferences.marketing);
  };

  const closeSettings = () => {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  };

  function openSettings() {
    setDialogValues(readConsent() || cloneDefaults());
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  const saveConsent = (preferences) => {
    const normalized = {
      essential: true,
      analytics: Boolean(preferences.analytics),
      marketing: Boolean(preferences.marketing)
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        savedAt: new Date().toISOString(),
        preferences: normalized
      }));
    } catch {
      // The preference still applies for this page view if persistent storage is blocked.
    }
    hideBanner();
    closeSettings();
    publishConsent(normalized);
  };

  shell.querySelector("[data-consent-accept]").addEventListener("click", () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  });
  shell.querySelector("[data-consent-reject]").addEventListener("click", () => {
    saveConsent(cloneDefaults());
  });
  shell.querySelector("[data-consent-manage]").addEventListener("click", openSettings);
  shell.querySelector("[data-dialog-reject]").addEventListener("click", () => {
    saveConsent(cloneDefaults());
  });
  shell.querySelector("[data-dialog-save]").addEventListener("click", () => {
    saveConsent({
      essential: true,
      analytics: analyticsInput.checked,
      marketing: marketingInput.checked
    });
  });

  document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
    button.addEventListener("click", openSettings);
  });

  const existingConsent = readConsent();
  if (existingConsent) {
    publishConsent(existingConsent);
  } else {
    publishConsent(cloneDefaults());
    showBanner();
  }
})();
