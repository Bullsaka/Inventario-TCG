"use client";

import { useRef } from "react";
import { deleteCardItem } from "@/app/inventory/actions";

type ConfirmDeleteFormProps = {
  id: string;
};

export default function ConfirmDeleteForm({
  id,
}: ConfirmDeleteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleDeleteClick() {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta carta? Esta acción no se puede deshacer."
    );

    if (!confirmed) {
      return;
    }

    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={deleteCardItem}>
      <input type="hidden" name="id" value={id} />

      <button
        type="button"
        onClick={handleDeleteClick}
        className="rounded-md border border-red-500 px-3 py-1 text-xs text-red-400 hover:bg-red-950/40"
      >
        Eliminar
      </button>
    </form>
  );
}
