const server = process.env.REACT_APP_HOST_URL;

export const checkAuth = async (token) => {
  try {
    if (token) {
      const response = await fetch(`${server}/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parseRes = await response.json();

      if (parseRes.msg === 'Authentication invalid') {
        return false;
      } else if (parseRes === true) {
        return true;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log(err.message);
  }
};
