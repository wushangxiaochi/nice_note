// 布局调整相关功能

// 调整卡片滚动设置
function adjustCardScrolling() {
    const card = document.querySelector('.card');
    if (card) {
        // 移除卡片的最大高度和滚动设置
        card.style.maxHeight = 'none';
        card.style.overflowY = 'visible';
    }
    
    // 调整右侧面板，移除其滚动设置
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
        rightPanel.style.maxHeight = 'none';
        rightPanel.style.overflowY = 'visible';
        // 确保面板可以显示全部内容
        rightPanel.style.height = 'auto';
    }
    
    // 调整body滚动
    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';
}

// 将卡片居中显示
function centerCardOnPage() {
    const card = document.querySelector('.card');
    if (card) {
        // 重置卡片的样式
        card.style.margin = '40px auto';
        card.style.position = 'relative';
        card.style.left = '0';
        
        // 确保body的样式支持居中
        document.body.style.display = 'flex';
        document.body.style.flexDirection = 'column';
        document.body.style.alignItems = 'center';
    }
}

// 调整卡片容器样式
function adjustCardContainer() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .right-panel {
            max-height: none !important;
            overflow-y: visible !important;
            height: auto !important;
        }
        
        .card {
            max-height: none !important;
            overflow-y: visible !important;
            height: auto !important;
            margin-bottom: 40px !important;
        }
        
        .app-container {
            height: auto !important;
            overflow: visible !important;
        }
    `;
    document.head.appendChild(styleEl);
}

// 将所有添加批注按钮移到卡片外部
function moveAnnotationButtonsOutside() {
    // 先清除已存在的容器和按钮
    const existingContainer = document.querySelector('.annotation-buttons-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // 清除所有浮动按钮，排除全局批注按钮
    document.querySelectorAll('.floating-note-btn').forEach(btn => {
        if (btn && btn.id !== 'global-annotation-btn') {
            btn.remove();
        }
    });
    
    // 创建批注按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'annotation-buttons-container';
    document.body.appendChild(buttonContainer);
    
    // 获取所有小标题
    const subtitles = document.querySelectorAll('h3');
    
    // 为每个小标题创建一个外部批注按钮
    subtitles.forEach((subtitle, index) => {
        // 确保不创建重复的按钮
        const existingButton = document.getElementById(`annotation-btn-${index}`);
        if (existingButton) {
            existingButton.remove();
        }
        
        const buttonId = `annotation-btn-${index}`;
        
        // 创建按钮
        const button = document.createElement('button');
        button.className = 'floating-note-btn';
        button.innerHTML = '+';
        button.id = buttonId;
        button.setAttribute('data-target', `subtitle-${index}`);
        button.onclick = function() {
            addAnnotation(`subtitle-${index}`);
        };
        
        // 计算按钮位置
        updateButtonPosition(button, subtitle);
        
        // 添加到容器
        buttonContainer.appendChild(button);
    });
    
    // 移除所有内部批注按钮
    const internalButtons = document.querySelectorAll('.add-note-btn');
    internalButtons.forEach(btn => btn.remove());
    
    // 添加外部批注按钮样式
    addFloatingButtonStyles();
}


// 添加整体批注按钮
function addGlobalAnnotationButton() {
    // 获取卡片元素
    const card = document.querySelector('.card');
    if (!card) return;
    
    // 创建整体批注容器（没有按钮，只有容器）
    const globalAnnotationContainer = document.createElement('div');
    globalAnnotationContainer.id = 'global-annotations-container';
    globalAnnotationContainer.className = 'annotations-container global-annotations';
    
    // 将整体批注容器插入到卡片的最末尾
    card.appendChild(globalAnnotationContainer);
    
    // 首先检查并移除任何现有的全局批注按钮
    const existingButton = document.getElementById('global-annotation-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    // 创建全局批注按钮
    const globalButton = document.createElement('button');
    globalButton.className = 'floating-note-btn global-floating-btn';
    globalButton.innerHTML = '+';
    globalButton.id = 'global-annotation-btn';
    globalButton.onclick = function() {
        addAnnotation('global');
    };
    
    // 直接设置按钮样式
    globalButton.style.backgroundColor = '#E67E22';
    globalButton.style.borderColor = '#E67E22';
    globalButton.style.color = 'white';
    globalButton.style.boxShadow = '0 4px 8px rgba(230, 126, 34, 0.4)';
    globalButton.style.position = 'absolute';
    
    // 计算按钮位置
    const rect = card.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    globalButton.style.top = (rect.bottom + scrollTop - 40) + 'px';
    globalButton.style.left = (rect.left - 40) + 'px';
    
    // 直接将按钮添加到body，而不是添加到容器中
    document.body.appendChild(globalButton);
    
    // 添加全局批注样式
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .global-annotations {
            margin-top: 15px;
            width: 100%;
        }
        
        .global-floating-btn {
            background-color: #E67E22 !important;
        }
        
        .global-floating-btn:hover {
            background-color: #D35400 !important;
        }
    `;
    document.head.appendChild(styleEl);
    
    // 添加滚动事件监听器，确保按钮跟随卡片移动
    window.addEventListener('scroll', function() {
        updateGlobalButtonPosition(globalButton, card);
    });
    
    // 添加窗口大小变化事件监听器
    window.addEventListener('resize', function() {
        updateGlobalButtonPosition(globalButton, card);
    });
}

// 更新全局批注按钮位置 - 修改为始终在卡片底部左侧
function updateGlobalButtonPosition(button, card) {
    const rect = card.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // 设置按钮位置在卡片底部左侧
    button.style.top = (rect.bottom + scrollTop - 40) + 'px';
    button.style.left = (rect.left - 40) + 'px';
}

// 更新按钮位置
function updateButtonPosition(button, subtitle) {
    const rect = subtitle.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    button.style.top = (rect.top + scrollTop + rect.height/2 - 14) + 'px';
    button.style.left = (rect.left - 40) + 'px';
}

// 更新所有批注按钮位置
function updateAllAnnotationButtonPositions() {
    // 获取所有小标题和对应的批注按钮
    const subtitles = document.querySelectorAll('h3');
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // 处理普通批注按钮
    subtitles.forEach((subtitle, index) => {
        const button = document.getElementById(`annotation-btn-${index}`);
        if (button) {
            const rect = subtitle.getBoundingClientRect();
            button.style.top = (rect.top + scrollTop + rect.height/2 - 14) + 'px';
            button.style.left = (rect.left - 40) + 'px';
        }
    });
    
    // 处理全局批注按钮
    const globalButton = document.getElementById('global-annotation-btn');
    const card = document.querySelector('.card');
    if (globalButton && card) {
        const rect = card.getBoundingClientRect();
        globalButton.style.top = (rect.bottom + scrollTop - 40) + 'px';
        globalButton.style.left = (rect.left - 40) + 'px';
    }
}

// 导出函数
window.adjustCardScrolling = adjustCardScrolling;
window.centerCardOnPage = centerCardOnPage;
window.adjustCardContainer = adjustCardContainer;
window.moveAnnotationButtonsOutside = moveAnnotationButtonsOutside;
window.addGlobalAnnotationButton = addGlobalAnnotationButton;
window.updateGlobalButtonPosition = updateGlobalButtonPosition;
window.updateButtonPosition = updateButtonPosition;
window.updateAllAnnotationButtonPositions = updateAllAnnotationButtonPositions;