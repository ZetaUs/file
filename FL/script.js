const mergeBtn = document.getElementById('download-exe-btn');
const TOTAL_COUNT = 12;

async function downloadExe() {
  const originalText = mergeBtn.textContent;
  mergeBtn.textContent = "正在下载 0/" + TOTAL_COUNT + "...";
  mergeBtn.disabled = true;
  try {
    const blobs = [];
    for (let i = 1; i <= TOTAL_COUNT; i++) {
      // 远程分片地址
      const url = `https://file.zztxer.dpdns.org/FL/FL_Studio_25_1_${i}.zip`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`分片${i}下载失败`);
      const blob = await response.blob();
      blobs.push(blob);
      mergeBtn.textContent = `正在下载 ${i}/${TOTAL_COUNT}...`;
    }
    // 合并所有分片
    const mergedBlob = new Blob(blobs);
    const downloadUrl = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'FL.Studio.25.1.zip';
    a.click();
    URL.revokeObjectURL(downloadUrl);
    mergeBtn.textContent = "合并下载完成";
  } catch (err) {
    alert(`失败原因：${err.message}\n服务器无跨域权限，浏览器拦截请求，无法自动在线拉取分片`);
    mergeBtn.textContent = originalText;
    mergeBtn.disabled = false;
    return;
  }
  setTimeout(() => {
    mergeBtn.textContent = originalText;
    mergeBtn.disabled = false;
  }, 2000);
}
