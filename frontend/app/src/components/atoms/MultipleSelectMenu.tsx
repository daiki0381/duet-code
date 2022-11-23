import type { NextPage } from 'next'
import { useState } from 'react'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import FormHelperText from '@mui/material/FormHelperText'

type Props = {
  label: string
  labelId: string
  field: any
  options: any
  error: boolean
  helperText: any
}

const MultipleSelectMenu: NextPage<Props> = ({
  label,
  labelId,
  field,
  options,
  error,
  helperText,
}) => {
  const [items, setItems] = useState<string[]>([])
  const handleChange = (event: SelectChangeEvent<typeof items>): void => {
    const {
      target: { value },
    } = event
    setItems(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <FormControl
      className="w-[300px] sm:w-[500px] md:w-[600px] lg:w-[800px]"
      error={error}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        multiple
        value={items}
        onChange={handleChange}
        {...field}
        input={<OutlinedInput label={label} />}
        renderValue={(selected: any) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value: any) => (
              <Chip key={value} label={value} variant="outlined" />
            ))}
          </Box>
        )}
      >
        {options.map((option: any) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default MultipleSelectMenu
