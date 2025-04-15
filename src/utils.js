import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // API серверийн үндсэн URL-ийг зааж өгнө.

// Өгөгдөл авах функц
export const fetchData = async (endpoint, params = {}) => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('oauth_token');
    
    // API-с өгөгдөл татах GET хүсэлт илгээнэ.
    const response = await axios.get(`${API_URL}/${endpoint}`, {
      params: params, // Хүсэлтийн параметрүүдийг дамжуулна.
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Important for cookie-based authentication
      withCredentials: true
    });
    
    return response.data; // Хариу өгөгдлийг буцаана.
  } catch (error) {
    // Handle 401 errors (unauthorized - token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Attempt to refresh the token
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const refreshResponse = await axios.post(`${API_URL}/oauth/refresh-token`, {
            refresh_token: refreshToken
          });
          
          if (refreshResponse.data && refreshResponse.data.access_token) {
            // Update tokens in localStorage
            localStorage.setItem('oauth_token', refreshResponse.data.access_token);
            
            if (refreshResponse.data.refresh_token) {
              localStorage.setItem('refresh_token', refreshResponse.data.refresh_token);
            }
            
            localStorage.setItem('expires_in', refreshResponse.data.expires_in.toString());
            localStorage.setItem('token_time', refreshResponse.data.token_time.toString());
            
            // Retry the original request with the new token
            const retryResponse = await axios.get(`${API_URL}/${endpoint}`, {
              params: params,
              headers: {
                'Authorization': `Bearer ${refreshResponse.data.access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            return retryResponse.data;
          }
        } else {
          // No refresh token, redirect to login
          window.location.href = '/login?error=session_expired';
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem('oauth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('token_time');
        window.location.href = '/login?error=session_expired';
      }
    }
    
    // Алдаа гарвал console дээр харуулна.
    console.error("Өгөгдөл татах үед алдаа гарлаа:", error);
   // throw error; // Алдааг шидэж, дээд түвшинд мэдээлнэ.
  }
};

// Өгөгдөл илгээх функц
export const postData = async (endpoint, data, method = "post") => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('oauth_token');
    
    // API-д өгөгдөл илгээх хүсэлт илгээнэ. Method-г POST эсвэл PUT сонгож болно.
    const response = await axios({
      method: method, // HTTP хүсэлтийн аргыг зааж өгнө (жишээ нь: POST, PUT).
      url: `${API_URL}/${endpoint}`, // Хүсэлтийг илгээх API замыг тодорхойлно.
      data: data, // Илгээж буй өгөгдөл.
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    return response.data; // Хариу өгөгдлийг буцаана.
  } catch (error) {
    // Handle 401 errors (unauthorized - token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Attempt to refresh the token
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const refreshResponse = await axios.post(`${API_URL}/oauth/refresh-token`, {
            refresh_token: refreshToken
          });
          
          if (refreshResponse.data && refreshResponse.data.access_token) {
            // Update tokens in localStorage
            localStorage.setItem('oauth_token', refreshResponse.data.access_token);
            
            if (refreshResponse.data.refresh_token) {
              localStorage.setItem('refresh_token', refreshResponse.data.refresh_token);
            }
            
            localStorage.setItem('expires_in', refreshResponse.data.expires_in.toString());
            localStorage.setItem('token_time', refreshResponse.data.token_time.toString());
            
            // Retry the original request with the new token
            const retryResponse = await axios({
              method: method,
              url: `${API_URL}/${endpoint}`,
              data: data,
              headers: {
                'Authorization': `Bearer ${refreshResponse.data.access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            return retryResponse.data;
          }
        } else {
          // No refresh token, redirect to login
          window.location.href = '/login?error=session_expired';
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem('oauth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('token_time');
        window.location.href = '/login?error=session_expired';
      }
    }
    
    // Алдаа гарвал console дээр харуулна.
    console.error("Өгөгдөл илгээх үед алдаа гарлаа:", error);
 //   throw error; // Алдааг шидэж, дээд түвшинд мэдээлнэ.
  }
};