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
export async function uploadFile(
  localUri: string,
  mimeType: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(new ApiError(xhr.status, 'Invalid JSON response'));
        }
      } else {
        reject(new ApiError(xhr.status, xhr.responseText));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new ApiError(500, 'Network request failed'));
    });

    xhr.open('POST', `${UPLOADS_BASE_URL}/uploads`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    // Do NOT set Content-Type manually, the browser/XHR engine sets it with the boundary automatically
    xhr.send(formData);
  });
}
