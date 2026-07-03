// ============================================
// Application State & Configuration
// ============================================

const appState = {
    currentTab: 'text-to-video',
    apiKey: localStorage.getItem('veo-api-key') || '',
    autoDownload: localStorage.getItem('auto-download') !== 'false',
    highPriority: localStorage.getItem('high-priority') !== 'false',
    notifications: localStorage.getItem('notifications') === 'true',
    isGenerating: false,
    generatedVideoUrl: null
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    tabs: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Text to Video
    textForm: document.getElementById('text-form'),
    textPrompt: document.getElementById('text-prompt'),
    textDuration: document.getElementById('text-duration'),
    textQuality: document.getElementById('text-quality'),
    textFps: document.getElementById('text-fps'),
    textFormat: document.getElementById('text-format'),
    textPreview: document.getElementById('text-preview'),
    
    // Image to Video
    imageForm: document.getElementById('image-form'),
    imageUpload: document.getElementById('image-upload'),
    uploadArea: document.getElementById('upload-area'),
    imagePreviewSmall: document.getElementById('image-preview-small'),
    previewImg: document.getElementById('preview-img'),
    imageDuration: document.getElementById('image-duration'),
    imageQuality: document.getElementById('image-quality'),
    imageFps: document.getElementById('image-fps'),
    imageFormat: document.getElementById('image-format'),
    imageMotionPrompt: document.getElementById('image-motion-prompt'),
    imagePreview: document.getElementById('image-preview'),
    
    // Settings
    apiKeyInput: document.getElementById('api-key'),
    autoDownloadCheckbox: document.getElementById('auto-download'),
    highPriorityCheckbox: document.getElementById('high-priority'),
    notificationsCheckbox: document.getElementById('notifications'),
    saveSettingsBtn: document.getElementById('save-settings'),
    
    // Modals
    progressModal: document.getElementById('progress-modal'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    cancelBtn: document.getElementById('cancel-btn'),
    
    errorModal: document.getElementById('error-modal'),
    errorMessage: document.getElementById('error-message'),
    errorCloseBtn: document.getElementById('error-close'),
    
    successModal: document.getElementById('success-modal'),
    successMessage: document.getElementById('success-message'),
    downloadBtn: document.getElementById('download-btn'),
    successCloseBtn: document.getElementById('success-close')
};

// ============================================
// Tab Navigation
// ============================================

function initTabs() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update active tab button
    elements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update active tab content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    appState.currentTab = tabName;
}

// ============================================
// Range Input Display Update
// ============================================

function initRangeInputs() {
    const ranges = [
        { input: elements.textDuration, display: null },
        { input: elements.imageDuration, display: null }
    ];
    
    ranges.forEach(({ input }) => {
        if (input) {
            input.addEventListener('input', (e) => {
                const display = e.target.closest('.input-with-display').querySelector('.duration-display');
                display.textContent = e.target.value + 's';
            });
        }
    });
}

// ============================================
// Text to Video Form
// ============================================

function initTextForm() {
    // Character count
    elements.textPrompt.addEventListener('input', (e) => {
        const charCount = e.target.value.length;
        const charDisplay = e.target.closest('.form-group').querySelector('.char-count');
        charDisplay.textContent = `${charCount} / 500`;
        
        if (charCount > 500) {
            e.target.value = e.target.value.substring(0, 500);
            charDisplay.textContent = '500 / 500';
        }
    });
    
    // Form submission
    elements.textForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            type: 'text-to-video',
            prompt: elements.textPrompt.value,
            duration: parseInt(elements.textDuration.value),
            quality: elements.textQuality.value,
            fps: parseInt(elements.textFps.value),
            format: elements.textFormat.value
        };
        
        if (!formData.prompt.trim()) {
            showError('Please enter a video description');
            return;
        }
        
        await generateVideo(formData);
    });
}

// ============================================
// Image to Video Form
// ============================================

