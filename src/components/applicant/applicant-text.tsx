import { Box, Container, Typography } from '@mui/material'
import { FC } from 'react'


export const ApplicantText: FC<{text: string}> = ({ text }) => {
  return <Box>
    <hr />
    <Container>
      <Typography variant="body1" gutterBottom>
        {text}
      </Typography>
    </Container>
    <hr />
  </Box>
}