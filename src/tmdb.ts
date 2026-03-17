const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  throw new Error('Missing environment variable: VITE_TMDB_API_KEY');
}

export interface TMDBSearchResult {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

export interface TMDBMovieResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
}

export interface TMDBCredit {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  networks: { id: number; name: string; logo_path: string }[];
  credits?: {
    cast: TMDBCredit[];
  };
  number_of_seasons: number;
  status: string;
  original_language: string;
  origin_country: string[];
}

// 类型映射（TMDB ID -> 中文名）
const GENRE_MAP: Record<number, string> = {
  10759: '动作冒险',
  16: '动画',
  35: '喜剧',
  80: '犯罪',
  99: '纪录片',
  18: '剧情',
  10751: '家庭',
  10762: '儿童',
  9648: '悬疑',
  10763: '新闻',
  10764: '真人秀',
  10765: '奇幻科幻',
  10766: '肥皂剧',
  10767: '脱口秀',
  10768: '战争政治',
  37: '西部',
  28: '动作',
  12: '冒险',
  14: '奇幻',
  36: '历史',
  27: '恐怖',
  10402: '音乐',
  10749: '爱情',
  878: '科幻',
  10770: '电视电影',
  53: '惊悚',
  10752: '战争',
};

export function getGenreName(genreId: number): string {
  return GENRE_MAP[genreId] || '其他';
}

export function getPosterUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// 搜索电视剧
export async function searchTVShows(query: string, page: number = 1): Promise<TMDBSearchResult[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=zh-CN&page=${page}`
    );
    if (!response.ok) {
      console.error('TMDB TV search failed:', response.status, response.statusText);
      return [];
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB TV search error:', error);
    return [];
  }
}

// 搜索电影
export async function searchMovies(query: string, page: number = 1): Promise<TMDBMovieResult[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=zh-CN&page=${page}`
    );
    if (!response.ok) {
      console.error('TMDB Movie search failed:', response.status, response.statusText);
      return [];
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB Movie search error:', error);
    return [];
  }
}

// 综合搜索（电视剧 + 电影）
export async function searchAll(query: string): Promise<(TMDBSearchResult | TMDBMovieResult)[]> {
  const [tvResults, movieResults] = await Promise.all([
    searchTVShows(query),
    searchMovies(query),
  ]);

  // 合并结果，按热度排序
  return [...tvResults, ...movieResults]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);
}

// 获取电视剧详情
export async function getTVDetail(id: number): Promise<TMDBDetail> {
  const response = await fetch(
    `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=zh-CN&append_to_response=credits`
  );
  return response.json();
}

// 获取电影详情
export async function getMovieDetail(id: number): Promise<TMDBDetail> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=zh-CN&append_to_response=credits`
  );
  const data = await response.json();
  // 电影的 title 字段对应电视剧的 name
  return {
    ...data,
    name: data.title,
    first_air_date: data.release_date,
  } as TMDBDetail;
}

// 判断是电视剧还是电影
export function isTVShow(result: TMDBSearchResult | TMDBMovieResult): result is TMDBSearchResult {
  return 'name' in result;
}
