"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

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
      setValue(
        "photo",
        `https://imagedelivery.net/S5EmZfh9mNC3-3xmENYiiA/${id}`
      );
    } else {
      alert("이미지 업로드에 실패했습니다");
      return;
    }

    // 브라우저에 올라간 이미지 메모리 주소URL
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
  };

  const onSubmit = handleSubmit(async (data: ProductType) => {
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

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    // uploadProduct에 return하는 것들이 있기 때문에 Return뒤에 넣어줘야됨
    return uploadProduct(formData);
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
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
                {errors.photo?.message}
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
          accept="image/*"
          className="hidden"
        />
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          {...register("price")}
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
