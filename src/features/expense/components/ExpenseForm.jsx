import { useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";

function ExpenseForm({
  onSubmit,
  defaultValues = {},
  isSubmitting = false,
  submitLabel = "Save",
  onCancel,
}) {
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  function handleFormSubmit(data) {
    let imageValue = null;

    if (data.image instanceof FileList && data.image.length > 0) {
      imageValue = data.image[0];
    } else {
      imageValue = null;
    }
    onSubmit({
      ...data,
      amount: Number(data.amount),
      image: imageValue,
    });

    if (submitLabel === "Add") {
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="expense-form">
      <FormRow label="Item" error={errors?.item?.message}>
        <input
          type="text"
          id="item"
          disabled={isSubmitting}
          {...register("item", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Amount" error={errors?.amount?.message}>
        <input
          type="text"
          id="amount"
          disabled={isSubmitting}
          {...register("amount", {
            required: "This field is required",
            min: {
              value: 0,
              message: "Amount is out of limit",
            },
          })}
        />
      </FormRow>
      <FormRow label="Photo" error={errors?.image?.message}>
        <input
          id="image"
          accept="image/*"
          type="file"
          className="file-input"
          disabled={isSubmitting}
          {...register("image")}
        />
      </FormRow>
      <div className="form-buttons">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

export default ExpenseForm;
