import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

export const useHandleHttpError = () => {
  const { enqueueSnackbar } = useSnackbar();

  return (error: unknown) => {
    let message = 'Lỗi không xác định';

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const messageFromServer = error.response?.data?.message;

      if (status === 404) message = 'Không tìm thấy tài nguyên (404)';
      else if (status === 500) message = 'Lỗi server (500)';
      else if (messageFromServer) message = messageFromServer;
    } else if (error instanceof Error) {
      message = error.message;
    }

    enqueueSnackbar(message, { variant: 'error' });
  };
};
