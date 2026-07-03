import { Platform } from 'react-native';
import { UPLOADS_BASE_URL } from './config';
import { getAccessToken } from '../utils/tokenStorage';
import { ApiError } from './client';

export interface UploadResult {
  url: string;
  type: 'PHOTO' | 'VIDEO';
  sizeBytes: number;
}

/**
 * Uploads a file picked via expo-image-picker. `localUri` is the file:// path
 * ImagePicker gives you; `mimeType` and `fileName` come from the picker result too.
 */
export async function uploadFile(localUri: string, mimeType: string, fileName: string): Promise<UploadResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new ApiError(401, JSON.stringify({ message: 'You must be logged in to upload files.' }));
  }

  const normalizedType = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType;

  const formData = new FormData();

  if (Platform.OS === 'web') {
    // On the web, we must fetch the blob and append it directly.
    const response = await fetch(localUri);
    const blob = await response.blob();
    formData.append('file', blob, fileName);
  } else {
    // React Native's fetch/FormData accepts this { uri, name, type } shape directly —
    // it is NOT a real Blob, but RN's networking layer knows how to read the file at `uri`.
    formData.append('file', {
      uri: localUri,
      name: fileName,
      type: normalizedType,
    } as any);
  }

  const res = await fetch(`${UPLOADS_BASE_URL}/uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type manually here — fetch needs to set its own
      // multipart boundary, and overriding it breaks the upload silently.
    },
    body: formData,
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  return res.json();
}
