import type { NextPage } from 'next'
import TextField from '@mui/material/TextField'

type Props = {
  label: string
  placeholder: string
  register: any
  error: any
  helperText: any
}

const TextInput: NextPage<Props> = ({
  label,
  placeholder,
  register,
  error,
  helperText,
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      {...register}
      error={error}
      helperText={helperText}
      className="w-[800px]"
      variant="filled"
    />
  )
}

export default TextInput
