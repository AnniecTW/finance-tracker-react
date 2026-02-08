import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useRecentExpenses } from "../useExpenses";
import { useNavigate } from "react-router-dom";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import styles from "./ExpenseForm.module.css";

const CATEGORIES = {
  income: ["Salary", "Investment", "Bonus"],
  expense: ["Food", "Transport", "Housing", "Entertainment", "Health", "Other"],
};

function ExpenseForm({
  onSubmit,
  defaultValues = {},
  isSubmitting = false,
  submitLabel = "Save",
  onCancel,
}) {
  const today = new Date().toISOString().split("T")[0];

  const [type, setType] = useState(defaultValues.type || "expense");

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
    defaultValues: {
      transaction_date: today,
      ...defaultValues,
    },
  });
  const { errors } = formState;

  const watchedItem = watch("item");
  const currentImage = watch("image");
  const hasImage =
    currentImage instanceof FileList ? currentImage.length > 0 : !!currentImage;

  const handleRemoveImage = () => {
    setValue("image", null);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setValue("category", "");
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
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

      if (match && CATEGORIES[type].includes(match.category)) {
        const currentCatValue = getValues("category");
        if (currentCatValue !== match.category) {
          setValue("category", match.category, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    }
  }, [
    watchedItem,
    getValues,
    setValue,
    recentExpensesSlice,
    submitLabel,
    type,
  ]);

  function handleFormSubmit(data) {
    const hasNewImage =
      data.image instanceof File ||
      (data.image instanceof FileList && data.image.length > 0);
    const imageValue = hasNewImage ? data.image[0] : data.image;

    onSubmit({
      ...data,
      type: type,
      amount: Number(data.amount),
      image: imageValue,
    });

    if (submitLabel === "Add") {
      reset();
    }
  }

  return (
    <>
      <div className={styles.tabGroup}>
        <button
          type="button"
          className={`${styles.tab} ${type === "expense" ? styles.activeTab : ""}`}
          onClick={() => handleTypeChange("expense")}
        >
          Expense
        </button>
        <button
          type="button"
          className={`${styles.tab} ${type === "income" ? styles.activeTab : ""}`}
          onClick={() => handleTypeChange("income")}
        >
          Income
        </button>
      </div>
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
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Date" error={errors?.transaction_date?.message}>
          <input
            type="date"
            className={styles.input}
            disabled={isSubmitting}
            {...register("transaction_date", { required: "Date is required" })}
          ></input>
        </FormRow>
        <FormRow label="Notes" error={errors?.notes?.message}>
          <textarea
            id="notes"
            className={styles.textarea}
            disabled={isSubmitting}
            placeholder="Add any additional details..."
            {...register("notes", {
              maxLength: {
                value: 500,
                message: "Notes should be under 500 characters",
              },
            })}
            onWheel={(e) => e.target.blur()}
          />
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
            {hasImage && (
              <div className={styles.imageStatus}>
                <span className={styles.statusText}>
                  {typeof currentImage === "string"
                    ? "Existing Image"
                    : "New Image Selected"}
                </span>
                <Button
                  onClick={handleRemoveImage}
                  className={styles.deleteBtn}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </FormRow>
        <div className={styles.formButtons}>
          <Button type="submit" disabled={isSubmitting} variation="primary">
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
          {<Button onClick={handleCancel}>Cancel</Button>}
        </div>
      </form>
    </>
  );
}

export default ExpenseForm;
