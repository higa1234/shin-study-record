import App from "../App";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StudyRecord } from "../domain/studyRecords";

// モック初期
let mockGetAllStudyRecords = jest.fn();
let mockInsertStudyRecord = jest.fn();
let mockDeleteStudyRecordById = jest.fn();
let mockUpdateStudyRecord = jest.fn();

jest.mock("../libs/studyRecords", () => {
  return {
    getAllStudyRecords: () => mockGetAllStudyRecords(),
    insertStudyRecord: (title: string, time: number) =>
      mockInsertStudyRecord(title, time),
    deleteStudyRecordById: (id: string) => mockDeleteStudyRecordById(id),
    updateStudyRecord: (id: string, title: string, time: number) =>
      mockUpdateStudyRecord(id, title, time),
  };
});

// userEventの初期設定
const user = userEvent.setup();

// 毎回テスト開始前
beforeEach(() => {
  // モックの呼び出し回数や戻り値をリセット
  jest.clearAllMocks();
});

// 毎回テスト後
afterEach(() => {
  // 画面のクリーンアップ
  cleanup();
});

// ヘルパー関数（レンダーとloading待ちを共通化）
const renderAndWaitForTable = async () => {
  // コンポーネントを読み込み
  render(<App />);
  // loadingが終了し、テーブルが表示される
  await waitFor(() => {
    expect(screen.getByTestId("table")).toBeInTheDocument();
  });
};