function initImageForm() {
    // File upload click
    elements.uploadArea.addEventListener('click', () => {
        elements.imageUpload.click();
    });
    
    // File selection
    elements.imageUpload.addEventListener('change', (e) => {
        handleImageUpload(e.target.files[0]);
    });
    
    // Drag and drop
    elements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.add('drag-over');
    });
    
    elements.uploadArea.addEventListener('dragleave', () => {
        elements.uploadArea.classList.remove('drag-over');
    });
    
    elements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.uploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });
    
    // Remove image button
    const removeBtn = elements.imagePreviewSmall.querySelector('.btn-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            elements.imageUpload.value = '';
            elements.imagePreviewSmall.style.display = 'none';
            elements.uploadArea.style.display = 'block';
            appState.selectedImage = null;
        });
    }
    
    // Form submission
    elements.imageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!appState.selectedImage) {
            showError('Please upload an image');
            return;
        }
        
        const formData = {
            type: 'image-to-video',
            image: appState.selectedImage,
            motionPrompt: elements.imageMotionPrompt.value,
            duration: parseInt(elements.imageDuration.value),
            quality: elements.imageQuality.value,
            fps: parseInt(elements.imageFps.value),
            format: elements.imageFormat.value
        };
        
        await generateVideo(formData);
    });
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        showError('Please upload a valid image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        appState.selectedImage = e.target.result;
        elements.previewImg.src = e.target.result;
        elements.imagePreviewSmall.style.display = 'block';
        elements.uploadArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// ============================================
// Video Generation
// ============================================

async function generateVideo(formData) {
    if (appState.isGenerating) {
        showError('A video is already being generated');
        return;
    }
    
    if (!appState.apiKey) {
        showError('Please configure your API key in Settings');
        switchTab('settings');
        return;
    }
    
    appState.isGenerating = true;
    showProgressModal();
    
    try {
        // Simulate API call with progress updates
        const videoUrl = await simulateVideoGeneration(formData);
        
        appState.generatedVideoUrl = videoUrl;
        showSuccessModal(formData.type);
        
        // Display preview
        if (formData.type === 'text-to-video') {
            displayVideoPreview(videoUrl, elements.textPreview);
        } else {
            displayVideoPreview(videoUrl, elements.imagePreview);
        }
        
    } catch (error) {
        showError(error.message);
    } finally {
        appState.isGenerating = false;
        hideProgressModal();
    }
}

async function simulateVideoGeneration(formData) {
    return new Promise((resolve, reject) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 25;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                updateProgress(progress, 'Video generation complete!');
                
                // Create a mock video blob (in real scenario, this would be from API)
                const canvas = document.createElement('canvas');
                canvas.width = 1280;
                canvas.height = 720;
                const ctx = canvas.getContext('2d');
                
                // Draw gradient background
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0, '#4285F4');
                gradient.addColorStop(1, '#1f73b7');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 48px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Video Generated', canvas.width / 2, canvas.height / 2 - 50);
                ctx.font = '24px Arial';
                ctx.fillText(`${formData.duration}s • ${formData.quality.toUpperCase()}`, 
                           canvas.width / 2, canvas.height / 2 + 50);
                
                const videoUrl = canvas.toDataURL('image/png');
                resolve(videoUrl);
            } else {
                const statusMessages = [
                    'Initializing generation...',
                    'Processing your request...',
                    'Generating frames...',
                    'Applying effects...',
                    'Encoding video...',
                    'Finalizing...'
                ];
                const statusIndex = Math.floor((progress / 100) * statusMessages.length);
                updateProgress(progress, statusMessages[Math.min(statusIndex, statusMessages.length - 1)]);
            }
        }, 800);
        
        // Simulate potential error (2% chance)
        if (Math.random() < 0.02) {
            clearInterval(interval);
            reject(new Error('Video generation failed. Please try again.'));
        }
    });
}

function displayVideoPreview(videoUrl, previewElement) {
    const html = `
        <img src="${videoUrl}" alt="Generated Video Preview" style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);">
    `;
    previewElement.innerHTML = html;
}

function updateProgress(percentage, message) {
    elements.progressFill.style.width = percentage + '%';
    elements.progressText.textContent = message;
}

// ============================================
// Settings
// ============================================

function initSettings() {
    // Load saved settings
    elements.apiKeyInput.value = appState.apiKey;
    elements.autoDownloadCheckbox.checked = appState.autoDownload;
    elements.highPriorityCheckbox.checked = appState.highPriority;
    elements.notificationsCheckbox.checked = appState.notifications;
    
    // Save settings
    elements.saveSettingsBtn.addEventListener('click', saveSettings);
}

function saveSettings() {
    appState.apiKey = elements.apiKeyInput.value;
    appState.autoDownload = elements.autoDownloadCheckbox.checked;
    appState.highPriority = elements.highPriorityCheckbox.checked;
    appState.notifications = elements.notificationsCheckbox.checked;
    
    localStorage.setItem('veo-api-key', appState.apiKey);
    localStorage.setItem('auto-download', appState.autoDownload);
    localStorage.setItem('high-priority', appState.highPriority);
    localStorage.setItem('notifications', appState.notifications);
    
    showSuccessNotification('Settings saved successfully!');
}

// ============================================
// Modal Management
// ============================================

function showProgressModal() {
    elements.progressModal.classList.add('show');
}

function hideProgressModal() {
    elements.progressModal.classList.remove('show');
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorModal.classList.add('show');
}

function showSuccessModal(videoType) {
    const typeText = videoType === 'text-to-video' ? 'Text to Video' : 'Image to Video';
    elements.successMessage.textContent = `Your ${typeText} has been generated successfully!`;
    elements.successModal.classList.add('show');
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #34A853;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Event Listeners for Modals
// ============================================

function initModalListeners() {
    elements.errorCloseBtn.addEventListener('click', () => {
        elements.errorModal.classList.remove('show');
    });
    
    elements.successCloseBtn.addEventListener('click', () => {
        elements.successModal.classList.remove('show');
    });
    
    elements.downloadBtn.addEventListener('click', () => {
        downloadVideo();
        elements.successModal.classList.remove('show');
    });
    
    elements.cancelBtn.addEventListener('click', () => {
        appState.isGenerating = false;
        hideProgressModal();
    });
    
    // Close modals on outside click
    [elements.errorModal, elements.successModal, elements.progressModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// ============================================
// Download Video
// ============================================

function downloadVideo() {
    if (!appState.generatedVideoUrl) {
        showError('No video to download');
        return;
    }
    
    const link = document.createElement('a');
    link.href = appState.generatedVideoUrl;
    link.download = `veo-video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================
// CSS Animation Styles
// ============================================

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// Initialize Application
// ============================================

function initializeApp() {
    addAnimationStyles();
    initTabs();
    initRangeInputs();
    initTextForm();
    initImageForm();
    initSettings();
    initModalListeners();
    
    console.log('✨ Google Veo Free initialized successfully!');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}