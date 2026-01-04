import { useForm } from "react-hook-form";
import { useSignup } from "../useSignup";
import { Link } from "react-router-dom";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import styles from "./Signup.module.css";

function Signup() {
  const { signup, isLoading } = useSignup();
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    signup({ fullName, email, password }, { onSettled: () => reset() });
  }

  return (
    <div className={styles.signupContainer}>
      <h1>Create a new user</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.signupForm}>
        <FormRow
          label="Full name"
          error={errors?.fullName?.message}
          className={styles.signupRow}
        >
          <input
            type="text"
            id="fullName"
            disabled={isLoading}
            {...register("fullName", { required: "This field is required" })}
            className={styles.input}
          />
        </FormRow>

        <FormRow
          label="Email address"
          error={errors?.email?.message}
          className={styles.signupRow}
        >
          <input
            type="text"
            id="email"
            autoComplete="email"
            disabled={isLoading}
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
            className={styles.input}
          />
        </FormRow>

        <FormRow
          label="Password (min 8 characters)"
          error={errors?.password?.message}
          className={styles.signupRow}
        >
          <input
            type="password"
            id="password"
            disabled={isLoading}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password needs a minimum of 8 characters",
              },
            })}
            className={styles.input}
          />
        </FormRow>

        <FormRow
          label="Repeat password"
          error={errors?.passwordConfirm?.message}
          className={styles.signupRow}
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
            className={styles.input}
          />
        </FormRow>
        <div className="btn-group">
          <Button to="/">Cancel</Button>
          <Button type="submit" disable={isLoading}>
            Create new user
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
