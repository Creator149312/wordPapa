"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import apiConfig from "@utils/apiUrlConfig";

export default function RemoveListBtn({id}){
  const router = useRouter();

  const handleRemoveList = async (e) => {
    e.preventDefault();
    await removeList();
  };

  const removeList = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`${apiConfig.apiUrl}/list?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
       router.refresh();
      }
    }
  };

  return (
    <a onClick={handleRemoveList} >
      <HiOutlineTrash size={24} />
    </a>
  );
}