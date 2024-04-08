import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useMessage } from '../utils/hooks'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export const MessageDialog = () => {
  const {showDialog, closeDialog, message} = useMessage()
  return (
    <Dialog open={showDialog} onClose={closeDialog}>
      <DialogTitle>
        Message
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
