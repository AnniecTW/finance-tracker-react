import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useRecentExpenses } from "../useExpenses";
import { useNavigate } from "react-router-dom";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import styles from "./ExpenseForm.module.css";

const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Other",
];

function ExpenseForm({
  onSubmit,
  defaultValues = {},
  isSubmitting = false,
  submitLabel = "Save",
  onCancel,
}) {
  const navigate = useNavigate();
  const { data: recentExpenses = [] } = useRecentExpenses();

  const recentExpensesSlice = useMemo(() => {
    return recentExpenses.slice(0, 20);
  }, [recentExpenses]);

  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues,
  });
  const { errors } = formState;

  const watchedItem = watch("item");
  const currentImage = watch("image");

  const handleRemoveImage = () => {
    setValue("image", null);
  };

  // Smart default
  useEffect(() => {
    if (submitLabel === "Add" && watchedItem && watchedItem.length >= 3) {
      const match = recentExpensesSlice.find((ex) => {
        const historyItem = ex.item.trim().toLowerCase();
        const currentInput = watchedItem.trim().toLowerCase();

        const historyHasInput = historyItem.includes(currentInput);
        const inputHasHistory = currentInput.includes(historyItem);

        return historyHasInput || inputHasHistory;
      });

      if (match && CATEGORIES.includes(match.category)) {
        const currentCatValue = getValues("category");
        if (currentCatValue !== match.category) {
          setValue("category", match.category, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    }
  }, [watchedItem, getValues, setValue, recentExpensesSlice, submitLabel]);

  function handleFormSubmit(data) {
    const hasNewImage =
      data.image instanceof File ||
      (data.image instanceof FileList && data.image.length > 0);
    const imageValue = hasNewImage ? data.image[0] : data.image;

    onSubmit({
      ...data,
      amount: Number(data.amount),
      image: imageValue,
    });

    if (submitLabel === "Add") {
      reset();
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles.formContainer}
    >
      <FormRow label="Item" error={errors?.item?.message}>
        <input
          type="text"
          id="item"
          className={styles.input}
          disabled={isSubmitting}
          {...register("item", { required: "This field is required" })}
        />
      </FormRow>
      <FormRow label="Amount" error={errors?.amount?.message}>
        <input
          type="number"
          id="amount"
          min="0"
          className={styles.input}
          disabled={isSubmitting}
          {...register("amount", {
            required: "This field is required",
            min: {
              value: 0,
              message: "Amount is out of limit",
            },
          })}
          onWheel={(e) => e.target.blur()}
        />
      </FormRow>
      <FormRow label="Category" error={errors?.category?.message}>
        <select
          id="category"
          disabled={isSubmitting}
          {...register("category", { required: "Please select a category" })}
          className={styles.selectInput}
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FormRow>
      <FormRow label="Photo" error={errors?.image?.message} id="image">
        <div className={styles.fileInputContainer}>
          <input
            id="image"
            accept="image/*"
            type="file"
            className={styles.fileInput}
            disabled={isSubmitting}
            {...register("image")}
          />
          {currentImage && (
            <div className={styles.imageStatus}>
              <span className={styles.statusText}>
                {typeof currentImage === "string"
                  ? "Existing Image"
                  : "New Image Selected"}
              </span>
              <Button onClick={handleRemoveImage} className={styles.deleteBtn}>
                Remove
              </Button>
            </div>
          )}
        </div>
      </FormRow>
      <div className={styles.formButtons}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {<Button onClick={handleCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

export default ExpenseForm;
