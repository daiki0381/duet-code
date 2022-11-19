import type { NextPage } from 'next'
import TextField from '@mui/material/TextField'

type Props = {
  label?: string
  placeholder?: string
  rows: number
  width: string
  field: any
  error: any
  helperText: any
}

const Multiline: NextPage<Props> = ({
  label,
  placeholder,
  rows,
  width,
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
      className={width}
    />
  )
}

export default Multiline
