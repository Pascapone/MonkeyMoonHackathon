import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '@mui/material';
import { useEffect } from 'react';

const ToastManager = () => {

  const theme = useTheme()

  const notifyDisconnected = () => toast.warning("Wallet disconnected",{
    theme : theme.palette.mode
  })

  const notifyWrongNetwork = () => toast.error("Contract not deployed to this network. Please change to the Avalanche testnet chain.",{
    theme : theme.palette.mode
  })

  const notifyContractNotDeployed = () => toast.error("The contract is not yet deployed.",{
    theme : theme.palette.mode
  })

  const notifyWalletConnected = () => toast.success("Wallet successfully connected",{
    theme : theme.palette.mode
  }) 

  const notifyConnectionFailed = () => toast.error("The connection failed.",{
    theme : theme.palette.mode
  })   

  const notifyCopiedToClipboard = () => toast.info("Copied to clipboard",{
    theme : theme.palette.mode
  })

  const notifyNftMinted = () => toast.info("Nft successfully minted",{
    theme : theme.palette.mode
  })

  useEffect(() => {
    document.addEventListener('connected', notifyWalletConnected)
    document.addEventListener('disconnected', notifyDisconnected)
    document.addEventListener('connectionFailed', notifyConnectionFailed)
    document.addEventListener('contractNotDeployed', notifyContractNotDeployed)
    document.addEventListener('connectedToWrongNetwork', notifyWrongNetwork)
    document.addEventListener('copiedToClipboard', notifyCopiedToClipboard)
    document.addEventListener('nftMinted', notifyNftMinted)
    
    return () => {
      document.removeEventListener('connected', notifyWalletConnected)
      document.removeEventListener('disconnected', notifyDisconnected)
      document.removeEventListener('connectionFailed', notifyConnectionFailed)
      document.removeEventListener('contractNotDeployed', notifyContractNotDeployed)
      document.removeEventListener('connectedToWrongNetwork', notifyWrongNetwork)
      document.removeEventListener('copiedToClipboard', notifyCopiedToClipboard)
      document.removeEventListener('nftMinted', notifyNftMinted)
    }
  })

  return(
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        closeOnClick={false}
        pauseOnFocusLoss={false}
        pauseOnHover={true}
      />  
    </>
  )
}

export default ToastManager