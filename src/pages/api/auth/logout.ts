import apiHandler from '@/lib/apiHandler';
import { deleteCookie } from 'cookies-next';

export default apiHandler().post(async (req, res) => {
  deleteCookie('token', {
    httpOnly: true,
    req,
    res,
  });

  return res.status(200).json({
    message: 'Logout successful',
  });
});
