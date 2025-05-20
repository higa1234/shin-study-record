import { deleteStudyRecordById } from "../libs/studyRecords";

export const useDeleteStudyRecord = () => {
  // 削除ボタン
  const onClickDelete = async (id: string): Promise<boolean> => {
    //
    if (id === "") {
      console.error("id取得失敗");
      return false;
    }
    const { error } = await deleteStudyRecordById(id);
    if (error) {
      console.error("削除に失敗しました");
      return false;
    }
    return true;
  };

  return {
    onClickDelete,
  };
};
