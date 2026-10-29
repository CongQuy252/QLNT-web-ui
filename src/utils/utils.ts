export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Chuyển số thành chuỗi có phân cách (1000 -> 1,000)
export const formatNumber = (value: string | number) => {
  if (!value) return '';
  const number = value.toString().replace(/\D/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Chuyển chuỗi định dạng về số (1,000 -> 1000)
export const parseNumber = (value: string): number | undefined => {
  const cleaned = value.replace(/,/g, '');

  if (!cleaned) return undefined;

  const num = Number(cleaned);
  return Number.isNaN(num) ? undefined : num;
};

const readFileAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

// Thu nhỏ và nén ảnh thành JPEG base64 để body request không vượt giới hạn của server
export const compressImage = async (file: File, maxSize = 1280, quality = 0.7): Promise<string> => {
  const dataUrl = await readFileAsDataURL(file);

  try {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();

    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext('2d');
    if (!context) return dataUrl;

    // Nền trắng để ảnh PNG trong suốt không bị đen khi chuyển sang JPEG
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    // Trình duyệt không giải mã được định dạng này (vd: HEIC) thì giữ ảnh gốc
    return dataUrl;
  }
};
