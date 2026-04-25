import { http } from '@/lib/axios';

export const getBuildings = async () => {
  try {
    const response = await http.get('/buildings');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch {
    return [];
  }
};

export const getInvoicePreview = async (month: number, year: number) => {
  try {
    const params = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    });

    const response = await http.get(`/invoices/invoice-preview?${params.toString()}`);
    const data = response.data;

    if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && Array.isArray(data.invoices)) {
      return data.invoices;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

export const bulkCreateInvoices = async (roomIds: string[], month: number, year: number) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.post('/invoices/bulk-create', {
      roomIds,
      month,
      year,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInvoices = async (options: {
  month?: number;
  year?: number;
  buildingId?: string;
  roomId?: string;
  status?: string;
  page: number;
  limit: number;
}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const params = new URLSearchParams({
      page: options.page.toString(),
      limit: options.limit.toString(),
    });

    if (options.month) params.append('month', options.month.toString());
    if (options.year) params.append('year', options.year.toString());
    if (options.buildingId) params.append('buildingId', options.buildingId);
    if (options.roomId) params.append('roomId', options.roomId);
    if (options.status) params.append('status', options.status);

    const response = await http.get(`/invoices?${params.toString()}`);
    const data = response.data;

    if (data && data.data) {
      return data.data;
    } else if (data) {
      return data;
    } else {
      return { invoices: [], pagination: {} };
    }
  } catch (error) {
    throw error;
  }
};

export const getInvoiceById = async (invoiceId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.get(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete invoice by ID
export const deleteInvoice = async (invoiceId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.delete(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
