
interface UploadResponse {
  message?: string;
  data?: any; 
}
export const uploadImage = async (uri: string): Promise<UploadResponse> => {
  const serverUrl = 'http://10.28.100.160:3000/nutrition/analyze'; 

  const formData = new FormData();

  const filename: string = uri.split('/').pop() as string; 
  const match = /\.(\w+)$/.exec(filename);
  const type: string = match ? `image/${match[1]}` : `image`;

  formData.append('files', {
    uri,
    name: filename,
    type,
  } as any);


  console.log('Bắt đầu tải ảnh lên... ', formData);

  try {
    const response: Response = await fetch(serverUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        // 'Authorization': 'Bearer YOUR_TOKEN', // Thêm token nếu API yêu cầu
      },
    });

    const responseData: UploadResponse = await response.json(); // 👈 Dùng interface

    if (response.ok) {
      return responseData;
    } else {
      throw new Error(responseData.message || 'Lỗi không xác định từ server');
    }
  } catch (error: unknown) { 
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Lỗi khi upload: ', errorMessage);
    throw new Error(errorMessage);
  }
};