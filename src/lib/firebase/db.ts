// Firestore操作ロジック別にモックを作成する

import { addDoc, collection, doc, DocumentData, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * users コレクションに user を追加する関数
 */
export async function createUser(userData: {
    name: string;
    email: string;
    hobbies: string[];
}) {

    const colRef =collection(db, "users");
    const docRef = await addDoc(colRef, userData);
    return docRef.id; // 追加されたドキュメントのIDを返す／
}

/**
 * 指定した user document を更新する関数
 */
export async function updateUser(userId: string,userData: Partial<DocumentData>) {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, userData);
}
