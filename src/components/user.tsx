"use client"

import { createUser } from "@/lib/firebase/db";
import { useForm, useFieldArray } from "react-hook-form";

type FormData = {
    name: string;
    email: string;
    hobbies: { value: string }[];
}

export const User = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            hobbies: [{ value: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "hobbies"
    });

    // 送信時の処理
    const onSubmit = async (data: FormData) => {
        try {
            // hobbiesを文字列配列に変換
            const formattedData = {
                ...data,
                hobbies: data.hobbies.map(hobby => hobby.value)
            };
            await createUser(formattedData);
            alert("ユーザーを作成しました");
        }
        catch(error) {
            console.error(error);
            alert("ユーザー作成に失敗しました");
        }
    }

    return (
        <div>
            <h1>ユーザー管理</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">名前</label>
                    <input id="name" {...register("name", { required: true })} placeholder="名前" />
                    {errors.name && <p>名前は必須です</p>}
                </div>

                <div>
                    <label htmlFor="email">メールアドレス</label>
                    <input id="email" {...register("email", { required: true })} placeholder="メールアドレス" />
                    {errors.email && <p>メールアドレスは必須です</p>}
                </div>

                <div>
                    <label>趣味</label>
                    {fields.map((field, index) => (
                        <div key={field.id}>
                            <input
                                id={`hobbies.${index}.value`}
                                aria-label={`趣味${index + 1}`}
                                {...register(`hobbies.${index}.value` as const, { required: true })}
                                placeholder={`趣味${index + 1}`}
                            />
                            <button type="button" onClick={() => remove(index)}>削除</button>
                            {errors.hobbies?.[index]?.value && <p>趣味は必須です</p>}
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ value: '' })}>趣味を追加</button>
                </div>

                <button type="submit">送信</button>
            </form>
        </div>
    )
}
