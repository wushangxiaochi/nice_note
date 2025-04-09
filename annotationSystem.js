// 批注系统核心功能

// 添加批注
function addAnnotation(targetId) {
    const containerId = targetId === 'global' ? 
        'global-annotations-container' : 
        `annotations-${targetId}`;
        
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const annotationId = `annotation-${targetId}-${Date.now()}`;
    
    const annotationHTML = `
        <div class="annotation" id="${annotationId}">
            <div contenteditable="true" class="annotation-editor" placeholder="输入您的批注..."></div>
            <div class="color-selector">
                <div class="color-option" style="background-color:#ebd9af" onclick="changeAnnotationColor('${annotationId}', '#ebd9af')"></div>
                <div class="color-option" style="background-color:#dad0cf" onclick="changeAnnotationColor('${annotationId}', '#dad0cf')"></div>
                <div class="color-option" style="background-color:#e4c8ae" onclick="changeAnnotationColor('${annotationId}', '#e4c8ae')"></div>
                <div class="color-option" style="background-color:#c6dcff" onclick="changeAnnotationColor('${annotationId}', '#c6dcff')"></div>
                <div class="color-option" style="background-color:#afc5d2" onclick="changeAnnotationColor('${annotationId}', '#afc5d2')"></div>
            </div>
            <div class="annotation-controls">
                <button class="confirm-btn" onclick="confirmAnnotation('${annotationId}')">确认</button>
                <button class="delete-btn" onclick="deleteAnnotation('${annotationId}')">删除</button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', annotationHTML);
    
    // 添加批注后更新所有批注按钮位置
    setTimeout(updateAllAnnotationButtonPositions, 100);
}

// 确认批注
function confirmAnnotation(annotationId) {
    const annotation = document.getElementById(annotationId);
    const editor = annotation.querySelector('.annotation-editor');
    const content = editor.innerHTML;
    
    if (!content.trim()) {
        alert('批注内容不能为空！');
        return;
    }
    
    // 获取当前颜色，如果没有明确设置，则使用计算样式
    let currentColor = annotation.style.backgroundColor;
    if (!currentColor || currentColor === '') {
        currentColor = window.getComputedStyle(annotation).backgroundColor;
    }
    
    // RGB转Hex的辅助函数
    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        
        // 从rgb(r, g, b)格式提取数字
        const rgbArr = rgb.match(/\d+/g);
        if (!rgbArr || rgbArr.length < 3) return '#ebd9af'; // 默认颜色
        
        return '#' + ((1 << 24) + (parseInt(rgbArr[0]) << 16) + 
                     (parseInt(rgbArr[1]) << 8) + parseInt(rgbArr[2]))
                     .toString(16).slice(1);
    }
    
    // 确保颜色值为hex格式
    const hexColor = rgbToHex(currentColor);
    const contentHTML = content;
    
    // 转换为确认状态
    annotation.innerHTML = `
        <div class="annotation-content">${contentHTML}</div>
        <div class="annotation-footer">Comments</div>
        <div class="edit-overlay">
            <button class="edit-btn" onclick="editAnnotation('${annotationId}', '${encodeURIComponent(contentHTML)}', '${hexColor}')">修改</button>
        </div>
    `;
    
    // 明确设置批注背景色
    annotation.style.backgroundColor = hexColor;
    
    // 确定是否为整体批注
    const isGlobal = annotationId.includes('global');
    
    // 更新小尖角颜色 (只对普通批注应用)
    if (!isGlobal) {
        // 创建小尖角样式
        const arrowStyleId = `arrow-style-${annotationId}`;
        let arrowStyle = document.getElementById(arrowStyleId);
        
        if (!arrowStyle) {
            arrowStyle = document.createElement('style');
            arrowStyle.id = arrowStyleId;
            document.head.appendChild(arrowStyle);
        }
        
        arrowStyle.textContent = `#${annotationId}:before {
            content: "";
            position: absolute;
            top: -10px;
            left: 20px;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent ${hexColor} transparent !important;
            display: block !important;
        }`;
    }
    
    // 确认批注后更新所有批注按钮位置
    setTimeout(updateAllAnnotationButtonPositions, 100);
}

// 删除批注函数
function deleteAnnotation(annotationId) {
    const annotation = document.getElementById(annotationId);
    if (annotation) {
        // 添加淡出动画效果
        annotation.style.transition = 'opacity 0.3s ease';
        annotation.style.opacity = '0';
        
        // 等待动画完成后移除元素
        setTimeout(() => {
            annotation.remove();
            // 删除批注后更新所有批注按钮位置
            updateAllAnnotationButtonPositions();
        }, 300);
    }
}

// 编辑批注
function editAnnotation(annotationId, contentEncoded, color) {
    const annotation = document.getElementById(annotationId);
    const content = decodeURIComponent(contentEncoded);
    
    annotation.innerHTML = `
        <div contenteditable="true" class="annotation-editor">${content}</div>
        <div class="color-selector">
            <div class="color-option" style="background-color:#ebd9af" onclick="changeAnnotationColor('${annotationId}', '#ebd9af')"></div>
            <div class="color-option" style="background-color:#dad0cf" onclick="changeAnnotationColor('${annotationId}', '#dad0cf')"></div>
            <div class="color-option" style="background-color:#e4c8ae" onclick="changeAnnotationColor('${annotationId}', '#e4c8ae')"></div>
            <div class="color-option" style="background-color:#c6dcff" onclick="changeAnnotationColor('${annotationId}', '#c6dcff')"></div>
            <div class="color-option" style="background-color:#afc5d2" onclick="changeAnnotationColor('${annotationId}', '#afc5d2')"></div>
        </div>
        <div class="annotation-controls">
            <button class="confirm-btn" onclick="confirmAnnotation('${annotationId}')">确认</button>
            <button class="delete-btn" onclick="deleteAnnotation('${annotationId}')">删除</button>
        </div>
    `;
    
    // 恢复批注颜色
    annotation.style.backgroundColor = color;
    
    // 确保小尖角颜色也保持一致
    const beforePseudoElement = document.createElement('style');
    beforePseudoElement.textContent = `#${annotationId}:before { border-color: transparent transparent ${color} transparent !important; }`;
    document.head.appendChild(beforePseudoElement);
}

