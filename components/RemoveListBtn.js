"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveListBtn({id}){
  const router = useRouter();

  const handleRemoveList = async (e) => {
    e.preventDefault();
    await removeList();
  };

  const removeList = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`https://fictional-space-sniffle-jj99r9vggv4fj55g-3000.app.github.dev/api/list?id=${id}`, {
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