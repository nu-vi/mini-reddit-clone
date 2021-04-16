import { useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const userIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [fetching, data, router]);
};
