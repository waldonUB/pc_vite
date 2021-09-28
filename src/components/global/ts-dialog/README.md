# ts-dialog

> props

```
dialogVisible => dialog-visible
dialogWidth => dialog-width
dialogSize => dialog-size
withTitle => with-title
withFooter => with-footer
withCancelBtn => with-cancel-btn
withResetBtn => with-reset-btn
sureBtnName => sure-btn-name
cancelBtnName => cancel-btn-name
resetBtnName => reset-btn-name
submitBtnDisabled => submit-btn-disabled
sureBtnLoading => sure-btn-loading
centered
closable
maskClosable => mask-closable
keyboard
zIndex => z-index
wrapClassName => wrap-class-name
lockDialogBodyHeight => lock-dialog-body-height
```

> slots

```
title
default
footer
```

> emits

```
sure
cancel
reset
getDialogVisible
```

# 迁移指南

## ts-wx-work-dialog

> props

```
dialogTitle => dialog-title
dialogWidth => dialog-width
dialogSize => dialog-size
sureName => sure-btn-name
cancelName => cancel-btn-name
resetName => reset-btn-name
withFooter => with-footer
tsDialogVisible => dialog-visible
withTitle => with-title
disabledSureBtn => submit-btn-disabled
withReset => with-reset-btn with-cancel-btn
appendToBody // remove
```

> slots

```
title
default
footer
```

> emits

```
sure
cancel
reset
```

## ts-fai-model

> porps

```
dialogTitle => dialog-title
dialogWidth => dialog-width
dialogSize => dialog-size
wrapClassName => wrap-class-name
zIndex => z-index
withFooter => with-footer
dialogVisible => dialog-visible
maskClosable => mask-closable
submitBtnDisabled => submit-btn-disabled
centered
closable
keyboard
mask // remove
isUseNormalFooter // remove，内部判断是否使用了footer slot
appendToBody // remove
```

> slots

```
default
footer
```

> emits

```
handleOk => sure
handleCancel => cancel
getDialogVisible
```
