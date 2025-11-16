"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import type { BookingDetailVO, BookingStatus } from "@/lib/services/booking-api"
import {
  useAcceptReturnMutation,
  useConfirmBookingMutation,
  useConfirmDepositMutation,
  useConfirmPickupMutation,
  useCustomerCancelBookingMutation,
  useOwnerCancelBookingMutation,
  useRejectReturnMutation,
  useRequestReturnMutation,
} from "@/lib/services/booking-api"
import { BookingActionDialog, type BookingActionFormValues } from "@/components/booking/booking-action-dialog"
import { BOOKING_STATUS_LABEL } from "@/lib/constants/booking-status"

export interface BookingActionCompletedPayload {
  booking: BookingDetailVO
}

interface BookingActionPanelProps {
  booking: BookingDetailVO
  role?: string | null
  onActionCompleted: (actionKey: ActionKey, payload: BookingActionCompletedPayload) => Promise<void> | void
  isRefreshing?: boolean
  disabled?: boolean
  initialActionKey?: ActionKey | null
  onInitialActionHandled?: () => void
}

type ActionRole = "customer" | "owner"
type NormalizedRole = ActionRole | null

export type ActionKey =
  | "customer_cancel"
  | "customer_confirm_pickup"
  | "customer_request_return"
  | "customer_return_again"
  | "owner_confirm_booking"
  | "owner_cancel_booking"
  | "owner_confirm_deposit"
  | "owner_accept_return"
  | "owner_reject_return"

interface ActionContext {
  booking: BookingDetailVO
  depositPaid: boolean
  now: Date
  status: BookingStatus | string
}

interface ActionMeta {
  key: ActionKey
  role: ActionRole
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  dialogTitle: string
  dialogDescription?: string
  submitLabel: string
  requiresPicture?: boolean
  requiresCharges?: boolean
  shouldHide?: (context: ActionContext) => boolean
  isDisabled?: (context: ActionContext) => boolean
  disabledMessage?: (context: ActionContext) => string | undefined
}

const ACTION_MATRIX: Record<BookingStatus, Partial<Record<ActionRole, ActionKey[]>>> = {
  waiting_confirmed: {
    customer: ["customer_cancel"],
    owner: ["owner_confirm_booking", "owner_cancel_booking"],
  },
  pending_payment: {
    customer: ["customer_request_return"],
  },
  pending_deposit: {
    customer: ["customer_cancel"],
    owner: ["owner_confirm_deposit", "owner_cancel_booking"],
  },
  confirmed: {
    customer: ["customer_confirm_pickup", "customer_cancel"],
    owner: ["owner_cancel_booking"],
  },
  in_progress: {
    customer: ["customer_request_return"],
  },
  waiting_confirm_return: {
    owner: ["owner_accept_return", "owner_reject_return"],
  },
  rejected_return: {
    customer: ["customer_return_again"],
  },
  completed: {},
  cancelled: {},
}

