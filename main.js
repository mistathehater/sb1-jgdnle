import hljs from 'highlight.js';
import { marked } from 'marked';

const artifactInput = document.getElementById('artifactInput');
const artifactType = document.getElementById('artifactType');
const generateBtn = document.getElementById('generateBtn');
const artifactContent = document.getElementById('artifactContent');
const prevVersionBtn = document.getElementById('prevVersion');
const nextVersionBtn = document.getElementById('nextVersion');
const versionInfo = document.getElementById('versionInfo');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

let artifacts = [];
let currentVersion = 0;

generateBtn.addEventListener('click', generateArtifact);
prevVersionBtn.addEventListener('click', showPreviousVersion);
nextVersionBtn.addEventListener('click', showNextVersion);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadArtifact);

function generateArtifact() {
  const content = artifactInput.value;
  const type = artifactType.value;

  if (!content.trim()) {
    alert('Please enter some content.');
    return;
  }

  let processedContent;
  switch (type) {
    case 'code':
      processedContent = generateCodeArtifact(content);
      break;
    case 'markdown':
      processedContent = generateMarkdownArtifact(content);
      break;
    case 'svg':
      processedContent = generateSvgArtifact(content);
      break;
    case 'mermaid':
      processedContent = generateMermaidArtifact(content);
      break;
    case 'react':
      processedContent = generateReactArtifact(content);
      break;
    case 'html':
      processedContent = generateHtmlArtifact(content);
      break;
    default:
      alert('Invalid artifact type');
      return;
  }

  artifacts.push({ type, content: processedContent });
  currentVersion = artifacts.length - 1;
  updateArtifactDisplay();
}

function generateCodeArtifact(code) {
  const highlightedCode = hljs.highlightAuto(code).value;
  return `<pre><code class="hljs">${highlightedCode}</code></pre>`;
}

function generateMarkdownArtifact(markdown) {
  return marked(markdown);
}

function generateSvgArtifact(svg) {
  return svg;
}

function generateMermaidArtifact(mermaidCode) {
  const container = document.createElement('div');
  container.className = 'mermaid';
  container.textContent = mermaidCode;
  mermaid.init(undefined, container);
  return container.innerHTML;
}

function generateReactArtifact(reactCode) {
  const container = document.createElement('div');
  container.id = 'react-root';
  
  const script = document.createElement('script');
  script.type = 'text/babel';
  script.textContent = `
    ${reactCode}
    ReactDOM.render(
      React.createElement(App),
      document.getElementById('react-root')
    );
  `;
  
  return container.outerHTML + script.outerHTML;
}

function generateHtmlArtifact(html) {
  const iframe = document.createElement('iframe');
  iframe.srcdoc = html;
  iframe.style.width = '100%';
  iframe.style.height = '400px';
  iframe.style.border = 'none';
  return iframe.outerHTML;
}

function updateArtifactDisplay() {
  const artifact = artifacts[currentVersion];
  artifactContent.innerHTML = artifact.content;
  artifactContent.className = `${artifact.type}-content`;
  
  if (artifact.type === 'mermaid') {
    mermaid.init(undefined, artifactContent.querySelector('.mermaid'));
  } else if (artifact.type === 'react') {
    const script = artifactContent.querySelector('script');
    if (script) {
      try {
        eval(Babel.transform(script.textContent, { presets: ['react'] }).code);
      } catch (error) {
        console.error('Error rendering React component:', error);
        artifactContent.innerHTML = `<p>Error rendering React component: ${error.message}</p>`;
      }
    }
  }
  
  updateVersionInfo();
  updateVersionButtons();
}

function updateVersionInfo() {
  versionInfo.textContent = `Version ${currentVersion + 1} of ${artifacts.length}`;
}

function updateVersionButtons() {
  prevVersionBtn.disabled = currentVersion === 0;
  nextVersionBtn.disabled = currentVersion === artifacts.length - 1;
}

function showPreviousVersion() {
  if (currentVersion > 0) {
    currentVersion--;
    updateArtifactDisplay();
  }
}

function showNextVersion() {
  if (currentVersion < artifacts.length - 1) {
    currentVersion++;
    updateArtifactDisplay();
  }
}

function copyToClipboard() {
  const artifact = artifacts[currentVersion];
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = artifact.content;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
  alert('Artifact copied to clipboard!');
}

function downloadArtifact() {
  const artifact = artifacts[currentVersion];
  const blob = new Blob([artifact.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `artifact.${getFileExtension(artifact.type)}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getFileExtension(type) {
  switch (type) {
    case 'code': return 'txt';
    case 'markdown': return 'md';
    case 'svg': return 'svg';
    case 'mermaid': return 'mmd';
    case 'react': return 'jsx';
    case 'html': return 'html';
    default: return 'txt';
  }
}

// Initialize mermaid
mermaid.initialize({ startOnLoad: true });