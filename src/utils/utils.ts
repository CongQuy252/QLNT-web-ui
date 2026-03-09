export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (isoString: string): string => {
  if (!isoString) return '';

  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN');
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
