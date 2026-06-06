import { useDialog } from "primevue";
import MovementPreview from "@/components/previews/MovementPreview.vue";

export const usePreviewDialog = () => {
  const dialog = useDialog();

  const openPreview = ({
    title,
    data,
    handleSave,
  }: {
    title: string;
    data: unknown;
    handleSave: () => void;
  }) =>
    dialog.open(MovementPreview, {
      props: {
        header: title,
        style: { width: "50vw" },
        breakpoints: { "960px": "75vw", "640px": "90vw" },
        modal: true,
      },
      data,
      emits: { onSave: handleSave },
    });

  return { openPreview };
};
