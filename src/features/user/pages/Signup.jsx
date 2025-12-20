import { useForm } from "react-hook-form";
import { useSignup } from "../useSignup";
import { Link } from "react-router-dom";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";

function Signup() {
  const { signup, isLoading } = useSignup();
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    signup({ fullName, email, password }, { onSettled: () => reset() });
  }

  return (
    <div className="signup-container">
      <h1>Create a new user</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <FormRow label="Full name" error={errors?.fullName?.message}>
          <input
            type="text"
            id="fullName"
            disable={isLoading}
            {...register("fullName", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow label="Email address" error={errors?.email?.message}>
          <input
            type="text"
            id="email"
            disable={isLoading}
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
          />
        </FormRow>

        <FormRow
          label="Password (min 8 characters)"
          error={errors?.password?.message}
        >
          <input
            type="password"
            id="password"
            disable={isLoading}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password needs a minimum of 8 characters",
              },
            })}
          />
        </FormRow>

        <FormRow
          label="Repeat password"
          error={errors?.passwordConfirm?.message}
        >
          <input
            type="password"
            id="passwordConfirm"
            disable={isLoading}
            {...register("passwordConfirm", {
              required: "This field is required",
              validate: (value) =>
                value === getValues().password || "Password needs to match",
            })}
          />
        </FormRow>
        <div className="btn-group">
          <Link to="/" className="button">
            Cancel
          </Link>
          <Button type="submit" disable={isLoading}>
            Create new user
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
