const mergeBtn = document.getElementById('download-exe-btn');
const TOTAL_COUNT = 12;
const BASE_URL = "https://file.zztxer.dpdns.org/FL/FL_Studio_25_1_";

async function downloadExe() {
    const originalText = mergeBtn.textContent;
    mergeBtn.textContent = "正在下载 0/" + TOTAL_COUNT;
    mergeBtn.disabled = true;
    try {
        const blobs = [];
        for (let i = 1; i <= TOTAL_COUNT; i++) {
            const res = await fetch(`${BASE_URL}${i}.zip`);
            if (!res.ok) throw new Error(`分片${i}请求失败`);
            const blob = await res.blob();
            blobs.push(blob);
            mergeBtn.textContent = `正在下载 ${i}/${TOTAL_COUNT}`;
        }
        // 二进制拼接合并
        const mergedBlob = new Blob(blobs);
        const url = URL.createObjectURL(mergedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "FL.Studio.25.1.zip";
        a.click();
        URL.revokeObjectURL(url);
        mergeBtn.textContent = "合并下载完成";
    } catch (err) {
        alert(`失败：${err.message}\n根源：文件服务器未开启CORS跨域，浏览器拦截请求`);
        mergeBtn.textContent = originalText;
        mergeBtn.disabled = false;
        return;
    }
    setTimeout(() => {
        mergeBtn.textContent = originalText;
        mergeBtn.disabled = false;
    }, 2000);
}
