import { useRouter } from 'next/router'
import Secret from '../../components/Secret'

export default () => {
  const router = useRouter()
  console.log('router.query', router.query);
  return (
    <Secret {...router.query} />
  )
}

