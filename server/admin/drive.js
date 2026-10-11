// The photo gallery is a public Google Drive folder ("Anyone with the link", Viewer). Each subfolder is an album
// (Haldi, Garba, Wedding...); photos straight in the main folder make an album of their own.
// Reading it needs GOOGLE_DRIVE_API_KEY: a Google Cloud API key restricted to the Drive API.
const API = 'https://www.googleapis.com/drive/v3/files';
const FOLDER = 'application/vnd.google-apps.folder';

const children = async (folderId, key) => {
  const files = [];
  let pageToken;
  do {
    const q = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      key,
      pageSize: '1000',
      orderBy: 'name',
      fields: 'nextPageToken,files(id,name,mimeType,imageMediaMetadata(width,height))',
      ...(pageToken && { pageToken }),
    });
    const res = await fetch(`${API}?${q}`);
    if (!res.ok) throw new Error(`Google Drive answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const body = await res.json();
    files.push(...body.files);
    pageToken = body.nextPageToken;
  } while (pageToken);
  return files;
};

const media = (files) =>
  files
    .filter((f) => /^(image|video)\//.test(f.mimeType))
    .map((f) => ({
      id: f.id,
      name: f.name,
      video: f.mimeType.startsWith('video/'),
      width: f.imageMediaMetadata?.width,
      height: f.imageMediaMetadata?.height,
    }));

// [{ id, name, photos: [{ id, name, video, width, height }] }], albums in name order
export async function loadGallery(folderId, key) {
  const top = await children(folderId, key);
  const albums = await Promise.all(
    top.filter((f) => f.mimeType === FOLDER).map(async (f) => ({ id: f.id, name: f.name, photos: media(await children(f.id, key)) })),
  );
  const loose = media(top);
  if (loose.length) albums.unshift({ id: folderId, name: 'Photos', photos: loose });
  return albums;
}
