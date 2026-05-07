// Mac Resume - JavaScript functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginScreen = document.getElementById('loginScreen');
    const desktop = document.getElementById('desktop');
    const enterButton = document.getElementById('enterButton');

    // 登录功能
    enterButton.addEventListener('click', function() {
        // 添加点击反馈
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);

        // 添加加载动画
        enterButton.textContent = '正在启动...';
        enterButton.disabled = true;

        setTimeout(() => {
            loginScreen.style.opacity = '0';
            setTimeout(() => {
                loginScreen.style.display = 'none';
                desktop.style.display = 'flex';
                setTimeout(() => {
                    desktop.style.opacity = '1';
                    // 显示Dock�?                    showDock();
                    // 切换到主页面
                    switchPage('home');
                }, 100);
            }, 800);
        }, 1000);
    });

    // 页面切换功能
    function switchPage(pageType) {
        // 隐藏所有页�?        const pages = document.querySelectorAll('.content-page');
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageType + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
        }

        // 更新Dock栏active状�?        const dockItems = document.querySelectorAll('.dock-item');
        dockItems.forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-page="${pageType}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // 显示Dock�?    function showDock() {
        const dock = document.getElementById('bottomDock');
        if (dock) {
            dock.style.display = 'flex';
        }
    }

    // 初始化Dock功能
    function initDock() {
        const dockItems = document.querySelectorAll('.dock-item');
        dockItems.forEach((item, index) => {
            // 双击功能
            let clickTimer = null;

            item.addEventListener('click', function(e) {
                e.preventDefault();

                // 废纸篓无功能
                if (this.classList.contains('trash-item')) {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                    return;
                }

                if (clickTimer === null) {
                    // 第一次点�?                    clickTimer = setTimeout(() => {
                        // 单点�?- 切换页面
                        const pageType = this.getAttribute('data-page');
                        if (pageType) {
                            switchPage(pageType);
                        }
                        clickTimer = null;
                    }, 300);

                    // 单击反馈
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    // 双击
                    clearTimeout(clickTimer);
                    clickTimer = null;

                    const pageType = this.getAttribute('data-page');
                    if (pageType) {
                        // 添加启动动画
                        this.classList.add('launching');
                        setTimeout(() => {
                            this.classList.remove('launching');
                        }, 600);

                        // 打开窗口而不是切换页�?                        openWindow(pageType);
                    }
                }
            });

            // macOS风格的悬停效�?            item.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const dockRect = this.closest('.dock-container').getBoundingClientRect();
                const position = index;

                // 当前项放�?                this.style.zIndex = '1000';
                const icon = this.querySelector('.dock-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.3)';
                }

                // 相邻项依次缩小放�?                dockItems.forEach((otherItem, otherIndex) => {
                    if (otherItem === this) return;

                    const distance = Math.abs(otherIndex - position);
                    const otherIcon = otherItem.querySelector('.dock-icon');

                    if (otherIcon) {
                        let scale = 1;
                        if (distance === 1) {
                            scale = 1.15; // 相邻�?                        } else if (distance === 2) {
                            scale = 1.05; // 隔一个项
                        }

                        // 根据距离调整位置
                        const offsetY = (1.3 - scale) * 20; // 放大倍数�?* 20px
                        otherIcon.style.transform = `scale(${scale}) translateY(-${offsetY}px)`;
                    }
                });
            });

            item.addEventListener('mouseleave', function() {
                this.style.zIndex = '';
                const icon = this.querySelector('.dock-icon');
                if (icon) {
                    icon.style.transform = '';
                }

                // 重置所有dock�?                dockItems.forEach(otherItem => {
                    const otherIcon = otherItem.querySelector('.dock-icon');
                    if (otherIcon) {
                        otherIcon.style.transform = '';
                    }
                });
            });
        });
    }

    // 窗口管理功能
    function openWindow(type) {
        // 检查窗口是否已经存�?        let window = document.getElementById(type + 'Window');

        if (!window) {
            // 创建新窗�?            window = document.createElement('div');
            window.id = type + 'Window';
            window.className = 'window';
            window.innerHTML = `
                <div class="window-header">
                    <div class="window-controls">
                        <button class="control-button close-button" data-action="close"></button>
                        <button class="control-button minimize-button" data-action="minimize"></button>
                        <button class="control-button maximize-button" data-action="maximize"></button>
                    </div>
                    <div class="window-title">${getWindowTitle(type)}</div>
                </div>
                <div class="window-content" id="${type}Content">
                    <!-- 内容将通过JavaScript动态加�?-->
                </div>
            `;

            // 设置窗口基本样式
            window.style.width = '800px';
            window.style.height = '600px';
            window.style.maxWidth = '90vw';
            window.style.maxHeight = '90vh';

            document.body.appendChild(window);

            // 设置初始位置为屏幕中�?            const screenWidth = window.innerWidth || document.documentElement.clientWidth;
            const screenHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = 800;
            const windowHeight = 600;

            window.style.left = Math.max(0, (screenWidth - windowWidth) / 2) + 'px';
            window.style.top = Math.max(0, (screenHeight - windowHeight) / 2) + 'px';
            window.style.transform = 'none';

            // 添加窗口控制事件监听
            setupWindowControls(type, window);

            // 加载内容
            loadWindowContent(type);
        }

        // 对于已存在的窗口，确保有正确的结�?        if (!window.querySelector('.window-header')) {
            console.error('窗口缺少window-header结构:', window.id);
            // 如果缺少header，重新创建窗�?            const newWindow = document.createElement('div');
            newWindow.id = window.id;
            newWindow.className = 'window';
            newWindow.innerHTML = `
                <div class="window-header">
                    <div class="window-controls">
                        <button class="control-button close-button" data-action="close"></button>
                        <button class="control-button minimize-button" data-action="minimize"></button>
                        <button class="control-button maximize-button" data-action="maximize"></button>
                    </div>
                    <div class="window-title">${getWindowTitle(type)}</div>
                </div>
                <div class="window-content" id="${type}Content">
                    <!-- 内容将通过JavaScript动态加�?-->
                </div>
            `;

            // 复制现有样式和内�?            newWindow.style.cssText = window.style.cssText;
            const existingContent = window.querySelector('.window-content');
            if (existingContent) {
                newWindow.querySelector('.window-content').innerHTML = existingContent.innerHTML;
            }

            // 替换窗口
            window.parentNode.replaceChild(newWindow, window);
            window = newWindow;
            console.log('已修复窗口结�?', window.id);
        }

        // 拖拽功能已在index.html中的createWindow函数中处�?        // makeDraggable(window);

        window.style.display = 'block';
        window.classList.add('active');

        // 确保窗口在最前面
        bringToFront(type);
    }

    function loadWindowContent(type) {
        const contentDiv = document.getElementById(type + 'Content');
        if (!contentDiv) return;

        // 从隐藏的section中获取内�?        const sourceSection = document.getElementById(type);
        if (sourceSection) {
            contentDiv.innerHTML = sourceSection.innerHTML;
        } else {
            // 如果没有对应的section，显示通用内容
            contentDiv.innerHTML = '<p>内容加载�?..</p>';
        }
    }

    function setupWindowControls(type, window) {
        const controls = window.querySelectorAll('.control-button');
        controls.forEach(control => {
            control.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.getAttribute('data-action');
                switch(action) {
                    case 'close':
                        closeWindow(type);
                        break;
                    case 'minimize':
                        minimizeWindow(type);
                        break;
                    case 'maximize':
                        maximizeWindow(type);
                        break;
                }
            });
        });
    }

    function bringToFront(type) {
        // 将所有窗口的z-index重置
        document.querySelectorAll('.window').forEach(win => {
            win.style.zIndex = '1001';
        });

        // 将当前窗口置�?        const currentWindow = document.getElementById(type + 'Window');
        if (currentWindow) {
            currentWindow.style.zIndex = '1002';
        }
    }

    function closeWindow(type) {
        const window = document.getElementById(type + 'Window');
        if (window) {
            window.classList.remove('active');
            setTimeout(() => {
                window.style.display = 'none';
            }, 300);
        }
    }

    function minimizeWindow(type) {
        const window = document.getElementById(type + 'Window');
        if (window) {
            if (window.classList.contains('minimized')) {
                // Already minimized, do nothing
                return;
            }

            // Minimize with animation
            window.classList.add('minimized');
            window.classList.remove('active');

            // Store original position and size
            window.dataset.originalWidth = window.style.width || '800px';
            window.dataset.originalHeight = window.style.height || '600px';
            window.dataset.originalTop = window.style.top || '50%';
            window.dataset.originalLeft = window.style.left || '50%';
            window.dataset.originalTransform = window.style.transform || 'translate(-50%, -50%)';

            setTimeout(() => {
                window.style.display = 'none';
                // Reset transform for next time
                setTimeout(() => {
                    window.classList.remove('minimized');
                    window.style.transform = window.dataset.originalTransform;
                }, 100);
            }, 300);
        }
    }

    function maximizeWindow(type) {
        const window = document.getElementById(type + 'Window');
        if (window) {
            if (window.classList.contains('maximized')) {
                // Restore to normal size
                window.classList.remove('maximized');
                window.style.width = '800px';
                window.style.height = '600px';
                window.style.top = '50%';
                window.style.left = '50%';
                window.style.transform = 'translate(-50%, -50%)';
            } else {
                // Maximize
                window.classList.add('maximized');
            }
        }
    }

    function getWindowTitle(type) {
        const titles = {
            'education': '教育背景',
            'experience': '工作经历',
            'certificates': '获奖经历',
            'projects': '项目作品',
            'skills': '技能特�?,
            'contact': '联系方式'
        };
        return titles[type] || '窗口';
    }

    function makeDraggable(element) {
        // 检查是否已经初始化过拖�?        if (element.__draggableInitialized) {
            console.log('窗口已初始化拖拽功能:', element.id);
            return;
        }

        console.log('makeDraggable called for element:', element.id);

        const header = element.querySelector('.window-header');

        // 检查是否找到标题栏
        if (!header) {
            console.error('未找到window-header元素:', element.id, element);
            // 尝试修复：重新创建header
            const windowControls = document.createElement('div');
            windowControls.className = 'window-header';
            windowControls.innerHTML = `
                <div class="window-controls">
                    <button class="control-button close-button" data-action="close"></button>
                    <button class="control-button minimize-button" data-action="minimize"></button>
                    <button class="control-button maximize-button" data-action="maximize"></button>
                </div>
                <div class="window-title">窗口</div>
            `;
            element.insertBefore(windowControls, element.firstChild);
            console.log('已自动创建window-header:', element.id);
        }
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        function dragStart(e) {
            // 排除按钮点击
            if (e.target.closest('.control-button')) {
                return false;
            }

            // 确保点击在标题栏�?            if (!header.contains(e.target) && e.target !== header) {
                return false;
            }

            console.log('拖拽开�?, e.target, header.contains(e.target));

            isDragging = true;

            // 获取鼠标相对于窗口左上角的偏�?            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // 添加全局事件监听�?            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);

            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function dragMove(e) {
            if (!isDragging) return;

            console.log('拖拽�?', e.clientX, e.clientY);

            // 计算新位�?            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.transform = 'none';

            e.preventDefault();
        }

        function dragEnd(e) {
            if (!isDragging) return;

            console.log('拖拽结束');

            isDragging = false;
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        }

        // 添加拖拽事件监听器到标题�?        header.addEventListener('mousedown', dragStart);

        console.log('拖拽功能已绑定到窗口:', element.id);

        // 标记已初始化
        element.__draggableInitialized = true;
    }

    // 桌面图标双击功能
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
        let clickTimer = null;

        icon.addEventListener('click', function(e) {
            e.preventDefault();

            if (clickTimer === null) {
                // 第一次点�?                clickTimer = setTimeout(() => {
                    clickTimer = null;
                }, 300);

                // 单击反馈效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            } else {
                // 双击
                clearTimeout(clickTimer);
                clickTimer = null;

                const pageType = this.getAttribute('data-page');
                if (pageType) {
                    // 添加打开动画效果
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                        openWindow(pageType);
                    }, 150);
                }
            }
        });

        // 悬停效果
        icon.addEventListener('mouseenter', function() {
            if (!this.style.transform.includes('scale(0.95)') && !this.style.transform.includes('scale(1.1)')) {
                this.style.transform = 'scale(1.05)';
            }
        });

        icon.addEventListener('mouseleave', function() {
            if (!this.style.transform.includes('scale(0.95)') && !this.style.transform.includes('scale(1.1)')) {
                this.style.transform = 'scale(1)';
            }
        });
    });

    // 默认显示主页�?    switchPage('home');

    // 初始化Dock
    initDock();
});
 else {
        element.style.display = 'none';
        icon.textContent = '��';
    }
}


// �л��γ�����չ��/����ĺ���
function toggleCourseDetails(id) {
    const element = document.getElementById(id);
    const button = event.currentTarget;
    const btnText = button.querySelector('.btn-text');

    if (element) {
        if (element.style.display === 'none' || !element.style.display) {
            element.style.display = 'block';
            btnText.textContent = btnText.textContent.replace('▼', '▲');
            element.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
            element.style.display = 'none';
            btnText.textContent = btnText.textContent.replace('▲', '▼');
        }
    } else {
        console.error('Element with id ' + id + ' not found');
    }
}
