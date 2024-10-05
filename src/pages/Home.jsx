import { useEffect, useState } from 'react';
import CanvasList from '../components/CanvasList';
import SearchBar from '../components/SearchBar';
import ViewToggle from '../components/ViewToggle';
import CategoryFilter from '../components/CategoryFilter';
import { getCanvases, createCanvases, deleteCanvas } from '../api/canvas';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Button from '../components/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    searchText: undefined,
    category: undefined,
  });
  const handleFilter = (key, value) =>
    setFilter({
      ...filter,
      [key]: value,
    });
  const [isGridView, setIsGridView] = useState(true);
  const queryClient = useQueryClient();

  /* 데이터 조회를 위한 useState
  const [data, setData] = useState([]);
  */

  // React Query로 데이터 조회- useQuery
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['canvases', filter.searchText, filter.category],
    queryFn: () => {
      console.log('fetching data');
      return getCanvases({
        title_like: filter.searchText,
        category: filter.category,
      });
    },
    refetchOnWindowFocus: false,
    // initialData: [],
    staleTime: 1000 * 60 * 5,
  });

  const handleCreateCanvas = () => {
    // 등록 페이지로 이동
    navigate('/create');
  };

  // React Query로 데이터 등록 - useMutate
  const { mutate: createNewCanvas, isLoading: isLoadingCreate } = useMutation({
    mutationFn: createCanvases,
    onSuccess: () => queryClient.invalidateQueries(['canvases']),
    onError: err => alert(err.message),
  });

  // React Query로 데이터 삭제 - useMutate
  const { mutate: deleteCanvasMutation } = useMutation({
    mutationFn: deleteCanvas,
    onSuccess: () => queryClient.invalidateQueries(['canvases']),
    onError: err => alert(err.message),
  });

  /* API call
  const { isLoading, error, execute: fetchData } = useApiRequest(getCanvases);
  const { isLoading: isLoadingCreate, execute: createNewCanvas } =
    useApiRequest(createCanvases);
    */

  /*
  useEffect(() => {
    fetchData(
      { title_like: searchText },
      { onSuccess: response => setData(response.data) },
    );
  }, [searchText, fetchData]);
  */

  const handleDeleteItem = async id => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteCanvasMutation(id);
      alert('캔버스가 삭제되었습니다.');
    }
  };

  /* React Qury를 쓰기 전 비동기 함수로 포스트 등록 및 삭제을 하는 함수
  const handleCreateCanvas = async () => {
    createNewCanvas(null, {
      onSuccess: () => {
        fetchData(
          { title_like: searchText },
          { onSuccess: response => setData(response.data) },
        );
      },
      onError: error => alert(error.message),
    });

    // try {
    //   setIsLoadingCreate(true);
    //   await new Promise(resolver => setTimeout(resolver, 1000));
    //   await createCanvases();
    //   fetchData({ title_like: searchText });
    // } catch (error) {
    //   alert(error.message);
    // } finally {
    //   setIsLoadingCreate(false);
    // }
  };
  
  const handleDeleteItem = async id => {
    try {
      if (confirm('정말 포스트를 삭제하시겠습니까?') === false) {
        return;
      }

      await deleteCanvas(id);
      fetchData({ title_like: searchText });
    } catch (error) {
      alert(error.message);
    }
  };
  */

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex gap-2 flex-col w-full sm:flex-row mb-4 sm:mb-0">
          <SearchBar
            searchText={filter.searchText}
            onSearch={val => handleFilter('searchText', val)}
          />
          <CategoryFilter
            category={filter.category}
            onChange={val => handleFilter('category', val)}
          />
        </div>
        <ViewToggle isGridView={isGridView} setIsGridView={setIsGridView} />
      </div>
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateCanvas} loading={isLoadingCreate}>
          등록하기
        </Button>
      </div>
      {isLoading && <Loading />}
      {error && <Error message={error.message} onRetry={refetch} />}
      {!isLoading && !error && (
        <CanvasList
          filteredData={data}
          isGridView={isGridView}
          searchText={filter.searchText}
          onDeleteItem={handleDeleteItem}
        />
      )}
    </>
  );
}

export default Home;
