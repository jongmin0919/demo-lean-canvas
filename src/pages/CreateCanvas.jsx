import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCanvases } from '../api/canvas';

function CreateCanvas() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('신규'); // 카테고리 상태
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // React Query로 데이터 등록 - useMutation
  const { mutate: createNewCanvas, isLoading: isLoadingCreate } = useMutation({
    mutationFn: createCanvases,
    onSuccess: () => {
      queryClient.invalidateQueries(['canvases']);
      alert('등록이 완료되었습니다.');
      navigate('/');
    },
    onError: err => alert(err.message),
  });

  const handleSubmit = event => {
    event.preventDefault();

    if (!title || !description || !category) {
      alert('제목, 설명, 카테고리를 입력해주세요.');
      return;
    }

    // 캔버스 데이터 생성 요청 (사용자 입력값 전달)
    createNewCanvas({ title, description, category });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">등록 페이지</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="캔버스 제목 입력"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            설명
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="캔버스 설명 입력"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            카테고리 선택
          </label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="신규">신규</option>
            <option value="헬스 케어">헬스 케어</option>
            <option value="물류">물류</option>
            <option value="여행">여행</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoadingCreate}
          className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isLoadingCreate
              ? 'bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {isLoadingCreate ? '등록 중...' : '등록'}
        </button>
      </form>
    </div>
  );
}

export default CreateCanvas;
