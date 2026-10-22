/*
 * Boot síncrono e mínimo: consentimento + atribuição.
 * Fica em /scripts/boot.js (arquivo clássico, sem módulo) para rodar antes do GTM.
 */
(function () {
  var root = document.documentElement;
  var CONSENT_KEY = 'mv_consent_v1';
  var ATTRIBUTION_KEY = 'mv_attribution_v1';
  var requiredConsentVersion = root.getAttribute('data-consent-version') || '';

  root.classList.add('js');

  try {
    var raw = window.localStorage.getItem(CONSENT_KEY);
    var parsed = raw ? JSON.parse(raw) : null;
    var versionMatches = parsed && parsed.version === requiredConsentVersion;
    root.setAttribute(
      'data-consent',
      versionMatches && (parsed.decision === 'granted' || parsed.decision === 'denied')
        ? parsed.decision
        : 'undecided',
    );
  } catch {
    root.setAttribute('data-consent', 'undecided');
  }

  try {
    var params = new URLSearchParams(window.location.search);
    var keys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'gclid',
      'fbclid',
      'msclkid',
    ];
    var incoming = {};
    var hasCampaign = false;

    for (var i = 0; i < keys.length; i += 1) {
      var value = params.get(keys[i]);
      if (value) {
        incoming[keys[i]] = value.slice(0, 300);
        hasCampaign = true;
      }
    }

    var storedRaw = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    var stored = storedRaw ? JSON.parse(storedRaw) : null;

    if (hasCampaign || !stored) {
      var attribution = hasCampaign && stored ? stored : {};
      for (var key in incoming) {
        if (Object.prototype.hasOwnProperty.call(incoming, key)) {
          attribution[key] = incoming[key];
        }
      }
      attribution.landing_page = attribution.landing_page || window.location.pathname;
      attribution.referrer = attribution.referrer || document.referrer || '';
      attribution.captured_at = attribution.captured_at || new Date().toISOString();
      window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    }
  } catch {
    /* sessionStorage indisponível: o formulário segue sem atribuição. */
  }
})();
