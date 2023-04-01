const apiKey = 'API KEY';

async function translateText(text, callback) {
  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(text)}&source=en&target=zh-CN`);
  const data = await response.json();
  callback(data.data.translations[0].translatedText);
}

function createCopyButton(originalText) {
  const copyButton = document.createElement('button');
  copyButton.textContent = '复制';

  // 添加内联样式
  copyButton.style.backgroundColor = '#224D3C';
  copyButton.style.color = '#32DC87';
  copyButton.style.border = '1px solid #ccc';
  copyButton.style.borderRadius = '4px';
  copyButton.style.cursor = 'pointer';
  copyButton.style.fontSize = '12px';
  copyButton.style.marginLeft = '4px';
  copyButton.style.padding = '4px 8px';

  // 仅复制原始文本（未翻译的文本）
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(originalText.trim());
  });

  return copyButton;
}

async function processPage() {
  const paragraphs = document.querySelectorAll('p.first-letter\\:capitalize');
  for (const p of paragraphs) {
    const spanElements = p.querySelectorAll('span > span');
    let originalText = '';
    for (const span of spanElements) {
      const text = span.textContent.trim();
      originalText += text + ' ';

      if (text && !/^[.,;:!?\-—()\[\]{}“”‘’]+$/.test(text)) {
        await translateText(text, (translatedText) => {
          const translationContainer = document.createElement('span');
          translationContainer.className = 'translation-container';
          translationContainer.textContent = `（${translatedText}）`;
          span.appendChild(translationContainer);
        });
      }
    }

    const copyButton = createCopyButton(originalText);
    p.appendChild(copyButton);
  }
}

function isTargetURL(url) {
  const pattern = /^https?:\/\/www\.midjourney\.com\/app\/jobs\//;
  return pattern.test(url);
}

function observePage() {
  let lastTriggeredURL = '';

  const processPageIfURLChanged = () => {
    const currentURL = window.location.href;
    if (isTargetURL(currentURL) && currentURL !== lastTriggeredURL) {
      lastTriggeredURL = currentURL;
      processPage();
    }
  };

  processPageIfURLChanged();

  const observer = new MutationObserver(() => {
    processPageIfURLChanged();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.onpopstate = () => {
    processPageIfURLChanged();
  };
}

observePage();
