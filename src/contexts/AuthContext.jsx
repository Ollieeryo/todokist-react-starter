import { createContext, useState, useEffect, useContext } from 'react';
import { login, register, checkPermission } from '../api/auth'; // 追加 checkPermission
import { useLocation } from 'react-router-dom';
// 載入 JSON Web Token  解析套件
import * as jwt from 'jsonwebtoken';

const defaultAuthContext = {
  isAuthenticated: false, // 使用者是否登入的判斷依據，預設為 false，若取得後端的有效憑證，則切換為 true
  currentMember: null, // 當前使用者相關資料，預設為 null，成功登入後就會有使用者資料
  register: null, // 註冊方法
  login: null, // 登入方法
  logout: null, // 登入方法
};

// createContext
const AuthContext = createContext(defaultAuthContext);
// export useContext
export const useAuth = () => useContext(AuthContext);

// provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);
  // 一旦 pathname 有改變，就需要重新驗證 token，因此需要使用 useEffect，而 dependency 參數需要設定為 pathname (react-router-dom useLocation)
  const { pathname } = useLocation();

  useEffect(() => {
    const checkTokenIsValid = async () => {
      // 使用 localStorage.getItem('authToken') 拿出最新的 token
      const authToken = localStorage.getItem('authToken');
      // 如果 authToken 不存在，代表身分驗證未通過
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      const result = await checkPermission(authToken);
      // 如果 authToken 存在，呼叫 checkPermission(authToken) 檢查有效性
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        // 解析 JWT Token 後，從 payload 中取得的登入使用者資料
        // 進一步拿出 payload 中的 sub 和 name，作為使用者的 id 和 name
        currentMember: payload && {
          id: payload.sub, // 取出 sub 字串，可以做為使用者 id
          name: payload.name, // 取出使用者帳號
        },
        //  AuthContext 不會直接知道使用者在註冊表單的輸入值，所以需要補上一個 data 當成調用函式時的參數
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          // 取得 payload 內容
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
