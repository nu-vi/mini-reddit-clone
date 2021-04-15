import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { NavBar } from '../components/NavBar';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <div>hello world</div>
      <br />
      {!data
        ? null
        : data.posts.map((p) => {
            return <div key={p.id}>{p.title}</div>;
          })}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
