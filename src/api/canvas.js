import { canvasesUrl } from './http';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

// 목록 조회
export async function getCanvases(params) {
  const payload = Object.assign(
    { _sort: 'lastModified', _order: 'desc' },
    params,
  );
  const { data } = await canvasesUrl.get('/', { params: payload });
  return data;
}

export function createCanvases({ title, description, category }) {
  const newCanvas = {
    title: title || uuidv4().substring(0, 4) + '임시 포스트',
    description: description || '기본 설명',
    lastModified: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    category: category || '신규',
  };
  return canvasesUrl.post('/', newCanvas); // 서버에 새 캔버스 데이터 POST
}

export async function deleteCanvas(id) {
  await canvasesUrl.delete(`/${id}`);
}

export async function getCanvasById(id) {
  const { data } = await canvasesUrl.get(`/${id}`);
  return data;
}

export async function updateTitle(id, title) {
  canvasesUrl.patch(`/${id}`, { title });
}

export async function updateCanvas(id, canvas) {
  await canvasesUrl.put(`/${id}`, canvas);
}
