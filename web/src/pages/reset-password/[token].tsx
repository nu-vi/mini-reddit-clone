import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { toErrorMap } from '../../utils/toErrorMap';
import { InputField } from '../../components/InputFieldC';
import { Wrapper } from '../../components/Wrapper';
import { useResetPasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

const ResetPassword: NextPage<{ token?: string }> = ({ token }) => {

  const router = useRouter();
  const [, resetPassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await resetPassword({
            newPassword: values.newPassword,
            token: token || '',
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

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ResetPassword);
