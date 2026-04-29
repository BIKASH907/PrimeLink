import { clearBhatCookies } from '../../../../lib/bhatAuth';

export default function handler(req, res) {
  clearBhatCookies(res);
  res.writeHead(302, { Location: '/bhat' });
  res.end();
}
