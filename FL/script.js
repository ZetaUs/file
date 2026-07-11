const mergeBtn = document.getElementById('mergeBtn');
const totalParts = 12;

async function downloadAllMerge() {
    const originalText = mergeBtn.textContent;
    mergeBtn.textContent = '正在下载分片 0/12';
    mergeBtn.disabled = true;
    try {
        const blobs = [];
        for (let i = 1; i <= totalParts; i++) {
            const url = `https://file.zztxer.dpdns.org/FL/FL_Studio_25_1_${i}.zip`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`分片${i}下载失败`);
            const blob = await res.blob();
            blobs.push(blob);
            mergeBtn.textContent = `正在下载分片 ${i}/${totalParts}`;
        }
        // 合并所有分片
        const mergedBlob = new Blob(blobs);
        const url = URL.createObjectURL(mergedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FL.Studio.25.1.zip';
        a.click();
        URL.revokeObjectURL(url);
        mergeBtn.textContent = '合并下载完成';
    } catch (err) {
        alert('失败：' + err.message + '\n原因：服务器无CORS跨域，浏览器拦截请求，无法在线拉取文件');
        mergeBtn.textContent = originalText;
        mergeBtn.disabled = false;
        return;
    }
    setTimeout(() => {
        mergeBtn.textContent = originalText;
        mergeBtn.disabled = false;
    }, 2000);
}
