export const useStatisticsConstants = (isAdmin: boolean) => {
  const tab = [
    { id: 'table', label: 'Danh sách' },
    { id: 'dashboard', label: 'Chi Phí' },
  ];

  if (isAdmin) {
    tab.push({ id: 'summary', label: 'Tổng Quan' });
  }

  return {
    tab,
  };
};
