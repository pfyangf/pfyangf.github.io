/**
 * 阅读进度条客户端脚本
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    // 更新进度条
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // 监听滚动事件
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    // 初始化
    updateProgress();
}

export default {};
