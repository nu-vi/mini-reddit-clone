import { withUrqlClient } from 'next-urql';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 2,
    },
  });

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      <br />
      <br />
      {!data
        ? null
        : data.posts.map((p) => {
            return <div key={p.id}>{p.title}</div>;
          })}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
