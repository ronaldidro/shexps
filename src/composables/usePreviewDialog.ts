import { useDialog } from 'primevue'
import MovementPreview from '@/components/previews/MovementPreview.vue'

interface PreviewOptions {
  title: string
  data: Record<string, unknown>
  handleSave: () => Promise<boolean>
}

export const usePreviewDialog = () => {
  const dialog = useDialog()

  const openPreview = ({ title, data, handleSave }: PreviewOptions) =>
    dialog.open(MovementPreview, {
      props: {
        header: title,
        style: { width: '50vw' },
        breakpoints: { '960px': '75vw', '640px': '90vw' },
        modal: true,
      },
      data: { preview: data, handleSave },
    })

  return { openPreview }
}
