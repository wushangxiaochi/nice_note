// 下载功能相关代码

// 添加下载按钮
function addDownloadButton() {
    // 创建下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = '下载卡片';
    downloadBtn.onclick = function() {
        downloadCardAsImage();
    };
    
    // 添加下载按钮到页面
    const downloadContainer = document.createElement('div');
    downloadContainer.className = 'download-container';
    downloadContainer.appendChild(downloadBtn);
    document.body.appendChild(downloadContainer);
    
    // 添加样式
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .download-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .download-btn {
            background-color: #E67E22;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        
        .download-btn:hover {
            background-color: #E67E22;
        }
    `;
    document.head.appendChild(styleEl);
    
    // 动态加载html2canvas库
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(script);
}

// 下载卡片为图片
function downloadCardAsImage() {
    // 检查html2canvas是否已加载
    if (typeof html2canvas !== 'function') {
        alert('正在加载转换库，请稍后再试...');
        return;
    }
    
    // 显示加载状态
    const downloadBtn = document.querySelector('.download-btn');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = '生成中...';
    downloadBtn.disabled = true;
    
    // 获取卡片元素
    const card = document.querySelector('.card');
    
    // 确保页脚在下载前可见
    const footer = card.querySelector('.card-footer');
    if (footer) {
        footer.style.display = 'flex';
    }
    
    // 确保二维码在下载前已完全渲染
    const qrcode = card.querySelector('#url-qrcode');
    if (qrcode && qrcode.style.display !== 'none') {
        // 给二维码渲染一点时间
        setTimeout(() => captureAndDownload(card, downloadBtn, originalText), 200);
    } else {
        captureAndDownload(card, downloadBtn, originalText);
    }
}

// 捕获并下载卡片
function captureAndDownload(card, downloadBtn, originalText) {
    // 使用html2canvas将卡片转换为画布，2倍清晰度
    html2canvas(card, {
        scale: 2, // 设置2倍清晰度
        useCORS: true,
        backgroundColor: null,
        // 确保捕获完整卡片，包括页脚
        onclone: function(clonedDoc) {
            const clonedCard = clonedDoc.querySelector('.card');
            if (clonedCard) {
                // 确保克隆的卡片中页脚可见
                const footer = clonedCard.querySelector('.card-footer');
                if (footer) {
                    footer.style.display = 'flex';
                }
            }
        }
    }).then(function(canvas) {
        // 创建下载链接
        const link = document.createElement('a');
        link.download = '知识卡片.png';
        link.href = canvas.toDataURL('image/png');
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 恢复按钮状态
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    }).catch(function(error) {
        console.error('下载失败:', error);
        alert('下载失败，请重试');
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    });
}

// 导出函数
window.addDownloadButton = addDownloadButton;
window.downloadCardAsImage = downloadCardAsImage;
window.captureAndDownload = captureAndDownload;