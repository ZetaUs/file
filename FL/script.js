const mergeBtn = document.getElementById('download-exe-btn');
// 总分片数量12
const TOTAL_COUNT = 12;

// 提取文件名末尾数字 FL_Studio_25_1_1.zip → 1
function getFileIndex(fileName) {
  const reg = /_(\d+)\.zip$/;
  const match = fileName.match(reg);
  return match ? parseInt(match[1]) : null;
}

async function downloadExe() {
  const originalText = mergeBtn.textContent;
  // 创建无类型限制的文件选择器，解决“不支持该文件类型”报错
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  document.body.appendChild(input);

  input.onchange = async (e) => {
    const fileList = Array.from(e.target.files);
    document.body.removeChild(input);
    mergeBtn.textContent = "校验分片文件...";
    mergeBtn.disabled = true;

    try {
      // 校验总数
      if (fileList.length !== TOTAL_COUNT) {
        throw new Error(`选中${fileList.length}个文件，必须完整12个分片`);
      }
      const indexMap = new Map();
      for (const file of fileList) {
        const idx = getFileIndex(file.name);
        if (idx === null) throw new Error(`文件命名不规范：${file.name}`);
        if (indexMap.has(idx)) throw new Error(`重复序号分片：${idx}`);
        indexMap.set(idx, file);
      }
      // 按1~12顺序排序分片
      const sortedBlobArr = [];
      for (let i = 1; i <= TOTAL_COUNT; i++) {
        if (!indexMap.has(i)) throw new Error(`缺失第${i}号分片`);
        sortedBlobArr.push(indexMap.get(i));
      }
      mergeBtn.textContent = "正在合并二进制数据...";
      // 参考示例Blob数组拼接逻辑
      const fullBlob = new Blob(sortedBlobArr);
      const url = URL.createObjectURL(fullBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "FL.Studio.25.1.zip";
      a.click();
      URL.revokeObjectURL(url);
      mergeBtn.textContent = "合并完成，已自动下载";
    } catch (err) {
      alert("合并失败：" + err.message);
      mergeBtn.textContent = originalText;
      mergeBtn.disabled = false;
      return;
    }
    // 2秒恢复按钮原始状态
    setTimeout(() => {
      mergeBtn.textContent = originalText;
      mergeBtn.disabled = false;
    }, 2000);
  }
  input.click();
}