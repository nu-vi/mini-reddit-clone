import React from 'react';
import {createUrqlClient} from "../../../utils/createUrqlClient";
import {withUrqlClient} from "next-urql";

export const EditPost = ({}) => {
  return (
    <div>
      Edit Post
    </div>
  );
}

export default withUrqlClient(createUrqlClient)(EditPost)