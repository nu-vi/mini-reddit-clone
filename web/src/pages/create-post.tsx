import React from 'react';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputFieldC';
import { Box, Button, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCreatePostMutation } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { userIsAuth } from '../utils/userIsAuth';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  userIsAuth();
  const [createPost] = useCreatePostMutation();
  const variant: 'small' | 'regular' | undefined = useBreakpointValue({
    base: 'small',
    md: 'regular',
  });

  return (
    <Layout variant={variant}>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: 'posts' });
            },
          });
          if (response.data?.createPost.errors) {
            setErrors(toErrorMap(response.data.createPost.errors));
          } else if (response.data?.createPost.post) {
            if (!response.errors) {
              await router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
