import { useCallback } from "react";
import { insertStudyRecord } from "../libs/studyRecords";

export const useInputStudyRecord = () => {
  // 登録ボタン
  const onClickRegister = useCallback(
    async (title: string, time: number): Promise<boolean> => {
      //
      if (title === "" || time === 0) {
        console.error("入力されていない項目があります");
        return false;
      }
      const { error } = await insertStudyRecord(title, time);
      if (error) {
        console.error("登録に失敗しました");
        return false;
      }
      return true;
    },
    []
  );

  return {
    onClickRegister,
  };
};
