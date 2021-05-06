import React from 'react';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { Layout } from '../../../components/Layout';
import { Form, Formik } from 'formik';
import { InputField } from '../../../components/InputFieldC';
import { Box, Button, Heading, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { userIsAuth } from '../../../utils/userIsAuth';

export const EditPost = ({}) => {
  const router = useRouter();
  userIsAuth();
  const intId = useGetIntId();
  const [{ data, fetching }] = useGetPostFromUrl();
  const [, updatePost] = useUpdatePostMutation();
  const variant: 'small' | 'regular' | undefined = useBreakpointValue({
    base: 'small',
    md: 'regular',
  });

  const renderBody = () => {
    if (!data) {
      if (fetching) {
        return <div>loading...</div>;
      } else {
        return (
          <>
            <Heading>Your post query failed for some reason.</Heading>
            <br />
            <Heading>Please try again later.</Heading>
          </>
        );
      }
    } else {
      if (!data.post) {
        return (
          <>
            <Heading>Could not find the post you requested</Heading>
          </>
        );
      } else {
        return (
          <Formik
            initialValues={{ title: data.post.title, text: data.post.text }}
            onSubmit={async (values) => {
              await updatePost({ id: intId, ...values });
              await router.back();
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
                  update post
                </Button>
              </Form>
            )}
          </Formik>
        );
      }
    }
  };

  return <Layout variant={variant}>{renderBody()}</Layout>;
};

export default withUrqlClient(createUrqlClient)(EditPost);
