import ImageKit from 'imagekit';

interface ImageUploadResult {
  url: string;
  fileId: string;
  name: string;
}

export function createImageKitInstance() {
  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });
}

export async function uploadImageToImageKit(
  file: Express.Multer.File,
  folder: string,
): Promise<ImageUploadResult> {
  const result = await createImageKitInstance().upload({
    file: file.buffer,
    fileName: `${Date.now()}-${file.originalname}`,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: result.url,
    fileId: result.fileId,
    name: result.name,
  };
}
