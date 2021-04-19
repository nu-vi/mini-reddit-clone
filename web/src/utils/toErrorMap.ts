import {FieldError, PostFieldError} from "../generated/graphql";

export const toErrorMap = (errors: FieldError[] | PostFieldError[]) => {
  const errorMap: Record<string, string> = {};

  errors.forEach((errors: FieldError | PostFieldError) => {
    errorMap[errors.field] = errors.message
  })

  return errorMap;
}