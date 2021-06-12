import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

export interface TaskState {
  // taskが何個あるのかを管理するもの
  idCount: number;
  // 配列の中に以下のハッシュが入っているという形を作る
  tasks: { id: number; title: string; completed: boolean }[];
  // taskのタイトルを編集する際にどのtaskが選択されているか
  selectedTask: { id: number; title: string; completed: boolean };
  // modalを開くか開かないかの管理を行う
  isModalOpen: boolean;
}

const initialState: TaskState = {
  idCount: 0,
  tasks: [{ id: 0, title: "Task A", completed: false }],
  selectedTask: { id: 0, title: "", completed: false },
  isModalOpen: false,
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // taskの作成
    createTask: (state, action) => {
      state.idCount++;
      const newTask = {
        id: state.idCount,
        title: action.payload,
        completed: false,
      };
      state.tasks = [newTask, ...state.tasks];
    },
    // taskの編集
    editTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
      }
    },
    //どのタスクを選択しているか管理
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    // Modalを開くか閉じるかのフラグ管理
    handleModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    // task完了未完了のチェックを変更
    completeTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        // 抜き出したtaskの中身を反転
        task.completed = !task.completed;
      }
    },
  },
});

export const {
  createTask,
  editTask,
  handleModalOpen,
  selectTask,
  completeTask,
} = taskSlice.actions;

export const selectTasks = (state: RootState): TaskState["tasks"] =>
  state.task.tasks;

export const selectIsModalOpen = (state: RootState): TaskState["isModalOpen"] =>
  state.task.isModalOpen;

export const selectSelectedTask = (
  state: RootState
): TaskState["selectedTask"] => state.task.selectedTask;

export default taskSlice.reducer;
