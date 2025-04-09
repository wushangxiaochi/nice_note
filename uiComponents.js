// UI组件和样式相关功能

// 添加批注相关的CSS样式
function addAnnotationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* 批注容器 */
        .annotations-container {
            margin-top: 10px;
            margin-bottom: 15px;
        }
        
        /* 批注公共样式 - 所有批注统一字体 */
        .annotation {
            position: relative;
            padding: 15px;
            margin: 15px 0 15px 20px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
            max-width: 90%;
            font-family: '华文楷体', 'STKaiti', serif;
            line-height: 1.6;
        }
        
        /* 普通段落批注样式 */
        .annotation:not(#global-annotations-container .annotation) {
            background-color: #ebd9af;
            border-radius: 10px;
        }
        
        .annotation:not(#global-annotations-container .annotation):before {
            content: "";
            position: absolute;
            top: -10px;
            left: 20px;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent #ebd9af transparent;
        }
        
        /* 整体批注特殊样式 */
        #global-annotations-container .annotation {
            border-radius: 15px;
            padding: 18px;
            margin: 15px 0 20px 0;
            background-color: rgba(235, 217, 175, 0.8);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            backdrop-filter: blur(4px);
            border-left: 3px solid rgba(0,0,0,0.2);
        }
        
        /* 移除整体批注的小尖角 */
        #global-annotations-container .annotation:after {
            display: none;
        }
        
        /* 批注编辑器 */
        .annotation-editor {
            min-height: 50px;
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 5px;
            margin-top: 10px;
            outline: none;
            font-family: inherit;
            line-height: 1.5;
        }
        
        /* 颜色选择器 */
        .color-selector {
            display: flex;
            gap: 5px;
            margin-top: 10px;
        }
        
        .color-option {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid #333;
            transition: transform 0.15s;
        }
        
        .color-option:hover {
            transform: scale(1.15);
        }
        
        /* 批注控制按钮 */
        .annotation-controls {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .annotation-controls button {
            font-size: 12px;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            color: white;
            font-family: inherit;
        }
        
        .confirm-btn {
            background-color: #4CAF50;
        }
        
        .delete-btn {
            background-color: #f44336;
        }
        
        /* 批注页脚 */
        .annotation-footer {
            text-align: right;
            font-size: 12px;
            color: #777;
            margin-top: 10px;
            font-style: italic;
        }
        
        /* 编辑覆盖层 */
        .edit-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            border-radius: 10px;
        }
        
        #global-annotations-container .edit-overlay {
            border-radius: 15px;
        }
        
        .annotation:hover .edit-overlay {
            opacity: 1;
            pointer-events: auto;
        }
        
        .edit-btn {
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 5px 15px;
            border-radius: 3px;
            cursor: pointer;
            font-family: inherit;
        }
        
        /* 整体批注区域 */
        .global-annotations {
            margin-top: 5px;
            width: 100%;
        }
        
        /* 批注内容的强化样式 */
        .annotation-content {
            line-height: 1.6;
        }
        
        /* 整体批注内容样式优化 */
        #global-annotations-container .annotation-content {
            text-indent: 2em;
        }
        
        /* 修改全局批注宽度对齐 */
        #global-annotations-container {
            margin-top: 15px;
            width: 100%;
            max-width: 100%;
        }
        
        /* 特别调整全局批注自身的宽度 */
        #global-annotations-container .annotation {
            max-width: 100%;
            margin-left: 0;
            margin-right: 0;
            width: 100%;
            box-sizing: border-box;
        }
    `;
    document.head.appendChild(styleElement);
}

// 添加外部批注按钮样式
function addFloatingButtonStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .annotation-buttons-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        }
        
        .floating-note-btn {
            position: absolute;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #E67E22;
            color: white;
            border: none;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            pointer-events: auto;
            z-index: 1000;
            transition: transform 0.2s, background-color 0.2s;
            padding: 0;
            line-height: 1;
        }
        
        .floating-note-btn:hover {
            transform: scale(1.1);
            background-color: #E67E22;
        }
    `;
    document.head.appendChild(styleEl);
}

// 将主题切换按钮移到卡片外部
function moveThemeSwitcherOutsideCard() {
    const colorSelector = document.querySelector('.color-selector');
    if (!colorSelector) return;
    
    // 移除现有的选择器
    const colorButtons = colorSelector.querySelectorAll('.color-btn');
    colorSelector.remove();
    
    // 创建新的主题切换器
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    
    // 复制原来的按钮到新的切换器
    colorButtons.forEach(btn => {
        const color = btn.style.backgroundColor;
        
        const newBtn = document.createElement('div');
        newBtn.className = 'theme-btn';
        newBtn.style.backgroundColor = color;
        
        // 替换原来的onclick处理程序
        newBtn.addEventListener('click', function() {
            // 切换主题颜色
            changeBackground(color);
        });
        
        themeSwitcher.appendChild(newBtn);
    });
    
    // 将新的主题切换器添加到body
    document.body.appendChild(themeSwitcher);
    
    // 添加主题切换器样式
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .theme-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 9999;
        }
        
        .theme-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #333;
            transition: transform 0.2s;
        }
        
        .theme-btn:hover {
            transform: scale(1.2);
        }
    `;
    document.head.appendChild(styleEl);
}

// 重写changeBackground函数
function changeBackground(color) {
    // 更改页面背景色
    document.body.style.backgroundColor = color;
    
    // 同时更改卡片背景色
    const card = document.querySelector('.card');
    if (card) {
        card.style.backgroundColor = color;
    }
}

// 导出函数
window.addAnnotationStyles = addAnnotationStyles;
window.addFloatingButtonStyles = addFloatingButtonStyles;
window.moveThemeSwitcherOutsideCard = moveThemeSwitcherOutsideCard;
window.changeBackground = changeBackground;