import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { createTask } from "../taskSlice";
import styles from "./TaskForm.module.scss";
import TextField from "@material-ui/core/TextField";

type Inputs = {
  taskTitle: string;
};

type PropTypes = {
  edit?: boolean;
};

const TaskForm: React.FC<PropTypes> = ({ edit }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const handleCreate = (data: Inputs) => {
    dispatch(createTask(data.taskTitle));
    reset();
  };
  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit(handleCreate)} className={styles.form}>
        <TextField
          id="outlined-basic"
          label={edit ? "Edit Task" : "New Task"}
          variant="outlined"
          inputRef={register}
          name="taskTitle"
          className={styles.text_field}
        />
        {edit ? (
          <div className={styles.button_wrapper}>
            <button type="submit" className={styles.submit_button}>
              Edit
            </button>
            <button type="button" className={styles.cancel_button}>
              Cancel
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default TaskForm;
