import { useState, useCallback } from 'react'
import { usePinContext } from '../context/PinContext'

/**
 * usePinFlow Hook - Orchestrates PIN modal flow before transactions
 * 
 * Manages which modal to show based on PIN state:
 * 1. If frozen → show FrozenAccountModal
 * 2. If no PIN set → show PinSetupModal
 * 3. If PIN is set → show PinPromptModal
 * 
 * Usage in a transfer component:
 * 
 *   const { triggerTransaction, showSetup, showPrompt, showFrozen, ... } = usePinFlow({
 *     onTransactionApproved: () => handleSubmit(),  // The actual transfer logic
 *     onFrozen: () => logout(),                      // What to do on frozen
 *   })
 *   
 *   <button onClick={triggerTransaction}>Send Money</button>
 *   
 *   {showSetup && <PinSetupModal isOpen={showSetup} ... />}
 *   {showPrompt && <PinPromptModal isOpen={showPrompt} ... />}
 *   {showFrozen && <FrozenAccountModal isOpen={showFrozen} ... />}
 * 
 * Props:
 *   onTransactionApproved  fn   Called when PIN verified - should submit transfer
 *   onFrozen               fn   Called when account is frozen
 */

export default function usePinFlow({ onTransactionApproved, onFrozen }) {
  const { pinState } = usePinContext()
  const [showSetup, setShowSetup] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showFrozen, setShowFrozen] = useState(false)

  /**
   * Main entry point - called when user clicks "Send Money"
   * Decides which modal to show based on PIN state
   */
  const triggerTransaction = useCallback(() => {
    console.log('[usePinFlow] triggerTransaction called, pinState:', pinState)

    // Priority 1: Check if frozen
    if (pinState.isFrozen) {
      console.log('[usePinFlow] Account is frozen, showing FrozenAccountModal')
      setShowFrozen(true)
      return
    }

    // Priority 2: Check if PIN is set
    if (!pinState.hasPinSet) {
      console.log('[usePinFlow] No PIN set, showing PinSetupModal')
      setShowSetup(true)
      return
    }

    // Priority 3: Show PIN prompt for existing PIN
    console.log('[usePinFlow] PIN is set, showing PinPromptModal')
    setShowPrompt(true)
  }, [pinState])

  /**
   * Callback when PIN setup succeeds
   * Transitions to PIN prompt modal
   */
  const handleSetupSuccess = useCallback(() => {
    console.log('[usePinFlow] PIN setup success')
    setShowSetup(false)
    // After setup, show prompt to verify the PIN
    setShowPrompt(true)
  }, [])

  /**
   * Callback when PIN verification succeeds
   * Close modals and execute transaction
   */
  const handlePinSuccess = useCallback(() => {
    console.log('[usePinFlow] PIN verification success')
    setShowPrompt(false)
    setShowSetup(false)
    // Call the actual transaction submission
    onTransactionApproved?.()
  }, [onTransactionApproved])

  /**
   * Callback when account gets frozen
   * Close prompt modal and show frozen modal
   */
  const handleFrozen = useCallback(() => {
    console.log('[usePinFlow] Account frozen callback')
    setShowPrompt(false)
    setShowSetup(false)
    setShowFrozen(true)
    // Let parent know account is frozen
    onFrozen?.()
  }, [onFrozen])

  return {
    triggerTransaction,
    showSetup,
    setShowSetup,
    showPrompt,
    setShowPrompt,
    showFrozen,
    setShowFrozen,
    handleSetupSuccess,
    handlePinSuccess,
    handleFrozen,
  }
}
