import type { NextPage } from 'next'
import { useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'

type Props = {
  label: string
  labelId: string
  field: any
  options: any
  error: boolean
  helperText: any
}

const SelectMenu: NextPage<Props> = ({
  label,
  labelId,
  field,
  options,
  error,
  helperText,
}) => {
  const [value, setValue] = useState<string>('')
  const handleChange = (event: SelectChangeEvent): void => {
    setValue(event.target.value)
  }

  return (
    <FormControl
      className="w-[300px] sm:w-[500px] md:w-[600px] lg:w-[800px]"
      error={error}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={handleChange}
        {...field}
        disabled={options.length === 0}
      >
        {options.map((option: any) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
      {options.length === 0 && (
        <p className="mx-[14px] mt-[3px] text-xs text-error">
          Publicリポジトリにプルリクエストがありません
        </p>
      )}
    </FormControl>
  )
}

export default SelectMenu
