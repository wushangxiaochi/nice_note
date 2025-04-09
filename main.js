// 主入口文件
let ticking = false;

// 创建基于requestAnimationFrame的滚动处理函数
function optimizedScrollHandler() {
    if (!ticking) {
        requestAnimationFrame(function() {
            updateAllAnnotationButtonPositions();
            ticking = false;
        });
        ticking = true;
    }
}

// 动态加载所有模块
function loadModules() {
    const modules = [
        'annotationSystem.js',
        'uiComponents.js',
        'layoutManager.js',
        'downloadManager.js'
    ];
    
    modules.forEach(module => {
        const script = document.createElement('script');
        script.src = module;
        document.head.appendChild(script);
    });
}

// 初始化页面
function initPage() {
    // 初始化批注功能
    initAnnotationSystem();
    // 将主题切换按钮移到卡片外面
    moveThemeSwitcherOutsideCard();
    // 添加整体批注按钮
    addGlobalAnnotationButton();
    // 添加下载按钮
    addDownloadButton();
    // 将所有添加批注按钮移到卡片外部
    moveAnnotationButtonsOutside();
    
    // 添加DOM变化监听，确保批注按钮位置始终正确
    const observer = new MutationObserver(function(mutations) {
        updateAllAnnotationButtonPositions();
    });
    
    // 监听卡片内容变化
    const card = document.querySelector('.card');
    if (card) {
        observer.observe(card, { 
            childList: true, 
            subtree: true,
            attributes: true,
            characterData: true
        });
    }
    
    // 使用优化的滚动处理函数
    window.addEventListener('scroll', optimizedScrollHandler);
    
    // 添加窗口大小变化事件监听
    window.addEventListener('resize', function() {
        updateAllAnnotationButtonPositions();
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 先加载所有模块
    loadModules();
    
    // 等待模块加载完成后初始化页面
    // 使用setTimeout确保所有模块都已加载
    setTimeout(initPage, 100);
    
    // 设置默认页脚名称
    const footerAccountName = document.getElementById('footer-account-name');
    const accountNameInput = document.getElementById('account-name');
    
    if (footerAccountName && accountNameInput) {
        footerAccountName.textContent = accountNameInput.value || 'AIGC好语知时节';
    }
    
    // 确保二维码容器默认隐藏
    const qrcodeContainer = document.getElementById('url-qrcode');
    if (qrcodeContainer) {
        qrcodeContainer.style.display = 'none';
    }
});

// 绑定事件监听器
function bindEventListeners() {
    // 提炼内容要点按钮
    const extractBtn = document.getElementById('extract-btn');
    if (extractBtn) {
        extractBtn.addEventListener('click', function() {
            const noteInput = document.getElementById('note-input').value;
            if (noteInput.trim() === '') {
                alert('请先输入笔记内容！');
                return;
            }
            
            // 显示加载动画
            document.getElementById('extraction-loading').classList.remove('hidden');
            document.getElementById('extraction-result').classList.add('hidden');
            
            // 直接调用processNote，不使用setTimeout
            processNote(noteInput);
        });
    }
    
    // 生成知识卡片按钮
    const generateCardBtn = document.getElementById('generate-card-btn');
    if (generateCardBtn) {
        generateCardBtn.addEventListener('click', function() {
            generateCard();
        });
    }
}

// 处理窗口大小变化
window.addEventListener('resize', function() {
    // 如果批注系统已初始化，更新批注按钮位置
    if (window.annotationSystemInitialized) {
        const subtitles = document.querySelectorAll('h3');
        subtitles.forEach((subtitle, index) => {
            const button = document.getElementById(`annotation-btn-${index}`);
            if (button) {
                updateButtonPosition(button, subtitle);
            }
        });
        
        // 更新全局批注按钮位置
        const globalButton = document.getElementById('global-annotation-btn');
        const card = document.querySelector('.card');
        if (globalButton && card) {
            updateGlobalButtonPosition(globalButton, card);
        }
    }
});

// 更新按钮位置 - 统一实现
function updateButtonPosition(button, targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // 按钮位置：元素左侧往外偏移约10px
    button.style.top = (rect.top + scrollTop + rect.height/2 - 14) + 'px';
    button.style.left = (rect.left - 40) + 'px';
}

// 更新全局批注按钮位置 - 统一实现
function updateGlobalButtonPosition(button, card) {
    const rect = card.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // 按钮位置：卡片底部左侧
    button.style.top = (rect.bottom + scrollTop - 40) + 'px';
    button.style.left = (rect.left - 40) + 'px';
}

// 更新所有批注按钮位置
function updateAllAnnotationButtonPositions() {
    // 避免重复查询DOM元素
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