// 添加批注颜色切换函数
function changeAnnotationColor(annotationId, color) {
    const annotation = document.getElementById(annotationId);
    if (!annotation) return;
    
    // 设置批注背景色
    annotation.style.backgroundColor = color;
    
    // 如果是普通批注，还需要更新小尖角的颜色
    const isGlobal = annotationId.includes('global');
    if (!isGlobal) {
        // 创建或更新小尖角样式
        const arrowStyleId = `arrow-style-${annotationId}`;
        let arrowStyle = document.getElementById(arrowStyleId);
        
        if (!arrowStyle) {
            arrowStyle = document.createElement('style');
            arrowStyle.id = arrowStyleId;
            document.head.appendChild(arrowStyle);
        }
        
        arrowStyle.textContent = `#${annotationId}:before {
            content: "";
            position: absolute;
            top: -10px;
            left: 20px;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent ${color} transparent !important;
            display: block !important;
        }`;
    }
}

// 为所有小标题添加批注容器
function addAnnotationContainers() {
    // 获取所有h3标签（小标题）
    const subtitles = document.querySelectorAll('h3');
    
    subtitles.forEach((subtitle, index) => {
        // 为小标题添加ID，以便于后续定位
        subtitle.id = `subtitle-${index}`;
        
        // 找到该标题对应的内容区域（通常是小标题后面的ul或p元素）
        let contentElement = subtitle.nextElementSibling;
        
        // 创建批注容器
        const annotationsContainer = document.createElement('div');
        annotationsContainer.id = `annotations-subtitle-${index}`;
        annotationsContainer.className = 'annotations-container';
        
        // 将批注容器插入到内容区域之后，而不是小标题之后
        // 如果没有找到内容元素，则插入到小标题后面
        if (contentElement && (contentElement.tagName === 'UL' || contentElement.tagName === 'OL' || contentElement.tagName === 'P')) {
            contentElement.parentNode.insertBefore(annotationsContainer, contentElement.nextSibling);
        } else {
            subtitle.parentNode.insertBefore(annotationsContainer, subtitle.nextSibling);
        }
    });
    
    // 添加必要的CSS样式
    addAnnotationStyles();
}

// 初始化批注系统
function initAnnotationSystem() {
    // 为所有小标题添加批注容器
    addAnnotationContainers();
    // 移除卡片滚动条，改用页面滚动
    adjustCardScrolling();
    // 强制应用容器样式修改
    adjustCardContainer();
    // 调整卡片位置
    centerCardOnPage();
    // 确保全局批注容器在页脚上方
    adjustGlobalAnnotationsContainer();
}

// 确保全局批注容器在页脚上方
function adjustGlobalAnnotationsContainer() {
    const globalContainer = document.getElementById('global-annotations-container');
    const footer = document.querySelector('.card-footer');
    
    if (globalContainer && footer) {
        // 确保全局批注容器在页脚上方
        const cardPoints = document.getElementById('card-points');
        if (cardPoints) {
            cardPoints.insertAdjacentElement('afterend', globalContainer);
            globalContainer.style.marginBottom = '30px';
        }
    }
}

// 添加全局批注按钮
function addGlobalAnnotationButton() {
    // 检查是否已存在全局批注按钮
    if (document.getElementById('global-annotation-btn')) {
        return;
    }
    
    // 创建全局批注按钮
    const globalBtn = document.createElement('button');
    globalBtn.id = 'global-annotation-btn';
    globalBtn.className = 'annotation-btn global-btn';
    globalBtn.innerHTML = '<i class="ph ph-plus-circle"></i> 添加整体批注';
    globalBtn.onclick = function() {
        addAnnotation('global');
    };
    
    // 添加按钮到页面
    document.body.appendChild(globalBtn);
    
    // 定位按钮
    positionGlobalAnnotationButton();
}

// 定位全局批注按钮
function positionGlobalAnnotationButton() {
    const globalBtn = document.getElementById('global-annotation-btn');
    const card = document.querySelector('.card');
    const footer = document.querySelector('.card-footer');
    
    if (globalBtn && card && footer) {
        const cardRect = card.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        
        // 将按钮放在页脚上方
        globalBtn.style.position = 'absolute';
        globalBtn.style.left = `${cardRect.left + cardRect.width / 2 - 75}px`;
        globalBtn.style.top = `${footerRect.top - 50}px`;
    }
}

// 导出函数
window.addAnnotation = addAnnotation;
window.confirmAnnotation = confirmAnnotation;
window.deleteAnnotation = deleteAnnotation;
window.editAnnotation = editAnnotation;
window.changeAnnotationColor = changeAnnotationColor;
window.addAnnotationContainers = addAnnotationContainers;
window.initAnnotationSystem = initAnnotationSystem;
window.adjustGlobalAnnotationsContainer = adjustGlobalAnnotationsContainer;
window.addGlobalAnnotationButton = addGlobalAnnotationButton;
window.positionGlobalAnnotationButton = positionGlobalAnnotationButton;