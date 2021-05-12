import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { toErrorMap } from '../../utils/toErrorMap';
import { InputField } from '../../components/InputFieldC';
import { Wrapper } from '../../components/Wrapper';
import {
  MeDocument,
  MeQuery,
  useResetPasswordMutation,
} from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await resetPassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === 'string'
                  ? router.query.token
                  : '',
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.resetPassword.user,
                },
              });
            },
          });
          if (response.data?.resetPassword.errors) {
            const errorMap = toErrorMap(response.data.resetPassword.errors);

            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.resetPassword.user) {
            await router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError ? (
              <Flex>
                <Box color="red" mr={2}>
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ResetPassword);