export function BookingActionPanel({
  booking,
  role,
  onActionCompleted,
  isRefreshing,
  disabled,
  initialActionKey,
  onInitialActionHandled,
}: BookingActionPanelProps) {
  const normalizedRole: NormalizedRole = role === "customer" ? "customer" : role === "car_owner" ? "owner" : null
  const normalizedStatus = (booking.status ?? "")?.toLowerCase?.() as BookingStatus
  const now = useMemo(() => new Date(), [booking.status])
  const depositPaid = Boolean(
    booking.depositPaid ??
    (typeof booking.depositStatus === "string" && booking.depositStatus.toLowerCase() === "paid")
  )

  const context: ActionContext = {
    booking,
    depositPaid,
    now,
    status: normalizedStatus,
  }

  const [currentAction, setCurrentAction] = useState<ActionMeta | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [customerCancel] = useCustomerCancelBookingMutation()
  const [confirmPickup] = useConfirmPickupMutation()
  const [requestReturn] = useRequestReturnMutation()
  const [confirmBooking] = useConfirmBookingMutation()
  const [ownerCancel] = useOwnerCancelBookingMutation()
  const [confirmDeposit] = useConfirmDepositMutation()
  const [acceptReturn] = useAcceptReturnMutation()
  const [rejectReturn] = useRejectReturnMutation()

  const actionMetas: Record<ActionKey, ActionMeta> = useMemo(() => ({
    customer_cancel: {
      key: "customer_cancel",
      role: "customer",
      label: "Cancel Booking",
      variant: "destructive",
      dialogTitle: "Cancel booking",
      dialogDescription: "Tell the owner why you need to cancel this booking.",
      submitLabel: "Cancel booking",
      shouldHide: ({ depositPaid, status }) => status === "pending_deposited" && depositPaid,
    },
    customer_confirm_pickup: {
      key: "customer_confirm_pickup",
      role: "customer",
      label: "Confirm Pickup",
      variant: "default",
      dialogTitle: "Confirm pickup",
      dialogDescription: "Confirm that you have picked up the vehicle.",
      submitLabel: "Confirm pickup",
      requiresPicture: true,
      isDisabled: ({ booking }) => {
        if (!booking.pickUpTime) return false
        return new Date(booking.pickUpTime) > new Date()
      },
      disabledMessage: ({ booking }) =>
        booking.pickUpTime ? `Available after ${new Date(booking.pickUpTime).toLocaleString()}` : undefined,
    },
    customer_request_return: {
      key: "customer_request_return",
      role: "customer",
      label: "Request Return",
      variant: "default",
      dialogTitle: "Request to return the car",
      dialogDescription: "Provide details and evidence for the return request.",
      submitLabel: "Request return",
      requiresPicture: true,
    },
    customer_return_again: {
      key: "customer_return_again",
      role: "customer",
      label: "Return Again",
      variant: "default",
      dialogTitle: "Request return again",
      dialogDescription: "Provide additional evidence for the return attempt.",
      submitLabel: "Submit request",
      requiresPicture: true,
    },
    owner_confirm_booking: {
      key: "owner_confirm_booking",
      role: "owner",
      label: "Confirm Booking",
      variant: "default",
      dialogTitle: "Confirm booking",
      dialogDescription: "Send a confirmation note to the customer.",
      submitLabel: "Confirm booking",
    },
    owner_cancel_booking: {
      key: "owner_cancel_booking",
      role: "owner",
      label: "Cancel Booking",
      variant: "destructive",
      dialogTitle: "Cancel booking",
      dialogDescription: "Share the reason for cancelling with the customer.",
      submitLabel: "Cancel booking",
    },
    owner_confirm_deposit: {
      key: "owner_confirm_deposit",
      role: "owner",
      label: "Confirm Deposit",
      variant: "default",
      dialogTitle: "Confirm deposit",
      dialogDescription: "Add a note for the customer confirming the deposit.",
      submitLabel: "Confirm deposit",
    },
    owner_accept_return: {
      key: "owner_accept_return",
      role: "owner",
      label: "Accept Return",
      variant: "default",
      dialogTitle: "Accept vehicle return",
      dialogDescription: "Review the return evidence and add any charges if needed.",
      submitLabel: "Accept return",
      requiresPicture: true,
      requiresCharges: true,
    },
    owner_reject_return: {
      key: "owner_reject_return",
      role: "owner",
      label: "Reject Return",
      variant: "destructive",
      dialogTitle: "Reject vehicle return",
      dialogDescription: "Provide a note and evidence explaining why the return is rejected.",
      submitLabel: "Reject return",
      requiresPicture: true,
    },
  }), [])

  const availableActions = useMemo(() => {
    if (!normalizedRole) return []
    const matrixEntry = ACTION_MATRIX[normalizedStatus] ?? {}
    const roleKey = normalizedRole as ActionRole
    const keys = matrixEntry[roleKey] ?? []
    return keys
      .map((key) => actionMetas[key])
      .filter(Boolean)
      .filter((meta) => !meta.shouldHide?.(context))
  }, [normalizedRole, normalizedStatus, actionMetas, context])

  const isExternallyDisabled = Boolean(disabled)
  const hasAvailableActions = Boolean(normalizedRole && availableActions.length)

  async function handleSubmit(values: BookingActionFormValues) {
    if (!currentAction) return
    setIsSubmitting(true)

    try {
      const actionKey = currentAction.key

      switch (actionKey) {
        case "customer_cancel": {
          await customerCancel({
            bookingNumber: booking.bookingNumber,
            reason: values.note,
            pictureUrl: values.pictureUrl ?? null,
          }).unwrap()
          toast({
            title: "Booking cancelled",
            description: "Your cancellation request has been sent.",
          })
          break
        }
        case "customer_confirm_pickup": {
          await confirmPickup({
            bookingNumber: booking.bookingNumber,
            note: values.note,
            pictureUrl: values.pictureUrl ?? null,
          }).unwrap()
          toast({
            title: "Pickup confirmed",
            description: "Enjoy your trip!",
          })
          break
        }
        case "customer_request_return":
        case "customer_return_again": {
          await requestReturn({
            bookingNumber: booking.bookingNumber,
            note: values.note,
            pictureUrl: values.pictureUrl ?? null,
          }).unwrap()
          toast({
            title: "Return requested",
            description: "The owner will review your return request shortly.",
          })
          break
        }
        case "owner_confirm_booking": {
          await confirmBooking({
            bookingNumber: booking.bookingNumber,
            note: values.note,
          }).unwrap()
          toast({
            title: "Booking confirmed",
            description: "The customer has been notified.",
          })
          break
        }
        case "owner_cancel_booking": {
          await ownerCancel({
            bookingNumber: booking.bookingNumber,
            note: values.note,
            pictureUrl: values.pictureUrl ?? null,
          }).unwrap()
          toast({
            title: "Booking cancelled",
            description: "The customer has been informed about the cancellation.",
          })
          break
        }
        case "owner_confirm_deposit": {
          await confirmDeposit({
            bookingNumber: booking.bookingNumber,
            note: values.note,
          }).unwrap()
          toast({
            title: "Deposit confirmed",
            description: "The customer has been notified that the deposit is received.",
          })
          break
        }
        case "owner_accept_return": {
          await acceptReturn({
            bookingNumber: booking.bookingNumber,
            note: values.note,
            pictureUrl: values.pictureUrl ?? null,
            chargesCents: values.chargesCents ?? 0,
          }).unwrap()
          toast({
            title: "Return accepted",
            description: "The booking status has been updated.",
          })
          break
        }
        case "owner_reject_return": {
          await rejectReturn({
            bookingNumber: booking.bookingNumber,
            note: values.note,
            pictureUrl: values.pictureUrl ?? null,
          }).unwrap()
          toast({
            title: "Return rejected",
            description: "The customer has been asked to provide more information.",
          })
          break
        }
        default:
          break
      }

      await onActionCompleted(actionKey, { booking })
      setDialogOpen(false)
      setCurrentAction(null)
    } catch (error: any) {
      const status = error?.status ?? error?.originalStatus
      const message = error?.data?.message ?? error?.message ?? "Something went wrong."
      toast({
        variant: status === 400 ? "destructive" : "default",
        title: "Action failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openAction = useCallback(
    (meta: ActionMeta) => {
      if (isExternallyDisabled) {
        return
      }

      if (meta.isDisabled?.(context)) {
        const reason = meta.disabledMessage?.(context)
        if (reason) {
          toast({
            title: BOOKING_STATUS_LABEL[normalizedStatus] ?? "Action unavailable",
            description: reason,
          })
        }
        return
      }
      setCurrentAction(meta)
      setDialogOpen(true)
    },
    [context, isExternallyDisabled, normalizedStatus]
  )

  const consumedInitialActionKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!initialActionKey) {
      consumedInitialActionKeyRef.current = null
      return
    }
    if (consumedInitialActionKeyRef.current === initialActionKey) {
      return
    }

    const meta = actionMetas[initialActionKey]
    if (!meta) {
      consumedInitialActionKeyRef.current = initialActionKey
      onInitialActionHandled?.()
      return
    }

    const isAvailable = availableActions.some((action) => action.key === initialActionKey)
    if (!isAvailable) {
      if (!availableActions.length) {
        return
      }
      consumedInitialActionKeyRef.current = initialActionKey
      onInitialActionHandled?.()
      return
    }

    openAction(meta)
    consumedInitialActionKeyRef.current = initialActionKey
    onInitialActionHandled?.()
  }, [initialActionKey, actionMetas, availableActions, openAction, onInitialActionHandled])

  if (!hasAvailableActions) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="hidden flex-wrap gap-2 md:flex">
        {availableActions.map((action) => {
          const disabledBase = action.isDisabled?.(context) ?? false
          const disabled = isSubmitting || isRefreshing || disabledBase || isExternallyDisabled
          const title = disabledBase ? action.disabledMessage?.(context) : undefined
          return (
            <Button
              key={action.key}
              variant={action.variant}
              size="sm"
              className="min-w-[150px]"
              onClick={() => openAction(action)}
              disabled={disabled}
              title={title}
            >
              {action.label}
            </Button>
          )
        })}
      </div>
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/95 p-3 shadow-lg md:hidden">
        <div className="flex flex-col gap-2">
          {availableActions.map((action) => {
            const disabledBase = action.isDisabled?.(context) ?? false
            const disabled = isSubmitting || isRefreshing || disabledBase || isExternallyDisabled
            const title = disabledBase ? action.disabledMessage?.(context) : undefined
            return (
              <Button
                key={`mobile-${action.key}`}
                variant={action.variant}
                size="sm"
                className="w-full"
                onClick={() => openAction(action)}
                disabled={disabled}
                title={title}
              >
                {action.label}
              </Button>
            )
          })}
        </div>
      </div>

      <BookingActionDialog
        open={dialogOpen && Boolean(currentAction)}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setCurrentAction(null)
          }
        }}
        title={currentAction?.dialogTitle ?? ""}
        description={currentAction?.dialogDescription}
        submitLabel={currentAction?.submitLabel ?? "Submit"}
        isSubmitting={isSubmitting}
        requiresPicture={currentAction?.requiresPicture}
        requiresCharges={currentAction?.requiresCharges}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
