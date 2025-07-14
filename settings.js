function loadSettings() {
  const defaults = {
    colors: {
      monday: '#FFA69E',
      tuesday: '#FFB357',
      wednesday: '#A8E6CF',
      thursday: '#9FA8DA',
      friday: '#C6A7FE',
      saturday: '#5BC8AF',
      sunday: '#EFD8B7'
    },
    emoji: '\uD83D\uDCAA',
    showQuotes: true,
    confettiColors: ['#bb0000', '#ffffff']
  };
  try {
    const saved = JSON.parse(localStorage.getItem('settings') || '{}');
    return {
      colors: { ...defaults.colors, ...(saved.colors || {}) },
      emoji: saved.emoji || defaults.emoji,
      showQuotes: typeof saved.showQuotes === 'boolean' ? saved.showQuotes : defaults.showQuotes,
      confettiColors: saved.confettiColors || defaults.confettiColors
    };
  } catch (e) {
    return defaults;
  }
}

function saveSettings(settings) {
  localStorage.setItem('settings', JSON.stringify(settings));
}

window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
