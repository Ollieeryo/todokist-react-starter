import axios from 'axios';
const baseUrl = 'https://todo-list.alphacamp.io/api';

// axios.instance
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // 在 header 中加上從 Local Storage 拿的 token
    const token = localStorage.getItem('authToken');
    if (token) {
      // Interceptors 的使用方法來加上 headers
      // 透過 config.headers 來設定 headers，並回傳 config
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(error);
  },
);

// 把 axios instance 抽換至 CRUD 方法中

// get todos 拿到的資料的會包在 data 的 property 下，重構時需要用 res.data.data 取值才可以拿到我們所有的 todoitem
export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`);
    return res.data.data;
  } catch (error) {
    console.error('[Get Todos failed]: ', error);
  }
};

export const createTodo = async (payload) => {
  const { title, isDone } = payload;

  try {
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone,
    });
    return res.data;
  } catch (error) {
    console.error('[Create Todo failed]: ', error);
  }
};

export const patchTodo = async (payload) => {
  const { id, title, isDone } = payload;

  try {
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return res.data;
  } catch (error) {
    console.error('[Patch Todo failed]:', error);
  }
};

export const deleteTodo = async (id) => {
  try {
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data;
  } catch (error) {
    console.error('[Delete Todo failed]:', error);
  }
};
