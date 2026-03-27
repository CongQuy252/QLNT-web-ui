import { http } from '@/lib/axios';

// Get buildings data
export const getBuildings = async () => {
  try {
    const response = await http.get('/buildings');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return [];
  }
};

// Get invoice preview data
export const getInvoicePreview = async (month: number, year: number) => {
  try {
    const params = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    });

    const response = await http.get(`/invoices/invoice-preview?${params.toString()}`);
    const data = response.data;

    console.log('API Response:', data);
    console.log('Response structure:', typeof data, Array.isArray(data));

    // Handle backend response structure: { success: true, data: [...] }
    if (data && data.success && Array.isArray(data.data)) {
      console.log('Backend response - data.data is array, length:', data.data.length);
      return data.data;
    } else if (Array.isArray(data)) {
      console.log('Data is array, length:', data.length);
      return data;
    } else if (data && Array.isArray(data.data)) {
      console.log('Data.data is array, length:', data.data.length);
      return data.data;
    } else if (data && Array.isArray(data.invoices)) {
      console.log('Data.invoices is array, length:', data.invoices.length);
      return data.invoices;
    } else {
      console.warn('Unexpected API response structure:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching invoice preview:', error);
    return [];
  }
};

// Bulk create invoices
export const bulkCreateInvoices = async (roomIds: string[], month: number, year: number) => {
  try {
    const response = await http.post('/invoices/bulk-create', {
      roomIds,
      month,
      year,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating bulk invoices:', error);
    throw error;
  }
};

// Get invoices list with pagination and filters
export const getInvoices = async (options: {
  month?: number;
  year?: number;
  buildingId?: string;
  roomId?: string;
  status?: string;
  page: number;
  limit: number;
}) => {
  try {
    const params = new URLSearchParams({
      page: options.page.toString(),
      limit: options.limit.toString(),
    });

    // Only add optional parameters if they exist
    if (options.month) params.append('month', options.month.toString());
    if (options.year) params.append('year', options.year.toString());
    if (options.buildingId) params.append('buildingId', options.buildingId);
    if (options.roomId) params.append('roomId', options.roomId);
    if (options.status) params.append('status', options.status);

    const response = await http.get(`/invoices?${params.toString()}`);
    const data = response.data;

    // Handle backend response structure
    if (data && data.data) {
      // Backend returns { data: { invoices: [...], pagination: {...} } }
      return data.data;
    } else if (data) {
      // Backend returns { invoices: [...], pagination: {...} } directly
      return data;
    } else {
      // Fallback
      return { invoices: [], pagination: {} };
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = async (invoiceId: string) => {
  try {
    const response = await http.get(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
    throw error;
  }
};
