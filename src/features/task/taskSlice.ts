import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { db } from "../../firebase";

export interface TaskState {
  // taskが何個あるのかを管理するもの
  idCount: number;
  // 配列の中に以下のハッシュが入っているという形を作る
  tasks: { id: string; title: string; completed: boolean }[];
  // taskのタイトルを編集する際にどのtaskが選択されているか
  selectedTask: { id: string; title: string; completed: boolean };
  // modalを開くか開かないかの管理を行う
  isModalOpen: boolean;
}

const initialState: TaskState = {
  idCount: 0,
  tasks: [],
  selectedTask: { id: "", title: "", completed: false },
  isModalOpen: false,
};

// taskの全件取得
export const fetchTasks = createAsyncThunk("task/getAllTasks", async () => {
  const res = await db.collection("tasks").orderBy("dateTime", "desc").get();

  const allTasks = res.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    completed: doc.data().completed,
  }));

  const taskNumber = allTasks.length;
  const passData = { allTasks, taskNumber };
  return passData;
});

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
    // taskの削除
    deleteTask: (state, action) => {
      // 指定したtask以外で新しくstate.tasksの配列を作成し直している。
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
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
  // create async thunkの処理が完了したあとにはしる
  extraReducers: (builder) => {
    // stateとactionの型が正しく推論されるためにbuilder関数を用いる。
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      // action.payloadが return passDataだと思え。
      state.tasks = action.payload.allTasks;
      state.idCount = action.payload.taskNumber;
    });
  },
});

export const {
  createTask,
  editTask,
  handleModalOpen,
  selectTask,
  completeTask,
  deleteTask,
} = taskSlice.actions;

export const selectTasks = (state: RootState): TaskState["tasks"] =>
  state.task.tasks;

export const selectIsModalOpen = (state: RootState): TaskState["isModalOpen"] =>
  state.task.isModalOpen;

export const selectSelectedTask = (
  state: RootState
): TaskState["selectedTask"] => state.task.selectedTask;

export default taskSlice.reducer;
