export default async (req, res) => {
  console.log('C:')
  console.dir(req.cookies)
  console.log('RC:')
  console.dir(req.signedCookies)
  console.log('Q:')
  console.dir(req.query)
  res.status(200).end()
};
