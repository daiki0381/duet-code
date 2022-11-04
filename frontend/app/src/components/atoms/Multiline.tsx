import type { NextPage } from 'next'
import TextField from '@mui/material/TextField'

type Props = {
  label: string
  placeholder: string
  rows: number
  field: any
  error: any
  helperText: any
}

const Multiline: NextPage<Props> = ({
  label,
  placeholder,
  rows,
  field,
  error,
  helperText,
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      rows={rows}
      multiline
      {...field}
      error={error}
      helperText={helperText}
      className="w-[800px]"
    />
  )
}

export default Multiline
