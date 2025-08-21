import {launchImageLibrary, ImageLibraryOptions, Asset} from 'react-native-image-picker';

const options: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 5,       // iOS 14+ supports multi-select; iOS 13 will fall back to single
  includeBase64: false,    // don't request base64 (huge strings → crashes)
  quality: 0.85 as any,    // compress a bit
  maxWidth: 1080,          // downscale large photos
  maxHeight: 1080,
  presentationStyle: 'fullScreen',
};

export async function pickProfilePhotos() {
  const res = await launchImageLibrary(options);

  // user closed the picker
  if (res.didCancel) return [];

  // library error (permission denied, etc.)
  if (res.errorCode) {
    throw new Error(res.errorMessage || res.errorCode);
  }

  const assets: Asset[] = res.assets ?? [];
  // filter out very large files (>10MB)
  return assets
    .filter(a => (a.fileSize ?? 0) <= 10 * 1024 * 1024)
    .map(a => ({
      uri: a.uri!,                                      // e.g. file:///... or ph://...
      name: a.fileName ?? `photo_${Date.now()}.jpg`,
      type: a.type ?? 'image/jpeg',
    }));
}
