import React from 'react';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputFieldC';
import { Box, Button } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useCreatePostMutation } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { userIsAuth } from '../utils/userIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  userIsAuth();
  const [, createPost] = useCreatePostMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            await router.push('/');
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

export default withUrqlClient(createUrqlClient)(CreatePost);