describe("シン・学習記録アプリ-Jest", () => {
  test("ローディング画面をみることができる", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // テーブルが表示されるようになるのを待つ
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });

    // ローディングが消え、テーブルが表示されていることを確認
    expect(screen.getByTestId("table")).toBeInTheDocument();
  });

  test("テーブルをみることができる(リスト)", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // リストのレコード数を確認（2レコード)
    const studyRecords = screen.getByTestId("table").querySelectorAll("tr");
    expect(studyRecords.length - 1).toBe(2);
  });

  test("新規登録ボタンがある", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // 新規登録ボタンがあるかどうか確認
    const RegisterButton = screen.getByRole("button", { name: "新規登録" });
    expect(RegisterButton).toBeInTheDocument();
  });

  test("タイトルがある", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // タイトルがあるかどうか確認
    const appTitle = screen.getByRole("heading", {
      name: "シン・学習記録アプリ",
    });
    expect(appTitle).toBeInTheDocument();
  });

  test("登録できること", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      // 初回取得（初期データ）
      .mockResolvedValueOnce([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ])
      // 登録後に再取得する際のデータ
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
        new StudyRecord("3", "jest3", 3),
      ]);
    mockInsertStudyRecord = jest.fn().mockResolvedValue("");

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // モーダルを開く
    const openButton = screen.getByRole("button", { name: "新規登録" });
    await user.click(openButton);

    // 入力フォームに値を入れる
    await user.type(screen.getByPlaceholderText("学習内容"), "jest3");
    await user.type(screen.getByPlaceholderText("学習時間"), "3");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 登録が実行されたか
    await waitFor(() => {
      expect(mockInsertStudyRecord).toHaveBeenCalledTimes(1); // 回数
      expect(mockInsertStudyRecord).toHaveBeenCalledWith("jest3", 3); // 正しい引数か
    });

    // テーブルが2行→3行に増えることを確認（登録後）
    await waitFor(() => {
      const studyRecords = screen.getByTestId("table").querySelectorAll("tr");
      expect(studyRecords.length - 1).toBe(3);
    });
  });

  test("モーダルが新規登録というタイトルになっている", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // モーダルを開く
    const openButton = screen.getByRole("button", { name: "新規登録" });
    await user.click(openButton);

    // モーダルのタイトルが表示されることを確認
    const modalTitle = screen.getByTestId("modal-header");
    expect(modalTitle).toBeInTheDocument();
  });

  test("学習内容がないときに登録するとエラーがでる", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      // 初回取得（初期データ）
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);
    mockInsertStudyRecord = jest.fn().mockResolvedValue("");

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // モーダルを開く
    const openButton = screen.getByRole("button", { name: "新規登録" });
    await user.click(openButton);

    // // 入力フォームに値を入れる
    // await user.type(screen.getByPlaceholderText("学習内容"), "");
    await user.type(screen.getByPlaceholderText("学習時間"), "3");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();

    const studyTitleError = await screen.findByText("内容の入力は必須です");
    expect(studyTitleError).toBeInTheDocument();
  });

  test("学習時間がないときに登録するとエラーがでる（未入力のエラー）", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      // 初回取得（初期データ）
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);
    mockInsertStudyRecord = jest.fn().mockResolvedValue("");

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // モーダルを開く
    const openButton = screen.getByRole("button", { name: "新規登録" });
    await user.click(openButton);

    // 入力フォームに値を入れる
    await user.type(screen.getByPlaceholderText("学習内容"), "jest3");
    // await user.type(screen.getByPlaceholderText("学習時間"), "0");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();

    const studyTimeError = await screen.findByText("時間の入力は必須です");
    expect(studyTimeError).toBeInTheDocument();
  });

  test("学習時間がないときに登録するとエラーがでる（0以上でないときのエラー）", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      // 初回取得（初期データ）
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);
    mockInsertStudyRecord = jest.fn().mockResolvedValue("");

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // モーダルを開く
    const openButton = screen.getByRole("button", { name: "新規登録" });
    await user.click(openButton);

    // 入力フォームに値を入れる
    await user.type(screen.getByPlaceholderText("学習内容"), "jest3");
    await user.type(screen.getByPlaceholderText("学習時間"), "0");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();

    const studyTimeError =
      await screen.findByText("時間は0以上である必要があります");
    expect(studyTimeError).toBeInTheDocument();
  });

  test("削除ができること", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      // 初回取得（初期データ）
      .mockResolvedValueOnce([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
        new StudyRecord("3", "jest3", 3),
      ])
      .mockResolvedValueOnce([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);

    mockDeleteStudyRecordById = jest.fn().mockResolvedValue("");

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    console.log("呼び出し回数:", mockGetAllStudyRecords.mock.calls.length);

    await waitFor(() => {
      const rows = screen.getByTestId("table").querySelectorAll("tr");
      expect(rows.length - 1).toBe(3); // 初期状態は3件あるべき
    });

    // 削除ボタンがあるか
    const deleteButtons = screen.getAllByRole("button", { name: "削除" });

    // 削除ボタンを押す（3つあるうちの2つ目）
    await user.click(deleteButtons[2]);

    // 削除が実行されたか
    await waitFor(() => {
      expect(mockDeleteStudyRecordById).toHaveBeenCalledTimes(1); // 回数
      expect(mockDeleteStudyRecordById).toHaveBeenCalledWith("3"); // 正しい引数か
    });

    // テーブルが3行→2行に減ることを確認（削除後）
    await waitFor(() => {
      const rows = screen.getByTestId("table").querySelectorAll("tr");
      expect(rows.length - 1).toBe(2);
    });
  });

  test("モーダルが編集というタイトルになっている", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ]);

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // モーダル(編集モード)を開く
    const editButtons = screen.getAllByRole("button", { name: "編集" });

    // 編集ボタンを押す（一番上）
    await user.click(editButtons[0]);

    // モーダルのタイトルが表示されることを確認
    await waitFor(() => {
      const modalTitle = screen.getByTestId("modal-header");
      expect(modalTitle).toBeInTheDocument();
    });
  });

  test("編集できること", async () => {
    // モックの設定
    mockGetAllStudyRecords = jest
      .fn()
      // 初回取得（初期データ）
      .mockResolvedValueOnce([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2", 2),
      ])
      // 編集後に再取得する際のデータ
      .mockResolvedValue([
        new StudyRecord("1", "jest1", 1),
        new StudyRecord("2", "jest2Edited", 20),
      ]);
    mockUpdateStudyRecord = jest.fn().mockResolvedValue("");

    // レンダリング_ローディングが表示されることを確認
    await renderAndWaitForTable();

    // モーダルを開く 編集ボタンをクリック（一番上）
    const editButtons = screen.getAllByRole("button", { name: "編集" });
    await user.click(editButtons[1]);

    // 入力内容の確認
    expect(screen.getByDisplayValue("jest2")).toBeInTheDocument();
    expect(screen.getByDisplayValue(2)).toBeInTheDocument();

    // 入力内容のクリア
    await user.clear(screen.getByPlaceholderText("学習内容"));
    await user.clear(screen.getByPlaceholderText("学習時間"));

    // 入力フォームに値を入れる
    await user.type(screen.getByPlaceholderText("学習内容"), "jest2Edited");
    await user.type(screen.getByPlaceholderText("学習時間"), "20");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 編集モードでの登録が実行されたか
    await waitFor(() => {
      expect(mockUpdateStudyRecord).toHaveBeenCalledTimes(1); // 回数
      expect(mockUpdateStudyRecord).toHaveBeenCalledWith(
        "2",
        "jest2Edited",
        20
      ); // 正しい引数か
    });

    // 編集後の入力内容の確認
    await waitFor(() => {
      expect(screen.getByText("jest2Edited")).toBeInTheDocument();
      expect(screen.getByText(20)).toBeInTheDocument();
    });
  });
});
