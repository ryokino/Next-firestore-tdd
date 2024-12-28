import { User } from "./user"
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as dbModule from "@/lib/firebase/db"

// db.tsを丸ごとmock化する
jest.mock("@/lib/firebase/db", () => ({
    createUser: jest.fn()
}))

describe("UserComponent", () => {
    test("ユーザーの新規登録ができること", async () => {
        // 1. createUser 関数の mock を使って，返り値を定義する
        (dbModule.createUser as jest.Mock).mockResolvedValue("dummyUserId")

        // 2. 画面を描画する
        render(<User />)

        // 3. input 要素に値を入力
        fireEvent.change(screen.getByLabelText("名前"), {
            target: { value: "りょうちゃん" }
        })
        fireEvent.change(screen.getByLabelText("メールアドレス"), {
            target: { value: "ryo@example.com" }
        })
        fireEvent.change(screen.getByLabelText("趣味1"), {
            target: { value: "サッカー" }
        })

        // 4. 送信ボタンをクリック
        fireEvent.click(screen.getByRole("button", { name: "送信" }))

        // 5. createUser が正しく呼ばれたことを確認
        await waitFor(() => {
            expect(dbModule.createUser).toHaveBeenCalledTimes(1)
            expect(dbModule.createUser).toHaveBeenCalledWith({
                name: "りょうちゃん",
                email: "ryo@example.com",
                hobbies: ["サッカー"]
            })
        })
    })

    test("趣味の追加と削除ができること", async () => {
        render(<User />)

        // 最初の趣味を入力
        fireEvent.change(screen.getByLabelText("趣味1"), {
            target: { value: "サッカー" }
        })

        // 趣味を追加
        fireEvent.click(screen.getByRole("button", { name: "趣味を追加" }))

        // 2つ目の趣味を入力
        fireEvent.change(screen.getByLabelText("趣味2"), {
            target: { value: "野球" }
        })

        // 入力フィールドが2つあることを確認
        expect(screen.getByDisplayValue("サッカー")).toBeInTheDocument()
        expect(screen.getByDisplayValue("野球")).toBeInTheDocument()

        // 最初の趣味を削除
        const deleteButtons = screen.getAllByRole("button", { name: "削除" })
        fireEvent.click(deleteButtons[0])

        // サッカーが削除され、野球が残っていることを確認
        expect(screen.queryByDisplayValue("サッカー")).not.toBeInTheDocument()
        expect(screen.getByDisplayValue("野球")).toBeInTheDocument()
    })
})
