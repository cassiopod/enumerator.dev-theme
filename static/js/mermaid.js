(function () {
  var codeBlocks = document.querySelectorAll('pre > code.language-mermaid, pre > code[data-lang="mermaid"]');
  if (codeBlocks.length === 0) return;

  var sources = [];
  codeBlocks.forEach(function (code) {
    var pre = code.parentElement;
    var div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = code.textContent;
    pre.replaceWith(div);
    sources.push(div);
  });

  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  var themeVariables = isDark
    ? {
        primaryColor: '#cba6f7',
        primaryTextColor: '#1e1e2e',
        primaryBorderColor: '#313244',
        lineColor: '#7f849c',
        secondaryColor: '#89b4fa',
        secondaryTextColor: '#1e1e2e',
        tertiaryColor: '#181825',
        tertiaryTextColor: '#cdd6f4',
        textColor: '#cdd6f4',
        background: '#1e1e2e',
        noteBkgColor: '#181825',
        noteTextColor: '#cdd6f4',
        noteBorderColor: '#313244',
        fontFamily: "'Source Sans 3', sans-serif",
      }
    : {
        primaryColor: '#8839ef',
        primaryTextColor: '#eff1f5',
        primaryBorderColor: '#ccd0da',
        lineColor: '#8c8fa1',
        secondaryColor: '#1e66f5',
        secondaryTextColor: '#eff1f5',
        tertiaryColor: '#e6e9ef',
        tertiaryTextColor: '#4c4f69',
        textColor: '#4c4f69',
        background: '#eff1f5',
        noteBkgColor: '#e6e9ef',
        noteTextColor: '#4c4f69',
        noteBorderColor: '#ccd0da',
        fontFamily: "'Source Sans 3', sans-serif",
      };

  import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs')
    .then(function (mod) {
      mod.default.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: themeVariables,
      });
      mod.default.run();
    })
    .catch(function () {
      document.querySelectorAll('.mermaid').forEach(function (el) {
        el.style.visibility = 'visible';
      });
    });
})();
