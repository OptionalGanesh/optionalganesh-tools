// plugin-loader.js — annotates tool cards with machine badges from GitHub Gist
// Gist: https://gist.github.com/OptionalGanesh/c863932d9b7363daa32634cb64cf2661
// Update with: bash ~/scripts/push-gist.sh <token> c863932d9b7363daa32634cb64cf2661

const GIST_RAW_URL = 'https://gist.githubusercontent.com/OptionalGanesh/c863932d9b7363daa32634cb64cf2661/raw/.og-plugins.json';

async function loadPluginBadges() {
  if (GIST_RAW_URL === 'PLACEHOLDER_GIST_RAW_URL') return;
  try {
    const res = await fetch(GIST_RAW_URL);
    if (!res.ok) return;
    const data = await res.json();
    annotateCards(data.plugins || data);
  } catch (e) {
    console.warn('plugin-loader: failed to load gist', e);
  }
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function annotateCards(plugins) {
  const lookup = {};
  for (const p of plugins) {
    lookup[normalizeName(p.name)] = p.machines || [];
  }

  document.querySelectorAll('.card-name, .plugin-name').forEach(el => {
    const key = normalizeName(el.textContent.trim());
    let machines = lookup[key];
    if (!machines) {
      for (const [k, v] of Object.entries(lookup)) {
        if (key.length > 3 && (key.includes(k) || k.includes(key))) {
          machines = v;
          break;
        }
      }
    }
    if (!machines || machines.length === 0) return;

    // Remove any previously injected badges
    el.parentElement.querySelectorAll('.machine-badge').forEach(b => b.remove());

    const container = el.closest('.card-left, .chain-hd-left') || el.parentElement;
    machines.forEach(machine => {
      const badge = document.createElement('span');
      badge.className = 'machine-badge badge';
      badge.style.cssText = machine === 'mini'
        ? 'background:rgba(245,158,11,0.12);color:rgba(245,158,11,0.85);margin-left:4px;'
        : 'background:rgba(100,175,255,0.12);color:rgba(100,175,255,0.85);margin-left:4px;';
      badge.textContent = machine === 'mini' ? 'Mini' : 'MBP';
      container.appendChild(badge);
    });
  });
}

document.addEventListener('DOMContentLoaded', loadPluginBadges);
