import { EleProps } from '../FormBuilder'

export interface CancelModalProps {
  params: any
  title?: string
  formfields: EleProps[]
  saveModalCallback: (arg: any) => void
  closeModalCallback: () => void
}
