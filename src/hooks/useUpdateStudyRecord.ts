import { useCallback } from "react";
import { updateStudyRecord } from "../libs/studyRecords";

export const useUpdateStudyRecord = () => {
  // 登録ボタン(編集モード)
  const onClickUpdate = useCallback(
    async (id: string, title: string, time: number): Promise<boolean> => {
      //
      if (title === "" || time === 0) {
        console.error("入力されていない項目があります");
        return false;
      }
      const { error } = await updateStudyRecord(id, title, time);
      if (error) {
        console.error("登録に失敗しました");
        return false;
      }
      return true;
    },
    []
  );

  return {
    onClickUpdate,
  };
};
