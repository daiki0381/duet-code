import type { NextPage } from 'next'
import TextField from '@mui/material/TextField'

type Props = {
  label: string
  placeholder: string
  field: any
  error: any
  helperText: any
}

const TextInput: NextPage<Props> = ({
  label,
  placeholder,
  field,
  error,
  helperText,
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      {...field}
      error={error}
      helperText={helperText}
      className="w-[800px]"
    />
  )
}

export default TextInput
