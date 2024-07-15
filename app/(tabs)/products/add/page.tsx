"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];

    // Check if the file is an image
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
    ];
    if (!validImageTypes.includes(file.type)) {
      alert("이미지 파일이 아닙니다.");
      return;
    }

    // Check if the file size is less than 3MB
    const maxSizeInMB = 3;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert("3MB 이하의 이미지를 사용해주세요.");
      return;
    }

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    } else {
      alert("이미지 업로드에 실패했습니다");
      return;
    }

    // 브라우저에 올라간 이미지 메모리 주소URL
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const intercepAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      alert("게시물 생성에 실패했습니다.");
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    // 이미지 업로드
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      alert("게시물 생성에 실패했습니다.");
      return;
    }

    const photoUrl = `https://imagedelivery.net/S5EmZfh9mNC3-3xmENYiiA/${photoId}`;
    formData.set("photo", photoUrl);

    // uploadProduct에 return하는 것들이 있기 때문에 Return뒤에 넣어줘야됨
    return uploadProduct(_, formData);
  };
  const [state, action] = useFormState(intercepAction, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {!preview && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          )}
        </label>
        {/* label을 눌러도 input이 눌러지니까 숨김 */}
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
