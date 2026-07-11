// 全局变量
const mergeBtn = document.getElementById('download-exe-btn');
const TOTAL_COUNT = 12;
let selectedFiles = [];

// 文件大小格式化
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
}

// 提取分片序号 FL_Studio_25_1_5.zip → 5
function getFileIndex(fileName) {
    const reg = /_(\d+)\.zip$/;
    const match = fileName.match(reg);
    return match ? parseInt(match[1]) : null;
}

// 点击按钮触发选择并合并文件
async function downloadExe() {
    const originalText = mergeBtn.textContent;
    mergeBtn.textContent = '请选择12个分片文件';

    // 创建隐藏文件选择框
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    // 不设置accept，彻底解决文件类型报错
    document.body.appendChild(fileInput);

    fileInput.onchange = async (e) => {
        selectedFiles = Array.from(e.target.files);
        document.body.removeChild(fileInput);

        mergeBtn.textContent = '校验分片...';
        mergeBtn.disabled = true;
        try {
            // 校验文件总数
            if (selectedFiles.length !== TOTAL_COUNT) {
                throw new Error(`选中${selectedFiles.length}个文件，必须完整12个分片`);
            }

            // 建立序号映射
            const indexMap = new Map();
            for (const file of selectedFiles) {
                const idx = getFileIndex(file.name);
                if (idx === null) throw new Error(`文件名格式错误：${file.name}`);
                if (indexMap.has(idx)) throw new Error(`重复分片序号：${idx}`);
                indexMap.set(idx, file);
            }

            // 按1~12顺序整理分片
            const sortedBlobs = [];
            for (let i = 1; i <= TOTAL_COUNT; i++) {
                if (!indexMap.has(i)) throw new Error(`缺失第${i}号分片`);
                sortedBlobs.push(indexMap.get(i));
            }

            mergeBtn.textContent = '正在合并分片...';
            // 二进制拼接所有分片（参考示例Blob合并写法）
            const mergedBlob = new Blob(sortedBlobs);
            const downloadUrl = URL.createObjectURL(mergedBlob);

            // 触发下载
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'FL.Studio.25.1.zip';
            a.click();
            URL.revokeObjectURL(downloadUrl);

            mergeBtn.textContent = '合并下载完成';
        } catch (err) {
            alert('合并失败：' + err.message);
            mergeBtn.textContent = originalText;
            mergeBtn.disabled = false;
            return;
        }

        // 2秒后恢复按钮原始状态
        setTimeout(() => {
            mergeBtn.textContent = originalText;
            mergeBtn.disabled = false;
        }, 2000);
    };

    // 弹出文件选择窗口
    fileInput.click();
}
