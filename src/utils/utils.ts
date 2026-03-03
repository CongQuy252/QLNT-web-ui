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
